import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function read(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("global discovery metadata and accessible navigation stay complete", async () => {
  const layout = await read("../src/app/layout.tsx");
  assert.match(layout, /applicationName: "AI Policy File"/);
  assert.match(layout, /authors: \[\{ name: "Jason Ramirez", url: "\/about" \}\]/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /google-adsense-account/);
  assert.match(layout, /"@type": "Organization"/);
  assert.match(layout, /"@type": "WebSite"/);
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content">/);
  assert.match(layout, /aria-label="Primary"/);
});

test("indexable support pages publish route-specific social metadata", async () => {
  const [helper, ...pages] = await Promise.all([
    read("../src/lib/siteMetadata.ts"),
    read("../src/app/checker/page.tsx"),
    read("../src/app/about/page.tsx"),
    read("../src/app/privacy/page.tsx"),
    read("../src/app/contact/page.tsx"),
    read("../src/app/disclaimer/page.tsx"),
    read("../src/app/terms/page.tsx"),
    read("../src/app/editorial-standards/page.tsx"),
  ]);
  assert.match(helper, /openGraph/);
  assert.match(helper, /twitter/);
  assert.match(helper, /summary_large_image/);
  assert.match(helper, /opengraph-image/);
  for (const page of pages) assert.match(page, /pageSocialMetadata\(/);
});

test("legal guides publish sanitized source-backed Article data", async () => {
  const [page, serializer] = await Promise.all([
    read("../src/app/laws/[slug]/page.tsx"),
    read("../src/lib/jsonLd.ts"),
  ]);
  assert.match(page, /"@type": "Article"/);
  assert.match(page, /dateModified: LEGAL_REVIEW_DATE/);
  assert.match(page, /image: "https:\/\/aipolicyfile\.com\/opengraph-image"/);
  assert.match(page, /citation: page\.sources\.map/);
  assert.match(page, /about#jason-ramirez/);
  assert.doesNotMatch(page, /dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify/);
  assert.match(serializer, /replace\(\/<\/g, "\\\\u003c"\)/);
});

test("editorial standards expose the real author and review boundary", async () => {
  const [editorial, about, sitemap] = await Promise.all([
    read("../src/app/editorial-standards/page.tsx"),
    read("../src/app/about/page.tsx"),
    read("../src/app/sitemap.ts"),
  ]);
  assert.match(editorial, /Jason Ramirez/);
  assert.match(editorial, /not an attorney/i);
  assert.match(editorial, /Source hierarchy/);
  assert.match(editorial, /Material review log/);
  assert.match(editorial, /Regulation \(EU\) 2026\/1744/);
  assert.match(about, /editorial standards, source-review method, and material review log/);
  assert.match(sitemap, /editorial-standards/);
});

test("the linkable tracker is source-backed, downloadable, and non-conclusive", async () => {
  const [tracker, csvRoute, csvBuilder, sitemap] = await Promise.all([
    read("../src/app/tracker/page.tsx"),
    read("../src/app/downloads/ai-disclosure-law-tracker.csv/route.ts"),
    read("../src/lib/lawTracker.ts"),
    read("../src/app/sitemap.ts"),
  ]);
  assert.match(tracker, /"@type": "Dataset"/);
  assert.match(tracker, /"@type": "DataDownload"/);
  assert.match(tracker, /Regulation \(EU\) 2026\/1744/);
  assert.match(tracker, /California AB 853 amendment/);
  assert.match(tracker, /SB 1000 is not current law/);
  assert.match(tracker, /does not decide which law/);
  assert.match(csvRoute, /Content-Disposition/);
  assert.match(csvRoute, /Content-Type.*text\/csv/);
  assert.match(csvBuilder, /Object\.values\(LAWS\)/);
  assert.match(csvBuilder, /LEGAL_REVIEW_DATE/);
  assert.match(csvBuilder, /\^\[=\+\\-@\]/);
  assert.match(sitemap, /`\$\{BASE\}\/tracker`/);
});

test("analytics disclosure matches standard GA processing and stays non-modal", async () => {
  const [consent, privacy] = await Promise.all([
    read("../src/components/AnalyticsConsent.tsx"),
    read("../src/app/privacy/page.tsx"),
  ]);
  for (const term of ["session", "referrer", "browser", "device", "approximate-location"]) {
    assert.match(consent, new RegExp(term));
  }
  assert.match(consent, /role="region"/);
  assert.doesNotMatch(consent, /role="dialog"/);
  assert.doesNotMatch(consent, /receives only/i);
  assert.match(consent, /automatic page-view, scroll, outbound-link, file-download, and form-interaction events/);
  assert.doesNotMatch(consent, /Query strings.*excluded/i);
  assert.match(privacy, /IP addresses are used to derive location before being discarded/);
  assert.match(privacy, /support\.google\.com\/analytics\/answer\/11593727/);
  assert.match(privacy, /developers\.google\.com\/analytics\/devguides\/collection\/ga4\/views/);
  assert.match(privacy, /support\.google\.com\/analytics\/answer\/9216061/);
  assert.match(privacy, /browser-history[\s\S]*query string/);
  assert.doesNotMatch(privacy, /enhanced measurement (?:is|are) disabled/i);
  assert.match(privacy, /Jason Ramirez[\s\S]*controller/);
  assert.match(privacy, /founding-list processing[\s\S]*rely on your consent/);
  assert.match(privacy, /legitimate interests/);
  assert.match(privacy, /standard contractual clauses/);
  assert.match(privacy, /access, correction, deletion, restriction, or portability/);
  assert.match(privacy, /lodge a complaint/);
  assert.match(privacy, /automated[\s\S]*legal or similarly significant effects/);
  assert.match(privacy, /eur-lex\.europa\.eu\/eli\/reg\/2016\/679\/oj/);
});

test("dependency, CI, and canonical-host controls cover the full release", async () => {
  const [pkg, ci, freshness, config] = await Promise.all([
    read("../package.json"),
    read("../.github/workflows/ci.yml"),
    read("../.github/workflows/legal-freshness.yml"),
    read("../next.config.ts"),
  ]);
  assert.match(pkg, /"brace-expansion@<2": "1\.1\.18"/);
  assert.match(pkg, /"brace-expansion": "5\.0\.9"/);
  assert.match(ci, /npm audit --audit-level=high/);
  assert.doesNotMatch(ci, /audit --omit=dev/);
  assert.match(freshness, /name: Legal review deadline/);
  assert.match(freshness, /cron: "19 15 \* \* \*"/);
  assert.match(config, /aipolicyfile\.vercel\.app/);
  assert.match(config, /www\.aipolicyfile\.com/);
  assert.match(config, /destination: "https:\/\/aipolicyfile\.com\/:path\*"/);
});
