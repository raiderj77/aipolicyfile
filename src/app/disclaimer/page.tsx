import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "AI Policy File provides educational information, not legal advice.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Disclaimer
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          AI Policy File is an educational tool. Nothing on this site, including
          the checker results and sample disclosure wording, is legal advice, and
          using this site does not create an attorney-client relationship. We are
          not a law firm and do not practice law.
        </p>
        <p>
          The checker flags facts that may make a published legal framework worth
          reviewing. It does not determine jurisdiction, coverage, compliance,
          legal duties, or available defenses. It cannot account for the full
          facts of your situation, and laws change. The information here reflects
          our reading of the official sources linked on each result as last
          reviewed July 12, 2026.
        </p>
        <p>
          Always verify against the official law texts we link, and consult a
          licensed attorney in your jurisdiction before making decisions that
          depend on how these laws apply to you.
        </p>
        <p>
          We make no warranties about the accuracy or completeness of the
          information on this site and accept no liability for actions taken in
          reliance on it.
        </p>
      </div>
    </div>
  );
}
