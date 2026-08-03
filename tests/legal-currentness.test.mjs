import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  evaluate,
  LAWS,
  LEGAL_REVIEW_DATE,
  LEGAL_REVIEW_LABEL,
  NEXT_LEGAL_REVIEW_DUE,
} from "../src/lib/laws.ts";

const allNo = {
  publish: false,
  sponsored: false,
  humanReview: false,
  euAudience: false,
  deepfakes: false,
  nyAds: false,
  chatbot: false,
  bigProvider: false,
};

const lawIds = ["ftc", "euArt50", "nySynthetic", "caBot", "caSb942"];

function statuses(answers) {
  return Object.fromEntries(evaluate(answers).map((result) => [result.law.id, result.status]));
}

test("decision table always returns one card for every screened framework", () => {
  const cases = [
    {
      name: "all no",
      answers: allNo,
      expected: {
        ftc: "lower",
        euArt50: "lower",
        nySynthetic: "lower",
        caBot: "lower",
        caSb942: "lower",
      },
    },
    {
      name: "chatbot without publishing",
      answers: { ...allNo, chatbot: true },
      expected: {
        ftc: "lower",
        euArt50: "review",
        nySynthetic: "lower",
        caBot: "review",
        caSb942: "lower",
      },
    },
    {
      name: "EU-accessible publication",
      answers: { ...allNo, publish: true, euAudience: true },
      expected: {
        ftc: "monitor",
        euArt50: "review",
        nySynthetic: "lower",
        caBot: "lower",
        caSb942: "lower",
      },
    },
    {
      name: "sponsored publication",
      answers: { ...allNo, publish: true, sponsored: true },
      expected: {
        ftc: "review",
        euArt50: "monitor",
        nySynthetic: "lower",
        caBot: "lower",
        caSb942: "lower",
      },
    },
    {
      name: "New York synthetic-performer advertisement",
      answers: { ...allNo, nyAds: true },
      expected: {
        ftc: "lower",
        euArt50: "lower",
        nySynthetic: "review",
        caBot: "lower",
        caSb942: "lower",
      },
    },
    {
      name: "large generative-AI provider",
      answers: { ...allNo, bigProvider: true },
      expected: {
        ftc: "lower",
        euArt50: "lower",
        nySynthetic: "lower",
        caBot: "lower",
        caSb942: "review",
      },
    },
  ];

  for (const scenario of cases) {
    const results = evaluate(scenario.answers);
    assert.deepEqual(
      results.map((result) => result.law.id),
      lawIds,
      `${scenario.name} must retain the five-card result order`,
    );
    assert.equal(new Set(results.map((result) => result.law.id)).size, 5);
    assert.deepEqual(statuses(scenario.answers), scenario.expected, scenario.name);
  }
});

test("FTC screening does not reuse one disclosure across different relationships", () => {
  const result = evaluate({ ...allNo, publish: true, sponsored: true }).find(
    (item) => item.law.id === "ftc",
  );
  assert.ok(result);
  assert.equal(result.sampleDisclosure, undefined);
  assert.match(result.detail, /paid, gifted, and affiliate relationships.*different factual wording/i);
});

test("EU currentness copy limits the Article 50(2) transition precisely", async () => {
  const pages = await readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8");
  const requirements = LAWS.euArt50.requires.join("\n");

  assert.equal(LEGAL_REVIEW_DATE, "2026-08-02");
  assert.equal(LEGAL_REVIEW_LABEL, "August 2, 2026");
  assert.equal(NEXT_LEGAL_REVIEW_DUE, "2026-08-09");
  assert.match(requirements, /Regulation \(EU\) 2026\/1744 delays only that paragraph/i);
  assert.match(requirements, /placed on the market before August 2, 2026/i);
  assert.match(requirements, /does not postpone the other Article 50 duties/i);
  assert.match(pages, /Article 111\(4\)/);
  assert.match(pages, /does not postpone Article 50\(1\), 50\(3\), or 50\(4\)/);
  assert.match(pages, /guidelines are non-binding/i);
  assert.match(pages, /Code of Practice.*voluntary/i);
  assert.match(pages, /OJ%3AL_202601744/);
  assert.match(pages, /guidelines-transparency-obligations-providers-and-deployers-ai-systems/);
  assert.match(pages, /code-practice-ai-generated-content/);
});

