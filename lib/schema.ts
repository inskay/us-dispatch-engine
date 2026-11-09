import { NICHES, type Niche, type City } from "@/lib/niches";
import { siteConfig } from "@/config/site";
import { getDispatchPhone } from "@/config/dispatch";

// Entity authorities & recognized standards for Generative Engine Optimization (GEO)
export const NICHE_AUTHORITY_ENTITIES: Record<
  Niche,
  {
    sameAs: string[];
    knowsAbout: string[];
  }
> = {
  "water-damage": {
    sameAs: [
      "https://en.wikipedia.org/wiki/Water_damage_restoration",
      "https://www.wikidata.org/wiki/Q11054179",
    ],
    knowsAbout: [
      "IICRC S500 Standard for Professional Water Damage Restoration",
      "IICRC S520 Standard for Professional Mold Remediation",
      "EPA Guidelines for Mold Cleanup & Indoor Air Quality",
      "Psychrometric Structural Drying & Moisture Mapping",
      "Category 1, 2, and 3 Black Water Extraction Protocols",
      "Thermal Imaging Leak Detection & Dehumidification",
    ],
  },
  "roof-repair": {
    sameAs: [
      "https://en.wikipedia.org/wiki/Roof",
      "https://www.wikidata.org/wiki/Q83180",
    ],
    knowsAbout: [
      "National Roofing Contractors Association (NRCA) Technical Guidelines",
      "ASTM D3462 Standard Specification for Asphalt Shingles",
      "Emergency Storm Tarping & Water Intrusion Mitigation Protocols",
      "Hail Impact Damage Assessment & Roof Deck Structural Integrity",
      "Step Flashing, Valley Waterproofing & Chimney Leak Remediation",
    ],
  },
  "pest-control": {
    sameAs: [
      "https://en.wikipedia.org/wiki/Pest_control",
      "https://www.wikidata.org/wiki/Q1143890",
    ],
    knowsAbout: [
      "EPA Integrated Pest Management (IPM) Principles",
      "National Pest Management Association (NPMA) Field Guidelines",
      "Subterranean Termite Liquid Barrier & Bait Monitoring Systems",
      "Eco-Safe Targeted Residential Structural Pest Eradication",
      "Rodent Exclusion, Entry Sealing & Attic Sanitize Protocols",
    ],
  },
};

/**
 * Builds a unified, high-authority Schema.org @graph for a City Service Page.
 * Combines EmergencyService, FAQPage, and BreadcrumbList into a single structured payload.
 */
export function buildCityServiceSchema(niche: Niche, city: City) {
  const nicheInfo = NICHES[niche];
  const dispatchPhone = getDispatchPhone(niche);
  const authority = NICHE_AUTHORITY_ENTITIES[niche];
  const pageUrl = `${siteConfig.domain}/${niche}/${city.slug}`;
  const phoneClean = dispatchPhone.raw.replace("tel:", "");

  const faqs = [
    {
      q: `How quickly can an emergency ${nicheInfo.label.toLowerCase()} specialist reach my home in ${city.city}, ${city.state_code}?`,
      a: `Emergency dispatch units arrive within an average of ${city.response_mins} minutes in ${city.city} (${city.zip}). Local crews are stationed near ${city.neighborhoods.slice(0, 2).join(" and ")} for immediate 24/7 mobilization.`,
    },
    {
      q: `What does emergency ${nicheInfo.label.toLowerCase()} cost in ${city.city}, ${city.state_code}?`,
      a: `Initial phone estimates are 100% free with zero travel fee in ${city.city}. Local dispatch costs typically start from \$${city.avg_cost}, with exact pricing determined on-site following diagnostic inspection and direct insurance documentation.`,
    },
    {
      q: `Is your ${city.city} dispatch service licensed and available 24/7?`,
      a: `Yes. All dispatched technicians are certified, state-licensed, and insured under ${city.state} building and contractor regulations. Call ${dispatchPhone.display} 24/7 for immediate dispatch coordination.`,
    },
  ];

  const emergencyServiceEntity = {
    "@type": ["EmergencyService", "HomeAndConstructionBusiness"],
    "@id": `${pageUrl}#service`,
    name: `24/7 ${nicheInfo.label} in ${city.city}, ${city.state_code}`,
    description: `24/7 local emergency ${nicheInfo.label.toLowerCase()} dispatch in ${city.city}, ${city.state_code} (${city.zip}). Average arrival in ${city.response_mins} mins with licensed, insured contractors.`,
    url: pageUrl,
    telephone: phoneClean,
    priceRange: `From \$${city.avg_cost}`,
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Direct Insurance Billing",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: {
      "@type": "City",
      name: city.city,
      containedInPlace: {
        "@type": "State",
        name: city.state,
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state_code,
      postalCode: city.zip,
      addressCountry: "US",
    },
    sameAs: authority.sameAs,
    knowsAbout: authority.knowsAbout,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${nicheInfo.label} Solutions`,
      itemListElement: nicheInfo.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: s,
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
      bestRating: "5",
    },
  };

  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteConfig.domain}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: nicheInfo.label,
        item: `${siteConfig.domain}/${niche}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${city.city}, ${city.state_code}`,
        item: pageUrl,
      },
    ],
  };

  const faqEntity = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [emergencyServiceEntity, breadcrumbEntity, faqEntity],
  };
}

/**
 * Builds a unified Schema.org @graph for a Service Hub Landing Page (e.g. /water-damage).
 */
export function buildServiceHubSchema(niche: Niche) {
  const nicheInfo = NICHES[niche];
  const dispatchPhone = getDispatchPhone(niche);
  const authority = NICHE_AUTHORITY_ENTITIES[niche];
  const pageUrl = `${siteConfig.domain}/${niche}`;
  const phoneClean = dispatchPhone.raw.replace("tel:", "");

  const faqs = [
    {
      q: `How quickly can an emergency ${nicheInfo.label.toLowerCase()} crew be dispatched?`,
      a: `Our nationwide network maintains an average arrival time under 25 minutes across metropolitan dispatch centers. In active weather or emergency events, units are dispatched within 60 seconds of your call.`,
    },
    {
      q: `Can I get an immediate pricing estimate over the phone?`,
      a: `Yes. Call ${dispatchPhone.display} and our dispatch coordinators will evaluate your situation and provide an instant price estimate. Technicians also perform an on-site inspection with no trip charge before any work begins.`,
    },
    {
      q: `Do you work directly with homeowner insurance companies?`,
      a: `Yes. We provide complete insurance claim documentation, photographic damage reports, and direct billing for major US insurance carriers, minimizing out-of-pocket stress.`,
    },
  ];

  const serviceEntity = {
    "@type": ["EmergencyService", "HomeAndConstructionBusiness"],
    "@id": `${pageUrl}#service`,
    name: `${nicheInfo.label} National Dispatch Network`,
    serviceType: nicheInfo.serviceType,
    description: nicheInfo.description,
    url: pageUrl,
    telephone: phoneClean,
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    sameAs: authority.sameAs,
    knowsAbout: authority.knowsAbout,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${nicheInfo.label} Capabilities`,
      itemListElement: nicheInfo.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };

  const breadcrumbEntity = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteConfig.domain}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: nicheInfo.label,
        item: pageUrl,
      },
    ],
  };

  const faqEntity = {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [serviceEntity, breadcrumbEntity, faqEntity],
  };
}
