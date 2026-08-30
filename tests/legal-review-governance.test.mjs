import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateLegalContentSha256,
  checkLegalReviewGovernance,
  renderEvidenceBindingBlock,
  validateReviewedCommit,
  validateSignedCurrentRecord,
  validateEvidenceText,
} from "../scripts/check-legal-review-governance.mjs";
import { CORRECTIONS } from "../src/lib/corrections.ts";
import {
  CHECKER_VERSION,
  LAWS,
  LEGAL_SOURCE_DATA_VERSION,
} from "../src/lib/laws.ts";
import {
  LEGAL_REVIEW_RECORDS,
  REVIEW_FRAMEWORK_IDS,
  assertLegalReviewRegistryIntegrity,
  getReviewAuthorization,
  validateLegalReviewRecord,
} from "../src/lib/legalReviewRecords.ts";

function signedFixture() {
  return {
    id: "legal-review-2026-08-30-owner",
    status: "signed",
    reviewDate: "2026-08-30",
    nextReviewDue: "2026-09-06",
    reviewer: "Human Reviewer",
    reviewerRoleQualification: "Site owner; not an attorney",
    reviewerSignature: "Human Reviewer",
    reviewerSignedAt: "2026-08-30T08:00:00-07:00",
    ownerName: "Human Owner",
    ownerRole: "Site owner",
    ownerSignature: "Human Owner",
    ownerAuthorizedAt: "2026-08-30T08:10:00-07:00",
    ownerDecision: "accept",
    cadenceBasis: "Weekly while SB 1000 remains volatile",
    unresolvedConditions: "None",
    overallDecision: "accept_as_written",
    frameworkIds: [...REVIEW_FRAMEWORK_IDS],
    frameworkDispositions: Object.fromEntries(
      REVIEW_FRAMEWORK_IDS.map((frameworkId) => [frameworkId, "accept_as_written"]),
    ),
    correctionDispositions: { "correction-1": "accept_as_written" },
    sourceDataVersion: "legal-catalog-test",
    checkerVersion: "checker-test",
    templateVersions: ["template-test"],
    reviewedCommit: "6503ba07df01e7a9deb279882457559dd5d1aaeb",
    legalContentSha256: "77f8083514b22754314d37bc5182bcac575d54f14107e5a7a8246a838ad6dd55",
    evidencePath: "docs/legal-review/reviews/source-review-record-2026-08-30.md",
    evidenceSha256: "df6e82cfbcce00f72e3034aedc0e536e5c8c83c858b1bc790594f0fed621866e",
    metadataAuthorization: {
      lastSubstantiveHumanReviewDate: "2026-08-30",
      nextReviewDue: "2026-09-06",
      publicOverdueMayClear: true,
    },
    confirmations: {
      controllingSourcesPersonallyOpened: true,
      automationNotReliedOnAsReview: true,
      implementedSummariesCompared: true,
      correctionsReviewed: true,
      pendingChangesReviewed: true,
      accessLimitedSourcesResolvedManually: true,
      sampleAndTemplateImpactReviewed: true,
      listedChangesImplementedAndRetested: true,
    },
    officialSources: [
      {
        frameworkId: "ftc",
        sourceId: "source-1",
        canonicalUrl: "https://example.gov/source-1",
        retrievedBy: "manual",
        manualVerifier: "Human Reviewer",
        verifiedAt: "2026-08-30T07:00:00-07:00",
        manualMethod: "Opened the official HTML page directly",
        confirmedVersionOrDate: "Current page dated 2026-08-29",
        accessBehavior: "HTTP 200 and readable in the browser",
        evidenceReference: "Review record source row 1",
        conclusion: "Current source matches the implemented summary",
        recheckTrigger: "Official amendment or next scheduled review",
      },
    ],
    accessLimitedResolutions: [
      {
        frameworkId: "nySynthetic",
        sourceId: "source-2",
        manualVerifier: "Human Reviewer",
        verifiedAt: "2026-08-30T07:30:00-07:00",
        method: "Opened the official page in a signed-in browser",
        evidenceReference: "Review record source row 2",
        monitoringDecision: "keep_automation_access_limited",
      },
    ],
    automationAllowlistDecisions: [],
    sb1000StatusCheck: {
      sourceId: "ca-sb1000-2025-2026",
      status: "not_chaptered",
      checkedAt: "2026-08-30T07:55:00-07:00",
      verifier: "Human Reviewer",
      evidenceReference: "Review record reviewer volatile-source section",
    },
    sb1000OwnerAuthorizationCheck: {
      sourceId: "ca-sb1000-2025-2026",
      status: "not_chaptered",
      checkedAt: "2026-08-30T08:05:00-07:00",
      verifier: "Human Owner",
      evidenceReference: "Review record owner volatile-source section",
    },
    implementedChanges: [],
  };
}

