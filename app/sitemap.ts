import type { MetadataRoute } from "next";
import { cities } from "@/lib/cities";
import { NICHES } from "@/lib/niches";
import { siteConfig } from "@/config/site";

const NICHE_KEYS = Object.keys(NICHES) as (keyof typeof NICHES)[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Homepage
  const home: MetadataRoute.Sitemap = [
    {
      url: siteConfig.domain,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // All niche × city combinations
  const pages: MetadataRoute.Sitemap = NICHE_KEYS.flatMap((niche) =>
    cities.map((city) => ({
      url: `${siteConfig.domain}/${niche}/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...home, ...pages];
}
