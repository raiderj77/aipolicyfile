import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  evaluate,
  LAWS,
  LEGAL_REVIEW_DATE,
  LEGAL_CONTENT_MODIFIED_DATE,
  LEGAL_REVIEW_LABEL,
  NEXT_LEGAL_REVIEW_DUE,
  getLawReviewStatus,
  getLegalReviewStatus,
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
const dueDay = new Date("2026-08-09T23:59:59.999Z");
const overdueDay = new Date("2026-08-10T00:00:00.000Z");

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
    const results = evaluate(scenario.answers, overdueDay);
    assert.deepEqual(
      results.map((result) => result.law.id),
      lawIds,
      `${scenario.name} must retain the five-card result order`,
    );
    assert.equal(new Set(results.map((result) => result.law.id)).size, 5);
    assert.deepEqual(statuses(scenario.answers), scenario.expected, scenario.name);
    for (const result of results) {
      assert.ok(result.matchedSignals.length > 0, `${result.law.id} needs matched signals`);
      assert.ok(result.unresolvedFacts.length > 0, `${result.law.id} needs unresolved facts`);
      assert.equal(result.provenance.sourceReviewStatus, "source-review-overdue");
      assert.equal(result.provenance.sourceVersion, result.law.review.sourceDataVersion);
      assert.equal(result.provenance.checkerVersion, result.law.review.checkerVersion);
      assert.equal(
        result.provenance.lastSubstantiveHumanReview,
        result.law.review.lastSubstantiveHumanReviewDate,
      );
      for (const signal of result.matchedSignals) {
        assert.equal(typeof signal.answer, "boolean");
        assert.equal(signal.answer, scenario.answers[signal.answerKey]);
      }
    }
  }
});

test("source-review status changes deterministically at the UTC due-date boundary", () => {
  assert.equal(getLegalReviewStatus(dueDay).overdue, false);
  assert.ok(evaluate(allNo, dueDay).every((result) => result.provenance.sourceReviewStatus === "current"));
  const overdue = getLegalReviewStatus(overdueDay);
  assert.equal(overdue.overdue, true);
  assert.equal(overdue.state, "source-review-overdue");
  assert.equal(overdue.nextReviewDue, "2026-08-09");
  assert.match(overdue.sourceDataVersion, /^legal-catalog-/);
  assert.match(overdue.checkerVersion, /^checker-/);
  assert.deepEqual(overdue.overdueLawIds, lawIds);
  for (const law of Object.values(LAWS)) {
    assert.equal(getLawReviewStatus(law, overdueDay).overdue, true);
  }
});

