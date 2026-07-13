import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ANSWER_PAGES } from "@/lib/answerPages";

export function generateStaticParams() {
  return ANSWER_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = ANSWER_PAGES.find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/answers/${page.slug}` },
  };
}

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = ANSWER_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">Answers</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {page.title}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Educational information, not legal advice. Facts checked against the
        official law texts, last reviewed July 12, 2026. This page does not
        determine jurisdiction, coverage, or compliance.
      </p>

      <p className="mt-6 text-lg leading-relaxed text-slate-700">{page.intro}</p>

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

      <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Which rules may be worth reviewing?
        </h2>
        <p className="mt-2 text-slate-700">
          The free checker flags possible relevance across five legal
          frameworks. It cannot decide which law applies to your situation.
        </p>
        <Link
          href="/checker"
          className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Run the free check
        </Link>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        This page is educational information, not legal advice. Laws change and
        your situation may differ. See the{" "}
        <Link href="/#laws" className="underline">
          law guides
        </Link>{" "}
        for official sources, and consult a licensed attorney for advice about
        your specific situation.
      </p>
    </div>
  );
}