test("California currentness copy integrates AB 853 and keeps SB 1000 proposed", async () => {
  const pages = await readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8");
  const requirements = LAWS.caSb942.requires.join("\n");

  assert.match(LAWS.caSb942.name, /as amended by AB 853/i);
  assert.match(LAWS.caSb942.effective, /operative August 2, 2026/i);
  assert.match(LAWS.caSb942.effective, /January 1, 2027/);
  assert.match(LAWS.caSb942.effective, /January 1, 2028/);
  assert.match(LAWS.caSb942.officialUrl, /codes_displayText.*chapter=25/);
  assert.match(requirements, /2,000,000 unique monthly users/);
  assert.match(requirements, /GenAI system hosting platform/);
  assert.match(requirements, /capture devices/);
  assert.match(requirements, /third-party licensee/);
  assert.match(pages, /SB 1000 is not current law/);
  assert.match(pages, /AB 853 chaptered amendment/);
  assert.match(pages, /Section 22757\.5 excludes/);
  assert.doesNotMatch(pages, /chapter became operative January 1, 2026/i);
});

test("checker flow retains all questions and exposes mobile and assistive safeguards", async () => {
  const checker = await readFile(
    new URL("../src/app/checker/CheckerClient.tsx", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(checker, /setStep\(5\)|skip straight to results/i);
  assert.match(checker, /more than 1,000,000 monthly visitors or users/i);
  assert.match(checker, /more than 2,000,000 unique monthly users/i);
  assert.match(checker, /model weights available for download/i);
  assert.match(checker, /capture devices for sale in California/i);
  assert.match(checker, /affected third-party licensee/i);
  assert.match(checker, /exclusively assembling devices is excluded/i);
  assert.match(checker, /emotion-recognition or biometric-categorisation/);
  assert.match(checker, /Article 50\(3\)/);
  assert.match(checker, /onClick={goBack}/);
  assert.match(checker, /tabIndex={-1}/);
  assert.match(checker, /aria-live="polite"/);
  assert.match(checker, /role="progressbar"/);
  assert.match(checker, /min-w-0 flex-1 overflow-hidden/);
  assert.doesNotMatch(checker, /h-1\.5 w-6/);
});

test("public machine-readable copy uses current dates, conclusions, and live routes", async () => {
  const [llms, home] = await Promise.all([
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(llms, /may warrant review/i);
  assert.match(llms, /does not decide[\s>]+jurisdiction, coverage, compliance, or legal duties/i);
  assert.match(llms, /reviewed August 2, 2026/i);
  assert.match(llms, /SB 942 as amended by AB 853[\s\S]*operative August 2, 2026/i);
  assert.match(llms, /Pending SB 1000[\s\S]*not current law/i);
  assert.match(llms, /material connections,[\s\S]*not a general AI-use label/i);
  assert.doesNotMatch(llms, /which AI\s+disclosure laws apply|FTC Endorsement Guides AI disclosure guidance/i);
  assert.doesNotMatch(llms, /\/answers\//);
  for (const path of [
    "/checker",
    "/tracker",
    "/downloads/ai-disclosure-law-tracker.csv",
    "/about",
    "/editorial-standards",
    "/privacy",
    "/contact",
    "/disclaimer",
    "/terms",
    "/laws/ftc-ai-disclosure-rules",
    "/laws/eu-ai-act-article-50",
    "/laws/new-york-synthetic-performer-law",
    "/laws/california-bot-disclosure-law",
    "/laws/california-sb-942",
  ]) {
    assert.match(llms, new RegExp(`https://aipolicyfile\\.com${path.replaceAll("/", "\\/")}`));
  }

  assert.match(home, /Get a card per law/);
  assert.match(home, /Every result links to the official text/);
  assert.doesNotMatch(home, /Every action card includes example disclosure wording/);
});