test("every framework exposes structured source, review, scope, and change metadata", () => {
  for (const law of Object.values(LAWS)) {
    assert.ok(law.status);
    assert.ok(law.rolesAffected.length > 0);
    assert.ok(law.applicabilitySignals.length > 0);
    assert.ok(law.definitions.length > 0);
    assert.ok(law.exceptions.length > 0);
    assert.ok(law.changeHistory.length > 0);
    assert.match(law.review.sourceDataVersion, /^[-a-z0-9.]+$/);
    assert.match(law.review.checkerVersion, /^checker-/);
    assert.match(law.review.automatedSourceCheckStatus, /^(passed|access_limited)$/);
    assert.ok(law.review.automatedSourceCheckNote.length > 20);
    assert.equal(new Set(law.officialSources.map((source) => source.sourceId)).size, law.officialSources.length);
    for (const source of law.officialSources) {
      assert.match(source.canonicalUrl, /^https:\/\//);
      assert.match(source.retrievedAt, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(source.legalStatus);
      assert.ok(source.bindingEffect);
      if (source.contentSha256) {
        assert.match(source.contentSha256, /^[a-f0-9]{64}$/);
        assert.match(source.fingerprintUrl, /^https:\/\//);
      }
    }
  }
  assert.equal(LAWS.nySynthetic.review.automatedSourceCheckStatus, "access_limited");
  assert.ok(
    Object.values(LAWS)
      .filter((law) => law.id !== "nySynthetic")
      .every((law) => law.review.automatedSourceCheckStatus === "passed"),
  );
});

test("illustrative disclosure wording carries a version or is explicitly absent", () => {
  const eu = evaluate({ ...allNo, deepfakes: true }, overdueDay).find((result) => result.law.id === "euArt50");
  const ny = evaluate({ ...allNo, nyAds: true }, overdueDay).find((result) => result.law.id === "nySynthetic");
  const bot = evaluate({ ...allNo, chatbot: true }, overdueDay).find((result) => result.law.id === "caBot");
  assert.equal(eu?.sampleDisclosure?.templateVersion, "eu-art50-deepfake-en-v1");
  assert.equal(ny?.sampleDisclosure?.templateVersion, "ny-gbl-396-b-disclosure-en-v1");
  assert.equal(bot?.sampleDisclosure?.templateVersion, "ca-bot-disclosure-en-v1");
  assert.equal(eu?.provenance.templateVersion, eu?.sampleDisclosure?.templateVersion);
});

test("FTC screening does not reuse one disclosure across different relationships", () => {
  const result = evaluate({ ...allNo, publish: true, sponsored: true }).find(
    (item) => item.law.id === "ftc",
  );
  assert.ok(result);
  assert.equal(result.sampleDisclosure, undefined);
  assert.equal(result.provenance.templateVersion, null);
  assert.deepEqual(
    result.matchedSignals.map(({ answerKey, answer }) => [answerKey, answer]),
    [["publish", true], ["sponsored", true]],
  );
  assert.match(result.detail, /paid, gifted, and affiliate relationships.*different factual wording/i);
});

test("EU currentness copy limits the Article 50(2) transition precisely", async () => {
  const pages = await readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8");
  const requirements = LAWS.euArt50.requires.join("\n");
  const qualifications = LAWS.euArt50.exceptions.join("\n");

  assert.equal(LEGAL_REVIEW_DATE, "2026-08-02");
  assert.equal(LEGAL_CONTENT_MODIFIED_DATE, "2026-08-29");
  assert.equal(LEGAL_REVIEW_LABEL, "August 2, 2026");
  assert.equal(NEXT_LEGAL_REVIEW_DUE, "2026-08-09");
  assert.match(requirements, /Regulation \(EU\) 2026\/1744 delays only that paragraph/i);
  assert.match(requirements, /placed on the market before August 2, 2026/i);
  assert.match(requirements, /does not postpone the other Article 50 duties/i);
  assert.match(qualifications, /obvious to a reasonably well-informed, observant, and circumspect person/i);
  assert.match(qualifications, /public crime-reporting caveat/i);
  assert.match(qualifications, /standard editing/i);
  assert.match(qualifications, /does not substantially alter.*input data or its semantics/i);
  assert.match(qualifications, /Article 50\(3\).*law-enforcement exception.*appropriate safeguards/i);
  assert.match(qualifications, /artistic, creative, satirical, fictional, or analogous works or programmes/i);
  assert.match(qualifications, /disclosure is still required/i);
  assert.match(qualifications, /not a blanket exemption/i);
  assert.match(qualifications, /public-interest text.*human review or editorial control/i);
  assert.match(qualifications, /holds editorial responsibility/i);
  assert.match(pages, /Article 111\(4\)/);
  assert.match(pages, /does not postpone Article 50\(1\), 50\(3\), or 50\(4\)/);
  assert.match(pages, /guidelines are non-binding/i);
  assert.match(pages, /Code of Practice.*voluntary/i);
  assert.match(pages, /replaced Article 50\(7\)/);
  assert.match(pages, /formally assessed it as adequate/);
  const sources = LAWS.euArt50.officialSources.map((source) => source.canonicalUrl).join("\n");
  assert.match(sources, /reg\/2026\/1744/);
  assert.match(sources, /guidelines-transparency-obligations-providers-and-deployers-ai-systems/);
  assert.match(sources, /code-practice-ai-generated-content/);
  assert.match(sources, /document\/130913/);
  assert.match(sources, /document\/130916/);
});

test("FTC catalog keeps nonbinding Part 255 separate from binding Part 465", () => {
  const guides = LAWS.ftc.officialSources.find(
    (source) => source.sourceId === "us-ftc-endorsement-guides",
  );
  const reviewsRule = LAWS.ftc.officialSources.find(
    (source) => source.sourceId === "us-ftc-consumer-review-rule",
  );
  const qualifications = LAWS.ftc.exceptions.join("\n");

  assert.equal(guides?.bindingEffect, "administrative_interpretation_not_standalone_rule");
  assert.equal(reviewsRule?.bindingEffect, "binding_rule");
  assert.match(reviewsRule?.notes ?? "", /does not amend Part 255/i);
  assert.match(qualifications, /separate binding Consumer Reviews and Testimonials Rule/i);
  assert.match(qualifications, /does not amend Part 255, make the Guides binding/i);
  assert.match(LAWS.ftc.penalty, /Guides do not themselves have the force of law/i);
});

test("New York automation note records the two observed 403s and unobserved Governor block", () => {
  const note = LAWS.nySynthetic.review.automatedSourceCheckNote;

  assert.equal(LAWS.nySynthetic.review.automatedSourceCheckStatus, "access_limited");
  assert.match(note, /HTTP 403.*two New York legislative pages/i);
  assert.match(note, /§ 396-b and S\.8420-A/i);
  assert.match(note, /Governor-page block was not observed/i);
  assert.match(note, /allowlist and metadata require review/i);
  assert.match(note, /automated coverage remains limited despite manual opening/i);
  assert.doesNotMatch(note, /blocked on three New York official pages/i);
});

test("California B.O.T. Act catalog states the bot definition and platform qualification", () => {
  const definitions = LAWS.caBot.definitions.join("\n");
  const qualifications = LAWS.caBot.exceptions.join("\n");

  assert.match(definitions, /automated online account/i);
  assert.match(definitions, /all or substantially all.*actions or posts.*not the result of a person/i);
  assert.match(definitions, /public-facing internet website, web application, or digital application/i);
  assert.match(qualifications, /Section 17942\(c\)/i);
  assert.match(qualifications, /does not impose a duty on service providers of online platforms/i);
  assert.match(qualifications, /web-hosting and internet-service providers/i);
});

test("California currentness copy integrates AB 853 and keeps SB 1000 proposed", async () => {
  const pages = await readFile(new URL("../src/lib/lawPages.ts", import.meta.url), "utf8");
  const requirements = LAWS.caSb942.requires.join("\n");
  const qualifications = LAWS.caSb942.exceptions.join("\n");

  assert.match(LAWS.caSb942.name, /as amended by AB 853/i);
  assert.match(LAWS.caSb942.timingSummary, /operative August 2, 2026/i);
  assert.match(LAWS.caSb942.timingSummary, /January 1, 2027/);
  assert.match(LAWS.caSb942.timingSummary, /January 1, 2028/);
  assert.match(LAWS.caSb942.officialSources[0].canonicalUrl, /codes_displayText.*chapter=25/);
  assert.match(requirements, /2,000,000 unique monthly users/);
  assert.match(requirements, /GenAI system hosting platform/);
  assert.match(requirements, /capture devices/);
  assert.match(requirements, /third-party licensee/);
  assert.match(qualifications, /large-online-platform definition excludes/i);
  assert.match(qualifications, /broadband internet access services/i);
  assert.match(qualifications, /telecommunications services/i);
  assert.match(pages, /SB 1000 is not current law/);
  assert.match(LAWS.caSb942.officialSources.map((source) => source.title).join("\n"), /AB 853 chaptered amendment/);
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
  assert.match(checker, /Matched answers/);
  assert.match(checker, /Important unresolved facts/);
  assert.match(checker, /SOURCE REVIEW OVERDUE/);
  assert.match(checker, /Source version/);
  assert.match(checker, /Template version/);
  assert.match(checker, /setResultAsOfMs\(Date\.now\(\)\)/);
  assert.match(checker, /SourceReviewNotice compact asOfMs=\{resultAsOfMs\}/);
  assert.match(checker, /onClick={goBack}/);
  assert.match(checker, /tabIndex={-1}/);
  assert.match(checker, /aria-live="polite"/);
  assert.match(checker, /role="progressbar"/);
  assert.match(checker, /min-w-0 flex-1 overflow-hidden/);
  assert.doesNotMatch(checker, /h-1\.5 w-6/);
});

test("public machine-readable copy uses current dates, conclusions, and live routes", async () => {
  const [home, route, llms] = await Promise.all([
    readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/llms.txt/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/lib/llmsText.ts", import.meta.url), "utf8"),
  ]);

  assert.match(llms, /may warrant review/i);
  assert.match(llms, /does not decide/i);
  assert.match(llms, /jurisdiction, coverage, compliance, or legal duties/i);
  assert.match(llms, /Last substantive review:/i);
  assert.match(llms, /law\.timingSummary/);
  assert.match(llms, /SOURCE REVIEW OVERDUE/);
  assert.match(llms, /Status as of:.*asOf\.toISOString/);
  assert.match(route, /force-dynamic/);
  assert.doesNotMatch(llms, /which AI\s+disclosure laws apply|FTC Endorsement Guides AI disclosure guidance/i);
  assert.doesNotMatch(llms, /\/answers\//);
  for (const path of [
    "/checker",
    "/tracker",
    "/downloads/ai-disclosure-law-tracker.csv",
    "/about",
    "/editorial-standards",
    "/corrections",
    "/accessibility",
    "/ai-transparency",
    "/security",
    "/privacy",
    "/contact",
    "/disclaimer",
    "/terms",
  ]) {
    assert.match(llms, new RegExp(`https://aipolicyfile\\.com${path.replaceAll("/", "\\/")}`));
  }
  assert.match(llms, /https:\/\/aipolicyfile\.com\/laws\/\$\{LAW_PAGE_SLUGS\[law\.id\]\}/);

  assert.match(home, /Get a card per law/);
  assert.match(home, /Every result links to the official text/);
  assert.doesNotMatch(home, /Every action card includes example disclosure wording/);
});
