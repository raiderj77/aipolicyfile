import {
  findLegalReviewRecord,
  getReviewAuthorization,
  type ReviewAuthorizationState,
} from "./legalReviewRecords.ts";

// Educational screening data reviewed against the linked primary sources on
// 2026-08-02. The checker identifies issues worth reviewing; it does not decide
// jurisdiction, legal status, or compliance.

export const LEGAL_REVIEW_RECORD_ID = "legacy-metadata-2026-08-02";
const REGISTERED_LEGAL_REVIEW = findLegalReviewRecord(LEGAL_REVIEW_RECORD_ID);
if (!REGISTERED_LEGAL_REVIEW) throw new Error(`Missing legal review record ${LEGAL_REVIEW_RECORD_ID}`);

export const LEGAL_REVIEW_DATE = REGISTERED_LEGAL_REVIEW.reviewDate;
export const LEGAL_REVIEW_LABEL = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${LEGAL_REVIEW_DATE}T00:00:00Z`));
export const LEGAL_CONTENT_MODIFIED_DATE = "2026-08-29";
export const NEXT_LEGAL_REVIEW_DUE = REGISTERED_LEGAL_REVIEW.nextReviewDue;
export const LAST_AUTOMATED_SOURCE_CHECK_DATE = "2026-08-29";
export const LAST_AUTOMATED_SOURCE_CHECK_LABEL = "August 29, 2026";
export const LEGAL_SOURCE_DATA_VERSION = "legal-catalog-2026-08-29.3";
export const CHECKER_VERSION = "checker-2026-08-29.1";
export const LEGAL_REVIEWER = REGISTERED_LEGAL_REVIEW.reviewer;

export type LawId = "ftc" | "euArt50" | "nySynthetic" | "caBot" | "caSb942";

export interface OfficialSource {
  sourceId: string;
  authority: string;
  title: string;
  jurisdiction: string;
  sourceType: string;
  legalStatus: string;
  bindingEffect: string;
  canonicalUrl: string;
  documentId?: string;
  adoptedDate?: string;
  publishedDate?: string;
  effectiveDate?: string;
  applicableDate?: string;
  consolidatedAsOf?: string;
  officialPageLastUpdated?: string;
  retrievedAt: string;
  contentSha256?: string;
  fingerprintUrl?: string;
  amends?: string;
  supersedes?: string;
  notes?: string;
}

export type AutomatedSourceCheckStatus = "passed" | "access_limited";

export interface LawReviewRecord {
  reviewRecordId: string;
  sourceDataVersion: string;
  checkerVersion: string;
  templateVersion: string | null;
  lastAutomatedSourceCheckDate: string;
  automatedSourceCheckStatus: AutomatedSourceCheckStatus;
  automatedAccessLimitedSourceIds: string[];
  automatedAllowlistSourceIds: string[];
  automatedSourceCheckNote: string;
  lastSubstantiveHumanReviewDate: string;
  nextReviewDue: string;
  reviewer: string;
}

export interface LawChangeRecord {
  date: string;
  summary: string;
  sourceIds: string[];
}

export type LegalReviewState = "current" | "source-review-overdue";

export interface LegalReviewStatus {
  state: LegalReviewState;
  overdue: boolean;
  reviewedDate: string;
  reviewedLabel: string;
  nextReviewDue: string;
  nextReviewDueLabel: string;
  lastAutomatedSourceCheckDate: string;
  lastAutomatedSourceCheckLabel: string;
  automatedSourceCheckStatus: AutomatedSourceCheckStatus;
  automatedSourceCheckNote: string;
  automatedAccessLimitedLawIds: LawId[];
  sourceDataVersion: string;
  checkerVersion: string;
  reviewer: string;
  reviewRecordId: string;
  reviewAuthorizationState: ReviewAuthorizationState;
  reviewMetadataLinked: boolean;
  overdueLawIds: LawId[];
}

function utcEndOfDay(value: string): number {
  return Date.parse(`${value}T23:59:59.999Z`);
}

export function formatLegalDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function getLawReviewStatus(law: Law, asOf: Date = new Date()): LegalReviewStatus {
  const authorization = getReviewAuthorization({
    recordId: law.review.reviewRecordId,
    frameworkId: law.id,
    reviewDate: law.review.lastSubstantiveHumanReviewDate,
    nextReviewDue: law.review.nextReviewDue,
    reviewer: law.review.reviewer,
    sourceDataVersion: LEGAL_SOURCE_DATA_VERSION,
    checkerVersion: CHECKER_VERSION,
  });
  const authorizationHasStarted =
    authorization.authorizationStartsAt !== null &&
    asOf.getTime() >= Date.parse(authorization.authorizationStartsAt);
  const overdue =
    !authorization.dateWindowAuthorized ||
    !authorizationHasStarted ||
    asOf.getTime() > utcEndOfDay(law.review.nextReviewDue);

  return {
    state: overdue ? "source-review-overdue" : "current",
    overdue,
    reviewedDate: law.review.lastSubstantiveHumanReviewDate,
    reviewedLabel: formatLegalDate(law.review.lastSubstantiveHumanReviewDate),
    nextReviewDue: law.review.nextReviewDue,
    nextReviewDueLabel: formatLegalDate(law.review.nextReviewDue),
    lastAutomatedSourceCheckDate: law.review.lastAutomatedSourceCheckDate,
    lastAutomatedSourceCheckLabel: formatLegalDate(law.review.lastAutomatedSourceCheckDate),
    automatedSourceCheckStatus: law.review.automatedSourceCheckStatus,
    automatedSourceCheckNote: law.review.automatedSourceCheckNote,
    automatedAccessLimitedLawIds:
      law.review.automatedSourceCheckStatus === "access_limited" ? [law.id] : [],
    sourceDataVersion: law.review.sourceDataVersion,
    checkerVersion: law.review.checkerVersion,
    reviewer: law.review.reviewer,
    reviewRecordId: law.review.reviewRecordId,
    reviewAuthorizationState: authorization.state,
    reviewMetadataLinked: authorization.metadataLinked,
    overdueLawIds: overdue ? [law.id] : [],
  };
}

export interface Law {
  id: LawId;
  name: string;
  shortName: string;
  jurisdiction: string;
  status: string;
  timingSummary: string;
  whoItHits: string;
  rolesAffected: string[];
  applicabilitySignals: string[];
  definitions: string[];
  exceptions: string[];
  requires: string[];
  penalty: string;
  officialSources: OfficialSource[];
  review: LawReviewRecord;
  changeHistory: LawChangeRecord[];
}

const COMMON_REVIEW = {
  reviewRecordId: LEGAL_REVIEW_RECORD_ID,
  checkerVersion: CHECKER_VERSION,
  lastAutomatedSourceCheckDate: LAST_AUTOMATED_SOURCE_CHECK_DATE,
  automatedSourceCheckStatus: "passed" as const,
  automatedAccessLimitedSourceIds: [] as string[],
  automatedAllowlistSourceIds: [] as string[],
  automatedSourceCheckNote:
    "All configured automated checks for this framework completed without a detected failure.",
  lastSubstantiveHumanReviewDate: LEGAL_REVIEW_DATE,
  nextReviewDue: NEXT_LEGAL_REVIEW_DUE,
  reviewer: LEGAL_REVIEWER,
} as const;

export const LAWS: Record<LawId, Law> = {
  ftc: {
    id: "ftc",
    name: "FTC Endorsement Guides and Section 5",
    shortName: "FTC endorsements (US)",
    jurisdiction: "United States federal law; audience and market facts matter",
    status: "current_interpretive_guides_and_binding_adjacent_rule",
    timingSummary: "Endorsement Guides finalized June 29, 2023 and published/effective July 26, 2023",
    whoItHits:
      "Advertising endorsements with a material connection to a marketer. The FTC evaluates context and consumer understanding case by case.",
    rolesAffected: ["Advertisers", "Endorsers", "Intermediaries involved in endorsements"],
    applicabilitySignals: [
      "Advertising or endorsement content",
      "Payment, gift, affiliate commission, employment, or another material connection",
      "Claims or experiences attributed to an endorser",
    ],
    definitions: [
      "Endorsement analysis depends on the message consumers are likely to understand as another party's opinion, belief, finding, or experience.",
      "A material connection is a relationship that may materially affect the weight or credibility consumers give the endorsement and may not be reasonably expected by the audience.",
    ],
    exceptions: [
      "The reviewed Part 255 sources do not create a general disclosure duty triggered solely by AI assistance.",
      "Disclosure need and presentation remain context- and audience-specific; examples are not universal safe harbors.",
      "Part 465 is a separate binding Consumer Reviews and Testimonials Rule. It does not amend Part 255, make the Guides binding, or turn every inconsistency with the Guides into a Part 465 violation.",
    ],
    requires: [
      "Review whether a payment, gift, affiliate commission, employment, or other material connection needs a clear and conspicuous disclosure.",
      "Confirm that any endorsement reflects an honest opinion or experience and that advertising claims are not deceptive.",
      "Do not treat this guide as an independent FTC rule requiring a separate label merely because AI assisted with content.",
    ],
    penalty:
      "The Guides do not themselves have the force of law or impose a fixed per-post fine. Remedies depend on the FTC Act, the facts, prior orders or notices, and the enforcement path.",
    officialSources: [
      {
        sourceId: "us-ftc-section-5",
        authority: "United States Congress",
        title: "15 U.S.C. § 45",
        jurisdiction: "United States",
        sourceType: "statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute",
        canonicalUrl: "https://www.govinfo.gov/link/uscode/15/45",
        documentId: "15-USC-45",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "us-ftc-endorsement-guides",
        authority: "Federal Trade Commission",
        title: "Guides Concerning the Use of Endorsements and Testimonials in Advertising",
        jurisdiction: "United States",
        sourceType: "administrative_interpretive_guides",
        legalStatus: "current",
        bindingEffect: "administrative_interpretation_not_standalone_rule",
        canonicalUrl: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255",
        documentId: "16-CFR-Part-255",
        publishedDate: "2023-07-26",
        effectiveDate: "2023-07-26",
        consolidatedAsOf: "2026-08-27",
        retrievedAt: "2026-08-29",
        contentSha256: "feb1c8cfee82158c16c4210ef320bc93ffb2f414aa2bdce6e6772a77064180ea",
        fingerprintUrl: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-27/title-16.xml?part=255",
      },
      {
        sourceId: "us-ftc-endorsement-qa",
        authority: "Federal Trade Commission staff",
        title: "The FTC's Endorsement Guides: What People Are Asking",
        jurisdiction: "United States",
        sourceType: "staff_guidance",
        legalStatus: "current",
        bindingEffect: "nonbinding_staff_guidance_no_safe_harbor",
        canonicalUrl: "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
        publishedDate: "2023-06-29",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "us-ftc-endorsement-guides-final",
        authority: "Federal Trade Commission",
        title: "Revised Endorsement Guides final publication",
        jurisdiction: "United States",
        sourceType: "federal_register_final_document",
        legalStatus: "published",
        bindingEffect: "official_final_publication_of_interpretive_guides",
        canonicalUrl: "https://www.federalregister.gov/d/2023-14795",
        documentId: "FR-Doc-2023-14795-88-FR-48092",
        publishedDate: "2023-07-26",
        effectiveDate: "2023-07-26",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "us-ftc-consumer-review-rule",
        authority: "Federal Trade Commission",
        title: "Rule on the Use of Consumer Reviews and Testimonials",
        jurisdiction: "United States",
        sourceType: "trade_regulation_rule",
        legalStatus: "in_force",
        bindingEffect: "binding_rule",
        canonicalUrl: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465",
        documentId: "16-CFR-Part-465",
        effectiveDate: "2024-10-21",
        retrievedAt: "2026-08-29",
        notes: "Adjacent binding rule; it does not amend Part 255.",
      },
      {
        sourceId: "us-ftc-endorsement-guides-finalization-announcement",
        authority: "Federal Trade Commission",
        title: "Federal Trade Commission announces updated Endorsement Guides",
        jurisdiction: "United States",
        sourceType: "government_announcement",
        legalStatus: "published",
        bindingEffect: "supplemental_official_explanation",
        canonicalUrl:
          "https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements",
        publishedDate: "2023-06-29",
        retrievedAt: "2026-08-29",
        notes: "Supplemental support for the implemented June 29, 2023 finalization date.",
      },
    ],
    review: {
      ...COMMON_REVIEW,
      sourceDataVersion: "us-ftc-sources-2026-08-29.3",
      templateVersion: null,
    },
    changeHistory: [
      {
        date: "2026-08-29",
        summary: "Clarified that nonbinding Part 255 and the separate binding Part 465 rule have distinct legal effects.",
        sourceIds: ["us-ftc-endorsement-guides", "us-ftc-consumer-review-rule"],
      },
      {
        date: "2026-08-29",
        summary: "Automated comparison found Part 255 unchanged from August 2; added complete codified, statutory, final-publication, and adjacent Part 465 sources.",
        sourceIds: ["us-ftc-section-5", "us-ftc-endorsement-guides", "us-ftc-consumer-review-rule"],
      },
    ],
  },
  euArt50: {
    id: "euArt50",
    name: "EU AI Act Article 50 transparency obligations",
    shortName: "EU AI Act Art. 50",
    jurisdiction:
      "European Union; Article 2 scope includes certain non-EU providers and deployers when AI output is used in the Union",
    status: "in_force_and_generally_applicable",
    timingSummary: "Article 50 generally applies from August 2, 2026; a narrow Article 50(2) transition ends December 2, 2026",
    whoItHits:
      "Providers and deployers in the categories described by Article 50. Public accessibility from the EU alone is not a complete jurisdiction test.",
    rolesAffected: ["Providers", "Deployers"],
    applicabilitySignals: [
      "AI systems intended to interact directly with people",
      "Systems generating synthetic audio, image, video, or text",
      "Emotion-recognition or biometric-categorisation deployment",
      "Deepfakes or specified public-interest text",
      "Provider or deployer scope under Article 2, including certain non-EU activity whose output is used in the Union",
    ],
    definitions: [
      "Provider and deployer are distinct roles under the Regulation.",
      "Article 50 uses separate categories for direct interaction, machine-readable marking, emotion/biometric systems, deepfakes, and specified public-interest text.",
    ],
    exceptions: [
      "Article 50(1)'s direct-interaction notice does not apply when the AI interaction is obvious to a reasonably well-informed, observant, and circumspect person in the circumstances and context; it also contains a qualified law-enforcement exception with safeguards and a public crime-reporting caveat.",
      "Article 50(2)'s machine-readable marking duty does not apply to the extent a system performs an assistive function for standard editing or does not substantially alter the deployer's input data or its semantics; it also contains a law-enforcement qualification.",
      "Article 50(3)'s notice duty contains a qualified law-enforcement exception for permitted biometric-categorisation or emotion-recognition uses, subject to appropriate safeguards.",
      "Article 50(4) contains a law-enforcement qualification. For evidently artistic, creative, satirical, fictional, or analogous works or programmes, disclosure is still required but may be made in an appropriate manner that does not hamper display or enjoyment; this is not a blanket exemption.",
      "For Article 50(4) public-interest text, disclosure does not apply when the AI-generated content underwent human review or editorial control and a natural or legal person holds editorial responsibility for publication.",
      "Article 111(4) delays only Article 50(2) for covered systems placed on the market before August 2, 2026 until December 2, 2026.",
    ],
    requires: [
      "Review whether you are a provider or deployer within Article 2 and whether the relevant output is used in the Union.",
      "For providers of systems intended to interact directly with people, review the Article 50(1) first-interaction notice and its stated exception.",
      "For deployers, review Article 50(3) for emotion-recognition and biometric-categorisation systems and Article 50(4) for deepfakes and specified public-interest text, including category-specific exceptions.",
      "For providers, review the separate machine-readable marking duty in Article 50(2). Regulation (EU) 2026/1744 delays only that paragraph until December 2, 2026 for covered systems placed on the market before August 2, 2026; it does not postpone the other Article 50 duties.",
    ],
    penalty:
      "Article 99 sets maximum administrative-fine tiers, but the applicable tier, amount, SME treatment, and enforcement depend on the violated obligation and case facts.",
    officialSources: [
      {
        sourceId: "eu-ai-act-base",
        authority: "European Parliament and Council",
        title: "Regulation (EU) 2024/1689",
        jurisdiction: "European Union",
        sourceType: "regulation",
        legalStatus: "in_force",
        bindingEffect: "binding_regulation",
        canonicalUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
        documentId: "CELEX-32024R1689",
        adoptedDate: "2024-06-13",
        publishedDate: "2024-07-12",
        effectiveDate: "2024-08-01",
        applicableDate: "2026-08-02",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "eu-ai-act-amendment-2026-1744",
        authority: "European Parliament and Council",
        title: "Regulation (EU) 2026/1744",
        jurisdiction: "European Union",
        sourceType: "amending_regulation",
        legalStatus: "in_force",
        bindingEffect: "binding_regulation",
        canonicalUrl: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng",
        documentId: "CELEX-32026R1744",
        adoptedDate: "2026-07-08",
        publishedDate: "2026-07-24",
        effectiveDate: "2026-07-27",
        retrievedAt: "2026-08-29",
        amends: "CELEX-32024R1689",
      },
      {
        sourceId: "eu-ai-act-consolidated",
        authority: "EUR-Lex",
        title: "Consolidated Regulation (EU) 2024/1689",
        jurisdiction: "European Union",
        sourceType: "consolidated_text",
        legalStatus: "current_documentation_copy",
        bindingEffect: "documentation_only_non_authentic",
        canonicalUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng",
        documentId: "CELEX-02024R1689-20260727",
        consolidatedAsOf: "2026-07-27",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "eu-art50-guidelines",
        authority: "European Commission",
        title: "Guidelines on Article 50 transparency obligations",
        jurisdiction: "European Union",
        sourceType: "guidelines",
        legalStatus: "current",
        bindingEffect: "nonbinding_guidelines",
        canonicalUrl: "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems",
        documentId: "C(2026)-5054-final",
        publishedDate: "2026-07-20",
        retrievedAt: "2026-08-29",
        contentSha256: "30861fc5de31205846f023068069c92fabc7271ebeac6af7bef68b97f0a33f66",
        fingerprintUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/131215",
      },
      {
        sourceId: "eu-art50-code",
        authority: "European Commission",
        title: "Code of Practice on Transparency of AI-Generated Content",
        jurisdiction: "European Union",
        sourceType: "code_of_practice",
        legalStatus: "current",
        bindingEffect: "voluntary_code_formally_assessed_adequate",
        canonicalUrl: "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content",
        publishedDate: "2026-06-10",
        retrievedAt: "2026-08-29",
        contentSha256: "7bd22c5a3c56eaefda27a5bf7a6118198ef2a9c9255241bd97abf7cdedf9bc28",
        fingerprintUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/129555",
        notes: "Commission and AI Board assessed the Code as adequate for Article 50(2), (4), and (5); adherence is not conclusive evidence of compliance.",
      },
      {
        sourceId: "eu-art50-code-commission-opinion",
        authority: "European Commission",
        title: "Commission opinion on adequacy of the Article 50 Code of Practice",
        jurisdiction: "European Union",
        sourceType: "commission_opinion",
        legalStatus: "adopted",
        bindingEffect: "formal_adequacy_assessment_not_conclusive_compliance_proof",
        canonicalUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/130913",
        documentId: "C(2026)-4839-final",
        adoptedDate: "2026-07-08",
        retrievedAt: "2026-08-29",
        contentSha256: "e9b85373cde28a6081fab307fa17fa4c90c2560a1c9a145fb461f696bca424ce",
        fingerprintUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/130913",
      },
      {
        sourceId: "eu-art50-code-board-assessment",
        authority: "European Artificial Intelligence Board",
        title: "AI Board assessment of the Article 50 Code of Practice",
        jurisdiction: "European Union",
        sourceType: "board_assessment",
        legalStatus: "adopted",
        bindingEffect: "formal_adequacy_assessment",
        canonicalUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/130916",
        adoptedDate: "2026-07-09",
        retrievedAt: "2026-08-29",
        contentSha256: "a01d832e0d4b10ebb66d27d0e8cf621aabb18aa56e5c24d39d6b4000a9adfcd2",
        fingerprintUrl: "https://ec.europa.eu/newsroom/dae/redirection/document/130916",
      },
      {
        sourceId: "eu-art50-adequacy-opinion-landing",
        authority: "European Commission",
        title: "Commission opinion on assessment of the Code of Practice on transparency of AI-generated content",
        jurisdiction: "European Union",
        sourceType: "government_announcement",
        legalStatus: "published",
        bindingEffect: "supplemental_official_explanation",
        canonicalUrl:
          "https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-code-practice-transparency-ai-generated-content",
        retrievedAt: "2026-08-29",
        notes:
          "Supplemental official explanation of the Commission and AI Board adequacy assessments; adherence is not conclusive evidence of compliance.",
      },
    ],
    review: {
      ...COMMON_REVIEW,
      sourceDataVersion: "eu-art50-sources-2026-08-29.3",
      templateVersion: "eu-art50-deepfake-en-v1",
    },
    changeHistory: [
      {
        date: "2026-08-29",
        summary: "Enumerated the material paragraph-specific Article 50 qualifications and clarified that the artistic-work provision limits the manner of disclosure rather than creating a blanket exemption.",
        sourceIds: ["eu-ai-act-base", "eu-ai-act-consolidated"],
      },
      {
        date: "2026-08-29",
        summary: "Recorded Regulation 2026/1744's replacement of Article 50(7) and the Commission and AI Board formal adequacy assessments of the voluntary Code of Practice.",
        sourceIds: ["eu-ai-act-amendment-2026-1744", "eu-art50-code-commission-opinion", "eu-art50-code-board-assessment"],
      },
    ],
  },
  nySynthetic: {
    id: "nySynthetic",
    name: "New York synthetic performer advertising law",
    shortName: "New York GBL § 396-b",
    jurisdiction: "New York; coverage and advertising-media exclusions depend on the enacted text",
    status: "in_force",
    timingSummary: "Effective June 9, 2026 (180 days after enactment)",
    whoItHits:
      "A person engaged in dealing in property or services who, for a commercial purpose and with actual knowledge, produces or creates a covered advertisement using a synthetic performer, subject to definitions and exclusions.",
    rolesAffected: ["Person producing or creating a covered commercial advertisement"],
    applicabilitySignals: [
      "Commercial advertisement using a statutory synthetic performer",
      "Actual knowledge by the producer or creator",
      "New York statutory scope",
    ],
    definitions: [
      "The statutory synthetic-performer definition addresses specified digitally created, reproduced, or modified human audiovisual or visual performance assets.",
      "Coverage turns on the enacted advertisement, role, commercial-purpose, and actual-knowledge language.",
    ],
    exceptions: [
      "Specified expressive-work promotion",
      "Audio advertisements",
      "Translation-only uses",
      "Advertising media that publish or disseminate the material",
    ],
    requires: [
      "Review whether the asset meets the statutory definition of a synthetic performer and whether the material is a covered advertisement.",
      "Review who produced or created the advertisement, whether that person had actual knowledge, and the conspicuous-disclosure requirement.",
      "Review the exclusions for specified expressive-work promotion, audio ads, translation-only uses, and advertising media that publish or disseminate the material.",
    ],
    penalty:
      "The enacted bill states $1,000 for a first violation and $5,000 for a subsequent violation; applicability still depends on the statutory elements and exceptions.",
    officialSources: [
      {
        sourceId: "ny-gbl-396-b",
        authority: "New York State Legislature",
        title: "New York General Business Law § 396-b",
        jurisdiction: "New York",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute",
        canonicalUrl: "https://www.nysenate.gov/legislation/laws/GBS/396-B",
        documentId: "NY-GBL-396-B",
        effectiveDate: "2026-06-09",
        consolidatedAsOf: "2026-06-12",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ny-s8420-a",
        authority: "New York State Legislature",
        title: "S.8420-A enacted bill",
        jurisdiction: "New York",
        sourceType: "chaptered_bill",
        legalStatus: "enacted",
        bindingEffect: "enacted_amendment",
        canonicalUrl: "https://www.nysenate.gov/legislation/bills/2025/S8420/amendment/A",
        documentId: "Chapter-617-Laws-2025",
        adoptedDate: "2025-12-11",
        effectiveDate: "2026-06-09",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ny-s8420-effective-date-announcement",
        authority: "Governor of New York",
        title: "Official announcement confirming the June 9, 2026 effective date",
        jurisdiction: "New York",
        sourceType: "government_announcement",
        legalStatus: "published",
        bindingEffect: "official_explanatory_source",
        canonicalUrl: "https://www.governor.ny.gov/news/governor-hochul-announces-first-nation-law-requiring-disclosure-when-advertisements-include-ai",
        publishedDate: "2026-06-09",
        retrievedAt: "2026-08-29",
      },
    ],
    review: {
      ...COMMON_REVIEW,
      sourceDataVersion: "ny-gbl-396-b-2026-06-12.2",
      templateVersion: "ny-gbl-396-b-disclosure-en-v1",
      automatedSourceCheckStatus: "access_limited",
      automatedAccessLimitedSourceIds: ["ny-gbl-396-b", "ny-s8420-a"],
      automatedAllowlistSourceIds: [
        "ny-gbl-396-b",
        "ny-s8420-a",
        "ny-s8420-effective-date-announcement",
      ],
      automatedSourceCheckNote:
        "On August 29, 2026, direct automation returned HTTP 403 for the two New York legislative pages (§ 396-b and S.8420-A). The allowlisted Governor-page block was not observed, so that allowlist and metadata require review; automated coverage remains limited despite manual opening.",
    },
    changeHistory: [
      {
        date: "2026-08-29",
        summary: "Corrected the automated-access note to distinguish the two observed legislative HTTP 403 responses from the unobserved allowlisted Governor-page block.",
        sourceIds: ["ny-gbl-396-b", "ny-s8420-a", "ny-s8420-effective-date-announcement"],
      },
      {
        date: "2026-08-29",
        summary: "Corrected the regulated role and broad advertising-media exclusion; removed written-notice, cure, and anti-removal clauses that appeared in an earlier bill but not the enacted or codified law.",
        sourceIds: ["ny-gbl-396-b", "ny-s8420-a"],
      },
    ],
  },
  caBot: {
    id: "caBot",
    name: "California B.O.T. Act",
    shortName: "California B.O.T. Act",
    jurisdiction: "California communications; statutory purpose and intent elements matter",
    status: "in_force",
    timingSummary: "Effective January 1, 2019; operative July 1, 2019",
    whoItHits:
      "Use of a bot to communicate online with a person in California with intent to mislead about its artificial identity for specified commercial or electoral purposes.",
    rolesAffected: ["Person using a bot for covered online communications"],
    applicabilitySignals: [
      "Online communication with a person in California",
      "Intent to mislead about artificial identity and knowingly deceive about content",
      "Commercial purchase/sale or election-influence purpose",
    ],
    definitions: [
      "A “bot” is an automated online account where all or substantially all of the actions or posts of that account are not the result of a person.",
      "“Online” means appearing on a public-facing internet website, web application, or digital application, including a social network or publication.",
      "The statutory elements must be evaluated together rather than inferred from a chatbot label alone.",
    ],
    exceptions: [
      "Section-specific liability does not attach when the person provides the clear, conspicuous bot disclosure described by the section.",
      "Section 17942(c) says the chapter does not impose a duty on service providers of online platforms, including web-hosting and internet-service providers.",
      "The section does not resolve other consumer-protection, privacy, election, accessibility, or sector-specific law.",
    ],
    requires: [
      "Review whether the communication, intent, and commercial or electoral purpose elements are all present.",
      "Review the statute's clear-and-conspicuous disclosure language rather than assuming every customer-service bot is automatically covered.",
    ],
    penalty:
      "The section does not state a fixed per-message fine or its own remedial schedule. Consequences depend on other applicable law, the enforcement path, and the facts.",
    officialSources: [
      {
        sourceId: "ca-bpc-17940",
        authority: "California Legislature",
        title: "California Business and Professions Code § 17940",
        jurisdiction: "California",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute_definitions",
        canonicalUrl:
          "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17940",
        documentId: "CA-BPC-17940",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-bpc-17941",
        authority: "California Legislature",
        title: "California Business and Professions Code § 17941",
        jurisdiction: "California",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute",
        canonicalUrl: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941",
        documentId: "CA-BPC-17941",
        effectiveDate: "2019-01-01",
        applicableDate: "2019-07-01",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-bpc-17942",
        authority: "California Legislature",
        title: "California Business and Professions Code § 17942",
        jurisdiction: "California",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute_qualifications",
        canonicalUrl:
          "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17942",
        documentId: "CA-BPC-17942",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-bpc-17943",
        authority: "California Legislature",
        title: "California Business and Professions Code § 17943",
        jurisdiction: "California",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute_operative_date",
        canonicalUrl:
          "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17943",
        documentId: "CA-BPC-17943",
        applicableDate: "2019-07-01",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-sb1001-ch892-2018",
        authority: "California Legislature",
        title: "SB 1001 chaptered bill",
        jurisdiction: "California",
        sourceType: "chaptered_bill",
        legalStatus: "enacted",
        bindingEffect: "enacted_amendment",
        canonicalUrl: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001",
        documentId: "Chapter-892-Statutes-2018",
        adoptedDate: "2018-09-28",
        effectiveDate: "2019-01-01",
        applicableDate: "2019-07-01",
        retrievedAt: "2026-08-29",
      },
    ],
    review: {
      ...COMMON_REVIEW,
      sourceDataVersion: "ca-bpc-17941-2026-08-29.3",
      templateVersion: "ca-bot-disclosure-en-v1",
    },
    changeHistory: [
      {
        date: "2026-08-29",
        summary: "Added the statutory bot and online definitions and the Section 17942(c) online-platform service-provider no-duty qualification.",
        sourceIds: ["ca-bpc-17940", "ca-bpc-17942", "ca-sb1001-ch892-2018"],
      },
      {
        date: "2026-08-29",
        summary: "Removed an unsupported statement tying the section's penalty to California unfair-competition law; the cited section states no fixed per-message fine.",
        sourceIds: ["ca-bpc-17941", "ca-sb1001-ch892-2018"],
      },
    ],
  },
  caSb942: {
    id: "caSb942",
    name: "California AI Transparency Act (SB 942, as amended by AB 853)",
    shortName: "California AI Transparency Act",
    jurisdiction: "California",
    status: "in_force_with_staged_duties_and_pending_amendment",
    timingSummary: "Chapter operative August 2, 2026; added platform duties begin January 1, 2027 and capture-device duties January 1, 2028",
    whoItHits:
      "Defined covered providers and affected third-party licensees; defined large online platforms and GenAI system hosting platforms beginning January 1, 2027; and defined capture device manufacturers for specified devices beginning January 1, 2028.",
    rolesAffected: [
      "Covered providers",
      "Affected third-party licensees",
      "Large online platforms",
      "GenAI system hosting platforms",
      "Capture device manufacturers",
    ],
    applicabilitySignals: [
      "Creating or producing a publicly accessible GenAI system above the statutory user threshold",
      "Operating a qualifying large online platform or hosting platform",
      "Licensing and modifying a covered provider's system under the stated conditions",
      "Manufacturing covered capture devices for California sale",
    ],
    definitions: [
      "Each role has its own statutory definition, threshold, conditions, and operative date.",
      "Ordinary use of a third-party AI tool does not by itself establish a regulated role under this chapter.",
    ],
    exceptions: [
      "Section 22757.5 excludes a product, service, website, or application providing exclusively specified non-user-generated entertainment experiences.",
      "A person exclusively engaged in device assembly is excluded from the capture-device-manufacturer definition.",
      "The large-online-platform definition excludes broadband internet access services and telecommunications services, each as defined in the cited law.",
    ],
    requires: [
      "If you create, code, or otherwise produce a public GenAI system with more than 1,000,000 monthly visitors or users and California accessibility, review the no-cost detection-tool, manifest-option, latent-disclosure, privacy, and licensing duties operative August 2, 2026.",
      "If you operate a defined large online platform that exceeded 2,000,000 unique monthly users during the preceding 12 months, review the provenance-data interface and anti-stripping duties that become operative January 1, 2027.",
      "If you operate a defined GenAI system hosting platform, review the January 1, 2027 restriction on knowingly making available a system that does not place the required disclosures.",
      "If you manufacture capture devices for sale in California, review the technically feasible latent-disclosure duties for devices first produced for sale on or after January 1, 2028.",
      "If you are a third-party licensee of a covered provider's GenAI system, review the cease-use duty after the provider revokes authorization under the stated knowledge and modification conditions.",
    ],
    penalty:
      "The current code sets a $5,000 civil penalty per violation. It treats each day that a covered provider, large online platform, or capture device manufacturer violates the chapter as a discrete violation; a separate remedy applies to the specified third-party-licensee violation.",
    officialSources: [
      {
        sourceId: "ca-bpc-chapter-25",
        authority: "California Legislature",
        title: "California Business and Professions Code, Division 8, Chapter 25",
        jurisdiction: "California",
        sourceType: "codified_statute",
        legalStatus: "in_force",
        bindingEffect: "binding_statute",
        canonicalUrl: "https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=25.&division=8.&lawCode=BPC&part=&title=",
        documentId: "CA-BPC-Chapter-25",
        applicableDate: "2026-08-02",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-sb1000-2025-2026",
        authority: "California Legislature",
        title: "Pending SB 1000 official status and history",
        jurisdiction: "California",
        sourceType: "pending_bill",
        legalStatus: "passed_legislature_not_chaptered",
        bindingEffect: "not_current_law",
        canonicalUrl: "https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000",
        documentId: "20250SB1000",
        officialPageLastUpdated: "2026-08-27",
        retrievedAt: "2026-08-29",
        notes: "Passed the Legislature and was ordered to enrolling; verify chaptering before treating it as law.",
      },
      {
        sourceId: "ca-sb1000-2025-2026-text",
        authority: "California Legislature",
        title: "Pending SB 1000 current bill text",
        jurisdiction: "California",
        sourceType: "pending_bill_text",
        legalStatus: "passed_legislature_not_chaptered",
        bindingEffect: "not_current_law",
        canonicalUrl:
          "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB1000",
        documentId: "20250SB1000-current-text",
        officialPageLastUpdated: "2026-08-21",
        retrievedAt: "2026-08-29",
        notes: "Passed text used only to identify proposed changes; live status controls whether it remains pending.",
      },
      {
        sourceId: "ca-ab853-2025",
        authority: "California Legislature",
        title: "AB 853 chaptered amendment",
        jurisdiction: "California",
        sourceType: "chaptered_bill",
        legalStatus: "enacted",
        bindingEffect: "enacted_amendment",
        canonicalUrl: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB853",
        documentId: "Chapter-674-Statutes-2025",
        retrievedAt: "2026-08-29",
      },
      {
        sourceId: "ca-sb942-2024",
        authority: "California Legislature",
        title: "SB 942 chaptered text",
        jurisdiction: "California",
        sourceType: "chaptered_bill",
        legalStatus: "enacted",
        bindingEffect: "enacted_base_act",
        canonicalUrl: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942",
        documentId: "Chapter-291-Statutes-2024",
        retrievedAt: "2026-08-29",
      },
    ],
    review: {
      ...COMMON_REVIEW,
      sourceDataVersion: "ca-ai-transparency-2026-08-29.3",
      templateVersion: null,
    },
    changeHistory: [
      {
        date: "2026-08-29",
        summary: "Added the broadband-internet-access and telecommunications-service exclusions from the large-online-platform definition.",
        sourceIds: ["ca-bpc-chapter-25"],
      },
      {
        date: "2026-08-29",
        summary: "Automated status check found SB 1000 passed the Legislature and ordered to enrolling but not chaptered; retained current codified thresholds and marked substantive review overdue.",
        sourceIds: ["ca-bpc-chapter-25", "ca-sb1000-2025-2026", "ca-sb1000-2025-2026-text"],
      },
    ],
  },
};

function assertIsoDate(label: string, value: string): void {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error(`Invalid ${label}: ${value}`);
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(match[1]) ||
    parsed.getUTCMonth() + 1 !== Number(match[2]) ||
    parsed.getUTCDate() !== Number(match[3])
  ) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

for (const law of Object.values(LAWS)) {
  assertIsoDate(`${law.id}.lastAutomatedSourceCheckDate`, law.review.lastAutomatedSourceCheckDate);
  assertIsoDate(`${law.id}.lastSubstantiveHumanReviewDate`, law.review.lastSubstantiveHumanReviewDate);
  assertIsoDate(`${law.id}.nextReviewDue`, law.review.nextReviewDue);
  if (law.review.nextReviewDue < law.review.lastSubstantiveHumanReviewDate) {
    throw new Error(`${law.id}.nextReviewDue predates substantive review`);
  }
  const sourceIds = new Set(law.officialSources.map((source) => source.sourceId));
  if (sourceIds.size !== law.officialSources.length) throw new Error(`${law.id} has duplicate source ids`);
  if (
    law.review.automatedSourceCheckStatus === "passed" &&
    law.review.automatedAccessLimitedSourceIds.length > 0
  ) {
    throw new Error(`${law.id} cannot list access-limited sources while the automated check passed`);
  }
  if (
    law.review.automatedSourceCheckStatus === "access_limited" &&
    law.review.automatedAccessLimitedSourceIds.length === 0
  ) {
    throw new Error(`${law.id} must identify each access-limited source`);
  }
  if (
    new Set(law.review.automatedAccessLimitedSourceIds).size !==
    law.review.automatedAccessLimitedSourceIds.length
  ) {
    throw new Error(`${law.id} has duplicate access-limited source IDs`);
  }
  if (
    new Set(law.review.automatedAllowlistSourceIds).size !==
    law.review.automatedAllowlistSourceIds.length
  ) {
    throw new Error(`${law.id} has duplicate automation-allowlist source IDs`);
  }
  for (const sourceId of law.review.automatedAccessLimitedSourceIds) {
    if (!sourceIds.has(sourceId)) throw new Error(`${law.id} access limit references unknown source ${sourceId}`);
    if (!law.review.automatedAllowlistSourceIds.includes(sourceId)) {
      throw new Error(`${law.id} access-limited source ${sourceId} is missing from the automation allowlist`);
    }
  }
  for (const sourceId of law.review.automatedAllowlistSourceIds) {
    if (!sourceIds.has(sourceId)) throw new Error(`${law.id} allowlist references unknown source ${sourceId}`);
  }
  for (const source of law.officialSources) {
    assertIsoDate(`${source.sourceId}.retrievedAt`, source.retrievedAt);
    for (const field of [
      "adoptedDate",
      "publishedDate",
      "effectiveDate",
      "applicableDate",
      "consolidatedAsOf",
      "officialPageLastUpdated",
    ] as const) {
      const value = source[field];
      if (value) assertIsoDate(`${source.sourceId}.${field}`, value);
    }
    if (source.contentSha256 && !/^[a-f0-9]{64}$/.test(source.contentSha256)) {
      throw new Error(`${source.sourceId}.contentSha256 is not a SHA-256 value`);
    }
    if (source.contentSha256 && !source.fingerprintUrl) {
      throw new Error(`${source.sourceId} has a fingerprint without a fingerprint URL`);
    }
    if (source.fingerprintUrl && !source.fingerprintUrl.startsWith("https://")) {
      throw new Error(`${source.sourceId}.fingerprintUrl must use HTTPS`);
    }
  }
  for (const change of law.changeHistory) {
    assertIsoDate(`${law.id}.changeHistory.date`, change.date);
    for (const sourceId of change.sourceIds) {
      if (!sourceIds.has(sourceId)) throw new Error(`${law.id} change references unknown source ${sourceId}`);
    }
  }
}

export function getLegalReviewStatus(asOf: Date = new Date()): LegalReviewStatus {
  const lawStatuses = Object.values(LAWS).map((law) => getLawReviewStatus(law, asOf));
  const overdueLawIds = lawStatuses.flatMap((status) => status.overdueLawIds);
  const automatedAccessLimitedLawIds = lawStatuses.flatMap(
    (status) => status.automatedAccessLimitedLawIds,
  );
  const earliestDue = [...lawStatuses].sort((a, b) => a.nextReviewDue.localeCompare(b.nextReviewDue))[0];
  const oldestReview = [...lawStatuses].sort((a, b) => a.reviewedDate.localeCompare(b.reviewedDate))[0];
  const oldestAutomated = [...lawStatuses].sort((a, b) =>
    a.lastAutomatedSourceCheckDate.localeCompare(b.lastAutomatedSourceCheckDate),
  )[0];

  return {
    state: overdueLawIds.length ? "source-review-overdue" : "current",
    overdue: overdueLawIds.length > 0,
    reviewedDate: oldestReview.reviewedDate,
    reviewedLabel: oldestReview.reviewedLabel,
    nextReviewDue: earliestDue.nextReviewDue,
    nextReviewDueLabel: earliestDue.nextReviewDueLabel,
    lastAutomatedSourceCheckDate: oldestAutomated.lastAutomatedSourceCheckDate,
    lastAutomatedSourceCheckLabel: oldestAutomated.lastAutomatedSourceCheckLabel,
    automatedSourceCheckStatus: automatedAccessLimitedLawIds.length ? "access_limited" : "passed",
    automatedSourceCheckNote: automatedAccessLimitedLawIds.length
      ? `Direct automation had access limits for: ${automatedAccessLimitedLawIds
          .map((lawId) => LAWS[lawId].shortName)
          .join(", ")}.`
      : "All configured automated checks completed without a detected failure.",
    automatedAccessLimitedLawIds,
    sourceDataVersion: LEGAL_SOURCE_DATA_VERSION,
    checkerVersion: CHECKER_VERSION,
    reviewer: LEGAL_REVIEWER,
    reviewRecordId: oldestReview.reviewRecordId,
    reviewAuthorizationState: lawStatuses.every(
      (status) => status.reviewAuthorizationState === oldestReview.reviewAuthorizationState,
    )
      ? oldestReview.reviewAuthorizationState
      : "invalid",
    reviewMetadataLinked: lawStatuses.every((status) => status.reviewMetadataLinked),
    overdueLawIds,
  };
}

export type LawStatus = "review" | "monitor" | "lower";

export interface MatchedSignal {
  answerKey: keyof CheckerAnswers;
  answer: boolean;
  label: string;
}

export interface ResultProvenance {
  sourceReviewStatus: LegalReviewState;
  sourceVersion: string;
  lastSubstantiveHumanReview: string;
  nextReviewDue: string;
  lastAutomatedSourceCheck: string;
  automatedSourceCheckStatus: AutomatedSourceCheckStatus;
  automatedSourceCheckNote: string;
  checkerVersion: string;
  templateVersion: string | null;
  reviewRecordId: string;
  reviewAuthorizationState: ReviewAuthorizationState;
}

export interface DisclosureExample {
  text: string;
  templateVersion: string;
}

export interface LawResult {
  law: Law;
  status: LawStatus;
  headline: string;
  detail: string;
  matchedSignals: MatchedSignal[];
  unresolvedFacts: string[];
  provenance: ResultProvenance;
  sampleDisclosure?: DisclosureExample;
}

type LawResultDraft = Omit<LawResult, "matchedSignals" | "unresolvedFacts" | "provenance">;

export interface CheckerAnswers {
  publish: boolean;
  sponsored: boolean;
  humanReview: boolean;
  euAudience: boolean;
  deepfakes: boolean;
  nyAds: boolean;
  chatbot: boolean;
  bigProvider: boolean;
}

const CHECKER_SIGNAL_LABELS: Record<keyof CheckerAnswers, string> = {
  publish: "Publishes AI-generated or AI-assisted content online",
  sponsored: "Content is sponsored, advertising, gifted, or affiliate-linked",
  humanReview: "A person substantively reviews AI-written text",
  euAudience: "Published content can be accessed from the EU",
  deepfakes: "Publishes realistic AI media involving people, places, or events",
  nyAds: "Runs synthetic-performer advertising that could reach New York",
  chatbot: "Provides an AI system that interacts directly with people",
  bigProvider: "Reports a California-connected provider, licensee, platform, hosting, or device role",
};

const SIGNAL_KEYS: Record<LawId, (keyof CheckerAnswers)[]> = {
  ftc: ["publish", "sponsored"],
  euArt50: ["publish", "euAudience", "deepfakes", "chatbot", "humanReview"],
  nySynthetic: ["nyAds"],
  caBot: ["chatbot"],
  caSb942: ["bigProvider"],
};

const UNRESOLVED_FACTS: Record<LawId, string[]> = {
  ftc: [
    "The actual marketer relationship or material connection, if any",
    "What the intended audience would notice and understand",
    "Whether each endorsement and advertising claim is truthful and substantiated",
    "Whether the separate Consumer Reviews and Testimonials Rule or another law applies",
  ],
  euArt50: [
    "Whether Article 2 places the provider, deployer, system, or output within EU scope",
    "The operator's provider or deployer role and the exact Article 50 content category",
    "Whether a category-specific exception or the narrow Article 50(2) transition applies",
    "Emotion-recognition and biometric-categorisation facts, which these questions do not screen",
  ],
  nySynthetic: [
    "Who produced or created the advertisement and what that person actually knew",
    "Whether the asset and material meet the statutory synthetic-performer and advertisement definitions",
    "Whether an expressive-work, audio, translation, or advertising-media exclusion applies",
  ],
  caBot: [
    "Whether the bot communicates with a person in California",
    "Whether there is intent to mislead about the bot's artificial identity and knowingly deceive about content",
    "Whether the communication has the statute's commercial-purchase or electoral purpose",
  ],
  caSb942: [
    "The operator's exact statutory role and California connection",
    "Whether the applicable user, visitor, platform, hosting, licensing, or device thresholds are met",
    "Which staged operative date and technical duty applies",
    "Whether pending SB 1000 has since been chaptered or otherwise changed",
  ],
};

function matchedSignals(lawId: LawId, answers: CheckerAnswers): MatchedSignal[] {
  return SIGNAL_KEYS[lawId].map((answerKey) => ({
    answerKey,
    answer: answers[answerKey],
    label: CHECKER_SIGNAL_LABELS[answerKey],
  }));
}

export function evaluate(a: CheckerAnswers, asOf: Date = new Date()): LawResult[] {
  const results: LawResultDraft[] = [];

  if (a.publish && a.sponsored) {
    results.push({
      law: LAWS.ftc,
      status: "review",
      headline: "Material-connection and endorsement rules are worth reviewing.",
      detail:
        "Your answer groups paid, gifted, and affiliate relationships that require different factual wording. Identify the actual connection before choosing a disclosure, then review whether consumers would notice and understand it and whether the endorsement remains truthful. The FTC sources do not create a standalone AI-use labeling rule.",
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.ftc,
      status: "monitor",
      headline: "Review this if a marketer or other material connection is involved.",
      detail:
        "AI use alone does not trigger the FTC Endorsement Guides. Payment, gifts, affiliate commissions, employment, or another connection may change the analysis.",
    });
  } else {
    results.push({
      law: LAWS.ftc,
      status: "lower",
      headline: "Lower apparent relevance based on the publishing answers.",
      detail:
        "Your answers did not identify published AI-assisted endorsements. If you later publish a paid, gifted, affiliate, employee, or other connected endorsement, review the actual relationship and advertising claims rather than reusing a generic disclosure.",
    });
  }

  if (a.chatbot || a.deepfakes || (a.publish && a.euAudience)) {
    const signals = [
      a.chatbot
        ? "Your chatbot answer raises the provider notice in Article 50(1) if EU scope and the provision's other elements are met."
        : null,
      a.deepfakes
        ? "Your realistic-media answer raises the deployer disclosure in Article 50(4) if EU scope, the definition, and the provision's other elements are met."
        : null,
      a.publish && a.euAudience
        ? "Your publication and EU-access answers warrant a closer Article 2 and Article 50 role-and-content review."
        : null,
    ].filter((signal): signal is string => signal !== null);

    results.push({
      law: LAWS.euArt50,
      status: "review",
      headline: "Article 50 may be relevant; jurisdiction and content category need review.",
      detail:
        `${signals.join(" ")} Article 2 and Article 50 require more than these screening answers.${a.humanReview ? " Human review and identified editorial responsibility may matter for specified public-interest text, but do not create a universal exception." : ""} These eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).`,
      sampleDisclosure: a.deepfakes
        ? {
            text: "This content was artificially generated or manipulated.",
            templateVersion: "eu-art50-deepfake-en-v1",
          }
        : undefined,
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.euArt50,
      status: "monitor",
      headline: "EU scope cannot be decided from public accessibility alone.",
      detail:
        "If AI output is used in the Union or your operation otherwise falls within Article 2, review the provider and deployer duties in Article 50. These eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).",
    });
  } else {
    results.push({
      law: LAWS.euArt50,
      status: "lower",
      headline: "Lower apparent relevance based on the answers screened.",
      detail:
        "Your answers did not identify the publication, realistic-media, or direct-interaction signals screened here. This is not a jurisdiction conclusion, and these eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).",
    });
  }

  if (a.nyAds) {
    results.push({
      law: LAWS.nySynthetic,
      status: "review",
      headline: "New York's synthetic-performer advertising rule may be relevant.",
      detail:
        "Review the enacted definition, actual-knowledge language, disclosure requirement, and exceptions before deciding coverage.",
      sampleDisclosure: {
        text: "This advertisement includes a synthetic performer.",
        templateVersion: "ny-gbl-396-b-disclosure-en-v1",
      },
    });
  } else {
    results.push({
      law: LAWS.nySynthetic,
      status: "lower",
      headline: "Lower apparent relevance based on the advertising answer.",
      detail:
        "Your answers did not identify an advertisement using a human-like synthetic performer that could reach New York. A different asset, distribution plan, or knowledge fact may change that screening result.",
    });
  }

  if (a.chatbot) {
    results.push({
      law: LAWS.caBot,
      status: "review",
      headline: "California's bot-disclosure rule may be relevant.",
      detail:
        "Coverage depends on communication with a person in California, intent to mislead about artificial identity, and a specified commercial or electoral purpose.",
      sampleDisclosure: {
        text: "I am an automated assistant, not a human representative.",
        templateVersion: "ca-bot-disclosure-en-v1",
      },
    });
  } else {
    results.push({
      law: LAWS.caBot,
      status: "lower",
      headline: "Lower apparent relevance based on the chatbot answer.",
      detail:
        "Your answers did not identify a sales or influence chatbot. If that changes, review the California communication, location, intent-to-mislead, deception, and commercial or electoral purpose elements together.",
    });
  }

  results.push(
    a.bigProvider
      ? {
          law: LAWS.caSb942,
          status: "review",
          headline: "A California AI Transparency Act business role may need review.",
          detail:
            "Your answer groups several different statutory roles and dates. Confirm whether you are a covered provider, affected third-party licensee, large online platform, GenAI system hosting platform, or capture device manufacturer, then review the provisions and operative date for that role. An August 29 automated source check found SB 1000 passed the Legislature and was ordered to enrolling, but it was still pending and not current law; substantive human review remains overdue.",
        }
      : {
          law: LAWS.caSb942,
          status: "lower",
          headline: "Lower apparent relevance based on your answers.",
          detail:
            "Your answers did not identify one of the screened provider, licensee, platform, hosting, or device-manufacturer roles. Ordinary use of a third-party AI tool does not by itself make a business one of those regulated entities, but the current statutory definitions and staged dates control.",
        },
  );

  return results.map((result) => {
    const review = getLawReviewStatus(result.law, asOf);
    return {
      ...result,
      matchedSignals: matchedSignals(result.law.id, a),
      unresolvedFacts: UNRESOLVED_FACTS[result.law.id],
      provenance: {
        sourceReviewStatus: review.state,
        sourceVersion: result.law.review.sourceDataVersion,
        lastSubstantiveHumanReview: review.reviewedDate,
        nextReviewDue: review.nextReviewDue,
        lastAutomatedSourceCheck: review.lastAutomatedSourceCheckDate,
        automatedSourceCheckStatus: review.automatedSourceCheckStatus,
        automatedSourceCheckNote: review.automatedSourceCheckNote,
        checkerVersion: result.law.review.checkerVersion,
        templateVersion: result.sampleDisclosure?.templateVersion ?? null,
        reviewRecordId: review.reviewRecordId,
        reviewAuthorizationState: review.reviewAuthorizationState,
      },
    };
  });
}
