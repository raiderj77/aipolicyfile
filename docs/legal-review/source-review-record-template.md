# Legal source review record

**Record status:** DRAFT — NOT APPROVED  
**SOP version:** 1.0  
**Review cycle ID:**  
**Signed registry record ID:**  
**Review trigger:**  
**Classification:** Minor / Moderate / Substantive / Critical  
**Scope:**  
**Prepared comparison baseline commit:**  
**Prepared comparison legal-content SHA-256:**  
**Final reviewed commit:**  
**Final legal-content SHA-256:**  
**Source catalog version:**  
**Checker version:**  
**Template versions:**  
**Correction IDs in scope:**  
**Supersedes record:** None / record ID  

## Existing metadata — read only until owner authorization

**Existing last human review date:**  
**Existing next review due:**  
**Existing reviewer label:**  
**Existing public state:**  

Do not edit canonical metadata from this section. Complete the human review and the separate owner authorization below first.

## Framework review records

Create one subsection for every framework in scope.

### [Framework name] (`[framework ID]`)

**Jurisdiction:**  
**Implemented status label:**  
**Packet or comparison reference:**  

- [ ] I personally opened the controlling official source.
- [ ] I did not rely only on a packet, snippets, cached text, or automation.
- [ ] I confirmed source identity, title/citation, current version, and date.
- [ ] Status and binding effect reviewed.
- [ ] Effective and operative dates reviewed.
- [ ] Jurisdiction and scope reviewed.
- [ ] Regulated roles and applicability signals reviewed.
- [ ] Definitions reviewed.
- [ ] Major exceptions and qualifications reviewed.
- [ ] Required duties and actions reviewed.
- [ ] Penalty and remedy wording reviewed.
- [ ] Pending amendment and transition rules reviewed.
- [ ] Binding law is separated from nonbinding guidance.
- [ ] The summary does not overstate certainty or create a safe harbor.
- [ ] Sample language and template impact reviewed.
- [ ] Recent corrections and source-access limitations reviewed.

Choose exactly one:

- [ ] Accept as written
- [ ] Accept with listed changes
- [ ] Reject / escalate

**Reviewer notes:**  
**Listed changes or escalation:**  
**Follow-up owner and due/trigger:**  

## Source verification log

Create one row for every implemented official source. Automated fields may be prefilled; the named human opener, timestamp, method, conclusion, and completion box must remain blank until that person performs the review.

| Framework / source ID | Official URL, citation, and source role | Prior automated observation | Human opener, ISO timestamp/time zone, manual method, version/date, access behavior, evidence/hash reference, conclusion, recheck trigger/date | Human complete |
| --- | --- | --- | --- | --- |
|  |  |  |  | [ ] |

Completed synthetic format example only: `Example Reviewer; 2026-08-30T08:00:00-07:00; manually opened official HTML; version dated 2026-08-29; HTTP 200; evidence GOV-EXAMPLE-01; conclusion: current text matches implementation; recheck on amendment or next due date.` Do not copy the example as evidence.

## Pending-changes tracker

| ID | Severity | Framework / binding status | Description and official evidence | Affected fields/artifacts | Required action, owner, and due/trigger | Disposition | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  | Open |

No P0 item may remain open when the owner authorizes a clear public state.

**Tracker status:** Open — not resolved for sign-off.

## Correction dispositions

Create one subsection per correction and choose exactly one disposition.

### `[correction ID]`

- [ ] Accept as written
- [ ] Accept with listed changes
- [ ] Reject / escalate

**Notes and affected artifacts:**  

## Implemented changes and post-change rechecks

Use one row for each framework or correction marked “Accept with listed changes.” The disposition ID must be `framework:<framework ID>` or `correction:<correction ID>`.

| Disposition ID | Implementation reference | Human verifier | Post-change recheck timestamp/time zone | Result |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## Volatile and access-limited source resolutions

**Reviewer live pending-bill check — official URL, exact timestamp/time zone, status, version, conclusion, and evidence immediately before reviewer sign-off:**  
**SB 1000 reviewer registry outcome:** [status enum | checked-at timestamp | verifier | evidence reference]  

**Access-limited source, exact behavior, manual verification method/evidence, and future-monitoring decision:**  
**Access-limited resolution — [source ID]:** [framework ID | manual verifier | verified-at timestamp | method | evidence reference | monitoring-decision enum]  
**Automation allowlist decision — [source ID]:** [framework ID | decision enum | rationale | evidence reference]  

## Reviewer sign-off

- [ ] I personally completed every framework review and source-log entry above.
- [ ] I selected exactly one disposition for each framework and correction.
- [ ] I reviewed pending changes, source-access issues, and sample/template impact.
- [ ] I resolved SB 1000 status immediately before signing.
- [ ] Listed changes were implemented and retested against the final commit and fingerprint below, or the record remains rejected/escalated.
- [ ] I understand automation prepared this record but did not perform or sign the review.

**Overall reviewer decision:** Accept as written / Accept with listed changes / Reject or escalate  
**Reviewer name:**  
**Reviewer typed signature:**  
**Reviewer role/qualification:**  
**Reviewer signed at:**  

## Site-owner decision and metadata authorization

**Owner live pending-bill recheck — official URL, exact timestamp/time zone, status, version, conclusion, and evidence immediately before metadata authorization:**  
**SB 1000 owner registry outcome:** [status enum | checked-at timestamp | verifier | evidence reference]  

- [ ] I reviewed the completed reviewer record and all unresolved items.
- [ ] I rechecked the live official SB 1000 status immediately before this authorization and recorded it above.
- [ ] I authorize the exact metadata below for the reviewed content and no other version.
- [ ] I understand an immediate trigger can make the content stale before the nominal due date.

**Owner decision:** Accept / Accept with conditions / Reject or escalate  
**Owner name:**  
**Owner role:**  
**Authorized last substantive human review date:**  
**Authorized next review due:**  
**Cadence basis:**  
**Public overdue state:** May clear / Must remain  
**Unresolved conditions:**  

## Registry-binding summary — generate after reviewer sign-off and before owner signature

Automation may prepare this section only from the completed fields above. It may not choose values or sign. The owner must verify the final values and annex before signing below.

**Registry overall decision:**  
**Registry framework disposition — ftc:**  
**Registry framework disposition — euArt50:**  
**Registry framework disposition — nySynthetic:**  
**Registry framework disposition — caBot:**  
**Registry framework disposition — caSb942:**  
**Registry correction disposition — [correction ID]:**  

The machine-readable `LEGAL_REVIEW_BINDING_V1` annex must exactly bind the final record, all official-source verification entries, access-limited resolutions, automation-allowlist decisions, both volatile-source checks, implemented changes, confirmations, versions, commit, fingerprint, decisions, and authorized metadata. It excludes the owner signature and authorization timestamp, which are recorded immediately below after the owner verifies the annex. The final evidence hash binds those visible fields after signature. Do not edit an approved record afterward.

<!-- LEGAL_REVIEW_BINDING_V1_START
Replace this line with the generated JSON binding after reviewer sign-off and before owner signature.
LEGAL_REVIEW_BINDING_V1_END -->

## Final owner authorization

- [ ] I verified that the registry-binding summary and annex match the completed record and exact metadata I am authorizing.

**Owner typed signature:**  
**Owner authorized at:**  

Only after the reviewer and owner personally complete their sections may the record status be changed to `SIGNED — APPROVED FOR METADATA UPDATE` and a matching machine-readable registry entry be added. A signed rejection or escalation must instead use `SIGNED — REJECTED / ESCALATED — METADATA MUST REMAIN OVERDUE`. A registry entry alone is not approval.
