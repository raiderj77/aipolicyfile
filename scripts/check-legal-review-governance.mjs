import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { CORRECTIONS } from "../src/lib/corrections.ts";
import {
  CHECKER_VERSION,
  LAWS,
  LEGAL_REVIEW_DATE,
  LEGAL_REVIEWER,
  LEGAL_SOURCE_DATA_VERSION,
  NEXT_LEGAL_REVIEW_DUE,
} from "../src/lib/laws.ts";
import {
  LEGAL_REVIEW_RECORDS,
  REVIEW_FRAMEWORK_IDS,
  assertLegalReviewRegistryIntegrity,
  getReviewAuthorization,
} from "../src/lib/legalReviewRecords.ts";

const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(moduleDirectory, "..");
const LEGAL_CONTENT_FILES = [
  "src/lib/laws.ts",
  "src/lib/lawPages.ts",
  "src/lib/corrections.ts",
  "src/lib/lawTracker.ts",
  "src/lib/llmsText.ts",
  "src/lib/answerPages.ts",
  "src/app/checker/CheckerClient.tsx",
  "src/app/laws/[slug]/page.tsx",
  "src/app/corrections/page.tsx",
  "src/app/tracker/page.tsx",
  "src/components/SourceReviewNotice.tsx",
  "scripts/build-starter-file.mjs",
];

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

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function exactSet(actual, expected) {
  return actual.length === expected.length && new Set(actual).size === actual.length && expected.every((item) => actual.includes(item));
}

function reviewableFramework(law) {
  const excluded = new Set([
    "reviewRecordId",
    "lastSubstantiveHumanReviewDate",
    "nextReviewDue",
    "reviewer",
  ]);
  const sourceReviewMetadata = Object.fromEntries(
    Object.entries(law.review).filter(([key]) => !excluded.has(key)),
  );
  return { ...law, review: sourceReviewMetadata };
}

function reviewableCorrection(correction) {
  return Object.fromEntries(Object.entries(correction).filter(([key]) => key !== "status"));
}

function normalizedLegalContentFile(relativePath) {
  let content = readFileSync(path.join(repositoryRoot, relativePath), "utf8").replaceAll("\r\n", "\n");
  if (relativePath === "src/lib/laws.ts") {
    content = content
      .replace(
        /^export const LEGAL_REVIEW_RECORD_ID = "[^"]+";$/m,
        'export const LEGAL_REVIEW_RECORD_ID = "<review-record-id>";',
      )
      .replace(
        /^export const LAST_AUTOMATED_SOURCE_CHECK_DATE = "[^"]+";$/m,
        'export const LAST_AUTOMATED_SOURCE_CHECK_DATE = "<automated-check-date>";',
      )
      .replace(
        /^export const LAST_AUTOMATED_SOURCE_CHECK_LABEL = "[^"]+";$/m,
        'export const LAST_AUTOMATED_SOURCE_CHECK_LABEL = "<automated-check-label>";',
      );
  }
  if (relativePath === "src/lib/corrections.ts") {
    content = content.replace(
      /^(\s+)status: "corrected(?:-review-overdue)?",$/gm,
      '$1status: "<review-approval-state>",',
    );
  }
  return content;
}

export function calculateLegalContentSha256() {
  return sha256(
    stableJson({
      schemaVersion: 1,
      legalSourceDataVersion: LEGAL_SOURCE_DATA_VERSION,
      checkerVersion: CHECKER_VERSION,
      frameworks: Object.values(LAWS).map(reviewableFramework),
      corrections: CORRECTIONS.map(reviewableCorrection),
      files: LEGAL_CONTENT_FILES.map((relativePath) => ({
        path: relativePath,
        sha256: sha256(normalizedLegalContentFile(relativePath)),
      })),
    }),
  );
}

