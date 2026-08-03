import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_REVIEW_LABEL, NEXT_LEGAL_REVIEW_DUE } from "@/lib/laws";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "How AI Policy File selects official sources, reviews legal information, records corrections, and states its author and limitations.";

export const metadata: Metadata = {
  title: "Editorial standards and legal-source review",
  description,
  alternates: { canonical: "/editorial-standards" },
  ...pageSocialMetadata(
    "Editorial standards and legal-source review",
    description,
    "/editorial-standards",
  ),
};

function formatDueDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function EditorialStandardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Editorial standards and legal-source review
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Last substantive legal-source review: {LEGAL_REVIEW_LABEL}. Next scheduled review no later
        than {" "}{formatDueDate(NEXT_LEGAL_REVIEW_DUE)}.
      </p>

      <div className="mt-8 space-y-10 leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Who writes and reviews this site</h2>
          <p className="mt-3">
            AI Policy File is created and maintained by{" "}
            <Link href="/about" className="text-indigo-700 underline underline-offset-2">
              Jason Ramirez
            </Link>
            , the site owner and maintainer. He is not an attorney and does not claim legal
            credentials. Unless a page expressly names a qualified professional reviewer, the page
            has not been reviewed by a lawyer. That limitation is shown because legal credentials
            should never be implied.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Source hierarchy</h2>
          <p className="mt-3">
            Legal claims start with enacted statutes, regulations, official codes, and official
            agency guidance. Government summaries may clarify timing or administration, but they do
            not replace the controlling text. Each guide links the primary sources used. Secondary
            commentary is not treated as authority for a legal conclusion.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Review method</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6">
            <li>Confirm the current text, status, application or operative date, and amendments.</li>
            <li>Separate provider, deployer, advertiser, publisher, and platform roles.</li>
            <li>State important thresholds, knowledge standards, exceptions, and enforcement limits.</li>
            <li>Test checker paths for conservative screening rather than definitive legal outcomes.</li>
            <li>Record the review date and schedule the next source check.</li>
          </ol>
          <p className="mt-3">
            The checker cannot determine jurisdiction, legal status, compliance, defenses, or an
            enforcement outcome. It highlights facts and official sources that may warrant review.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Corrections</h2>
          <p className="mt-3">
            Report a factual error, stale source, or broken link to{" "}
            <a href="mailto:hello@aipolicyfile.com" className="text-indigo-700 underline underline-offset-2">
              hello@aipolicyfile.com
            </a>
            . Include the page, statement, and official source URL. Do not send confidential facts
            or ask for advice about a specific legal matter. Material corrections are noted below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Material review log</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">Material source reviews and corrections</caption>
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 align-top">August 2, 2026</td>
                  <td className="px-4 py-3">
                    Rechecked all five frameworks against official sources; added the EU Article
                    50(2) transition enacted by Regulation (EU) 2026/1744; corrected the California
                    AI Transparency Act operative date against the current code; incorporated AB 853&apos;s
                    staged platform, hosting, and capture-device provisions; flagged pending SB 1000 as
                    proposed rather than current law; and expanded checker-path regression tests.
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap px-4 py-3 align-top">July 24, 2026</td>
                  <td className="px-4 py-3">
                    Centralized legal review dates and rechecked the five published framework guides.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
