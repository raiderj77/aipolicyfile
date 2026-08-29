import type { LawId } from "@/lib/laws";

export interface CorrectionRecord {
  id: string;
  date: string;
  frameworkId: LawId;
  title: string;
  priorInformation: string;
  correctedInformation: string;
  reason: string;
  officialSources: { label: string; url: string }[];
  affectedCheckerVersions: string[];
  affectedTemplates: string[];
  affectedGeneratedDocuments: string;
  affectedUsers: string;
  reviewer: string;
  resolution: string;
  status: "corrected-review-overdue" | "corrected";
}

export const CORRECTIONS: CorrectionRecord[] = [
  {
    id: "2026-08-29-ny-gbl-396-b-enacted-text",
    date: "2026-08-29",
    frameworkId: "nySynthetic",
    title: "New York guide used clauses removed before enactment",
    priorInformation:
      "The guide said advertising media could become responsible after written notice and a cure period and separately described a disclosure-removal prohibition.",
    correctedInformation:
      "Those clauses appeared in an earlier bill version but are absent from enacted S.8420-A and current General Business Law § 396-b. Current subdivision 8 instead broadly excludes an advertising medium by which a violating advertisement is published or disseminated. Subdivision 3's actual-knowledge condition attaches to the producer or creator.",
    reason:
      "An official-text comparison found that wording from the original bill had been carried into the enacted-law summary.",
    officialSources: [
      {
        label: "Current New York General Business Law § 396-b",
        url: "https://www.nysenate.gov/legislation/laws/GBS/396-B",
      },
      {
        label: "Enacted S.8420-A",
        url: "https://www.nysenate.gov/legislation/bills/2025/S8420/amendment/A",
      },
    ],
    affectedCheckerVersions: ["checker-2026-08-02.1"],
    affectedTemplates: ["The unversioned sample sentence was not affected by the removed clauses."],
    affectedGeneratedDocuments: "The site had no saved or generated customer documents.",
    affectedUsers: "No account or identifiable stored-output population existed for notification.",
    reviewer: "AI-assisted official-source check; no attorney review claimed.",
    resolution:
      "Removed the clauses, corrected the role and exclusion, made the codified source primary, added regression coverage, and retained the overdue state pending substantive human review.",
    status: "corrected-review-overdue",
  },
  {
    id: "2026-08-29-ca-bot-enforcement-overstatement",
    date: "2026-08-29",
    frameworkId: "caBot",
    title: "California B.O.T. Act enforcement note overstated the cited source",
    priorInformation:
      "The checker data said Business and Professions Code § 17941 was tied to California unfair-competition law.",
    correctedInformation:
      "The cited section does not state that linkage, a fixed per-message fine, or its own remedial schedule. Consequences depend on other applicable law, the enforcement path, and the facts.",
    reason:
      "The official codified section and chaptered SB 1001 did not support the prior enforcement characterization.",
    officialSources: [
      {
        label: "California Business and Professions Code § 17941",
        url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941",
      },
      {
        label: "SB 1001 chaptered bill",
        url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001",
      },
    ],
    affectedCheckerVersions: ["checker-2026-08-02.1"],
    affectedTemplates: ["The bot disclosure example was not affected."],
    affectedGeneratedDocuments: "The site had no saved or generated customer documents.",
    affectedUsers: "No account or identifiable stored-output population existed for notification.",
    reviewer: "AI-assisted official-source check; no attorney review claimed.",
    resolution:
      "Removed the unsupported enforcement linkage, added source-version metadata and regression coverage, and retained the overdue state pending substantive human review.",
    status: "corrected-review-overdue",
  },
  {
    id: "2026-08-29-eu-article-50-7-adequacy-omission",
    date: "2026-08-29",
    frameworkId: "euArt50",
    title: "EU Article 50 summary omitted the amended code-of-practice mechanism",
    priorInformation:
      "The page described Regulation (EU) 2026/1744 only through its narrow Article 50(2) transition and described the voluntary Code without the formal adequacy assessments.",
    correctedInformation:
      "Regulation (EU) 2026/1744 also replaced Article 50(7), requiring the Commission to facilitate Union-level codes and assess whether adherence is adequate. The Commission and AI Board formally assessed the voluntary Code as adequate for Article 50(2), (4), and (5), while stating that adherence is not conclusive proof of compliance.",
    reason:
      "The official amending Regulation, Commission opinion, and AI Board assessment showed that the prior summary was materially incomplete.",
    officialSources: [
      {
        label: "Regulation (EU) 2026/1744",
        url: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng",
      },
      {
        label: "European Commission adequacy opinion C(2026) 4839 final",
        url: "https://ec.europa.eu/newsroom/dae/redirection/document/130913",
      },
      {
        label: "European AI Board adequacy assessment",
        url: "https://ec.europa.eu/newsroom/dae/redirection/document/130916",
      },
    ],
    affectedCheckerVersions: ["checker-2026-08-02.1"],
    affectedTemplates: ["The illustrative deepfake disclosure sentence did not state the omitted mechanism."],
    affectedGeneratedDocuments: "The site had no saved or generated customer documents.",
    affectedUsers: "No account or identifiable stored-output population existed for notification.",
    reviewer: "AI-assisted official-source check; no attorney review claimed.",
    resolution:
      "Added Article 50(7), adequacy limits, official documents and hashes, checker/source provenance, and retained the overdue state pending substantive human review.",
    status: "corrected-review-overdue",
  },
];
