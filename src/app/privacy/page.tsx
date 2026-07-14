import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AI Policy File handles checker answers, founding-list submissions, Telegram delivery, hosting logs, retention, and deletion requests.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 13, 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <h2 className="font-display text-xl font-semibold text-slate-900">The checker</h2>
        <p>
          Checker answers and results are calculated in your browser. The checker does not send
          those answers or results to our waitlist endpoint. Closing or refreshing the checker
          clears its in-memory state.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">The founding list</h2>
        <p>
          If you choose to join, we collect your email address, your optional role selection, your
          optional product-value selection, and whether you submitted from the home page or checker.
          The server requires affirmative consent before accepting a submission but does not add a
          separate consent field to the Telegram message. Do not include legal or other sensitive
          personal information; the form has no free-text field.
        </p>
        <p>
          The server sends those fields through the Telegram Bot API to a private Telegram chat
          controlled by the site owner. Telegram is a service provider for this delivery and stores
          the resulting message under its own systems and policies. Authorized access is limited to
          the site owner and Telegram personnel or systems as needed to provide the service.
        </p>
        <p>
          We use the submission for one launch announcement and related administration. We do not
          sell it or share it for advertising. There is no separate waitlist database, but the
          Telegram message remains available until the site owner manually deletes it. The current
          process has no automated deletion timer. The owner intends to remove the founding-list
          messages after the launch announcement or when they are no longer needed. To request deletion,
          email hello@aipolicyfile.com from the address you submitted. We will delete the accessible
          message when we can verify the request. Telegram or hosting providers may retain limited
          backup, security, or legal records, so we do not promise immediate deletion from every
          system.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">Hosting and logs</h2>
        <p>
          Vercel hosts the site and may process standard request data such as IP address, request
          time, route, browser or network information, and operational logs. Our waitlist code does
          not intentionally write submission fields, Telegram messages, or Telegram credentials to
          application logs. Hosting and security records follow Vercel&apos;s configured and contractual
          retention behavior; we do not promise zero retention.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">Analytics and advertising</h2>
        <p>
          The current application code does not load a third-party analytics or advertising script.
          If that changes, this policy must be updated before collection begins.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">Contact</h2>
        <p>
          Privacy questions or deletion requests: hello@aipolicyfile.com. We may need to verify that
          you control the submitted email address before acting on a request.
        </p>
      </div>
    </div>
  );
}
