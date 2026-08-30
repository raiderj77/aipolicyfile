# Paid Starter File launch plan

Last updated: 2026-08-30.

## Decision: NO-GO

Do not accept payment yet. The public `/starter-file` route is intentionally fail-closed, and `STARTER_FILE_SALES_ENABLED` must remain unset or false.

Verified blockers on 2026-08-30:

1. The substantive human legal-source review is dated 2026-08-02 and was due again on 2026-08-09, so `getLegalReviewStatus().overdue` is true.
2. Gumroad and Paddle are candidates only. Neither provider has been selected, configured, signed into, or verified for identity, security, payout, tax, checkout, delivery, refund, retention, or privacy behavior.
3. A deterministic blocked inspection ZIP is reconciled with catalog `.3` and the public offer, but it must be rebuilt after human source sign-off and still needs a clean extracted-file browser/network inspection before upload.
4. No merchant-backed order-support, test-purchase, receipt, download, redelivery, or refund flow has passed.

## Offer contract

- Product: AI Disclosure Starter File.
- Price: one charge of USD $19. The checkout must not preselect a tip, add-on, or recurring item.
- Subscription: none. No renewal, recurring charge, minimum term, or cancellation workflow.
- Delivery: one versioned ZIP hosted and delivered by the selected merchant of record.
- Core package: a self-contained `ai-disclosure-starter-file.html` worksheet, `README.txt`, and `BUSINESS-LICENSE.txt`. The final checkout listing and README must publish the complete manifest, including the reconciled source ledger and sample output, and that manifest must match the delivered archive byte-for-byte.
- Operation: the worksheet runs browser-locally without an account, remote script, analytics, or AI service. It must work offline. Entries are working-memory only unless the customer prints or saves a copy. User-initiated official-source links may open external sites.
- Included service: the purchased snapshot only. It does not include legal review, a cloud dashboard, hosted workspace, monitoring, or automatic updates.
- Refund: full refund for a request sent within 14 calendar days after purchase. The buyer supplies the order ID and purchase email, not card or bank details. AI Policy File validates the order and initiates the refund through the merchant of record to the original payment method. Provider and bank posting times apply; mandatory rights remain intact. When the merchant confirms a full refund, hosted download access and the blank-file license end.
- License: one purchasing business may customize the files for its own operations and use its completed outputs on its own channels. Employees and contractors may act for that business. No resale, redistribution, publication, sublicensing, hosted-service use, or client reuse of the blank files. Agencies and consultants need one license per client business. After a confirmed full refund, the buyer must stop using or distributing blank files and delete or destroy controlled copies. Downloaded files cannot be remotely erased; lawful outputs created and published before the refund remain, but no new blank-file use is permitted. The license also ends after a material breach that is not cured after notice; lawful completed outputs created and published before termination remain, but no new blank-file use is permitted.
- Boundary: educational information only. The file does not determine jurisdiction, coverage, compliance, legal duties, defenses, or acceptable wording for a buyer's facts, and it creates no attorney-client relationship.

## Application sales gates

The route may render a live purchase link only when all three conditions are true:

1. `getLegalReviewStatus().overdue === false`.
2. `NEXT_PUBLIC_STARTER_FILE_CHECKOUT_URL` parses as HTTPS, contains no username or password, and uses `gumroad.com`, a `gumroad.com` subdomain, `paddle.com`, a `paddle.com` subdomain, `paddle.net`, or a `paddle.net` subdomain.
3. The server-only value `STARTER_FILE_SALES_ENABLED` is exactly `true`.

The checkout URL is public configuration, not a secret. Never put an API key, webhook secret, credential, private customer token, or payment data in it. Unsupported, missing, malformed, local, or first-party hosts fail closed. Missing or differently cased sales-enable values fail closed. A checkout URL by itself cannot open sales.

Removing `STARTER_FILE_SALES_ENABLED` is the application kill switch. Provider-side product pausing is the independent commerce kill switch.

