# Internal SOP: legal source review governance

**SOP version:** 1.0  
**Adopted:** August 30, 2026  
**Purpose:** Keep legal-framework summaries current, auditable, and easy to recheck.  
**Boundary:** This is an internal process document, not legal advice.

## Scope

This SOP applies to any framework summary that relies on statutes, regulations, agency guidance, official bill text, court decisions, amendments, correction records, or official-source status checks. It is especially important for pending bills, access-limited official pages, recently amended laws, transition-period rules, and summaries that distinguish binding from nonbinding sources.

## Roles and separation of acts

### Reviewer

A named person who personally opens the controlling official sources, confirms the current text, compares it with the implemented summary, and records one disposition for each framework and correction.

### Site owner / decision-maker

A named person who accepts, modifies, or rejects the review outcome, resolves escalations, and separately authorizes the exact review metadata. One person may perform both roles, but the review attestation and metadata authorization remain separate recorded acts.

### System / automation

A tool may retrieve sources, preserve hashes and run references, flag source-access problems, compare versions, and prepare blank records. Automation does **not** count as substantive human review. It must not:

- check human-attestation boxes;
- select accept, change, or reject for a human;
- type a reviewer or owner signature;
- represent a packet or automated result as approval; or
- advance a human-review date, next-review date, correction approval state, or public currentness state without the completed record and owner authorization required below.

## Core rules

1. Always check the controlling official source directly.
2. Never treat a passed-but-not-chaptered bill as current law.
3. Never treat an access-limited page as fully automated verification.
4. Never update review metadata without human sign-off and separate owner authorization.
5. Never merge binding and nonbinding sources into one legal label.
6. Never let a narrow transition period become a broad exemption.
7. Recheck volatile sources immediately before reviewer sign-off, again before owner metadata authorization, and again before publication or sales activation.
8. Bind each approval to the exact source catalog, checker/template versions, corrections, and reviewed content; a later material change invalidates that approval.
9. Choose exactly one disposition per framework and per correction.
10. An unresolved or rejected P0 item keeps dependent publication and sales gates closed.

## Two independent states

Keep these states separate:

- **Substantive-review currentness:** whether a completed human review supports the implemented summary within its approved cadence.
- **Automated-monitoring coverage:** whether unattended checks can currently reach and assess each configured source.

A documented human verification may support substantive currentness while automated monitoring remains `access_limited`. If a controlling source cannot be manually confirmed when a trigger requires it, the summary remains stale or unresolved. Never describe manual verification as full automation.

## Workflow

### 1. Detect

Check for new amendments, enacted bills, corrections, changed effective dates, access failures, new official guidance, court decisions, or a scheduled due date.

### 2. Classify

- **Minor:** formatting or citation only.
- **Moderate:** wording clarification or small exception.
- **Substantive:** new duty, changed scope, changed penalty, changed interpretation, or changed status.
- **Critical:** an enacted pending bill, unavailable controlling source, misleading implemented summary, or another issue that must fail closed.

### 3. Verify

The reviewer personally opens the official source and records its identity, current version, title/citation, legal role, effective or operative date, final URL, retrieval timestamp and time zone, manual method, and any access limitation. Automated observations remain separately labeled.

### 4. Compare

Compare official text with the implementation for status, dates, jurisdiction and scope, regulated roles, applicability signals, definitions, exceptions, duties, penalties or remedies, binding effect, sample language, templates, corrections, and pending transitions or amendments.

### 5. Decide

For each framework and correction, choose exactly one:

- Accept as written
- Accept with listed changes
- Reject / escalate

Listed changes must be implemented and retested, then bound to the final reviewed commit and legal-content fingerprint before metadata can advance.

### 6. Record and authorize

Complete the four sections of a dated review record:

1. framework review records;
2. source verification log;
3. pending-changes tracker; and
4. reviewer sign-off plus separate site-owner metadata authorization.

Use `docs/legal-review/source-review-record-template.md`. Dated records live in `docs/legal-review/reviews/` and are append-only after approval; corrections or supersession use a new record that identifies the prior record. The AI-prepared comparison packet is evidence, not sign-off. After reviewer sign-off, the owner completes the still-unsigned decision, metadata, and second volatile-source check. Automation may then generate the machine-readable binding annex from those completed fields. The owner verifies that it matches the final source list, decisions, commit, fingerprint, corrections, volatile/access-limited resolutions, and authorized metadata before typing the final owner signature and timestamp.

## Sign-off validity

A sign-off is valid only if the reviewer personally opened the controlling official sources, compared the implemented summary, considered recent corrections and pending changes, resolved or escalated source-access problems, made an explicit decision for every configured automation allowlist entry, recorded one disposition per framework and correction, and typed their own name and completion timestamp.

The site owner must then separately record:

- the overall decision;
- the exact authorized `lastSubstantiveHumanReviewDate`;
- the exact authorized `nextReviewDue` and cadence basis;
- whether the public overdue state may clear;
- any unresolved items or publication conditions; and
- their own typed signature and timestamp.

An unsigned, contradictory, incomplete, automation-only, or rejected record is not approved. If a critical source cannot be verified or a material interpretation remains unresolved after direct source comparison, keep the dependent gate closed and escalate to qualified counsel rather than guessing.

## Repository enforcement

`docs/legal-review/review-registry.json` is a machine-readable index, not a substitute for the signed record. `npm run check:legal-governance` must pass before review metadata can clear the source gate. The check requires a matching record ID, catalog/checker versions, all five framework dispositions, confirmations, exact authorized dates, content fingerprint, corrections list, and a completed evidence record.

The frozen August 2 metadata is registered only as a historical baseline because it predates this SOP. That entry cannot authorize a new date or state. Automation verifies record completeness and consistency; it cannot verify that a human told the truth.

Authoritative CI checks every signed `reviewedCommit` against full Git history and requires it to be an ancestor of the release revision. A production builder that deliberately omits Git history may use the active signed record only when the complete checked-out legal-content fingerprint exactly matches that record; a mismatch keeps the build closed. Superseded signed records retain their evidence hash and annex binding, while full-history CI remains their commit-ancestry authority.

## Staleness and immediate recheck triggers

A summary becomes stale or unresolved when the controlling law changes, a bill becomes chaptered or enacted, a transition period ends, a correction changes meaning, a required controlling source cannot be manually confirmed, a court decision changes interpretation, or the implementation no longer matches the reviewed source.

Immediate recheck triggers include:

- a passed bill becoming chaptered;
- an urgency bill that could rewrite current claims;
- a controlling page returning 403 or another access-limited response;
- an official amendment or correction;
- a material source fingerprint change; and
- publication, product generation, or user-facing reliance involving a volatile framework.

For the current catalog, the California AI Transparency Act and SB 1000 status, the access-limited New York sources, EU transition and amendment overlays, and the distinction between FTC nonbinding guidance and binding law require special care.

## Cadence, retention, and evidence hygiene

- Low volatility: review on the approved periodic schedule.
- Medium volatility: review after a relevant official update and on schedule.
- High volatility: recheck immediately before publication, sign-off, product generation, or user-facing reliance.

Immediate triggers override a future nominal due date. Keep approved records, source logs, content fingerprints, relevant run URLs or IDs, and supersession links with the released artifact and manifest. Because the repository is public, do not store credentials, private account data, sensitive screenshots, identity documents, or a scanned signature; use a typed attestation and redacted evidence references.
