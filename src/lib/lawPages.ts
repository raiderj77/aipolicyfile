// Deep-dive law page content. Facts reviewed against src/lib/laws.ts and primary
// sources 2026-07-07. When a law changes, update laws.ts first, then this file.

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
    "title": "FTC Endorsement Guides and AI Disclosure Rules (2026)",
    "metaDescription": "The FTC requires clear disclosure of AI involvement in sponsored content and endorsements. Penalties up to $53,088 per violation. Learn what the rules require.",
    "intro": "The FTC's Endorsement Guides require disclosure of both paid relationships and AI involvement in content. Under this guidance, when substantive content is generated with AI, creators must inform their audience. The 2026 guidance update is now being enforced across all account sizes, regardless of follower count.",
    "sections": [
      {
        "heading": "Who this law covers",
        "paragraphs": [
          "This law applies to any creator, influencer, or business publishing sponsored content, ads, endorsements, or reviews that involved meaningful AI help. It covers YouTube videos, Instagram posts, TikTok content, blog reviews, email newsletters, and any other channel where content reaches an audience.",
          "The law does not cover routine tool use. Spell-checkers, grammar tools, autocomplete suggestions, and basic image resizing are not considered substantive content generation.",
          "Account size does not create an exemption. The FTC applies the same disclosure rules to small accounts as to large brands, and the same penalties apply regardless of follower count.",
          "The law applies to creators in the United States and to content that reaches U.S. audiences under FTC jurisdiction."
        ]
      },
      {
        "heading": "What the law requires",
        "paragraphs": [
          "The FTC requires two separate disclosures. First, the paid or sponsored relationship must be disclosed (that payment or product was received). Second, AI involvement must be disclosed when AI generated substantive content for that post or video.",
          "Substantive content is generally understood as material that shapes the endorsement message. When AI wrote a product review, created a caption, generated an image, or produced video content, the FTC considers this substantive. When AI only proofread or formatted content created by the human, this is typically considered routine tool use and does not require disclosure.",
          "The disclosure must be clear and conspicuous. Readers must see the disclosure without clicking, scrolling, or expanding hidden text, and the disclosure must be easy to understand in plain language.",
          "For video content, the disclosure must appear on screen within the first few seconds. Placing it only at the end or in a description does not meet this requirement.",
          "Direct language is required. Examples include 'This review was written with AI help,' 'AI generated the copy for this post,' or 'Made with AI.' Vague phrases like 'created with technology' do not satisfy the requirement."
        ]
      },
      {
        "heading": "Deadlines and penalties",
        "paragraphs": [
          "The updated AI disclosure guidance was issued in May 2026, and enforcement is currently active.",
          "Civil penalties can reach $53,088 per violation, adjusted annually for inflation. Each non-compliant post can count as a separate violation, so exposure adds up quickly across a campaign.",
          "The FTC enforces these rules through civil action. Violations can be reported, and the FTC may investigate, demand corrective action, or pursue settlements and fines."
        ]
      },
      {
        "heading": "How to comply in practice",
        "paragraphs": [
          "Before posting sponsored or endorsed content, the question to assess is whether AI generated substantive content. If yes, disclosure is required. If no, the paid-relationship disclosure is still required, but not an AI-specific disclosure.",
          "The paid-relationship disclosure should be placed near the beginning of the post or video. On Instagram or TikTok, the platform's built-in paid-partnership labels should be used if available. For blog posts, a note at the top is appropriate. For videos, the disclosure should appear on screen within the first few seconds.",
          "The AI disclosure should appear immediately after or alongside the paid-relationship disclosure. Both must be clear and visible, though they can appear in the same sentence.",
          "Examples of disclosure wordings that comply with the standard: 'Sponsored: [Company name]. This review was written with AI help.' For video: on-screen text in the first few seconds stating 'Paid partnership with [Company]. Content written with AI assistance.' For a blog post: 'I received a free product from [Company] in exchange for this review, which was drafted with AI help.'",
          "Documentation of the process is advisable. Records showing which posts used AI and how demonstrate good-faith compliance if questions arise."
        ]
      },
      {
        "heading": "Common misconceptions",
        "paragraphs": [
          "Misconception: 'I only used AI for a small part, so I do not need to disclose.' The FTC requires disclosure if AI generated any substantive portion of the content. The size of the AI contribution does not affect the requirement.",
          "Misconception: 'If I do not mention the sponsorship, I do not need to disclose AI use.' Both disclosures are required separately. Neither the sponsorship nor the AI involvement can be hidden. Both must be disclosed.",
          "Misconception: 'My followers know I use AI, so I do not need to say it explicitly.' The law requires explicit disclosure. Assuming the audience already knows is not compliance. The requirement is to state it plainly in each post.",
          "Misconception: 'The penalty only applies if the FTC sues me.' The FTC can enforce the rules against individual creators. Account size does not provide protection. Compliance is required regardless of visibility."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does using ChatGPT to write a product review require disclosure?",
        "a": "When AI-generated text becomes substantive content in a review, disclosure is required under the FTC rules. If ChatGPT drafted the review and was posted with minimal changes, the FTC requires disclosure of AI involvement. If AI was only used to check grammar on an existing review, this is typically considered routine tool use and does not require disclosure."
      },
      {
        "q": "What if I use AI to create images but write my own caption?",
        "a": "In sponsored or endorsement content, AI-generated images count as substantive content, so the AI disclosure is required for them. A separate disclosure is not needed for a caption written without AI help. The paid-relationship disclosure is still required at the start of the post."
      },
      {
        "q": "Do I need to disclose AI if it was not sponsored or paid?",
        "a": "The Endorsement Guides are about endorsements and advertising, so they turn on when there is a material connection: payment, free product, affiliate links, or a business relationship. A purely personal, unpaid post is generally outside their scope. Other laws can still apply to unpaid AI content, though. EU AI Act Article 50, for example, covers AI-generated content shown to EU audiences whether or not it is sponsored."
      },
      {
        "q": "Where exactly should I put the disclosure on TikTok or Instagram?",
        "a": "The platform's built-in paid-partnership label should be used if applicable. For the AI disclosure, it should appear as text on screen in the first few seconds, or prominently in the caption above the fold, so viewers see it without scrolling. Both disclosures must be visible without tapping or clicking."
      },
      {
        "q": "What happens if a post lacks proper AI disclosure?",
        "a": "Each non-compliant post can count as a separate violation under the FTC rules, with civil penalties of up to $53,088 per violation. The practical fix when a miss is discovered is to correct the post: edit it to add the proper disclosures, or take it down and repost it compliant."
      },
      {
        "q": "Does this apply to private accounts or small local businesses?",
        "a": "The FTC does not formally exempt small accounts or local businesses. If content reaches an audience and AI generated substantive content in a sponsored post, the disclosure requirement applies under the rules."
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
    "metaDescription": "EU AI Act Article 50 requires disclosing AI-generated or manipulated content, deepfakes, and AI-generated text published publicly. Applies August 2, 2026.",
    "intro": "Starting August 2, 2026, certain providers and deployers of AI systems must disclose when they use artificial intelligence to generate or manipulate content, or when people are interacting with AI systems. The regulation aims to help people distinguish between human-created and machine-generated content online.",
    "sections": [
      {
        "heading": "What Article 50 actually covers",
        "paragraphs": [
          "Article 50 applies to specific categories of AI systems and their providers or deployers. These include AI systems designed to interact directly with people, systems that generate synthetic text or audio, image or video content, deepfake-generating systems, emotion recognition systems, and systems that perform biometric categorization. The regulation does not apply universally to all publishers of AI-generated content.",
          "If you develop or deploy one of these specific systems, Article 50 applies. If you use consumer generative AI tools (like ChatGPT or Midjourney) to create content you publish, you can count as a deployer for some outputs: publishing AI-generated deepfakes, or AI-written text meant to inform the public, carries disclosure obligations of its own.",
          "The law does not apply to content generated purely for internal use, private communication between individuals, or systems used exclusively outside EU jurisdiction. Content that is artistic, satirical, or creative and undergoes human editorial review has exemptions. Law enforcement agencies using AI systems authorized by law for detecting, preventing, investigating, or prosecuting crimes have limited exemptions."
        ]
      },
      {
        "heading": "Transparency requirements",
        "paragraphs": [
          "Article 50 has three core transparency requirements. First, providers of AI systems designed to interact directly with people must ensure users know they are interacting with an AI system, unless it is obvious from context. Second, providers creating synthetic audio, image, video, or text must mark outputs in machine-readable format so the content can be detected as artificially generated.",
          "Third, deepfakes (synthetic video or audio of real people) must be disclosed as artificially generated or manipulated. The marking should be technically robust, though the regulation acknowledges that technical limitations may exist.",
          "Disclosures must be clear and made at the time of first interaction or exposure. For text published to inform the public on matters of public interest, an exception exists if the content is subject to human editorial review with editorial responsibility assigned. The scope of what qualifies as sufficient editorial review remains under development and may be clarified through future guidance from regulators."
        ]
      },
      {
        "heading": "Effective date and enforcement",
        "paragraphs": [
          "The obligations apply from August 2, 2026. Generative AI systems already on the market before that date have until December 2, 2026. EU member state authorities and the European Commission handle enforcement.",
          "Failure to comply can result in penalties of up to 15 million EUR or 3% of total worldwide annual turnover, whichever is higher. The specific penalty tiers, and which violations trigger which penalties, are set in the broader EU AI Act framework rather than in Article 50 alone."
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
        "a": "Article 50 applies to providers and deployers of specific AI systems. If you use ChatGPT as a consumer to generate text, OpenAI (the provider) has obligations, but your obligations as a publisher depend on the specific system category and whether the content fits exemptions like editorial review. The regulation does not universally require disclosure for all consumer-generated AI content."
      },
      {
        "q": "What counts as 'machine-readable format' for marking images?",
        "a": "Article 50 requires marking in machine-readable format, but the regulation does not enumerate specific technical formats. Metadata embedded in files, alt text, structured data markup, and other approaches may qualify. The EU AI Office is expected to publish codes of practice with more detailed guidance on acceptable marking methods."
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
        "a": "If EU audiences can access your content, Article 50 applies to the extent you are a provider or deployer of covered AI systems. The regulation applies based on what EU people can access, not on where you are located."
      },
      {
        "q": "Are there exemptions for creative or artistic work?",
        "a": "Yes. Content that is artistic, satirical, or creative and undergoes human editorial review has exemptions from certain Article 50 requirements. The scope of this exemption and what qualifies as sufficient editorial review are still being clarified by regulators."
      }
    ],
    "sources": [
      {
        "label": "EU AI Act Article 50 text",
        "url": "https://artificialintelligenceact.eu/article/50/"
      }
    ]
  },
  {
    "lawId": "nySynthetic",
    "slug": "new-york-synthetic-performer-law",
    "title": "New York Synthetic Performer Disclosure Law (2026)",
    "metaDescription": "New York's Synthetic Performer Disclosure Law (2026) requires conspicuous disclosure of AI-generated performers in ads reaching NY consumers. Effective June 9, 2026. $1,000+ penalties.",
    "intro": "New York's Synthetic Performer Disclosure Law, effective June 9, 2026, requires anyone producing advertisements featuring AI-generated synthetic performers to include a conspicuous disclosure identifying them. A synthetic performer is an AI-created asset that creates the impression of a human performance. Where your company is based does not matter, only whether your ads reach New York consumers. Violations can result in civil penalties starting at $1,000 for the first offense and $5,000 for each subsequent offense.",
    "sections": [
      {
        "heading": "Who this law covers",
        "paragraphs": [
          "This law covers anyone producing an advertisement that reaches New York consumers and features a synthetic performer. Your company's location does not matter. If you advertise on social media, search engines, streaming platforms, or any other channel that reaches New York, you must comply.",
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
          "The law became effective on June 9, 2026, exactly 180 days after the Governor signed it on December 11, 2025. Any advertisements featuring synthetic performers displayed on or after June 9, 2026 must comply.",
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
          "Misconception: 'I only have to disclose synthetic performers if my company is based in New York.' Correction: The law applies based on where the ad is displayed, not where your company is located. If your ad reaches New York consumers on any platform, you must comply, even if you operate from another state or country.",
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
        "a": "Yes, if your advertisements reach New York consumers. The law applies based on where the ad is shown, not where your company is located. If you advertise on social media, search engines, or streaming platforms that reach New York, you must comply."
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
          "The California B.O.T. Act applies to any individual or company that operates a bot or automated account to communicate online with people in California. The law specifically targets bots used for two purposes: (1) to mislead people into buying goods or services, or (2) to mislead people about voting in elections.",
          "The law covers anyone who owns or operates the bot, regardless of whether they built it themselves or hired someone else to build it. If you are using a bot to interact with California residents, you are responsible for complying with the disclosure requirement.",
          "The law does NOT apply to internet service providers or web hosting companies just because they host bot software. The responsibility falls on the person or business actually running the bot. Banks, financial institutions, and other entities offering legitimate customer service through bots are not the target of this law if their purpose is not deception.",
          "If you operate a bot that does not interact with people in California, or if your bot is not used for commercial sales or election influence, this law does not apply to you."
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
          "The law took effect on July 1, 2019, and has been in force ever since. There is no grace period or future deadline to prepare. The law applies immediately to bots currently communicating with people in California.",
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
        "a": "No. The law only applies to bots communicating with people in California. If your bot only serves customers in other states or countries, California's B.O.T. Act does not apply. However, other states and countries may have similar laws."
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
    "metaDescription": "California SB 942 requires AI providers with over 1 million users to disclose AI-generated content and offer free detection tools. Effective August 2, 2026.",
    "intro": "California SB 942, the AI Transparency Act, is a law that requires large AI providers to be transparent about AI-generated content. It specifically targets companies that build and publish generative AI systems with over 1 million monthly users. The law does not apply to small businesses or individuals who use AI tools created by others. It requires providers to offer free detection tools and clearly label AI-generated content.",
    "sections": [
      {
        "heading": "Who this law covers",
        "paragraphs": [
          "This law applies to \"covered providers.\" A covered provider is a company that creates and publicly offers a generative AI system with over 1 million monthly users that people in California can access. This is a high bar. It targets the largest AI companies that build systems like ChatGPT or similar platforms.",
          "This law generally does not apply to small businesses, freelancers, or creators who use AI tools created by others. If you use ChatGPT to write content, or a design tool's AI features to make graphics, this law is generally understood not to apply to you. However, you should consult with a legal professional if you are unsure whether your specific situation qualifies as a covered provider.",
          "The law also does not apply if your AI system has fewer than 1 million monthly users in California. It does not apply to private or internal AI systems. It only applies to systems that are publicly accessible."
        ]
      },
      {
        "heading": "What it actually requires",
        "paragraphs": [
          "Covered providers must offer a free, publicly accessible AI detection tool. This tool must allow users to upload content and check whether that content was created or altered by the provider's AI system. The tool must include an API so developers can integrate it into their own software. Providers may collect contact information from users who voluntarily choose to share feedback, but only for the purpose of improving the tool.",
          "Providers must give users the ability to add visible labels to AI-generated content. These labels must be permanent or extraordinarily difficult to remove to the extent that is technically feasible, and understandable to a reasonable person. For example, a label might say \"Generated by [AI system name]\" or similar wording.",
          "Providers must also include hidden, machine-readable disclosures in AI-generated content. These disclosures must contain the provider's name, the system name and version number, the date and time the content was created, and a unique identifier. These hidden labels should be detectable by the provider's own AI detection tool.",
          "If a provider licenses its AI system to third parties (like a company that builds a chatbot using another company's AI), the provider must require those third parties to maintain the disclosure capabilities in their contracts. Providers must also revoke licenses within 96 hours of discovering that a licensee has disabled these disclosure features."
        ]
      },
      {
        "heading": "Deadlines and penalties",
        "paragraphs": [
          "The law was originally set to take effect on January 1, 2026, but the date was pushed back to August 2, 2026 to line up with the EU AI Act's timeline. Covered providers must be compliant by that date.",
          "The penalty for violating this law is $5,000 per day of non-compliance. Each day of violation counts as a separate violation and adds to the total penalties owed.",
          "Violations can be enforced through civil action by the California Attorney General, a city attorney, or a county counsel. Whoever brings the enforcement action can also recover attorney's fees and court costs if they win. Courts can also issue injunctions, meaning a judge can order a provider to immediately stop the violation."
        ]
      },
      {
        "heading": "What the law requires of providers",
        "paragraphs": [
          "Under this law, covered providers are required to build or integrate a detection tool that can scan content and identify whether it was created by their system. The tool must be free and easy for the public to use, and published on the provider's website or made widely available.",
          "For every piece of AI-generated content a system produces, the law requires two types of labels. First, a visible label that humans can see and understand at a glance. Second, hidden metadata embedded in the content that machines can detect. Both must clearly identify the provider's company and system.",
          "When licensing systems to other companies, the law requires providers to include contractual terms that maintain these disclosure features. Providers should build in automated checks or monitoring to verify compliance and have a clear process to revoke licenses within 96 hours of discovering non-compliance.",
          "Example visible label wording: \"This image was generated by [Your AI System Name].\" Or: \"Content created by [Provider Name] AI System v2.1.\" Example metadata might include: provider name, system name and version, a creation timestamp, and a unique identifier. A provider's detection tool should be able to read this metadata."
        ]
      },
      {
        "heading": "Common misconceptions",
        "paragraphs": [
          "Misconception: \"This law applies to any business that uses AI.\" What the law actually says: The law only applies to companies that build and publicly offer AI systems with over 1 million users. If you run a small business and use ChatGPT to draft emails, this law generally does not apply to you.",
          "Misconception: \"I need to label every AI-generated image on my website.\" What the law actually says: This law only applies if you built the AI system that generated the image. If you used someone else's tool, that tool's provider is responsible for compliance, not you.",
          "Misconception: \"The penalty is $5,000 total.\" What the law actually says: The penalty is $5,000 per day of non-compliance. If a provider is out of compliance for 30 days, the penalties could add up to $150,000 or more, plus attorney's fees.",
          "Misconception: \"This law requires me to tell people whenever they interact with AI.\" What the law actually says: The law only requires disclosures for content that was actually created or altered by the provider's AI system. Not all interactions with AI systems require separate disclosure labels."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does this law apply to my business?",
        "a": "This law generally applies only if your business built an AI system with over 1 million monthly users and you publicly offer it. If you are using AI tools created by other companies, this law generally does not apply to you. Consult a legal professional if you are unsure of your status."
      },
      {
        "q": "What counts as a 'covered provider'?",
        "a": "A covered provider is a company that creates a generative AI system and makes it publicly accessible, and that system has more than 1 million monthly users in California. The law targets large AI companies that offer chatbots, image generators, or similar products directly to the public."
      },
      {
        "q": "Do I have to label all AI content, or just some of it?",
        "a": "Under this law, providers must label content that their AI system created or altered. If a system generates an image or writes text, that must be labeled. If a human writes something and never uses the AI, no label is required."
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
        "a": "The law takes effect on August 2, 2026, pushed back from the original January 1, 2026 date to align with the EU AI Act. Covered providers must be fully compliant by that date."
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
