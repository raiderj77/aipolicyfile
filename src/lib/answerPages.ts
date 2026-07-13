// Question-targeted legal answer pages were removed from publication on
// 2026-07-12 because they repeated unsupported definitive conclusions. Keep
// this collection empty until each page has been independently rebuilt from
// current primary sources and reviewed as educational screening content.

export interface AnswerPage {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: { q: string; a: string }[];
}

export const ANSWER_PAGES: AnswerPage[] = [];
