"use client";

import { useState } from "react";

export default function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [worth, setWorth] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, worth, source }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
        You are on the founding list. We will email you at launch, and never for
        anything else.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">I am a...</option>
          <option value="creator">Creator / influencer</option>
          <option value="smallbiz">Small business owner</option>
          <option value="freelancer">Freelancer / agency</option>
          <option value="other">Other</option>
        </select>
        <select
          value={worth}
          onChange={(e) => setWorth(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Worth to me...</option>
          <option value="free">Just the free checker</option>
          <option value="5-10">$5 to $10 per month</option>
          <option value="20-40">$20 to $40 per month</option>
          <option value="40plus">Over $40 per month</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {state === "sending" ? "Joining..." : "Join the founding list"}
        </button>
        {state === "error" && (
          <span className="text-sm text-red-600">
            Something went wrong. Please try again.
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500">
        One launch email. No newsletter, no sharing, no storage beyond delivering
        that email.
      </p>
    </form>
  );
}
