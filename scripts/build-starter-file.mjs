import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  CHECKER_VERSION,
  LAWS,
  LEGAL_SOURCE_DATA_VERSION,
  evaluate,
} from "../src/lib/laws.ts";

export const ARTIFACT_VERSION = "1.0.0";
export const ARTIFACT_DIRECTORY = `ai-disclosure-starter-file-v${ARTIFACT_VERSION}`;
export const STARTER_TEMPLATE_VERSION = "ai-disclosure-starter-file-en-v1";
export const SOURCE_LEDGER_SCHEMA_VERSION = "ai-policy-file-source-ledger-v1";
export const EDUCATIONAL_LIMITATION =
  "Educational drafting aid only. AI Policy File is not a law firm, does not provide legal advice, and does not decide which law applies or whether wording is sufficient for a particular person, project, or business. Verify the facts and current official sources, and seek qualified advice when needed.";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDirectory, "..");
const starterProductRoot = path.join(repositoryRoot, "product", "starter-file");
const defaultOutputRoot = path.join(starterProductRoot, "generated");

export const QUESTION_ORDER = [
  "publish",
  "sponsored",
  "humanReview",
  "euAudience",
  "deepfakes",
  "nyAds",
  "chatbot",
  "bigProvider",
];

const QUESTION_PROMPTS = {
  publish: "Does this project publish AI-generated or AI-assisted content online?",
  sponsored: "Is any content sponsored, advertising, gifted, or affiliate-linked?",
  humanReview: "Does a person substantively review AI-written text before publication?",
  euAudience: "Can the published content be accessed from the European Union?",
  deepfakes: "Does the project publish realistic AI media involving people, places, or events?",
  nyAds: "Does it run synthetic-performer advertising that could reach New York?",
  chatbot: "Does it provide an AI system that interacts directly with people?",
  bigProvider:
    "Does the business report a California-connected provider, licensee, large-platform, hosting-platform, or capture-device role?",
};

const FALSE_ANSWERS = Object.fromEntries(QUESTION_ORDER.map((key) => [key, false]));
const STATUS_LABELS = {
  review: "Worth reviewing",
  monitor: "Possible relevance",
  lower: "Lower apparent relevance",
};
const ANSWER_LABELS = { yes: "Yes", no: "No", unsure: "Not sure" };

export class SourceReviewOverdueError extends Error {
  constructor(overdueFrameworkIds) {
    super(`SOURCE REVIEW OVERDUE: refusing release. Overdue frameworks: ${overdueFrameworkIds.join(", ")}`);
    this.name = "SourceReviewOverdueError";
    this.code = "SOURCE_REVIEW_OVERDUE";
    this.exitCode = 2;
    this.overdueFrameworkIds = [...overdueFrameworkIds];
  }
}

export function assertReleaseReady(manifest) {
  if (!manifest.releaseReady) {
    throw new SourceReviewOverdueError(manifest.sourceReviewStatus.overdueFrameworkIds);
  }
  return true;
}

