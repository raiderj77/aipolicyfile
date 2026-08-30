# AI Policy File data inventory

Last verified from code, public infrastructure, and provider-account controls: 2026-08-29.

This inventory distinguishes implemented controls from provider-account settings that still need independent verification. It must be updated before adding a database, accounts, payments, free text, saved results, AI processing, or another vendor.

| Data category and fields | Purpose | Collection point | Legal basis where applicable | Storage location / processor | Retention | Deletion method | Export / user control | Analytics exposure | Logging exposure | Control status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Checker answers and five-card result | Browser-local educational screening | `/checker` React state | Not transmitted by AI Policy File | User browser memory only | Until refresh, close, or restart | Refresh, close, or Start over | Print locally; user controls browser | Explicitly excluded | Not sent to server | Implemented and tested |
| Starter File worksheet entries and completed output | Browser-local business inventory and disclosure planning | Planned self-contained HTML file opened from the purchased ZIP | Not transmitted by AI Policy File | User browser working memory and any copies the user chooses to save or print | Working entries until refresh or close; saved and printed copies until the user deletes them | Refresh or close the file; delete saved copies and destroy printouts | User controls local print and saved copies | Prohibited; the file must contain no analytics | Prohibited; the file must make no application request while being completed | Specified but not released; offline operation, no remote scripts, and user-initiated external links require pre-launch network inspection |
| Planned order record: purchase email, order ID, product/version, amount, currency, tax, refund, and license status | Delivery, receipt, support, fraud handling, refunds, licensing, and accounting | Future external merchant-of-record checkout and provider dashboard | Purchase contract, legitimate interests, or legal obligation where applicable | Selected merchant of record and any minimal records in the support mailbox; no separate site-operated customer database is planned for the initial batch | Not set; provider, accounting, tax, dispute, and legal limits must be documented before activation | Provider dashboard and verified support process, subject to required financial records | Provider receipt/account controls and applicable privacy request | Prohibited | Merchant, payment, email, and security logs may exist | Collection disabled; Gumroad and Paddle are candidates, but neither is selected, configured, or account-verified |
| Full card, bank-account, and payment-authentication data | Complete payment at the merchant-of-record checkout | Future external checkout only | Determined and disclosed by the selected merchant of record | Merchant of record and its payment providers, not AI Policy File application storage | Provider and legal requirements | Provider controls | Provider controls | Prohibited | Provider security and transaction logs may exist | Collection disabled; the site must never request, proxy, log, or store full payment credentials |
| Waitlist email, optional role, optional value range, source page | One launch email and list administration | Consent-gated waitlist form | Consent where applicable | Telegram private chat via Bot API | Delete on verified withdrawal; otherwise within 30 days after launch email; new messages auto-delete after 365 days as a backstop | Telegram auto-delete for new messages; owner manually deletes earlier when required and handles pre-timer messages | Published access/correction/deletion path is `hello@aipolicyfile.com`, but it is currently broken and cannot be relied on until repaired | Form values explicitly excluded | Route avoids application logging; provider network/security logs may exist | Transport and 365-day timer production-verified with a synthetic submission on 2026-08-29; timer is not retroactive; request-channel failure is an open privacy defect |
| Waitlist submission time, consent notice version, retention due time, retention rule | Evidence and retention administration | Generated on server after validated consent | Consent administration / legitimate interests where applicable | Same Telegram message | Same as waitlist record | Same as waitlist record | Included with any accessible record export | Not sent | Route avoids application logging | Implemented in code on 2026-08-29 |
| Analytics preference | Remember allow/decline choice | Privacy choices component | Consent | Browser local storage | Until browser storage is cleared or choice changes | Clear storage or change Privacy choices | Direct user control | This is the consent control | Not intentionally logged by app | Implemented and tested |
| Consented GA4 page views, one fixed Starter File `begin_checkout` event, and standard session data: page title, origin/path and referrer without query strings or fragments; fixed product ID/name, USD currency, $19 value/price, and quantity one on a live checkout-link click; browser/OS name, broad device category, language, and country/region | Aggregate site usage and consented purchase-funnel measurement | Public pages after analytics opt-in; checkout event only when the live Starter File purchase link is clicked | Consent where applicable | Dedicated Google Analytics property and web stream | Event data: 2 months; user data: 2 months; user expiry does not reset on new activity; Google states most standard aggregated reports are unaffected by these controls | GA4 account controls and applicable data request process | Privacy choices withdraw future collection | This is the analytics dataset; checkout URL, order/customer/payment data, worksheet entries, checker answers/results, email, founding-list values, site-supplied page-location or referrer query/fragment data, and automatic Enhanced Measurement events are prohibited | Google may maintain service/security logs | Property and stream verified 2026-08-29; event is emitted only when analytics is enabled; Enhanced Measurement, Google Signals, and user-provided data are off; ads personalization and granular city/device collection are disallowed in all 307 regions |
| Request, security, and deployment logs | Availability, abuse prevention, diagnostics, incident response | Vercel edge/hosting | Legitimate interests or legal obligation where applicable | Vercel | Provider/configuration dependent; not verified in this repo | Vercel account/project controls | Case-specific request through site contact | Routes and technical request data may be visible | Standard request/security data may be logged; waitlist code does not intentionally log body content | Provider setting requires owner verification |
| Contact email address, headers, and sender-chosen message | Respond to contact, privacy, correction, accessibility, security, order, or refund requests | `hello@aipolicyfile.com` | Consent, purchase contract, legitimate interests, or legal obligation depending on request | Namecheap forwarding plus an unverified receiving mailbox provider, if delivery succeeds | No verified account-side rule yet; retain only as needed for the request and legal/security recordkeeping | Delete in forwarding/receiving mailbox subject to provider limitations | Sender may request access, correction, or deletion where applicable | Prohibited | Email providers maintain delivery/security logs | **Broken:** an external delivery test on 2026-08-29 was rejected by `eforward2.registrar-servers.com` with `554 5.7.1 Relay access denied`; inbound delivery, reply path, destination provider, MFA, and retention are not verified |

