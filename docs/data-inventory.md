# AI Policy File data inventory

Last verified from code, public infrastructure, and provider-account controls: 2026-08-29.

This inventory distinguishes implemented controls from provider-account settings that still need independent verification. It must be updated before adding a database, accounts, payments, free text, saved results, AI processing, or another vendor.

| Data category and fields | Purpose | Collection point | Legal basis where applicable | Storage location / processor | Retention | Deletion method | Export / user control | Analytics exposure | Logging exposure | Control status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Checker answers and five-card result | Browser-local educational screening | `/checker` React state | Not transmitted by AI Policy File | User browser memory only | Until refresh, close, or restart | Refresh, close, or Start over | Print locally; user controls browser | Explicitly excluded | Not sent to server | Implemented and tested |
| Waitlist email, optional role, optional value range, source page | One launch email and list administration | Consent-gated waitlist form | Consent where applicable | Telegram private chat via Bot API | Delete on verified withdrawal; otherwise within 30 days after launch email; new messages auto-delete after 365 days as a backstop | Telegram auto-delete for new messages; owner manually deletes earlier when required and handles pre-timer messages | Access/correction/deletion request through `hello@aipolicyfile.com` | Form values explicitly excluded | Route avoids application logging; provider network/security logs may exist | Transport and 365-day timer production-verified with a synthetic submission on 2026-08-29; timer is not retroactive |
| Waitlist submission time, consent notice version, retention due time, retention rule | Evidence and retention administration | Generated on server after validated consent | Consent administration / legitimate interests where applicable | Same Telegram message | Same as waitlist record | Same as waitlist record | Included with any accessible record export | Not sent | Route avoids application logging | Implemented in code on 2026-08-29 |
| Analytics preference | Remember allow/decline choice | Privacy choices component | Consent | Browser local storage | Until browser storage is cleared or choice changes | Clear storage or change Privacy choices | Direct user control | This is the consent control | Not intentionally logged by app | Implemented and tested |
| Consented GA4 page views and standard session data: page title, origin/path and referrer without query strings or fragments, browser/OS name, broad device category, language, and country/region | Aggregate site usage | Public pages after analytics opt-in | Consent where applicable | Dedicated Google Analytics property and web stream | Event data: 2 months; user data: 2 months; user expiry does not reset on new activity; Google states most standard aggregated reports are unaffected by these controls | GA4 account controls and applicable data request process | Privacy choices withdraw future collection | This is the analytics dataset; checker answers/results, email, founding-list values, site-supplied page-location or referrer query/fragment data, and automatic Enhanced Measurement events are prohibited | Google may maintain service/security logs | Property and stream verified 2026-08-29; Enhanced Measurement, Google Signals, and user-provided data are off; ads personalization and granular city/device collection are disallowed in all 307 regions |
| Request, security, and deployment logs | Availability, abuse prevention, diagnostics, incident response | Vercel edge/hosting | Legitimate interests or legal obligation where applicable | Vercel | Provider/configuration dependent; not verified in this repo | Vercel account/project controls | Case-specific request through site contact | Routes and technical request data may be visible | Standard request/security data may be logged; waitlist code does not intentionally log body content | Provider setting requires owner verification |
| Contact email address, headers, and sender-chosen message | Respond to contact, privacy, correction, accessibility, or security reports | `hello@aipolicyfile.com` | Consent, legitimate interests, or legal obligation depending on request | Namecheap forwarding plus an unverified receiving mailbox provider | No verified account-side rule yet; retain only as needed for the request and legal/security recordkeeping | Delete in forwarding/receiving mailbox subject to provider limitations | Sender may request access, correction, or deletion where applicable | Prohibited | Email providers maintain delivery/security logs | Routing verified; destination provider, MFA, and retention require owner verification |

## Hard boundaries

- Telegram is a temporary founding-list transport, not a customer database. Do not store paid-customer records, Policy Files, generated documents, legal questions, or sensitive content there.
- Anonymous checker answers and results remain browser-local and are not analytics events.
- No free-text waitlist field is permitted without a new risk review, notice, retention rule, and tests.
- Provider-account settings are not treated as verified merely because application code is correct.
- Telegram auto-delete is verified for new messages. Before launch, review pre-timer messages against the same withdrawal, post-launch, and 365-day limits; reverify GA4 after any account, property, or stream change; verify the receiving mailbox provider, MFA, and retention.

## Verified GA4 configuration

Verified in the owner account on 2026-08-29:

- Account: `mybuilds` (`375341823`)
- Property: `AI Policy File` (`551974507`)
- Web stream: `AI Policy File Website` (`15524601216`)
- Measurement ID: `G-MEY1Y9KDNJ`
- Enhanced Measurement: off; site code explicitly sends a query-free page-view event and sanitized page context; Google may still generate standard first-visit, session-start, and engagement events after consent
- Event data retention: 2 months
- User data retention: 2 months; reset on new user activity: off
- Google Signals: off; user-provided data collection: off
- Ads personalization: disallowed in all 307 regions
- Granular city/location and detailed device collection: disallowed in all 307 regions; country/region and broad device-category reporting remain available

## Change procedure

Any new collected field or processor requires this inventory to record its purpose, necessity, legal basis where applicable, storage, retention, deletion, export, user control, analytics exposure, logging exposure, failure behavior, and exit path before production use.
