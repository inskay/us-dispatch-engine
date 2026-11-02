import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Phone, Clock, Shield, MapPin, AlertTriangle, CheckCircle,
  Star, Zap, Wrench, BadgeCheck, FileText, Activity,
} from "lucide-react";
import { cities } from "@/lib/cities";
import { NICHES, type Niche } from "@/lib/niches";
import { siteConfig } from "@/config/site";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ServiceCityDirectory } from "@/components/ServiceCityDirectory";

export const revalidate = 86400;

const VALID_SERVICES = Object.keys(NICHES) as Niche[];

export function generateStaticParams() {
  return VALID_SERVICES.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  if (!VALID_SERVICES.includes(service as Niche)) return {};

  const info = NICHES[service as Niche];
  const title = `${info.label} — 24/7 Emergency Dispatch & Local Services`;
  const description = `Immediate ${info.label.toLowerCase()} across all top US metropolitan hubs. Rapid 20-min dispatch, certified local crews, and free estimates. Call ${siteConfig.phoneDisplay} now.`;

  return {
    title,
    description,
    keywords: [
      info.label.toLowerCase(),
      `emergency ${service}`,
      `${service} contractors`,
      `${service} near me`,
      "24/7 dispatch",
      "same day service",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.domain}/${service}`,
      siteName: siteConfig.siteName,
    },
    alternates: {
      canonical: `${siteConfig.domain}/${service}`,
    },
    robots: { index: true, follow: true },
  };
}

function buildServiceJsonLd(service: Niche) {
  const info = NICHES[service];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: info.label,
    serviceType: info.serviceType,
    description: info.description,
    provider: {
      "@type": "EmergencyService",
      name: siteConfig.siteName,
      telephone: siteConfig.phoneTel.replace("tel:", ""),
      url: `${siteConfig.domain}/${service}`,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${info.label} Capabilities`,
      itemListElement: info.services.map((s, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };
}

function buildServiceFaqs(service: Niche) {
  const info = NICHES[service];
  return [
    {
      q: `How quickly can an emergency ${info.label.toLowerCase()} technician arrive?`,
      a: `Our nationwide network maintains an average arrival time of under 25 minutes across all metropolitan dispatch centers. In active weather or emergency events, units are dispatched within 60 seconds of your call.`,
    },
    {
      q: `Can I get an immediate pricing estimate over the phone?`,
      a: `Yes. Call ${siteConfig.phoneDisplay} and our dispatch coordinators will evaluate your situation and provide an instant price estimate. Technicians also perform an on-site inspection with no trip charge before any work begins.`,
    },
    {
      q: `Do you work directly with homeowner insurance companies?`,
      a: `Yes. We provide complete insurance claim documentation, photographic damage reports, and direct billing for major US insurance carriers, minimizing out-of-pocket stress.`,
    },
    {
      q: `Are all technicians licensed, certified, and insured?`,
      a: `All dispatched professionals hold state-specific trade licensing, comprehensive general liability coverage, and industry certifications appropriate for ${info.label.toLowerCase()}.`,
    },
  ];
}

export default async function ServiceHubPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  if (!VALID_SERVICES.includes(service as Niche)) notFound();

  const typedService = service as Niche;
  const info = NICHES[typedService];
  const jsonLd = buildServiceJsonLd(typedService);
  const faqs = buildServiceFaqs(typedService);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 md:pb-0 font-sans antialiased">
        {/* Top Live Dispatch Bar */}
        <div className="w-full bg-blue-950 text-white text-xs sm:text-sm py-2 px-4 shadow-xs">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 font-medium">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="font-bold tracking-wider uppercase text-emerald-300 text-xs">
                Active National Dispatch
              </span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="text-slate-200">
                24/7 Rapid Deployment Across All US Cities
              </span>
            </div>
            <a
              href={siteConfig.phoneTel}
              className="flex items-center gap-1.5 text-emerald-300 font-bold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Priority: {siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 border-b border-slate-200/80 pt-10 pb-16 px-4 overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-blue-50 border border-blue-200 text-blue-900 shadow-xs">
              <BadgeCheck className="w-4 h-4 text-blue-700" />
              <span>Licensed &amp; Insured Emergency Service — National Directory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              24/7 Professional{" "}
              <span className="text-blue-900 underline decoration-blue-300 decoration-wavy decoration-2">
                {info.label}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {info.description} Fast dispatch to your door with state-licensed crews, commercial-grade equipment, and transparent pricing.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{info.urgencyText}</span>
            </div>

            {/* Main CTA */}
            <div className="pt-2">
              <a
                href={siteConfig.phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="inline-flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xl sm:text-2xl px-8 py-5 rounded-2xl shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce shrink-0" />
                <span>Call {siteConfig.phoneDisplay}</span>
              </a>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 font-medium">
                ⚡ Instant Phone Estimate · Zero Trip Charge · Direct Insurance Assistance
              </p>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
              {[
                { icon: Shield, text: "Licensed & Insured", sub: "Fully Compliant" },
                { icon: Clock, text: "20-Min Response", sub: "Average Dispatch" },
                { icon: Star, text: "4.9 ★ Rating", sub: "Verified Reviews" },
                { icon: CheckCircle, text: "$0 Phone Quote", sub: "No Commitment" },
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

        {/* Interactive City Directory & State Filter */}
        <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Local Coverage Areas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Find {info.label} in Your City
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Filter by state or search below to view local response times, neighborhood coverage, and localized emergency pricing.
            </p>
          </div>

          <ServiceCityDirectory
            service={service}
            serviceLabel={info.label}
            accentColor={info.color}
            cities={cities}
          />
        </section>

        {/* 6 Core Capabilities Grid */}
        <section className="bg-slate-100/70 border-y border-slate-200 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Full-Scope {info.label} Capabilities
              </h2>
              <p className="text-sm text-slate-600 max-w-xl mx-auto">
                Commercial and residential solutions handled by certified regional technicians.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {info.services.map((s) => (
                <div
                  key={s}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-sm">{s}</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      24/7 immediate deployment with full warranty coverage.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3-Step Emergency Response Protocol */}
        <section className="max-w-5xl mx-auto px-4 py-14 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our 3-Step Emergency Dispatch Protocol
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              How our rapid deployment system delivers certified technicians to your doorstep in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Call & Immediate Triage",
                desc: `Dial ${siteConfig.phoneDisplay}. Our dispatch coordinator collects your address, evaluates severity, and routes the nearest mobile unit within 60 seconds.`,
                icon: Phone,
              },
              {
                step: "02",
                title: "On-Site Assessment & Free Quote",
                desc: "A licensed specialist arrives on-site, inspects the property with thermal imaging or diagnostic tools, and provides a clear, transparent written estimate.",
                icon: Activity,
              },
              {
                step: "03",
                title: "Resolution & Direct Billing",
                desc: "Work begins immediately. We document all steps for insurance claims and bill directly to your carrier to minimize out-of-pocket costs.",
                icon: FileText,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden"
              >
                <div className="text-4xl font-black text-slate-100 absolute top-3 right-4 select-none">
                  {step}
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-sm mb-4 border border-blue-100">
                  <Icon className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm">
              Common questions about national emergency {info.label.toLowerCase()} services.
            </p>
          </div>

          <FAQAccordion items={faqs} accentColor="text-blue-900" />
        </section>

        {/* Mid-Page Callout Banner */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Need Emergency {info.label} Right Now?
            </h2>
            <p className="text-slate-200 text-base max-w-2xl mx-auto leading-relaxed">
              Don&apos;t let damage escalate. Our dispatch teams are operating 24 hours a day, 7 days a week, 365 days a year across every major metropolitan corridor.
            </p>
            <div>
              <a
                href={siteConfig.phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <span>Call {siteConfig.phoneDisplay}</span>
              </a>
              <p className="text-slate-300 text-xs mt-3">
                No Call Centers · Direct Local Dispatch · 100% Free Phone Estimate
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-10 text-center text-slate-500 text-xs px-4">
          <div className="max-w-4xl mx-auto space-y-2">
            <p className="font-semibold text-slate-700 text-sm">
              {siteConfig.siteName} — {info.label} National Hub
            </p>
            <p>
              Direct emergency dispatch line:{" "}
              <a
                href={siteConfig.phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="text-blue-900 font-semibold hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p className="text-slate-400">
              Serving residential and commercial properties nationwide with state-licensed contractors.
            </p>
          </div>
        </footer>

        {/* Mobile Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
              National Dispatch Line
            </p>
            <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {info.label}
            </p>
          </div>
          <a
            href={siteConfig.phoneTel}
            data-tracking="call-btn"
            data-niche={service}
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
