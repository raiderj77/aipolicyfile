import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LAW_PAGES } from "@/lib/lawPages";
import { LAWS } from "@/lib/laws";

export function generateStaticParams() {
  return LAW_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = LAW_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/laws/${page.slug}` },
  };
}

export default async function LawPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = LAW_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  const law = LAWS[page.lawId];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://aipolicyfile.com" },
      { "@type": "ListItem", position: 2, name: "The laws", item: "https://aipolicyfile.com/#laws" },
      {
        "@type": "ListItem",
        position: 3,
        name: law.shortName,
        item: `https://aipolicyfile.com/laws/${page.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/#laws" className="hover:text-slate-900">The laws</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{law.shortName}</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {page.title}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Educational information, not legal advice. Facts checked against the
        official text linked below, last reviewed July 13, 2026. This page does
        not determine whether the rule applies to you.
      </p>

      <p className="mt-6 text-lg leading-relaxed text-slate-700">{page.intro}</p>

      {/* Key facts box */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-600">
          Key facts
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="inline font-semibold text-slate-700">Jurisdiction: </dt>
            <dd className="inline text-slate-600">{law.jurisdiction}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-700">Effective: </dt>
            <dd className="inline text-slate-600">{law.effective}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-700">Enforcement note: </dt>
            <dd className="inline text-slate-600">{law.penalty}</dd>
          </div>
          <div>
            <dt className="inline font-semibold text-slate-700">Official text: </dt>
            <dd className="inline">
              <a
                href={law.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
              >
                {law.officialLabel}
              </a>
            </dd>
          </div>
        </dl>
      </div>

      {/* Body sections */}
      {page.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {section.heading}
          </h2>
          {section.paragraphs.map((para, i) => (
            <p key={i} className="mt-4 leading-relaxed text-slate-700">
              {para}
            </p>
          ))}
        </section>
      ))}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-6">
          {page.faq.map((item) => (
            <div key={item.q}>
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {item.q}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-700">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sources */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-slate-900">Sources</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          {page.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Checker CTA */}
      <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Could this rule be relevant to you?
        </h2>
        <p className="mt-2 text-slate-700">
          The free checker flags facts that may warrant review across five legal
          frameworks. It does not decide jurisdiction, coverage, or compliance.
        </p>
        <Link
          href="/checker"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Run the free check
        </Link>
      </div>

      <p className="mt-8 text-sm text-slate-600">
        This page is educational information, not legal advice. Laws change and
        your situation may differ. Verify against the official text linked above
        and consult a licensed attorney for advice about your specific
        situation.
      </p>
    </div>
  );
}
