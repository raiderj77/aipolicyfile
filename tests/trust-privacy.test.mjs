import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ANALYTICS_CONSENT_DEFAULT,
  ANALYTICS_CONSENT_GRANTED,
  ANALYTICS_CONSENT_WITHDRAWN,
  buildAnalyticsPageContext,
  buildAnalyticsPageView,
  buildStarterFileBeginCheckout,
  createGtagCommandQueue,
  GA4_CONFIG,
  GA4_MEASUREMENT_ID,
} from "../src/lib/analytics.ts";
import { CORRECTIONS } from "../src/lib/corrections.ts";
import { LEGAL_REVIEW_DATE, NEXT_LEGAL_REVIEW_DUE } from "../src/lib/laws.ts";

import {
  buildTelegramMessage,
  MAX_WAITLIST_BODY_BYTES,
  parseWaitlistBody,
  readLimitedRequestBody,
  WAITLIST_CONSENT_NOTICE_VERSION,
  WAITLIST_RETENTION_RULE,
} from "../src/lib/waitlist.mjs";

const valid = {
  email: "person@example.com",
  role: "creator",
  worth: "free",
  source: "checker",
  website: "",
  consent: true,
};

test("waitlist requires explicit consent and rejects unexpected enum values", () => {
  assert.equal(parseWaitlistBody(JSON.stringify({ ...valid, consent: false })).ok, false);
  assert.equal(parseWaitlistBody(JSON.stringify({ ...valid, role: "lawyer" })).ok, false);
  assert.equal(parseWaitlistBody(JSON.stringify({ ...valid, source: "eu-ai" })).ok, false);
});

test("waitlist rejects bots, malformed JSON, and oversized bodies", () => {
  assert.equal(parseWaitlistBody(JSON.stringify({ ...valid, website: "spam" })).ok, false);
  assert.equal(parseWaitlistBody("{bad").status, 400);
  assert.equal(parseWaitlistBody("x".repeat(MAX_WAITLIST_BODY_BYTES + 1)).status, 413);
});

