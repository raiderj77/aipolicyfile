import type { Metadata } from "next";
import Link from "next/link";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "Which AI Policy File features are deterministic, whether the public site uses generative AI, and what AI is prohibited from deciding.";

export const metadata: Metadata = {
  title: "AI transparency",
  description,
  alternates: { canonical: "/ai-transparency" },
  ...pageSocialMetadata("AI transparency at AI Policy File", description, "/ai-transparency"),
};

export default function AiTransparencyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        AI transparency
      </h1>
      <div className="mt-6 space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">What the public site does today</h2>
          <p className="mt-3">
            The eight-question checker is deterministic. Fixed, versioned rules run in your browser;
            checker answers are not sent to an AI provider or to the site&apos;s waitlist endpoint. The
            public product does not currently generate disclosure language with an AI model.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">AI-assisted maintenance</h2>
          <p className="mt-3">
            AI tools may assist the maintainer with source comparison, drafting, software changes,
            testing, or plain-language editing. Their output is not treated as legal authority. Legal
            claims must be checked against linked official sources, material corrections are recorded,
            and automated source checks do not replace substantive human review.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">What AI cannot decide</h2>
          <p className="mt-3">
            AI Policy File does not authorize a model to decide whether a law applies to a person,
            whether someone is compliant, whether wording is legally sufficient, or whether an
            exception, defense, or penalty applies. It also does not authorize a model to publish
            legal-source changes, alter review dates, contact users, change billing, or access another
            user&apos;s data without deterministic controls and appropriate human authorization.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Future AI features</h2>
          <p className="mt-3">
            Any future drafting feature must be clearly labeled AI-assisted, grounded only in approved
            source records, versioned, tested for prompt injection and false citations, and designed to
            expose assumptions and unresolved facts. Read the {" "}
            <Link href="/editorial-standards" className="text-indigo-700 underline underline-offset-2">
              editorial standards
            </Link>{" "}
            and {" "}
            <Link href="/privacy" className="text-indigo-700 underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
