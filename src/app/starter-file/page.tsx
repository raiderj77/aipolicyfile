import type { Metadata } from "next";
import Link from "next/link";
import StarterFilePurchase from "@/components/StarterFilePurchase";
import { getLegalReviewStatus } from "@/lib/laws";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "A $19 one-time, browser-local AI disclosure planning file for businesses, with a business-use license and no subscription.";
const socialMetadata = pageSocialMetadata(
  "AI Disclosure Starter File",
  description,
  "/starter-file",
);

export const metadata: Metadata = {
  title: "AI Disclosure Starter File",
  description,
  alternates: { canonical: "/starter-file" },
  ...socialMetadata,
  openGraph: {
    ...socialMetadata.openGraph,
    images: ["/starter-file/opengraph-image"],
  },
  twitter: {
    ...socialMetadata.twitter,
    images: ["/starter-file/opengraph-image"],
  },
};

// This page controls whether money can be accepted. Evaluate the source-review
// deadline and server-side launch switch on every request so a stale cached page
// cannot keep checkout open after a review deadline passes or the kill switch is
// removed.
export const dynamic = "force-dynamic";

function externalCheckoutUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    const supportedMerchantHost = ["gumroad.com", "paddle.com", "paddle.net"].some(
      (merchantHost) =>
        hostname === merchantHost || hostname.endsWith(`.${merchantHost}`),
    );

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !supportedMerchantHost
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

const deliverables = [
  {
    file: "ai-disclosure-starter-file.html",
    title: "Self-contained planning worksheet",
    detail:
      "An offline-capable HTML worksheet for business and channel inventory, AI-use inventory, framework-review prompts, disclosure-placement planning, copyable starter wording, and a printable summary.",
  },
  {
    file: "README.txt",
    title: "Instructions and version record",
    detail:
      "Plain-text setup notes, the included source-review date and version, the limits of the file, and the support and refund process.",
  },
  {
    file: "BUSINESS-LICENSE.txt",
    title: "Business-use license",
    detail:
      "The license for one purchasing business, including the permitted internal use and the restrictions on resale, redistribution, sublicensing, and client reuse.",
  },
] as const;

export default function StarterFilePage() {
  const review = getLegalReviewStatus();
  const sourceCurrent = !review.overdue;
  const checkoutUrl = externalCheckoutUrl(
    process.env.NEXT_PUBLIC_STARTER_FILE_CHECKOUT_URL,
  );
  const salesEnabled = process.env.STARTER_FILE_SALES_ENABLED === "true";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
            AI Disclosure Starter File
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Turn a scattered AI-use list into one practical disclosure plan.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            A self-contained, browser-local worksheet for a business that wants
            to inventory where it uses AI, identify the disclosure frameworks
            worth reviewing, plan where notices belong, and leave with a
            printable working summary.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-800">
              $19 once
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-800">
              No subscription
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-800">
              No account
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1.5 text-slate-800">
              Works offline
            </span>
          </div>
        </div>

        <StarterFilePurchase
          checkoutUrl={checkoutUrl}
          salesEnabled={salesEnabled}
          sourceCurrent={sourceCurrent}
          nextSourceReviewLabel={review.nextReviewDueLabel}
        />
      </section>

      <section className="mt-16" aria-labelledby="included-heading">
        <h2
          id="included-heading"
          className="font-display text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Core files in the versioned ZIP
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
          The package centers on these three files. Before sales open, the
          checkout listing and README must show the complete archive manifest,
          including any source ledger or sample output, and must match the
          downloadable ZIP. It does not include a legal review, cloud dashboard,
          hosted account, monitoring service, or automatic updates.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {deliverables.map((item) => (
            <article
              key={item.file}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="break-all font-mono text-xs font-semibold text-indigo-700">
                {item.file}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Your entries stay with you
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            The HTML file opens in a browser and works without an account or
            internet connection. Completing it does not upload your entries to
            AI Policy File, use analytics, or call an AI service. It does not
            save entries automatically; closing or refreshing clears the working
            session unless you make a printout or save a copy yourself. External
            source links connect only if you choose to open them.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Source-currentness is a sales gate
          </h2>
          <p className="mt-3 leading-relaxed text-slate-700">
            Sales automatically pause whenever a scheduled substantive human
            review of the included legal sources is overdue. The current source
            data version is <span className="font-semibold">{review.sourceDataVersion}</span>;
            the oldest included substantive review was {review.reviewedLabel},
            with the next scheduled review due {review.nextReviewDueLabel}.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            A purchased file is a static snapshot. It does not update itself when
            a law, official interpretation, or business fact changes.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            A separate server-side launch switch also stays off until checkout,
            delivery, refund support, and the public support mailbox have passed
            their launch checks.
          </p>
        </article>
      </section>

      <section className="mt-16 rounded-2xl border border-indigo-200 bg-indigo-50 p-7 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Plain terms before you buy
        </h2>
        <div className="mt-5 grid gap-6 text-sm leading-relaxed text-slate-700 md:grid-cols-3">
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              14-day refund window
            </h3>
            <p className="mt-2">
              Once support is verified and sales open, email
              hello@aipolicyfile.com within 14 calendar days of purchase with the
              order ID and purchase email. We will validate the order and initiate
              a full refund through the merchant of record. A confirmed full refund
              ends hosted download access and the blank-file license.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              One-business license
            </h3>
            <p className="mt-2">
              One purchasing business may customize and use the file and its
              completed outputs for its own operations and channels. The blank
              file may not be resold, shared, sublicensed, or reused for clients.
              After a confirmed full refund, stop using or distributing the blank
              files and delete or destroy your copies; previously published lawful
              outputs do not have to be withdrawn, but no new blank-file use is
              permitted.
            </p>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-slate-900">
              Educational, not legal advice
            </h3>
            <p className="mt-2">
              The file organizes a review; it does not determine jurisdiction,
              coverage, compliance, or the wording a lawyer would recommend for
              your facts.
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-700">
          Read the complete{" "}
          <Link href="/terms" className="font-semibold text-indigo-800 underline underline-offset-2">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-indigo-800 underline underline-offset-2">
            Privacy Policy
          </Link>
          . You can also inspect the free{" "}
          <Link href="/tracker" className="font-semibold text-indigo-800 underline underline-offset-2">
            official-source tracker
          </Link>{" "}
          before deciding.
        </p>
      </section>
    </div>
  );
}
