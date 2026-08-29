import { LAW_PAGE_SLUGS } from "@/lib/lawPageSlugs";
import { getLawReviewStatus, getLegalReviewStatus, LAWS } from "@/lib/laws";

export function getLlmsText(asOf: Date = new Date()): string {
  const review = getLegalReviewStatus(asOf);
  const sourceStatus = review.overdue
    ? [
        "SOURCE REVIEW OVERDUE",
        `The scheduled source-review date was ${review.nextReviewDueLabel}.`,
        "Review each linked official source before relying on a summary or checker result.",
      ]
    : ["CURRENT WITHIN REVIEW WINDOW"];

  const frameworks = Object.values(LAWS).map((law) => {
    const lawReview = getLawReviewStatus(law, asOf);
    return `- ${law.name}: ${law.timingSummary}. Review status: ${lawReview.overdue ? "SOURCE REVIEW OVERDUE" : "CURRENT WITHIN REVIEW WINDOW"}. Source version: ${law.review.sourceDataVersion}. Last substantive human review: ${lawReview.reviewedDate}. Last automated source check: ${lawReview.lastAutomatedSourceCheckDate}. Automated coverage: ${lawReview.automatedSourceCheckStatus}; ${lawReview.automatedSourceCheckNote} Official sources: ${law.officialSources.map((source) => source.canonicalUrl).join(", ")}. Guide: https://aipolicyfile.com/laws/${LAW_PAGE_SLUGS[law.id]}`;
  });

  return [
    "# AI Policy File",
    "",
    "> Free eight-question educational screener that helps creators and small",
    "> businesses identify five AI-disclosure frameworks that may warrant review.",
    "> It provides source-based explanations and official links; it does not decide",
    "> jurisdiction, coverage, compliance, or legal duties.",
    "",
    "## Source review status",
    "",
    ...sourceStatus,
    `Last substantive review: ${review.reviewedLabel}.`,
    `Last automated source check: ${review.lastAutomatedSourceCheckLabel}.`,
    `Automated source coverage: ${review.automatedSourceCheckStatus}. ${review.automatedSourceCheckNote}`,
    `Source data version: ${review.sourceDataVersion}.`,
    `Checker version: ${review.checkerVersion}.`,
    `Reviewer: ${review.reviewer}.`,
    `Status as of: ${asOf.toISOString()}.`,
    "The automated check does not replace substantive human review.",
    "",
    "## Frameworks covered",
    "",
    ...frameworks,
    "",
    "## Pages",
    "",
    "- Home: https://aipolicyfile.com/",
    "- Checker: https://aipolicyfile.com/checker",
    "- Source tracker: https://aipolicyfile.com/tracker",
    "- Downloadable tracker: https://aipolicyfile.com/downloads/ai-disclosure-law-tracker.csv",
    "- About: https://aipolicyfile.com/about",
    "- Editorial standards: https://aipolicyfile.com/editorial-standards",
    "- Corrections: https://aipolicyfile.com/corrections",
    "- Accessibility: https://aipolicyfile.com/accessibility",
    "- AI transparency: https://aipolicyfile.com/ai-transparency",
    "- Security: https://aipolicyfile.com/security",
    "- Privacy: https://aipolicyfile.com/privacy",
    "- Disclaimer: https://aipolicyfile.com/disclaimer",
    "- Contact: https://aipolicyfile.com/contact",
    "- Terms: https://aipolicyfile.com/terms",
    "",
    "## Important checker limits",
    "",
    "The checker does not screen emotion-recognition or biometric-categorisation systems",
    "under EU AI Act Article 50(3). Its final California question groups several",
    "different provider, licensee, platform, hosting, and manufacturer roles with",
    "different definitions, conditions, and operative dates. The official sources control.",
    "",
  ].join("\n");
}
