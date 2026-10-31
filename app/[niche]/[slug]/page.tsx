import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Phone, Clock, Shield, MapPin, AlertTriangle, CheckCircle,
  Star, Zap, TrendingUp, Lightbulb, BadgeCheck, Wrench, Calendar,
} from "lucide-react";
import { cities, getCityBySlug } from "@/lib/cities";
import { NICHES, type Niche } from "@/lib/niches";
import { siteConfig } from "@/config/site";
import { getAdvisory } from "@/lib/gemini";
import { FAQAccordion } from "@/components/FAQAccordion";

// ─── ISR — daily regeneration so search engines see fresh advisory data ────────
export const revalidate = 86400;

const VALID_NICHES = Object.keys(NICHES) as Niche[];

// ─── Static Params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  const params: { niche: string; slug: string }[] = [];
  for (const niche of VALID_NICHES) {
    for (const city of cities) {
      params.push({ niche, slug: city.slug });
    }
  }
  return params;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string; slug: string }>;
}): Promise<Metadata> {
  const { niche, slug } = await params;
  const city = getCityBySlug(slug);
  if (!city || !VALID_NICHES.includes(niche as Niche)) return {};

  const nicheInfo = NICHES[niche as Niche];
  const title = `${nicheInfo.label} in ${city.city}, ${city.state_code} — 24/7 Emergency Dispatch`;
  const description = `Fast, local ${nicheInfo.label.toLowerCase()} in ${city.city}, ${city.state} (${city.zip}). ${nicheInfo.urgencyText}. Call ${siteConfig.phoneDisplay} for immediate response — avg ${city.response_mins} min dispatch.`;

  return {
    title,
    description,
    keywords: [
      `${nicheInfo.label.toLowerCase()} ${city.city}`,
      `${nicheInfo.label.toLowerCase()} ${city.state_code}`,
      `emergency ${niche} ${city.city}`,
      `${niche} near me ${city.zip}`,
      ...city.zips_list.map((z) => `${niche} ${z}`),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.domain}/${niche}/${slug}`,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.domain}/${niche}/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

// ─── JSON-LD: EmergencyService ─────────────────────────────────────────────────
function buildEmergencyServiceJsonLd(
  niche: Niche,
  city: NonNullable<ReturnType<typeof getCityBySlug>>
) {
  const nicheInfo = NICHES[niche];
  return {
    "@context": "https://schema.org",
    "@type": "EmergencyService",
    name: `${nicheInfo.label} — ${city.city}, ${city.state_code}`,
    description: nicheInfo.description,
    telephone: siteConfig.phoneTel.replace("tel:", ""),
    url: `${siteConfig.domain}/${niche}/${city.slug}`,
    openingHours: "Mo-Su 00:00-23:59",
    areaServed: {
      "@type": "City",
      name: city.city,
      containedInPlace: { "@type": "State", name: city.state },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.state_code,
      postalCode: city.zip,
      addressCountry: "US",
    },
    priceRange: `From \$${city.avg_cost}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${nicheInfo.label} Services`,
      itemListElement: nicheInfo.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "312",
      bestRating: "5",
    },
  };
}

// ─── JSON-LD: FAQPage ─────────────────────────────────────────────────────────
function buildFaqJsonLd(
  faqs: Array<{ q: string; a: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─── FAQ builder ─────────────────────────────────────────────────────────────
function buildFaqs(
  niche: Niche,
  city: NonNullable<ReturnType<typeof getCityBySlug>>
): Array<{ q: string; a: string }> {
  const nicheInfo = NICHES[niche];
  const costRange = `\$${city.avg_cost}–\$${Math.round(city.avg_cost * 2.8)}`;
  return [
    {
      q: `How fast can an emergency specialist reach ${city.city} (${city.zip})?`,
      a: `Our local ${city.city} dispatch network maintains an average response time of ${city.response_mins} minutes to the ${city.zip} ZIP code. We have certified ${nicheInfo.label.toLowerCase()} technicians stationed across ${city.neighborhoods.join(", ")} and all surrounding areas. Dispatch confirmation is provided within 60 seconds of your call.`,
    },
    {
      q: `What is the estimated cost range for ${nicheInfo.label.toLowerCase()} dispatch in ${city.state}?`,
      a: `In ${city.state}, ${nicheInfo.label.toLowerCase()} costs typically range from ${costRange} depending on the severity of the situation, square footage affected, and specific services required. Our ${city.city} specialists provide a free, no-obligation estimate before any work begins. Emergency situations after-hours carry no additional surcharge.`,
    },
    {
      q: `Are the ${niche === "pest-control" ? "treatments" : "repairs"} compliant with local ${city.state} regulations?`,
      a: `Yes — all our ${city.city} technicians are fully licensed and insured under ${city.state} state requirements. We comply with all applicable ${city.state} Department of ${niche === "pest-control" ? "Agriculture pest control" : niche === "roof-repair" ? "Professional and Occupational Regulation roofing contractor" : "Environmental Quality water damage restoration"} regulations and carry the required state-specific certifications. Workmanship guarantees are provided in writing.`,
    },
    {
      q: `Can I get an immediate quote over the phone before dispatch to ${city.city}?`,
      a: `Absolutely. Call ${siteConfig.phoneDisplay} and our ${city.city} dispatch coordinator will provide a preliminary cost range based on your description within the first 2 minutes of the call. For complex situations, we send a technician for a no-cost on-site assessment. There is no commitment required to receive a quote and no trip charge for estimates in the ${city.zip} area.`,
    },
  ];
}

// ─── Sub-components (Light Theme & Trust-First UI) ───────────────────────────

type CityType = NonNullable<ReturnType<typeof getCityBySlug>>;

function LiveStatusBar({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  return (
    <div className="w-full bg-blue-950 text-white text-xs sm:text-sm py-2 px-4 shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-bold tracking-wider uppercase text-emerald-300 text-xs">
            Live Dispatch Active
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-200">
            {city.city}, {city.state_code}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Avg Response: <strong className="text-white font-semibold">{city.response_mins} mins</strong>
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            {nicheInfo.label} Priority Line
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroSection({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 border-b border-slate-200/80 pt-10 pb-16 px-4 overflow-hidden">
      {/* Subtle geometric grid background accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Trust & Location Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-blue-50 border border-blue-200 text-blue-900 shadow-xs">
          <BadgeCheck className="w-4 h-4 text-blue-700" />
          <span>Licensed &amp; Insured Dispatch — {city.city}, {city.state_code} ({city.zip})</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          24/7 {nicheInfo.label} in{" "}
          <span className="text-blue-900 underline decoration-blue-300 decoration-wavy decoration-2">
            {city.city}, {city.state_code}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {nicheInfo.description}
        </p>

        {/* Soft Urgency Callout */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{nicheInfo.urgencyText}</span>
        </div>

        {/* Main CTA: High-impact vibrant emergency green */}
        <div className="pt-2">
          <a
            href={siteConfig.phoneTel}
            data-tracking="call-btn"
            data-niche={niche}
            data-city={city.city}
            data-zip={city.zip}
            className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xl sm:text-2xl px-8 py-5 rounded-2xl shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce shrink-0" />
            <span>Call {siteConfig.phoneDisplay}</span>
          </a>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 font-medium">
            ⚡ Direct Dispatch · 100% Free Consultation · No Obligation
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
          {[
            { icon: Shield, text: "Licensed & Insured", sub: "State Compliant" },
            { icon: Clock, text: `${city.response_mins}-Min Dispatch`, sub: "Rapid Response" },
            { icon: Star, text: "4.9 ★ Rating", sub: "312 Local Reviews" },
            { icon: CheckCircle, text: "Free Phone Quote", sub: "No Trip Fee" },
          ].map(({ icon: Icon, text, sub }) => (
            <div
              key={text}
              className="bg-white/80 border border-slate-200 rounded-xl p-3 text-center shadow-xs"
            >
              <Icon className="w-5 h-5 text-blue-700 mx-auto mb-1" />
              <div className="font-bold text-slate-800 text-xs sm:text-sm">{text}</div>
              <div className="text-[11px] text-slate-500">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Real-Time Emergency Advisory Block (Light Trust Theme) ───────────────────

type AdvisoryBlockProps = {
  niche: Niche;
  city: CityType;
  liveAlert: string;
  demandIndex: "CRITICAL" | "HIGH" | "ELEVATED";
  localTip: string;
  monthLabel: string;
};

function AdvisoryBlock({
  niche, city, liveAlert, demandIndex, localTip, monthLabel,
}: AdvisoryBlockProps) {
  const nicheInfo = NICHES[niche];

  const demandStyles: Record<string, { badge: string; bar: string; label: string }> = {
    CRITICAL: {
      badge: "bg-red-50 border-red-200 text-red-800",
      bar: "w-full bg-red-600",
      label: "text-red-700",
    },
    HIGH: {
      badge: "bg-amber-50 border-amber-200 text-amber-900",
      bar: "w-3/4 bg-amber-500",
      label: "text-amber-800",
    },
    ELEVATED: {
      badge: "bg-emerald-50 border-emerald-200 text-emerald-900",
      bar: "w-1/2 bg-emerald-600",
      label: "text-emerald-800",
    },
  };

  const currentDemand = demandStyles[demandIndex] || demandStyles.HIGH;

  return (
    <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-lg overflow-hidden">
        {/* Advisory Header Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-700" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Regional Emergency Advisory
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${currentDemand.badge}`}>
            Demand: {demandIndex}
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Month Badge + Live Alert */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>{monthLabel}</span>
            </div>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              {liveAlert}
            </p>
          </div>

          {/* Demand Level Meter */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-slate-700">
                <TrendingUp className="w-4 h-4 text-blue-700" />
                Dispatch Influx for {city.city}, {city.state_code} this week:
              </span>
              <span className={`font-bold uppercase ${currentDemand.label}`}>
                {demandIndex}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${currentDemand.bar}`} />
            </div>
          </div>

          {/* Homeowner Prevention Tip Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1">
                Local Homeowner Prevention Tip — {city.city}
              </p>
              <p className="text-slate-700 text-sm leading-relaxed">
                {localTip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Local Data & Price Range Table (Light Trust UI) ─────────────────────────

function LocalDataTable({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  const riskValue = city[nicheInfo.riskKey];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Local {nicheInfo.label} Dispatch Data
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Verified response times, coverage zones, and estimated cost ranges for {city.city}, {city.state_code}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing & Dispatch Card — Highlighted with Free Quote badge */}
        <div className="bg-white border-2 border-blue-900/20 rounded-2xl p-6 shadow-md shadow-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-700" />
                Estimated Pricing &amp; Rates
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Free Phone Quote
              </span>
            </div>

            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 text-slate-600 font-medium">Estimated Starting Cost</td>
                  <td className="py-2.5 text-right font-extrabold text-slate-900 text-lg">
                    \${city.avg_cost}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-600 font-medium">Average Response Time</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {city.response_mins} minutes
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-600 font-medium">Dispatch Availability</td>
                  <td className="py-2.5 text-right font-semibold text-emerald-700">
                    24/7 / 365 Days
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 text-slate-600 font-medium">Trip Fee for Assessment</td>
                  <td className="py-2.5 text-right font-semibold text-emerald-700">
                    $0 (Free Estimate)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Insurance Claim Assistance Available</span>
            <span className="font-semibold text-slate-700">Direct Billing</span>
          </div>
        </div>

        {/* Regional Risk Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Regional Risk Profile — {city.state}
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 text-slate-500 font-medium w-1/3">Climate Risk</td>
                <td className="py-2 text-slate-800">{city.climate_risk}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500 font-medium">Pest Risk</td>
                <td className="py-2 text-slate-800">{city.pest_risk}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500 font-medium">Roof Risk</td>
                <td className="py-2 text-slate-800">{city.roof_risk}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500 font-medium">Primary Hazard</td>
                <td className={`py-2 font-bold ${nicheInfo.color}`}>{riskValue}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ZIP Codes Coverage Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-700" />
            Target ZIP Codes Served
          </h3>
          <div className="flex flex-wrap gap-2">
            {city.zips_list.map((zip) => (
              <span
                key={zip}
                className="px-3 py-1.5 rounded-lg text-sm font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200"
              >
                {zip}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Primary Hub: <strong className="text-slate-700">{city.zip}</strong> · Local Area Code: <strong className="text-slate-700">({city.area_code})</strong>
          </p>
        </div>

        {/* Neighborhoods Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-700" />
            Neighborhoods with Active Units
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {city.neighborhoods.map((n) => (
              <li key={n} className="flex items-center gap-2 text-slate-700 text-sm">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Services Grid (Light Theme) ─────────────────────────────────────────────

function ServicesGrid({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  return (
    <section className="bg-slate-100/70 border-y border-slate-200 py-14">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {nicheInfo.label} Services in {city.city}
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Certified emergency solutions with written satisfaction guarantees and insurance coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nicheInfo.services.map((service) => (
            <div
              key={service}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm">{service}</p>
                <p className="text-slate-500 text-xs mt-1">Available 24/7 in {city.city}, {city.state_code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section (Light Theme) ────────────────────────────────────────────────

function FAQSection({
  niche, city, faqs,
}: {
  niche: Niche;
  city: CityType;
  faqs: Array<{ q: string; a: string }>;
}) {
  const nicheInfo = NICHES[niche];
  return (
    <section className="max-w-4xl mx-auto px-4 py-14">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-600 text-sm">
          Everything you need to know about {nicheInfo.label.toLowerCase()} in {city.city}, {city.state_code} ({city.zip})
        </p>
      </div>

      <FAQAccordion items={faqs} accentColor="text-blue-900" />
    </section>
  );
}

// ─── Mid-Page CTA (Light Theme Trust Callout) ─────────────────────────────────

function MidPageCTA({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
          Need Immediate {nicheInfo.label} in {city.city}?
        </h2>
        <p className="text-slate-200 text-base max-w-2xl mx-auto leading-relaxed">
          Don&apos;t wait until minor issues become major structural damage. Our licensed local crews are on standby with an average response time of{" "}
          <strong className="text-white font-bold">{city.response_mins} minutes</strong> across {city.zip} and surrounding areas.
        </p>
        <div>
          <a
            href={siteConfig.phoneTel}
            data-tracking="call-btn"
            data-niche={niche}
            data-city={city.city}
            data-zip={city.zip}
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <Phone className="w-5 h-5 shrink-0" />
            <span>Call {siteConfig.phoneDisplay}</span>
          </a>
          <p className="text-slate-300 text-xs mt-3">
            24/7 Rapid Dispatch · No Trip Surcharge · Local {city.city} Technicians
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Mobile Sticky Bar (Light Trust Theme) ───────────────────────────────────

function MobileStickyBar({ niche, city }: { niche: Niche; city: CityType }) {
  const nicheInfo = NICHES[niche];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
          {city.city} · {nicheInfo.label}
        </p>
        <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          {city.response_mins}-Min Dispatch
        </p>
      </div>
      <a
        href={siteConfig.phoneTel}
        data-tracking="call-btn"
        data-niche={niche}
        data-city={city.city}
        data-zip={city.zip}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md shrink-0 transition-colors"
      >
        <Phone className="w-4 h-4 shrink-0" />
        <span>Call Now</span>
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function NicheCityPage({
  params,
}: {
  params: Promise<{ niche: string; slug: string }>;
}) {
  const { niche, slug } = await params;

  if (!VALID_NICHES.includes(niche as Niche)) notFound();
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const typedNiche = niche as Niche;

  // Current month (0-indexed) and label
  const now = new Date();
  const currentMonth = now.getMonth();
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  // Fetch advisory — uses Gemini if key present, else static fallback
  const advisory = await getAdvisory(
    city.city,
    city.state_code,
    typedNiche,
    currentMonth
  );

  // Build FAQs
  const faqs = buildFaqs(typedNiche, city);

  // JSON-LD schemas
  const emergencyServiceSchema = buildEmergencyServiceJsonLd(typedNiche, city);
  const faqSchema = buildFaqJsonLd(faqs);

  return (
    <>
      {/* JSON-LD: EmergencyService */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(emergencyServiceSchema) }}
      />
      {/* JSON-LD: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans antialiased">
        {/* Live status bar */}
        <LiveStatusBar niche={typedNiche} city={city} />

        {/* Hero */}
        <HeroSection niche={typedNiche} city={city} />

        {/* Real-Time Emergency Advisory */}
        <AdvisoryBlock
          niche={typedNiche}
          city={city}
          liveAlert={advisory.liveAlert}
          demandIndex={advisory.demandIndex}
          localTip={advisory.localTip}
          monthLabel={monthLabel}
        />

        {/* Services grid */}
        <ServicesGrid niche={typedNiche} city={city} />

        {/* Local data table */}
        <LocalDataTable niche={typedNiche} city={city} />

        {/* FAQ Section */}
        <FAQSection niche={typedNiche} city={city} faqs={faqs} />

        {/* Mid-page CTA */}
        <MidPageCTA niche={typedNiche} city={city} />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-500 text-xs px-4">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="font-semibold text-slate-700 text-sm">
              {siteConfig.siteName} — {siteConfig.tagline}
            </p>
            <p>
              Serving {city.city}, {city.state} and surrounding areas ·{" "}
              <a
                href={siteConfig.phoneTel}
                data-tracking="call-btn"
                data-niche={niche}
                data-city={city.city}
                data-zip={city.zip}
                className="text-blue-900 font-semibold hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p className="text-slate-400">
              Coverage ZIP codes: {city.zips_list.join(", ")} · Area Code: ({city.area_code}) · All emergency dispatches are performed by locally licensed contractors.
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile sticky CTA bar */}
      <MobileStickyBar niche={typedNiche} city={city} />
    </>
  );
}
