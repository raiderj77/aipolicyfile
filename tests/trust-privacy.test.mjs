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
  assert.doesNotMatch(route, /console\.|request\.json/);
  assert.match(route, /request\.text/);
  assert.match(route, /status: 503/);
});

test("checker uses screening labels rather than legal conclusions", async () => {
  const checker = await readFile(new URL("../src/app/checker/CheckerClient.tsx", import.meta.url), "utf8");
  assert.match(checker, /Possible relevance/);
  assert.match(checker, /does not determine jurisdiction/);
  assert.doesNotMatch(checker, /Action needed|exactly what to do|laws need action/);
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
  assert.match(legalCopy, /January 1, 2026/);
  assert.match(legalCopy, /eur-lex\.europa\.eu/);
});