function assertIsoDate(label, value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function prettyStableJson(value) {
  return `${JSON.stringify(JSON.parse(stableJson(value)), null, 2)}\n`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeMarkdown(value) {
  return String(value)
    .replace(/([\\`*_{}\[\]<>#+!|])/g, "\\$1")
    .replace(/\r?\n/g, " ")
    .trim();
}

function plainText(value, maximumLength = 2_000) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maximumLength);
}

function sha256(content) {
  return createHash("sha256").update(content, typeof content === "string" ? "utf8" : undefined).digest("hex");
}

function byteLength(content) {
  return Buffer.byteLength(content, "utf8");
}

const CRC32_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function zipDosDate(asOfDate) {
  assertIsoDate("ZIP date", asOfDate);
  const [year, month, day] = asOfDate.split("-").map(Number);
  if (year < 1980 || year > 2107) throw new Error(`ZIP date year is out of range: ${year}`);
  return ((year - 1980) << 9) | (month << 5) | day;
}

export function createDeterministicZip(entries, asOfDate) {
  const sortedEntries = [...entries].sort(([left], [right]) => left.localeCompare(right));
  if (!sortedEntries.length) throw new Error("ZIP archive requires at least one entry");
  if (sortedEntries.length > 0xffff) throw new Error("ZIP archive has too many entries");
  const dosDate = zipDosDate(asOfDate);
  const dosTime = 0;
  const utf8Flag = 0x0800;
  const storeMethod = 0;
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;

  for (const [entryName, content] of sortedEntries) {
    if (!entryName || entryName.startsWith("/") || entryName.includes("\\") || entryName.split("/").includes("..")) {
      throw new Error(`Unsafe ZIP entry name: ${entryName}`);
    }
    const name = Buffer.from(entryName, "utf8");
    const payload = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    if (name.length > 0xffff) throw new Error(`ZIP entry name is too long: ${entryName}`);
    if (payload.length > 0xffffffff) throw new Error(`ZIP entry is too large: ${entryName}`);
    const checksum = crc32(payload);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(utf8Flag, 6);
    localHeader.writeUInt16LE(storeMethod, 8);
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(payload.length, 18);
    localHeader.writeUInt32LE(payload.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, payload);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(utf8Flag, 8);
    centralHeader.writeUInt16LE(storeMethod, 10);
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(payload.length, 20);
    centralHeader.writeUInt32LE(payload.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(localOffset, 42);
    centralParts.push(centralHeader, name);
    localOffset += localHeader.length + name.length + payload.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(sortedEntries.length, 8);
  end.writeUInt16LE(sortedEntries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function serializeForInlineScript(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

function canonicalQuestionDefinitions() {
  const observedLabels = new Map(
    evaluate(FALSE_ANSWERS, new Date("2000-01-01T12:00:00Z")).flatMap((result) =>
      result.matchedSignals.map((signal) => [signal.answerKey, signal.label]),
    ),
  );
  for (const key of QUESTION_ORDER) {
    if (!observedLabels.has(key)) throw new Error(`Canonical checker did not expose question ${key}`);
  }
  return QUESTION_ORDER.map((key) => ({
    key,
    prompt: QUESTION_PROMPTS[key],
    canonicalSignalLabel: observedLabels.get(key),
  }));
}

export function calculateReviewStatus(frameworks, asOfDate) {
  assertIsoDate("as-of date", asOfDate);
  const overdueFrameworkIds = frameworks
    .filter((framework) => asOfDate > framework.review.nextReviewDue)
    .map((framework) => framework.id);
  const earliestDue = [...frameworks]
    .map((framework) => framework.review.nextReviewDue)
    .sort()[0];
  const oldestReview = [...frameworks]
    .map((framework) => framework.review.lastSubstantiveHumanReviewDate)
    .sort()[0];
  const oldestAutomatedCheck = [...frameworks]
    .map((framework) => framework.review.lastAutomatedSourceCheckDate)
    .sort()[0];
  return {
    state: overdueFrameworkIds.length ? "SOURCE REVIEW OVERDUE" : "CURRENT",
    overdue: overdueFrameworkIds.length > 0,
    asOfDate,
    lastSubstantiveHumanReviewDate: oldestReview,
    nextReviewDue: earliestDue,
    lastAutomatedSourceCheckDate: oldestAutomatedCheck,
    overdueFrameworkIds,
  };
}

export function buildSourceLedger({ asOfDate = todayUtc(), laws = LAWS } = {}) {
  assertIsoDate("as-of date", asOfDate);
  const frameworks = Object.values(laws).map((law) => ({
    id: law.id,
    name: law.name,
    shortName: law.shortName,
    jurisdiction: law.jurisdiction,
    legalStatus: law.status,
    timingSummary: law.timingSummary,
    whoItHits: law.whoItHits,
    rolesAffected: [...law.rolesAffected],
    review: {
      sourceDataVersion: law.review.sourceDataVersion,
      checkerVersion: law.review.checkerVersion,
      templateVersion: law.review.templateVersion,
      lastSubstantiveHumanReviewDate: law.review.lastSubstantiveHumanReviewDate,
      nextReviewDue: law.review.nextReviewDue,
      reviewer: law.review.reviewer,
      lastAutomatedSourceCheckDate: law.review.lastAutomatedSourceCheckDate,
      automatedSourceCheckStatus: law.review.automatedSourceCheckStatus,
      automatedSourceCheckNote: law.review.automatedSourceCheckNote,
    },
    officialSources: law.officialSources.map((source) => ({ ...source })),
  }));

  for (const framework of frameworks) {
    assertIsoDate(
      `${framework.id} substantive review date`,
      framework.review.lastSubstantiveHumanReviewDate,
    );
    assertIsoDate(`${framework.id} next review due`, framework.review.nextReviewDue);
    assertIsoDate(
      `${framework.id} automated source check date`,
      framework.review.lastAutomatedSourceCheckDate,
    );
    if (!framework.officialSources.length) throw new Error(`${framework.id} has no official sources`);
    for (const source of framework.officialSources) {
      if (!source.canonicalUrl.startsWith("https://")) {
        throw new Error(`${source.sourceId} must use an HTTPS official-source URL`);
      }
    }
  }

  return {
    schemaVersion: SOURCE_LEDGER_SCHEMA_VERSION,
    artifactVersion: ARTIFACT_VERSION,
    artifactTemplateVersion: STARTER_TEMPLATE_VERSION,
    legalSourceDataVersion: LEGAL_SOURCE_DATA_VERSION,
    checkerVersion: CHECKER_VERSION,
    assembledAsOf: asOfDate,
    educationalLimitation: EDUCATIONAL_LIMITATION,
    reviewStatus: calculateReviewStatus(frameworks, asOfDate),
    frameworks,
  };
}

function normalizeAnswers(answers) {
  return Object.fromEntries(
    QUESTION_ORDER.map((key) => {
      const value = answers?.[key] ?? "unsure";
      if (!Object.hasOwn(ANSWER_LABELS, value)) throw new Error(`Invalid answer for ${key}: ${value}`);
      return [key, value];
    }),
  );
}

function answerDecisionKey(answers) {
  return QUESTION_ORDER.map((key) => (answers[key] === "yes" ? "1" : "0")).join("");
}

function canonicalBooleanAnswers(answers) {
  return Object.fromEntries(QUESTION_ORDER.map((key) => [key, answers[key] === "yes"]));
}

function mapCanonicalResult(result, answerStates, framework) {
  const unknownSignals = result.matchedSignals.filter(
    (signal) => answerStates[signal.answerKey] === "unsure",
  );
  const hasUnknownSignals = unknownSignals.length > 0;
  return {
    frameworkId: result.law.id,
    frameworkName: result.law.shortName,
    jurisdiction: result.law.jurisdiction,
    status: hasUnknownSignals ? "More information needed" : STATUS_LABELS[result.status],
    headline: hasUnknownSignals
      ? "More information is needed before using this screening result."
      : result.headline,
    detail: hasUnknownSignals
      ? `Verify the unanswered screening fact${unknownSignals.length === 1 ? "" : "s"} listed below. No applicability conclusion is made.`
      : result.detail,
    matchedAnswers: result.matchedSignals.map((signal) => ({
      key: signal.answerKey,
      label: signal.label,
      answer: ANSWER_LABELS[answerStates[signal.answerKey]],
    })),
    unresolvedFacts: [...result.unresolvedFacts],
    officialSources: framework.officialSources.map((source) => ({
      sourceId: source.sourceId,
      authority: source.authority,
      title: source.title,
      url: source.canonicalUrl,
      sourceType: source.sourceType,
      legalStatus: source.legalStatus,
      retrievedAt: source.retrievedAt,
    })),
    sourceVersion: result.provenance.sourceVersion,
    substantiveReviewDate: result.provenance.lastSubstantiveHumanReview,
    nextReviewDue: result.provenance.nextReviewDue,
    automatedSourceCheckDate: result.provenance.lastAutomatedSourceCheck,
    automatedSourceCheckStatus: result.provenance.automatedSourceCheckStatus,
    checkerVersion: result.provenance.checkerVersion,
    templateVersion: result.sampleDisclosure?.templateVersion ?? framework.review.templateVersion,
    exampleDisclosure: result.sampleDisclosure
      ? {
          text: result.sampleDisclosure.text,
          label: "Editable example from the reviewed source set; not required wording",
        }
      : null,
  };
}

function buildDraftLines(profile) {
  const projectName = plainText(profile.projectName, 120) || "[Project name]";
  const aiUse = plainText(profile.aiUse, 500) || "[describe the AI-assisted task]";
  const humanRole = plainText(profile.humanRole, 500) || "[describe the human role and review]";
  const relationship = plainText(profile.relationship, 500);
  const placement = plainText(profile.placement, 300) || "[describe where readers will see the disclosure]";
  const lines = [
    `${projectName} uses AI-assisted tools for ${aiUse}.`,
    `Human role: ${humanRole}.`,
  ];
  if (relationship) lines.push(`Commercial relationship: ${relationship}.`);
  lines.push(`Planned placement: ${placement}.`);
  return lines;
}

export function createProductOutput({
  answers,
  profile = {},
  asOfDate = todayUtc(),
  laws = LAWS,
} = {}) {
  const answerStates = normalizeAnswers(answers);
  const ledger = buildSourceLedger({ asOfDate, laws });
  const canonicalResults = evaluate(
    canonicalBooleanAnswers(answerStates),
    new Date(`${asOfDate}T12:00:00Z`),
  );
  const frameworkById = new Map(ledger.frameworks.map((framework) => [framework.id, framework]));
  const results = canonicalResults.map((result) => {
    const framework = frameworkById.get(result.law.id);
    if (!framework) throw new Error(`Missing source-ledger framework ${result.law.id}`);
    return mapCanonicalResult(result, answerStates, framework);
  });

  return {
    artifactName: "AI Disclosure Starter File",
    artifactVersion: ARTIFACT_VERSION,
    artifactTemplateVersion: STARTER_TEMPLATE_VERSION,
    generatedOn: asOfDate,
    sourceReviewStatus: ledger.reviewStatus.state,
    releaseBlocked: ledger.reviewStatus.overdue,
    project: {
      projectName: plainText(profile.projectName, 120) || "Untitled project",
      ownerOrTeam: plainText(profile.ownerOrTeam, 120) || "Not provided",
      channel: plainText(profile.channel, 120) || "Not provided",
      notes: plainText(profile.notes, 2_000) || "None provided",
    },
    draftLines: buildDraftLines(profile),
    answerDecisionKey: answerDecisionKey(answerStates),
    answers: QUESTION_ORDER.map((key) => ({
      key,
      prompt: QUESTION_PROMPTS[key],
      answer: ANSWER_LABELS[answerStates[key]],
    })),
    results,
    sourceMetadata: {
      legalSourceDataVersion: ledger.legalSourceDataVersion,
      checkerVersion: ledger.checkerVersion,
      lastSubstantiveHumanReviewDate: ledger.reviewStatus.lastSubstantiveHumanReviewDate,
      nextReviewDue: ledger.reviewStatus.nextReviewDue,
      lastAutomatedSourceCheckDate: ledger.reviewStatus.lastAutomatedSourceCheckDate,
      overdueFrameworkIds: ledger.reviewStatus.overdueFrameworkIds,
    },
    educationalLimitation: EDUCATIONAL_LIMITATION,
  };
}

export function renderMarkdownOutput(model) {
  const lines = [];
  if (model.releaseBlocked) {
    lines.push(
      "# SOURCE REVIEW OVERDUE",
      "",
      "This educational draft is blocked from release because at least one source review is past due.",
      "",
    );
  }
  lines.push(
    `# ${escapeMarkdown(model.artifactName)}`,
    "",
    `- Artifact version: ${escapeMarkdown(model.artifactVersion)}`,
    `- Artifact template version: ${escapeMarkdown(model.artifactTemplateVersion)}`,
    `- Generated on: ${escapeMarkdown(model.generatedOn)}`,
    `- Source review status: ${escapeMarkdown(model.sourceReviewStatus)}`,
    `- Legal source data version: ${escapeMarkdown(model.sourceMetadata.legalSourceDataVersion)}`,
    `- Checker version: ${escapeMarkdown(model.sourceMetadata.checkerVersion)}`,
    `- Last substantive human review: ${escapeMarkdown(model.sourceMetadata.lastSubstantiveHumanReviewDate)}`,
    `- Next review due: ${escapeMarkdown(model.sourceMetadata.nextReviewDue)}`,
    `- Last automated source check: ${escapeMarkdown(model.sourceMetadata.lastAutomatedSourceCheckDate)}`,
    "",
    "## Educational limitation",
    "",
    escapeMarkdown(model.educationalLimitation),
    "",
    "## Project record",
    "",
    `- Project: ${escapeMarkdown(model.project.projectName)}`,
    `- Owner or team: ${escapeMarkdown(model.project.ownerOrTeam)}`,
    `- Channel: ${escapeMarkdown(model.project.channel)}`,
    `- Notes: ${escapeMarkdown(model.project.notes)}`,
    "",
    "## Editable factual draft",
    "",
    ...model.draftLines.map((line) => `- ${escapeMarkdown(line)}`),
    "",
    "This draft restates user-entered facts. It is not required wording.",
    "",
    "## Screening answers",
    "",
    ...model.answers.map(
      (answer) => `- ${escapeMarkdown(answer.prompt)} **${escapeMarkdown(answer.answer)}**`,
    ),
    "",
    "## Frameworks",
    "",
  );

  for (const result of model.results) {
    lines.push(
      `### ${escapeMarkdown(result.frameworkName)}`,
      "",
      `**Educational state:** ${escapeMarkdown(result.status)}`,
      "",
      `**Framework and jurisdiction:** ${escapeMarkdown(result.frameworkName)} — ${escapeMarkdown(result.jurisdiction)}`,
      "",
      escapeMarkdown(result.headline),
      "",
      escapeMarkdown(result.detail),
      "",
      "#### Matched answers",
      "",
      ...result.matchedAnswers.map(
        (answer) => `- ${escapeMarkdown(answer.label)}: **${escapeMarkdown(answer.answer)}**`,
      ),
      "",
      "#### Unresolved facts",
      "",
      ...result.unresolvedFacts.map((fact) => `- ${escapeMarkdown(fact)}`),
      "",
    );
    if (result.exampleDisclosure) {
      lines.push(
        "#### Editable example",
        "",
        `> ${escapeMarkdown(result.exampleDisclosure.text)}`,
        "",
        escapeMarkdown(result.exampleDisclosure.label),
        "",
      );
    }
    lines.push(
      "#### Official sources",
      "",
      ...result.officialSources.map(
        (source) =>
          `- [${escapeMarkdown(source.authority)} — ${escapeMarkdown(source.title)}](${source.url}) (retrieved ${escapeMarkdown(source.retrievedAt)})`,
      ),
      "",
      "#### Provenance",
      "",
      `- Source version: ${escapeMarkdown(result.sourceVersion)}`,
      `- Substantive review date: ${escapeMarkdown(result.substantiveReviewDate)}`,
      `- Next review due: ${escapeMarkdown(result.nextReviewDue)}`,
      `- Automated source check: ${escapeMarkdown(result.automatedSourceCheckDate)} (${escapeMarkdown(result.automatedSourceCheckStatus)})`,
      `- Checker version: ${escapeMarkdown(result.checkerVersion)}`,
      `- Template version: ${escapeMarkdown(result.templateVersion ?? "Not used")}`,
      "",
    );
  }
  return `${lines.join("\n").trim()}\n`;
}

export function renderPrintableOutput(model) {
  const blocked = model.releaseBlocked
    ? '<div class="blocked"><strong>SOURCE REVIEW OVERDUE</strong><br>This draft is blocked from release because at least one source review is past due.</div>'
    : "";
  const resultSections = model.results
    .map((result) => {
      const example = result.exampleDisclosure
        ? `  <h4>Editable example</h4><blockquote>${escapeHtml(result.exampleDisclosure.text)}</blockquote><p>${escapeHtml(result.exampleDisclosure.label)}</p>`
        : "";
      return `<section>
  <h3>${escapeHtml(result.frameworkName)}</h3>
  <p class="state">${escapeHtml(result.status)}</p>
  <p><strong>Framework and jurisdiction:</strong> ${escapeHtml(result.frameworkName)} — ${escapeHtml(result.jurisdiction)}</p>
  <p><strong>${escapeHtml(result.headline)}</strong></p>
  <p>${escapeHtml(result.detail)}</p>
  <h4>Matched answers</h4>
  <ul>${result.matchedAnswers.map((answer) => `<li>${escapeHtml(answer.label)}: <strong>${escapeHtml(answer.answer)}</strong></li>`).join("")}</ul>
  <h4>Unresolved facts</h4>
  <ul>${result.unresolvedFacts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
${example}
  <h4>Official sources</h4>
  <ul>${result.officialSources.map((source) => `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.authority)} — ${escapeHtml(source.title)}</a> (retrieved ${escapeHtml(source.retrievedAt)})</li>`).join("")}</ul>
  <h4>Provenance</h4>
  <dl>
    <dt>Source version</dt><dd>${escapeHtml(result.sourceVersion)}</dd>
    <dt>Substantive review date</dt><dd>${escapeHtml(result.substantiveReviewDate)}</dd>
    <dt>Next review due</dt><dd>${escapeHtml(result.nextReviewDue)}</dd>
    <dt>Automated source check</dt><dd>${escapeHtml(result.automatedSourceCheckDate)} (${escapeHtml(result.automatedSourceCheckStatus)})</dd>
    <dt>Checker version</dt><dd>${escapeHtml(result.checkerVersion)}</dd>
    <dt>Template version</dt><dd>${escapeHtml(result.templateVersion ?? "Not used")}</dd>
  </dl>
</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'">
<title>${escapeHtml(model.project.projectName)} — AI Disclosure Starter File</title>
<style>
body{font:16px/1.55 system-ui,sans-serif;color:#18231e;max-width:900px;margin:0 auto;padding:36px}h1,h2,h3,h4{line-height:1.2;color:#123a2a}section{border-top:2px solid #d9e4df;margin-top:28px;padding-top:20px}.meta,.limitation,.blocked{padding:16px;border:2px solid #5a766a;border-radius:8px;background:#f3f8f5}.blocked{border-color:#9b2c2c;background:#fff1f1;color:#681b1b}.state{font-weight:700;color:#185f45}dt{font-weight:700}dd{margin:0 0 8px}a{color:#075b45}@media print{body{max-width:none;padding:0}a{color:inherit;text-decoration:none}a::after{content:" (" attr(href) ")";font-size:.85em}}
</style>
</head>
<body>
${blocked}
<header><h1>AI Disclosure Starter File</h1><p>${escapeHtml(model.project.projectName)}</p></header>
<div class="meta"><strong>Version:</strong> ${escapeHtml(model.artifactVersion)} · <strong>Generated:</strong> ${escapeHtml(model.generatedOn)} · <strong>Source review:</strong> ${escapeHtml(model.sourceReviewStatus)} · <strong>Source data:</strong> ${escapeHtml(model.sourceMetadata.legalSourceDataVersion)} · <strong>Checker:</strong> ${escapeHtml(model.sourceMetadata.checkerVersion)}</div>
<section><h2>Educational limitation</h2><p class="limitation">${escapeHtml(model.educationalLimitation)}</p></section>
<section><h2>Project record</h2><dl><dt>Project</dt><dd>${escapeHtml(model.project.projectName)}</dd><dt>Owner or team</dt><dd>${escapeHtml(model.project.ownerOrTeam)}</dd><dt>Channel</dt><dd>${escapeHtml(model.project.channel)}</dd><dt>Notes</dt><dd>${escapeHtml(model.project.notes)}</dd></dl></section>
<section><h2>Editable factual draft</h2><ul>${model.draftLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul><p>This draft restates user-entered facts. It is not required wording.</p></section>
<section><h2>Screening answers</h2><ul>${model.answers.map((answer) => `<li>${escapeHtml(answer.prompt)} <strong>${escapeHtml(answer.answer)}</strong></li>`).join("")}</ul></section>
<h2>Frameworks</h2>
${resultSections}
<footer><p><strong>Review metadata:</strong> substantive human review ${escapeHtml(model.sourceMetadata.lastSubstantiveHumanReviewDate)}; next due ${escapeHtml(model.sourceMetadata.nextReviewDue)}; automated check ${escapeHtml(model.sourceMetadata.lastAutomatedSourceCheckDate)}.</p><p>${escapeHtml(model.educationalLimitation)}</p></footer>
</body>
</html>\n`;
}

function buildDecisionTable(asOfDate, ledger) {
  const table = {};
  const frameworkById = new Map(ledger.frameworks.map((framework) => [framework.id, framework]));
  const baseline = evaluate(FALSE_ANSWERS, new Date(`${asOfDate}T12:00:00Z`));
  for (const baselineResult of baseline) {
    const frameworkId = baselineResult.law.id;
    const signalKeys = baselineResult.matchedSignals.map((signal) => signal.answerKey);
    const framework = frameworkById.get(frameworkId);
    const cases = {};
    for (let mask = 0; mask < 2 ** signalKeys.length; mask += 1) {
      const booleanAnswers = {
        ...FALSE_ANSWERS,
        ...Object.fromEntries(
          signalKeys.map((key, index) => [key, Boolean(mask & (1 << index))]),
        ),
      };
      const key = signalKeys.map((questionKey) => (booleanAnswers[questionKey] ? "1" : "0")).join("");
      const result = evaluate(booleanAnswers, new Date(`${asOfDate}T12:00:00Z`)).find(
        (candidate) => candidate.law.id === frameworkId,
      );
      if (!result) throw new Error(`Canonical checker omitted ${frameworkId}`);
      cases[key] = {
        frameworkId: result.law.id,
        frameworkName: result.law.shortName,
        jurisdiction: result.law.jurisdiction,
        canonicalStatus: STATUS_LABELS[result.status],
        headline: result.headline,
        detail: result.detail,
        matchedAnswers: result.matchedSignals.map((signal) => ({
          key: signal.answerKey,
          label: signal.label,
        })),
        unresolvedFacts: result.unresolvedFacts,
        sourceVersion: result.provenance.sourceVersion,
        substantiveReviewDate: result.provenance.lastSubstantiveHumanReview,
        nextReviewDue: result.provenance.nextReviewDue,
        automatedSourceCheckDate: result.provenance.lastAutomatedSourceCheck,
        automatedSourceCheckStatus: result.provenance.automatedSourceCheckStatus,
        checkerVersion: result.provenance.checkerVersion,
        templateVersion: result.sampleDisclosure?.templateVersion ?? framework.review.templateVersion,
        exampleDisclosure: result.sampleDisclosure
          ? {
              text: result.sampleDisclosure.text,
              label: "Editable example from the reviewed source set; not required wording",
            }
          : null,
      };
    }
    table[frameworkId] = { signalKeys, cases };
  }
  return table;
}

function browserApplicationSource() {
  return String.raw`(function () {
  "use strict";
  var data = window.STARTER_FILE_DATA;
  var currentModel = null;
  var answerLabels = { yes: "Yes", no: "No", unsure: "Not sure" };

  function todayUtc() { return new Date().toISOString().slice(0, 10); }
  function isOverdue() {
    var today = todayUtc();
    return data.ledger.frameworks.some(function (framework) {
      return today > framework.review.nextReviewDue;
    });
  }
  function text(id) { return document.getElementById(id).value.trim(); }
  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escapeMarkdown(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/([\x60*_{}\[\]<>#+!|])/g, "\\$1").replace(/\r?\n/g, " ").trim();
  }
  function officialSources(frameworkId) {
    var framework = data.ledger.frameworks.find(function (item) { return item.id === frameworkId; });
    return framework.officialSources.map(function (source) {
      return { sourceId: source.sourceId, authority: source.authority, title: source.title, url: source.canonicalUrl, retrievedAt: source.retrievedAt };
    });
  }
  function gate() {
    var overdue = isOverdue();
    document.body.classList.toggle("review-overdue", overdue);
    document.getElementById("overdue-banner").hidden = !overdue;
  ["generate", "download-markdown", "download-html", "print-output"].forEach(function (id) {
      document.getElementById(id).disabled = overdue || (id !== "generate" && !currentModel);
    });
    if (overdue) {
      currentModel = null;
      document.getElementById("preview").replaceChildren();
      document.getElementById("action-status").textContent = "SOURCE REVIEW OVERDUE. Generation, download, and printing are disabled.";
    }
    return !overdue;
  }
  function buildDraft(profile) {
    var project = profile.projectName || "[Project name]";
    var aiUse = profile.aiUse || "[describe the AI-assisted task]";
    var humanRole = profile.humanRole || "[describe the human role and review]";
    var lines = [project + " uses AI-assisted tools for " + aiUse + ".", "Human role: " + humanRole + "."];
    if (profile.relationship) lines.push("Commercial relationship: " + profile.relationship + ".");
    lines.push("Planned placement: " + (profile.placement || "[describe where readers will see the disclosure]") + ".");
    return lines;
  }
  function buildModel() {
    var answers = {};
    data.questions.forEach(function (question) { answers[question.key] = document.getElementById("answer-" + question.key).value; });
    var profile = {
      projectName: text("project-name"), ownerOrTeam: text("owner-team"), channel: text("channel"),
      aiUse: text("ai-use"), humanRole: text("human-role"), relationship: text("relationship"),
      placement: text("placement"), notes: text("notes")
    };
    var results = data.ledger.frameworks.map(function (framework) {
      var frameworkTable = data.decisionTable[framework.id];
      var key = frameworkTable.signalKeys.map(function (questionKey) { return answers[questionKey] === "yes" ? "1" : "0"; }).join("");
      var base = frameworkTable.cases[key];
      var unknown = base.matchedAnswers.filter(function (matched) { return answers[matched.key] === "unsure"; });
      return Object.assign({}, base, {
        status: unknown.length ? "More information needed" : base.canonicalStatus,
        headline: unknown.length ? "More information is needed before using this screening result." : base.headline,
        detail: unknown.length ? "Verify the unanswered screening facts listed below. No applicability conclusion is made." : base.detail,
        matchedAnswers: base.matchedAnswers.map(function (matched) { return Object.assign({}, matched, { answer: answerLabels[answers[matched.key]] }); }),
        officialSources: officialSources(base.frameworkId)
      });
    });
    return {
      artifactName: "AI Disclosure Starter File", artifactVersion: data.artifactVersion,
      artifactTemplateVersion: data.artifactTemplateVersion, generatedOn: todayUtc(), sourceReviewStatus: "CURRENT",
      releaseBlocked: false,
      project: { projectName: profile.projectName || "Untitled project", ownerOrTeam: profile.ownerOrTeam || "Not provided", channel: profile.channel || "Not provided", notes: profile.notes || "None provided" },
      draftLines: buildDraft(profile),
      answers: data.questions.map(function (question) { return { key: question.key, prompt: question.prompt, answer: answerLabels[answers[question.key]] }; }),
      results: results,
      sourceMetadata: {
        legalSourceDataVersion: data.ledger.legalSourceDataVersion, checkerVersion: data.ledger.checkerVersion,
        lastSubstantiveHumanReviewDate: data.ledger.reviewStatus.lastSubstantiveHumanReviewDate,
        nextReviewDue: data.ledger.reviewStatus.nextReviewDue,
        lastAutomatedSourceCheckDate: data.ledger.reviewStatus.lastAutomatedSourceCheckDate
      },
      educationalLimitation: data.educationalLimitation
    };
  }
  function element(name, textValue, className) {
    var node = document.createElement(name);
    if (textValue !== undefined) node.textContent = textValue;
    if (className) node.className = className;
    return node;
  }
  function list(items) {
    var ul = element("ul");
    items.forEach(function (item) { ul.appendChild(element("li", item)); });
    return ul;
  }
  function renderPreview(model) {
    var root = document.getElementById("preview");
    root.replaceChildren();
    root.appendChild(element("h2", "Generated starter file"));
    root.appendChild(element("p", model.project.projectName + " · generated " + model.generatedOn, "preview-meta"));
    root.appendChild(element("h3", "Editable factual draft"));
    root.appendChild(list(model.draftLines));
    root.appendChild(element("p", "This draft restates user-entered facts. It is not required wording.", "note"));
    model.results.forEach(function (result) {
      var section = element("section", undefined, "result-card");
      section.appendChild(element("h3", result.frameworkName));
      section.appendChild(element("p", result.status, "result-state"));
      section.appendChild(element("p", result.headline, "headline"));
      section.appendChild(element("p", result.detail));
      section.appendChild(element("h4", "Matched answers"));
      section.appendChild(list(result.matchedAnswers.map(function (answer) { return answer.label + ": " + answer.answer; })));
      section.appendChild(element("h4", "Unresolved facts"));
      section.appendChild(list(result.unresolvedFacts));
      if (result.exampleDisclosure) {
        section.appendChild(element("h4", "Editable example"));
        section.appendChild(element("blockquote", result.exampleDisclosure.text));
        section.appendChild(element("p", result.exampleDisclosure.label, "note"));
      }
      section.appendChild(element("h4", "Official sources"));
      var sources = element("ul");
      result.officialSources.forEach(function (source) {
        var li = element("li");
        var link = element("a", source.authority + " — " + source.title);
        link.href = source.url; link.target = "_blank"; link.rel = "noopener noreferrer";
        li.appendChild(link); li.appendChild(document.createTextNode(" (retrieved " + source.retrievedAt + ")")); sources.appendChild(li);
      });
      section.appendChild(sources);
      section.appendChild(element("h4", "Provenance"));
      section.appendChild(list([
        "Source version: " + result.sourceVersion,
        "Substantive review date: " + result.substantiveReviewDate,
        "Next review due: " + result.nextReviewDue,
        "Automated source check: " + result.automatedSourceCheckDate + " (" + result.automatedSourceCheckStatus + ")",
        "Checker version: " + result.checkerVersion,
        "Template version: " + (result.templateVersion || "Not used")
      ]));
      root.appendChild(section);
    });
    root.appendChild(element("h3", "Educational limitation"));
    root.appendChild(element("p", model.educationalLimitation, "limitation"));
  }
  function markdown(model) {
    var lines = ["# " + escapeMarkdown(model.artifactName), "", "- Artifact version: " + escapeMarkdown(model.artifactVersion), "- Generated on: " + model.generatedOn, "- Source review status: " + model.sourceReviewStatus, "- Legal source data version: " + model.sourceMetadata.legalSourceDataVersion, "- Checker version: " + model.sourceMetadata.checkerVersion, "- Last substantive human review: " + model.sourceMetadata.lastSubstantiveHumanReviewDate, "- Next review due: " + model.sourceMetadata.nextReviewDue, "", "## Educational limitation", "", escapeMarkdown(model.educationalLimitation), "", "## Project record", "", "- Project: " + escapeMarkdown(model.project.projectName), "- Owner or team: " + escapeMarkdown(model.project.ownerOrTeam), "- Channel: " + escapeMarkdown(model.project.channel), "- Notes: " + escapeMarkdown(model.project.notes), "", "## Editable factual draft", ""];
    model.draftLines.forEach(function (line) { lines.push("- " + escapeMarkdown(line)); });
    lines.push("", "This draft restates user-entered facts. It is not required wording.", "", "## Screening answers", "");
    model.answers.forEach(function (answer) { lines.push("- " + escapeMarkdown(answer.prompt) + " **" + answer.answer + "**"); });
    lines.push("", "## Frameworks", "");
    model.results.forEach(function (result) {
      lines.push("### " + escapeMarkdown(result.frameworkName), "", "**Educational state:** " + result.status, "", "**Framework and jurisdiction:** " + escapeMarkdown(result.frameworkName) + " — " + escapeMarkdown(result.jurisdiction), "", escapeMarkdown(result.headline), "", escapeMarkdown(result.detail), "", "#### Matched answers", "");
      result.matchedAnswers.forEach(function (answer) { lines.push("- " + escapeMarkdown(answer.label) + ": **" + answer.answer + "**"); });
      lines.push("", "#### Unresolved facts", ""); result.unresolvedFacts.forEach(function (fact) { lines.push("- " + escapeMarkdown(fact)); });
      if (result.exampleDisclosure) lines.push("", "#### Editable example", "", "> " + escapeMarkdown(result.exampleDisclosure.text), "", escapeMarkdown(result.exampleDisclosure.label));
      lines.push("", "#### Official sources", ""); result.officialSources.forEach(function (source) { lines.push("- [" + escapeMarkdown(source.authority + " — " + source.title) + "](" + source.url + ") (retrieved " + source.retrievedAt + ")"); });
      lines.push("", "#### Provenance", "", "- Source version: " + result.sourceVersion, "- Substantive review date: " + result.substantiveReviewDate, "- Next review due: " + result.nextReviewDue, "- Automated source check: " + result.automatedSourceCheckDate + " (" + result.automatedSourceCheckStatus + ")", "- Checker version: " + result.checkerVersion, "- Template version: " + (result.templateVersion || "Not used"), "");
    });
    return lines.join("\n").trim() + "\n";
  }
  function printable(model) {
    var sections = model.results.map(function (result) {
      var matched = result.matchedAnswers.map(function (answer) { return "<li>" + escapeHtml(answer.label) + ": <strong>" + answer.answer + "</strong></li>"; }).join("");
      var facts = result.unresolvedFacts.map(function (fact) { return "<li>" + escapeHtml(fact) + "</li>"; }).join("");
      var sources = result.officialSources.map(function (source) { return '<li><a href="' + escapeHtml(source.url) + '">' + escapeHtml(source.authority + " — " + source.title) + "</a> (retrieved " + source.retrievedAt + ")</li>"; }).join("");
      var example = result.exampleDisclosure ? "<h4>Editable example</h4><blockquote>" + escapeHtml(result.exampleDisclosure.text) + "</blockquote><p>" + escapeHtml(result.exampleDisclosure.label) + "</p>" : "";
      return "<section><h3>" + escapeHtml(result.frameworkName) + "</h3><p class=state>" + result.status + "</p><p><strong>Framework and jurisdiction:</strong> " + escapeHtml(result.frameworkName + " — " + result.jurisdiction) + "</p><p><strong>" + escapeHtml(result.headline) + "</strong></p><p>" + escapeHtml(result.detail) + "</p><h4>Matched answers</h4><ul>" + matched + "</ul><h4>Unresolved facts</h4><ul>" + facts + "</ul>" + example + "<h4>Official sources</h4><ul>" + sources + "</ul><h4>Provenance</h4><ul><li>Source version: " + result.sourceVersion + "</li><li>Substantive review date: " + result.substantiveReviewDate + "</li><li>Next review due: " + result.nextReviewDue + "</li><li>Automated source check: " + result.automatedSourceCheckDate + " (" + result.automatedSourceCheckStatus + ")</li><li>Checker version: " + result.checkerVersion + "</li><li>Template version: " + (result.templateVersion || "Not used") + "</li></ul></section>";
    }).join("");
    var drafts = model.draftLines.map(function (line) { return "<li>" + escapeHtml(line) + "</li>"; }).join("");
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; connect-src \'none\'; img-src data:; font-src \'none\'; object-src \'none\'; frame-src \'none\'; form-action \'none\'; base-uri \'none\'"><title>' + escapeHtml(model.project.projectName) + ' — AI Disclosure Starter File</title><style>body{font:16px/1.55 system-ui,sans-serif;max-width:900px;margin:auto;padding:36px;color:#18231e}h1,h2,h3,h4{color:#123a2a}section{border-top:2px solid #d9e4df;margin-top:24px;padding-top:18px}.state{font-weight:700;color:#185f45}.limitation{border:2px solid #5a766a;padding:16px}a{color:#075b45}@media print{body{max-width:none;padding:0}a{color:inherit;text-decoration:none}a::after{content:" (" attr(href) ")";font-size:.85em}}</style></head><body><h1>AI Disclosure Starter File</h1><p><strong>Version:</strong> ' + model.artifactVersion + ' · <strong>Generated:</strong> ' + model.generatedOn + ' · <strong>Source review:</strong> CURRENT · <strong>Source data:</strong> ' + model.sourceMetadata.legalSourceDataVersion + ' · <strong>Checker:</strong> ' + model.sourceMetadata.checkerVersion + '</p><h2>Educational limitation</h2><p class="limitation">' + escapeHtml(model.educationalLimitation) + '</p><h2>Project record</h2><p><strong>Project:</strong> ' + escapeHtml(model.project.projectName) + '<br><strong>Owner or team:</strong> ' + escapeHtml(model.project.ownerOrTeam) + '<br><strong>Channel:</strong> ' + escapeHtml(model.project.channel) + '<br><strong>Notes:</strong> ' + escapeHtml(model.project.notes) + '</p><h2>Editable factual draft</h2><ul>' + drafts + '</ul><p>This draft restates user-entered facts. It is not required wording.</p><h2>Frameworks</h2>' + sections + '<footer><p>' + escapeHtml(model.educationalLimitation) + '</p></footer></body></html>\n';
  }
  function download(name, content, type) {
    if (!gate() || !currentModel) return;
    var objectUrl = URL.createObjectURL(new Blob([content], { type: type }));
    var link = document.createElement("a"); link.href = objectUrl; link.download = name; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 0);
  }
  document.getElementById("generate").addEventListener("click", function () {
    if (!gate()) return;
    currentModel = buildModel(); renderPreview(currentModel);
    document.getElementById("action-status").textContent = "Starter file generated in this browser tab. Nothing was sent anywhere."; gate();
  });
  document.getElementById("download-markdown").addEventListener("click", function () { download("ai-disclosure-starter-file.md", markdown(currentModel), "text/markdown;charset=utf-8"); });
  document.getElementById("download-html").addEventListener("click", function () { download("ai-disclosure-starter-file.html", printable(currentModel), "text/html;charset=utf-8"); });
  document.getElementById("print-output").addEventListener("click", function () { if (gate() && currentModel) window.print(); });
  window.addEventListener("beforeprint", function () { gate(); });
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      document.getElementById("starter-form").reset(); currentModel = null; gate();
    }
  });
  document.getElementById("starter-form").reset();
  gate();
}());`;
}

function sourceLedgerHtml(ledger) {
  return ledger.frameworks
    .map(
      (framework) => `<details>
<summary>${escapeHtml(framework.shortName)} — review due ${escapeHtml(framework.review.nextReviewDue)}</summary>
<p><strong>Source version:</strong> ${escapeHtml(framework.review.sourceDataVersion)}<br><strong>Substantive review:</strong> ${escapeHtml(framework.review.lastSubstantiveHumanReviewDate)}<br><strong>Reviewer:</strong> ${escapeHtml(framework.review.reviewer)}<br><strong>Automated check:</strong> ${escapeHtml(framework.review.lastAutomatedSourceCheckDate)} (${escapeHtml(framework.review.automatedSourceCheckStatus)})</p>
<ul>${framework.officialSources
        .map(
          (source) =>
            `<li><a href="${escapeHtml(source.canonicalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.authority)} — ${escapeHtml(source.title)}</a></li>`,
        )
        .join("")}</ul>
</details>`,
    )
    .join("\n");
}

function renderToolHtml({ ledger, decisionTable }) {
  const blocked = ledger.reviewStatus.overdue;
  const questions = canonicalQuestionDefinitions();
  const toolData = {
    artifactVersion: ARTIFACT_VERSION,
    artifactTemplateVersion: STARTER_TEMPLATE_VERSION,
    questionOrder: QUESTION_ORDER,
    questions,
    decisionTable,
    ledger,
    educationalLimitation: EDUCATIONAL_LIMITATION,
  };
  const questionFields = questions
    .map(
      (question, index) => `<div class="question-row">
<label for="answer-${escapeHtml(question.key)}"><span>${index + 1}.</span> ${escapeHtml(question.prompt)}</label>
<select id="answer-${escapeHtml(question.key)}" name="${escapeHtml(question.key)}">
<option value="unsure" selected>Not sure</option><option value="yes">Yes</option><option value="no">No</option>
</select>
</div>`,
    )
    .join("\n");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'">
<meta name="referrer" content="no-referrer">
<title>AI Disclosure Starter File</title>
<style>
:root{color-scheme:light;--ink:#18231e;--green:#0d5b42;--green-dark:#103d2e;--paper:#fbfdfb;--soft:#edf5f1;--line:#cbdad3;--danger:#7f1d1d;--danger-bg:#fff1f1}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:#075b45;text-underline-offset:3px}.skip{position:absolute;left:-9999px}.skip:focus{left:12px;top:12px;background:#fff;padding:12px;z-index:10}.shell{width:min(1100px,calc(100% - 32px));margin:auto}.hero{background:var(--green-dark);color:#fff;padding:40px 0}.hero h1{margin:0 0 8px;font-size:clamp(2rem,5vw,3.4rem);line-height:1.05}.hero p{max-width:760px;margin:8px 0}.badge{display:inline-block;padding:5px 10px;border:1px solid #a8d8c7;border-radius:999px;font-weight:700}.overdue{margin:24px auto;padding:18px;border:3px solid var(--danger);border-radius:10px;background:var(--danger-bg);color:var(--danger)}main{padding:30px 0 60px}.grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,.9fr);gap:28px}.panel{background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px;box-shadow:0 8px 25px rgba(16,61,46,.06)}h2,h3,h4{color:var(--green-dark);line-height:1.2}h2{margin-top:0}.privacy{padding:14px;background:var(--soft);border-left:5px solid var(--green)}fieldset{border:0;padding:0;margin:26px 0}legend{font-size:1.25rem;font-weight:750;color:var(--green-dark);margin-bottom:12px}.field{margin:0 0 18px}.field label,.question-row label{display:block;font-weight:680;margin-bottom:6px}.field input,.field textarea,.field select,.question-row select{width:100%;min-height:46px;border:2px solid #829b90;border-radius:7px;padding:9px 11px;font:inherit;background:#fff}.field textarea{min-height:88px;resize:vertical}.question-row{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:14px;align-items:end;padding:15px 0;border-bottom:1px solid var(--line)}button{min-height:46px;border:0;border-radius:8px;padding:11px 16px;font:700 1rem/1.2 inherit;cursor:pointer;background:var(--green);color:#fff}button.secondary{background:#e3eee9;color:var(--green-dark);border:2px solid var(--green)}button:disabled{cursor:not-allowed;opacity:.48}.actions{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0}.status{min-height:28px;font-weight:700}.metadata{font-size:.94rem}.metadata dt{font-weight:750;margin-top:10px}.metadata dd{margin:0;overflow-wrap:anywhere}details{border-top:1px solid var(--line);padding:12px 0}summary{cursor:pointer;font-weight:700}.limitation,.note{padding:12px;background:#f5f7f6;border-left:4px solid #71887e}.preview{margin-top:28px}.preview:empty{display:none}.preview-meta{color:#52655d}.result-card{border-top:3px solid var(--line);padding-top:18px;margin-top:24px}.result-state{display:inline-block;background:var(--soft);color:var(--green-dark);border-radius:999px;padding:4px 10px;font-weight:800}.headline{font-weight:700}blockquote{border-left:4px solid var(--green);padding-left:14px;margin-left:0}.print-refusal{display:none}@media(max-width:800px){.grid{grid-template-columns:1fr}.question-row{grid-template-columns:1fr}.question-row select{width:100%}}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}@media print{body.review-overdue .page-content{display:none!important}body.review-overdue .print-refusal{display:block!important;color:#7f1d1d;border:4px solid #7f1d1d;padding:32px;font-size:22px}.hero,.sidebar,.form-panel>h2,.form-panel>.privacy,.form-panel form{display:none}.grid{display:block}.panel{border:0;box-shadow:none;padding:0}.preview{display:block}.result-card{break-inside:avoid}a{color:inherit;text-decoration:none}a::after{content:" (" attr(href) ")";font-size:.8em}}
</style>
</head>
<body class="${blocked ? "review-overdue" : ""}">
<div class="print-refusal"><strong>SOURCE REVIEW OVERDUE</strong><p>This file refuses printable output until the embedded official-source records receive substantive review.</p></div>
<div class="page-content">
<a class="skip" href="#main">Skip to the tool</a>
<header class="hero"><div class="shell"><span class="badge">Offline one-time starter file · version ${ARTIFACT_VERSION}</span><h1>AI Disclosure Starter File</h1><p>Turn your own project facts into an editable disclosure record, a five-framework educational screen, Markdown, and printable HTML—without an account, an AI service, or a data upload.</p></div></header>
<div id="overdue-banner" class="overdue shell" role="alert" ${blocked ? "" : "hidden"}><strong>SOURCE REVIEW OVERDUE — RELEASE AND EXPORT REFUSED</strong><br>The embedded source review was due ${escapeHtml(ledger.reviewStatus.nextReviewDue)}. Generation, download, and printing stay disabled until the canonical source ledger records a new substantive review.</div>
<main id="main" class="shell">
<div class="grid">
<section class="panel form-panel" aria-labelledby="tool-heading">
<h2 id="tool-heading">Build the starter file</h2>
<p class="privacy"><strong>Private by design:</strong> entries stay only in this open browser tab. This file has no server, account, analytics, storage, AI, or automatic network requests. Only clicking an official-source link leaves the file.</p>
<form id="starter-form" autocomplete="off" onsubmit="return false">
<fieldset><legend>Project facts</legend>
<div class="field"><label for="project-name">Project or brand name</label><input id="project-name" maxlength="120" autocomplete="off"></div>
<div class="field"><label for="owner-team">Owner or team (optional)</label><input id="owner-team" maxlength="120" autocomplete="off"></div>
<div class="field"><label for="channel">Channel or placement type</label><input id="channel" maxlength="120" placeholder="Website, ad, chatbot, social post…" autocomplete="off"></div>
<div class="field"><label for="ai-use">What does AI assist with?</label><textarea id="ai-use" maxlength="500" autocomplete="off" placeholder="Describe the task and output in factual terms."></textarea></div>
<div class="field"><label for="human-role">What does a person review, decide, or edit?</label><textarea id="human-role" maxlength="500" autocomplete="off"></textarea></div>
<div class="field"><label for="relationship">Commercial relationship, if any</label><textarea id="relationship" maxlength="500" autocomplete="off" placeholder="Payment, gift, affiliate relationship, employment, or none."></textarea></div>
<div class="field"><label for="placement">Where will readers encounter the disclosure?</label><textarea id="placement" maxlength="300" autocomplete="off"></textarea></div>
<div class="field"><label for="notes">Internal notes (avoid confidential or sensitive information)</label><textarea id="notes" maxlength="2000" autocomplete="off"></textarea></div>
</fieldset>
<fieldset><legend>Screening facts</legend><p>Choose “Not sure” when a fact is unresolved. The corresponding framework will say “More information needed.”</p>${questionFields}</fieldset>
<div class="actions"><button id="generate" type="button" ${blocked ? "disabled" : ""}>Generate starter file</button><button id="download-markdown" class="secondary" type="button" disabled>Download Markdown</button><button id="download-html" class="secondary" type="button" disabled>Download printable HTML</button><button id="print-output" class="secondary" type="button" disabled>Print / save PDF</button></div>
<p id="action-status" class="status" role="status" aria-live="polite">${blocked ? "SOURCE REVIEW OVERDUE. Generation, download, and printing are disabled." : "Nothing has been generated or stored."}</p>
</form>
<article id="preview" class="preview" aria-live="polite"></article>
</section>
<aside class="panel sidebar" aria-labelledby="about-heading"><h2 id="about-heading">What this file does</h2><ul><li>Restates facts you type; it does not invent project facts.</li><li>Shows educational states, matched answers, unresolved facts, official sources, and provenance.</li><li>Creates editable Markdown and self-contained printable HTML while the source review is current.</li></ul><p class="limitation">${escapeHtml(EDUCATIONAL_LIMITATION)}</p><h3>Embedded release metadata</h3><dl class="metadata"><dt>Artifact</dt><dd>${ARTIFACT_VERSION}</dd><dt>Template</dt><dd>${STARTER_TEMPLATE_VERSION}</dd><dt>Source catalog</dt><dd>${escapeHtml(ledger.legalSourceDataVersion)}</dd><dt>Checker</dt><dd>${escapeHtml(ledger.checkerVersion)}</dd><dt>Substantive review</dt><dd>${escapeHtml(ledger.reviewStatus.lastSubstantiveHumanReviewDate)}</dd><dt>Next review due</dt><dd>${escapeHtml(ledger.reviewStatus.nextReviewDue)}</dd><dt>Automated source check</dt><dd>${escapeHtml(ledger.reviewStatus.lastAutomatedSourceCheckDate)}</dd><dt>Build status</dt><dd>${escapeHtml(ledger.reviewStatus.state)}</dd></dl><h3>Official-source ledger</h3>${sourceLedgerHtml(ledger)}</aside>
</div>
</main>
</div>
<script>window.STARTER_FILE_DATA=${serializeForInlineScript(toolData)};</script>
<script>${browserApplicationSource()}</script>
</body>
</html>\n`;
}

function renderSourceLedgerMarkdown(ledger) {
  const lines = [
    "# Source ledger",
    "",
    ledger.reviewStatus.overdue
      ? "> **SOURCE REVIEW OVERDUE — DO NOT RELEASE THIS PRODUCT.**"
      : "> Source review gate is current as of the build date. Complete the owner release review before distribution.",
    "",
    `- Ledger schema: ${ledger.schemaVersion}`,
    `- Artifact version: ${ledger.artifactVersion}`,
    `- Artifact template: ${ledger.artifactTemplateVersion}`,
    `- Legal source data: ${ledger.legalSourceDataVersion}`,
    `- Checker: ${ledger.checkerVersion}`,
    `- Assembled as of: ${ledger.assembledAsOf}`,
    `- Substantive review: ${ledger.reviewStatus.lastSubstantiveHumanReviewDate}`,
    `- Next review due: ${ledger.reviewStatus.nextReviewDue}`,
    `- Automated source check: ${ledger.reviewStatus.lastAutomatedSourceCheckDate}`,
    `- State: ${ledger.reviewStatus.state}`,
    "",
    "Automated retrieval does not replace substantive human review. The linked official sources control.",
    "",
  ];
  for (const framework of ledger.frameworks) {
    lines.push(
      `## ${framework.shortName}`,
      "",
      `- Jurisdiction: ${framework.jurisdiction}`,
      `- Catalog status: ${framework.legalStatus}`,
      `- Timing summary: ${framework.timingSummary}`,
      `- Source version: ${framework.review.sourceDataVersion}`,
      `- Checker version: ${framework.review.checkerVersion}`,
      `- Template version: ${framework.review.templateVersion ?? "Not used"}`,
      `- Substantive review: ${framework.review.lastSubstantiveHumanReviewDate}`,
      `- Next review due: ${framework.review.nextReviewDue}`,
      `- Reviewer: ${framework.review.reviewer}`,
      `- Automated check: ${framework.review.lastAutomatedSourceCheckDate} (${framework.review.automatedSourceCheckStatus})`,
      `- Automated-check note: ${framework.review.automatedSourceCheckNote}`,
      "",
      "### Official sources",
      "",
      ...framework.officialSources.map(
        (source) =>
          `- **${source.authority} — ${source.title}.** ${source.canonicalUrl}\\\n  Source ID: ${source.sourceId}; type: ${source.sourceType}; status: ${source.legalStatus}; binding effect: ${source.bindingEffect}; retrieved: ${source.retrievedAt}.${source.documentId ? ` Document: ${source.documentId}.` : ""}${source.contentSha256 ? ` SHA-256: ${source.contentSha256}.` : ""}${source.notes ? ` Note: ${source.notes}` : ""}`,
      ),
      "",
    );
  }
  lines.push("## Educational limitation", "", EDUCATIONAL_LIMITATION, "");
  return `${lines.join("\n").trim()}\n`;
}

function renderReadme(ledger) {
  const warning = ledger.reviewStatus.overdue
    ? "# SOURCE REVIEW OVERDUE — DO NOT SELL, SHIP, OR REPRESENT THIS BUNDLE AS CURRENT\n\nThe canonical substantive review was due " +
      `${ledger.reviewStatus.nextReviewDue}. The tool refuses generation, download, and printing until the canonical source records are reviewed and rebuilt.\n\n`
    : "";
  return `${warning}# AI Disclosure Starter File v${ARTIFACT_VERSION}

One-time product price: **$19**. This directory is the complete offline product; it does not include checkout or payment processing.

## Start

Open \`ai-disclosure-starter-file.html\` in a current browser. No installation, account, internet connection, or AI service is needed. Official-source links open only when the user chooses one.

## Included

- A browser-local project facts worksheet.
- Eight deterministic screening facts tied to the public AI Policy File checker.
- Five framework records with matched answers, unresolved facts, official sources, and review/version metadata.
- An editable factual disclosure draft assembled only from user-entered text and visible placeholders.
- Markdown and self-contained printable HTML export while source review is current.
- A synthetic sample output, source ledger in Markdown and JSON, license, and hash manifest.

## Embedded source snapshot

- Legal source data: \`${ledger.legalSourceDataVersion}\`
- Checker: \`${ledger.checkerVersion}\`
- Last substantive human review: \`${ledger.reviewStatus.lastSubstantiveHumanReviewDate}\`
- Next scheduled review due: \`${ledger.reviewStatus.nextReviewDue}\`
- Last automated source check: \`${ledger.reviewStatus.lastAutomatedSourceCheckDate}\`
- Build-time review state: \`${ledger.reviewStatus.state}\`

## Privacy boundary

The tool keeps entries in the open tab only. It does not use cookies, local storage, session storage, IndexedDB, service workers, analytics, form submission, \`fetch\`, XHR, WebSockets, beacons, APIs, or AI. Closing or refreshing the tab discards entries; returning through browser history also resets the form. Downloads are created locally with a browser Blob. The only outbound action available is a user click on a listed official-source HTTPS link.

Do not enter confidential, privileged, health, financial, credential, secret, or other sensitive information.

## Important limitation

${EDUCATIONAL_LIMITATION}

The editable examples are starting points, not required wording. “Worth reviewing,” “Possible relevance,” “Lower apparent relevance,” and “More information needed” are educational screening states, not individualized legal conclusions.

## Release gate

The build compares its UTC build date with every framework's next substantive-review due date. If any review is overdue:

1. every generated file carries \`SOURCE REVIEW OVERDUE\`;
2. the HTML tool disables generation, downloads, and printing (including print-CSS refusal);
3. \`manifest.json\` sets \`releaseReady\` to \`false\`; and
4. the build command exits nonzero after writing the blocked bundle for inspection.

There is no command-line date override. Updating source-review dates requires the separate canonical source-review workflow; editing this bundle is not a release fix.

## File map

- \`ai-disclosure-starter-file.html\` — self-contained offline tool.
- \`SAMPLE_OUTPUT.md\` and \`SAMPLE_OUTPUT.html\` — synthetic example with the same release state.
- \`SOURCE_LEDGER.md\` and \`source-ledger.json\` — official-source and review records copied from the canonical catalog at build time.
- \`BUSINESS-LICENSE.txt\` — buyer license and boundaries.
- \`manifest.json\` — artifact version, gate state, SHA-256 hashes, and byte counts.

The merchant-upload archive is \`${ARTIFACT_DIRECTORY}.zip\`; it contains this versioned directory and exactly the entries declared by \`manifest.json\`.

## Support and 14-day refund

For product-file problems, use the verified seller support channel shown at checkout. You may request a full refund for any reason within 14 calendar days after purchase. Include the order ID and purchase email, but never send card or bank details. The seller validates the order and initiates the refund through the merchant of record to the original payment method; provider and financial-institution posting times apply, and mandatory rights remain intact.

A confirmed full refund ends hosted download access and the business-use license for the blank product files. Stop using or distributing those files and delete or destroy copies under your control. Downloaded files cannot be remotely erased. Lawful completed outputs created and published before the refund do not need to be retracted or destroyed, but no new use of the blank files is permitted.

Source or wording questions should be verified against the official links in the ledger. This product does not include ongoing monitoring or alerts.
`;
}

function renderLicense() {
  return `AI DISCLOSURE STARTER FILE — SINGLE-PURCHASE LICENSE v1.0

Copyright (c) 2026 AI Policy File. All rights reserved except for the limited license below.

After one authorized $19 purchase, one purchasing business receives a limited, non-exclusive, non-transferable license to use, copy, edit, print, and export this artifact for that business's own operations and channels. Its employees and contractors may use the files only while acting for that business. The business may publish disclosure text it creates with the artifact.

The purchasing business may not resell, sublicense, share, post, publish, or redistribute the blank artifact, its source-ledger compilation, or substantially equivalent copies as a template, product, library, hosted service, or client deliverable. An agency or consultant needs a separate license for each client business whose operations are entered into the file. One purchase does not include updates, alerts, hosting, accounts, consulting, or ongoing source review.

If the purchase is fully refunded, hosted download access and the business-use license for the blank product files end when the merchant confirms the refund. The purchasing business must stop using or distributing the blank product files and delete or destroy every copy under its control. Files already downloaded cannot be remotely erased. A full refund does not require the business to retract or destroy lawful disclosure text or other completed outputs that it created and published before the refund, but it may not make any new use of the blank product files after the refund. Mandatory consumer rights remain unaffected.

This license also ends after a material breach that is not cured after notice. Ending the license does not require retraction or destruction of lawful completed outputs created and published before termination, but it permits no new use of the blank product files.

Official government and regulator materials remain subject to their own terms and public-law status. This license does not claim ownership of those materials or their links.

THE ARTIFACT IS AN EDUCATIONAL DRAFTING AID, NOT LEGAL ADVICE OR A LEGAL SERVICE. IT DOES NOT DECIDE APPLICABILITY OR PROMISE THAT ANY TEXT IS SUFFICIENT FOR A PARTICULAR USE. OFFICIAL SOURCES CONTROL. THE BUYER IS RESPONSIBLE FOR VERIFYING CURRENT SOURCES, PROJECT FACTS, AND FINAL TEXT.

The artifact is provided as-is to the extent permitted by applicable law. Any checkout refund policy and mandatory consumer rights presented at purchase control over inconsistent language here.
`;
}

function sampleProfile() {
  return {
    projectName: "Sample Neighborhood Studio",
    ownerOrTeam: "Example content team",
    channel: "Website article and social post",
    aiUse: "outlining and first-draft copy for educational posts",
    humanRole: "an editor checks sources, revises the text, and approves publication",
    relationship: "no paid, gifted, affiliate, or employment relationship reported for this sample",
    placement: "a short note beside the article byline and in the social caption",
    notes: "Synthetic example only; not a real customer or project.",
  };
}

function sampleAnswers() {
  return {
    publish: "yes",
    sponsored: "no",
    humanReview: "yes",
    euAudience: "unsure",
    deepfakes: "no",
    nyAds: "no",
    chatbot: "no",
    bigProvider: "no",
  };
}

function ensureOutputPathAllowed(outputRoot) {
  const resolvedRoot = path.resolve(outputRoot);
  const relative = path.relative(starterProductRoot, resolvedRoot);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Output root must stay within ${starterProductRoot}`);
  }
  return resolvedRoot;
}

export async function buildStarterFile({ outputRoot = defaultOutputRoot, asOfDate = todayUtc() } = {}) {
  const safeOutputRoot = ensureOutputPathAllowed(outputRoot);
  const outputDirectory = path.join(safeOutputRoot, ARTIFACT_DIRECTORY);
  const archivePath = path.join(safeOutputRoot, `${ARTIFACT_DIRECTORY}.zip`);
  const relativeOutput = path.relative(starterProductRoot, outputDirectory);
  if (relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    throw new Error("Resolved artifact directory escaped product/starter-file");
  }

  const ledger = buildSourceLedger({ asOfDate });
  const decisionTable = buildDecisionTable(asOfDate, ledger);
  const sample = createProductOutput({
    answers: sampleAnswers(),
    profile: sampleProfile(),
    asOfDate,
  });
  const files = {
    "ai-disclosure-starter-file.html": renderToolHtml({ ledger, decisionTable }),
    "README.txt": renderReadme(ledger),
    "BUSINESS-LICENSE.txt": renderLicense(),
    "SOURCE_LEDGER.md": renderSourceLedgerMarkdown(ledger),
    "source-ledger.json": prettyStableJson(ledger),
    "SAMPLE_OUTPUT.md": renderMarkdownOutput(sample),
    "SAMPLE_OUTPUT.html": renderPrintableOutput(sample),
  };

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  for (const [fileName, content] of Object.entries(files).sort(([left], [right]) => left.localeCompare(right))) {
    await writeFile(path.join(outputDirectory, fileName), content, "utf8");
  }

  const manifest = {
    schemaVersion: "ai-disclosure-starter-file-manifest-v1",
    product: "AI Disclosure Starter File",
    price: { amount: 19, currency: "USD", cadence: "one_time" },
    artifactVersion: ARTIFACT_VERSION,
    artifactDirectory: ARTIFACT_DIRECTORY,
    builtAsOf: asOfDate,
    releaseReady: !ledger.reviewStatus.overdue,
    releaseStatus: ledger.reviewStatus.overdue
      ? "blocked_source_review_overdue"
      : "source_gate_passed_owner_release_review_required",
    sourceReviewStatus: ledger.reviewStatus,
    versions: {
      artifactTemplate: STARTER_TEMPLATE_VERSION,
      sourceLedgerSchema: SOURCE_LEDGER_SCHEMA_VERSION,
      legalSourceData: ledger.legalSourceDataVersion,
      checker: ledger.checkerVersion,
    },
    privacyBoundary:
      "Browser memory only; no storage, analytics, AI, server, or automatic network requests. User-clicked official-source links are the only outbound path.",
    archive: {
      format: "zip_store",
      rootDirectory: ARTIFACT_DIRECTORY,
      deterministicTimestamp: `${asOfDate}T00:00:00`,
      entries: [...Object.keys(files), "manifest.json"]
        .sort((left, right) => left.localeCompare(right))
        .map((fileName) => `${ARTIFACT_DIRECTORY}/${fileName}`),
    },
    files: Object.entries(files)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([fileName, content]) => ({
        path: fileName,
        bytes: byteLength(content),
        sha256: sha256(content),
      })),
  };
  const manifestContent = prettyStableJson(manifest);
  await writeFile(path.join(outputDirectory, "manifest.json"), manifestContent, "utf8");
  const archive = createDeterministicZip(
    [...Object.entries(files), ["manifest.json", manifestContent]].map(([fileName, content]) => [
      `${ARTIFACT_DIRECTORY}/${fileName}`,
      content,
    ]),
    asOfDate,
  );
  await rm(archivePath, { force: true });
  await writeFile(archivePath, archive);

  return {
    outputDirectory,
    archivePath,
    archiveBytes: archive.length,
    archiveSha256: sha256(archive),
    ledger,
    manifest,
  };
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  try {
    const result = await buildStarterFile();
    console.log(`Built ${result.outputDirectory}`);
    console.log(`Built ${result.archivePath} (${result.archiveBytes} bytes; SHA-256 ${result.archiveSha256})`);
    console.log(`Release status: ${result.manifest.releaseStatus}`);
    assertReleaseReady(result.manifest);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = error instanceof SourceReviewOverdueError ? error.exitCode : 1;
  }
}
