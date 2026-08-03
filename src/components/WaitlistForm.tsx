"use client";

import Link from "next/link";
import { useState } from "react";

export default function WaitlistForm({ source }: { source: "home" | "checker" }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [worth, setWorth] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ email, role, worth, source, website, consent }),
      });
      setState(response.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
        You are on the founding list for one launch email. You can request removal at any time.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`waitlist-website-${source}`}>Website</label>
        <input
          id={`waitlist-website-${source}`}
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor={`waitlist-email-${source}`}>
            Email address
          </label>
          <input
            id={`waitlist-email-${source}`}
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor={`waitlist-role-${source}`}>
            Your role <span className="font-normal">(optional)</span>
          </label>
          <select
            id={`waitlist-role-${source}`}
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select a role</option>
            <option value="creator">Creator / influencer</option>
            <option value="smallbiz">Small business owner</option>
            <option value="freelancer">Freelancer / agency</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor={`waitlist-worth-${source}`}>
            Product value <span className="font-normal">(optional)</span>
          </label>
          <select
            id={`waitlist-worth-${source}`}
            value={worth}
            onChange={(event) => setWorth(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">Select an estimate</option>
            <option value="free">Just the free checker</option>
            <option value="5-10">$5 to $10 per month</option>
            <option value="20-40">$20 to $40 per month</option>
            <option value="40plus">Over $40 per month</option>
          </select>
        </div>
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>
          I agree to provide my email and optional selections for one launch email. The submission
          is delivered through Telegram as described in the{" "}
          <Link href="/privacy" className="underline">Privacy Policy</Link>.
        </span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === "sending" || !email || !consent}
          className="min-h-11 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-60"
        >
          {state === "sending" ? "Joining..." : "Join the founding list"}
        </button>
        {state === "error" && (
          <span className="text-sm text-red-600" role="alert">
            We could not send your request. Please try again later.
          </span>
        )}
      </div>
      <p className="text-xs text-slate-600">
        One launch email. No newsletter. We do not sell the submission or use it for advertising.
      </p>
    </form>
  );
}
