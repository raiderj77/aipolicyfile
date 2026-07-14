// Educational screening data reviewed against the linked primary sources on
// 2026-07-13. The checker identifies issues worth reviewing; it does not decide
// jurisdiction, legal status, or compliance.

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
    name: "FTC Endorsement Guides and Section 5",
    shortName: "FTC endorsements (US)",
    jurisdiction: "United States federal law; audience and market facts matter",
    effective: "Endorsement Guides revised June 2023; reviewed July 13, 2026",
    whoItHits:
      "Advertising endorsements with a material connection to a marketer. The FTC evaluates context and consumer understanding case by case.",
    requires: [
      "Review whether a payment, gift, affiliate commission, employment, or other material connection needs a clear and conspicuous disclosure.",
      "Confirm that any endorsement reflects an honest opinion or experience and that advertising claims are not deceptive.",
      "Do not treat this guide as an independent FTC rule requiring a separate label merely because AI assisted with content.",
    ],
    penalty:
      "The Guides do not themselves have the force of law or impose a fixed per-post fine. Remedies depend on the FTC Act, the facts, prior orders or notices, and the enforcement path.",
    officialUrl:
      "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
    officialLabel: "FTC Endorsement Guides Q&A",
  },
  euArt50: {
    id: "euArt50",
    name: "EU AI Act Article 50 transparency obligations",
    shortName: "EU AI Act Art. 50",
    jurisdiction:
      "European Union; Article 2 scope includes certain non-EU providers and deployers when AI output is used in the Union",
    effective: "Article 50 applies from August 2, 2026; reviewed July 13, 2026",
    whoItHits:
      "Providers and deployers in the categories described by Article 50. Public accessibility from the EU alone is not a complete jurisdiction test.",
    requires: [
      "Review whether you are a provider or deployer within Article 2 and whether the relevant output is used in the Union.",
      "For deployers, review the disclosure rules for deepfakes and for AI-generated or manipulated text published to inform the public on matters of public interest, including stated exceptions.",
      "For providers, review the separate machine-readable marking duty in Article 50(2); do not automatically assign that provider duty to every publisher.",
    ],
    penalty:
      "Article 99 sets maximum administrative-fine tiers, but the applicable tier, amount, SME treatment, and enforcement depend on the violated obligation and case facts.",
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en",
    officialLabel: "Official EU AI Act text (EUR-Lex)",
  },
  nySynthetic: {
    id: "nySynthetic",
    name: "New York synthetic performer advertising law",
    shortName: "New York GBL § 396-b",
    jurisdiction: "New York; coverage and publisher exceptions depend on the enacted text",
    effective: "June 9, 2026 (180 days after enactment); reviewed July 13, 2026",
    whoItHits:
      "Advertisements or promotional material using a covered synthetic performer, subject to definitions, knowledge standards, and statutory exceptions.",
    requires: [
      "Review whether the asset meets the statutory definition of a synthetic performer and whether the material is a covered advertisement.",
      "Review the conspicuous-disclosure requirement and the exceptions for audio ads, translation-only uses, expressive works, and publishing media.",
    ],
    penalty:
      "The enacted bill states $1,000 for a first violation and $5,000 for a subsequent violation; applicability still depends on the statutory elements and exceptions.",
    officialUrl: "https://www.nysenate.gov/legislation/bills/2025/S8420/amendment/A",
    officialLabel: "New York S.8420-A enacted bill",
  },
  caBot: {
    id: "caBot",
    name: "California B.O.T. Act",
    shortName: "California B.O.T. Act",
    jurisdiction: "California communications; statutory purpose and intent elements matter",
    effective: "Operative July 1, 2019; reviewed July 13, 2026",
    whoItHits:
      "Use of a bot to communicate online with a person in California with intent to mislead about its artificial identity for specified commercial or electoral purposes.",
    requires: [
      "Review whether the communication, intent, and commercial or electoral purpose elements are all present.",
      "Review the statute's clear-and-conspicuous disclosure language rather than assuming every customer-service bot is automatically covered.",
    ],
    penalty:
      "The section is tied to California unfair-competition law and does not state a fixed per-message fine. Consequences depend on the enforcement theory and facts.",
    officialUrl:
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=17941",
    officialLabel: "California Business and Professions Code § 17941",
  },
  caSb942: {
    id: "caSb942",
    name: "California AI Transparency Act (SB 942)",
    shortName: "California SB 942",
    jurisdiction: "California",
    effective: "Operative January 1, 2026; reviewed July 13, 2026",
    whoItHits:
      "A covered provider that creates a publicly accessible generative AI system with more than 1,000,000 monthly visitors or users, as defined by the statute.",
    requires: [
      "Review the detection-tool requirements if you may be a covered provider.",
      "Review the user-option for manifest disclosures and the provider duty for latent disclosures in covered image, video, and audio content.",
      "Review licensing duties; the statute does not place the same provider duties on an ordinary user of a third-party AI tool.",
    ],
    penalty:
      "The statute provides a $5,000 civil penalty per violation and treats each day of a covered provider's violation as a discrete violation.",
    officialUrl:
      "https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240SB942",
    officialLabel: "California SB 942 enacted text",
  },
};