The route is forced dynamic so the review date and kill switch are evaluated on every request rather than served from a stale commercial cache. For visitors who explicitly allow analytics, a live purchase-link click sends one fixed GA4 `begin_checkout` event (product ID/name, USD, $19, quantity one). It sends no checkout URL, order/customer/payment data, worksheet entry, or form value.

## Current artifact evidence

The blocked inspection build generated on 2026-08-30 UTC is not uploadable for sale, but it proves the packaging path:

- Archive: `product/starter-file/generated/ai-disclosure-starter-file-v1.0.0.zip`
- Size: 221,904 bytes
- SHA-256: `cd9b97de2f281fcd87a783339215a9b83d5e3de8102cf628a8d89d2f96f7c5ec`
- Catalog: `legal-catalog-2026-08-29.3`
- Contents: one versioned directory with exactly the eight entries declared by `manifest.json`
- Gate: `releaseReady=false`, `releaseStatus=blocked_source_review_overdue`; the CLI exits 2
- Verification: 62/62 repository tests, ESLint, TypeScript, the Next.js production build, dependency audit, and the 27-link official-source monitor passed on 2026-08-30; the monitor retained three explicit New York access warnings, the ZIP opened with all expected entries, and the committed bundle matched a fresh deterministic build byte-for-byte. The legal-freshness and product-release commands correctly remain nonzero while review is overdue. Repeat the full suite on the final post-review archive.

## Merchant recommendation

Use Gumroad only for the first validation batch, then reassess after 10 completed non-owner, non-test sales.

Why Gumroad first:

- Gumroad states that it acts as merchant of record and handles worldwide sales-tax collection and remittance.
- Its official customer documentation says the buyer receives a receipt containing the download link. A buyer can regain access from that receipt or from the Gumroad Library, and the seller dashboard can resend receipts.
- That hosted delivery and redelivery path avoids building a first-party customer database or a custom delivery service for the validation batch.
- The launch target is direct web checkout only, subject to written Gumroad confirmation. Leave the category blank, keep Discover off, and do not opt into Gumroad Affiliates; category selection can enroll an eligible product in Discover, and Discover products are automatically available to affiliates.

Gumroad eligibility must be confirmed in writing before publication. Its prohibited-products page restricts AI services. This ZIP is a static offline worksheet: it makes no AI call, provides no chatbot or generation service, creates no account, and includes no subscription, off-platform fulfillment, or ongoing hosted service. That factual distinction supports an eligibility request but is not permission to publish. Use the prepared request in `gumroad-eligibility-request.md` and retain the provider response with the launch evidence.

Why evaluate Paddle after 10 qualifying sales:

- On 2026-08-30, Paddle's public standard rate was 5% + $0.50 per checkout transaction, while Gumroad's public direct/profile-link rate was 10% + $0.50. Gumroad lists a 30% rate for Discover sales.
- Paddle also publicly describes itself as merchant of record and says there is no lock-in and data is portable.
- At sustained demand, the lower published transaction rate and a more configurable long-term checkout justify migration work.

These are public-plan observations, not verified account economics. Before activation and again before migration, inspect the actual provider account and transaction disclosures and record eligibility, prohibited-product rules, payment methods, currency conversion, any additional or retained charges, taxes, reserves, chargebacks, payout timing, refund-fee treatment, support, data exports, and any negotiated or changed terms.

Official public references checked on 2026-08-30:

