# AI Policy File project charter

Owner instruction adopted: 2026-08-29.

AI Policy File is a durable, source-grounded AI transparency and disclosure information platform. It is not a law firm, does not provide legal advice, does not determine applicability or compliance, and does not promise that sample language satisfies every requirement for a particular person or business.

The defensible product promise is: help users identify frameworks worth reviewing, understand what reviewed official sources say, trace information to those sources, prepare educational drafts, and monitor changes.

## Decision hierarchy

When requirements conflict, use this order:

1. Applicable law and user safety.
2. Legal-source accuracy.
3. Privacy and security.
4. Accessibility.
5. Truthful product representation.
6. User task completion.
7. Performance.
8. Search visibility.
9. Conversion.
10. Revenue optimization.

Traffic, signups, and revenue never override accuracy, privacy, security, accessibility, transparent subscription terms, or trust.

## Legal-output boundary

Never issue individualized legal verdicts such as compliant, noncompliant, legal, illegal, exempt, required wording, safe harbor, approved, certified, protected from liability, or legally sufficient. Use educational states such as `Worth reviewing`, `Possible relevance`, `Lower apparent relevance`, `More information needed`, and `Source review overdue`.

Every result must expose matched answers, the relevant framework, unresolved facts, official sources, source version, substantive review date, next review due date, checker version, template version when used, and the educational limitation. Official primary sources control. If support is unavailable, say `Source support not verified`; if a necessary fact is absent, list it under unresolved facts instead of guessing.

## Sources, dates, and corrections

- Prefer controlling legislature, code, regulator, agency, EUR-Lex, Commission, and other official government sources.
- Never invent or conflate publication, enactment, effective, operative, retrieval, automated-check, substantive-review, or page-modification dates.
- Each framework must have structured, versioned source and review metadata plus a defined review schedule.
- Automated retrieval does not replace substantive human review.
- When review is overdue, all dependent pages, results, downloads, templates, documents, and APIs must visibly inherit `SOURCE REVIEW OVERDUE`.
- A page `dateModified` changes only for a substantive public-content update, never to simulate freshness.
- Material errors require a correction record with prior and corrected information, reason, official source, affected checker/template/document versions, reviewer, and resolution. Treat wrong status, dates, scope, exceptions, logic, or citations as a production incident.

## Architecture and privacy

- Keep the anonymous checker deterministic and browser-local. Do not transmit answers or classifications to servers, analytics, advertising, replay, AI, or marketing systems.
- Do not add an LLM, database, vendor, subscription, API, or recurring cost without a defined user problem, documented privacy/security/maintenance impact, expected value, and exit path.
- Generative AI may assist grounded drafting or source comparison only after approved structured sources are supplied. It may not decide applicability or compliance, publish source changes, send messages, alter billing, delete accounts, or change review dates.
- Treat user and retrieved content as untrusted data, never system instructions. Test any AI feature for prompt injection, fake citations, source manipulation, cross-user leakage, secret leakage, unsafe tools, and prohibited legal verdicts before release.
- Collect the minimum necessary information. Do not request confidential legal materials, privileged communications, health or financial data, identifiers, passwords, secrets, or case details without a separately reviewed feature and safeguards.
- Maintain `docs/data-inventory.md` for every field and processor. No unknown data pipelines.
- Never send checker answers, results, drafts, prompts, uploads, emails, support content, secrets, payment data, or rights-request contents to analytics.
- Telegram remains temporary waitlist transport only; never use it for paid-customer records, saved Policy Files, generated policies, or sensitive data.

## Security and accessibility

- Use HTTPS, server-side secrets, least privilege, MFA/passkeys for privileged accounts, environment separation, security headers/CSP, dependency and secret scanning, rate limits where needed, secure sessions/authorization when accounts exist, backups/restore testing when durable storage exists, and incident procedures.
- Logs exclude checker answers, generated documents, sensitive prompts, secrets, payment-card data, and confidential submissions.
- WCAG 2.2 AA is the internal target. Test keyboard access, focus, headings/landmarks, labels/errors, screen readers, contrast, zoom/reflow, reduced motion, dialogs, touch targets near 44 CSS pixels, mobile layout, and non-color status cues.

## Content, search, and product quality

- Prefer a small authoritative library over mass-produced or thin AI pages. Every page must answer who it serves, the question, supporting source, original value, and next useful action.
- Public legal pages need rendered useful content, accurate status/dates, author/reviewer truth, primary sources, canonical metadata, accessible layout, consistent headings, and structured data that matches visible content.
- Do not portray the site as an attorney, law firm, government entity, or certified compliance service.
- SEO/AEO follows original source-grounded usefulness: no fake freshness, keyword stuffing, doorway pages, misleading ratings, or unsupported schema.
- Production performance targets at the 75th percentile are LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1. Keep the checker small and avoid noncritical libraries.

## Commercial gates

Do not launch recurring billing until price and frequency, renewal, affirmative authorization evidence, retainable confirmation, direct online cancellation, required reminders, price changes, billing-failure monitoring, privacy notices, terms, and refund handling are complete and tested. Cancellation may not require calls, tickets, mandatory surveys, or retention mazes.

Keep core law summaries, primary sources, review dates, editorial standards, basic tracker, essential FAQs, corrections, and the free checker public. Paid value may include saved projects, versioning, alerts, teams, exports, brand presets, advanced workflows, and higher API usage—but official authority stays verifiable outside a paywall.

## Release gates

Before a legal-page release: verify primary source, status, dates, roles, definitions, major exceptions, structured source/version/review metadata, canonical and visible metadata, structured data, accessibility, and links.

Before a checker change: verify affected sources and rules, exceptions, deterministic regressions, educational wording, source mapping, stale inheritance, mobile/accessibility behavior, and analytics isolation.

Before any AI feature: verify grounding, versioned prompts/sources, injection and fake-citation defenses, sensitive-data and isolation tests, prohibited-verdict tests, stale inheritance, provenance, accessibility, and privacy disclosure.

Before an API: verify scoped authentication/authorization, rate limits, secret handling, object-level access, OpenAPI, consistent errors, changelog/deprecation, logging, and nuanced non-verdict responses.

Run proportional automated and manual checks for checker logic, required source fields, mappings, overdue state, official links, template/source consistency, metadata/canonicals, structured data, sitemap, analytics forbidden fields, security, accessibility, and any account/billing lifecycle introduced.

## Current priorities

P0: current source reviews; overdue propagation; legal-advice separation; browser-local checker; corrections/version history; retention rules; production security; WCAG 2.2 AA; complete subscription controls before payment.

P1: structured versioned frameworks; reliable official-source monitoring; grounded drafting only after source maturity; helpful SEO/AEO/internal linking; privacy controls before account complexity; public Accessibility, AI Transparency, Security, and Corrections resources.

P2: API after core stability; localization only with equivalent editorial review; new jurisdictions only when maintenance capacity exists.

Trust is the asset. Quality beats volume, primary sources beat unsupported summaries, freshness beats manipulated dates, deterministic logic beats unnecessary AI, transparency beats aggressive conversion, and simple architecture beats avoidable complexity.
