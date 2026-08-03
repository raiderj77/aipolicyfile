import { LAWS, LEGAL_REVIEW_DATE } from "@/lib/laws";

const CSV_HEADER = [
  "law_name",
  "jurisdiction",
  "application_or_operative_date",
  "who_it_may_affect",
  "official_source",
  "last_reviewed",
  "review_boundary",
];

function csvCell(value: string): string {
  const sanitized = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ");
  const inert = /^[=+\-@]/.test(sanitized) ? `'${sanitized}` : sanitized;
  return `"${inert.replace(/"/g, '""')}"`;
}

export function getLawTrackerCsv(): string {
  const rows = Object.values(LAWS).map((law) =>
    [
      law.name,
      law.jurisdiction,
      law.effective,
      law.whoItHits,
      law.officialUrl,
      LEGAL_REVIEW_DATE,
      "Educational screening only; verify the current official text and obtain legal advice for a specific situation.",
    ]
      .map(csvCell)
      .join(","),
  );

  return `${CSV_HEADER.join(",")}\r\n${rows.join("\r\n")}\r\n`;
}
