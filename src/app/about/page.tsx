import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why AI Policy File exists: AI disclosure rules arrived faster than the tools to comply with them.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        About AI Policy File
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          AI-related advertising and transparency rules can raise questions for
          creators and small businesses: FTC endorsement guidance, EU AI
          Act Article 50, New York&apos;s synthetic performer disclosure law, the
          California B.O.T. Act, and California SB 942. They were written for
          different audiences, use different definitions, and take effect on
          different dates. Determining which one governs a particular activity
          requires more facts than a short online checker can collect.
        </p>
        <p>
          AI Policy File exists to close that gap. The{" "}
          <Link href="/checker" className="text-indigo-700 underline underline-offset-2">
            free checker
          </Link>{" "}
          asks eight yes-or-no questions and flags frameworks that may deserve
          review, with plain-English limitations, sample wording, and a link to
          every official text. It does not decide what law applies.
        </p>
        <p>
          We are building the full product next: platform-ready disclosure text
          for every channel you publish on, a site-wide AI disclosure policy page,
          and alerts when any of these laws change.
        </p>
        <p className="text-sm text-slate-500">
          AI Policy File is educational information, not legal advice. We are not
          a law firm. For advice about your specific situation, consult a licensed
          attorney.
        </p>
      </div>
    </div>
  );
}
