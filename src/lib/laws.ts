// Educational screening data reviewed against the linked primary sources on
// 2026-08-02. The checker identifies issues worth reviewing; it does not decide
// jurisdiction, legal status, or compliance.

export const LEGAL_REVIEW_DATE = "2026-08-02";
export const LEGAL_REVIEW_LABEL = "August 2, 2026";
export const NEXT_LEGAL_REVIEW_DUE = "2026-08-09";

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
    effective: `Endorsement Guides revised June 2023; reviewed ${LEGAL_REVIEW_LABEL}`,
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
    effective: `Article 50 applies from August 2, 2026; reviewed ${LEGAL_REVIEW_LABEL}`,
    whoItHits:
      "Providers and deployers in the categories described by Article 50. Public accessibility from the EU alone is not a complete jurisdiction test.",
    requires: [
      "Review whether you are a provider or deployer within Article 2 and whether the relevant output is used in the Union.",
      "For providers of systems intended to interact directly with people, review the Article 50(1) first-interaction notice and its stated exception.",
      "For deployers, review Article 50(3) for emotion-recognition and biometric-categorisation systems and Article 50(4) for deepfakes and specified public-interest text, including category-specific exceptions.",
      "For providers, review the separate machine-readable marking duty in Article 50(2). Regulation (EU) 2026/1744 delays only that paragraph until December 2, 2026 for covered systems placed on the market before August 2, 2026; it does not postpone the other Article 50 duties.",
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
    effective: `June 9, 2026 (180 days after enactment); reviewed ${LEGAL_REVIEW_LABEL}`,
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
    effective: `Operative July 1, 2019; reviewed ${LEGAL_REVIEW_LABEL}`,
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
    name: "California AI Transparency Act (SB 942, as amended by AB 853)",
    shortName: "California AI Transparency Act",
    jurisdiction: "California",
    effective: `Chapter operative August 2, 2026; added platform duties begin January 1, 2027 and capture-device duties January 1, 2028; reviewed ${LEGAL_REVIEW_LABEL}`,
    whoItHits:
      "Defined covered providers and affected third-party licensees; defined large online platforms and GenAI system hosting platforms beginning January 1, 2027; and defined capture device manufacturers for specified devices beginning January 1, 2028.",
    requires: [
      "If you create, code, or otherwise produce a public GenAI system with more than 1,000,000 monthly visitors or users and California accessibility, review the no-cost detection-tool, manifest-option, latent-disclosure, privacy, and licensing duties operative August 2, 2026.",
      "If you operate a defined large online platform that exceeded 2,000,000 unique monthly users during the preceding 12 months, review the provenance-data interface and anti-stripping duties that become operative January 1, 2027.",
      "If you operate a defined GenAI system hosting platform, review the January 1, 2027 restriction on knowingly making available a system that does not place the required disclosures.",
      "If you manufacture capture devices for sale in California, review the technically feasible latent-disclosure duties for devices first produced for sale on or after January 1, 2028.",
      "If you are a third-party licensee of a covered provider's GenAI system, review the cease-use duty after the provider revokes authorization under the stated knowledge and modification conditions.",
    ],
    penalty:
      "The current code sets a $5,000 civil penalty per violation. It treats each day that a covered provider, large online platform, or capture device manufacturer violates the chapter as a discrete violation; a separate remedy applies to the specified third-party-licensee violation.",
    officialUrl:
      "https://www.leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=25.&division=8.&lawCode=BPC&part=&title=",
    officialLabel: "Current California Business and Professions Code, Chapter 25",
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
        "Your answer groups paid, gifted, and affiliate relationships that require different factual wording. Identify the actual connection before choosing a disclosure, then review whether consumers would notice and understand it and whether the endorsement remains truthful. The FTC sources do not create a standalone AI-use labeling rule.",
    });
  } else if (a.publish) {
    results.push({
      law: LAWS.ftc,
      status: "monitor",
      headline: "Review this if a marketer or other material connection is involved.",
      detail:
        "AI use alone does not trigger the FTC Endorsement Guides. Payment, gifts, affiliate commissions, employment, or another connection may change the analysis.",
    });
  } else {
    results.push({
      law: LAWS.ftc,
      status: "lower",
      headline: "Lower apparent relevance based on the publishing answers.",
      detail:
        "Your answers did not identify published AI-assisted endorsements. If you later publish a paid, gifted, affiliate, employee, or other connected endorsement, review the actual relationship and advertising claims rather than reusing a generic disclosure.",
    });
  }

  if (a.chatbot || a.deepfakes || (a.publish && a.euAudience)) {
    const signals = [
      a.chatbot
        ? "Your chatbot answer raises the provider notice in Article 50(1) if EU scope and the provision's other elements are met."
        : null,
      a.deepfakes
        ? "Your realistic-media answer raises the deployer disclosure in Article 50(4) if EU scope, the definition, and the provision's other elements are met."
        : null,
      a.publish && a.euAudience
        ? "Your publication and EU-access answers warrant a closer Article 2 and Article 50 role-and-content review."
        : null,
    ].filter((signal): signal is string => signal !== null);

    results.push({
      law: LAWS.euArt50,
      status: "review",
      headline: "Article 50 may be relevant; jurisdiction and content category need review.",
      detail:
        `${signals.join(" ")} Article 2 and Article 50 require more than these screening answers.${a.humanReview ? " Human review and identified editorial responsibility may matter for specified public-interest text, but do not create a universal exception." : ""} These eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).`,
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
        "If AI output is used in the Union or your operation otherwise falls within Article 2, review the provider and deployer duties in Article 50. These eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).",
    });
  } else {
    results.push({
      law: LAWS.euArt50,
      status: "lower",
      headline: "Lower apparent relevance based on the answers screened.",
      detail:
        "Your answers did not identify the publication, realistic-media, or direct-interaction signals screened here. This is not a jurisdiction conclusion, and these eight questions do not screen emotion-recognition or biometric-categorisation systems under Article 50(3).",
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
  } else {
    results.push({
      law: LAWS.nySynthetic,
      status: "lower",
      headline: "Lower apparent relevance based on the advertising answer.",
      detail:
        "Your answers did not identify an advertisement using a human-like synthetic performer that could reach New York. A different asset, distribution plan, or knowledge fact may change that screening result.",
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
  } else {
    results.push({
      law: LAWS.caBot,
      status: "lower",
      headline: "Lower apparent relevance based on the chatbot answer.",
      detail:
        "Your answers did not identify a sales or influence chatbot. If that changes, review the California communication, location, intent-to-mislead, deception, and commercial or electoral purpose elements together.",
    });
  }

  results.push(
    a.bigProvider
      ? {
          law: LAWS.caSb942,
          status: "review",
          headline: "A California AI Transparency Act business role may need review.",
          detail:
            "Your answer groups several different statutory roles and dates. Confirm whether you are a covered provider, affected third-party licensee, large online platform, GenAI system hosting platform, or capture device manufacturer, then review the provisions and operative date for that role. SB 1000 is still pending and is not current law as of this review.",
        }
      : {
          law: LAWS.caSb942,
          status: "lower",
          headline: "Lower apparent relevance based on your answers.",
          detail:
            "Your answers did not identify one of the screened provider, licensee, platform, hosting, or device-manufacturer roles. Ordinary use of a third-party AI tool does not by itself make a business one of those regulated entities, but the current statutory definitions and staged dates control.",
        },
  );

  return results;
}