function currentCatalogSignedFixture() {
  const record = signedFixture();
  record.correctionDispositions = Object.fromEntries(
    CORRECTIONS.map((correction) => [correction.id, "accept_as_written"]),
  );
  record.sourceDataVersion = LEGAL_SOURCE_DATA_VERSION;
  record.checkerVersion = CHECKER_VERSION;
  record.templateVersions = [
    ...new Set(Object.values(LAWS).map((law) => law.review.templateVersion).filter(Boolean)),
  ].sort();
  record.legalContentSha256 = calculateLegalContentSha256();
  record.officialSources = Object.values(LAWS).flatMap((law) =>
    law.officialSources.map((source) => ({
      frameworkId: law.id,
      sourceId: source.sourceId,
      canonicalUrl: source.canonicalUrl,
      retrievedBy: "manual",
      manualVerifier: "Human Reviewer",
      verifiedAt: "2026-08-30T07:00:00-07:00",
      manualMethod: "Opened the official source directly in a browser",
      confirmedVersionOrDate: source.retrievedAt,
      accessBehavior: law.review.automatedAccessLimitedSourceIds.includes(source.sourceId)
        ? "Manual browser access recorded after automated access limit"
        : "Official page readable",
      evidenceReference: `Evidence row ${source.sourceId}`,
      conclusion: "Current source matches the implemented catalog",
      recheckTrigger: "Official change or next scheduled review",
    })),
  );
  record.accessLimitedResolutions = Object.values(LAWS).flatMap((law) =>
    law.review.automatedAccessLimitedSourceIds.map((sourceId) => ({
      frameworkId: law.id,
      sourceId,
      manualVerifier: "Human Reviewer",
      verifiedAt: "2026-08-30T07:30:00-07:00",
      method: "Opened the official source directly in a browser",
      evidenceReference: `Access evidence ${sourceId}`,
      monitoringDecision: "keep_automation_access_limited",
    })),
  );
  record.automationAllowlistDecisions = Object.values(LAWS).flatMap((law) =>
    law.review.automatedAllowlistSourceIds.map((sourceId) => ({
      frameworkId: law.id,
      sourceId,
      decision: "retain_expected_block",
      rationale: "Current monitor configuration remains intentionally fail-closed",
      evidenceReference: `Allowlist evidence ${sourceId}`,
    })),
  );
  return record;
}

test("the frozen historical record is linked but cannot authorize a new date", () => {
  assertLegalReviewRegistryIntegrity();
  const legacy = LEGAL_REVIEW_RECORDS[0];
  const linked = getReviewAuthorization({
    recordId: legacy.id,
    frameworkId: "ftc",
    reviewDate: legacy.reviewDate,
    nextReviewDue: legacy.nextReviewDue,
    reviewer: legacy.reviewer,
    sourceDataVersion: "ignored-for-frozen-history",
    checkerVersion: "ignored-for-frozen-history",
  });
  assert.equal(linked.state, "historical_metadata_only");
  assert.equal(linked.metadataLinked, true);
  assert.equal(linked.dateWindowAuthorized, true);

  const changedDate = getReviewAuthorization({
    recordId: legacy.id,
    frameworkId: "ftc",
    reviewDate: "2026-08-30",
    nextReviewDue: "2026-09-06",
    reviewer: legacy.reviewer,
    sourceDataVersion: "ignored",
    checkerVersion: "ignored",
  });
  assert.equal(changedDate.state, "invalid");
  assert.equal(changedDate.metadataLinked, false);
  assert.equal(changedDate.dateWindowAuthorized, false);
});