- Gumroad pricing and merchant-of-record statement: <https://gumroad.com/pricing>
- Gumroad prohibited-products policy and eligibility contact instruction: <https://gumroad.com/prohibited>
- Gumroad Discover enrollment and eligibility: <https://gumroad.com/help/article/79-gumroad-discover>
- Gumroad affiliate behavior: <https://gumroad.com/help/article/333-affiliates-on-gumroad.html>
- Gumroad customer delivery and Library access: <https://gumroad.com/help/article/282-how-do-purchases-work-for-my-customers>
- Gumroad sales dashboard, receipt resend, refund, and CSV export: <https://gumroad.com/help/article/268-customer-dashboard>
- Gumroad buyer refund path: <https://gumroad.com/help/article/190-how-do-i-get-a-refund.html>
- Gumroad test-purchase limits: <https://gumroad.com/help/article/62-testing-a-purchase.html>
- Gumroad payout identity and destination setup: <https://gumroad.com/help/article/260-your-payout-settings-page>
- Paddle pricing and portability statement: <https://www.paddle.com/pricing>
- Paddle merchant-of-record overview: <https://www.paddle.com/paddle-101>
- Paddle refund process and posting estimates: <https://www.paddle.com/help/manage/your-customers/how-do-i-issue-refunds>

## Activation checklist

Every item must be evidenced before setting `STARTER_FILE_SALES_ENABLED=true`.

### Sources and product

- [ ] Reviewer only: personally open and verify every source in `docs/legal-review/reviews/source-review-record-2026-08-29.md`, complete every source detail and disposition, resolve or escalate each P0 item, recheck SB 1000 immediately before reviewer sign-off, and type the reviewer signature. Automation must not complete these acts.
- [ ] Owner, unsigned stage: after reviewer sign-off, recheck SB 1000 again, complete the owner decision, cadence, conditions, and exact metadata authorization, but leave the final owner signature and timestamp blank.
- [ ] System between the two human acts: generate the registry-binding summary and annex only from the completed fields; do not choose a decision or type a signature.
- [ ] Owner final act: verify the generated summary and annex, check the final owner attestation, and type the owner signature and authorization timestamp.
- [ ] System only after both valid human acts: hash the evidence, add the matching signed registry entry, update only the exact owner-authorized metadata, and confirm `npm run check:legal-governance` passes and `getLegalReviewStatus().overdue` returns false in the production build.
- [x] Reconcile the HTML, README, business license, source ledger, sample output, and any other file into one complete manifest in the blocked inspection build.
- [ ] Put the product version, source-data version, substantive review date, next review date, complete manifest, refund process, and limitations in the README and checkout listing.
- [ ] Produce the ZIP from the reconciled files, record its SHA-256 hash and each member hash, and verify a clean extraction on Windows and macOS.
- [x] Exercise all eight text fields and all eight screening choices in the blocked inspection HTML with synthetic values. On 2026-08-30, entry produced no network request, reload cleared every value, and generation/download/print actions remained disabled by the overdue-source gate.
- [ ] On the final post-review archive, open the extracted HTML with the network offline and exercise every input, reset, generate, print, and save/copy path.
- [ ] Inspect the final extracted HTML in a clean extension-free browser: no request occurs while opening or completing the file; only a deliberate external-source click may initiate a request. The 2026-08-30 Chrome inspection attributed non-document load traffic to installed browser extensions, so it does not clear this final clean-browser gate.
- [x] Scan the blocked inspection archive for credentials, internal paths, customer data, analytics, remote scripts, and trackers with automated tests; repeat the scan on the final post-review archive and manually inspect links and legal claims.
- [x] Confirm the blocked inspection build and public code describe the same $19 one-time offer, no subscription, 14-day refund, one-business license, static-source snapshot, and educational/non-legal boundary; repeat on the provider listing.

### Support and privacy

