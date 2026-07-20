import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildTelegramMessage,
  MAX_WAITLIST_BODY_BYTES,
  parseWaitlistBody,
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
  assert.match(buildTelegramMessage(parsed.data), /email: person@example\.com/);
});

test("route never logs waitlist content or Telegram errors", async () => {
  const route = await readFile(new URL("../src/app/api/waitlist/route.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../src/components/WaitlistForm.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(route, /console\.|request\.json/);
  assert.match(route, /request\.text/);
  assert.match(route, /status: 503/);
  assert.match(route, /origin !== new URL\(request\.url\)\.origin/);
  assert.ok(
    route.indexOf("origin !== new URL(request.url).origin") < route.indexOf("await request.text()"),
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
  assert.match(legalCopy, /January 1, 2026/);
  assert.match(legalCopy, /eur-lex\.europa\.eu/);
});

test("every legal framework page stays substantial and links a primary source", async () => {
  const pages = await readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8");
  for (const lawId of ["ftc", "euArt50", "nySynthetic", "caBot", "caSb942"]) {
    assert.match(pages, new RegExp(`lawId: "${lawId}"`));
  }
  assert.match(pages, /ftc\.gov/);
  assert.match(pages, /eur-lex\.europa\.eu/);
  assert.match(pages, /nysenate\.gov/);
  assert.match(pages, /leginfo\.legislature\.ca\.gov/);
  assert.match(pages, /2026-07-13/);
  assert.ok((pages.match(/heading:/g) ?? []).length >= 20);
  assert.ok((pages.match(/q:/g) ?? []).length >= 20);
});

test("privacy wording matches waitlist code and manual retention", async () => {
  const privacy = await readFile(new URL("../src/app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(privacy, /requires affirmative consent/);
  assert.doesNotMatch(privacy, /record your affirmative consent/);
  assert.match(privacy, /no automated deletion timer/);
  assert.match(privacy, /Telegram Bot API/);
  assert.match(privacy, /Vercel hosts the site/);
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
});

test("analytics is opt-in and excludes checker and form content", async () => {
  const analytics = await readFile(new URL("../src/components/AnalyticsConsent.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const privacy = await readFile(new URL("../src/app/privacy/page.tsx", import.meta.url), "utf8");
  assert.match(layout, /<AnalyticsConsent \/>/);
  assert.match(analytics, /consent !== "granted"/);
  assert.match(analytics, /send_page_view: false/);
  assert.match(analytics, /page_location: `\$\{window\.location\.origin\}\$\{window\.location\.pathname\}`/);
  assert.doesNotMatch(analytics, /FormData|request\.json|WaitlistForm|CheckerClient/);
  assert.match(privacy, /does not send checker answers/);
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
  assert.match(home, /planned product would be worth to you/i);
});
