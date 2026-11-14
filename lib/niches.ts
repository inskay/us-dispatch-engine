export type City = {
  city: string;
  state: string;
  state_code: string;
  slug: string;
  zip: string;
  zips_list: string[];
  area_code: string;
  neighborhoods: string[];
  climate_risk: string;
  pest_risk: string;
  roof_risk: string;
  avg_cost: number;
  response_mins: number;
};

export type Niche = "water-damage" | "pest-control" | "roof-repair";

export const NICHES: Record<
  Niche,
  {
    label: string;
    emoji: string;
    color: string;
    bgColor: string;
    ringColor: string;
    accentColor: string;
    description: string;
    riskKey: keyof Pick<City, "climate_risk" | "pest_risk" | "roof_risk">;
    serviceType: string;
    urgencyText: string;
    ctaVerb: string;
    services: string[];
  }
> = {
  "water-damage": {
    label: "Water Damage Restoration",
    emoji: "💧",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    ringColor: "ring-blue-200",
    accentColor: "bg-blue-600",
    description:
      "24/7 emergency water extraction, structural drying, mold prevention, and full restoration for residential properties and homeowners.",
    riskKey: "climate_risk",
    serviceType: "Water Damage Restoration",
    urgencyText: "Water damage worsens every hour — mold begins in 24–48 hrs",
    ctaVerb: "Stop the Flood",
    services: [
      "Emergency Water Extraction",
      "Structural Drying & Dehumidification",
      "Mold Prevention Treatment",
      "Carpet & Floor Restoration",
      "Sewage Cleanup",
      "Basement Flood Pump-Out",
    ],
  },
  "pest-control": {
    label: "Pest Control",
    emoji: "🐛",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    ringColor: "ring-emerald-200",
    accentColor: "bg-emerald-600",
    description:
      "Same-day pest elimination for termites, rodents, roaches, ants, and all local pest threats. Professional results with eco-safe treatments.",
    riskKey: "pest_risk",
    serviceType: "Pest Control",
    urgencyText: "Infestations spread fast — same-day treatment stops damage",
    ctaVerb: "Eliminate Pests Now",
    services: [
      "Termite Inspection & Treatment",
      "Rodent Extermination",
      "Cockroach Elimination",
      "Ant Colony Removal",
      "Bed Bug Heat Treatment",
      "Preventive Barrier Spray",
    ],
  },
  "roof-repair": {
    label: "Residential Roof Replacement",
    emoji: "🏠",
    color: "text-amber-800",
    bgColor: "bg-amber-50",
    ringColor: "ring-amber-200",
    accentColor: "bg-amber-600",
    description:
      "Residential roof replacement, complete tear-offs, and new roof installation — fast local certified crews.",
    riskKey: "roof_risk",
    serviceType: "Residential Roof Replacement",
    urgencyText: "Aging roofs risk catastrophic structural leaks — consult a specialist today",
    ctaVerb: "Schedule Roof Assessment",
    services: [
      "Complete Roof Replacement",
      "New Roof Installation",
      "Asphalt Shingle Tear-Off",
      "Metal Roof Replacement",
      "Flashing & Decking Replacement",
      "Full Roof Inspection",
    ],
  },
};
