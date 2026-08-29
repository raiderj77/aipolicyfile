"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLegalReviewStatus, LAWS } from "@/lib/laws";

export function SourceReviewNotice({
  compact = false,
  asOfMs,
}: {
  compact?: boolean;
  asOfMs?: number;
}) {
  const [currentTimeMs, setCurrentTimeMs] = useState(() => Date.now());

  useEffect(() => {
    if (asOfMs !== undefined) return;
    const refresh = () => setCurrentTimeMs(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [asOfMs]);

  const status = getLegalReviewStatus(new Date(asOfMs ?? currentTimeMs));

  if (!status.overdue) return null;

  return (
    <aside
      aria-label="Legal source review status"
      className={`rounded-xl border border-amber-300 bg-amber-50 text-slate-800 ${
        compact ? "p-4" : "p-5"
      }`}
      role="status"
    >
      <p className="text-sm font-bold uppercase tracking-wide text-amber-900">
          SOURCE REVIEW OVERDUE
      </p>
      <p className={`leading-relaxed ${compact ? "mt-1 text-sm" : "mt-2"}`}>
        This material exceeded its scheduled source-review date of {status.nextReviewDueLabel}.
        Review the linked official sources before relying on the summary. The last substantive
        review remains {status.reviewedLabel}; an automated source check ran {" "}
        {status.lastAutomatedSourceCheckLabel} and did not replace human review.
      </p>
      <p className="mt-2 text-sm">
        Overdue frameworks: {status.overdueLawIds.map((lawId) => LAWS[lawId].shortName).join(", ")}.
      </p>
      {status.automatedSourceCheckStatus === "access_limited" && (
        <p className="mt-2 text-sm">
          Automated coverage is access-limited for {status.automatedAccessLimitedLawIds
            .map((lawId) => LAWS[lawId].shortName)
            .join(", ")}; use the linked official sources directly.
        </p>
      )}
      <p className="mt-2 text-sm">
        <Link
          href="/tracker"
          className="font-semibold text-indigo-800 underline underline-offset-2 hover:text-indigo-950"
        >
          Open the source tracker
        </Link>{" "}
        or {" "}
        <Link
          href="/editorial-standards"
          className="font-semibold text-indigo-800 underline underline-offset-2 hover:text-indigo-950"
        >
          review the editorial process
        </Link>
        .
      </p>
    </aside>
  );
}