- [x] Replace the inbound-only Namecheap forwarder with `hello@aipolicyfile.com` on the existing Migadu Micro/yearly account; keep Namecheap BasicDNS and use both Migadu MX records, verification TXT, SPF, and all three DKIM rotation CNAMEs.
- [x] Forward a copy to the owner-controlled Gmail mailbox while retaining a copy in Migadu. Fresh external test `APF-20260829-04` arrived with the `AI Policy File Support` label, `INBOX`, and `UNREAD`.
- [x] Reply from the support workflow and verify that the external sender receives it from `hello@aipolicyfile.com`. The reply arrived, and separate outbound test `APF-20260829-03` passed SPF, DKIM, and DMARC at Google.
- [x] Verify the Gmail receiving identity, 2-Step Verification status, configured recovery methods, delegated access, Send-as route, and same-address reply setting. Recovery values are not recorded in the repo; no Gmail delegates were listed.
- [x] Document spam review, minimal-data handling, provisional retention, deletion/export testing, migration, and incident procedures in `support-mail-runbook.md`.
- [ ] Owner: complete Google Security Checkup's recovery confirmation and review its device and linked-app recommendations; verify/enable Migadu and Namecheap MFA and recovery; then run synthetic spam, deletion, export, and recovery exercises from the runbook.
- [ ] Do not put paid-customer records, refund details, files, or legal questions in Telegram.
- [ ] Update the Privacy Policy and data inventory with the selected merchant, fields, purposes, legal bases where applicable, recipients, countries/safeguards, retention, deletion, export, support route, and provider links.
- [ ] Update Terms with the selected merchant and the final complete ZIP manifest.

#### Support reply decision

The existing Migadu Micro/yearly organization was verified under `raiderj77@gmail.com`, renews March 28, 2027, and supports the additional domain and address without a new subscription. `aipolicyfile.com` is active there with `hello@aipolicyfile.com` as a real mailbox, a retained server copy, and forwarding to Gmail. Gmail sends through `smtp.migadu.com` on port 587 with TLS and replies from the same address that received the message.

This is an owner-authorized temporary Gmail interface, not a permanent dependency. Google says third-party Send-as support in Gmail web and mobile will be removed in January 2027. Migrate replies to Migadu webmail or another directly configured client, then rerun inbound, authenticated outbound, reply, spam, recovery, retention, deletion/export, and incident tests before that deadline. Do not reopen Namecheap Private Email purchasing unless the existing Migadu plan becomes unsuitable.

The operational procedure and remaining account-security gates are recorded in `support-mail-runbook.md`.

Official references checked on 2026-08-29:

- Namecheap free forwarding limits: <https://www.namecheap.com/support/knowledgebase/article.aspx/308/2214/how-to-set-up-free-email-forwarding/>
- Google custom Send-as and SMTP requirement: <https://support.google.com/mail/answer/22370>
- Google third-party account and Send-as retirement: <https://support.google.com/mail/answer/17101213>
- Migadu plan and feature reference: <https://www.migadu.com/pricing/>

### Merchant account and checkout

- [ ] Select the provider; verify the exact signed-in business/account identity and enable MFA.
- [ ] Obtain and retain written Gumroad confirmation that this static downloadable worksheet is eligible despite the prohibited-products policy for AI services. Do not infer approval from account creation or a draft product.
- [ ] Verify product eligibility, merchant-of-record status for this transaction, seller identity, payout destination, tax handling, statement descriptor, support contact, and all live fees in the account.
- [ ] The owner must personally complete the provider's legal identity, taxpayer, address, payout-destination, identity-document, and payment-terms steps. Do not place those values in project files or chat logs.
- [ ] Configure a one-time USD $19 digital product with no membership, recurring billing, quantity surprise, tip, add-on, or marketing opt-in enabled by default.
- [ ] Use a direct web-checkout link for the validation batch. Leave category blank, keep Discover off, and do not opt into Gumroad Affiliates; verify these settings again after every product edit.
- [ ] Upload the exact hashed ZIP; make its product version and archive hash traceable in the provider record.
- [ ] Owner/reviewer: reopen the official SB 1000 status and current text immediately before uploading or publishing the final artifact. If its status or text changed, stop and rerun the legal review before sales activation.
- [ ] Publish accurate deliverables, license, source date, no-update boundary, 14-day refund policy, and educational disclaimer at checkout.
- [ ] Verify receipt, tax invoice where applicable, download, repeat download/redelivery, order lookup, data export, full refund, customer notification, and product pause controls.
- [ ] Confirm the live purchase surfaces and refund authority. Keep the initial offer on web checkout; if an app-store purchase surface cannot be disabled, update the listing, Terms, and support process before sale to reflect the applicable platform-controlled refund path.
- [ ] Verify that a confirmed full refund ends provider-hosted access. Confirm the Terms, listing, receipt, README, and license all terminate the blank-file license, require the buyer to stop use or distribution and delete or destroy controlled copies, disclose that downloaded files cannot be remotely erased, preserve only lawful outputs created and published before the refund, and prohibit new blank-file use.

