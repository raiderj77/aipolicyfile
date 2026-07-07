import type { Metadata } from "next";
import CheckerClient from "./CheckerClient";

export const metadata: Metadata = {
  title: "Free AI disclosure law checker",
  description:
    "Answer 8 yes-or-no questions and find out which AI disclosure laws apply to you: FTC guidance, EU AI Act Article 50, New York S.8420-A, California B.O.T. Act, and California SB 942.",
  alternates: { canonical: "/checker" },
};

export default function CheckerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        AI disclosure law checker
      </h1>
      <p className="mt-2 text-slate-600">
        Eight quick questions. Free, anonymous, and nothing you answer is stored
        or sent anywhere.
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Educational information, not legal advice.
      </p>
      <div className="mt-8">
        <CheckerClient />
      </div>
    </div>
  );
}