function completeEvidence(record) {
  const choices = (selected) =>
    [
      ["accept_as_written", "Accept as written"],
      ["accept_with_listed_changes", "Accept with listed changes"],
      ["reject_escalate", "Reject / escalate"],
    ]
      .map(([value, label]) => `- [${value === selected ? "x" : " "}] ${label}`)
      .join("\n");
  return [
    "# Legal source review record",
    "",
    "**Record status:** SIGNED — APPROVED FOR METADATA UPDATE",
    `**Signed registry record ID:** ${record.id}`,
    `**Final reviewed commit:** \`${record.reviewedCommit}\``,
    `**Final legal-content SHA-256:** \`${record.legalContentSha256}\``,
    `**Source catalog version:** \`${record.sourceDataVersion}\``,
    `**Checker version:** \`${record.checkerVersion}\``,
    `**Registry overall decision:** \`${record.overallDecision}\``,
    `**Overall reviewer decision:** ${record.overallDecision === "accept_as_written" ? "Accept as written" : "Accept with listed changes"}`,
    ...REVIEW_FRAMEWORK_IDS.map(
      (frameworkId) =>
        `**Registry framework disposition — ${frameworkId}:** \`${record.frameworkDispositions[frameworkId]}\``,
    ),
    ...Object.entries(record.correctionDispositions).map(
      ([correctionId, disposition]) =>
        `**Registry correction disposition — ${correctionId}:** \`${disposition}\``,
    ),
    "",
    "## Framework review records",
    ...REVIEW_FRAMEWORK_IDS.flatMap((frameworkId) => [
      `### Framework (\`${frameworkId}\`)`,
      choices(record.frameworkDispositions[frameworkId]),
    ]),
    "## Source verification log",
    ...record.officialSources.map(
      (source) =>
        `| ${source.frameworkId} / \`${source.sourceId}\` | ${source.canonicalUrl} | human | ${source.manualVerifier}; ${source.verifiedAt}; ${source.manualMethod}; ${source.confirmedVersionOrDate}; ${source.accessBehavior}; ${source.evidenceReference}; ${source.conclusion}; ${source.recheckTrigger} | [x] |`,
    ),
    "## Pending-changes tracker",
    "**Tracker status:** Resolved — ready for sign-off.",
    "## Correction dispositions",
    ...Object.entries(record.correctionDispositions).flatMap(([correctionId, disposition]) => [
      `### \`${correctionId}\``,
      choices(disposition),
    ]),
    ...record.accessLimitedResolutions.map(
      (resolution) =>
        `**Access-limited resolution — ${resolution.sourceId}:** ${[
          resolution.frameworkId,
          resolution.manualVerifier,
          resolution.verifiedAt,
          resolution.method,
          resolution.evidenceReference,
          `\`${resolution.monitoringDecision}\``,
        ].join(" | ")}`,
    ),
    ...record.automationAllowlistDecisions.map(
      (decision) =>
        `**Automation allowlist decision — ${decision.sourceId}:** ${decision.frameworkId} | \`${decision.decision}\` | ${decision.rationale} | ${decision.evidenceReference}`,
    ),
    `**SB 1000 reviewer registry outcome:** \`${record.sb1000StatusCheck.status}\` | ${record.sb1000StatusCheck.checkedAt} | ${record.sb1000StatusCheck.verifier} | ${record.sb1000StatusCheck.evidenceReference}`,
    `**SB 1000 owner registry outcome:** \`${record.sb1000OwnerAuthorizationCheck.status}\` | ${record.sb1000OwnerAuthorizationCheck.checkedAt} | ${record.sb1000OwnerAuthorizationCheck.verifier} | ${record.sb1000OwnerAuthorizationCheck.evidenceReference}`,
    "## Reviewer sign-off",
    "- [x] I personally completed every framework review and source-log entry above.",
    "- [x] I selected exactly one disposition for each framework and correction.",
    "- [x] I resolved SB 1000 status immediately before signing.",
    "- [x] I understand automation prepared this record but did not perform or sign the review.",
    `**Reviewer name:** ${record.reviewer}`,
    `**Reviewer typed signature:** ${record.reviewerSignature}`,
    `**Reviewer role/qualification:** ${record.reviewerRoleQualification}`,
    `**Reviewer signed at:** ${record.reviewerSignedAt}`,
    "## Site-owner decision and metadata authorization",
    "- [x] I reviewed the completed reviewer record and all unresolved items.",
    "- [x] I rechecked the live official SB 1000 status immediately before this authorization and recorded it above.",
    "- [x] I authorize the exact metadata below for the reviewed content and no other version.",
    `**Owner name:** ${record.ownerName}`,
    `**Owner role:** ${record.ownerRole}`,
    `**Owner typed signature:** ${record.ownerSignature}`,
    `**Owner authorized at:** ${record.ownerAuthorizedAt}`,
    `**Owner decision:** ${record.ownerDecision === "accept" ? "Accept" : "Accept with conditions"}`,
    `**Cadence basis:** ${record.cadenceBasis}`,
    "**Public overdue state:** May clear",
    `**Unresolved conditions:** ${record.unresolvedConditions}`,
    `**Authorized last substantive human review date:** ${record.metadataAuthorization.lastSubstantiveHumanReviewDate}`,
    `**Authorized next review due:** ${record.metadataAuthorization.nextReviewDue}`,
    renderEvidenceBindingBlock(record),
    "- [x] I verified that the registry-binding summary and annex match the completed record and exact metadata I am authorizing.",
  ].join("\n");
}

