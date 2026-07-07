import type { MetadataRoute } from "next";

const BASE = "https://aipolicyfile.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-07");
  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/checker`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/disclaimer`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
