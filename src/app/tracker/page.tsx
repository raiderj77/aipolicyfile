import type { Metadata } from "next";
import Link from "next/link";
import {
  LAWS,
  LEGAL_CONTENT_MODIFIED_DATE,
  LEGAL_REVIEW_LABEL,
  NEXT_LEGAL_REVIEW_DUE,
} from "@/lib/laws";
import { LAW_PAGE_SLUGS } from "@/lib/lawPageSlugs";
import { serializeJsonLd } from "@/lib/jsonLd";
import { SourceReviewNotice } from "@/components/SourceReviewNotice";

export const metadata: Metadata = {
  title: "AI disclosure law tracker: official sources and 2026 dates",
  description:
    "A free source-linked tracker for five U.S., EU, New York, and California AI disclosure frameworks, with application dates, review boundaries, and CSV download.",
  alternates: { canonical: "/tracker" },
  openGraph: {
    type: "article",
    title: "AI disclosure law tracker: official sources and 2026 dates",
    description:
      "Track five AI disclosure frameworks with official sources, dates, limitations, and a free CSV download.",
    url: "https://aipolicyfile.com/tracker",
    modifiedTime: LEGAL_CONTENT_MODIFIED_DATE,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI disclosure law tracker: official sources and 2026 dates",
    description: "Official sources, dates, review limits, and a free CSV download.",
    images: ["/opengraph-image"],
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export default function TrackerPage() {
  const laws = Object.values(LAWS);
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "AI Policy File disclosure law tracker",
        description:
          "Five source-linked AI disclosure frameworks with jurisdiction, dates, audience, review boundary, and official source URL.",
        url: "https://aipolicyfile.com/tracker",
        dateModified: LEGAL_CONTENT_MODIFIED_DATE,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        creator: { "@id": "https://aipolicyfile.com/#organization" },
        citation: laws.flatMap((law) => law.officialSources.map((source) => source.canonicalUrl)),
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "text/csv",
          contentUrl: "https://aipolicyfile.com/downloads/ai-disclosure-law-tracker.csv",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://aipolicyfile.com" },
          { "@type": "ListItem", position: 2, name: "AI disclosure law tracker", item: "https://aipolicyfile.com/tracker" },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(datasetJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">AI disclosure law tracker</span>
      </nav>

      <div className="mt-5 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Free source tracker</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          AI disclosure law tracker: official sources and 2026 dates
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-700">
          This tracker organizes five U.S. and EU frameworks that may raise AI disclosure questions.
          It records official sources, dates, and screening boundaries; it does not decide which law
          applies or whether an activity complies.
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Last reviewed {LEGAL_REVIEW_LABEL}. Next scheduled source review no later than{" "}
          {formatDate(NEXT_LEGAL_REVIEW_DUE)}.
        </p>
        <div className="mt-6">
          <SourceReviewNotice />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/downloads/ai-disclosure-law-tracker.csv"
            download
            className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Download the CSV
          </a>
          <Link
            href="/editorial-standards"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Review method and change log
          </Link>
        </div>
      </div>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">Recent material source changes</h2>
        <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">EU Article 50 transition</h3>
        <p className="mt-2 leading-relaxed text-slate-700">
          Regulation (EU) 2026/1744 added a transition for Article 50(2): providers of systems that
          generate synthetic audio, image, video, or text content and were placed on the market before
          August 2, 2026 must take the necessary compliance steps by December 2, 2026. The transition
          is limited to Article 50(2); it is not a general delay of Article 50.
          The same amending Regulation also replaced Article 50(7), adding a formal
          Commission adequacy-assessment mechanism for Union-level codes of practice.
          The Commission and AI Board assessed the voluntary Code as adequate for
          Article 50(2), (4), and (5), but adherence is not conclusive proof of compliance.
        </p>
        <a
          href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601744"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-semibold text-indigo-700 underline underline-offset-2"
        >
          Read Regulation (EU) 2026/1744 on EUR-Lex
        </a>

        <div className="mt-6 border-t border-amber-200 pt-6">
          <h3 className="font-display text-lg font-semibold text-slate-900">
            California AB 853 amendment and staged dates
          </h3>
          <p className="mt-2 leading-relaxed text-slate-700">
            AB 853 amended the California AI Transparency Act. The chapter and covered-provider
            duties became operative August 2, 2026; the added large-online-platform and GenAI-hosting
            provisions specify January 1, 2027, and the capture-device provision specifies January 1,
            2028. An August 29 automated check found SB 1000 had passed the Legislature and was
            ordered to enrolling, but the official status still showed an active bill rather than
            chaptered law. SB 1000 is not current law. Substantive review of the August 21 text remains overdue.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=25.&division=8.&lawCode=BPC&part=&title="
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-700 underline underline-offset-2"
            >
              Read the current codified chapter
            </a>
            <a
              href="https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-700 underline underline-offset-2"
            >
              Check pending SB 1000 status
            </a>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="tracker-table-heading">
        <h2 id="tracker-table-heading" className="font-display text-2xl font-bold text-slate-900">
          Current framework table
        </h2>
        <div
          className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white"
          role="region"
          aria-label="Scrollable AI disclosure framework table"
          tabIndex={0}
        >
          <table className="w-full min-w-[72rem] text-left text-sm">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Framework</th>
                <th scope="col" className="px-4 py-3 font-semibold">Jurisdiction</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date and status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Who may need to review it</th>
                <th scope="col" className="px-4 py-3 font-semibold">Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 align-top text-slate-700">
              {laws.map((law) => (
                <tr key={law.id}>
                  <th scope="row" className="px-4 py-4 font-semibold text-slate-900">{law.shortName}</th>
                  <td className="px-4 py-4">{law.jurisdiction}</td>
                  <td className="px-4 py-4">{law.timingSummary}</td>
                  <td className="px-4 py-4">{law.whoItHits}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/laws/${LAW_PAGE_SLUGS[law.id]}`}
                        className="font-medium text-indigo-700 underline underline-offset-2"
                      >
                        Plain-English guide
                      </Link>
                      {law.officialSources.map((source) => (
                        <a
                          key={source.sourceId}
                          href={source.canonicalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-700 underline underline-offset-2"
                        >
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 max-w-3xl rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">Screen your publishing facts</h2>
        <p className="mt-2 text-slate-700">
          The free checker compares your answers with conservative screening signals across these five
          frameworks. It does not determine jurisdiction, coverage, or compliance.
        </p>
        <Link
          href="/checker"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Run the free check
        </Link>
      </section>
    </div>
  );
}
