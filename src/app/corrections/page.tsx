import type { Metadata } from "next";
import Link from "next/link";
import { SourceReviewNotice } from "@/components/SourceReviewNotice";
import { CORRECTIONS } from "@/lib/corrections";
import { pageSocialMetadata } from "@/lib/siteMetadata";
import { formatLegalDate, LAWS } from "@/lib/laws";

const description =
  "AI Policy File's public record of material legal-source corrections, affected content, official sources, and resolution status.";

export const metadata: Metadata = {
  title: "Corrections and legal-content change log",
  description,
  alternates: { canonical: "/corrections" },
  ...pageSocialMetadata("Corrections and legal-content change log", description, "/corrections"),
};

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Corrections and legal-content change log
      </h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-slate-700">
        Material source, status, date, applicability, or citation errors are recorded here rather
        than silently overwritten. This log identifies what changed, why it changed, the official
        source, affected public material, and remaining review work.
      </p>
      <div className="mt-6">
        <SourceReviewNotice />
      </div>

      <div className="mt-10 space-y-8">
        {CORRECTIONS.map((correction) => (
          <article key={correction.id} id={correction.id} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              {formatLegalDate(correction.date)} · {correction.status === "corrected-review-overdue"
                ? "Corrected; substantive review remains overdue"
                : "Corrected and substantively reviewed"}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">{correction.title}</h2>
            <dl className="mt-6 space-y-5 text-sm leading-relaxed text-slate-700">
              <div><dt className="font-semibold text-slate-900">Affected framework</dt><dd className="mt-1">{LAWS[correction.frameworkId].name}</dd></div>
              <div><dt className="font-semibold text-slate-900">Prior information</dt><dd className="mt-1">{correction.priorInformation}</dd></div>
              <div><dt className="font-semibold text-slate-900">Corrected information</dt><dd className="mt-1">{correction.correctedInformation}</dd></div>
              <div><dt className="font-semibold text-slate-900">Reason</dt><dd className="mt-1">{correction.reason}</dd></div>
              <div>
                <dt className="font-semibold text-slate-900">Official sources</dt>
                <dd className="mt-1"><ul className="list-disc space-y-1 pl-5">{correction.officialSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-700 underline underline-offset-2">{source.label}</a></li>)}</ul></dd>
              </div>
              <div><dt className="font-semibold text-slate-900">Affected checker versions</dt><dd className="mt-1">{correction.affectedCheckerVersions.join(", ")}</dd></div>
              <div><dt className="font-semibold text-slate-900">Affected templates</dt><dd className="mt-1">{correction.affectedTemplates.join(" ")}</dd></div>
              <div><dt className="font-semibold text-slate-900">Generated documents and users</dt><dd className="mt-1">{correction.affectedGeneratedDocuments} {correction.affectedUsers}</dd></div>
              <div><dt className="font-semibold text-slate-900">Reviewer</dt><dd className="mt-1">{correction.reviewer}</dd></div>
              <div><dt className="font-semibold text-slate-900">Resolution</dt><dd className="mt-1">{correction.resolution}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">Report a correction</h2>
        <p className="mt-3 leading-relaxed text-slate-700">
          Email {" "}
          <a href="mailto:hello@aipolicyfile.com" className="text-indigo-700 underline underline-offset-2">
            hello@aipolicyfile.com
          </a>{" "}
          with the page, disputed statement, and an official source URL. Do not include confidential
          facts or ask for advice about a specific legal matter. Read the {" "}
          <Link href="/editorial-standards" className="text-indigo-700 underline underline-offset-2">
            editorial standards
          </Link>{" "}
          for the review process.
        </p>
      </section>
    </div>
  );
}
