# Paid Starter File launch plan

Last updated: 2026-08-29.

## Decision: NO-GO

Do not accept payment yet. The public `/starter-file` route is intentionally fail-closed, and `STARTER_FILE_SALES_ENABLED` must remain unset or false.

Verified blockers on 2026-08-29:

1. The substantive human legal-source review is dated 2026-08-02 and was due again on 2026-08-09, so `getLegalReviewStatus().overdue` is true.
2. An external message to `hello@aipolicyfile.com` was rejected by `eforward2.registrar-servers.com` with `554 5.7.1 Relay access denied`. Inbound delivery and a working reply path are not available for refunds or privacy requests.
3. Gumroad and Paddle are candidates only. Neither provider has been selected, configured, signed into, or verified for identity, security, payout, tax, checkout, delivery, refund, retention, or privacy behavior.
4. A deterministic blocked inspection ZIP is reconciled with catalog `.2` and the public offer, but it must be rebuilt after human source sign-off and still needs a clean extracted-file browser/network inspection before upload.
5. No provider test purchase, receipt, download, redelivery, support, or refund flow has passed.

## Offer contract

- Product: AI Disclosure Starter File.
- Price: one charge of USD $19. The checkout must not preselect a tip, add-on, or recurring item.
- Subscription: none. No renewal, recurring charge, minimum term, or cancellation workflow.
- Delivery: one versioned ZIP hosted and delivered by the selected merchant of record.
- Core package: a self-contained `ai-disclosure-starter-file.html` worksheet, `README.txt`, and `BUSINESS-LICENSE.txt`. The final checkout listing and README must publish the complete manifest, including the reconciled source ledger and sample output, and that manifest must match the delivered archive byte-for-byte.
- Operation: the worksheet runs browser-locally without an account, remote script, analytics, or AI service. It must work offline. Entries are working-memory only unless the customer prints or saves a copy. User-initiated official-source links may open external sites.
- Included service: the purchased snapshot only. It does not include legal review, a cloud dashboard, hosted workspace, monitoring, or automatic updates.
- Refund: full refund for a request sent within 14 calendar days after purchase. The buyer supplies the order ID and purchase email, not card or bank details. AI Policy File validates the order and initiates the refund through the merchant of record to the original payment method. Provider and bank posting times apply; mandatory rights remain intact.
- License: one purchasing business may customize the files for its own operations and use its completed outputs on its own channels. Employees and contractors may act for that business. No resale, redistribution, publication, sublicensing, hosted-service use, or client reuse of the blank files. Agencies and consultants need one license per client business.
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
- Size: 201,520 bytes
- SHA-256: `2909dc6754fcf93fa2548fb06ff34ae84fc404922b53bdd2eca3e7e48a29eef8`
- Catalog: `legal-catalog-2026-08-29.2`
- Contents: one versioned directory with exactly the eight entries declared by `manifest.json`
- Gate: `releaseReady=false`, `releaseStatus=blocked_source_review_overdue`; the CLI exits 2
- Verification: 50/50 repository tests, ESLint, TypeScript, the Next.js production build, dependency audit, and official-source monitor passed on 2026-08-29; the ZIP opened with all expected entries and repeated builds were byte-for-byte identical. The legal-freshness and product-release commands correctly remain nonzero while review is overdue. Repeat the full suite on the final post-review archive.

## Merchant recommendation

Use Gumroad only for the first validation batch, then reassess after 10 completed non-owner, non-test sales.

Why Gumroad first:

- Gumroad states that it acts as merchant of record and handles worldwide sales-tax collection and remittance.
- Its official customer documentation says the buyer receives a receipt containing the download link. A buyer can regain access from that receipt or from the Gumroad Library, and the seller dashboard can resend receipts.
- That hosted delivery and redelivery path avoids building a first-party customer database or a custom delivery service for the validation batch.

Why evaluate Paddle after 10 qualifying sales:

- On 2026-08-29, Paddle's public standard rate was 5% + $0.50 per checkout transaction, while Gumroad's public direct/profile-link rate was 10% + $0.50. Gumroad lists a different rate for Discover sales.
- Paddle also publicly describes itself as merchant of record and says there is no lock-in and data is portable.
- At sustained demand, the lower published transaction rate and a more configurable long-term checkout justify migration work.

These are public-plan observations, not verified account economics. Before activation and again before migration, inspect the actual provider account and confirm eligibility, prohibited-product rules, payment methods, currency conversion, processor charges, taxes, reserves, chargebacks, payout timing, refund-fee treatment, support, data exports, and any negotiated or changed terms.

Official public references checked on 2026-08-29:

