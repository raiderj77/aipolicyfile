# Official-source human review packet — August 29, 2026

## Purpose and review boundary

This packet prepares the five implemented legal-framework records for a substantive human source review. It is an AI-assisted comparison, not legal advice, not attorney review, and not evidence that a human reviewer approved any claim.

The governing process is `docs/legal-source-review-governance.md`. The separate human-owned completion record is `docs/legal-review/reviews/source-review-record-2026-08-29.md`. This packet is preparatory evidence only; checking or signing this packet does not replace the dated completion record and separate site-owner metadata authorization.

- **Official-source retrieval date:** August 29, 2026 (America/Los_Angeles).
- **Implemented baseline:** `src/lib/laws.ts`, source catalog `legal-catalog-2026-08-29.3`, checker `checker-2026-08-29.1`.
- **Correction baseline:** `src/lib/corrections.ts`, including the three corrections dated August 29, 2026.
- **Existing substantive human-review date:** August 2, 2026.
- **Existing next-review due date:** August 9, 2026.
- **Existing automated-source-check date:** August 29, 2026.
- **Configured reviewer identity:** Jason Ramirez (site owner; not an attorney).

This packet deliberately does **not** change the August 2 review date, the August 9 due date, or any framework's overdue state. A human reviewer must resolve the open items below, document the decision, and separately authorize any review-metadata change.

### Implemented-record map

- Review dates, versions, reviewer metadata, and all five framework records: `src/lib/laws.ts`.
- August 29 correction records: `src/lib/corrections.ts`.

## Current review gate

| Framework | Implemented substantive review state | Automated-source state | Packet conclusion |
| --- | --- | --- | --- |
| FTC Endorsement Guides and Section 5 | Last human review August 2; due August 9; overdue | Passed in catalog metadata | Core claims are supported and catalog `.3` expressly separates nonbinding Part 255 from binding adjacent Part 465; human confirmation is still required. |
| EU AI Act Article 50 | Last human review August 2; due August 9; overdue | Passed in catalog metadata | Core claims and the August 29 Article 50(7) correction are supported; catalog `.3` enumerates the paragraph-specific qualifications identified by this packet, subject to human confirmation. |
| New York GBL § 396-b | Last human review August 2; due August 9; overdue | `access_limited` | The enacted-role and advertising-medium correction is supported. Catalog `.3` records the two observed legislative 403s and unobserved Governor-page allowlist warning exactly; unattended coverage remains incomplete. |
| California B.O.T. Act | Last human review August 2; due August 9; overdue | Passed in catalog metadata | The core applicability and August 29 enforcement correction are supported; catalog `.3` states the bot/online definitions and § 17942(c) qualification, subject to human confirmation. |
| California AI Transparency Act | Last human review August 2; due August 9; overdue | Passed in catalog metadata | Current codified duties are supported; catalog `.3` includes the broadband and telecommunications exclusions. SB 1000 remains a material, passed-but-not-chaptered urgency amendment and must be checked again immediately before sign-off. |

**Human-review gate:** unresolved. Do not represent this packet, the automated checks, or the August 29 corrections as a completed substantive human review.

## 1. FTC Endorsement Guides and Section 5

### Implemented claim comparison