test("a structurally complete synthetic human record passes the pure validator", () => {
  assert.deepEqual(validateLegalReviewRecord(signedFixture()), []);
});

test("listed changes map one-to-one to concrete framework or correction dispositions", () => {
  const record = signedFixture();
  record.overallDecision = "accept_with_listed_changes";
  record.frameworkDispositions.ftc = "accept_with_listed_changes";
  record.implementedChanges = [
    {
      dispositionId: "framework:ftc",
      reference: "Commit and retest record GOV-CHANGE-1",
      verifiedBy: "Human Reviewer",
      postChangeRecheckAt: "2026-08-30T07:50:00-07:00",
    },
  ];
  assert.deepEqual(validateLegalReviewRecord(record), []);

  record.implementedChanges[0].dispositionId = "correction:wrong-id";
  assert.match(
    validateLegalReviewRecord(record).join("\n"),
    /one implementation record per changed disposition/,
  );
});

test("an all-passed future catalog may use an empty access-resolution array", () => {
  const record = signedFixture();
  record.accessLimitedResolutions = [];
  assert.deepEqual(validateLegalReviewRecord(record), []);
});

test("current-catalog enforcement binds exact access-limited sources and both SB 1000 entries", () => {
  const corrected = CORRECTIONS.map((correction) => ({ ...correction, status: "corrected" }));
  const record = currentCatalogSignedFixture();
  assert.deepEqual(validateLegalReviewRecord(record), []);
  assert.deepEqual(validateSignedCurrentRecord(record, [], { corrections: corrected }), []);

  record.accessLimitedResolutions.push({
    ...record.accessLimitedResolutions[0],
    sourceId: "ny-s8420-effective-date-announcement",
  });
  assert.match(
    validateSignedCurrentRecord(record, [], { corrections: corrected }).join("\n"),
    /manual access-limited resolutions do not cover the current catalog/,
  );

  record.accessLimitedResolutions.pop();
  record.automationAllowlistDecisions.find(
    (decision) => decision.sourceId === "ny-s8420-effective-date-announcement",
  ).decision = "remove_stale_allowlist_implemented";
  assert.match(
    validateSignedCurrentRecord(record, [], { corrections: corrected }).join("\n"),
    /does not match current monitor configuration/,
  );

  record.automationAllowlistDecisions.find(
    (decision) => decision.sourceId === "ny-s8420-effective-date-announcement",
  ).decision = "retain_expected_block";
  record.sb1000OwnerAuthorizationCheck.status = "chaptered_integrated_and_reviewed";
  assert.match(
    validateSignedCurrentRecord(record, [], { corrections: corrected }).join("\n"),
    /SB 1000 review outcome does not match/,
  );

  record.sb1000OwnerAuthorizationCheck.status = "not_chaptered";
  const inconsistentLaws = structuredClone(LAWS);
  inconsistentLaws.caSb942.officialSources.find(
    (source) => source.sourceId === "ca-sb1000-2025-2026-text",
  ).bindingEffect = "unknown_binding_effect";
  assert.match(
    validateSignedCurrentRecord(record, [], { laws: inconsistentLaws, corrections: corrected }).join("\n"),
    /status and text catalog entries are missing, unsupported, or inconsistent/,
  );
});

