// AI disclosure laws covered by the checker. Facts researched and verified
// July 2026 against primary sources; every entry links the official text.
// This is educational information, not legal advice, and the copy that
// renders it must always say so.

export interface Law {
  id: string;
  name: string;
  shortName: string;
  jurisdiction: string;
  effective: string;
  whoItHits: string;
  requires: string[];
  penalty: string;
  officialUrl: string;
  officialLabel: string;
}

export const LAWS: Record<string, Law> = {
  ftc: {
    id: "ftc",
    name: "FTC Endorsement Guides, AI disclosure guidance",
    shortName: "FTC (United States)",
    jurisdiction: "United States, federal",
    effective: "Updated guidance May 2026; enforcement active",
    whoItHits:
      "Any creator, influencer, or business publishing sponsored content, ads, endorsements, or reviews made with meaningful AI help. Small accounts are just as liable as big brands.",
    requires: [
      "Disclose the paid or sponsored relationship, and separately disclose AI involvement when AI generated substantive content (not routine tool use like spell check).",
      "Make the disclosure clear and conspicuous: visible without clicking, and for video, on screen within the first few seconds.",
    ],
    penalty:
      "Civil penalties up to $53,088 per violation (2026 amount, adjusted annually). Each non-compliant post can count separately.",
    officialUrl:
      "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
    officialLabel: "FTC Endorsement Guides",
  },
  euArt50: {
    id: "euArt50",
    name: "EU AI Act, Article 50 transparency obligations",
    shortName: "EU AI Act Art. 50",
    jurisdiction: "European Union (applies to anyone publishing to EU audiences)",
    effective:
      "August 2, 2026 (December 2, 2026 for generative AI systems already on the market before that date)",
    whoItHits:
      "Anyone deploying AI that generates or manipulates text, images, audio, or video published online, including small businesses and solo creators, when people in the EU can access the content.",
    requires: [
      "Disclose when content is artificially generated or manipulated. Deepfakes must always be labeled.",
      "AI-generated text published to inform the public needs disclosure unless a person did substantive review and someone takes documented editorial responsibility.",
      "Machine-readable marking (metadata) so the content is detectable as AI-generated.",
    ],
    penalty:
      "Up to 15 million EUR or 3% of total worldwide annual turnover, whichever is higher.",
    officialUrl: "https://artificialintelligenceact.eu/article/50/",
    officialLabel: "EU AI Act Article 50 text",
  },
  nySynthetic: {
    id: "nySynthetic",
    name: "New York Synthetic Performer Disclosure Law",
    shortName: "New York (S.8420-A)",
    jurisdiction: "New York State (any ad that reaches New York consumers)",
    effective: "June 9, 2026",
    whoItHits:
      "Anyone producing ads that reach New York consumers and feature AI-generated synthetic performers, meaning human-looking or human-sounding people who do not exist. Where your company is based does not matter.",
    requires: [
      "Include a conspicuous disclosure in the ad that a synthetic performer was used.",
    ],
    penalty:
      "$1,000 for a first violation, $5,000 for each one after that (civil penalties).",
    officialUrl: "https://www.nysenate.gov/legislation/bills/2025/S8420",
    officialLabel: "New York Senate bill S.8420-A",
  },
  caBot: {
    id: "caBot",
    name: "California B.O.T. Act (bot disclosure)",
    shortName: "California B.O.T. Act",
    jurisdiction: "California (bots communicating with people in California)",
    effective: "In force since July 1, 2019",
    whoItHits:
      "Anyone using a bot or AI chat agent to communicate with people in California in order to sell something or influence a purchase or a vote, while hiding that it is a bot.",
    requires: [
      "Disclose clearly and conspicuously that the customer is talking to a bot, in the conversation itself.",
    ],
    penalty:
      "Enforced under California unfair competition law; no fixed per-violation dollar amount in the statute.",
    officialUrl:
      "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=201720180SB1001",
    officialLabel: "California SB 1001 (B.O.T. Act)",
  },
  caSb942: {
    id: "caSb942",
    name: "California SB 942 (AI Transparency Act)",
    shortName: "California SB 942",
    jurisdiction: "California",
    effective: "August 2, 2026 (pushed back from January 2026 to align with the EU AI Act)",
    whoItHits:
      "Providers of publicly accessible generative AI systems with over 1,000,000 monthly users. This targets the companies that BUILD large AI systems, not the businesses that use them.",
    requires: [
      "Offer a free public AI detection tool for content made by their system.",
      "Provide visible labels and machine-readable metadata identifying AI-generated content.",
    ],
    penalty: "$5,000 per violation, per day of non-compliance.",
    officialUrl:
      "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942",
    officialLabel: "California SB 942",
  },
};

