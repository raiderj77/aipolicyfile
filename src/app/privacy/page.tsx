import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AI Policy File stores nothing. Checker answers never leave your browser; waitlist emails are forwarded once and not retained.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 7, 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-xl font-semibold text-slate-900">
          The checker
        </h2>
        <p>
          Your answers to the checker questions are processed entirely in your
          browser. They are never sent to our servers, never stored, and never
          shared. Closing the page erases them.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          The waitlist
        </h2>
        <p>
          If you join the founding list, we collect your email address and the two
          optional answers you choose (your role and what the product would be
          worth to you). This is forwarded once to the site owner as a private
          notification so we can email you at launch. We do not run a mailing
          list database, do not sell or share your email, and do not use it for
          anything except the launch announcement. To be removed before launch,
          use the contact page and we will discard your notification.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Analytics and advertising
        </h2>
        <p>
          We may use privacy-respecting, aggregate analytics to understand page
          traffic. If advertising is enabled on this site, ad partners such as
          Google may use cookies subject to their own policies; any such use will
          be disclosed here.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Contact
        </h2>
        <p>
          Questions about this policy: see the contact page for how to reach us.
        </p>
      </div>
    </div>
  );
}
