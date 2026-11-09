import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone, Clock, Shield, MapPin, AlertTriangle, CheckCircle,
  Star, Zap, TrendingUp, Lightbulb, BadgeCheck, Wrench, Calendar,
} from "lucide-react";
import { cities, getOrResolveCity, getRegionalCities } from "@/lib/cities";
import { NICHES, type Niche, type City } from "@/lib/niches";
import { siteConfig } from "@/config/site";
import { getDispatchPhone } from "@/config/dispatch";
import { getAdvisory } from "@/lib/gemini";
import { FAQAccordion } from "@/components/FAQAccordion";
import { buildCityServiceSchema } from "@/lib/schema";

export const revalidate = 86400;

const VALID_SERVICES = Object.keys(NICHES) as Niche[];

// ─── Static Params for pre-rendering known cities ─────────────────────────────
export function generateStaticParams() {
  const params: { service: string; city: string }[] = [];
  for (const service of VALID_SERVICES) {
    for (const c of cities) {
      params.push({ service, city: c.slug });
    }
  }
  return params;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city: citySlug } = await params;
  if (!VALID_SERVICES.includes(service as Niche)) return {};

  const city = getOrResolveCity(citySlug);
  const info = NICHES[service as Niche];
  const dispatchPhone = getDispatchPhone(service);

  const shortService =
    service === "water-damage"
      ? "Water Damage"
      : service === "pest-control"
      ? "Pest Control"
      : "Roof Repair";

  let title = `24/7 ${shortService} in ${city.city}, ${city.state_code} | Dispatch`;
  if (title.length > 58) {
    title = `${city.city}, ${city.state_code} ${shortService} — 24/7 Dispatch`;
  }
  if (title.length > 58) {
    title = `${city.city} ${shortService} — 24/7 Dispatch`;
  }

  const description = `24/7 emergency ${shortService.toLowerCase()} in ${city.city}, ${city.state_code}. Rapid ${city.response_mins}-min dispatch & free phone quotes. Call ${dispatchPhone.display} now.`;

  return {
    title,
    description,
    keywords: [
      `${info.label.toLowerCase()} ${city.city}`,
      `${info.label.toLowerCase()} ${city.state_code}`,
      `emergency ${service} ${city.city}`,
      `${service} near me ${city.zip}`,
      ...city.zips_list.map((z) => `${service} ${z}`),
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.domain}/${service}/${citySlug}`,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.domain}/${service}/${citySlug}`,
    },
    robots: { index: true, follow: true },
  };
}

