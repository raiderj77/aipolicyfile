import { getLawReviewStatus, LAWS } from "@/lib/laws";

const CSV_HEADER = [
  "law_id",
  "law_name",
  "jurisdiction",
  "application_or_operative_date",
  "who_it_may_affect",
  "official_source",
  "official_source_ids",
  "official_source_fingerprints",
  "source_review_status",
  "status_as_of",
  "source_data_version",
  "checker_version",
  "template_version",
  "last_substantive_review",
  "next_review_due",
  "last_automated_source_check",
  "automated_source_check_status",
  "automated_source_check_note",
  "reviewer",
  "review_boundary",
];

function csvCell(value: string): string {
  const sanitized = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ");
  const inert = /^[=+\-@]/.test(sanitized) ? `'${sanitized}` : sanitized;
  return `"${inert.replace(/"/g, '""')}"`;
}

export function getLawTrackerCsv(asOf: Date = new Date()): string {
  const rows = Object.values(LAWS).map((law) => {
    const review = getLawReviewStatus(law, asOf);
    return [
      law.id,
      law.name,
      law.jurisdiction,
      law.timingSummary,
      law.whoItHits,
      law.officialSources.map((source) => source.canonicalUrl).join(" | "),
      law.officialSources.map((source) => source.sourceId).join(" | "),
      law.officialSources
        .map((source) => `${source.sourceId}:${source.contentSha256 ?? "not-recorded"}`)
        .join(" | "),
      review.overdue ? "SOURCE REVIEW OVERDUE" : "CURRENT WITHIN REVIEW WINDOW",
      asOf.toISOString(),
      review.sourceDataVersion,
      review.checkerVersion,
      law.review.templateVersion ?? "not-used",
      review.reviewedDate,
      review.nextReviewDue,
      review.lastAutomatedSourceCheckDate,
      review.automatedSourceCheckStatus,
      review.automatedSourceCheckNote,
      review.reviewer,
      "Educational screening only; verify the current official text and obtain legal advice for a specific situation.",
    ]
      .map(csvCell)
      .join(",");
  });

  return `${CSV_HEADER.join(",")}\r\n${rows.join("\r\n")}\r\n`;
}
