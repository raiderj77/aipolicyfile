import assert from "node:assert/strict";
import test from "node:test";
import { hasCaliforniaSigningAnnouncement } from "../scripts/california-signing-status.mjs";
import { CA_SIGNING_NOTICE, evaluate, LAWS } from "../src/lib/laws.ts";

test("announcement monitor requires both bills in the signed legislation list", () => {
  const heading = "<h2>Governor Newsom today signed the following legislation:</h2>";
  assert.equal(hasCaliforniaSigningAnnouncement(`${heading}<ul><li>AB 2713 — California AI Transparency Act</li><li>SB 1000 — California AI Transparency Act</li></ul>`), true);
  assert.equal(hasCaliforniaSigningAnnouncement(`${heading}<ul><li>SB 1000</li></ul><p>AB 2713 remains under consideration</p>`), false);
  assert.equal(hasCaliforniaSigningAnnouncement(`${heading}<ul><li>AB 2713</li></ul><p>SB 1000 remains under consideration</p>`), false);
  assert.equal(hasCaliforniaSigningAnnouncement("<p>SB 1000 and AB 2713</p>"), false);
  assert.equal(hasCaliforniaSigningAnnouncement(`${heading}<ul><li>SB 10000 and AB 27130</li></ul>`), false);
});

test("both California checker paths retain signing uncertainty and overdue provenance", () => {
  for (const bigProvider of [true, false]) {
    const result = evaluate({ bigProvider }, new Date("2026-10-14T12:00:00Z")).find(({ law }) => law.id === "caSb942");
    assert.ok(result.detail.includes(CA_SIGNING_NOTICE));
    assert.equal(result.law.review.lastSubstantiveHumanReviewDate, "2026-08-02");
    assert.equal(result.law.review.nextReviewDue, "2026-08-09");
  }
  const announcement = LAWS.caSb942.officialSources.find(({ sourceId }) => sourceId === "ca-governor-ai-signing-2026-09-30");
  assert.equal(announcement.publishedDate, "2026-09-30");
  assert.equal(announcement.retrievedAt, "2026-10-14");
  assert.equal(announcement.effectiveDate, undefined);
  assert.equal(announcement.applicableDate, undefined);
  assert.equal(LAWS.caSb942.review.automatedSourceCheckStatus, "access_limited");
});