export function validateSignedCurrentRecord(record, errors = [], context = {}) {
  const laws = context.laws ?? LAWS;
  const corrections = context.corrections ?? CORRECTIONS;
  const legalSourceDataVersion = context.legalSourceDataVersion ?? LEGAL_SOURCE_DATA_VERSION;
  const checkerVersion = context.checkerVersion ?? CHECKER_VERSION;
  const legalContentSha256 = context.legalContentSha256 ?? calculateLegalContentSha256();
  if (record.sourceDataVersion !== legalSourceDataVersion) {
    errors.push(`${record.id}: sourceDataVersion does not match ${legalSourceDataVersion}`);
  }
  if (record.checkerVersion !== checkerVersion) {
    errors.push(`${record.id}: checkerVersion does not match ${checkerVersion}`);
  }

  const expectedTemplates = [...new Set(Object.values(laws).map((law) => law.review.templateVersion).filter(Boolean))].sort();
  const recordedTemplates = [...record.templateVersions].sort();
  if (!exactSet(recordedTemplates, expectedTemplates)) {
    errors.push(`${record.id}: templateVersions do not match the current catalog`);
  }

  const expectedCorrections = corrections.map((correction) => correction.id).sort();
  const recordedCorrections = Object.keys(record.correctionDispositions).sort();
  if (!exactSet(recordedCorrections, expectedCorrections)) {
    errors.push(`${record.id}: correction dispositions do not match the current correction register`);
  }
  for (const correction of corrections) {
    if (record.correctionDispositions[correction.id] === "reject_escalate") {
      errors.push(`${record.id}: rejected correction ${correction.id} cannot clear currentness`);
    }
    if (correction.status !== "corrected") {
      errors.push(`${record.id}: correction ${correction.id} must be linked as corrected before currentness clears`);
    }
  }

  const expectedSources = Object.values(laws)
    .flatMap((law) =>
      law.officialSources.map((source) => ({
        frameworkId: law.id,
        sourceId: source.sourceId,
        canonicalUrl: source.canonicalUrl,
      })),
    )
    .sort((left, right) => left.sourceId.localeCompare(right.sourceId));
  const recordedSources = [...record.officialSources].sort((left, right) => left.sourceId.localeCompare(right.sourceId));
  if (recordedSources.length !== expectedSources.length || new Set(recordedSources.map((source) => source.sourceId)).size !== recordedSources.length) {
    errors.push(`${record.id}: every current official source must appear exactly once`);
  } else {
    for (let index = 0; index < expectedSources.length; index += 1) {
      const expected = expectedSources[index];
      const actual = recordedSources[index];
      if (
        actual.sourceId !== expected.sourceId ||
        actual.frameworkId !== expected.frameworkId ||
        actual.canonicalUrl !== expected.canonicalUrl
      ) {
        errors.push(`${record.id}: official source ${expected.sourceId} does not match the current catalog`);
      }
      if (actual.retrievedBy !== "manual" && actual.retrievedBy !== "both") {
        errors.push(`${record.id}: official source ${expected.sourceId} is not manually verified`);
      }
    }
  }

  const expectedAccessLimited = Object.values(laws)
    .flatMap((law) =>
      law.review.automatedAccessLimitedSourceIds.map((sourceId) => `${law.id}:${sourceId}`),
    )
    .sort();
  const recordedAccessLimited = record.accessLimitedResolutions
    .map((resolution) => `${resolution.frameworkId}:${resolution.sourceId}`)
    .sort();
  if (!exactSet(recordedAccessLimited, expectedAccessLimited)) {
    errors.push(`${record.id}: manual access-limited resolutions do not cover the current catalog`);
  }
  const expectedAllowlist = Object.values(laws)
    .flatMap((law) =>
      law.review.automatedAllowlistSourceIds.map((sourceId) => `${law.id}:${sourceId}`),
    )
    .sort();
  const allowlistDecisionKeys = record.automationAllowlistDecisions.map(
    (decision) => `${decision.frameworkId}:${decision.sourceId}`,
  );
  if (new Set(allowlistDecisionKeys).size !== allowlistDecisionKeys.length) {
    errors.push(`${record.id}: automation allowlist decisions must be unique`);
  }
  for (const expectedKey of expectedAllowlist) {
    const decision = record.automationAllowlistDecisions.find(
      (item) => `${item.frameworkId}:${item.sourceId}` === expectedKey,
    );
    if (!decision || decision.decision === "remove_stale_allowlist_implemented") {
      errors.push(`${record.id}: current automation allowlist source ${expectedKey} lacks a matching retained/revised decision`);
    }
  }
  for (const decision of record.automationAllowlistDecisions) {
    const key = `${decision.frameworkId}:${decision.sourceId}`;
    const law = laws[decision.frameworkId];
    if (!law?.officialSources.some((source) => source.sourceId === decision.sourceId)) {
      errors.push(`${record.id}: automation allowlist decision ${key} is not a current official source`);
    }
    if (
      expectedAllowlist.includes(key) ===
      (decision.decision === "remove_stale_allowlist_implemented")
    ) {
      errors.push(`${record.id}: automation allowlist decision ${key} does not match current monitor configuration`);
    }
  }
  const sb1000Source = laws.caSb942?.officialSources.find(
    (source) => source.sourceId === "ca-sb1000-2025-2026",
  );
  const sb1000TextSource = laws.caSb942?.officialSources.find(
    (source) => source.sourceId === "ca-sb1000-2025-2026-text",
  );
  const catalogSb1000Outcome = (source) => {
    if (
      source?.legalStatus === "passed_legislature_not_chaptered" &&
      source.bindingEffect === "not_current_law"
    ) {
      return "not_chaptered";
    }
    if (
      (source?.legalStatus === "enacted" && source.bindingEffect === "enacted_amendment") ||
      (source?.legalStatus === "in_force" && source.bindingEffect === "binding_statute")
    ) {
      return "chaptered_integrated_and_reviewed";
    }
    return null;
  };
  const statusOutcome = catalogSb1000Outcome(sb1000Source);
  const textOutcome = catalogSb1000Outcome(sb1000TextSource);
  let expectedSb1000Status = null;
  if (!statusOutcome || !textOutcome || statusOutcome !== textOutcome) {
    errors.push(
      `${record.id}: SB 1000 status and text catalog entries are missing, unsupported, or inconsistent`,
    );
  } else {
    expectedSb1000Status = statusOutcome;
  }
  if (
    expectedSb1000Status &&
    (record.sb1000StatusCheck.status !== expectedSb1000Status ||
      record.sb1000OwnerAuthorizationCheck.status !== expectedSb1000Status)
  ) {
    errors.push(
      `${record.id}: SB 1000 review outcome does not match the current catalog status (${sb1000Source?.legalStatus ?? "missing"})`,
    );
  }

  if (record.legalContentSha256 !== legalContentSha256) {
    errors.push(`${record.id}: legal-content fingerprint does not match the reviewed implementation`);
  }
  return errors;
}

