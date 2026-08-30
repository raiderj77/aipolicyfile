import registryData from "../../docs/legal-review/review-registry.json" with { type: "json" };

export const REVIEW_FRAMEWORK_IDS = ["ftc", "euArt50", "nySynthetic", "caBot", "caSb942"] as const;

export type ReviewFrameworkId = (typeof REVIEW_FRAMEWORK_IDS)[number];
export type ReviewDisposition = "accept_as_written" | "accept_with_listed_changes" | "reject_escalate";
export type ReviewAuthorizationState = "historical_metadata_only" | "signed" | "invalid" | "missing";

interface HistoricalReviewRecord {
  id: string;
  status: "historical_metadata_only";
  reviewDate: string;
  nextReviewDue: string;
  reviewer: string;
  frameworkIds: ReviewFrameworkId[];
  note: string;
}

interface SignedReviewRecord {
  id: string;
  status: "signed";
  reviewDate: string;
  nextReviewDue: string;
  reviewer: string;
  reviewerRoleQualification: string;
  reviewerSignature: string;
  reviewerSignedAt: string;
  ownerName: string;
  ownerRole: string;
  ownerSignature: string;
  ownerAuthorizedAt: string;
  ownerDecision: "accept" | "accept_with_conditions";
  cadenceBasis: string;
  unresolvedConditions: string;
  overallDecision: "accept_as_written" | "accept_with_listed_changes";
  frameworkIds: ReviewFrameworkId[];
  frameworkDispositions: Record<ReviewFrameworkId, ReviewDisposition>;
  correctionDispositions: Record<string, ReviewDisposition>;
  sourceDataVersion: string;
  checkerVersion: string;
  templateVersions: string[];
  reviewedCommit: string;
  legalContentSha256: string;
  evidencePath: string;
  evidenceSha256: string;
  metadataAuthorization: {
    lastSubstantiveHumanReviewDate: string;
    nextReviewDue: string;
    publicOverdueMayClear: true;
  };
  confirmations: {
    controllingSourcesPersonallyOpened: true;
    automationNotReliedOnAsReview: true;
    implementedSummariesCompared: true;
    correctionsReviewed: true;
    pendingChangesReviewed: true;
    accessLimitedSourcesResolvedManually: true;
    sampleAndTemplateImpactReviewed: true;
    listedChangesImplementedAndRetested: true;
  };
  officialSources: Array<{
    frameworkId: ReviewFrameworkId;
    sourceId: string;
    canonicalUrl: string;
    retrievedBy: "manual" | "both";
    manualVerifier: string;
    verifiedAt: string;
    manualMethod: string;
    confirmedVersionOrDate: string;
    accessBehavior: string;
    evidenceReference: string;
    conclusion: string;
    recheckTrigger: string;
  }>;
  accessLimitedResolutions: Array<{
    frameworkId: ReviewFrameworkId;
    sourceId: string;
    manualVerifier: string;
    verifiedAt: string;
    method: string;
    evidenceReference: string;
    monitoringDecision:
      | "keep_automation_access_limited"
      | "update_allowlist_keep_access_limited";
  }>;
  automationAllowlistDecisions: Array<{
    frameworkId: ReviewFrameworkId;
    sourceId: string;
    decision:
      | "retain_expected_block"
      | "revise_allowlist_implemented"
      | "remove_stale_allowlist_implemented";
    rationale: string;
    evidenceReference: string;
  }>;
  sb1000StatusCheck: {
    sourceId: "ca-sb1000-2025-2026";
    status: "not_chaptered" | "chaptered_integrated_and_reviewed";
    checkedAt: string;
    verifier: string;
    evidenceReference: string;
  };
  sb1000OwnerAuthorizationCheck: {
    sourceId: "ca-sb1000-2025-2026";
    status: "not_chaptered" | "chaptered_integrated_and_reviewed";
    checkedAt: string;
    verifier: string;
    evidenceReference: string;
  };
  implementedChanges: Array<{
    dispositionId: string;
    reference: string;
    verifiedBy: string;
    postChangeRecheckAt: string;
  }>;
  supersedesRecordId?: string;
}

export type LegalReviewRecord = HistoricalReviewRecord | SignedReviewRecord;

