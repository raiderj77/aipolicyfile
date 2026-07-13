// Deep-dive law page content. Facts reviewed against src/lib/laws.ts and primary
// sources 2026-07-12. When a law changes, update laws.ts first, then this file.

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
    "lawId": "ftc",
    "slug": "ftc-ai-disclosure-rules",
    "title": "FTC Endorsement Guides and AI-Assisted Advertising (2026)",
    "metaDescription": "Review FTC rules for material connections and truthful endorsements when AI assists with advertising. The FTC sources do not create a standalone AI-use label.",
    "intro": "The FTC's Endorsement Guides help explain how Section 5 applies to endorsements and testimonials. They focus on truthful advertising and disclosure of material connections that consumers would not otherwise expect. The official sources reviewed July 12, 2026 do not create a separate rule requiring a label merely because AI assisted with content.",
    "sections": [
      {
        "heading": "When the guidance may be relevant",
        "paragraphs": [
          "The key screening question is whether a message is an advertising endorsement made on behalf of a marketer and whether a material connection could affect the weight or credibility consumers give it.",
          "Payment, free products, affiliate commissions, employment, family relationships, and other benefits can be relevant. Audience expectations and the overall context matter, so the FTC describes these decisions as case specific.",
          "For a creator outside the United States, the FTC says U.S. law may be relevant when it is reasonably foreseeable that content will be seen by and affect U.S. consumers. That is still a fact-specific jurisdiction question."
        ]
      },
      {
        "heading": "What the official FTC sources say",
        "paragraphs": [
          "An endorsement must reflect the honest opinion, finding, belief, or experience of the endorser. Using AI-generated wording does not excuse a false experience or an unsupported advertising claim.",
          "When a material connection is not reasonably expected by the audience and could affect credibility, a clear and conspicuous disclosure may be needed. The FTC's examples focus on explaining that relationship, such as payment, a free product, or an affiliate commission.",
          "The cited Endorsement Guides and Q&A do not say that every AI-assisted endorsement requires a second, AI-specific disclosure. Other laws, platform rules, or the risk of a deceptive overall impression may still make AI transparency relevant in a particular situation."
        ]
      },
      {
        "heading": "Enforcement limits",
        "paragraphs": [
          "The Endorsement Guides were revised in June 2023. The Guides themselves do not have the force of law and do not establish an automatic per-post civil penalty.",
          "The FTC may bring a Section 5 enforcement action when it believes advertising is deceptive. Available remedies depend on the legal theory, facts, prior orders or notices, and procedural path. This checker cannot estimate a penalty or enforcement outcome."
        ]
      },
      {
        "heading": "Questions to review in practice",
        "paragraphs": [
          "Identify the advertiser, any material connection, what claims the message communicates, and whether the person presented as the endorser actually holds the stated opinion or had the represented experience.",
          "Review whether the relationship disclosure is understandable, unavoidable in the relevant format, and close enough to the endorsement to be noticed. Platform tools may help but should be evaluated in the context of the entire message.",
          "If AI materially changes the identity of a speaker, fabricates an experience, or makes the advertisement misleading, the issue is broader than disclosure wording. A lawyer can assess the full advertisement and any other applicable AI-specific rule."
        ]
      },
      {
        "heading": "Important limitations",
        "paragraphs": [
          "This page cannot determine whether a particular connection is material, what an audience understands, whether a disclosure is clear and conspicuous, or whether an advertisement is deceptive.",
          "Do not use the sample relationship wording as a universal safe harbor. The FTC states that context matters and its staff guidance cannot give a definitive answer for every endorsement."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do the FTC Endorsement Guides independently require an AI-use label?",
        "a": "The official Guides and Q&A reviewed July 12, 2026 do not state a standalone rule requiring an AI-use label. They focus on truthful endorsements and material connections. AI use could still contribute to a deceptive message, and another law or platform policy may require separate transparency."
      },
      {
        "q": "What should I review when AI helps create an endorsement?",
        "a": "Confirm that the endorsement is truthful, the represented person or experience is genuine, advertising claims are supported, and any material connection is clearly disclosed when needed. Then check separate AI-specific laws and platform rules."
      },
      {
        "q": "Do I need to disclose AI if it was not sponsored or paid?",
        "a": "The Endorsement Guides concern advertising endorsements. A personal recommendation with no sponsoring advertiser is different, but other consumer-protection, AI, intellectual-property, privacy, or platform rules may still be relevant."
      },
      {
        "q": "Where should a material-connection disclosure appear?",
        "a": "The FTC uses a clear-and-conspicuous standard and evaluates the format and overall context. Review the current FTC platform examples and do not assume a profile-page statement or hidden text reaches every viewer."
      },
      {
        "q": "Is there an automatic FTC fine for each post?",
        "a": "No automatic fine is created by the Endorsement Guides themselves. Enforcement and remedies depend on the FTC Act, facts, prior orders or notices, and the procedural route."
      },
      {
        "q": "Does this apply to private accounts or small local businesses?",
        "a": "Small size is not a general exemption from truthful-advertising principles, but coverage and disclosure still depend on the advertising relationship, audience understanding, and facts."
      }
    ],
    "sources": [
      {
        "label": "FTC Endorsement Guides",
        "url": "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides"
      },
      {
        "label": "FTC Endorsement Guides: What People Are Asking",
        "url": "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking"
      }
    ]
  },
  {
    "lawId": "euArt50",
    "slug": "eu-ai-act-article-50",
    "title": "EU AI Act Article 50: Transparency for AI-Generated and Manipulated Content (2026)",
    "metaDescription": "Review EU AI Act Article 50 provider and deployer transparency duties, scope, exceptions, and the August 2, 2026 application date.",
    "intro": "Starting August 2, 2026, certain providers and deployers of AI systems must disclose when they use artificial intelligence to generate or manipulate content, or when people are interacting with AI systems. The regulation aims to help people distinguish between human-created and machine-generated content online.",
    "sections": [
      {
        "heading": "What Article 50 actually covers",
        "paragraphs": [
          "Article 50 applies to specific categories of AI systems and their providers or deployers. These include AI systems designed to interact directly with people, systems that generate synthetic text or audio, image or video content, deepfake-generating systems, emotion recognition systems, and systems that perform biometric categorization. The regulation does not apply universally to all publishers of AI-generated content.",
          "If you develop or deploy one of these specific systems, Article 50 applies. If you use consumer generative AI tools (like ChatGPT or Midjourney) to create content you publish, you can count as a deployer for some outputs: publishing AI-generated deepfakes, or AI-written text meant to inform the public, carries disclosure obligations of its own.",
          "Article 2 contains the scope rules and exclusions. For a non-EU provider or deployer, a relevant question is whether the AI output is used in the Union; public accessibility alone is not the full statutory test. Article 50 also contains specific law-enforcement and creative-work qualifications."
        ]
      },
      {
        "heading": "Transparency requirements",
        "paragraphs": [
          "Article 50 has three core transparency requirements. First, providers of AI systems designed to interact directly with people must ensure users know they are interacting with an AI system, unless it is obvious from context. Second, providers creating synthetic audio, image, video, or text must mark outputs in machine-readable format so the content can be detected as artificially generated.",
          "Third, deployers of covered deepfake image, audio, or video content must disclose that it was artificially generated or manipulated. The provider's machine-readable marking duty in paragraph 2 is separate from the deployer's disclosure duty in paragraph 4.",
          "Disclosures must be clear and made at the time of first interaction or exposure. For text published to inform the public on matters of public interest, an exception exists if the content is subject to human editorial review with editorial responsibility assigned. The scope of what qualifies as sufficient editorial review remains under development and may be clarified through future guidance from regulators."
        ]
      },
      {
        "heading": "Effective date and enforcement",
        "paragraphs": [
          "Article 50 applies from August 2, 2026. The Act does not state the December 2, 2026 transition date previously shown on this site for Article 50.",
          "Article 99 contains maximum administrative-fine tiers and rules for undertakings and SMEs. The applicable tier and amount depend on the violated obligation and case facts, so this page does not present the statutory maximum as an expected penalty."
        ]
      },
      {
        "heading": "How providers and deployers can prepare",
        "paragraphs": [
          "If you develop or deploy an AI system covered by Article 50, start by reviewing the categories of systems that trigger obligations. Document what systems you operate and which requirements apply.",
          "For systems that generate synthetic content, plan how you will add machine-readable marking or metadata. For interactive systems, ensure users know they are speaking with AI. For deepfakes or manipulated media, prepare clear disclosure mechanisms.",
          "If your content is subject to human editorial review, document who reviewed it and when. This supports any exceptions that may apply under the regulation."
        ]
      },
      {
        "heading": "Common questions about scope",
        "paragraphs": [
          "Article 50 targets providers and deployers of specified AI systems, not all publishers of content created with AI. A solo creator using a commercial generative AI tool operates under different rules than the provider or deployer of that tool.",
          "Minor content modifications, such as grammar or spell-checking, typically do not trigger disclosure requirements. Substantive content generation, manipulation, or audio/video synthesis does trigger obligations for the provider or deployer of the system creating or manipulating the content.",
          "The threshold between minor editing and substantive manipulation remains to be clarified through future guidance and enforcement. Where you are genuinely uncertain whether a tool's output triggers obligations, asking a legal professional or watching for clarification from your relevant EU regulator is appropriate."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does Article 50 apply to me if I use ChatGPT to write a blog post?",
        "a": "Article 50 distinguishes provider and deployer duties. A publisher should review Article 2 scope and Article 50(4), especially for deepfakes or AI-generated or manipulated text published to inform the public on matters of public interest. Human review and editorial responsibility are relevant to the stated text exception."
      },
      {
        "q": "What counts as 'machine-readable format' for marking images?",
        "a": "Article 50(2) assigns the machine-readable marking duty to providers and does not enumerate a universal file format. This page cannot confirm that alt text, schema, or ordinary metadata satisfies the technical standard. Review current official implementation materials."
      },
      {
        "q": "If I run a news website and publish AI-assisted articles, what do I need to do?",
        "a": "If you deploy an AI system to generate text content published to inform the public on public interest matters, the regulation creates an exception if the content undergoes human editorial review with editorial responsibility assigned. You would want to document who reviewed the content and when."
      },
      {
        "q": "Do I need separate compliance for different EU countries?",
        "a": "No. Article 50 is EU-wide regulation. Compliance with the standard meets requirements across all member states. Enforcement and implementation details may vary slightly by country."
      },
      {
        "q": "What if my audience is partly in the EU and partly outside?",
        "a": "Accessibility alone is not the complete test. Article 2 covers, among others, certain non-EU providers and deployers where AI output is used in the Union. The facts and your operator role need review."
      },
      {
        "q": "Are there exemptions for creative or artistic work?",
        "a": "Article 50(4) limits how the deepfake disclosure must be made for evidently artistic, creative, satirical, fictional, or analogous works; it does not simply erase the disclosure duty. Human review and editorial responsibility are a separate exception for covered public-interest text."
      }
    ],
    "sources": [
      {
        "label": "EU AI Act Article 50 text",
        "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en"
      }
    ]
  },
  {
    "lawId": "nySynthetic",
    "slug": "new-york-synthetic-performer-law",
    "title": "New York Synthetic Performer Disclosure Law (2026)",
    "metaDescription": "Review New York's enacted synthetic-performer advertising disclosure rule, definitions, exceptions, knowledge provisions, and civil penalties.",
    "intro": "New York amended General Business Law section 396-b to address covered advertisements using synthetic performers. The enacted text includes definitions, a conspicuous-disclosure rule, actual-knowledge provisions, publisher protections, and exceptions. This page flags issues to review; it does not decide whether a particular advertiser, publisher, or asset is covered.",
    "sections": [
      {
        "heading": "Who this law covers",
        "paragraphs": [
          "Start with the enacted definitions and the roles of the person producing the advertisement and any medium publishing or disseminating it. Geographic reach can be relevant, but company location or technical availability alone does not resolve every statutory element.",
          "A synthetic performer is defined as a digitally created asset intended to create the impression that the asset is engaging in an audiovisual or visual performance of a human performer who is not recognizable as an actual person. In practical terms, this means an AI-generated video, image, or avatar that looks like a human performing an action or speaking.",
          "The law does not cover certain situations. The law includes an exemption for audio-only advertisements. Advertisements using AI solely for language translation are also exempt. Additionally, ads for creative works like films, TV programs, and video games are exempt if the synthetic performer use in the ad matches what actually appears in the work. Finally, the law does not apply to advertising media platforms themselves, such as newspapers, TV stations, or streaming services that are displaying ads from other advertisers."
        ]
      },
      {
        "heading": "What it actually requires",
        "paragraphs": [
          "The core requirement is simple: include a conspicuous disclosure that a synthetic performer was used. The law requires the disclosure to be conspicuous but does not define that term or specify font size, contrast, placement, or duration requirements.",
          "The disclosure must clearly identify the presence of the synthetic performer. Courts interpreting 'conspicuous' in advertising contexts typically expect disclosures that viewers are reasonably likely to see or notice, rather than text hidden in fine print or data disclosures. For a video ad, on-screen text or a spoken callout are common approaches. For a static image, text placed prominently near the synthetic performer is typical. The exact wording is not prescribed by the law.",
          "The requirement applies only to advertisements where the advertiser has actual knowledge that a synthetic performer is being used. If you genuinely did not know an asset was AI-generated, the law may not apply, but you should verify this carefully and make reasonable efforts to know what you are using."
        ]
      },
      {
        "heading": "Deadlines and penalties",
        "paragraphs": [
          "The bill was signed December 11, 2025 and states that it takes effect on the 180th day after becoming law, June 9, 2026. Coverage after that date still depends on the definitions, knowledge provisions, and exceptions.",
          "Violations are civil penalties, not criminal charges. The first violation for failing to disclose a synthetic performer results in a $1,000 penalty. Each subsequent violation results in a $5,000 penalty per violation. These penalties can accumulate if multiple advertisements violate the law."
        ]
      },
      {
        "heading": "How to comply in practice",
        "paragraphs": [
          "Step one is to identify whether you are using synthetic performers. If you generate video, images, or audio of human-like characters using AI tools, you are using synthetic performers. Review your ad creative honestly.",
          "Step two is to add a disclosure to the ad itself. This disclosure should be visible or audible to the person viewing the ad. The disclosure must identify that a synthetic performer was used. On video platforms, you might add text overlay, such as 'This ad features an AI-generated performer.' On social media images or carousels, add text directly to the image stating that a synthetic performer was used. On platforms that support it, you can also include spoken callouts.",
          "Step three is to make sure the disclosure is conspicuous. Consider whether an average viewer would notice it in the context where your ad appears. If you place text in a corner in small font, or if you embed audio callouts so quietly they are barely audible, courts may find the disclosure was not conspicuous."
        ]
      },
      {
        "heading": "Common misconceptions",
        "paragraphs": [
          "A business outside New York should not assume location alone resolves coverage. Review the enacted text, where the advertisement is disseminated, who produced or published it, the actual-knowledge provisions, and the statutory exceptions.",
          "Misconception: 'Editing a real person's photo or video to make them look better means I have to disclose it as a synthetic performer.' Correction: The law applies to synthetic performers, which are entirely AI-created assets intended to look like human performances. Minor edits to a real person's existing media, such as retouching skin or adjusting colors, do not trigger the disclosure requirement. The boundary between minor editing and a fully synthetic performer can be fact-specific; when in doubt, consult legal counsel.",
          "Misconception: 'I can disclose the synthetic performer in fine print or in my terms and conditions.' Correction: The law requires a conspicuous disclosure in the advertisement itself. Hiding the disclosure in legal documents or metadata is not sufficient.",
          "Misconception: 'If I use a synthetic performer in an ad for a film or game, I always have to disclose it.' Correction: Ads for creative works like movies, TV shows, and video games are exempt if the synthetic performer use in the ad matches what actually appears in the work itself. If your ad shows what's genuinely in the film, no disclosure is required."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do I need to disclose if I use AI to touch up or slightly edit a real person's photo in an ad?",
        "a": "This depends on whether the result is a synthetic performer as the law defines it, meaning a fully AI-created asset that creates the impression of a human performance. Minor edits to a real person's existing photo or video, such as retouching skin or adjusting colors, typically do not cross that line. However, the boundary can be fact-specific. If you are unsure whether your editing crosses into synthetic performer territory, consider seeking legal advice."
      },
      {
        "q": "What counts as a 'conspicuous disclosure'?",
        "a": "The law requires disclosure to be conspicuous but does not define the term or specify font size, contrast, or placement standards. In advertising contexts, conspicuous typically means noticeable and reasonably likely to be seen or read by viewers. Burying disclosure in fine print or data sections would likely not meet this standard. Testing your ad on the platform where it will run is a practical way to see whether viewers would notice the disclosure."
      },
      {
        "q": "I'm based in California. Does this law affect me?",
        "a": "Do not decide coverage from company location or technical reach alone. Review the enacted text and the facts concerning production, publication, dissemination, knowledge, audience, and exceptions."
      },
      {
        "q": "What if I use a synthetic performer in a voice-only ad?",
        "a": "This law includes an exemption for audio-only advertisements. The law applies to synthetic performers that create the impression of a human audiovisual or visual performance. Audio-only content falls outside that scope."
      },
      {
        "q": "Are there any exemptions for creative works like movies or games?",
        "a": "Yes. Advertisements for films, TV programs, and video games are exempt if the synthetic performer use in the ad matches what actually appears in the work being promoted."
      },
      {
        "q": "What happens if I violate this law?",
        "a": "The first violation can result in a $1,000 civil penalty. Each subsequent violation can result in a $5,000 civil penalty. These are enforced as civil penalties, not criminal charges."
      }
    ],
    "sources": [
      {
        "label": "New York Senate bill S.8420-A",
        "url": "https://www.nysenate.gov/legislation/bills/2025/S8420"
      }
    ]
  },
  {
    "lawId": "caBot",
    "slug": "california-bot-disclosure-law",
    "title": "California B.O.T. Act: What You Need to Know About Bot Disclosure in 2026",
    "metaDescription": "California's B.O.T. Act requires clear disclosure when bots communicate with people to sell or influence votes. Learn what the law requires and how to comply.",
    "intro": "California's B.O.T. Act (SB 1001) took effect on July 1, 2019, and requires anyone using a bot or automated account to communicate with people in California to clearly disclose that they are talking to a bot. The law focuses on two situations: when a bot is used to deceive someone into buying something, or when it is used to mislead someone about voting. If you use any kind of chat bot, automated account, or AI agent to interact with California residents for commercial or political purposes, you should understand this law.",
    "sections": [
      {
        "heading": "Who This Law Covers",
        "paragraphs": [
          "The California B.O.T. Act addresses a person using a bot to communicate or interact online with another person in California with intent to mislead that person about the bot's artificial identity for specified commercial or electoral purposes. Each element matters.",
          "The law covers anyone who owns or operates the bot, regardless of whether they built it themselves or hired someone else to build it. If you are using a bot to interact with California residents, you are responsible for complying with the disclosure requirement.",
          "The law does NOT apply to internet service providers or web hosting companies just because they host bot software. The responsibility falls on the person or business actually running the bot. Banks, financial institutions, and other entities offering legitimate customer service through bots are not the target of this law if their purpose is not deception.",
          "A lower-risk answer on one element does not by itself establish that no California or other rule applies. This checker only flags the statute for review."
        ]
      },
      {
        "heading": "What It Actually Requires",
        "paragraphs": [
          "The core requirement under the statute is that disclosure must be clear and conspicuous. The law requires the disclosure to be reasonably designed to inform the person that they are communicating with an automated account, not a human.",
          "The statute uses the terms 'clear' and 'conspicuous' but does not specify where or when the disclosure must appear. The most protective approach to compliance is to place disclosure early in the interaction, where a person is likely to notice it before deciding whether to engage with the bot.",
          "The statute contains an explicit safe harbor: a person using a bot is not liable under this section if the person discloses that it is a bot. The disclosure must be clear, conspicuous, and reasonably designed to inform the people the bot communicates or interacts with that it is a bot.",
          "The law does not require you to use specific wording or a particular phrase. It only requires that the disclosure be clear and conspicuous enough that a reasonable person would understand they are talking to a bot."
        ]
      },
      {
        "heading": "Deadlines and Penalties",
        "paragraphs": [
          "The section became operative July 1, 2019. Whether it governs a current bot still depends on the communication, location, intent, and purpose elements in the statute.",
          "Violations are enforced under California's unfair competition law. The statute itself does not specify a fixed dollar amount per violation. Instead, enforcement is handled through the state's broader consumer protection framework, which means penalties can vary depending on the nature and severity of the violation.",
          "Because the law lacks a specific dollar penalty in its text, enforcement typically falls to California's Attorney General or consumers themselves through civil lawsuits. Businesses that violate the disclosure requirement may face legal action, but the exact financial consequence depends on how a court or regulatory authority evaluates the specific violation."
        ]
      },
      {
        "heading": "How Courts and Experts Interpret the Law",
        "paragraphs": [
          "The law requires disclosure to be 'clear and conspicuous.' Legal experts and compliance guidance generally recommend placing disclosure prominently in the initial interaction with the bot, though the statute's language does not explicitly mandate placement within the conversation itself versus other locations.",
          "Examples of approaches that attempt to meet the clear and conspicuous standard include: starting the bot's first response with 'This is an automated bot,' using a pop-up or banner stating the same before the user can interact, or displaying a clear label on the button or link that triggers the bot.",
          "Some guidance suggests that burying disclosure in terms of service, footer links, or profile descriptions alone is less likely to satisfy the 'clear and conspicuous' requirement, since a person may not see it before or during interaction. However, the statute itself does not prohibit these locations if they are genuinely clear and conspicuous.",
          "If you use a bot to sell products or influence votes, the disclosure requirement applies the same way. The law does not exempt any particular purpose or business type, as long as the bot operates for the stated purposes and the disclosure is adequate."
        ]
      },
      {
        "heading": "Common Misconceptions",
        "paragraphs": [
          "Misconception: 'I can hide that my account is a bot as long as I disclose it somewhere on my website.' Fact: The law requires disclosure to be clear and conspicuous. Most legal guidance indicates this means a person must encounter the disclosure before or during interaction with the bot, not in a hidden or hard-to-find location.",
          "Misconception: 'The penalty is $1,000 per violation' or 'There is a set fine.' Fact: The law itself does not specify a fixed dollar amount. Penalties vary based on enforcement actions and how courts evaluate the violation. Do not rely on a specific number found in secondary sources.",
          "Misconception: 'My bot is fine because it is powered by AI, not a simple script.' Fact: The law defines a bot as an automated online account where all or substantially all actions are not the result of a person. Whether it runs on modern AI or a simple script makes no difference. What matters is the automation, the intent to mislead about its artificial identity, and the commercial or electoral purpose.",
          "Misconception: 'This law only applies to political campaigns.' Fact: The law applies equally to commercial bots used to sell products and to political bots used to influence elections. Both are subject to the same disclosure requirement."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do I need to comply with this law if my bot only talks to people outside of California?",
        "a": "Communication with a person in California is one statutory element. Location evidence and other laws still require review; this page cannot give a definitive jurisdiction conclusion."
      },
      {
        "q": "Where should I place the disclosure that my system is a bot?",
        "a": "The law requires disclosure to be clear and conspicuous. Legal experts generally recommend placing it prominently so a person sees it before or immediately upon beginning interaction. The statute does not specify exact placement, but burying it in terms of service or footer links alone is less likely to meet the 'clear and conspicuous' standard."
      },
      {
        "q": "What exactly should my bot say to comply?",
        "a": "The law does not require specific wording. Your disclosure must be clear enough that a reasonable person would understand they are talking to a bot. Examples include 'This is an automated bot,' 'You are chatting with a bot, not a human,' or 'I am an automated assistant.' The key is clarity and honesty."
      },
      {
        "q": "Does this law let me use a bot to sell things or influence votes if I disclose it?",
        "a": "The law applies to bots used for these purposes. Under the statute, proper disclosure of the bot's automated nature is a key requirement. However, full compliance depends on meeting all legal standards for that disclosure. You should not rely solely on this information for your specific situation."
      },
      {
        "q": "What happens if I violate the law?",
        "a": "Violations are treated as unfair competition under California law. Enforcement is handled through the state's consumer protection system, and penalties can vary. You could face action from the California Attorney General or civil lawsuits from consumers."
      },
      {
        "q": "Does this law apply to customer service chatbots?",
        "a": "The law targets bots that mislead people about their automated nature in order to incentivize a purchase or influence a vote. A customer service bot that clearly discloses it is a bot sits inside the statute's safe harbor. The practical rule for any sales-adjacent chatbot talking to California users: have it identify itself as a bot, clearly, in the conversation."
      }
    ],
    "sources": [
      {
        "label": "California SB 1001 (B.O.T. Act)",
        "url": "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001"
      },
      {
        "label": "California Business and Professions Code Section 17941",
        "url": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941"
      }
    ]
  },
  {
    "lawId": "caSb942",
    "slug": "california-sb-942",
    "title": "California SB 942 (AI Transparency Act) 2026",
    "metaDescription": "California SB 942 sets detection and provenance duties for defined covered providers of public generative AI systems. Operative January 1, 2026.",
    "intro": "California SB 942, the AI Transparency Act, is a law that requires large AI providers to be transparent about AI-generated content. It specifically targets companies that build and publish generative AI systems with over 1 million monthly users. The law does not apply to small businesses or individuals who use AI tools created by others. It requires providers to offer free detection tools and clearly label AI-generated content.",
    "sections": [
      {
        "heading": "Who this law covers",
        "paragraphs": [
          "This law defines a \"covered provider\" as a person that creates, codes, or otherwise produces a generative AI system with over 1 million monthly visitors or users that is publicly accessible within California. Applying that definition requires the actual product and usage facts.",
          "This law generally does not apply to small businesses, freelancers, or creators who use AI tools created by others. If you use ChatGPT to write content, or a design tool's AI features to make graphics, this law is generally understood not to apply to you. However, you should consult with a legal professional if you are unsure whether your specific situation qualifies as a covered provider.",
          "The statutory definition uses more than 1 million monthly visitors or users and public accessibility within California. It does not say the million users must all be in California. Private or internal systems may fall outside the definition, but the full facts should be reviewed."
        ]
      },
      {
        "heading": "What it actually requires",
        "paragraphs": [
          "Covered providers must offer a free, publicly accessible AI detection tool. This tool must allow users to upload content and check whether that content was created or altered by the provider's AI system. The tool must include an API so developers can integrate it into their own software. Providers may collect contact information from users who voluntarily choose to share feedback, but only for the purpose of improving the tool.",
          "Providers must give users the ability to add visible labels to AI-generated content. These labels must be permanent or extraordinarily difficult to remove to the extent that is technically feasible, and understandable to a reasonable person. For example, a label might say \"Generated by [AI system name]\" or similar wording.",
          "Providers must also include latent disclosures in covered AI-generated image, video, or audio content. To the extent technically feasible and reasonable, the disclosure conveys the provider, system name and version, creation or alteration time and date, and a unique identifier, and must meet the other statutory conditions.",
          "If a provider licenses its AI system to third parties (like a company that builds a chatbot using another company's AI), the provider must require those third parties to maintain the disclosure capabilities in their contracts. Providers must also revoke licenses within 96 hours of discovering that a licensee has disabled these disclosure features."
        ]
      },
      {
        "heading": "Deadlines and penalties",
        "paragraphs": [
          "The enacted text states that the chapter became operative January 1, 2026. The prior August 2, 2026 date shown on this site was incorrect.",
          "The statute provides $5,000 per violation and states that each day a covered provider is in violation is a discrete violation. Whether conduct is a violation depends on the statutory definitions and facts.",
          "Violations can be enforced through civil action by the California Attorney General, a city attorney, or a county counsel. Whoever brings the enforcement action can also recover attorney's fees and court costs if they win. Courts can also issue injunctions, meaning a judge can order a provider to immediately stop the violation."
        ]
      },
      {
        "heading": "What the law requires of providers",
        "paragraphs": [
          "Under this law, covered providers are required to build or integrate a detection tool that can scan content and identify whether it was created by their system. The tool must be free and easy for the public to use, and published on the provider's website or made widely available.",
          "The manifest-disclosure provision requires covered providers to offer users an option for covered image, video, and audio content. The latent-disclosure provision requires the provider to include provenance information in that covered content. The text provisions previously described on this page were overbroad.",
          "When licensing systems to other companies, the law requires providers to include contractual terms that maintain these disclosure features. Providers should build in automated checks or monitoring to verify compliance and have a clear process to revoke licenses within 96 hours of discovering non-compliance.",
          "Example visible label wording: \"This image was generated by [Your AI System Name].\" Or: \"Content created by [Provider Name] AI System v2.1.\" Example metadata might include: provider name, system name and version, a creation timestamp, and a unique identifier. A provider's detection tool should be able to read this metadata."
        ]
      },
      {
        "heading": "Common misconceptions",
        "paragraphs": [
          "The statute's covered-provider duties are not automatically assigned to every business that uses a third-party AI tool. Confirm whether the business creates, codes, or otherwise produces the system and meets the remaining definition.",
          "Misconception: \"I need to label every AI-generated image on my website.\" What the law actually says: This law only applies if you built the AI system that generated the image. If you used someone else's tool, that tool's provider is responsible for compliance, not you.",
          "Misconception: \"The penalty is $5,000 total.\" What the law actually says: The penalty is $5,000 per day of non-compliance. If a provider is out of compliance for 30 days, the penalties could add up to $150,000 or more, plus attorney's fees.",
          "Misconception: \"This law requires me to tell people whenever they interact with AI.\" What the law actually says: The law only requires disclosures for content that was actually created or altered by the provider's AI system. Not all interactions with AI systems require separate disclosure labels."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does this law apply to my business?",
        "a": "Start with the statutory covered-provider definition: who creates, codes, or otherwise produces the system, monthly visitors or users, and public accessibility within California. This page cannot decide your status."
      },
      {
        "q": "What counts as a 'covered provider'?",
        "a": "The statute defines a covered provider as a person that creates, codes, or otherwise produces a generative AI system with over 1 million monthly visitors or users that is publicly accessible within California. It does not say all 1 million users must be California users."
      },
      {
        "q": "Do I have to label all AI content, or just some of it?",
        "a": "The enacted manifest and latent disclosure provisions address image, video, and audio content, or combinations of those media. Review Sections 22757.2 and 22757.3 for the exact detection and provenance requirements."
      },
      {
        "q": "What happens if a provider does not comply?",
        "a": "The California Attorney General, a city attorney, or a county counsel can file a civil action for $5,000 per day of violation. If successful, they can also collect attorney's fees and court costs. A court can also issue an injunction to stop the violation immediately."
      },
      {
        "q": "Does this law prevent me from using AI in my business?",
        "a": "This law does not restrict your use of AI tools created by others. It only requires providers of large public AI systems to disclose when content is AI-generated. If you use other companies' AI tools to help run your business, this law has no impact on you."
      },
      {
        "q": "When does the law take effect?",
        "a": "The enacted text states that the chapter became operative January 1, 2026."
      }
    ],
    "sources": [
      {
        "label": "California SB 942",
        "url": "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942"
      }
    ]
  }
];
