import type { Metadata } from "next";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "AI Policy File's accessibility target, current design practices, known review boundary, and feedback contact.";

export const metadata: Metadata = {
  title: "Accessibility",
  description,
  alternates: { canonical: "/accessibility" },
  ...pageSocialMetadata("Accessibility at AI Policy File", description, "/accessibility"),
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Accessibility
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">
        AI Policy File uses WCAG 2.2 Level AA as its internal design and testing target. This is a
        target, not a certification or a claim that every page is free from accessibility defects.
      </p>
      <div className="mt-8 space-y-8 leading-relaxed text-slate-700">
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Current practices</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Semantic headings, landmarks, labels, and descriptive links.</li>
            <li>Keyboard-operable checker controls with visible focus and managed result focus.</li>
            <li>Text labels in addition to color for checker and source-review status.</li>
            <li>Responsive layouts, readable text, and core controls near a 44-pixel touch target.</li>
            <li>A skip link and polite status announcements for changing checker content.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Known review boundary</h2>
          <p className="mt-3">
            Automated checks cannot establish full conformance. The site still needs recurring manual
            keyboard, screen-reader, zoom, reflow, contrast, reduced-motion, and mobile testing as
            features change. Any confirmed barrier is treated as a product defect.
          </p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900">Report a problem</h2>
          <p className="mt-3">
            Email {" "}
            <a href="mailto:hello@aipolicyfile.com" className="text-indigo-700 underline underline-offset-2">
              hello@aipolicyfile.com
            </a>{" "}
            with the page, the task you were trying to complete, and your browser or assistive
            technology if you are comfortable sharing it. Do not send confidential legal information.
          </p>
        </section>
      </div>
    </div>
  );
}
