import type { MetadataRoute } from "next";
import { LAW_PAGE_SLUGS } from "@/lib/lawPageSlugs";
import { ANSWER_PAGES } from "@/lib/answerPages";
import { LEGAL_REVIEW_DATE } from "@/lib/laws";

const BASE = "https://aipolicyfile.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalReviewDate = new Date(LEGAL_REVIEW_DATE);
  const siteUpdateDate = new Date("2026-08-02");
  const lawPages: MetadataRoute.Sitemap = Object.values(LAW_PAGE_SLUGS).map((slug) => ({
    url: `${BASE}/laws/${slug}`,
    lastModified: legalReviewDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const answerPages: MetadataRoute.Sitemap = ANSWER_PAGES.map((p) => ({
    url: `${BASE}/answers/${p.slug}`,
    lastModified: legalReviewDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [
    { url: `${BASE}/`, lastModified: legalReviewDate, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/checker`, lastModified: legalReviewDate, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/tracker`, lastModified: legalReviewDate, changeFrequency: "weekly", priority: 0.9 },
    ...lawPages,
    ...answerPages,
    { url: `${BASE}/about`, lastModified: siteUpdateDate, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/editorial-standards`, lastModified: siteUpdateDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/disclaimer`, lastModified: siteUpdateDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: siteUpdateDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: siteUpdateDate, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: siteUpdateDate, changeFrequency: "yearly", priority: 0.3 },
  ];
}