test("signed records fail closed on missing human evidence or an unresolved disposition", () => {
  const cases = [
    {
      name: "false attestation",
      mutate(record) {
        record.confirmations.controllingSourcesPersonallyOpened = false;
      },
      pattern: /controllingSourcesPersonallyOpened/,
    },
    {
      name: "automated-only source",
      mutate(record) {
        record.officialSources[0].retrievedBy = "automated";
      },
      pattern: /cannot be automated-only/,
    },
    {
      name: "rejected framework",
      mutate(record) {
        record.frameworkDispositions.ftc = "reject_escalate";
      },
      pattern: /ftc must be accepted/,
    },
    {
      name: "stale SB 1000 check",
      mutate(record) {
        record.sb1000OwnerAuthorizationCheck.checkedAt = "2026-08-29T08:05:00-07:00";
      },
      pattern: /SB 1000 owner check must occur on the owner-authorization date/,
    },
    {
      name: "same-day but no longer immediate reviewer check",
      mutate(record) {
        record.sb1000StatusCheck.checkedAt = "2026-08-30T06:00:00-07:00";
      },
      pattern: /within 60 minutes before reviewer sign-off/,
    },
    {
      name: "listed changes without recheck",
      mutate(record) {
        record.frameworkDispositions.ftc = "accept_with_listed_changes";
      },
      pattern: /accepted listed changes need one implementation record/,
    },
    {
      name: "correction changes without recheck",
      mutate(record) {
        record.correctionDispositions["correction-1"] = "accept_with_listed_changes";
      },
      pattern: /accepted listed changes need one implementation record/,
    },
    {
      name: "owner authorization before reviewer signoff",
      mutate(record) {
        record.ownerAuthorizedAt = "2026-08-30T07:55:00-07:00";
      },
      pattern: /ownerAuthorizedAt cannot precede reviewerSignedAt/,
    },
    {
      name: "source verified after reviewer signoff",
      mutate(record) {
        record.officialSources[0].verifiedAt = "2026-08-30T08:01:00-07:00";
      },
      pattern: /verified after reviewer sign-off/,
    },
    {
      name: "impossible review date",
      mutate(record) {
        record.id = "legal-review-2026-02-30-owner";
        record.reviewDate = "2026-02-30";
      },
      pattern: /signed reviewDate is invalid/,
    },
    {
      name: "placeholder commit",
      mutate(record) {
        record.reviewedCommit = "0".repeat(40);
      },
      pattern: /non-placeholder full Git commit hash/,
    },
    {
      name: "unresolved monitoring decision",
      mutate(record) {
        record.accessLimitedResolutions[0].monitoringDecision = "unresolved";
      },
      pattern: /needs a resolved monitoring decision/,
    },
    {
      name: "unresolved SB 1000 outcome",
      mutate(record) {
        record.sb1000StatusCheck.status = "unknown";
      },
      pattern: /reviewer status must be a resolved fail-closed outcome/,
    },
  ];

  for (const scenario of cases) {
    const record = signedFixture();
    scenario.mutate(record);
    assert.match(validateLegalReviewRecord(record).join("\n"), scenario.pattern, scenario.name);
  }
});

