import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for AI Policy File.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 12, 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          By using aipolicyfile.com you agree to these terms. If you do not
          agree, do not use the site.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Educational use only
        </h2>
        <p>
          The site, including the checker and all sample disclosure wording,
          provides educational information about AI disclosure laws. It is not
          legal advice, and no attorney-client relationship is created by using
          it. You are responsible for verifying anything you rely on against the
          official sources we link and, where appropriate, with a licensed
          attorney.
        </p>
        <p>
          The checker flags possible relevance only. It does not determine
          jurisdiction, coverage, compliance, legal duties, defenses, or likely
          enforcement outcomes.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Acceptable use
        </h2>
        <p>
          You may not scrape the site at abusive volume, attempt to disrupt it,
          or misrepresent its output as advice from a lawyer.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          No warranty and limitation of liability
        </h2>
        <p>
          The site is provided as-is, without warranties of any kind. To the
          maximum extent permitted by law, we are not liable for any damages
          arising from your use of, or reliance on, the site.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Changes
        </h2>
        <p>
          We may update these terms and the site at any time. Continued use
          after changes means you accept the updated terms.
        </p>
      </div>
    </div>
  );
}