interface RegistryShape {
  schemaVersion: number;
  sopVersion: string;
  records: LegalReviewRecord[];
}

export interface ReviewMetadataLink {
  recordId: string;
  frameworkId: ReviewFrameworkId;
  reviewDate: string;
  nextReviewDue: string;
  reviewer: string;
  sourceDataVersion: string;
  checkerVersion: string;
}

export interface ReviewAuthorizationResult {
  record: LegalReviewRecord | null;
  state: ReviewAuthorizationState;
  metadataLinked: boolean;
  dateWindowAuthorized: boolean;
  authorizationStartsAt: string | null;
  errors: string[];
}

const registry = registryData as unknown as RegistryShape;
const FROZEN_LEGACY_RECORD = {
  id: "legacy-metadata-2026-08-02",
  reviewDate: "2026-08-02",
  nextReviewDue: "2026-08-09",
  reviewer: "Jason Ramirez (site owner; not an attorney)",
} as const;

const REQUIRED_CONFIRMATIONS = [
  "controllingSourcesPersonallyOpened",
  "automationNotReliedOnAsReview",
  "implementedSummariesCompared",
  "correctionsReviewed",
  "pendingChangesReviewed",
  "accessLimitedSourcesResolvedManually",
  "sampleAndTemplateImpactReviewed",
  "listedChangesImplementedAndRetested",
] as const;
const VOLATILE_CHECK_MAX_AGE_MS = 60 * 60 * 1000;

export const LEGAL_REVIEW_REGISTRY_SCHEMA_VERSION = registry.schemaVersion;
export const LEGAL_REVIEW_SOP_VERSION = registry.sopVersion;
export const LEGAL_REVIEW_RECORDS = registry.records;

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = value.match(
    /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/,
  );
  return Boolean(match && isIsoDate(match[1]) && !Number.isNaN(Date.parse(value)));
}

function isNonEmptyString(value: unknown, minimumLength = 1): value is string {
  return typeof value === "string" && value.trim().length >= minimumLength;
}

function hasExactFrameworkIds(value: unknown): value is ReviewFrameworkId[] {
  return (
    Array.isArray(value) &&
    value.length === REVIEW_FRAMEWORK_IDS.length &&
    new Set(value).size === REVIEW_FRAMEWORK_IDS.length &&
    REVIEW_FRAMEWORK_IDS.every((id) => value.includes(id))
  );
}

function validateHistoricalRecord(record: HistoricalReviewRecord): string[] {
  const errors: string[] = [];
  if (record.id !== FROZEN_LEGACY_RECORD.id) errors.push("historical record ID is not the frozen baseline");
  if (record.reviewDate !== FROZEN_LEGACY_RECORD.reviewDate) errors.push("historical review date was changed");
  if (record.nextReviewDue !== FROZEN_LEGACY_RECORD.nextReviewDue) errors.push("historical next-review date was changed");
  if (record.reviewer !== FROZEN_LEGACY_RECORD.reviewer) errors.push("historical reviewer was changed");
  if (!hasExactFrameworkIds(record.frameworkIds)) errors.push("historical record must list all five frameworks exactly once");
  if (!isNonEmptyString(record.note)) errors.push("historical record needs an explanatory note");
  return errors;
}