test("signed evidence must bind every registry field and contain no open review work", () => {
  const record = signedFixture();
  const complete = completeEvidence(record);
  assert.deepEqual(validateEvidenceText(record, complete), []);

  assert.match(
    validateEvidenceText(record, complete.replace(record.reviewedCommit, "f".repeat(40))).join("\n"),
    /Final reviewed commit/,
  );
  assert.match(
    validateEvidenceText(
      record,
      `${complete}\n**Final reviewed commit:** \`${"f".repeat(40)}\``,
    ).join("\n"),
    /exactly one Final reviewed commit field/,
  );
  assert.match(
    validateEvidenceText(
      record,
      complete.replace(record.officialSources[0].manualMethod, "method omitted"),
    ).join("\n"),
    /source row source-1 does not visibly bind/,
  );
  assert.match(
    validateEvidenceText(record, `${complete}\n- [ ] unfinished human check`).join("\n"),
    /unchecked required review items/,
  );
  assert.match(
    validateEvidenceText(
      record,
      complete.replace("- [ ] Accept with listed changes", "- [x] Accept with listed changes"),
    ).join("\n"),
    /select exactly one disposition/,
  );
  assert.match(
    validateEvidenceText(record, complete.replace("Resolved — ready for sign-off.", "Open — not resolved for sign-off.")).join("\n"),
    /pending-changes tracker resolved/,
  );
});

test("the repository's active record and legal-content fingerprint pass governance", async () => {
  const result = await checkLegalReviewGovernance();
  assert.deepEqual(result.activeRecordIds, ["legacy-metadata-2026-08-02"]);
  assert.deepEqual(result.activeRecordStates, ["historical_metadata_only"]);
  assert.match(result.legalContentSha256, /^[a-f0-9]{64}$/);
  assert.equal(result.legalContentSha256, calculateLegalContentSha256());
});

test("reviewed commit verification fails closed or uses the exact signed content binding", () => {
  const record = signedFixture();
  const unavailableGit = () => {
    throw new Error("git unavailable");
  };
  const mismatchErrors = validateReviewedCommit(record, [], {
    runGit: unavailableGit,
    legalContentSha256: "a".repeat(64),
  });
  assert.match(mismatchErrors.join("\n"), /checked-out legal content does not match/);

  const contentBoundErrors = validateReviewedCommit(record, [], {
    runGit: unavailableGit,
    legalContentSha256: record.legalContentSha256,
  });
  assert.deepEqual(contentBoundErrors, []);

  const supersededRecordErrors = validateReviewedCommit(record, [], {
    runGit: unavailableGit,
    legalContentSha256: "a".repeat(64),
    requireCurrentContentFallback: false,
  });
  assert.deepEqual(
    supersededRecordErrors,
    [],
    "superseded records rely on evidence binding outside authoritative full-history CI",
  );

  let invocation = 0;
  const fullHistoryMissingCommit = () => {
    invocation += 1;
    if (invocation === 1) return "false\n";
    throw new Error("commit missing");
  };
  const fullHistoryErrors = validateReviewedCommit(record, [], {
    runGit: fullHistoryMissingCommit,
    legalContentSha256: record.legalContentSha256,
  });
  assert.match(fullHistoryErrors.join("\n"), /must exist and be an ancestor/);
});
