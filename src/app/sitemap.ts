import type { MetadataRoute } from "next";
import { LAW_PAGE_SLUGS } from "@/lib/lawPageSlugs";
import { ANSWER_PAGES } from "@/lib/answerPages";

const BASE = "https://aipolicyfile.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const legalReviewDate = new Date("2026-07-13");
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
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/checker`, changeFrequency: "monthly", priority: 0.9 },
    ...lawPages,
    ...answerPages,
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
