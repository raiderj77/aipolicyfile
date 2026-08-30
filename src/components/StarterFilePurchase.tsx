"use client";

import {
  buildStarterFileBeginCheckout,
  GA4_MEASUREMENT_ID,
} from "@/lib/analytics";

interface StarterFilePurchaseProps {
  checkoutUrl: string | null;
  salesEnabled: boolean;
  sourceCurrent: boolean;
  nextSourceReviewLabel: string;
}

export default function StarterFilePurchase({
  checkoutUrl,
  salesEnabled,
  sourceCurrent,
  nextSourceReviewLabel,
}: StarterFilePurchaseProps) {
  const checkoutConfigured = checkoutUrl !== null;
  const available = sourceCurrent && checkoutConfigured && salesEnabled;

  const unavailableReason = !sourceCurrent
    ? "Sales are paused because the scheduled human source review is overdue."
    : !salesEnabled
      ? "Sales have not been enabled after the launch and support checks."
      : "Checkout is missing or invalid, so this site cannot accept payment.";

  function recordConsentedCheckoutStart() {
    const analyticsWindow = window as typeof window & Record<string, unknown>;
    if (analyticsWindow[`ga-disable-${GA4_MEASUREMENT_ID}`] !== false) return;

    window.gtag?.("event", "begin_checkout", buildStarterFileBeginCheckout());
  }

  return (
    <aside
      className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm"
      aria-labelledby="starter-file-purchase-heading"
      data-checkout-state={available ? "available" : "closed"}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
            One-time purchase
          </p>
          <h2
            id="starter-file-purchase-heading"
            className="mt-1 font-display text-3xl font-bold text-slate-900"
          >
            $19
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
          No subscription
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">
        One versioned ZIP download for one purchasing business. No account,
        renewal, recurring charge, hosted workspace, or promised future update.
      </p>

      <ul className="mt-4 space-y-1 text-xs text-slate-600" aria-label="Sales gates">
        <li>{sourceCurrent ? "Passed" : "Blocked"}: scheduled source review</li>
        <li>{checkoutConfigured ? "Passed" : "Blocked"}: external HTTPS checkout</li>
        <li>{salesEnabled ? "Passed" : "Blocked"}: server-side launch authorization</li>
      </ul>

      {available ? (
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={recordConsentedCheckoutStart}
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-center font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Buy the Starter File for $19
        </a>
      ) : (
        <span
          aria-disabled="true"
          className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-slate-200 px-5 py-3 text-center font-semibold text-slate-600"
        >
          Not currently for sale
        </span>
      )}

      <div
        className={`mt-4 rounded-lg border p-3 text-sm leading-relaxed ${
          available
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : "border-amber-200 bg-amber-50 text-amber-950"
        }`}
        role="status"
      >
        {available ? (
          <>
            Checkout opens on the configured merchant-of-record website. Review
            its order total and policies before paying.
          </>
        ) : (
          <>
            <span className="font-semibold">Checkout closed.</span>{" "}
            {unavailableReason} The next scheduled source-review date is{" "}
            {nextSourceReviewLabel}.
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600">
        Refund requests may be sent within 14 calendar days of purchase. The
        product is educational information, not legal advice. A confirmed full
        refund ends hosted access and the blank-file license.
      </p>
    </aside>
  );
}
