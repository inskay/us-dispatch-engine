'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Phone, Droplets, Bug, Home, ExternalLink,
  MapPin, Clock, Star, Zap, Shield, CheckCircle, ArrowRight,
  Activity, FileText,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import citiesData from "@/data/cities.json";

interface CityItem {
  city: string;
  state: string;
  state_code: string;
  slug: string;
  zip: string;
  zips_list: string[];
  avg_cost: number;
  response_mins: number;
  neighborhoods: string[];
}

const CITIES: CityItem[] = citiesData as CityItem[];

const SERVICES = [
  {
    id: "water-damage",
    label: "Water Damage Restoration",
    shortLabel: "Water Damage",
    emoji: "💧",
    Icon: Droplets,
    color: "text-blue-700",
    bgLight: "bg-blue-50",
    borderLight: "border-blue-200",
    accentBg: "bg-blue-900",
    badge: "bg-blue-100 text-blue-900 border border-blue-200",
    description: "Emergency extraction, drying, mold prevention & full property restoration.",
  },
  {
    id: "pest-control",
    label: "Pest Control & Extermination",
    shortLabel: "Pest Control",
    emoji: "🐛",
    Icon: Bug,
    color: "text-emerald-700",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    accentBg: "bg-emerald-800",
    badge: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    description: "Termites, rodents, roaches & bed bug elimination with same-day treatments.",
  },
  {
    id: "roof-repair",
    label: "Emergency Roof Repair & Tarping",
    shortLabel: "Roof Repair",
    emoji: "🏠",
    Icon: Home,
    color: "text-amber-800",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    accentBg: "bg-amber-800",
    badge: "bg-amber-100 text-amber-900 border border-amber-200",
    description: "Leak detection, emergency tarping, storm damage & shingle replacement.",
  },
];

const FILTER_STATES = [
  { code: "ALL", label: "All States" },
  { code: "TX", label: "Texas" },
  { code: "FL", label: "Florida" },
  { code: "CA", label: "California" },
  { code: "GA", label: "Georgia" },
  { code: "NC", label: "North Carolina" },
  { code: "AZ", label: "Arizona" },
  { code: "OH", label: "Ohio" },
  { code: "TN", label: "Tennessee" },
];

export default function DirectoryDashboard() {
  const [selectedService, setSelectedService] = useState<string>("water-damage");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const currentService = useMemo(() => {
    return SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
  }, [selectedService]);

  const filteredCities = useMemo(() => {
    return CITIES.filter((c) => {
      const matchesState =
        selectedState === "ALL" || c.state_code.toUpperCase() === selectedState;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.state_code.toLowerCase().includes(q) ||
        c.zip.includes(q) ||
        c.slug.includes(q);
      return matchesState && matchesSearch;
    });
  }, [selectedState, search]);

  const totalPages = SERVICES.length * CITIES.length + SERVICES.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-blue-950 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>24/7 NATIONWIDE EMERGENCY DISPATCH — {totalPages}+ PROGRAMMATIC HUBS &amp; CITY PAGES</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-xs">
              ⚡
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                {siteConfig.siteName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{siteConfig.tagline}</p>
            </div>
          </div>
          <a
            href={siteConfig.phoneTel}
            data-tracking="call-btn"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all hover:scale-102"
          >
            <Phone className="w-4 h-4" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-14">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-900 rounded-full">
            Programmatic SEO Dispatch Engine
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nationwide 24/7 Emergency Services
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Direct local dispatch for certified water damage restoration, licensed pest control, and emergency roof repair across all 50 states.
          </p>

          <div className="pt-2">
            <a
              href={siteConfig.phoneTel}
              data-tracking="call-btn"
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-2xl shadow-xl shadow-emerald-700/20 ring-4 ring-emerald-100 transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>Call {siteConfig.phoneDisplay} For Immediate Dispatch</span>
            </a>
          </div>
        </div>

        {/* 3 Main Services Direct Hub Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span>Primary Service Hubs</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Click to view national service hubs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <Link
                key={s.id}
                href={`/${s.id}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {s.emoji}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-900 transition-colors">
                      National Hub →
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {s.label}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                  <span>Browse All Cities</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* State & Coverage Browser (Dedicated State Filter / Directory Section) */}
        <section id="directory" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  State &amp; City Directory
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Browse Coverage by State &amp; Service
                </h3>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                <span className="text-slate-900 font-bold">{filteredCities.length}</span> cities active in{" "}
                <span className="text-blue-900 font-bold">{selectedState}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Select your service, choose a state filter (TX, FL, CA, GA, NC, AZ, OH, etc.), or search directly.
            </p>
          </div>

          {/* Service Switcher Tabs */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {SERVICES.map((s) => {
              const isActive = selectedService === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    isActive
                      ? "bg-blue-900 text-white border-blue-900 shadow-md scale-102"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* State Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filter by State:
            </span>
            {FILTER_STATES.map(({ code, label }) => {
              const isActive = selectedState === code;
              return (
                <button
                  key={code}
                  onClick={() => setSelectedState(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${currentService.shortLabel} cities by name or ZIP...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {filteredCities.map((city) => {
              const href = `/${selectedService}/${city.slug}`;
              return (
                <Link
                  key={`${selectedService}-${city.slug}`}
                  href={href}
                  className="group block rounded-xl border border-slate-200 bg-white hover:border-blue-400 p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">
                        {city.city}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500">
                        {city.state} ({city.state_code})
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-colors shrink-0" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{city.response_mins} min avg dispatch</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      <span>Starting from \${city.avg_cost}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-slate-400 text-[11px] truncate">
                        ZIP: {city.zip} ({city.neighborhoods[0] || "Metro Area"})
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                    <span>{currentService.shortLabel} in {city.city}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <p className="font-bold text-slate-800 text-sm">No cities match your search or filter.</p>
              <button
                onClick={() => { setSelectedState("ALL"); setSearch(""); }}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* 3-Step Emergency Response Protocol */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How US Emergency Dispatch Works
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Our 3-step rapid deployment connects homeowners to verified, state-compliant specialists in under 25 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Call Direct Dispatch",
                desc: `Dial ${siteConfig.phoneDisplay}. Tell our coordinator your issue and address. Units are alerted within 60 seconds.`,
                icon: Phone,
              },
              {
                step: "02",
                title: "On-Site Evaluation & Free Quote",
                desc: "Certified technicians arrive, inspect with diagnostic tools, and provide an exact, upfront written estimate.",
                icon: Activity,
              },
              {
                step: "03",
                title: "Immediate Mitigation & Insurance",
                desc: "Work begins immediately. We handle damage documentation and assist with direct insurance billing.",
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
                <h4 className="text-base font-bold text-slate-900 mb-1.5">{title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mid-Page Callout Banner */}
        <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Have an Emergency? Talk to a Dispatch Coordinator Now
          </h3>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our dispatch centers are fully staffed 24/7/365. Free quotes, zero trip fees, and guaranteed rapid arrival.
          </p>
          <div>
            <a
              href={siteConfig.phoneTel}
              data-tracking="call-btn"
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg sm:text-xl px-8 py-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>Call {siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </section>

        {/* Sitemap footer */}
        <div className="border-t border-slate-200 pt-8 text-center space-y-2">
          <p className="text-slate-600 text-sm font-medium">
            XML Sitemap:{" "}
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline font-mono"
            >
              /sitemap.xml
            </a>
          </p>
          <p className="text-slate-400 text-xs">
            {siteConfig.siteName} · {siteConfig.domain} · Emergency Dispatch Engine
          </p>
        </div>
      </main>
    </div>
  );
}