test("waitlist accepts only the documented fields", () => {
  const parsed = parseWaitlistBody(JSON.stringify(valid));
  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.data, {
    email: valid.email,
    role: valid.role,
    worth: valid.worth,
    source: valid.source,
  });
  const message = buildTelegramMessage(parsed.data, new Date("2026-08-29T12:00:00.000Z"));
  assert.match(message, /email: person@example\.com/);
  assert.match(message, /submitted_at_utc: 2026-08-29T12:00:00\.000Z/);
  assert.match(message, new RegExp(`consent_notice_version: ${WAITLIST_CONSENT_NOTICE_VERSION}`));
  assert.match(message, /retention_due_utc: 2027-08-29T12:00:00\.000Z/);
  assert.match(message, new RegExp(`retention_rule: ${WAITLIST_RETENTION_RULE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  assert.equal(parseWaitlistBody(JSON.stringify({ ...valid, unexpected: "discard me" })).ok, false);
  assert.equal(parseWaitlistBody("null").ok, false);
});

test("waitlist stops reading request bodies at the byte limit", async () => {
  const accepted = await readLimitedRequestBody(
    new Request("https://aipolicyfile.com/api/waitlist", {
      method: "POST",
      body: "x".repeat(MAX_WAITLIST_BODY_BYTES),
    }),
  );
  assert.equal(accepted.ok, true);
  assert.equal(accepted.text.length, MAX_WAITLIST_BODY_BYTES);

  const rejected = await readLimitedRequestBody(
    new Request("https://aipolicyfile.com/api/waitlist", {
      method: "POST",
      body: "x".repeat(MAX_WAITLIST_BODY_BYTES + 1),
    }),
  );
  assert.deepEqual(rejected, { ok: false, status: 413 });
});

test("route never logs waitlist content or Telegram errors", async () => {
  const route = await readFile(new URL("../src/app/api/waitlist/route.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../src/components/WaitlistForm.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(route, /console\.|request\.json/);
  assert.doesNotMatch(route, /request\.text/);
  assert.match(route, /readLimitedRequestBody\(request\)/);
  assert.match(route, /AbortSignal\.timeout\(TELEGRAM_TIMEOUT_MS\)/);
  assert.match(route, /status: 503/);
  assert.match(route, /protect_content: true/);
  assert.match(route, /origin !== new URL\(request\.url\)\.origin/);
  assert.ok(
    route.indexOf("origin !== new URL(request.url).origin") < route.indexOf("readLimitedRequestBody(request)"),
    "cross-site requests must be rejected before their body is read",
  );
  assert.match(form, /referrerPolicy: "no-referrer"/);
  assert.match(form, /credentials: "same-origin"/);
});

test("checker uses screening labels rather than legal conclusions", async () => {
  const checker = await readFile(new URL("../src/app/checker/CheckerClient.tsx", import.meta.url), "utf8");
  const home = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  assert.match(checker, /Possible relevance/);
  assert.match(checker, /does not determine jurisdiction/);
  assert.doesNotMatch(`${checker}\n${home}`, /Action needed|exactly what to do|laws need action/);
});

test("checker result printing stays local and isolates the educational result", async () => {
  const checker = await readFile(new URL("../src/app/checker/CheckerClient.tsx", import.meta.url), "utf8");
  assert.match(checker, /window\.print\(\)/);
  assert.match(checker, /data-printable-results/);
  assert.match(checker, /Print Results/);
  assert.doesNotMatch(checker, /sendBeacon|localStorage|sessionStorage/);
});

test("known false legal claims do not return", async () => {
  const files = await Promise.all(
    ["../src/lib/laws.ts", "../src/lib/lawPages.ts"].map((path) =>
      readFile(new URL(path, import.meta.url), "utf8"),
    ),
  );
  const legalCopy = files.join("\n");
  assert.doesNotMatch(legalCopy, /updated AI disclosure guidance was issued in May 2026/i);
  assert.doesNotMatch(legalCopy, /August 2, 2026 to align with the EU AI Act/i);
  assert.doesNotMatch(legalCopy, /both disclosures (?:are|apply|must)/i);
  assert.doesNotMatch(legalCopy, /compliance with the standard meets requirements/i);
  assert.doesNotMatch(legalCopy, /penalties could add up/i);
  assert.doesNotMatch(legalCopy, /has no impact on you/i);
  assert.doesNotMatch(legalCopy, /the law applies the same way/i);
  assert.match(legalCopy, /AB 853/);
  assert.match(legalCopy, /operative August 2, 2026/);
  assert.doesNotMatch(legalCopy, /chapter became operative January 1, 2026/i);
  assert.match(legalCopy, /eur-lex\.europa\.eu/);
});

test("every legal framework page stays substantial and links a primary source", async () => {
  const [pages, laws, pageRoute] = await Promise.all([
    readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/laws.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/app/laws/[slug]/page.tsx", import.meta.url), "utf8"),
  ]);
  for (const lawId of ["ftc", "euArt50", "nySynthetic", "caBot", "caSb942"]) {
    assert.match(pages, new RegExp(`lawId: "${lawId}"`));
  }
  assert.match(laws, /ftc\.gov/);
  assert.match(laws, /eur-lex\.europa\.eu/);
  assert.match(laws, /nysenate\.gov/);
  assert.match(laws, /governor\.ny\.gov/);
  assert.match(laws, /leginfo\.legislature\.ca\.gov/);
  assert.match(pageRoute, /law\.officialSources\.map/);
  assert.ok((pages.match(/heading:/g) ?? []).length >= 20);
  assert.ok((pages.match(/q:/g) ?? []).length >= 20);
});

test("legal review dates are bounded and overdue status propagates to every output", async () => {
  const publicPaths = [
    "../src/app/page.tsx",
    "../src/app/checker/CheckerClient.tsx",
    "../src/app/answers/[slug]/page.tsx",
    "../src/app/laws/[slug]/page.tsx",
    "../src/app/tracker/page.tsx",
    "../src/app/editorial-standards/page.tsx",
    "../src/app/disclaimer/page.tsx",
    "../src/components/SourceReviewNotice.tsx",
    "../src/lib/lawTracker.ts",
    "../src/lib/llmsText.ts",
  ];
  const monitoringPaths = [
    "../scripts/check-legal-review-deadline.mjs",
    "../.github/workflows/legal-freshness.yml",
  ];
  const laws = await readFile(new URL("../src/lib/laws.ts", import.meta.url), "utf8");
  const publicConsumers = await Promise.all(
    publicPaths.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const monitoringConsumers = await Promise.all(
    monitoringPaths.map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const reviewed = LEGAL_REVIEW_DATE;
  const due = NEXT_LEGAL_REVIEW_DUE;
  assert.match(reviewed, /^\d{4}-\d{2}-\d{2}$/, "LEGAL_REVIEW_DATE must be registered");
  assert.match(due, /^\d{4}-\d{2}-\d{2}$/, "NEXT_LEGAL_REVIEW_DUE must be registered");
  assert.match(laws, /findLegalReviewRecord\(LEGAL_REVIEW_RECORD_ID\)/);
  const reviewedAt = Date.parse(`${reviewed}T00:00:00Z`);
  const dueAt = Date.parse(`${due}T23:59:59Z`);
  assert.match(laws, /getLegalReviewStatus/);
  for (const [index, consumer] of publicConsumers.entries()) {
    assert.match(
      consumer,
      /SourceReviewNotice|SOURCE REVIEW OVERDUE|getLegalReviewStatus/,
      `${publicPaths[index]} must inherit the overdue state`,
    );
  }
  assert.match(
    publicConsumers[publicPaths.indexOf("../src/lib/lawTracker.ts")],
    /Source review overdue/i,
  );
  assert.match(
    publicConsumers[publicPaths.indexOf("../src/lib/llmsText.ts")],
    /SOURCE REVIEW OVERDUE/,
  );
  assert.match(monitoringConsumers[0], /SOURCE REVIEW OVERDUE/);
  assert.match(monitoringConsumers.join("\n"), /check-legal-review-deadline|check:legal-freshness/);
  assert.doesNotMatch(
    [...publicConsumers, ...monitoringConsumers].join("\n"),
    /July 13, 2026|2026-07-13/,
  );
  assert.ok(dueAt >= reviewedAt, "next review cannot predate the completed review");
  assert.ok(
    dueAt - reviewedAt <= 31 * 24 * 60 * 60 * 1000,
    "legal review cadence must remain monthly or faster",
  );
});

test("material legal corrections are structured, versioned, and publicly rendered", async () => {
  const page = await readFile(new URL("../src/app/corrections/page.tsx", import.meta.url), "utf8");
  assert.equal(CORRECTIONS.length, 3);
  assert.deepEqual(
    new Set(CORRECTIONS.map((correction) => correction.frameworkId)),
    new Set(["nySynthetic", "caBot", "euArt50"]),
  );
  for (const correction of CORRECTIONS) {
    assert.match(correction.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(correction.priorInformation.length > 20);
    assert.ok(correction.correctedInformation.length > 20);
    assert.ok(correction.officialSources.length > 0);
    assert.ok(correction.affectedCheckerVersions.length > 0);
    assert.match(correction.reviewer, /no attorney review claimed/i);
    assert.equal(correction.status, "corrected-review-overdue");
  }
  assert.match(page, /CORRECTIONS\.map/);
  assert.match(page, /correction\.status === "corrected-review-overdue"/);
  assert.match(page, /Affected checker versions/);
  assert.match(page, /Generated documents and users/);
});

test("privacy wording matches verified waitlist and analytics retention controls", async () => {
  const [privacy, inventory] = await Promise.all([
    readFile(new URL("../src/app/privacy/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/data-inventory.md", import.meta.url), "utf8"),
  ]);
  assert.match(privacy, /requires affirmative consent/);
  assert.match(privacy, /version of the consent notice/);
  assert.match(privacy, /365-day auto-delete setting.*verified on August\s+29, 2026/s);
  assert.match(privacy, /timer is not.*retroactive/s);
  assert.doesNotMatch(privacy, /no independently verified automated deletion timer/);
  assert.match(privacy, /Telegram Bot API/);
  assert.match(privacy, /Vercel hosts the site/);
  assert.match(privacy, /Namecheap/);
  for (const term of ["Checker answers", "Waitlist email", "GA4", "Vercel", "Contact email"]) {
    assert.match(inventory, new RegExp(term));
  }
  assert.match(inventory, /365-day timer production-verified/);
  assert.match(inventory, /timer is not retroactive/);
  assert.match(inventory, /G-MEY1Y9KDNJ/);
  assert.match(inventory, /Event data: 2 months; user data: 2 months/);
  assert.match(inventory, /disallowed in all 307 regions/);
  assert.match(privacy, /dedicated AI Policy File property/);
  assert.match(privacy, /Enhanced[\s\S]*Measurement disabled/);
  assert.match(privacy, /event and user data retention are both set to two months/);
  assert.match(privacy, /Google Signals and user-provided data collection[\s\S]*off/);
  assert.doesNotMatch(
    `${privacy}\n${inventory}`,
    /not yet been independently verified|Account-side retention is unverified|verify GA4 retention and Enhanced Measurement/i,
  );
});

test("baseline browser security headers remain configured", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  for (const header of [
    "Content-Security-Policy",
    "Referrer-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Permissions-Policy",
  ]) {
    assert.match(config, new RegExp(header));
  }
  assert.doesNotMatch(config, /unsafe-eval/);
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(
    config,
    /img-src 'self' data: blob: https:\/\/\*\.google-analytics\.com https:\/\/www\.googletagmanager\.com/,
  );
  assert.match(
    config,
    /connect-src 'self' https:\/\/\*\.google-analytics\.com https:\/\/\*\.analytics\.google\.com https:\/\/www\.googletagmanager\.com/,
  );
  assert.doesNotMatch(config, /doubleclick|googlesyndication/);
});

test("analytics runtime configuration strips queries and denies advertising data", () => {
  assert.equal(GA4_MEASUREMENT_ID, "G-MEY1Y9KDNJ");
  const dataLayer = [];
  const queuedGtag = createGtagCommandQueue(dataLayer);
  queuedGtag("config", GA4_MEASUREMENT_ID, GA4_CONFIG);
  assert.equal(dataLayer.length, 1);
  assert.equal(Array.isArray(dataLayer[0]), false);
  assert.deepEqual(Array.from(dataLayer[0]), ["config", GA4_MEASUREMENT_ID, GA4_CONFIG]);
  assert.deepEqual(
    buildAnalyticsPageView(
      "https://aipolicyfile.com/checker?apf_probe=synthetic-canary#private-fragment",
      "AI Disclosure Law Checker",
      "https://search.example/results?private=synthetic-canary#fragment",
    ),
    {
      page_location: "https://aipolicyfile.com/checker",
      page_path: "/checker",
      page_referrer: "https://search.example/results",
      page_title: "AI Disclosure Law Checker",
    },
  );
  for (const referrer of ["", "not a URL", "android-app://com.example.app"]) {
    assert.deepEqual(
      buildAnalyticsPageContext("https://aipolicyfile.com/?secret=yes", referrer),
      {
        page_location: "https://aipolicyfile.com/",
        page_path: "/",
        page_referrer: "",
      },
    );
  }
  assert.deepEqual(GA4_CONFIG, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  assert.deepEqual(buildStarterFileBeginCheckout(), {
    currency: "USD",
    value: 19,
    items: [
      {
        item_id: "ai-disclosure-starter-file-v1",
        item_name: "AI Disclosure Starter File",
        price: 19,
        quantity: 1,
      },
    ],
  });
  assert.equal(ANALYTICS_CONSENT_DEFAULT.analytics_storage, "denied");
  assert.equal(ANALYTICS_CONSENT_GRANTED.analytics_storage, "granted");
  for (const consent of [
    ANALYTICS_CONSENT_DEFAULT,
    ANALYTICS_CONSENT_GRANTED,
    ANALYTICS_CONSENT_WITHDRAWN,
  ]) {
    assert.equal(consent.ad_storage, "denied");
    assert.equal(consent.ad_user_data, "denied");
    assert.equal(consent.ad_personalization, "denied");
  }
});

test("analytics is opt-in and excludes checker and form content", async () => {
  const [analytics, analyticsConfig, starterPurchase] = await Promise.all([
    readFile(new URL("../src/components/AnalyticsConsent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/analytics.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/components/StarterFilePurchase.tsx", import.meta.url), "utf8"),
  ]);
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../src/app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(layout, /<AnalyticsConsent \/>/);
  assert.match(analytics, /consent !== "granted"/);
  assert.match(analytics, /"consent", "default", ANALYTICS_CONSENT_DEFAULT/);
  assert.match(analytics, /"consent", "update", ANALYTICS_CONSENT_GRANTED/);
  assert.match(analyticsConfig, /dataLayer\.push\(arguments\)/);
  assert.doesNotMatch(analyticsConfig, /dataLayer\.push\(args\)/);
  assert.match(analytics, /CONFIGURED_KEY/);
  assert.equal(analytics.match(/enableAnalytics\(\);/g)?.length, 1);
  assert.match(analyticsConfig, /G-MEY1Y9KDNJ/);
  assert.doesNotMatch(`${analytics}\n${analyticsConfig}`, /G-D97F0H17CL/);
  assert.match(analyticsConfig, /send_page_view: false/);
  assert.match(analyticsConfig, /page_location: `\$\{url\.origin\}\$\{url\.pathname\}`/);
  assert.match(analytics, /"set", pageContext/);
  assert.match(analytics, /"set", initialPageContext/);
  assert.match(analytics, /"config", GA4_MEASUREMENT_ID, GA4_CONFIG/);
  assert.doesNotMatch(analytics, /"config", GA4_MEASUREMENT_ID, \{/);
  assert.match(analytics, /Enhanced Measurement and granular/);
  assert.match(
    analytics,
    /Google Signals, user-provided data, and\s+advertising personalization are/,
  );
  assert.match(analytics, /live Starter File purchase-link click/);
  assert.match(analytics, /never the checkout URL, order, customer, payment, or\s+worksheet data/);
  assert.doesNotMatch(analytics, /FormData|request\.json|WaitlistForm|CheckerClient/);
  assert.match(starterPurchase, /ga-disable-\$\{GA4_MEASUREMENT_ID\}/);
  assert.match(starterPurchase, /!== false\) return/);
  assert.match(starterPurchase, /"event", "begin_checkout", buildStarterFileBeginCheckout\(\)/);
  assert.match(privacy, /does\s+not send checker answers/);
  assert.match(privacy, /begin_checkout/);
  assert.match(privacy, /does not include the checkout URL, order data, worksheet/);
  assert.match(privacy, /script is not downloaded/);
});

test("site publishes the Search Console ownership tag", async () => {
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /verification:\s*{\s*google:\s*"[^"]+"/s);
});

test("public trust copy and contrast safeguards remain in place", async () => {
  const [layout, home, about, waitlist, checker] = await Promise.all(
    [
      "../src/app/layout.tsx",
      "../src/app/page.tsx",
      "../src/app/about/page.tsx",
      "../src/components/WaitlistForm.tsx",
      "../src/app/checker/CheckerClient.tsx",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const publicCopy = [layout, home, about, waitlist, checker].join("\n");
  assert.doesNotMatch(publicCopy, /text-slate-400|placeholder-slate-400/);
  assert.doesNotMatch(publicCopy, /in two minutes|lock in founding-member pricing/i);
  assert.match(layout, /<Link href="\/about" className="underline hover:text-slate-900">/);
  assert.match(home, /\$19 one-time/i);
  assert.match(home, /Checkout stays closed/i);
});