### Preview and production

- [ ] Set the allowlisted checkout URL in Preview while keeping `STARTER_FILE_SALES_ENABLED` false; verify that no live link renders.
- [x] Verify invalid HTTP, first-party, local, credential-bearing, and unsupported-host URLs all remain disabled in automated tests.
- [ ] Use Gumroad's provider-supported test purchase to verify checkout, receipt/email, ZIP download, archive hash, and redelivery. Record that a test purchase does not create a normal sale or validate a real refund, payout, or post-refund access state.
- [ ] Ask Gumroad for the approved way to exercise a real full-refund and post-refund-access test. Do not buy the owner's own product or charge an owner-controlled card to manufacture a sale.
- [ ] Verify the production Terms, Privacy Policy, data inventory, support route, and checkout copy match the configured provider and product.
- [ ] Set the production checkout URL, deploy with sales still false, and recheck source status and the disabled route.
- [ ] Reopen the official SB 1000 status and current text immediately before the final sales-enable decision; stop if the volatile-source result no longer matches the signed record and catalog.
- [ ] Set `STARTER_FILE_SALES_ENABLED=true` only after recorded owner launch authorization, redeploy, and verify the production link, price, one-time billing, destination hostname, and final checkout before announcing it.

### Post-launch obligations

- [ ] Monitor the first 10 qualifying orders for delivery, support, refund, privacy, fraud, chargeback, payout, fee, and tax anomalies without copying sensitive data into project logs.

## Gumroad-to-Paddle exit plan

At 10 completed non-owner, non-test sales, compare observed Gumroad economics and operations with the currently available Paddle offer. Migration is a new launch and requires its own account, data, privacy, delivery, and refund verification.

1. Preserve the canonical ZIP, hashes, complete manifest, license/terms version, signed source-review record and registry entry, and support runbook outside Gumroad.
2. Export only the minimal Gumroad order and refund records needed for accounting, support, mandatory retention, and honoring existing purchases. Protect the export and set a deletion date.
3. Do not transfer card credentials. Let Paddle create new transactions under its own merchant-of-record checkout.
4. Keep Gumroad access and the 14-day refund path available for prior buyers for as long as the purchase terms and law require. Do not strand existing receipt/download links merely to force migration.
5. Configure and test Paddle with a new allowlisted URL while the server sales flag remains false.
6. Update Terms, Privacy, data inventory, checkout copy, receipts, support procedures, and retention records to distinguish legacy Gumroad orders from new Paddle orders.
7. Change the one public checkout URL only after Paddle purchase, delivery, redelivery, export, refund, support, tax, payout, and production tests pass.
8. Pause new Gumroad sales, retain read-only operational access as required for legacy support, and delete exported or provider data when retention obligations end.

## Incident rollback

For stale sources, broken support, wrong price or billing mode, mismatched or corrupt files, unsafe network behavior, provider/account uncertainty, delivery failure, refund failure, privacy mismatch, or a security incident:

1. Remove or set `STARTER_FILE_SALES_ENABLED=false` and deploy; confirm the route renders no live checkout link.
2. Pause the product in the merchant dashboard and verify the checkout no longer accepts new payment.
3. Preserve the minimum evidence needed to diagnose the issue without copying full payment data or worksheet content.
4. Continue delivery, refund, privacy, and support obligations for existing buyers through the verified provider and mailbox.
5. Record scope, affected orders, correction, notification decision, and the fresh tests required before re-enabling both independent gates.
