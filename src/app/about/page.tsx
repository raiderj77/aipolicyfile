import type { Metadata } from "next";
import Link from "next/link";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "Why AI Policy File provides source-linked educational screening for five AI disclosure frameworks.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  ...pageSocialMetadata("About AI Policy File", description, "/about"),
};

export default function AboutPage() {
  return (
    <div id="jason-ramirez" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        About AI Policy File
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          AI-related advertising and transparency rules can raise questions for
          creators and small businesses: FTC endorsement guidance, EU AI
          Act Article 50, New York&apos;s synthetic performer disclosure law, the
          California B.O.T. Act, and California&apos;s AI Transparency Act (SB 942
          as amended by AB 853). They were written for different audiences, use
          different definitions, and take effect on different dates. Determining
          which one governs a particular activity requires more facts than a short
          online checker can collect.
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
          The planned full product would add platform-ready disclosure text for
          multiple publishing channels, a site-wide AI disclosure policy page,
          and alerts when any of these laws change.
        </p>
        <h2 className="pt-4 font-display text-2xl font-bold text-slate-900">
          Author and review boundary
        </h2>
        <p>
          AI Policy File is created and maintained by Jason Ramirez, the site
          owner and maintainer. He is not an attorney and does not claim legal
          credentials. Pages are checked against their linked official sources;
          they are not represented as lawyer-reviewed unless a page expressly
          identifies a qualified reviewer.
        </p>
        <p>
          Read the{" "}
          <Link
            href="/editorial-standards"
            className="text-indigo-700 underline underline-offset-2"
          >
            editorial standards, source-review method, and material review log
          </Link>
          . Factual corrections can be reported through the{" "}
          <Link href="/contact" className="text-indigo-700 underline underline-offset-2">
            contact page
          </Link>
          .
        </p>
        <p className="text-sm text-slate-600">
          AI Policy File is educational information, not legal advice. We are not
          a law firm. For advice about your specific situation, consult a licensed
          attorney.
        </p>
      </div>
    </div>
  );
}
