import type { Metadata } from "next";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "AI Policy File's public security practices, current architecture boundary, vulnerability reporting, and incident priorities.";

export const metadata: Metadata = {
  title: "Security",
  description,
  alternates: { canonical: "/security" },
  ...pageSocialMetadata("Security at AI Policy File", description, "/security"),
};

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Security
      </h1>
      <div className="mt-6 space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Current architecture</h2>
          <p className="mt-3">
            The public checker runs locally in the browser and the site has no public user accounts,
            saved checker-result database, billing system, or general-purpose product or data API.
            It does expose a narrowly validated founding-list submission endpoint. This smaller data
            surface reduces risk but does not eliminate it. Founding-list processing and analytics
            are described in the Privacy Policy.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Technical safeguards</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>HTTPS with strict transport security and restrictive browser security headers.</li>
            <li>Server-side environment variables for service credentials; secrets are not placed in client code.</li>
            <li>Same-origin, size, field, and consent checks on the founding-list endpoint.</li>
            <li>Automated dependency, code-quality, and static security scanning in the release workflow.</li>
            <li>Application logging designed to exclude checker answers and founding-list content.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Report a vulnerability</h2>
          <p className="mt-3">
            Send a concise report to {" "}
            <a href="mailto:hello@aipolicyfile.com" className="text-indigo-700 underline underline-offset-2">
              hello@aipolicyfile.com
            </a>
            . Include the affected URL, impact, reproduction steps, and a safe proof of concept. Do
            not access other people&apos;s data, disrupt the service, or send secrets in the report.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Incident priorities</h2>
          <p className="mt-3">
            Security, privacy, billing, availability, and legal-content integrity incidents are
            triaged separately. A wrong legal status, date, exception, checker rule, or citation is
            treated as a production integrity issue even when the software remains available.
          </p>
        </section>
      </div>
    </div>
  );
}
