// Question-targeted answer pages. Grounded only in the verified facts in laws.ts;
// written+revised via gated pipeline 2026-07-08. Update laws.ts first when laws change.

export interface AnswerPage {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
}

export const ANSWER_PAGES: AnswerPage[] = [
  {
    "slug": "do-i-have-to-disclose-ai-generated-content",
    "title": "Do I Have to Disclose AI-Generated Content?",
    "metaDescription": "When AI disclosure is required for creators and small businesses: FTC sponsored content rules, EU AI Act Article 50, New York synthetic performers, California bot and AI transparency laws.",
    "intro": "It depends on what you're doing and where your audience is. If you post sponsored content with AI help, disclosure of both the sponsorship and the AI use is required. If EU users see your AI-generated content, Article 50 requires disclosure starting August 2, 2026. If you run ads with AI-generated people in New York, or use a chatbot to sell to Californians without saying it's a bot, disclosure is required. For most creators using AI as a tool, covered publishers need to disclose the sponsorship relationship first, then separately flag significant AI involvement.",
    "sections": [
      {
        "heading": "The FTC Rule: Sponsored Content and Meaningful AI Use",
        "paragraphs": [
          "The FTC's Endorsement Guides require disclosure when two things are true at the same time: a post is sponsored (through payment, a free product, affiliate commission, or another material benefit), AND AI generated a meaningful part of the content. Spell-check and grammar tools do not count as meaningful AI use. But if AI was used to write a product review, generate images, create a video script, or substantially draft social media copy, AI involvement must be disclosed separately from the sponsorship disclosure.",
          "Both disclosures must be clear and easy to see without clicking. In videos, they must appear on screen in the first few seconds. In text posts, use simple language like 'Sponsored: This post was written with AI help.' The FTC updated its guidance in May 2026 and is actively enforcing these rules. Each non-compliant post can draw a separate penalty, so the stakes are real for all creators and influencers.",
          "If a post is unpaid and reflects only personal opinion, the FTC Endorsement Guides generally do not require disclosure, even if AI was used to write it. The disclosure requirement applies because of the sponsorship or material benefit, not because AI was involved."
        ]
      },
      {
        "heading": "EU AI Act Article 50: Starting August 2, 2026",
        "paragraphs": [
          "If people in the European Union can see content, Article 50 of the EU AI Act requires disclosure when content is artificially generated or manipulated. This applies to text, images, audio, and video published online. Location of the creator or business does not matter. Sponsorship status does not matter. Account size does not matter. If content is AI-generated and accessible to EU users, Article 50 requires disclosure.",
          "The main exception is AI-generated text meant to inform the public: if a real person substantially reviewed it and took documented editorial responsibility for it, disclosure may not be required. But deepfakes always require disclosure, no matter what.",
          "Article 50 also requires machine-readable marking, meaning the content must be tagged so detection tools can identify it as AI-generated. A text label is not enough by itself; metadata is required. This law takes effect August 2, 2026. Generative AI systems already on the market have until December 2, 2026 to comply."
        ]
      },
      {
        "heading": "New York Synthetic Performer Rule: Already in Effect",
        "paragraphs": [
          "New York's law (S.8420-A) focuses on a specific use of AI: ads that feature synthetic performers, meaning AI-generated people who look or sound human but do not exist. If ads that reach New York consumers include synthetic performers, a conspicuous disclosure in the ad itself is required. This rule has been in effect since June 9, 2026.",
          "The law carves out some exceptions: audio-only ads, AI used only for translation, and ads for creative works where the synthetic performer use matches what appears in the actual work. But if synthetic performers are used knowingly in ads visible to New York audiences, disclosure is required."
        ]
      },
      {
        "heading": "California Bots and the August 2 AI Transparency Deadline",
        "paragraphs": [
          "California has two separate AI disclosure rules. The first is the Bot Act (in place since 2019): if a chatbot or AI agent communicates with someone in California with intent to mislead about artificial identity in order to incentivize a purchase, sale, or vote, a clear, conspicuous, in-conversation disclosure that it is a bot is required. The statute provides that a person using a bot is not liable under this section if the person discloses that it is a bot.",
          "The second is SB 942, the AI Transparency Act, which takes effect August 2, 2026. SB 942 targets companies that build large generative AI systems with over one million monthly users. It does not apply to small businesses and creators using those systems. If you use ChatGPT or Claude to write a post, SB 942 does not apply to you. It applies to OpenAI, Anthropic, and similar system providers."
        ]
      },
      {
        "heading": "How to Figure Out What Applies to You",
        "paragraphs": [
          "Start by asking: Is this post, ad, or conversation sponsored? If yes, disclosure of the sponsorship is required. Then ask: Did AI generate substantive content (not just a spelling fix)? If yes, separate disclosure of the AI involvement is required. This applies to every platform and post.",
          "Next: Can people in the EU see this content? If yes, compliance with Article 50 is required as of August 2, 2026. Disclosure that content is AI-generated and machine-readable metadata are required.",
          "Third: Is this an ad with an AI-generated person in it, and could someone in New York see it? If yes, disclosure of the synthetic performer is required.",
          "Fourth: Is a chatbot being used to sell or influence someone in California, with intent to mislead about the artificial identity? If yes, disclosure that it is a bot, in the conversation itself, is required.",
          "When uncertain whether a particular piece of AI help counts as meaningful, disclosure of the AI involvement is the safer choice. Regulators typically focus enforcement on deliberate non-disclosure rather than overcautious disclosure."
        ]
      }
    ],
    "faq": [
      {
        "q": "If I use AI to help draft a personal blog post that nobody paid me to write, do I have to disclose?",
        "a": "If there is no sponsorship or material benefit, the FTC Endorsement Guides generally do not require disclosure. However, if people in the EU can see it, the EU AI Act Article 50 requires disclosure starting August 2, 2026. So compliance depends on your audience. If you have only a US audience and the post is unpaid, the FTC does not require disclosure, but the EU rule does if any EU users can access your blog."
      },
      {
        "q": "What counts as AI use that needs disclosure?",
        "a": "Any substantive help counts: writing the main content, generating images, creating video scripts, drafting social media copy, producing audio, or manipulating media. Routine tool use like spell-check, grammar correction, or auto-captions does not count. When uncertainty exists about whether something is substantive, disclosure of the AI involvement is the safer practice."
      },
      {
        "q": "I run a chatbot that helps customers pick products on my website. Do I have to disclose it is a bot?",
        "a": "The California Bot Act requires disclosure when a bot communicates with people in California with intent to mislead about the artificial identity for commercial purposes. If your website serves only non-California or non-US audiences, the Bot Act may not apply. If your website could serve California customers, disclosure in the chat window itself is the safer practice. Make it clear and visible in the chat window itself, not hidden in a footer."
      },
      {
        "q": "Do these rules apply to small creators?",
        "a": "The FTC Endorsement Guides, the EU AI Act Article 50, and the New York synthetic performer rule do not have a size exemption. Small accounts and large accounts are subject to the same disclosure requirements. The only rule that targets large companies is SB 942, which applies to system providers with over one million monthly users, not to creators using those systems."
      }
    ]
  },
  {
    "slug": "ai-disclosure-rules-for-sponsored-content-influencers",
    "title": "AI Disclosure Rules for Influencers and Sponsored Content",
    "metaDescription": "FTC rules for creators: disclose paid partnerships AND AI involvement separately. Learn what counts as substantive AI, placement requirements, penalties, and sample wording.",
    "intro": "If you are a creator posting sponsored content or endorsements and used AI to make any of it, two separate disclosure requirements apply. The first is standard: disclose the paid relationship to your audience. The second is newer: clearly mark any content that AI generated or substantially shaped, not just routine tool use like spell check. The FTC enforces these rules actively, with civil penalties up to $53,088 per violation (2026 amount, adjusted annually); each non-compliant post can count as a separate violation. Outside the United States, the EU AI Act Article 50 takes effect August 2, 2026, applying to creators and small publishers who distribute AI-generated or AI-manipulated content to audiences that include EU users.",
    "sections": [
      {
        "heading": "Who is covered: the rules apply to creators of all sizes",
        "paragraphs": [
          "The FTC Endorsement Guides apply to every creator, influencer, and business posting sponsored content, ads, endorsements, or reviews. Account size does not matter. A brand sending a free product, paying to post, offering an affiliate link, or having any other financial arrangement creates what the law calls a material connection. When a material connection exists, disclosure of both the sponsored relationship and any meaningful AI use is required.",
          "The rules also apply when your audience includes people in the EU or California. The EU AI Act Article 50 applies to anyone distributing AI-generated or AI-manipulated content published online where EU users can access it, including solo creators and small publishers. California's Bot Act applies when a bot communicates with California residents for commercial or electoral purposes. If your audience spans these regions, these rules overlap."
        ]
      },
      {
        "heading": "What counts as substantive AI (not routine tool use)",
        "paragraphs": [
          "Spell check, grammar tools, and auto-caption generators do not require AI disclosures. Those are routine. Substantive AI means the AI did work that shaped the core content: generating text for a caption or reviews, creating images, editing or deepening video, or writing scripts. If AI was used to create something from scratch or to materially change what would have been written or made by hand, disclosure is required.",
          "A clear test: would a reasonable viewer care to know an AI was involved? If yes, disclose it. If the AI did work that a human typically does (writing, image creation, voice, video editing) rather than what a tool does (checking spelling, resizing), disclose it. When in doubt, disclose. The FTC does not require removal of AI-generated content, only clear marking."
        ]
      },
      {
        "heading": "How and where to make the disclosures",
        "paragraphs": [
          "Both disclosures must be clear, conspicuous, and visible without clicking or expanding. On social media posts, put them at the start of the caption or in the visible text before any 'more' button. On video, the AI disclosure must appear on screen within the first few seconds and stay readable. Disclosures should not be buried in hashtags, links, or captions that viewers must expand or click to see.",
          "For sponsored posts, common language is '#ad' or '#sponsored' at the front. For AI involvement, be direct: 'AI-generated image,' 'Written with AI,' or 'This video includes AI-generated scenes.' The source of the AI tool need not be disclosed, only that AI created or shaped the content. The point is providing real notice upfront to your audience."
        ]
      },
      {
        "heading": "FTC penalties and enforcement",
        "paragraphs": [
          "The FTC can impose civil penalties up to $53,088 per violation (2026 amount, adjusted annually). Each non-compliant post can count as a separate violation. If ten sponsored videos are posted with undisclosed AI and no sponsor disclosures, that could mean ten separate penalties. The FTC focuses on patterns of violation, so a single mistake is less likely to trigger action than repeated non-disclosure.",
          "The FTC has been active on AI disclosure since May 2026 and continues to update guidance. Enforcement applies equally to influencers, brands, and affiliate marketers. When you work with a brand or agency, you are responsible for your own disclosures; their disclosure in a post does not cover yours."
        ]
      },
      {
        "heading": "EU AI Act Article 50 and California Bot Act requirements",
        "paragraphs": [
          "Article 50 requires disclosure when content is artificially generated or manipulated and applies to anyone distributing such content where EU users can access it. If your audience includes people in the EU, any AI-generated text published to inform the public requires disclosure (unless a person did substantive review and a named individual takes documented editorial responsibility). The maximum penalty is up to 15 million EUR or 3 percent of global revenue, whichever is higher, but that is the statutory cap, enforcement occurs at all business scales.",
          "California's Bot Act requires clear, conspicuous disclosure when a bot talks to people in the state for commercial or electoral purposes. The statute provides that a person using a bot is not liable under this section if the person discloses that it is a bot. California SB 942, effective August 2, 2026, targets companies that build large generative AI systems (over 1 million monthly users), not creators using those systems. If you use ChatGPT or Claude to write a post, SB 942 does not apply to you; it applies to OpenAI, Anthropic, and similar providers."
        ]
      },
      {
        "heading": "Sample language and practical next steps",
        "paragraphs": [
          "Start each sponsored post with a disclosure like: 'This is a paid partnership with [Brand]. The product image was generated with AI.' If captions were written with AI help: 'This is a paid partnership with [Brand]. Text was written with AI assistance.' For video: put a text overlay in the first five seconds saying 'AI-generated scenes included' and repeat it before AI-heavy sections.",
          "Before publishing each post, verify: Is this sponsored? Disclose it. Did AI do substantive work on the images, video, audio, or text? Disclose that separately. Make both disclosures visible on the post itself. If a brand or agency provides content to post, ask if AI was used. If you are unsure, ask the AI tool itself how it works or review its terms. The safest approach is clear, upfront disclosures on every post visible without clicking."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do I have to disclose if I use AI for minor edits like grammar or caption resize?",
        "a": "No. Spell check, grammar tools, caption sizing, and auto-translate are routine tool use and do not require AI disclosure. Disclosure is required when AI does substantive work, like generating images, writing copy, editing video, or creating scripts. If using AI required deliberate choice and the output would be noticeably different without it, that is substantive."
      },
      {
        "q": "What if I get a brand deal and they provide the AI-generated content for me to post?",
        "a": "You remain responsible for the post that goes under your name. If a brand provides AI-generated images or copy, ask them to disclose that to you, then disclose it in your post. If you discover AI use after publishing, update the post with the disclosure immediately and flag it with the brand so they know their disclosure practice."
      },
      {
        "q": "How do disclosure requirements differ by country?",
        "a": "The FTC enforces in the United States. If your audience is in the EU, Article 50 applies to your content starting August 2, 2026, with penalties up to 15 million EUR or 3 percent of global revenue. California has the Bot Act (since 2019) requiring bot disclosure for commercial or electoral speech, and SB 942 (effective August 2, 2026) which targets companies building large AI systems. The safest approach is clear, upfront disclosures on every post, visible without clicking, so you are compliant everywhere."
      },
      {
        "q": "Can I just add a disclosure in the video description or pinned comment instead of on screen?",
        "a": "For video, the FTC guidance emphasizes that on-screen disclosures within the first few seconds are more likely to satisfy the clear-and-conspicuous standard. A description or pinned comment alone is unlikely to meet that standard. Put text or graphics on the video itself so anyone watching sees the disclosure immediately."
      }
    ]
  },
  {
    "slug": "eu-ai-act-article-50-checklist-small-business",
    "title": "EU AI Act Article 50 Checklist: Small Businesses and Creators (US & International)",
    "metaDescription": "EU AI Act Article 50 takes effect August 2, 2026. Who counts as a deployer, when US publishers are in scope, deepfake and AI-text rules, machine-readable marking, and your pre-deadline checklist.",
    "intro": "If you publish AI-generated or AI-manipulated content online, and anyone in the EU can see it, Article 50 of the EU AI Act applies starting August 2, 2026. This includes solo creators, small businesses, and publishers outside the EU. The law requires disclosure when content is artificially generated or manipulated, labels for deepfakes, machine-readable marking of AI outputs, and in some cases documented editorial review. There are under four weeks until the effective date.",
    "sections": [
      {
        "heading": "Who Counts as a Deployer Under Article 50",
        "paragraphs": [
          "Article 50 targets providers and deployers of covered AI systems. Solo creators and small businesses that use consumer AI tools (like ChatGPT, Claude, Midjourney, or similar) to publish AI-generated or AI-manipulated content count as deployers of that AI system when they distribute the output online.",
          "The law applies regardless of where a publisher is based. If people in the EU can access a website, YouTube channel, social media posts, or any other publication, that content is published to the EU. US-based creators, UK creators, Australian creators, and publishers from anywhere else fall under this rule if they have online audiences in the EU.",
          "Article 50 applies when content falls into covered categories: text generated by AI and meant to inform the public; images, audio, or video generated or significantly manipulated by AI; or deepfakes (synthetic media that makes someone appear to say or do something they did not). Routine AI use like spell check or grammar tools does not count."
        ]
      },
      {
        "heading": "The Disclosure and Labeling Requirements",
        "paragraphs": [
          "For deepfakes, disclosure is mandatory. Any synthetic video, audio, or image that makes a real person appear to do something they did not do must be clearly labeled as artificially generated or manipulated. There is no exception.",
          "For AI-generated text meant to inform the public, Article 50 requires disclosure that it was AI-generated, unless a person did substantive review of the content and someone took documented editorial responsibility for it. Editorial responsibility means a real person is named or identified as accountable for the accuracy and integrity of the published text.",
          "For all covered AI outputs, machine-readable marking (metadata) is required so the content can be detected as AI-generated. This is not just a visible label on the page. The metadata must be embedded in or attached to the content so automated detection systems and researchers can identify it. Different formats require different approaches: for images and video, EXIF data or embedded metadata; for web pages, meta tags or schema markup."
        ]
      },
      {
        "heading": "The Editorial Review Exception",
        "paragraphs": [
          "Article 50 permits an exception for AI-generated text when a person reviews it for accuracy, relevance, and integrity before publication, and someone with editorial authority takes documented responsibility for the published version. Editorial responsibility requires a real person to be named or identified as accountable for the content's accuracy and integrity.",
          "The documented review and responsibility requirement is meaningful. The publisher must have a record showing a real person read the content, made judgment calls about its quality and truthfulness, and is willing to stand behind it. This approach typically applies to publishers, news sites, and organizations with editorial workflows.",
          "For small creators or solo publishers without an editorial team or formal review process, compliance typically requires disclosure of all AI-generated text meant to inform the public."
        ]
      },
      {
        "heading": "Deepfakes, Synthetic Media, and Scope",
        "paragraphs": [
          "Deepfakes have zero tolerance under Article 50. Synthetic media that shows a real person appearing to say, do, or express something they did not must be labeled as artificially generated or manipulated. No exceptions exist for satire, fiction, or news commentary.",
          "Audio deepfakes are covered. An AI voice that imitates a real person's voice, used in a video or publication that implies the real person said those words, is a deepfake and must be disclosed.",
          "A transition rule provides some flexibility: generative AI systems already on the market before August 2, 2026 have until December 2, 2026 to comply with these rules. If a publisher has been using a particular AI tool before August 2, there is an extra four months. New AI tools or content created after August 2 must comply immediately."
        ]
      },
      {
        "heading": "Compliance Steps Before August 2, 2026",
        "paragraphs": [
          "Compliance generally involves reviewing recent content. Publishers using AI-generated images, videos, text, or audio should go back through recent posts and identify covered material. Deepfakes require action even before August 2 if any have been published.",
          "Publishers typically must plan their disclosure and metadata approach. For images, this may involve using EXIF data, embedded metadata, or visible labels. For videos, research into embedding metadata or watermarks may be needed. For text, planning where disclosures will appear is necessary. For web pages, adding meta tags or schema markup signals AI generation.",
          "Documented editorial review processes should be prepared. If a person reviews content before publishing, noting who, when, and what they checked helps demonstrate compliance. This matters especially for news, research, or public-facing business content.",
          "Disclosure language should be designed clearly and conspicuously. Examples include: 'This image was generated using Midjourney' or 'This article was written with AI assistance and reviewed by [Name].' Publishers should consult the official EU AI Act Article 50 text and implementation guidance as it becomes available.",
          "Testing machine-readable markup is part of compliance. Publishers who work on websites should add the metadata and verify it is readable. Browser developer tools or metadata validators can confirm the markup is present and correct."
        ]
      }
    ],
    "faq": [
      {
        "q": "Do I have to stop using AI tools after August 2?",
        "a": "No. Article 50 does not ban AI use. It requires disclosure and machine-readable marking. Publishers can continue using AI tools; the law requires that they disclose when they do and label the outputs clearly."
      },
      {
        "q": "What if I publish AI content only to US audiences, not the EU?",
        "a": "If a website, social media account, or other platform is publicly accessible and people in the EU can reach it, Article 50 applies. It is difficult to guarantee that EU audiences cannot access content unless active measures like blocking EU traffic are in place. The safer assumption is that EU audiences can access publicly available work."
      },
      {
        "q": "Is a disclosure in a caption or comment enough, or do I need metadata too?",
        "a": "Article 50 requires both. A visible disclosure is important for human readers. Machine-readable marking is required so platforms, regulators, and AI detection systems can identify the content automatically. Metadata alone, without a visible label, is also insufficient. Compliance requires both together."
      },
      {
        "q": "What is the penalty if I do not comply?",
        "a": "The maximum civil penalty is up to 15 million EUR or 3 percent of total worldwide annual turnover, whichever is higher. Small businesses and creators are not exempt from this penalty structure. Ensuring compliance is typically cost-effective compared to the potential exposure."
      }
    ]
  },
  {
    "slug": "do-chatbots-have-to-say-they-are-bots",
    "title": "Do Chatbots Have to Identify Themselves as Bots?",
    "metaDescription": "California B.O.T. Act requires clear disclosure that users are talking to a bot when it's used to sell something or influence votes. Learn what counts as a bot, how to disclose properly, and why disclosure matters under multiple US and EU laws.",
    "intro": "In California, the B.O.T. Act requires clear disclosure when a bot communicates with someone in the state with intent to mislead about its artificial identity, for the purpose of selling something or influencing a vote. The statute provides that a person using a bot is not liable under this section if the person discloses that it is a bot, clearly and conspicuously. This requirement applies to anyone communicating with people in California through a bot, no matter where the business is based.",
    "sections": [
      {
        "heading": "Who the California B.O.T. Act Covers",
        "paragraphs": [
          "The B.O.T. Act applies when someone uses a bot or AI chat agent to talk with people in California AND both of these are true: the person intends the recipient to be misled about whether the account is automated, and the purpose is to sell something or influence a purchase or a vote. A bot is defined as an automated online account where substantially all the actions are not coming from a real person.",
          "The law does not target bots used for customer service, information, entertainment, or routine automation. It specifically addresses the scenario where a bot tries to persuade or sell while the recipient believes they are talking to a human.",
          "The B.O.T. Act applies to any bot communicating with Californians that meets both the intent-to-mislead and commercial-or-electoral-purpose elements, whether on a website, in text messages, on social media, or in email."
        ]
      },
      {
        "heading": "What Clear and Conspicuous Disclosure Means",
        "paragraphs": [
          "Clear and conspicuous means the person needs to know it is a bot without clicking links, scrolling, or reading fine print. The disclosure must be visible and understandable in the moment they are interacting with the bot. In a chat conversation, this typically means stating at the start or early in the exchange that they are talking to a bot.",
          "Good disclosure examples include: \"You are chatting with an automated bot,\" \"This is a chatbot and not a person,\" or \"Automated system: I am a bot.\" The language does not have to be fancy. It just needs to be plain English that a typical person understands immediately.",
          "The law requires disclosure to be reasonably designed to inform the person they are talking to a bot. That means the disclosure needs to be in a place and format where the person will actually see it before they continue the conversation."
        ]
      },
      {
        "heading": "The Safe Harbor: Disclose and Liability Is Eliminated",
        "paragraphs": [
          "California Business and Professions Code Section 17941 contains an explicit safe harbor. The statute provides that a person using a bot is not liable under this section if the person discloses that it is a bot, with disclosure clear and conspicuous and reasonably designed to inform.",
          "This safe harbor does not require getting permission first or jumping through extra hoops. Disclosing the bot status in a clear, visible way meets the legal standard. The statute does not require proving the person understood or agreed; it requires that the disclosure was clear and reasonably designed to inform.",
          "The safe harbor eliminates liability under the California unfair competition standard. It does not protect against other laws (like FTC rules on material connections or deepfakes), but it addresses the primary California B.O.T. Act risk."
        ]
      },
      {
        "heading": "Why Disclosure Matters Beyond California",
        "paragraphs": [
          "Even if customers are not in California, disclosure aligns with broader regulatory trends. The FTC Endorsement Guides require clear disclosure when a sponsored post or endorsement includes substantive AI-generated content (not routine tool use). That rule applies nationwide. If a bot is writing sales pitches or reviews as part of a paid endorsement or material connection, the FTC expects disclosure of both the material relationship and the AI involvement.",
          "The EU AI Act Article 50 takes effect August 2, 2026. It requires disclosure when AI generates or manipulates text, images, audio, or video published online. If anyone in the EU can see content, compliance is required. The trend across multiple jurisdictions is clear: disclosure of AI involvement is becoming a baseline requirement.",
          "Disclosure also builds trust. People are more likely to engage with a bot they know is a bot than one they discover is fake after committing time or money. Transparent disclosure reduces friction and improves user relationships."
        ]
      },
      {
        "heading": "Upcoming Changes and Multi-Jurisdiction Compliance",
        "paragraphs": [
          "California SB 942, the AI Transparency Act, takes effect August 2, 2026. SB 942 targets companies that build publicly accessible generative AI systems with over one million monthly users. It does not apply to small businesses or creators merely using AI tools. If a business uses ChatGPT or Claude to write messages, SB 942 does not apply to that business. It applies to OpenAI, Anthropic, and other large AI system providers.",
          "The trend across California, the EU, and US federal enforcement is toward mandatory disclosure of AI involvement. The B.O.T. Act has been in force since 2019. The new rules reinforce the pattern: transparency is becoming the legal standard. Businesses using bots to communicate with people about products or votes should disclose the automated nature. That approach keeps operations aligned with current requirements and ready for future rules."
        ]
      }
    ],
    "faq": [
      {
        "q": "Does the B.O.T. Act apply to chatbots used only for customer service?",
        "a": "The B.O.T. Act specifically targets bots used to sell something or influence a vote with intent to mislead about the bot's identity. Bots answering FAQs, helping with returns, or providing information without a sales or electoral purpose are not the focus of the statute. However, other laws (like FTC rules on endorsed content or the EU AI Act) may apply depending on what the bot does and where its users are located."
      },
      {
        "q": "What if someone does not read the disclosure?",
        "a": "Under the B.O.T. Act safe harbor, if disclosure was clear, conspicuous, and reasonably designed to inform, the legal standard is met. Liability is eliminated by following the statute's safe harbor provision. The law does not require verifying that the person actually read the disclosure, only that it was visible and understandable to a typical person in that context."
      },
      {
        "q": "Do I need to disclose if I am using AI to write content that a human then sends?",
        "a": "That depends on the specifics. If a person wrote the message and sent it through an automated system, the B.O.T. Act may not apply if the bot is not substantially automating the actions and there is no intent to mislead about the artificial identity. However, FTC rules on material connections in endorsements and the EU AI Act rules on AI-generated content may apply separately. The safest practice is to consider disclosure when a bot is communicating in a commercial or electoral context."
      },
      {
        "q": "What is the difference between the B.O.T. Act and California SB 942?",
        "a": "The B.O.T. Act (in force since 2019) applies when someone uses a bot with intent to mislead about its artificial identity for sales or votes, and it targets anyone using such a bot. SB 942 (taking effect August 2, 2026) targets the companies that build large generative AI systems with over one million monthly users. It requires those providers to offer detection tools and labeling. If a business uses a third-party chatbot platform, the platform handles SB 942 compliance. The business handles B.O.T. Act disclosure."
      }
    ]
  }
];
