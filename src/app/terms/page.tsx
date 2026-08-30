import type { Metadata } from "next";
import { pageSocialMetadata } from "@/lib/siteMetadata";

const description =
  "Terms for the AI Policy File educational website, checker, and planned one-time AI Disclosure Starter File.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description,
  alternates: { canonical: "/terms" },
  ...pageSocialMetadata("Terms of Use", description, "/terms"),
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-slate-600">Last updated: August 30, 2026</p>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          By using aipolicyfile.com you agree to these terms. If you do not
          agree, do not use the site.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Educational use only
        </h2>
        <p>
          The site, including the checker and all sample disclosure wording,
          provides educational information about AI disclosure laws. It is not
          legal advice, and no attorney-client relationship is created by using
          it. You are responsible for verifying anything you rely on against the
          official sources we link and, where appropriate, with a licensed
          attorney.
        </p>
        <p>
          The checker flags possible relevance only. It does not determine
          jurisdiction, coverage, compliance, legal duties, defenses, or likely
          enforcement outcomes.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Starter File launch status
        </h2>
        <p>
          The AI Disclosure Starter File is a planned one-time digital product and
          is not currently open for sale. A scheduled source review is overdue.
          Inbound delivery and reply receipt through hello@aipolicyfile.com were
          externally round-trip tested on August 29, 2026. A separate outbound
          message passed SPF, DKIM, and DMARC. Checkout must remain closed until
          the source review is current, the product and refund process are
          verified, a valid external checkout is configured, and sales are
          explicitly enabled on the server.
        </p>
        <p>
          Gumroad and Paddle are merchant-of-record candidates. Neither provider
          has been selected or configured for this product, and no provider
          account, checkout, payout, refund, tax, delivery, or privacy setting has
          been verified. Before sales open, this page and the Privacy Policy will
          identify the selected provider. Its checkout will show the final order
          total and its own applicable terms and privacy notice.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Product scope and price
        </h2>
        <p>
          If sales open, $19 buys one versioned ZIP whose core files include
          <code>ai-disclosure-starter-file.html</code>, a self-contained
          browser-local planning worksheet; <code>README.txt</code>, with
          instructions, source-version information, limits, support, and refund
          details; and <code>BUSINESS-LICENSE.txt</code>, with the license terms.
          Before sales open, the checkout listing and README must state the
          complete archive manifest, including any source ledger or sample output,
          and that manifest must match the delivered ZIP. The purchase does not
          include a legal review, cloud dashboard, hosted account, monitoring
          service, or automatic update.
        </p>
        <p>
          This is a single $19 charge, not a subscription. There is no recurring
          fee, automatic renewal, minimum term, or cancellation step. Future
          versions or services are not included unless a later offer expressly
          says so.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Browser-local operation
        </h2>
        <p>
          The HTML worksheet is intended to run locally in a browser without an
          account or internet connection. Completing it does not upload worksheet
          entries to AI Policy File or call an AI service. Entries are not saved
          automatically; closing or refreshing clears the working session unless
          you print or save a copy. External source links connect to their sites
          only if you choose to open them. You control and are responsible for
          copies saved or printed on your systems.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          14-day refund process
        </h2>
        <p>
          After sales have opened, you may request a full refund for any reason by emailing
          hello@aipolicyfile.com within 14 calendar days after purchase. Include
          the order ID and the email address used at checkout; do not send card or
          bank details. We will validate the order and initiate the refund through
          the selected merchant of record to the original payment method. The
          provider and your financial institution control when the credit posts.
          This policy does not limit any non-waivable refund, cancellation, or
          consumer right that applies to you.
        </p>
        <p>
          If the purchase is fully refunded, hosted download access and the
          business-use license for the blank product files end when the merchant
          confirms the refund. The purchasing business must stop using or
          distributing the blank product files and delete or destroy every copy
          under its control. Files already downloaded cannot be remotely erased.
          A full refund does not require the business to retract or destroy lawful
          disclosure text or other completed outputs that it created and published
          before the refund, but it may not make any new use of the blank product
          files after the refund. Mandatory consumer rights remain unaffected.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Business-use license
        </h2>
        <p>
          A completed purchase grants one purchasing business a limited,
          non-exclusive, non-transferable license to copy and customize the files
          for its own internal operations and channels. Its employees and
          contractors may use the files only while acting for that business. The
          business may publish or share its own completed disclosure outputs.
        </p>
        <p>
          You may not resell, redistribute, publish, sublicense, or provide the
          blank files or substantially equivalent templates to another business;
          use them as a hosted service; or present them as legal advice,
          certification, or a compliance guarantee. An agency or consultant needs
          a separate license for each client business whose operations are entered
          into the file. Source-version and limitation notices must remain in the
          files. The license also ends when a full refund is confirmed or after a
          material breach that is not cured after notice. Ending the license does
          not require retraction or destruction of lawful completed outputs created
          and published before termination, but it permits no new use of the blank
          product files.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Source currency and no continuing service
        </h2>
        <p>
          The purchase control is designed to fail closed when the scheduled
          substantive human review of included sources is overdue. Each ZIP must
          identify its source version and review date. The file is a static
          snapshot and does not update itself when laws, official interpretations,
          enforcement positions, or your facts change. A passed source gate is
          not a promise that every source is error-free or that the product applies
          to your situation.
        </p>

        <h2 className="font-display text-xl font-semibold text-slate-900">
          Acceptable use
        </h2>
        <p>
          You may not scrape the site at abusive volume, attempt to disrupt it,
          or misrepresent its output as advice from a lawyer.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          No warranty and limitation of liability
        </h2>
        <p>
          The site and any Starter File are provided as-is, without warranties of
          any kind. To the maximum extent permitted by law, we are not liable for
          damages arising from your use of, or reliance on, the site or file. This
          section does not exclude a warranty, remedy, or liability that applicable
          law does not allow us to exclude.
        </p>
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Changes
        </h2>
        <p>
          We may update these terms and the site at any time. Continued use
          after changes means you accept the updated terms.
        </p>
      </div>
    </div>
  );
}
