import { getLegalReviewStatus } from "../src/lib/laws.ts";

const review = getLegalReviewStatus();

if (review.overdue) {
  console.error(
    `SOURCE REVIEW OVERDUE: substantive review was due ${review.nextReviewDue}. ` +
      `Last substantive review: ${review.reviewedDate}. ` +
      `Last automated source check: ${review.lastAutomatedSourceCheckDate}.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `Legal source review is current through ${review.nextReviewDue}; ` +
      `last substantive review ${review.reviewedDate}.`,
  );
}
