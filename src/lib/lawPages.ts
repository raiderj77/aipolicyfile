// Educational screening content is reviewed against the linked primary sources.
// The shared review date is maintained in laws.ts. These pages identify questions
// to review; they do not determine jurisdiction, legal status, or compliance.

export interface LawPageSection {
  heading: string;
  paragraphs: string[];
}

export interface LawPage {
  lawId: string;
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: LawPageSection[];
  faq: { q: string; a: string }[];
  sources: { label: string; url: string }[];
}

export const LAW_PAGES: LawPage[] = [
  {
    lawId: "ftc",
    slug: "ftc-ai-disclosure-rules",
    title: "FTC Endorsement Guides and AI-Assisted Advertising",
    metaDescription:
      "Questions to review under FTC endorsement guidance when AI-assisted advertising includes endorsements, affiliate links, gifts, or other material connections.",
    intro:
      "The FTC Endorsement Guides address truthful endorsements and connections that may affect how an audience evaluates an endorsement. The official FTC sources reviewed here do not create a general labeling rule merely because AI helped produce content.",
    sections: [
      {
        heading: "When this guidance may be relevant",
        paragraphs: [
          "Start by asking whether the message is advertising and whether consumers are likely to understand it as someone else's opinion, belief, finding, or experience. A product mention with no marketer relationship raises different questions from a paid recommendation, affiliate link, free product, employment relationship, or family connection.",
          "The FTC says context and consumer understanding matter. A connection may warrant disclosure when a significant minority of consumers would not expect it and knowing about it could affect how they evaluate the endorsement. This page cannot decide what a particular audience expects.",
        ],
      },
      {
        heading: "What AI use changes—and what it does not",
        paragraphs: [
          "Using an AI tool does not, by itself, establish that the Endorsement Guides apply or that an AI label is required. The advertising relationship, the message consumers receive, the truthfulness of the claims, and the evidence supporting those claims still need review.",
          "AI use can create separate risk if it fabricates an experience, changes an endorser's meaning, invents a testimonial, or produces an unsupported claim. A material-connection disclosure would not cure a false or misleading advertising claim.",
        ],
      },
      {
        heading: "Disclosure questions worth reviewing",
        paragraphs: [
          "If a connection needs disclosure, review whether the wording is understandable and whether people will notice it with the endorsement. Placement, format, language, device size, audio or video presentation, and platform design can all affect that assessment.",
          "Short wording such as 'Ad,' 'Paid partnership,' or 'I may earn a commission from links in this post' may communicate a relationship in some settings. It is an example, not a safe harbor; the full presentation and the actual relationship still matter.",
        ],
      },
      {
        heading: "Limits of this screening page",
        paragraphs: [
          "The Endorsement Guides are administrative interpretations rather than a standalone schedule of automatic fines. Potential remedies depend on the FTC Act, the conduct, the evidence, and the enforcement path.",
          "This page does not evaluate a real advertisement, audience research, substantiation, a platform's tools, an existing order, or another federal or state rule. Use the official sources below and obtain legal advice for a real campaign or dispute.",
        ],
      },
    ],
    faq: [
      {
        q: "Does every AI-assisted post need an FTC disclosure?",
        a: "The reviewed FTC endorsement sources do not impose a general AI-use label. Review whether the post is an endorsement, whether there is a material connection, and whether the overall message is truthful and supported.",
      },
      {
        q: "Is an affiliate link itself enough disclosure?",
        a: "Do not assume the link format tells readers that a commission may be earned. The FTC's affiliate guidance calls for a clear and conspicuous explanation of the relationship when disclosure is needed.",
      },
      {
        q: "Can a platform's paid-partnership tool solve the issue?",
        a: "A platform tool may help, but the FTC evaluates whether the resulting disclosure is actually clear and conspicuous in context. Review what users see on the relevant device and format.",
      },
      {
        q: "Does a disclosure make an unsupported claim acceptable?",
        a: "No. A relationship disclosure and claim substantiation are different issues. Endorsements still must be honest and cannot communicate claims the advertiser could not lawfully make.",
      },
    ],
    sources: [
      {
        label: "FTC Endorsement Guides: What People Are Asking",
        url: "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
      },
      {
        label: "FTC Advertisement Endorsements overview",
        url: "https://www.ftc.gov/news-events/topics/truth-advertising/advertisement-endorsements",
      },
    ],
  },
  {
    lawId: "euArt50",
    slug: "eu-ai-act-article-50",
    title: "EU AI Act Article 50: Transparency Questions to Review",
    metaDescription:
      "A source-based review of EU AI Act Article 50 roles, content categories, disclosure duties, exceptions, and the August 2, 2026 application date.",
    intro:
      "Article 50 assigns different transparency duties to providers and deployers of specified AI systems and content. A yes-or-no question about an EU audience cannot determine scope, role, content category, or an applicable exception.",
    sections: [
      {
        heading: "Start with scope and role",
        paragraphs: [
          "Article 2 includes providers placing AI systems or general-purpose AI models on the EU market, deployers located in the EU, and some providers or deployers outside the EU when the system's output is used in the Union. Applying those categories requires facts about the system, operator, market, location, and use of the output.",
          "Article 50 distinguishes providers from deployers. A provider duty to design a system or mark its output should not automatically be assigned to every person who uses a third-party tool, and a deployer duty should not automatically be assigned to the model provider.",
        ],
      },
      {
        heading: "The Article 50 categories",
        paragraphs: [
          "Paragraph 1 addresses providers of systems intended to interact directly with people. Paragraph 2 addresses provider-side machine-readable marking for systems that generate synthetic audio, images, video, or text, subject to technical-feasibility language and stated exclusions.",
          "Paragraph 3 addresses deployers of emotion-recognition and biometric-categorisation systems. Paragraph 4 addresses deployers of systems producing deepfakes and certain AI-generated or manipulated text published to inform the public on matters of public interest.",
        ],
      },
      {
        heading: "Timing, presentation, and exceptions",
        paragraphs: [
          "The Regulation generally applies from August 2, 2026. Article 50(5) says the specified information must be clear and distinguishable and provided no later than the first interaction or exposure, while also meeting applicable accessibility requirements.",
          "Regulation (EU) 2026/1744 added Article 111(4): providers of systems covered by Article 50(2) that were placed on the market before August 2, 2026 have until December 2, 2026 to comply with that paragraph. This is a narrow transition for the provider-side machine-readable marking duty; it does not postpone Article 50(1), 50(3), or 50(4), and it does not cover a relevant system first placed on the market on or after August 2, 2026.",
          "The text contains category-specific qualifications and exceptions, including language for artistic or fictional works and for certain public-interest text that undergoes human review or editorial control with identified editorial responsibility. Whether an exception fits cannot be decided from a single checker answer.",
          "The European Commission's July 2026 guidelines explain how it interprets Article 50, but the guidelines are non-binding and do not change the Regulation. The Code of Practice on marking and labelling AI-generated content is voluntary; it is an implementation aid, not a replacement for the legal text or a guarantee that a particular system complies.",
        ],
      },
      {
        heading: "Questions for a professional review",
        paragraphs: [
          "Identify the system and output, each operator's role, where the operator is established, where the output is used, the purpose of publication, and whether the content is a deepfake or public-interest text. Record any human-review process and who holds editorial responsibility.",
          "Also review other EU and national rules. Article 50(6) expressly leaves other transparency obligations unaffected, so satisfying one Article 50 step does not establish complete legal compliance.",
        ],
      },
    ],
    faq: [
      {
        q: "Does using ChatGPT for a blog post automatically trigger Article 50?",
        a: "No automatic conclusion follows from the tool name alone. Review Article 2 scope, provider or deployer role, the content category and purpose, where the output is used, and any relevant exception.",
      },
      {
        q: "Does human review always remove a text disclosure duty?",
        a: "Article 50(4) includes specific language for public-interest text involving human review or editorial control and editorial responsibility. The exact facts and the rest of the provision still need review.",
      },
      {
        q: "Are creative deepfakes completely exempt?",
        a: "Article 50 limits how the disclosure obligation operates for evidently artistic, creative, satirical, fictional, or analogous works; it does not state a universal exemption for every creative use.",
      },
      {
        q: "Does one EU-wide disclosure settle every requirement?",
        a: "Article 50 is part of an EU regulation, but other provisions and Union or national transparency rules may also matter. This page cannot determine the complete set of duties for a product or publication.",
      },
      {
        q: "Does the December 2, 2026 transition delay every Article 50 duty?",
        a: "No. Regulation (EU) 2026/1744 limits that transition to Article 50(2) for covered systems placed on the market before August 2, 2026. The amendment does not postpone paragraphs 1, 3, or 4.",
      },
    ],
    sources: [
      {
        label: "Regulation (EU) 2024/1689, including Articles 2, 50, 99 and 113",
        url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en",
      },
      {
        label: "Regulation (EU) 2026/1744, including the Article 50(2) transition",
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ%3AL_202601744",
      },
      {
        label: "European Commission guidelines on Article 50 transparency obligations",
        url: "https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems",
      },
      {
        label: "European Commission page for the voluntary Code of Practice",
        url: "https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content",
      },
    ],
  },
  {
    lawId: "nySynthetic",
    slug: "new-york-synthetic-performer-law",
    title: "New York Synthetic Performer Advertising Law",
    metaDescription:
      "Questions to review under New York's enacted synthetic-performer advertising law, including definitions, actual knowledge, exceptions, and penalties.",
    intro:
      "New York enacted S.8420-A in December 2025 to amend General Business Law Section 396-b. The law uses defined terms, an actual-knowledge standard, and several exceptions, so not every edited person or AI-assisted advertisement reaches the same result.",
    sections: [
      {
        heading: "Facts that control the screening",
        paragraphs: [
          "Review whether the material is an advertisement respecting property or services, whether it is placed before the public in New York, and whether the asset meets the enacted definition of a synthetic performer. The definition focuses on a digitally created, reproduced, or modified asset intended to create the impression of a human audiovisual or visual performance when it is not recognizable as an identifiable natural performer.",
          "The enacted disclosure provision also uses actual knowledge. A checker cannot establish what an advertiser, agent, employee, publisher, or distributor knew or when that knowledge arose.",
        ],
      },
      {
        heading: "Disclosure and penalty language",
        paragraphs: [
          "For material within the provision, the enacted text calls for a conspicuous statement in the advertisement that a synthetic performer is present. It states a civil penalty of $1,000 for a first violation and $5,000 for a subsequent violation.",
          "Those amounts should not be presented as an expected outcome. A violation still depends on the statute's definitions, knowledge requirement, coverage, and exceptions, and the site cannot predict enforcement or case results.",
        ],
      },
      {
        heading: "Exceptions and publishing-media provisions",
        paragraphs: [
          "The enacted amendment includes provisions for advertisements or promotional material tied to expressive works, audio advertisements, and uses where AI only translates a human performer. Read the exact conditions rather than treating the category name as enough.",
          "It also contains a publishing-media provision with written-notice and timing language and separately prohibits removal or alteration of an associated disclosure. Responsibility can therefore depend on the actor's role and knowledge.",
        ],
      },
      {
        heading: "What to document before relying on an answer",
        paragraphs: [
          "Keep the final advertisement, the source asset, how the asset was generated or modified, whether it resembles an identifiable person, where the advertisement ran, who received notice, and when relevant people learned how the asset was made.",
          "The statute does not replace other publicity, privacy, advertising, or platform rules. A lawyer can review the real asset and distribution facts; this page only points to issues in the enacted text.",
        ],
      },
    ],
    faq: [
      {
        q: "Does every AI-edited image count as a synthetic performer?",
        a: "The enacted definition includes specific asset, technology, intent, performance, and recognizability language. Review the actual asset and definition rather than treating every edit alike.",
      },
      {
        q: "Are audio-only advertisements covered?",
        a: "S.8420-A includes an exception for audio advertisements. Confirm that the material is actually audio-only and review the enacted text for the full context.",
      },
      {
        q: "What if the advertiser did not know AI was used?",
        a: "The disclosure provision uses an actual-knowledge standard. Evidence of knowledge is fact-specific, and this page cannot determine it.",
      },
      {
        q: "When did the law take effect?",
        a: "The bill was signed December 11, 2025 and states that it takes effect 180 days after becoming law, which is June 9, 2026.",
      },
    ],
    sources: [
      {
        label: "New York S.8420-A enacted bill and status",
        url: "https://www.nysenate.gov/legislation/bills/2025/S8420/amendment/A",
      },
      {
        label: "New York confirmation that the law took effect June 9, 2026",
        url: "https://www.governor.ny.gov/news/governor-hochul-announces-first-nation-law-requiring-disclosure-when-advertisements-include-ai",
      },
    ],
  },
  {
    lawId: "caBot",
    slug: "california-bot-disclosure-law",
    title: "California B.O.T. Act: Screening Questions",
    metaDescription:
      "Review the communication, location, intent, purpose, and disclosure elements in California Business and Professions Code Section 17941.",
    intro:
      "California Business and Professions Code Section 17941 is narrower than a rule covering every automated assistant. Its text combines communication with a person in California, intent to mislead about artificial identity, knowing deception about content, and specified commercial or electoral purposes.",
    sections: [
      {
        heading: "The elements to review together",
        paragraphs: [
          "The statute addresses use of a bot to communicate or interact online with another person in California. It then adds intent and purpose language: misleading the person about artificial identity in order to knowingly deceive about the communication's content and incentivize a commercial purchase or sale or influence an election vote.",
          "A chatbot label, California visitor, or sales context by itself does not establish every element. The communications, user location evidence, design choices, operator intent, and purpose need to be reviewed together.",
        ],
      },
      {
        heading: "What the disclosure provision says",
        paragraphs: [
          "Section 17941 says a person using a bot is not liable under that section if the person discloses that it is a bot. The required disclosure must be clear, conspicuous, and reasonably designed to inform the people with whom the bot communicates or interacts that it is a bot.",
          "The statute does not prescribe one required sentence or screen position. A sample such as 'I am an automated assistant, not a human' may be a useful starting point, but this site cannot decide whether a real presentation satisfies the standard.",
        ],
      },
      {
        heading: "What this section does not answer",
        paragraphs: [
          "Section 17941 does not provide a fixed per-message penalty in its text. Do not infer a likely dollar amount or enforcement result from this page.",
          "The section-specific disclosure protection also does not decide obligations under privacy, consumer-protection, election, accessibility, sector-specific, or other AI laws. Those issues require a separate review.",
        ],
      },
      {
        heading: "Practical records to preserve",
        paragraphs: [
          "Preserve the bot's first interaction, disclosure text and placement, relevant conversation flow, target audience and location settings, the business or electoral objective, and records explaining design decisions. These facts may help a professional evaluate the statutory elements.",
          "Do not submit those records to this checker. The checker asks only broad yes-or-no screening questions and is not designed to receive confidential or case-specific information.",
        ],
      },
    ],
    faq: [
      {
        q: "Does every customer-service chatbot fall under Section 17941?",
        a: "Not from the chatbot label alone. Review the California communication, intent, deception, and commercial or electoral purpose language in the statute.",
      },
      {
        q: "Is disclosure a safe harbor?",
        a: "The text says a person using a bot is not liable under this section if the person provides the required disclosure. That section-specific language does not resolve other laws.",
      },
      {
        q: "What wording should a bot use?",
        a: "The statute requires a clear, conspicuous disclosure reasonably designed to inform people that it is a bot, but it does not prescribe a single phrase. Context and presentation matter.",
      },
      {
        q: "When did the section become operative?",
        a: "The official code notes an effective date of January 1, 2019 and an operative date of July 1, 2019.",
      },
    ],
    sources: [
      {
        label: "California Business and Professions Code Section 17941",
        url: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941",
      },
      {
        label: "California SB 1001 chaptered bill",
        url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001",
      },
    ],
  },
  {
    lawId: "caSb942",
    slug: "california-sb-942",
    title: "California AI Transparency Act: SB 942 as Amended by AB 853",
    metaDescription:
      "A source-based review of California's current AI Transparency Act, including the SB 942 provider duties, AB 853 platform additions, staged dates, and pending SB 1000.",
    intro:
      "California's current AI Transparency Act began with SB 942 and was amended by AB 853. It assigns different duties and operative dates to covered providers, affected third-party licensees, large online platforms, GenAI hosting platforms, and capture device manufacturers. Merely using an AI tool does not by itself establish one of those roles.",
    sections: [
      {
        heading: "Covered-provider duties operative August 2, 2026",
        paragraphs: [
          "Current Business and Professions Code Section 22757.1 defines a covered provider as a person that creates, codes, or otherwise produces a generative AI system with more than 1,000,000 monthly visitors or users that is publicly accessible within California. Applying each part requires product, control, audience, and accessibility evidence.",
          "An ordinary user of a third-party AI tool is not automatically the provider of that tool. That does not establish that no other law applies to the user's content or business.",
        ],
      },
      {
        heading: "Detection and disclosure provisions",
        paragraphs: [
          "Section 22757.2 requires a covered provider to make a no-cost AI detection tool for specified image, video, and audio content created or altered by its system. The section addresses system-provenance output, personal-provenance limits, public access, uploads or URLs, an API, feedback, and retention restrictions; the exact text controls.",
          "Section 22757.3 addresses a user option for manifest disclosures and provider-supplied latent disclosures in specified image, video, and audio content or combinations of those media. Do not expand those media-specific provisions into a claim that every AI-generated text item needs a label under the current California chapter.",
        ],
      },
      {
        heading: "AB 853 added roles with later dates",
        paragraphs: [
          "Beginning January 1, 2027, Section 22757.3.1 requires a defined large online platform that exceeded 2,000,000 unique monthly users during the preceding 12 months to address qualifying provenance detection, disclosure, inspection, and stripping. The definition and broadband and telecommunications exclusions should be reviewed in full.",
          "Also beginning January 1, 2027, Section 22757.3.2 bars a defined GenAI hosting platform from knowingly making available a GenAI system that does not place disclosures under Section 22757.3. The hosting definition includes a California-resident download element that must be read in the current code. Section 22757.3.3 adds technically feasible latent-disclosure duties for specified capture devices first produced for sale in California on or after January 1, 2028; a person exclusively engaged in assembly is excluded from the capture-device-manufacturer definition.",
        ],
      },
      {
        heading: "Licensing, enforcement, and an exemption",
        paragraphs: [
          "The covered-provider provisions include third-party licensing duties and a 96-hour revocation rule when the stated knowledge and system-modification conditions are met. After that revocation, the affected third-party licensee must cease using the licensed system. Section 22757.4 sets a $5,000 civil penalty per violation and treats each day as a discrete violation for covered providers, large online platforms, and capture device manufacturers. The specified third-party-licensee cease-use violation has a separate injunctive-relief and fees provision.",
          "Section 22757.5 excludes a product, service, website, or application that provides exclusively non-user-generated video game, television, streaming, movie, or interactive experiences. The word exclusively and the actual product facts matter.",
        ],
      },
      {
        heading: "Pending SB 1000 is not current law",
        paragraphs: [
          "As of the August 2, 2026 review, SB 1000 is an active urgency bill in the Assembly floor process. Its June 9 text would change important definitions and duties, including the covered-provider threshold, if enacted. It has not been enacted and should not be treated as current law.",
          "Before relying on a classification, verify the current codified chapter and the official SB 1000 status. Product architecture, audience measurements, and the statute can all change.",
        ],
      },
    ],
    faq: [
      {
        q: "Does the Act apply because my business uses an AI writing tool?",
        a: "Use of a third-party tool alone does not establish that the business is a covered provider, affected licensee, large online platform, GenAI hosting platform, or capture device manufacturer. A licensee's cease-use duty arises only under the current provision's stated licensing, modification, knowledge, and revocation conditions.",
      },
      {
        q: "Does the one-million threshold mean California users only?",
        a: "The definition states more than 1,000,000 monthly visitors or users and separately requires public accessibility within California. It does not state that every counted visitor or user must be in California.",
      },
      {
        q: "Does the current Act require visible labels on AI-generated text?",
        a: "The current covered-provider manifest- and latent-disclosure provisions identify image, video, and audio content or combinations of those media. Review the full text and other laws before drawing a conclusion about text.",
      },
      {
        q: "When do the Act's duties become operative?",
        a: "The chapter and covered-provider duties became operative August 2, 2026. The large-online-platform and GenAI-hosting provisions specify January 1, 2027, and the capture-device provision specifies January 1, 2028.",
      },
      {
        q: "Did pending SB 1000 already remove the one-million threshold?",
        a: "No. As of the August 2, 2026 review, SB 1000 remains an active bill and is not current law. The current codified covered-provider definition still includes the threshold.",
      },
    ],
    sources: [
      {
        label: "Current California Business and Professions Code, Chapter 25",
        url: "https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=25.&division=8.&lawCode=BPC&part=&title=",
      },
      {
        label: "California AB 853 chaptered amendment",
        url: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB853",
      },
      {
        label: "California SB 942 chaptered text",
        url: "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942",
      },
      {
        label: "Pending California SB 1000 official status",
        url: "https://leginfo.legislature.ca.gov/faces/billStatusClient.xhtml?bill_id=202520260SB1000",
      },
    ],
  },
];