export type LawStatus = "review" | "monitor" | "lower";

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

  if (a.publish && a.sponsored) {
    results.push({
      law: LAWS.ftc,
      status: "review",
      headline: "Material-connection and endorsement rules are worth reviewing.",
      detail:
        "Your answers suggest sponsored, gifted, or affiliate content. Review whether the relationship is material to consumers and whether the endorsement remains truthful. The FTC sources do not create a standalone AI-use labeling rule.",
      sampleDisclosure: "Ad / affiliate link: I may earn a commission if you buy through this link.",
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.ftc,
      status: "monitor",
      headline: "Review this if a marketer or other material connection is involved.",
      detail:
        "AI use alone does not trigger the FTC Endorsement Guides. Payment, gifts, affiliate commissions, employment, or another connection may change the analysis.",
    });
  }

  if (a.publish && a.euAudience) {
    results.push({
      law: LAWS.euArt50,
      status: "review",
      headline: "Article 50 may be relevant; jurisdiction and content category need review.",
      detail:
        `Article 2 and Article 50 require more than a yes/no audience check. ${a.deepfakes ? "Because you indicated deepfake-like media, Article 50(4) deserves close review." : "Review whether the output is used in the Union and whether the content falls within a provider or deployer obligation."}${a.humanReview ? " Human review and editorial responsibility may matter for covered public-interest text." : ""}`,
      sampleDisclosure: a.deepfakes
        ? "This content was artificially generated or manipulated."
        : undefined,
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.euArt50,
      status: "monitor",
      headline: "EU scope cannot be decided from public accessibility alone.",
      detail:
        "If AI output is used in the Union or your operation otherwise falls within Article 2, review the provider and deployer duties in Article 50.",
    });
  }

  if (a.nyAds) {
    results.push({
      law: LAWS.nySynthetic,
      status: "review",
      headline: "New York's synthetic-performer advertising rule may be relevant.",
      detail:
        "Review the enacted definition, actual-knowledge language, disclosure requirement, and exceptions before deciding coverage.",
      sampleDisclosure: "This advertisement includes a synthetic performer.",
    });
  }

  if (a.chatbot) {
    results.push({
      law: LAWS.caBot,
      status: "review",
      headline: "California's bot-disclosure rule may be relevant.",
      detail:
        "Coverage depends on communication with a person in California, intent to mislead about artificial identity, and a specified commercial or electoral purpose.",
      sampleDisclosure: "I am an automated assistant, not a human representative.",
    });
  }

  results.push(
    a.bigProvider
      ? {
          law: LAWS.caSb942,
          status: "review",
          headline: "You may need to review the SB 942 covered-provider definition.",
          detail:
            "Your answer is only a screening signal. Confirm the statutory visitor/user threshold, public accessibility in California, and whether you create the system.",
        }
      : {
          law: LAWS.caSb942,
          status: "lower",
          headline: "Lower apparent relevance based on your answers.",
          detail:
            "SB 942's duties are directed to defined covered providers, not automatically to ordinary users of third-party AI tools.",
        },
  );

  return results;
}