function validateSignedRecord(record: SignedReviewRecord): string[] {
  const errors: string[] = [];
  const recordIdMatch = record.id.match(/^legal-review-(\d{4}-\d{2}-\d{2})-[a-z0-9-]+$/);
  if (!recordIdMatch) errors.push("signed record ID is invalid");
  if (!isIsoDate(record.reviewDate)) errors.push("signed reviewDate is invalid");
  if (!isIsoDate(record.nextReviewDue)) errors.push("signed nextReviewDue is invalid");
  if (recordIdMatch && recordIdMatch[1] !== record.reviewDate) {
    errors.push("signed record ID date must match reviewDate");
  }
  if (isIsoDate(record.reviewDate) && record.reviewDate > new Date().toISOString().slice(0, 10)) {
    errors.push("signed reviewDate cannot be in the future");
  }
  if (
    isIsoDate(record.reviewDate) &&
    isIsoDate(record.nextReviewDue) &&
    (record.nextReviewDue < record.reviewDate ||
      Date.parse(`${record.nextReviewDue}T00:00:00Z`) - Date.parse(`${record.reviewDate}T00:00:00Z`) >
        31 * 24 * 60 * 60 * 1000)
  ) {
    errors.push("signed nextReviewDue must be on or after reviewDate and no more than 31 days later");
  }
  for (const [label, value] of [
    ["reviewer", record.reviewer],
    ["reviewerRoleQualification", record.reviewerRoleQualification],
    ["reviewerSignature", record.reviewerSignature],
    ["ownerName", record.ownerName],
    ["ownerRole", record.ownerRole],
    ["ownerSignature", record.ownerSignature],
  ] as const) {
    if (!isNonEmptyString(value, 3)) {
      errors.push(`${label} must contain at least three non-whitespace characters`);
    }
  }
  if (!isIsoTimestamp(record.reviewerSignedAt)) errors.push("reviewerSignedAt must be an ISO timestamp with time zone");
  if (!isIsoTimestamp(record.ownerAuthorizedAt)) errors.push("ownerAuthorizedAt must be an ISO timestamp with time zone");
  if (isIsoTimestamp(record.reviewerSignedAt) && record.reviewerSignedAt.slice(0, 10) !== record.reviewDate) {
    errors.push("reviewerSignedAt must fall on reviewDate");
  }
  if (isIsoTimestamp(record.ownerAuthorizedAt) && record.ownerAuthorizedAt.slice(0, 10) < record.reviewDate) {
    errors.push("ownerAuthorizedAt cannot predate reviewDate");
  }
  if (
    isIsoTimestamp(record.ownerAuthorizedAt) &&
    isIsoDate(record.nextReviewDue) &&
    record.ownerAuthorizedAt.slice(0, 10) > record.nextReviewDue
  ) {
    errors.push("ownerAuthorizedAt cannot fall after nextReviewDue");
  }
  if (
    isIsoTimestamp(record.reviewerSignedAt) &&
    isIsoTimestamp(record.ownerAuthorizedAt) &&
    Date.parse(record.ownerAuthorizedAt) < Date.parse(record.reviewerSignedAt)
  ) {
    errors.push("ownerAuthorizedAt cannot precede reviewerSignedAt");
  }
  const latestPermittedTimestamp = Date.now() + 5 * 60 * 1000;
  for (const [label, value] of [
    ["reviewerSignedAt", record.reviewerSignedAt],
    ["ownerAuthorizedAt", record.ownerAuthorizedAt],
  ] as const) {
    if (isIsoTimestamp(value) && Date.parse(value) > latestPermittedTimestamp) {
      errors.push(`${label} cannot be in the future`);
    }
  }
  if (!hasExactFrameworkIds(record.frameworkIds)) errors.push("signed record must list all five frameworks exactly once");
  if (record.overallDecision !== "accept_as_written" && record.overallDecision !== "accept_with_listed_changes") {
    errors.push("overallDecision must accept the reviewed content or completed listed changes");
  }
  if (record.ownerDecision !== "accept" && record.ownerDecision !== "accept_with_conditions") {
    errors.push("ownerDecision must accept the reviewed content or state accepted conditions");
  }
  if (!isNonEmptyString(record.cadenceBasis, 3)) errors.push("cadenceBasis is required");
  if (!isNonEmptyString(record.unresolvedConditions, 3)) errors.push("unresolvedConditions is required; use None when applicable");
  if (!record.frameworkDispositions || typeof record.frameworkDispositions !== "object") {
    errors.push("frameworkDispositions are required");
  } else {
    const keys = Object.keys(record.frameworkDispositions);
    if (keys.length !== REVIEW_FRAMEWORK_IDS.length || !REVIEW_FRAMEWORK_IDS.every((id) => keys.includes(id))) {
      errors.push("frameworkDispositions must contain all five frameworks exactly once");
    }
    for (const id of REVIEW_FRAMEWORK_IDS) {
      const disposition = record.frameworkDispositions[id];
      if (disposition !== "accept_as_written" && disposition !== "accept_with_listed_changes") {
        errors.push(`${id} must be accepted or accepted with completed listed changes`);
      }
    }
  }
  if (!record.correctionDispositions || Object.keys(record.correctionDispositions).length === 0) {
    errors.push("correctionDispositions are required");
  } else {
    for (const [correctionId, disposition] of Object.entries(record.correctionDispositions)) {
      if (disposition !== "accept_as_written" && disposition !== "accept_with_listed_changes") {
        errors.push(`${correctionId} must be accepted or accepted with completed listed changes`);
      }
    }
  }
  if (!record.confirmations || typeof record.confirmations !== "object") {
    errors.push("confirmations are required");
  } else {
    for (const key of REQUIRED_CONFIRMATIONS) {
      if (record.confirmations[key] !== true) errors.push(`${key} must be explicitly true`);
    }
  }
  if (record.metadataAuthorization?.lastSubstantiveHumanReviewDate !== record.reviewDate) {
    errors.push("metadata authorization review date must match reviewDate");
  }
  if (record.metadataAuthorization?.nextReviewDue !== record.nextReviewDue) {
    errors.push("metadata authorization due date must match nextReviewDue");
  }
  if (record.metadataAuthorization?.publicOverdueMayClear !== true) {
    errors.push("owner must explicitly authorize whether the public overdue state may clear");
  }
  if (!/^[a-f0-9]{40}$/.test(record.reviewedCommit ?? "") || /^(.)\1{39}$/.test(record.reviewedCommit ?? "")) {
    errors.push("reviewedCommit must be a non-placeholder full Git commit hash");
  }
  if (
    !/^[a-f0-9]{64}$/.test(record.legalContentSha256 ?? "") ||
    /^(.)\1{63}$/.test(record.legalContentSha256 ?? "")
  ) {
    errors.push("legalContentSha256 must be a non-placeholder SHA-256");
  }
  if (!/^[a-f0-9]{64}$/.test(record.evidenceSha256 ?? "") || /^(.)\1{63}$/.test(record.evidenceSha256 ?? "")) {
    errors.push("evidenceSha256 must be a non-placeholder SHA-256");
  }
  if (!/^docs\/legal-review\/reviews\/[a-z0-9._-]+\.md$/.test(record.evidencePath ?? "")) {
    errors.push("evidencePath must identify one Markdown record under docs/legal-review/reviews");
  }
  if (!isNonEmptyString(record.sourceDataVersion)) errors.push("sourceDataVersion is required");
  if (!isNonEmptyString(record.checkerVersion)) errors.push("checkerVersion is required");
  if (!Array.isArray(record.templateVersions) || record.templateVersions.some((value) => !isNonEmptyString(value))) {
    errors.push("templateVersions must be an array of non-empty strings");
  }
  if (!Array.isArray(record.officialSources) || record.officialSources.length === 0) {
    errors.push("officialSources are required");
  } else {
    for (const source of record.officialSources) {
      if (!REVIEW_FRAMEWORK_IDS.includes(source.frameworkId)) errors.push("official source has an unknown frameworkId");
      if (!isNonEmptyString(source.sourceId)) errors.push("official source ID is required");
      if (!/^https:\/\//.test(source.canonicalUrl ?? "")) errors.push(`${source.sourceId || "source"} needs an HTTPS canonicalUrl`);
      if (source.retrievedBy !== "manual" && source.retrievedBy !== "both") errors.push(`${source.sourceId || "source"} cannot be automated-only`);
      if (!isNonEmptyString(source.manualVerifier, 3)) errors.push(`${source.sourceId || "source"} needs a manual verifier`);
      if (!isIsoTimestamp(source.verifiedAt)) errors.push(`${source.sourceId || "source"} needs a zoned verification timestamp`);
      if (isIsoTimestamp(source.verifiedAt) && source.verifiedAt.slice(0, 10) !== record.reviewDate) {
        errors.push(`${source.sourceId || "source"} must be manually verified on reviewDate`);
      }
      if (
        isIsoTimestamp(source.verifiedAt) &&
        isIsoTimestamp(record.reviewerSignedAt) &&
        Date.parse(source.verifiedAt) > Date.parse(record.reviewerSignedAt)
      ) {
        errors.push(`${source.sourceId || "source"} was verified after reviewer sign-off`);
      }
      if (!isNonEmptyString(source.evidenceReference, 3)) errors.push(`${source.sourceId || "source"} needs an evidence reference`);
      for (const [label, value] of [
        ["manual method", source.manualMethod],
        ["confirmed version/date", source.confirmedVersionOrDate],
        ["access behavior", source.accessBehavior],
        ["conclusion", source.conclusion],
        ["recheck trigger", source.recheckTrigger],
      ] as const) {
        if (!isNonEmptyString(value, 3)) errors.push(`${source.sourceId || "source"} needs ${label}`);
      }
    }
  }
  if (!Array.isArray(record.accessLimitedResolutions)) {
    errors.push("accessLimitedResolutions must be an array");
  } else {
    for (const resolution of record.accessLimitedResolutions) {
      if (!REVIEW_FRAMEWORK_IDS.includes(resolution.frameworkId)) errors.push("access-limited resolution has an unknown frameworkId");
      if (!isNonEmptyString(resolution.sourceId)) errors.push("access-limited resolution sourceId is required");
      if (!isNonEmptyString(resolution.manualVerifier, 3)) errors.push(`${resolution.sourceId || "access-limited source"} needs a manual verifier`);
      if (!isIsoTimestamp(resolution.verifiedAt)) errors.push(`${resolution.sourceId || "access-limited source"} needs a zoned verification timestamp`);
      if (isIsoTimestamp(resolution.verifiedAt) && resolution.verifiedAt.slice(0, 10) !== record.reviewDate) {
        errors.push(`${resolution.sourceId || "access-limited source"} must be resolved on reviewDate`);
      }
      if (
        isIsoTimestamp(resolution.verifiedAt) &&
        isIsoTimestamp(record.reviewerSignedAt) &&
        Date.parse(resolution.verifiedAt) > Date.parse(record.reviewerSignedAt)
      ) {
        errors.push(`${resolution.sourceId || "access-limited source"} was resolved after reviewer sign-off`);
      }
      if (!isNonEmptyString(resolution.method, 3)) errors.push(`${resolution.sourceId || "access-limited source"} needs a manual method`);
      if (!isNonEmptyString(resolution.evidenceReference, 3)) errors.push(`${resolution.sourceId || "access-limited source"} needs an evidence reference`);
      if (
        resolution.monitoringDecision !== "keep_automation_access_limited" &&
        resolution.monitoringDecision !== "update_allowlist_keep_access_limited"
      ) {
        errors.push(`${resolution.sourceId || "access-limited source"} needs a resolved monitoring decision`);
      }
    }
  }
  if (!Array.isArray(record.automationAllowlistDecisions)) {
    errors.push("automationAllowlistDecisions must be an array");
  } else {
    for (const decision of record.automationAllowlistDecisions) {
      if (!REVIEW_FRAMEWORK_IDS.includes(decision.frameworkId)) {
        errors.push("automation allowlist decision has an unknown frameworkId");
      }
      if (!isNonEmptyString(decision.sourceId)) errors.push("automation allowlist decision sourceId is required");
      if (
        decision.decision !== "retain_expected_block" &&
        decision.decision !== "revise_allowlist_implemented" &&
        decision.decision !== "remove_stale_allowlist_implemented"
      ) {
        errors.push(`${decision.sourceId || "automation allowlist source"} needs a resolved allowlist decision`);
      }
      if (!isNonEmptyString(decision.rationale, 3)) {
        errors.push(`${decision.sourceId || "automation allowlist source"} needs an allowlist rationale`);
      }
      if (!isNonEmptyString(decision.evidenceReference, 3)) {
        errors.push(`${decision.sourceId || "automation allowlist source"} needs allowlist evidence`);
      }
    }
  }
  for (const [label, check] of [
    ["reviewer", record.sb1000StatusCheck],
    ["owner authorization", record.sb1000OwnerAuthorizationCheck],
  ] as const) {
    if (check?.sourceId !== "ca-sb1000-2025-2026") errors.push(`SB 1000 ${label} check source ID is required`);
    if (check?.status !== "not_chaptered" && check?.status !== "chaptered_integrated_and_reviewed") {
      errors.push(`SB 1000 ${label} status must be a resolved fail-closed outcome`);
    }
    if (!isIsoTimestamp(check?.checkedAt)) errors.push(`SB 1000 ${label} check needs a zoned timestamp`);
    if (!isNonEmptyString(check?.verifier, 3)) errors.push(`SB 1000 ${label} verifier is required`);
    if (!isNonEmptyString(check?.evidenceReference, 3)) errors.push(`SB 1000 ${label} evidence reference is required`);
  }
  if (
    isIsoTimestamp(record.sb1000StatusCheck?.checkedAt) &&
    isIsoTimestamp(record.reviewerSignedAt) &&
    record.sb1000StatusCheck.checkedAt.slice(0, 10) !== record.reviewerSignedAt.slice(0, 10)
  ) {
    errors.push("SB 1000 reviewer check must occur on the reviewer-signoff date");
  }
  if (
    isIsoTimestamp(record.sb1000StatusCheck?.checkedAt) &&
    isIsoTimestamp(record.reviewerSignedAt) &&
    Date.parse(record.sb1000StatusCheck.checkedAt) > Date.parse(record.reviewerSignedAt)
  ) {
    errors.push("SB 1000 reviewer check cannot occur after reviewer sign-off");
  }
  if (
    isIsoTimestamp(record.sb1000StatusCheck?.checkedAt) &&
    isIsoTimestamp(record.reviewerSignedAt) &&
    Date.parse(record.reviewerSignedAt) - Date.parse(record.sb1000StatusCheck.checkedAt) >
      VOLATILE_CHECK_MAX_AGE_MS
  ) {
    errors.push("SB 1000 reviewer check must occur within 60 minutes before reviewer sign-off");
  }
  if (
    isIsoTimestamp(record.sb1000OwnerAuthorizationCheck?.checkedAt) &&
    isIsoTimestamp(record.ownerAuthorizedAt) &&
    record.sb1000OwnerAuthorizationCheck.checkedAt.slice(0, 10) !==
      record.ownerAuthorizedAt.slice(0, 10)
  ) {
    errors.push("SB 1000 owner check must occur on the owner-authorization date");
  }
  if (
    isIsoTimestamp(record.sb1000OwnerAuthorizationCheck?.checkedAt) &&
    isIsoTimestamp(record.ownerAuthorizedAt) &&
    Date.parse(record.sb1000OwnerAuthorizationCheck.checkedAt) > Date.parse(record.ownerAuthorizedAt)
  ) {
    errors.push("SB 1000 owner check cannot occur after owner authorization");
  }
  if (
    isIsoTimestamp(record.sb1000OwnerAuthorizationCheck?.checkedAt) &&
    isIsoTimestamp(record.ownerAuthorizedAt) &&
    Date.parse(record.ownerAuthorizedAt) -
      Date.parse(record.sb1000OwnerAuthorizationCheck.checkedAt) >
      VOLATILE_CHECK_MAX_AGE_MS
  ) {
    errors.push("SB 1000 owner check must occur within 60 minutes before owner authorization");
  }
  if (
    isIsoTimestamp(record.sb1000OwnerAuthorizationCheck?.checkedAt) &&
    isIsoTimestamp(record.reviewerSignedAt) &&
    Date.parse(record.sb1000OwnerAuthorizationCheck.checkedAt) < Date.parse(record.reviewerSignedAt)
  ) {
    errors.push("SB 1000 owner check cannot precede reviewer sign-off");
  }
  const changedDispositionIds = [
    ...Object.entries(record.frameworkDispositions ?? {})
      .filter(([, disposition]) => disposition === "accept_with_listed_changes")
      .map(([frameworkId]) => `framework:${frameworkId}`),
    ...Object.entries(record.correctionDispositions ?? {})
      .filter(([, disposition]) => disposition === "accept_with_listed_changes")
      .map(([correctionId]) => `correction:${correctionId}`),
  ].sort();
  if (
    (record.overallDecision === "accept_with_listed_changes") !==
    (changedDispositionIds.length > 0)
  ) {
    errors.push("overallDecision must summarize whether any framework or correction has listed changes");
  }
  if (!Array.isArray(record.implementedChanges)) {
    errors.push("implementedChanges must be an array");
  } else {
    const implementedDispositionIds = record.implementedChanges
      .map((change) => change.dispositionId)
      .sort();
    if (
      implementedDispositionIds.length !== changedDispositionIds.length ||
      new Set(implementedDispositionIds).size !== implementedDispositionIds.length ||
      !changedDispositionIds.every((id, index) => id === implementedDispositionIds[index])
    ) {
      errors.push("accepted listed changes need one implementation record per changed disposition");
    }
    for (const change of record.implementedChanges) {
      if (!isNonEmptyString(change.dispositionId)) errors.push("implemented change dispositionId is required");
      if (!isNonEmptyString(change.reference)) errors.push("implemented change reference is required");
      if (!isNonEmptyString(change.verifiedBy, 3)) errors.push("implemented change verifier is required");
      if (!isIsoTimestamp(change.postChangeRecheckAt)) errors.push("implemented change needs a zoned post-change recheck timestamp");
      if (isIsoTimestamp(change.postChangeRecheckAt) && change.postChangeRecheckAt.slice(0, 10) !== record.reviewDate) {
        errors.push("implemented change recheck must occur on reviewDate");
      }
      if (
        isIsoTimestamp(change.postChangeRecheckAt) &&
        isIsoTimestamp(record.reviewerSignedAt) &&
        Date.parse(change.postChangeRecheckAt) > Date.parse(record.reviewerSignedAt)
      ) {
        errors.push("implemented change recheck cannot occur after reviewer sign-off");
      }
    }
  }
  return errors;
}

export function validateLegalReviewRecord(record: LegalReviewRecord): string[] {
  if (!record || typeof record !== "object") return ["review record must be an object"];
  if (record.status === "historical_metadata_only") return validateHistoricalRecord(record);
  if (record.status === "signed") return validateSignedRecord(record);
  return ["review record status is unsupported"];
}

export function findLegalReviewRecord(recordId: string): LegalReviewRecord | null {
  return LEGAL_REVIEW_RECORDS.find((record) => record.id === recordId) ?? null;
}

export function getReviewAuthorization(link: ReviewMetadataLink): ReviewAuthorizationResult {
  const record = findLegalReviewRecord(link.recordId);
  if (!record) {
    return {
      record: null,
      state: "missing",
      metadataLinked: false,
      dateWindowAuthorized: false,
      authorizationStartsAt: null,
      errors: ["review record not found"],
    };
  }

  const errors = validateLegalReviewRecord(record);
  if (record.reviewDate !== link.reviewDate) errors.push("record reviewDate does not match framework metadata");
  if (record.nextReviewDue !== link.nextReviewDue) errors.push("record nextReviewDue does not match framework metadata");
  if (record.reviewer !== link.reviewer) errors.push("record reviewer does not match framework metadata");
  if (!record.frameworkIds.includes(link.frameworkId)) errors.push("record does not cover this framework");

  if (record.status === "signed") {
    if (record.sourceDataVersion !== link.sourceDataVersion) errors.push("record sourceDataVersion does not match the catalog");
    if (record.checkerVersion !== link.checkerVersion) errors.push("record checkerVersion does not match the implementation");
    if (record.frameworkDispositions[link.frameworkId] === "reject_escalate") errors.push("framework was rejected or escalated");
  }

  if (errors.length > 0) {
    return {
      record,
      state: "invalid",
      metadataLinked: false,
      dateWindowAuthorized: false,
      authorizationStartsAt: null,
      errors,
    };
  }

  const authorizationStartsAt =
    record.status === "signed" ? record.ownerAuthorizedAt : `${record.reviewDate}T00:00:00Z`;

  return {
    record,
    state: record.status,
    metadataLinked: true,
    dateWindowAuthorized: record.status === "signed" || record.id === FROZEN_LEGACY_RECORD.id,
    authorizationStartsAt,
    errors: [],
  };
}

export function assertLegalReviewRegistryIntegrity(): void {
  if (LEGAL_REVIEW_REGISTRY_SCHEMA_VERSION !== 1) throw new Error("Unsupported legal review registry schema");
  if (LEGAL_REVIEW_SOP_VERSION !== "1.0") throw new Error("Unsupported legal review SOP version");
  const ids = LEGAL_REVIEW_RECORDS.map((record) => record.id);
  if (new Set(ids).size !== ids.length) throw new Error("Legal review record IDs must be unique");
  const errors = LEGAL_REVIEW_RECORDS.flatMap((record) =>
    validateLegalReviewRecord(record).map((error) => `${record.id}: ${error}`),
  );
  if (errors.length > 0) throw new Error(`Invalid legal review registry:\n${errors.join("\n")}`);
}