## Hard boundaries

- Telegram is a temporary founding-list transport, not a customer database. Do not store paid-customer records, Policy Files, generated documents, legal questions, or sensitive content there.
- Anonymous checker answers and results remain browser-local and are not analytics events.
- The Starter File checkout must render no live link unless all three gates pass: `getLegalReviewStatus().overdue === false`, `NEXT_PUBLIC_STARTER_FILE_CHECKOUT_URL` is a valid HTTPS URL on a Gumroad or Paddle-family hostname, and the server-only `STARTER_FILE_SALES_ENABLED` value is exactly `true`.
- `STARTER_FILE_SALES_ENABLED` must remain false until the support alias has passed a fresh external inbound-and-reply test, the provider and complete ZIP manifest are verified, and the purchase/refund tests in the launch plan pass. Removing either environment value fails closed.
- The checkout URL is intentionally public and contains no secret. API keys, webhook secrets, account credentials, full payment data, and customer records must never be placed in that URL or a `NEXT_PUBLIC_` variable.
- No separate AI Policy File customer database is authorized for the initial validation batch. Order administration stays in the selected merchant dashboard and verified support mailbox, subject to the selected retention and exit controls.
- No free-text waitlist field is permitted without a new risk review, notice, retention rule, and tests.
- Provider-account settings are not treated as verified merely because application code is correct.
- Telegram auto-delete is verified for new messages. Before launch, review pre-timer messages against the same withdrawal, post-launch, and 365-day limits; reverify GA4 after any account, property, or stream change; repair and externally retest the support alias; and verify the receiving mailbox provider, MFA, and retention.

## Planned merchant-of-record decision

No merchant account or product setup has been inspected or verified. The current recommendation is operational, not a claim that either provider is ready:

- Use Gumroad only for the initial validation batch because its official customer documentation says a receipt links to the purchased download and buyers can regain access through the receipt or Gumroad Library. This supports hosted ZIP delivery and redelivery without building a first-party customer database.
- After 10 completed non-owner, non-test sales, evaluate migration to Paddle. As checked on 2026-08-29, Paddle publicly lists 5% + $0.50 per checkout transaction, while Gumroad publicly lists 10% + $0.50 for direct/profile-link sales and a different rate for Discover sales. Recheck the complete effective fees, payment-method costs, reserves, payout terms, refund economics, taxes, and eligibility in the actual accounts before either activation or migration.
- Keep the site provider-neutral: one allowlisted public checkout URL and one server-only enable flag. Preserve the canonical ZIP, hashes, manifest, terms version, and minimal order/refund export outside provider configuration so the checkout can be changed without changing product logic or migrating payment credentials.

Official public references checked on 2026-08-29:

- Gumroad pricing and merchant-of-record statement: <https://gumroad.com/pricing>
- Gumroad purchase delivery and Library access: <https://gumroad.com/help/article/282-how-do-purchases-work-for-my-customers>
- Gumroad receipt resend and sales export controls: <https://gumroad.com/help/article/268-customer-dashboard>
- Paddle pricing and portability statement: <https://www.paddle.com/pricing>
- Paddle merchant-of-record overview: <https://www.paddle.com/paddle-101>

## Verified GA4 configuration

Verified in the owner account on 2026-08-29:

- Account: `mybuilds` (`375341823`)
- Property: `AI Policy File` (`551974507`)
- Web stream: `AI Policy File Website` (`15524601216`)
- Measurement ID: `G-MEY1Y9KDNJ`
- Enhanced Measurement: off; site code explicitly sends a query-free page-view event and sanitized page context plus a fixed Starter File `begin_checkout` event on a live purchase-link click; Google may still generate standard first-visit, session-start, and engagement events after consent
- Event data retention: 2 months
- User data retention: 2 months; reset on new user activity: off
- Google Signals: off; user-provided data collection: off
- Ads personalization: disallowed in all 307 regions
- Granular city/location and detailed device collection: disallowed in all 307 regions; country/region and broad device-category reporting remain available

## Change procedure

Any new collected field or processor requires this inventory to record its purpose, necessity, legal basis where applicable, storage, retention, deletion, export, user control, analytics exposure, logging exposure, failure behavior, and exit path before production use.
