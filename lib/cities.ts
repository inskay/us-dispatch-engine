import citiesData from "@/data/cities.json";
import type { City } from "@/lib/niches";

export const cities: City[] = citiesData as City[];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