function occurrenceCount(text, value) {
  if (!value) return 0;
  return text.split(value).length - 1;
}

function evidenceFieldValues(text, label) {
  const prefix = `**${label}:** `;
  return text
    .split(/\r?\n/)
    .filter((line) => line.startsWith(prefix))
    .map((line) => line.slice(prefix.length).trimEnd());
}

function evidenceBindingForRecord(record) {
  return {
    schemaVersion: 1,
    recordStatus: record.status,
    recordId: record.id,
    reviewDate: record.reviewDate,
    nextReviewDue: record.nextReviewDue,
    reviewer: {
      name: record.reviewer,
      roleQualification: record.reviewerRoleQualification,
      signature: record.reviewerSignature,
      signedAt: record.reviewerSignedAt,
    },
    owner: {
      name: record.ownerName,
      role: record.ownerRole,
    },
    overallDecision: record.overallDecision,
    ownerDecision: record.ownerDecision,
    cadenceBasis: record.cadenceBasis,
    unresolvedConditions: record.unresolvedConditions,
    frameworkIds: record.frameworkIds,
    frameworkDispositions: record.frameworkDispositions,
    correctionDispositions: record.correctionDispositions,
    sourceDataVersion: record.sourceDataVersion,
    checkerVersion: record.checkerVersion,
    templateVersions: record.templateVersions,
    reviewedCommit: record.reviewedCommit,
    legalContentSha256: record.legalContentSha256,
    metadataAuthorization: record.metadataAuthorization,
    confirmations: record.confirmations,
    officialSources: record.officialSources,
    accessLimitedResolutions: record.accessLimitedResolutions,
    automationAllowlistDecisions: record.automationAllowlistDecisions,
    sb1000StatusCheck: record.sb1000StatusCheck,
    sb1000OwnerAuthorizationCheck: record.sb1000OwnerAuthorizationCheck,
    implementedChanges: record.implementedChanges,
    supersedesRecordId: record.supersedesRecordId ?? null,
  };
}