// ─── FAQ builder ─────────────────────────────────────────────────────────────
function buildFaqs(niche: Niche, city: City): Array<{ q: string; a: string }> {
  const nicheInfo = NICHES[niche];
  const dispatchPhone = getDispatchPhone(niche);
  const costRange = `\$${city.avg_cost}–\$${Math.round(city.avg_cost * 2.8)}`;
  return [
    {
      q: `How fast can an emergency specialist reach ${city.city} (${city.zip})?`,
      a: `Our local ${city.city} dispatch network maintains an average response time of ${city.response_mins} minutes to the ${city.zip} area. We have certified ${nicheInfo.label.toLowerCase()} technicians stationed across ${city.neighborhoods.join(", ")} and all surrounding communities. Dispatch confirmation is issued within 60 seconds of your call.`,
    },
    {
      q: `What is the estimated cost range for ${nicheInfo.label.toLowerCase()} dispatch in ${city.state}?`,
      a: `In ${city.state}, ${nicheInfo.label.toLowerCase()} costs typically range from ${costRange} depending on property severity, affected square footage, and necessary equipment. Our ${city.city} specialists provide a transparent, 100% free estimate before any work begins, with zero after-hours surcharges.`,
    },
    {
      q: `Are the ${niche === "pest-control" ? "treatments" : "repairs"} compliant with local ${city.state} regulations?`,
      a: `Yes — all our ${city.city} technicians are fully licensed, bonded, and insured under ${city.state} statutory codes. We carry appropriate state-specific licensing and provide written guarantees on all completed work.`,
    },
    {
      q: `Can I get an immediate quote over the phone before dispatch to ${city.city}?`,
      a: `Yes. Call ${dispatchPhone.display} and our ${city.city} dispatch coordinator will assess your situation and provide an initial cost estimate within the first 2 minutes. There is no obligation to schedule service and no travel fee for estimates in ${city.city}.`,
    },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveStatusBar({ niche, city }: { niche: Niche; city: City }) {
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
          <span className="text-slate-200">
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

function HeroSection({ niche, city }: { niche: Niche; city: City }) {
  const nicheInfo = NICHES[niche];
  const dispatchPhone = getDispatchPhone(niche);
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 border-b border-slate-200/80 pt-10 pb-16 px-4 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-blue-50 border border-blue-200 text-blue-900 shadow-xs">
          <BadgeCheck className="w-4 h-4 text-blue-700" />
          <span>Licensed &amp; Insured Dispatch — {city.city}, {city.state_code} ({city.zip})</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          24/7 {nicheInfo.label}* in{" "}
          <span className="text-blue-900 underline decoration-blue-300 decoration-wavy decoration-2">
            {city.city}, {city.state_code}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {nicheInfo.description}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{nicheInfo.urgencyText}</span>
        </div>

        {/* Main CTA */}
        <div className="pt-2">
          <a
            href={dispatchPhone.raw}
            data-tracking="call-btn"
            data-niche={niche}
            data-city={city.city}
            data-zip={city.zip}
            className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xl sm:text-2xl px-8 py-5 rounded-2xl shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Phone className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce shrink-0" />
            <span>Call {dispatchPhone.display}</span>
          </a>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 font-medium">
            ⚡ Direct Dispatch · 100% Free Consultation · No Obligation
          </p>
        </div>

        {/* Trust Badges */}
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

function AdvisoryBlock({
  city,
  liveAlert,
  demandIndex,
  localTip,
  monthLabel,
}: {
  city: City;
  liveAlert: string;
  demandIndex: "CRITICAL" | "HIGH" | "ELEVATED";
  localTip: string;
  monthLabel: string;
}) {
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
          <div className="flex items-start gap-3">
            <div className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-blue-50 border border-blue-200 text-blue-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>{monthLabel}</span>
            </div>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              {liveAlert}
            </p>
          </div>

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

function LocalDataTable({ niche, city }: { niche: Niche; city: City }) {
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
        {/* Pricing Card */}
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
                    24/7 / 365 Days*
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

function ServicesGrid({ niche, city }: { niche: Niche; city: City }) {
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
                <p className="text-slate-500 text-xs mt-1">Available 24/7* in {city.city}, {city.state_code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionalSiloMesh({
  service,
  currentCity,
}: {
  service: Niche;
  currentCity: City;
}) {
  const regionalCities = getRegionalCities(currentCity, 8);
  const nicheInfo = NICHES[service];

  return (
    <section className="bg-slate-50/70 border-t border-slate-200/80 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Emergency Dispatch Coverage in {currentCity.state}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            24/7 rapid response network for {nicheInfo.label.toLowerCase()} across regional {currentCity.state} hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {regionalCities.map((c) => (
            <Link
              key={c.slug}
              href={`/${service}/${c.slug}`}
              className="group flex flex-col justify-between p-3 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-xs transition"
            >
              <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-700 transition truncate">
                {c.city}, {c.state_code}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Avg. {c.response_mins}m dispatch
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city: citySlug } = await params;

  if (!VALID_SERVICES.includes(service as Niche)) notFound();

  // Dynamic Fallback Template guarantees a valid City object for any slug
  const city = getOrResolveCity(citySlug);
  const typedService = service as Niche;
  const dispatchPhone = getDispatchPhone(typedService);

  const now = new Date();
  const currentMonth = now.getMonth();
  const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  const advisory = await getAdvisory(
    city.city,
    city.state_code,
    typedService,
    currentMonth
  );

  const faqs = buildFaqs(typedService, city);
  const jsonLd = buildCityServiceSchema(typedService, city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans antialiased">
        <LiveStatusBar niche={typedService} city={city} />

        <HeroSection niche={typedService} city={city} />

        <AdvisoryBlock
          city={city}
          liveAlert={advisory.liveAlert}
          demandIndex={advisory.demandIndex}
          localTip={advisory.localTip}
          monthLabel={monthLabel}
        />

        <ServicesGrid niche={typedService} city={city} />

        <LocalDataTable niche={typedService} city={city} />

        <section className="max-w-4xl mx-auto px-4 py-14">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Everything you need to know about {NICHES[typedService].label.toLowerCase()} in {city.city}, {city.state_code} ({city.zip})
            </p>
          </div>

          <FAQAccordion items={faqs} accentColor="text-blue-900" />
        </section>

        {/* Mid-Page Callout Banner */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Need Immediate {NICHES[typedService].label} in {city.city}?
            </h2>
            <p className="text-slate-200 text-base max-w-2xl mx-auto leading-relaxed">
              Don&apos;t wait until minor issues become major structural damage. Our licensed local crews are on standby with an average response time of{" "}
              <strong className="text-white font-bold">{city.response_mins} minutes</strong> across {city.zip} and surrounding areas.
            </p>
            <div>
              <a
                href={dispatchPhone.raw}
                data-tracking="call-btn"
                data-niche={service}
                data-city={city.city}
                data-zip={city.zip}
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <span>Call {dispatchPhone.display}</span>
              </a>
              <p className="text-slate-300 text-xs mt-3">
                24/7 Rapid Dispatch* · No Trip Surcharge · Local {city.city} Technicians
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Cross-City Internal Linking Silo Mesh */}
        <RegionalSiloMesh service={typedService} currentCity={city} />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-500 text-xs px-4">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="font-semibold text-slate-700 text-sm">
              {siteConfig.siteName} — {siteConfig.tagline}
            </p>
            <p>
              Serving {city.city}, {city.state} and surrounding areas ·{" "}
              <a
                href={dispatchPhone.raw}
                data-tracking="call-btn"
                data-niche={service}
                data-city={city.city}
                data-zip={city.zip}
                className="text-blue-900 font-semibold hover:underline"
              >
                {dispatchPhone.display}
              </a>
            </p>
            <p className="text-slate-400">
              Coverage ZIP codes: {city.zips_list.join(", ")} · Area Code: ({city.area_code}) · All emergency dispatches are performed by locally licensed contractors.
            </p>
          </div>
        </footer>

        {/* Mobile Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              {city.city} · {NICHES[typedService].label}
            </p>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {city.response_mins}-Min Dispatch
            </p>
          </div>
          <a
            href={dispatchPhone.raw}
            data-tracking="call-btn"
            data-niche={service}
            data-city={city.city}
            data-zip={city.zip}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md shrink-0 transition-colors"
          >
            <Phone className="w-4 h-4 shrink-0" />
            <span>Call Now</span>
          </a>
        </div>
      </div>
    </>
  );
}