export type LawStatus = "action" | "watch" | "clear";

export interface LawResult {
  law: Law;
  status: LawStatus;
  headline: string;
  detail: string;
  sampleDisclosure?: string;
}

export interface CheckerAnswers {
  publish: boolean;
  sponsored: boolean;
  humanReview: boolean;
  euAudience: boolean;
  deepfakes: boolean;
  nyAds: boolean;
  chatbot: boolean;
  bigProvider: boolean;
}

export function evaluate(a: CheckerAnswers): LawResult[] {
  const results: LawResult[] = [];

  // FTC
  if (a.publish && a.sponsored) {
    results.push({
      law: LAWS.ftc,
      status: "action",
      headline: "The FTC guidance applies to your sponsored content.",
      detail:
        "You need two disclosures on sponsored posts made with meaningful AI help: the paid relationship, and the AI involvement. Both must be visible without clicking.",
      sampleDisclosure:
        "Paid partnership with [brand]. Parts of this content were created with AI assistance.",
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.ftc,
      status: "watch",
      headline: "Not triggered today, but it applies the moment content is sponsored.",
      detail:
        "The FTC guidance turns on when a post is paid, gifted, or affiliate-linked. If you ever monetize a post that used AI, both disclosures apply.",
    });
  }

  // EU Art. 50
  if (a.publish && a.euAudience) {
    const exceptionNote =
      a.humanReview && !a.deepfakes
        ? " For AI-written text, your human review may qualify for the editorial-control exception, but the review must be substantive and someone must take documented responsibility. Spell-checking does not count."
        : "";
    results.push({
      law: LAWS.euArt50,
      status: "action",
      headline: a.deepfakes
        ? "Article 50 applies, and deepfake content must always be labeled."
        : "Article 50 applies to your AI content that EU audiences can see.",
      detail:
        "From August 2, 2026, AI-generated or AI-manipulated content published where EU users can access it needs disclosure and machine-readable marking." +
        exceptionNote,
      sampleDisclosure: a.deepfakes
        ? "This content was digitally created or altered with AI."
        : "This content was created with the assistance of AI.",
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.euArt50,
      status: "watch",
      headline: "Only out of scope while EU users cannot access your content.",
      detail:
        "Article 50 reaches anyone publishing to EU audiences, not just EU companies. A public website is usually accessible from the EU, so treat this as likely to apply unless you geo-restrict.",
    });
  }

  // New York
  if (a.nyAds) {
    results.push({
      law: LAWS.nySynthetic,
      status: "action",
      headline: "Your ads with synthetic performers need a New York disclosure.",
      detail:
        "Since June 9, 2026, ads reaching New York consumers that feature AI-generated human-like performers must conspicuously disclose it, no matter where your business is based.",
      sampleDisclosure: "This advertisement features a synthetic (AI-generated) performer.",
    });
  }

  // California B.O.T. Act
  if (a.chatbot) {
    results.push({
      law: LAWS.caBot,
      status: "action",
      headline: "Your sales chatbot needs to identify itself to California users.",
      detail:
        "If your bot talks to customers to sell or influence a purchase, California has required a clear in-conversation bot disclosure since 2019.",
      sampleDisclosure:
        "Hi! I am an automated assistant (a bot). Ask me anything, or type AGENT to reach a human.",
    });
  }

  // SB 942
  results.push(
    a.bigProvider
      ? {
          law: LAWS.caSb942,
          status: "action",
          headline: "As a large generative AI provider, SB 942 applies to you directly.",
          detail:
            "You will need a free public detection tool plus visible and machine-readable labeling for content your system produces.",
        }
      : {
          law: LAWS.caSb942,
          status: "clear",
          headline: "Probably not you. SB 942 targets large AI providers.",
          detail:
            "This law covers companies operating public generative AI systems with over one million monthly users. Businesses that merely USE AI tools are not the target.",
        }
  );

  return results;
}