export function renderEvidenceBindingBlock(record) {
  return [
    "<!-- LEGAL_REVIEW_BINDING_V1_START",
    JSON.stringify(evidenceBindingForRecord(record), null, 2),
    "LEGAL_REVIEW_BINDING_V1_END -->",
  ].join("\n");
}

function checkedDisposition(text, headingPattern, expectedDisposition, label, errors) {
  const flags = headingPattern.flags.includes("g") ? headingPattern.flags : `${headingPattern.flags}g`;
  const headings = [...text.matchAll(new RegExp(headingPattern.source, flags))];
  if (headings.length !== 1 || headings[0].index === undefined) {
    errors.push(`evidence record must contain exactly one disposition section for ${label}`);
    return;
  }
  const heading = headings[0];
  const rest = text.slice(heading.index + heading[0].length);
  const nextHeading = rest.search(/\n##?# /);
  const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
  const choices = [...section.matchAll(/^- \[([ xX])\] (Accept as written|Accept with listed changes|Reject \/ escalate)$/gm)];
  const selected = choices.filter((match) => match[1].toLowerCase() === "x");
  if (choices.length !== 3 || selected.length !== 1) {
    errors.push(`evidence record must select exactly one disposition for ${label}`);
    return;
  }
  const expectedLabel = {
    accept_as_written: "Accept as written",
    accept_with_listed_changes: "Accept with listed changes",
    reject_escalate: "Reject / escalate",
  }[expectedDisposition];
  if (selected[0][2] !== expectedLabel) {
    errors.push(`evidence disposition for ${label} does not match the registry`);
  }
}

export function validateEvidenceText(record, text) {
  const errors = [];
  const requiredFields = [
    ["Signed registry record ID", record.id],
    ["Final reviewed commit", `\`${record.reviewedCommit}\``],
    ["Final legal-content SHA-256", `\`${record.legalContentSha256}\``],
    ["Source catalog version", `\`${record.sourceDataVersion}\``],
    ["Checker version", `\`${record.checkerVersion}\``],
    ["Registry overall decision", `\`${record.overallDecision}\``],
    [
      "Overall reviewer decision",
      record.overallDecision === "accept_as_written"
        ? "Accept as written"
        : "Accept with listed changes",
    ],
    ["Reviewer name", record.reviewer],
    ["Reviewer typed signature", record.reviewerSignature],
    ["Reviewer role/qualification", record.reviewerRoleQualification],
    ["Reviewer signed at", record.reviewerSignedAt],
    ["Owner name", record.ownerName],
    ["Owner role", record.ownerRole],
    ["Owner typed signature", record.ownerSignature],
    ["Owner authorized at", record.ownerAuthorizedAt],
    ["Owner decision", record.ownerDecision === "accept" ? "Accept" : "Accept with conditions"],
    ["Cadence basis", record.cadenceBasis],
    ["Public overdue state", "May clear"],
    ["Unresolved conditions", record.unresolvedConditions],
    [
      "Authorized last substantive human review date",
      record.metadataAuthorization.lastSubstantiveHumanReviewDate,
    ],
    ["Authorized next review due", record.metadataAuthorization.nextReviewDue],
  ];
  for (const frameworkId of REVIEW_FRAMEWORK_IDS) {
    requiredFields.push(
      [
        `Registry framework disposition — ${frameworkId}`,
        `\`${record.frameworkDispositions[frameworkId]}\``,
      ],
    );
  }
  for (const [correctionId, disposition] of Object.entries(record.correctionDispositions)) {
    requiredFields.push(
      [`Registry correction disposition — ${correctionId}`, `\`${disposition}\``],
    );
  }
  for (const [label, expectedValue] of requiredFields) {
    const values = evidenceFieldValues(text, label);
    if (values.length !== 1 || values[0] !== expectedValue) {
      errors.push(
        `evidence record must contain exactly one ${label} field with value ${expectedValue}`,
      );
    }
  }

  const bindingMatches = [
    ...text.matchAll(
      /<!-- LEGAL_REVIEW_BINDING_V1_START\r?\n([\s\S]*?)\r?\nLEGAL_REVIEW_BINDING_V1_END -->/g,
    ),
  ];
  const bindingMatch = bindingMatches[0];
  if (bindingMatches.length !== 1) {
    errors.push("evidence record must contain exactly one registry-binding annex");
  } else {
    try {
      const parsedBinding = JSON.parse(bindingMatch[1]);
      if (stableJson(parsedBinding) !== stableJson(evidenceBindingForRecord(record))) {
        errors.push("evidence registry-binding annex does not exactly match the registry record");
      }
    } catch {
      errors.push("evidence registry-binding annex is not valid JSON");
    }
  }

  const visibleText = bindingMatch ? text.replace(bindingMatch[0], "") : text;
  for (const source of record.officialSources) {
    const sourceRows = visibleText
      .split(/\r?\n/)
      .filter(
        (line) =>
          line.startsWith("|") &&
          line.includes(`\`${source.sourceId}\``) &&
          /\| \[[xX]\] \|\s*$/.test(line),
      );
    if (sourceRows.length !== 1) {
      errors.push(`evidence record must contain one completed visible source row for ${source.sourceId}`);
      continue;
    }
    for (const value of [
      source.canonicalUrl,
      source.manualVerifier,
      source.verifiedAt,
      source.manualMethod,
      source.confirmedVersionOrDate,
      source.accessBehavior,
      source.evidenceReference,
      source.conclusion,
      source.recheckTrigger,
    ]) {
      if (!sourceRows[0].includes(value)) {
        errors.push(`evidence source row ${source.sourceId} does not visibly bind ${value}`);
      }
    }
  }
  for (const resolution of record.accessLimitedResolutions) {
    const label = `Access-limited resolution — ${resolution.sourceId}`;
    const expectedValue = [
      resolution.frameworkId,
      resolution.manualVerifier,
      resolution.verifiedAt,
      resolution.method,
      resolution.evidenceReference,
      `\`${resolution.monitoringDecision}\``,
    ].join(" | ");
    const values = evidenceFieldValues(visibleText, label);
    if (values.length !== 1 || values[0] !== expectedValue) {
      errors.push(`evidence record must contain one exact visible access resolution for ${resolution.sourceId}`);
    }
  }
  for (const decision of record.automationAllowlistDecisions) {
    const label = `Automation allowlist decision — ${decision.sourceId}`;
    const expectedValue = [
      decision.frameworkId,
      `\`${decision.decision}\``,
      decision.rationale,
      decision.evidenceReference,
    ].join(" | ");
    const values = evidenceFieldValues(visibleText, label);
    if (values.length !== 1 || values[0] !== expectedValue) {
      errors.push(`evidence record must contain one exact visible allowlist decision for ${decision.sourceId}`);
    }
  }
  for (const [label, check] of [
    ["reviewer", record.sb1000StatusCheck],
    ["owner", record.sb1000OwnerAuthorizationCheck],
  ]) {
    const fieldLabel = `SB 1000 ${label} registry outcome`;
    const expectedValue = [
      `\`${check.status}\``,
      check.checkedAt,
      check.verifier,
      check.evidenceReference,
    ].join(" | ");
    const values = evidenceFieldValues(visibleText, fieldLabel);
    if (values.length !== 1 || values[0] !== expectedValue) {
      errors.push(`evidence record must contain one exact visible SB 1000 ${label} outcome`);
    }
  }

  const statusValues = evidenceFieldValues(text, "Record status");
  if (statusValues.length !== 1 || statusValues[0] !== "SIGNED — APPROVED FOR METADATA UPDATE") {
    errors.push("evidence record must be marked signed and approved exactly once");
  }
  for (const heading of [
    "## Framework review records",
    "## Source verification log",
    "## Pending-changes tracker",
    "## Reviewer sign-off",
    "## Site-owner decision and metadata authorization",
  ]) {
    if (occurrenceCount(text, heading) !== 1) {
      errors.push(`evidence record must contain exactly one ${heading}`);
    }
  }
  for (const attestation of [
    "- [x] I personally completed every framework review and source-log entry above.",
    "- [x] I selected exactly one disposition for each framework and correction.",
    "- [x] I resolved SB 1000 status immediately before signing.",
    "- [x] I understand automation prepared this record but did not perform or sign the review.",
    "- [x] I reviewed the completed reviewer record and all unresolved items.",
    "- [x] I rechecked the live official SB 1000 status immediately before this authorization and recorded it above.",
    "- [x] I authorize the exact metadata below for the reviewed content and no other version.",
    "- [x] I verified that the registry-binding summary and annex match the completed record and exact metadata I am authorizing.",
  ]) {
    if (occurrenceCount(text, attestation) !== 1) {
      errors.push(`evidence record is missing exact checked attestation: ${attestation}`);
    }
  }
  const uncheckedAttestations = [...text.matchAll(/^- \[ \] (.+)$/gm)].filter(
    (match) =>
      match[1] !== "Accept as written" &&
      match[1] !== "Accept with listed changes" &&
      match[1] !== "Reject / escalate",
  );
  if (uncheckedAttestations.length > 0 || /\| \[ \] \|/.test(text)) {
    errors.push("evidence record still contains unchecked required review items");
  }
  if (/\| P0 \|[^\n]*\| Open \|/.test(text)) {
    errors.push("evidence record still contains an open P0 item");
  }
  if (!text.includes("**Tracker status:** Resolved — ready for sign-off.")) {
    errors.push("evidence record does not mark the pending-changes tracker resolved");
  }
  for (const frameworkId of REVIEW_FRAMEWORK_IDS) {
    checkedDisposition(
      text,
      new RegExp(`^### .*\\(\\\`${frameworkId}\\\`\\)$`, "m"),
      record.frameworkDispositions[frameworkId],
      frameworkId,
      errors,
    );
  }
  for (const [correctionId, disposition] of Object.entries(record.correctionDispositions)) {
    const escapedId = correctionId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    checkedDisposition(
      text,
      new RegExp(`^### \\\`${escapedId}\\\`$`, "m"),
      disposition,
      correctionId,
      errors,
    );
  }
  return errors;
}

async function validateEvidence(record, errors) {
  const absolutePath = path.resolve(repositoryRoot, record.evidencePath);
  const allowedRoot = path.join(repositoryRoot, "docs", "legal-review", "reviews") + path.sep;
  if (!absolutePath.startsWith(allowedRoot)) {
    errors.push(`${record.id}: evidencePath escapes the approved review-record directory`);
    return;
  }
  let evidence;
  try {
    evidence = await readFile(absolutePath);
  } catch (error) {
    errors.push(`${record.id}: evidence record cannot be read (${error.code ?? error.message})`);
    return;
  }
  if (sha256(evidence.toString("utf8").replaceAll("\r\n", "\n")) !== record.evidenceSha256) {
    errors.push(`${record.id}: evidence record hash does not match`);
  }
  const text = evidence.toString("utf8");
  for (const error of validateEvidenceText(record, text)) errors.push(`${record.id}: ${error}`);
}

export function validateReviewedCommit(record, errors = [], context = {}) {
  const runGit =
    context.runGit ??
    ((args, options = {}) =>
      execFileSync("git", args, {
        cwd: repositoryRoot,
        ...options,
      }));
  const currentLegalContentSha256 =
    context.legalContentSha256 ?? calculateLegalContentSha256();
  const requireCurrentContentFallback = context.requireCurrentContentFallback ?? true;
  const contentBoundFallback = () => {
    if (!requireCurrentContentFallback) return;
    if (record.legalContentSha256 !== currentLegalContentSha256) {
      errors.push(
        `${record.id}: reviewedCommit history is unavailable and the checked-out legal content does not match its signed fingerprint`,
      );
    }
  };
  let shallow = false;
  try {
    shallow =
      runGit(["rev-parse", "--is-shallow-repository"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() === "true";
  } catch {
    // Some production builders intentionally omit .git. In that case the
    // signed legal-content fingerprint is the fail-closed commit-content
    // binding; authoritative full-history CI still proves ancestry.
    contentBoundFallback();
    return errors;
  }
  try {
    runGit(["cat-file", "-e", `${record.reviewedCommit}^{commit}`], {
      stdio: "ignore",
    });
    runGit(["merge-base", "--is-ancestor", record.reviewedCommit, "HEAD"], {
      stdio: "ignore",
    });
  } catch {
    if (!shallow) {
      errors.push(`${record.id}: reviewedCommit must exist and be an ancestor of the checked-out revision`);
    } else {
      contentBoundFallback();
    }
  }
  return errors;
}

export async function checkLegalReviewGovernance() {
  const errors = [];
  try {
    assertLegalReviewRegistryIntegrity();
  } catch (error) {
    errors.push(error.message);
  }

  const activeRecordIds = new Set();
  for (const law of Object.values(LAWS)) {
    const authorization = getReviewAuthorization({
      recordId: law.review.reviewRecordId,
      frameworkId: law.id,
      reviewDate: law.review.lastSubstantiveHumanReviewDate,
      nextReviewDue: law.review.nextReviewDue,
      reviewer: law.review.reviewer,
      sourceDataVersion: LEGAL_SOURCE_DATA_VERSION,
      checkerVersion: CHECKER_VERSION,
    });
    activeRecordIds.add(law.review.reviewRecordId);
    for (const error of authorization.errors) errors.push(`${law.id}: ${error}`);
    if (!authorization.metadataLinked) errors.push(`${law.id}: review metadata is not linked to a valid record`);
  }

  if (!exactSet([...Object.keys(LAWS)].sort(), [...REVIEW_FRAMEWORK_IDS].sort())) {
    errors.push("review governance framework IDs do not match the legal catalog");
  }
  if (LEGAL_REVIEW_DATE !== Object.values(LAWS)[0].review.lastSubstantiveHumanReviewDate) {
    errors.push("LEGAL_REVIEW_DATE does not match framework metadata");
  }
  if (NEXT_LEGAL_REVIEW_DUE !== Object.values(LAWS)[0].review.nextReviewDue) {
    errors.push("NEXT_LEGAL_REVIEW_DUE does not match framework metadata");
  }
  if (LEGAL_REVIEWER !== Object.values(LAWS)[0].review.reviewer) {
    errors.push("LEGAL_REVIEWER does not match framework metadata");
  }

  const signedRecords = LEGAL_REVIEW_RECORDS.filter((record) => record.status === "signed");
  for (const record of signedRecords) {
    validateReviewedCommit(record, errors, {
      requireCurrentContentFallback: activeRecordIds.has(record.id),
    });
    await validateEvidence(record, errors);
  }

  const activeRecords = LEGAL_REVIEW_RECORDS.filter((record) => activeRecordIds.has(record.id));
  for (const record of activeRecords) {
    if (record.status === "signed") validateSignedCurrentRecord(record, errors);
  }

  if (errors.length > 0) {
    throw new Error(`LEGAL REVIEW GOVERNANCE FAILED:\n- ${errors.join("\n- ")}`);
  }

  return {
    activeRecordIds: [...activeRecordIds],
    activeRecordStates: activeRecords.map((record) => record.status),
    legalContentSha256: calculateLegalContentSha256(),
  };
}

async function main() {
  try {
    const result = await checkLegalReviewGovernance();
    console.log(
      `Legal review governance is structurally consistent. Active record: ${result.activeRecordIds.join(", ")} ` +
        `(${result.activeRecordStates.join(", ")}). Legal-content SHA-256: ${result.legalContentSha256}.`,
    );
    console.log("Automation verified record structure and metadata linkage only; it did not perform substantive legal review.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
