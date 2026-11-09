import citiesData from "@/data/cities.json";
import type { City } from "@/lib/niches";

export const cities: City[] = citiesData as City[];

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// Regional state risk profile generator for dynamic fallbacks
function getStateRisks(stateCode: string): { climate: string; pest: string; roof: string } {
  const code = stateCode.toUpperCase();
  const tropicalStates = ["FL", "LA", "MS", "AL", "TX", "GA", "SC", "NC"];
  const desertStates = ["AZ", "NV", "NM", "UT"];
  const coldStates = ["OH", "MI", "PA", "NY", "IL", "IN", "WI", "MN", "CO"];
  const westCoast = ["CA", "OR", "WA"];

  if (tropicalStates.includes(code)) {
    return {
      climate: "High — tropical moisture, hurricane exposure, flash flooding",
      pest: "High — subterranean termites, fire ants, cockroaches, mosquitoes",
      roof: "High — hurricane-force winds, UV degradation, heavy rain leaks",
    };
  }

  if (desertStates.includes(code)) {
    return {
      climate: "High — monsoon flash flooding, microburst winds, haboobs",
      pest: "High — bark scorpions, subterranean termites, black widows",
      roof: "High — intense 115°F+ UV breakdown, tile displacement, thermal shock",
    };
  }

  if (coldStates.includes(code)) {
    return {
      climate: "Moderate-High — freeze-thaw cycles, lake-effect snow, spring flooding",
      pest: "Moderate — mice, carpenter ants, termites, fall stink bugs",
      roof: "Moderate-High — ice damming, heavy snow load, wind shear",
    };
  }

  if (westCoast.includes(code)) {
    return {
      climate: "Moderate — atmospheric river winter flooding, seasonal storms",
      pest: "High — drywood termites, Argentine ants, rodents",
      roof: "Moderate-High — coastal moisture, prolonged UV, wind uplift",
    };
  }

  return {
    climate: "Moderate — seasonal severe weather, heavy downpours, wind shear",
    pest: "Moderate-High — termites, rodents, cockroaches, nuisance pests",
    roof: "Moderate — UV degradation, storm debris, temperature cycling",
  };
}

export function getCityBySlug(slug: string): City | undefined {
  const normalized = (slug || "").trim().toLowerCase();
  return cities.find((c) => c.slug.toLowerCase() === normalized);
}

/**
 * Dynamic Fallback Template resolver.
 * Ensures NO slug ever returns a 404 or empty page.
 * Example: 'dallas-tx' -> { city: 'Dallas', state: 'Texas', state_code: 'TX', ... }
 */
export function getOrResolveCity(slug: string): City {
  const existing = getCityBySlug(slug);
  if (existing) return existing;

  const cleanSlug = (slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  const parts = cleanSlug.split("-").filter(Boolean);

  let stateCode = "US";
  let stateName = "United States";
  let cityParts = parts;

  if (parts.length >= 2) {
    const candidateState = parts[parts.length - 1].toUpperCase();
    if (US_STATES[candidateState]) {
      stateCode = candidateState;
      stateName = US_STATES[candidateState];
      cityParts = parts.slice(0, -1);
    }
  }

  const cityName = cityParts
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") || "Local Area";

  const risks = getStateRisks(stateCode);

  // Generate realistic fallback ZIP list
  const stateHash = stateCode.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const baseZip = (70000 + (stateHash * 173) % 25000).toString().padStart(5, "0");
  const zipNum = parseInt(baseZip, 10);
  const zipsList = [
    zipNum.toString(),
    (zipNum + 1).toString(),
    (zipNum + 4).toString(),
    (zipNum + 7).toString(),
  ];

  return {
    city: cityName,
    state: stateName,
    state_code: stateCode,
    slug: cleanSlug,
    zip: zipsList[0],
    zips_list: zipsList,
    area_code: "800",
    neighborhoods: [
      `${cityName} Metro`,
      "Downtown District",
      "Northside",
      "West Corridor",
    ],
    climate_risk: risks.climate,
    pest_risk: risks.pest,
    roof_risk: risks.roof,
    avg_cost: 168,
    response_mins: 22,
  };
}

/**
 * Returns 6 to 10 other cities within the same state (or regional fallback)
 * to build an internal PageRank silo mesh across regional clusters.
 */
export function getRegionalCities(currentCity: City, limit = 8): City[] {
  const sameState = cities.filter(
    (c) => c.state_code === currentCity.state_code && c.slug !== currentCity.slug
  );

  if (sameState.length >= limit) {
    const hash = currentCity.slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const startIndex = hash % sameState.length;
    const rotated = [...sameState.slice(startIndex), ...sameState.slice(0, startIndex)];
    return rotated.slice(0, limit);
  }

  const existingSlugs = new Set([currentCity.slug, ...sameState.map((c) => c.slug)]);
  const supplement = cities.filter((c) => !existingSlugs.has(c.slug));
  return [...sameState, ...supplement].slice(0, limit);
}