| Claim area | Implemented claim | Official-source comparison | Review result |
| --- | --- | --- | --- |
| Status | `current_interpretive_guides_and_binding_adjacent_rule` | 16 CFR Part 255 remains a current set of administrative interpretations of FTC Act § 5. It expressly provides a basis for voluntary compliance and is not a standalone rule. 16 CFR Part 465 is a separate, binding trade regulation rule and does not amend Part 255. | Supported, provided the UI keeps “adjacent rule” visibly separate from the Guides. |
| Dates | Guides finalized June 29, 2023; published and effective July 26, 2023. Part 465 effective October 21, 2024. | The FTC announced finalization on June 29, 2023; the Federal Register states an effective date of July 26, 2023. The Part 465 final rule became effective October 21, 2024. The live eCFR title was current through August 27, 2026 when retrieved. | Supported. |
| Scope | Advertising endorsements with a material connection; context and consumer understanding are case-specific. | Part 255 applies Section 5 principles to advertising messages consumers are likely to understand as another party's opinion, belief, finding, or experience. Material-connection disclosure turns on likely effect on weight or credibility and whether the audience reasonably expects the connection. | Supported. |
| Roles | Advertisers, endorsers, and intermediaries involved in endorsements. | §§ 255.1(d)-(f) separately address advertiser, endorser, and specified intermediary responsibility. | Supported. |
| Definitions | “Endorsement” depends on likely consumer understanding; a material connection may affect weight or credibility and may not be expected. | §§ 255.0(b), 255.0(f), and 255.5(a) support those summaries. “Clear and conspicuous” is difficult to miss and understandable to ordinary consumers, with medium- and audience-specific requirements. | Supported; the current guide is intentionally summarized rather than exhaustive. |
| Major exceptions and qualifications | No general Part 255 disclosure duty arises solely from AI assistance; disclosure need and presentation are context- and audience-specific; examples are not universal safe harbors. | The reviewed Part 255 text contains no independent AI-assistance label mandate. It treats fabricated or virtual endorsers within endorsement analysis, but the legal trigger remains deception/endorsement analysis rather than AI use alone. § 255.0 states that examples do not address every issue and that outcomes depend on facts. | Supported as a carefully bounded negative claim about the reviewed Part 255 sources; it must not be generalized to other federal or state law. |
| Duties | Disclose an unexpected material connection clearly and conspicuously; keep endorsements honest and claims nondeceptive; do not invent a separate AI label under this guide. | §§ 255.1 and 255.5 support the first two statements. The third accurately distinguishes this framework from AI-specific statutes. | Supported. |
| Penalty | The Guides do not themselves have force of law or impose a fixed per-post fine; remedies depend on Section 5, facts, orders/notices, and enforcement path. | Part 255 calls itself administrative interpretation. FTC staff guidance likewise says the Guides themselves lack force of law, while inconsistent practices may lead to Section 5 enforcement. Part 465 can independently support civil penalties for knowing rule violations. | Supported. Do not imply that Part 465 creates a universal penalty for every Part 255 inconsistency. |

### Official sources

All links below were retrieved or independently confirmed from the issuing federal source on August 29, 2026.