- Gumroad pricing and merchant-of-record statement: <https://gumroad.com/pricing>
- Gumroad customer delivery and Library access: <https://gumroad.com/help/article/282-how-do-purchases-work-for-my-customers>
- Gumroad sales dashboard, receipt resend, refund, and CSV export: <https://gumroad.com/help/article/268-customer-dashboard>
- Gumroad buyer refund path: <https://gumroad.com/help/article/190-how-do-i-get-a-refund.html>
- Paddle pricing and portability statement: <https://www.paddle.com/pricing>
- Paddle merchant-of-record overview: <https://www.paddle.com/paddle-101>
- Paddle refund process and posting estimates: <https://www.paddle.com/help/manage/your-customers/how-do-i-issue-refunds>

## Activation checklist

Every item must be evidenced before setting `STARTER_FILE_SALES_ENABLED=true`.

### Sources and product

- [ ] Complete and record a new substantive human review of every included legal source; `getLegalReviewStatus().overdue` returns false in the production build.
- [x] Reconcile the HTML, README, business license, source ledger, sample output, and any other file into one complete manifest in the blocked inspection build.
- [ ] Put the product version, source-data version, substantive review date, next review date, complete manifest, refund process, and limitations in the README and checkout listing.
- [ ] Produce the ZIP from the reconciled files, record its SHA-256 hash and each member hash, and verify a clean extraction on Windows and macOS.
- [ ] Open the extracted HTML with the network offline and exercise every input, reset, print, and save/copy path.
- [ ] Inspect network activity in a clean browser: no request occurs while opening or completing the file; only a deliberate external-source click may initiate a request.
- [x] Scan the blocked inspection archive for credentials, internal paths, customer data, analytics, remote scripts, and trackers with automated tests; repeat the scan on the final post-review archive and manually inspect links and legal claims.
- [x] Confirm the blocked inspection build and public code describe the same $19 one-time offer, no subscription, 14-day refund, one-business license, static-source snapshot, and educational/non-legal boundary; repeat on the provider listing.

### Support and privacy

- [ ] Repair the Namecheap forwarding route for `hello@aipolicyfile.com`.
- [ ] From an unrelated external mailbox, send a new message to the alias and verify receipt in the intended mailbox without a delivery error.
- [ ] Reply from the support workflow and verify that the external sender receives it and sees an appropriate From/Reply-To identity.
- [ ] Verify the receiving provider, account owner, MFA, recovery methods, delegated access, spam handling, retention, deletion, export, and incident process.
- [ ] Do not put paid-customer records, refund details, files, or legal questions in Telegram.
- [ ] Update the Privacy Policy and data inventory with the selected merchant, fields, purposes, legal bases where applicable, recipients, countries/safeguards, retention, deletion, export, support route, and provider links.
- [ ] Update Terms with the selected merchant and the final complete ZIP manifest.

### Merchant account and checkout

- [ ] Select the provider; verify the exact signed-in business/account identity and enable MFA.
- [ ] Verify product eligibility, merchant-of-record status for this transaction, seller identity, payout destination, tax handling, statement descriptor, support contact, and all live fees in the account.
- [ ] Configure a one-time USD $19 digital product with no membership, recurring billing, quantity surprise, tip, add-on, or marketing opt-in enabled by default.
- [ ] Upload the exact hashed ZIP; make its product version and archive hash traceable in the provider record.
- [ ] Publish accurate deliverables, license, source date, no-update boundary, 14-day refund policy, and educational disclaimer at checkout.
- [ ] Verify receipt, tax invoice where applicable, download, repeat download/redelivery, order lookup, data export, full refund, customer notification, and product pause controls.
- [ ] Confirm what happens to access after a refund and document the chosen license treatment without promising technical revocation the provider cannot enforce.

### Preview and production

- [ ] Set the allowlisted checkout URL in Preview while keeping `STARTER_FILE_SALES_ENABLED` false; verify that no live link renders.
- [x] Verify invalid HTTP, first-party, local, credential-bearing, and unsupported-host URLs all remain disabled in automated tests.
- [ ] With a provider test mode or provider-supported test purchase, verify the complete checkout, receipt, ZIP download, archive hash, redelivery, support, and refund path. Do not charge the owner's own card if the provider prohibits that test method.
- [ ] Verify the production Terms, Privacy Policy, data inventory, support route, and checkout copy match the configured provider and product.
- [ ] Set the production checkout URL, deploy with sales still false, and recheck source status and the disabled route.
- [ ] Set `STARTER_FILE_SALES_ENABLED=true` only after recorded owner launch authorization, redeploy, and verify the production link, price, one-time billing, destination hostname, and final checkout before announcing it.
- [ ] Monitor the first 10 qualifying orders for delivery, support, refund, privacy, fraud, chargeback, payout, fee, and tax anomalies without copying sensitive data into project logs.

## Gumroad-to-Paddle exit plan

At 10 completed non-owner, non-test sales, compare observed Gumroad economics and operations with the currently available Paddle offer. Migration is a new launch and requires its own account, data, privacy, delivery, and refund verification.

1. Preserve the canonical ZIP, hashes, complete manifest, license/terms version, source-review record, and support runbook outside Gumroad.
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
