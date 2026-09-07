import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { projects } from "../data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-09-06");
  const routes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/coding`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/systems`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/github`, changeFrequency: "weekly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/journey`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/learning`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${SITE_URL}/visual-lab`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
  ];

  for (const p of projects) {
    routes.push({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: now,
    });
  }

  return routes;
}