| Implemented source | Binding/status comparison | Retrieval note |
| --- | --- | --- |
| [15 U.S.C. § 45 (GovInfo)](https://www.govinfo.gov/link/uscode/15/45) | Binding federal statute; correct source for the Section 5 foundation. | Current official GovInfo code PDF opened. |
| [16 CFR Part 255, Endorsement Guides (eCFR)](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255) | Current administrative interpretive guides, not a standalone binding rule. | eCFR displayed title current through August 27, 2026; Part 255 source remains 88 FR 48102, July 26, 2023. |
| [FTC staff Q&A](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Current nonbinding staff guidance; no safe harbor. | Opened; it expressly describes case-specific analysis and the Guides' lack of independent force of law. |
| [Revised Guides final publication, 88 FR 48092](https://www.federalregister.gov/d/2023-14795) | Official final publication of the interpretive guides. | Opened; effective July 26, 2023. |
| [16 CFR Part 465, Consumer Reviews and Testimonials Rule](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465) | Binding adjacent rule, effective October 21, 2024; it does not amend Part 255. | Opened in current eCFR. |
| [FTC June 29, 2023 finalization announcement](https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements) | Supplemental official support for the implemented June 29 finalization date. | Opened through the official FTC site. |

### Human decisions still required

1. Confirm that the combined status label cannot be read as saying the Endorsement Guides themselves are binding.
2. Confirm that the no-AI-only-duty sentence remains expressly limited to Part 255 and does not imply that an AI-assisted endorsement is exempt from Section 5, Part 465, or state AI-disclosure law.
3. Confirm that Part 465 belongs in this framework as an “adjacent” source rather than a duty or penalty source for every endorsement.

## 2. EU AI Act Article 50

### Implemented claim comparison

| Claim area | Implemented claim | Official-source comparison | Review result |
| --- | --- | --- | --- |
| Status | `in_force_and_generally_applicable` | Regulation (EU) 2024/1689 is in force, and Article 50 generally applies from August 2, 2026. Regulation (EU) 2026/1744 is also in force. | Supported. |
| Dates | Base act adopted June 13, 2024, published July 12, effective August 1; generally applicable August 2, 2026. Amendment adopted July 8, 2026, published July 24, effective July 27. Narrow Article 50(2) transition ends December 2, 2026. | The official acts and current consolidated text support each date. New Article 111(4) applies only to providers of covered synthetic-content systems placed on the market before August 2, 2026 and only delays Article 50(2) compliance to December 2, 2026. | Supported. |
| Scope | EU, including certain third-country providers/deployers where system output is used in the Union; public EU accessibility alone is not a complete test. | Article 2(1)(a)-(c) supports Union and specified third-country scope. Article 2 also includes additional exclusions and qualifications, so the warning against treating accessibility as the whole test is sound. | Supported. |
| Roles | Providers and deployers. | Article 3 separately defines provider and deployer. Article 50(1)-(2) imposes provider duties; Article 50(3)-(4) imposes deployer duties. | Supported. |
| Definitions/categories | Distinct provider/deployer roles; separate categories for direct interaction, machine-readable marking, emotion/biometric systems, deepfakes, and public-interest text. | Articles 3 and 50 support this structure. The implemented text avoids collapsing provider marking into deployer labelling. | Supported. |
| Major exceptions and qualifications | Catalog `.3` separately states Article 50(1)'s obviousness and qualified law-enforcement language; Article 50(2)'s standard-editing/no-substantial-alteration and law-enforcement qualifications; Article 50(3)'s qualified law-enforcement language; Article 50(4)'s law-enforcement, limited artistic-work disclosure mode, and public-interest-text editorial-control qualification; and Article 111(4)'s narrow transition. | The official text supports these category-specific summaries and the express warning that artistic, creative, satirical, or fictional content is not subject to a blanket exemption. | Supported as a concise inventory, subject to human confirmation that the compression remains clear and complete enough for the educational product. |
| Duties | Provider first-interaction notice; provider machine-readable marking; deployer emotion/biometric notice; deployer deepfake/public-interest text disclosure; only paragraph (2) has the December transition. | Article 50(1)-(5) and Article 111(4) support the division and transition statement. | Supported. |
| Penalty | Article 99 sets maximum administrative-fine tiers; exact tier/amount, SME treatment, and enforcement depend on obligation and facts. | Article 99(4)(g) specifically includes Article 50 and provides a maximum of EUR 15 million or, for an undertaking, 3% of prior-year worldwide turnover, whichever is higher; SME rules use the lower ceiling, and the 2026 amendment adds small-mid-cap treatment. Member States establish enforcement rules within the Regulation's terms. | Supported and conservative. The UI must not display the maximum as an automatic or expected fine. |

### Official sources

All links below were retrieved or independently confirmed from EUR-Lex or the European Commission on August 29, 2026.

| Implemented source | Binding/status comparison | Retrieval note |
| --- | --- | --- |
| [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng) | Binding base regulation, in force. | Confirmed against official CELEX 32024R1689 and the Official Journal text. |
| [Regulation (EU) 2026/1744](https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng) | Binding amending regulation, in force since July 27, 2026. | Confirmed against official CELEX 32026R1744; it replaces Article 50(7) and adds Article 111(4). |
| [Consolidated Regulation as of July 27, 2026](https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng) | Current documentation copy; non-authentic and not a substitute for the Official Journal acts. | Confirmed against CELEX 02024R1689-20260727. |
| [Commission Article 50 guidelines](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems) | Current nonbinding guidelines, published July 20, 2026. | Official Commission page opened; it states Article 50 obligations apply from August 2, 2026. |
| [Code of Practice on Transparency of AI-generated Content](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content) | Voluntary code; does not replace Article 50 or the guidelines. | Official Commission page opened; final code published June 10, 2026. |
| [Commission adequacy opinion C(2026) 4839 final](https://ec.europa.eu/newsroom/dae/redirection/document/130913) | Formal Commission adequacy assessment, not conclusive proof of compliance. | Confirmed through the Commission's official opinion landing page and download. |
| [European AI Board adequacy assessment](https://ec.europa.eu/newsroom/dae/redirection/document/130916) | Formal Board assessment. | Confirmed through the same official Commission landing page and download. |
| [Commission opinion landing page](https://digital-strategy.ec.europa.eu/en/library/commission-opinion-assessment-code-practice-transparency-ai-generated-content) | Supplemental official explanation of the two adequacy assessments. | Opened; it states adequacy for Article 50(2), (4), and (5), while adherence is not conclusive evidence of compliance. |

### August 29 correction confirmed

The correction in `src/lib/corrections.ts` is supported: Regulation 2026/1744 did more than create a narrow transition. It also replaced Article 50(7), under which the Commission facilitates Union-level codes and assesses adequacy. The Commission and AI Board assessed the voluntary Code as adequate for Article 50(2), (4), and (5), but expressly did not make adherence conclusive proof of compliance.

### Human decisions still required

1. Confirm catalog `.3`'s enumeration of the obviousness, standard-editing/no-substantial-alteration, and law-enforcement qualifications against the controlling text.
2. Confirm that artistic/creative/satirical/fictional content is described as a limited manner of disclosure, not a blanket exemption.
3. Confirm that the Article 111(4) transition is never presented as postponing Article 50(1), (3), (4), or (5).
4. Confirm that voluntary Code adherence is presented as an accepted compliance route whose adequacy is formally recognized, not a safe harbor or conclusive compliance determination.

## 3. New York synthetic-performer advertising law, GBL § 396-b

### Implemented claim comparison

| Claim area | Implemented claim | Official-source comparison | Review result |
| --- | --- | --- | --- |
| Status | `in_force` | S.8420-A was signed as Chapter 617 on December 11, 2025. The current codified § 396-b includes the enacted language. | Supported. |
| Dates | Effective June 9, 2026, 180 days after enactment; codified text viewed as revised June 12, 2026. | S.8420-A states a 180-day effective period, and the Governor's June 9 announcement confirms the law was then in effect. The Senate codified page identifies its most recent revision as June 12, 2026. | Supported. |
| Scope | Person dealing in property or services who, for commercial purpose and with actual knowledge, produces or creates a covered advertisement using a synthetic performer, subject to definitions/exclusions. | Subdivision 3 contains those elements. The “actual knowledge” condition in enacted S.8420-A and the codified law attaches to the person who produces or creates the advertisement. | Supported. |
| Roles | Producer or creator of a covered commercial advertisement. | Subdivision 3 supports this role. It does not impose the earlier bill's conditional responsibility on the publishing/disseminating medium. | Supported. |
| Definitions | Synthetic performer covers specified digitally created, reproduced, or modified audiovisual and/or visual performance assets meant to appear as a nonidentifiable human performer; coverage also depends on role, advertisement, purpose, and knowledge. | Subdivision 1(c) and subdivision 3 support the summary. Audio-only advertising is separately excluded. | Supported. |
| Major exceptions | Expressive-work promotion when consistent with the work; audio ads; translation-only uses; advertising media that publish or disseminate. | Subdivisions 4, 7, and 8 support each item. Subdivision 8 is broad on its face and contains none of the original bill's notice, cure, or anti-removal clauses. | Supported as a source-text summary. Application of the medium exclusion to a specific business model remains a legal judgment. |
| Duty | Conspicuously disclose in the advertisement that a synthetic performer is present, when the statutory elements are met. | Subdivision 3 supports this duty. | Supported. |
| Penalty | $1,000 first violation; $5,000 subsequent violation. | Subdivision 3 states those civil penalties. | Supported. |

### Official sources and access state

All three official pages were manually opened through an official-state web route on August 29, 2026. That manual success does not establish reliable unattended automation.

| Implemented source | Binding/status comparison | Retrieval and automation note |
| --- | --- | --- |
| [Current New York GBL § 396-b](https://www.nysenate.gov/legislation/laws/GBS/396-B) | Binding codified statute; current page shows revision June 12, 2026. | Manual official page opened. The repository's direct automated request received HTTP 403 and remains access-limited. |
| [S.8420-A enacted bill](https://www.nysenate.gov/legislation/bills/2025/S8420/amendment/A) | Enacted amendment, Chapter 617 of the Laws of 2025. | Manual official page opened and the active amendment text was checked. The repository's direct automated request received HTTP 403 and remains access-limited. |
| [Governor's June 9 effective-date announcement](https://www.governor.ny.gov/news/governor-hochul-announces-first-nation-law-requiring-disclosure-when-advertisements-include-ai) | Official explanatory source confirming the effective date; not the controlling statutory text. | Manual page opened. In the latest checker run, the allowlisted access block was **not** observed, so the automation allowlist/metadata needs review. |

### August 29 correction confirmed

The active S.8420-A text and current codified law omit the original S.8420 clauses that would have made a publishing/disseminating medium conditionally responsible after written notice and a cure period and that would have prohibited removal or alteration of a disclosure. Current subdivision 8 instead excludes an advertising medium by which the violating advertisement is published or disseminated. Current subdivision 3 places actual knowledge on the producer/creator. The correction is therefore supported.

### Exact automation limitation

The catalog `.3` `automatedSourceCheckNote` now matches the August 29 checker evidence:

- § 396-b: HTTP 403, access-limited.
- S.8420-A: HTTP 403, access-limited.
- Governor announcement: the expected/allowlisted block was not observed; the allowlist or metadata should be reviewed.

Accordingly, the framework remains correctly classified `access_limited`. Manual opening of the pages is useful review evidence, not a substitute for an unattended source monitor.

### Human decisions still required

1. Confirm the corrected role and broad subdivision 8 medium exclusion against the **active S.8420-A** section, not the original bill text shown earlier on the same long page.
2. Determine whether the medium exclusion needs a clearer product explanation so users do not confuse a pure publisher/disseminator with a person that also produces or creates the ad.
3. Approve a durable evidence procedure for the two 403 sources, such as a dated manual official-page/PDF check with recorded document identity and hash, without claiming full automation.
4. Confirm that the corrected catalog `.3` note remains exact and decide whether the Governor-page allowlist should be removed or revised.

## 4. California B.O.T. Act, BPC §§ 17940-17943

### Implemented claim comparison

| Claim area | Implemented claim | Official-source comparison | Review result |
| --- | --- | --- | --- |
| Status | `in_force` | Chapter 6 was enacted by SB 1001, Chapter 892 of 2018, and remains in the current code. | Supported. |
| Dates | Effective January 1, 2019; operative July 1, 2019. | §§ 17941 and 17943 and the chaptered bill support both dates. | Supported. |
| Scope | Online communication with a person in California, intent to mislead about artificial identity, knowing deception about content, and commercial purchase/sale or election purpose. | § 17941(a) contains all of these elements. They must be evaluated together. | Supported. |
| Roles | Person using a bot for a covered online communication. | § 17941 applies to “any person”; § 17940(d) defines person broadly. | Supported. |
| Definitions | Catalog `.3` states that a bot is an automated online account where all or substantially all actions/posts are not the result of a person; it also states the public-facing internet/web/digital-application limit for “online” and warns against inferring coverage from a chatbot label alone. | §§ 17940(a)-(b) support the summary. | Supported, subject to human confirmation of the compressed wording. |
| Major exceptions and qualifications | No liability under this section when the person makes the prescribed clear/conspicuous bot disclosure; § 17942(c) says the chapter imposes no duty on online-platform service providers, including web-hosting and internet-service providers; other laws remain unresolved. | §§ 17941(a)-(b), 17942(a), and 17942(c) support these statements. | Supported, subject to human confirmation. |
| Duty | Review whether all elements are present; if covered, use a clear, conspicuous disclosure reasonably designed to inform the person that it is a bot. | § 17941 supports this formulation. | Supported. |
| Penalty | No fixed per-message fine or remedial schedule appears in § 17941; consequences depend on other law, enforcement path, and facts. | Current § 17941 and chaptered SB 1001 state no fixed civil penalty or chapter-specific remedial schedule. | Supported and appropriately cautious. |

### Official sources

All links below were retrieved from the California Legislature on August 29, 2026.

| Source | Binding/status comparison | Retrieval note |
| --- | --- | --- |
| [BPC § 17941](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941) | Binding current duty and disclosure provision. | Implemented canonical URL; opened successfully. |
| [Chaptered SB 1001](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001) | Enacted source for Chapter 6; approved and filed September 28, 2018. | Implemented canonical URL; official page returned the chaptered text. |
| [BPC § 17940](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17940) | Binding definitions for bot, online, online platform, and person. | Supplemental direct source opened; its content is also present in chaptered SB 1001. |
| [BPC § 17942](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17942) | Binding cumulative-law, severability, and platform-service-provider provisions. | Supplemental direct source opened; its content is also present in chaptered SB 1001. |
| [BPC § 17943](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17943) | Binding operative-date provision. | Supplemental direct source opened. |

### August 29 correction confirmed

The correction removing an asserted tie between § 17941 and California unfair-competition law is supported. Neither § 17941 nor chaptered SB 1001 states that linkage, a fixed per-message fine, or a chapter-specific remedial schedule. The revised text properly leaves other law and enforcement paths unresolved.

### Human decisions still required

1. Confirm catalog `.3`'s actual § 17940 bot and online definitions, including that the statutory term is an automated **online account**, not necessarily every chatbot or automated customer-service exchange.
2. Confirm catalog `.3`'s statement of § 17942(c)'s no-duty rule for online-platform service providers.
3. Confirm that “no fixed fine in the cited chapter” is not presented as “no enforcement risk.”

## 5. California AI Transparency Act, BPC §§ 22757-22757.6

### Implemented claim comparison

| Claim area | Implemented claim | Official-source comparison | Review result |
| --- | --- | --- | --- |
| Status | `in_force_with_staged_duties_and_pending_amendment` | Chapter 25 is in the current code and operative. SB 1000 has passed both houses and was ordered to engrossing and enrolling, but the official status page does not show chaptering or gubernatorial action. | Supported as of retrieval. This status is highly unstable. |
| Dates | Chapter operative August 2, 2026; large-platform and hosting-platform duties January 1, 2027; capture-device duties January 1, 2028. | §§ 22757.3.1(c), 22757.3.2(b), 22757.3.3(c), and 22757.6 support these dates. | Supported. |
| Scope | Covered providers and affected licensees; defined large online platforms and GenAI hosting platforms beginning in 2027; capture-device manufacturers for specified devices beginning in 2028. | Current definitions and operative provisions support each role. | Supported. |
| Roles | Covered providers, affected third-party licensees, large online platforms, GenAI system hosting platforms, capture-device manufacturers. | §§ 22757.1-22757.3.3 support those role categories. | Supported. |
| Definitions | Each role has its own definition/threshold/date; ordinary use of a third-party AI tool alone does not establish a regulated role. | Current § 22757.1 defines the roles. A covered provider currently requires a publicly accessible California GenAI system with over 1,000,000 monthly visitors/users. A large online platform currently requires more than 2,000,000 unique monthly users during the preceding 12 months. | Supported under current law. |
| Major exceptions and qualifications | Exclusive specified non-user-generated entertainment experiences are excluded; assembly-only businesses are excluded from capture-device manufacturer; catalog `.3` also states the broadband-internet-access and telecommunications-service exclusions from the large-online-platform definition. | Current § 22757.5 and § 22757.1 support each item. | Supported, subject to human confirmation. |
| Duties | Current provider detection-tool, manifest-option, latent-disclosure, privacy, and licensing duties; 2027 platform/hosting duties; 2028 device duties; licensee cease-use after revocation. | Current §§ 22757.2-22757.3.3 support the staged summary. The detection tool cannot output personal provenance data and is subject to data minimization/retention restrictions. | Supported under current law. |
| Penalty | $5,000 civil penalty per violation; each day is a discrete violation for covered providers, large online platforms, and capture-device manufacturers; separate licensee remedy. | Current § 22757.4 states each point, including injunctive relief and fees/costs for the specified licensee violation. | Supported. |

### Official sources

All links below were retrieved from the California Legislature on August 29, 2026.

| Implemented source | Binding/status comparison | Retrieval note |
| --- | --- | --- |
| [Current BPC Division 8, Chapter 25](https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=25.&division=8.&lawCode=BPC&part=&title=) | Binding current codified law, including SB 942 as amended by AB 853. | Opened; current thresholds, staged dates, privacy duties, exceptions, and penalties were checked. |
| [SB 1000 official status](https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000) | Pending urgency bill; **not current law and not shown as chaptered**. | Live status retrieved August 29. Last listed action: August 27, Assembly amendments concurred in, ordered to engrossing and enrolling. House location: Senate. Status: active bill—passed. |
| [SB 1000 current bill text](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB1000) | Passed Legislature text, not current law unless chaptered. | August 21 amended text opened to identify the material proposed changes below. |
| [AB 853 chaptered amendment](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB853) | Enacted amendment, Chapter 674 of 2025. | Official chaptered source opened/confirmed. |
| [SB 942 chaptered base act](https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942) | Enacted base act, Chapter 291 of 2024. | Official chaptered source opened/confirmed. |

### Exact SB 1000 status and consequence

As of the August 29 retrieval, SB 1000 has passed the Legislature but is only shown as ordered to engrossing and enrolling. The official page does **not** show that it has been enrolled, presented to the Governor, signed, filed with the Secretary of State, or chaptered. The implemented decision to retain current codified law and label the bill “passed_legislature_not_chaptered” is therefore correct.

The bill is an urgency measure and says it would take effect immediately if enacted. Its passed text would materially change the product's current claims, including:

- removing the current 1,000,000 monthly visitor/user threshold from “covered provider”;
- replacing “AI detection tool” with “disclosure verification tool” and changing privacy/output rules;
- removing the existing manifest-disclosure option requirement;
- adding “minor modification” and assistive-technology concepts;
- changing latent-disclosure contents and technical standards language;
- changing provider/licensee notice, termination, reporting, and cure mechanics;
- narrowing § 22757.5's permanent entertainment exclusion to exclusively non-user-generated video games, while creating a temporary assistive-technology exclusion before 2029; and
- adding a temporary $50,000-per-violation civil-penalty provision for false assistive-technology representations.

Until chaptered, none of those proposed changes should replace the current codified claims. If it is chaptered, the catalog's status, threshold, definitions, duties, exceptions, penalty, and sources require immediate substantive revision.

### Human decisions still required

1. Reopen the official SB 1000 status and history immediately before reviewer sign-off, again immediately before owner metadata authorization, and once more before final artifact publication or sales activation. Do not rely on the August 27 action or this August 29 packet after any later official action.
2. If SB 1000 is chaptered, stop relying on the existing California record until the enrolled/chaptered text is compared with the passed text and every affected field is revised.
3. Confirm catalog `.3`'s inclusion of the broadband-access and telecommunications exclusions in the large-online-platform definition.
4. Confirm that the present covered-provider threshold and manifest-option duty are clearly identified as current law that may change quickly, not durable product promises.

## August 29 correction audit

| Correction | Official comparison | Packet result |
| --- | --- | --- |
| New York: removed written-notice/cure and anti-removal clauses; corrected producer/creator knowledge role and broad medium exclusion. | Active S.8420-A and current § 396-b omit those original-bill clauses and contain the corrected role/exclusion. | Supported; still awaiting substantive human review. |
| California B.O.T. Act: removed unsupported unfair-competition enforcement linkage and fixed-fine implication. | Current § 17941 and chaptered SB 1001 state neither the linkage nor a chapter-specific fine/remedial schedule. | Supported; still awaiting substantive human review. |
| EU Article 50(7): added the amended code mechanism and formal adequacy assessments, with no conclusive-compliance claim. | Regulation 2026/1744 replaces Article 50(7); Commission and Board documents find the Code adequate for Article 50(2), (4), and (5) but not conclusive evidence of compliance. | Supported; still awaiting substantive human review. |

No correction record claims attorney review, saved customer documents, or an identifiable stored-output population. This packet does not change those statements.

## Unresolved-item register

| ID | Priority | Exact unresolved item | Required owner/human-review disposition |
| --- | --- | --- | --- |
| U-01 | P0 | All five frameworks remain past the August 9 substantive-review due date; an August 29 automated check is not human review. | Complete or reject a substantive official-source review. Do not update review dates merely because this packet exists. |
| U-02 | P0 | SB 1000 is passed, not chaptered on the retrieved page, and would take effect immediately if enacted while rewriting multiple current claims. | Recheck official status at sign-off. If chaptered, suspend the current California summary until the chaptered text is integrated and reviewed. |
| U-03 | P0 | New York automation remains incomplete: two official legislative pages return 403, while the Governor page no longer produces the allowlisted block. Catalog `.3` corrects the stored note, but unattended coverage remains partial. | Approve a dated manual-source evidence procedure and decide whether to revise the Governor-page allowlist. Do not claim full automated coverage. |
| U-04 | P1 | Catalog `.3` now enumerates the material EU Article 50(1)-(4) qualifications and clarifies limited artistic-work disclosure versus exemption. | Human reviewer must compare and accept, change, or reject the new summaries. |
| U-05 | P1 | Catalog `.3` now states the California B.O.T. Act's automated-online-account definition and § 17942(c) platform-service-provider no-duty provision. | Human reviewer must compare and accept, change, or reject the new summaries. |
| U-06 | P1 | Catalog `.3` now includes the broadband/telecommunications exclusions within “large online platform.” | Human reviewer must compare and accept, change, or reject the new summary. |
| U-07 | P2 | Catalog `.3` now expressly separates nonbinding Part 255 and the distinct binding Part 465 rule. | Human reviewer must confirm that the presentation cannot imply Part 255 itself is binding or that Part 465 penalties attach to every Guide inconsistency. |

## Canonical review and authorization record

This packet is comparison evidence only. It is not a signable review path and cannot clear the overdue gate. Complete all human source-verification details, framework and correction dispositions, the reviewer attestation, the separate owner authorization, and the two pre-authorization SB 1000 checks only in `docs/legal-review/reviews/source-review-record-2026-08-29.md` under `docs/legal-source-review-governance.md`.

If a critical source cannot be verified or the implemented interpretation remains materially uncertain after direct source comparison, leave the gate closed and escalate to qualified counsel before approval.
