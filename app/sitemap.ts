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

  // 3 Primary Service Hubs (e.g. /water-damage, /pest-control, /roof-repair)
  const serviceHubs: MetadataRoute.Sitemap = NICHE_KEYS.map((service) => ({
    url: `${siteConfig.domain}/${service}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.95,
  }));

  // All city × service combinations
  const cityPages: MetadataRoute.Sitemap = NICHE_KEYS.flatMap((service) =>
    cities.map((city) => ({
      url: `${siteConfig.domain}/${service}/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }))
  );

  return [...home, ...serviceHubs, ...cityPages];
}
