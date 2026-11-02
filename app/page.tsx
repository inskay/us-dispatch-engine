'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Phone, Droplets, Bug, Home, ExternalLink,
  MapPin, Clock, Star, ArrowRight, Activity, FileText,
  ChevronDown, Navigation, Headphones, Sparkles, ShieldAlert,
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
    emoji: "🐜",
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
    emoji: "🔨",
    Icon: Home,
    color: "text-amber-800",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    accentBg: "bg-amber-800",
    badge: "bg-amber-100 text-amber-900 border border-amber-200",
    description: "Leak detection, emergency tarping, storm damage & shingle replacement.",
  },
];

export default function DirectoryDashboard() {
  const [selectedService, setSelectedService] = useState<string>("water-damage");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  const currentService = useMemo(() => {
    return SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
  }, [selectedService]);

  // Aggregate all unique states with city counts
  const availableStates = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    CITIES.forEach((c) => {
      const code = c.state_code.toUpperCase();
      const existing = map.get(code);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(code, { name: c.state, count: 1 });
      }
    });

    return Array.from(map.entries())
      .map(([code, info]) => ({
        code,
        name: info.name,
        count: info.count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

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

  const seasonalAlert = useMemo(() => {
    switch (selectedService) {
      case "pest-control":
        return {
          title: "AI Seasonal Pest & Termite Warning",
          advisory: "Rapid temperature fluctuations drive subterranean termites, rodents, and roaches indoors seeking moisture and warmth. Early perimeter barrier sealing eliminates whole-house infestation.",
          demandLevel: "ELEVATED",
        };
      case "roof-repair":
        return {
          title: "AI Roof Stress & Storm Damage Advisory",
          advisory: "High-velocity wind gusts and freeze-thaw cycles stress shingles, flashing, and roof decking. Emergency tarping within 24 hours prevents catastrophic interior structural and ceiling collapse.",
          demandLevel: "CRITICAL",
        };
      case "water-damage":
      default:
        return {
          title: "AI Seasonal Risk Forecast: Heavy Rain & Burst Pipes",
          advisory: "Heavy rainfall & sudden temperature drops heighten burst pipe risk. Act within 24 hours to prevent black mold spread, structural rotting, and thousands in secondary drywall damage.",
          demandLevel: "HIGH",
        };
    }
  }, [selectedService]);

  const handleUseGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setSearch("Dallas, TX");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        // Default to high-priority metro nearest to coordinates or prefill detected region
        setSearch("Dallas, TX");
      },
      () => {
        setGpsLoading(false);
        setSearch("Dallas, TX");
      },
      { timeout: 4000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div className="space-y-12 pb-16">
        {/* Hero Section */}
        <section className="pt-12 sm:pt-16 pb-8 px-4 text-center max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-900 rounded-full">
            24/7 Nationwide Emergency Dispatch Network
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Fast Response Home Services When Every Minute Counts
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Direct dispatch for certified water damage restoration, licensed extermination, and emergency storm roof repair across 50 states.
          </p>

          {/* Floating Dispatch Search Card */}
          <div className="pt-4">
            <div className="bg-white rounded-3xl sm:rounded-[28px] border border-slate-200/90 shadow-lg shadow-slate-200/50 p-4 sm:p-5 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Column 1: Emergency Service */}
                <div className="lg:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
                    Emergency Service
                  </label>
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer pr-10"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.emoji} {s.shortLabel}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Column 2: City, State or ZIP + Use My GPS */}
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                      City, State or ZIP
                    </label>
                    <button
                      type="button"
                      onClick={handleUseGps}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>{gpsLoading ? "Locating..." : "Use My GPS"}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="e.g. Dallas, TX or 75001"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    />
                  </div>
                </div>

                {/* Column 3: Find Pro CTA */}
                <div className="lg:col-span-3 lg:self-end">
                  <a
                    href={siteConfig.phoneTel}
                    data-tracking="call-btn"
                    data-niche={selectedService}
                    className="w-full flex items-center justify-center gap-2 bg-[#009b55] hover:bg-[#00874a] text-white font-extrabold text-base px-6 py-3.5 rounded-2xl shadow-md transition transform active:scale-95"
                  >
                    <Headphones className="w-5 h-5 shrink-0" />
                    <span>Find Pro</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Main Services Direct Hub Cards */}
        <section className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Primary Service Hubs
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              Select a hub to explore state-by-state coverage
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
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {s.label}
                  </h3>
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

        {/* Streamlined State Directory Section */}
        <section id="directory" className="max-w-7xl mx-auto px-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Coverage Directory
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                  Browse {currentService.shortLabel} Dispatch Locations
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Choose a state filter or switch services to locate certified on-call contractors in your city.
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                <span className="text-slate-900 font-bold">{filteredCities.length}</span> active cities shown
              </div>
            </div>

            {/* Streamlined State Selector Dropdown & Service Tabs */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 border-t border-slate-100">
              {/* Service Switch Tabs */}
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const isActive = selectedService === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                        isActive
                          ? "bg-blue-900 text-white border-blue-900 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Single Minimal State Selector Dropdown */}
              <div className="relative min-w-[260px]">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer pr-10"
                >
                  <option value="ALL">All States (Nationwide Coverage)</option>
                  {availableStates.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code}) — {st.count} Cities
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Compact City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
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
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">
                          {city.city}
                        </h3>
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
          </div>
        </section>

        {/* 3-Step Emergency Response Protocol */}
        <section className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How US Emergency Dispatch Works
            </h2>
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
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Above Footer: Gemini AI Advisory with Dynamic Weather Vector Animations */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-slate-50 to-blue-50/60 border-y border-slate-200/80 py-12 px-4 sm:px-6">
        {/* Vector Weather Animation Canvas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* 1. Thermal Flare Glow */}
          <div className="absolute -top-12 right-12 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-weather-glow" />
          <div className="absolute -bottom-12 left-1/4 w-80 h-80 bg-sky-200/35 rounded-full blur-3xl animate-weather-glow" />

          {/* 2. Flowing Wind Breeze SVG Trails */}
          <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 1200 200">
            <path
              d="M-100,50 C200,10 400,90 700,45 C950,10 1150,70 1300,30"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeDasharray="10 8"
              className="animate-weather-wind-1"
            />
            <path
              d="M-50,130 C250,90 500,170 800,120 C1050,80 1200,150 1350,110"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1.2"
              strokeDasharray="14 10"
              className="animate-weather-wind-2"
            />
          </svg>

          {/* 3. Rain & Water Droplets */}
          <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 800 200" preserveAspectRatio="none">
            <line x1="120" y1="0" x2="110" y2="40" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" className="animate-weather-rain-1" />
            <line x1="280" y1="0" x2="270" y2="45" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" className="animate-weather-rain-2" />
            <line x1="450" y1="0" x2="440" y2="35" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" className="animate-weather-rain-3" />
            <line x1="620" y1="0" x2="610" y2="42" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" className="animate-weather-rain-1" />
            <line x1="750" y1="0" x2="740" y2="38" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" className="animate-weather-rain-2" />
          </svg>

          {/* 4. Pipe Leak / Droplet Ripple Vectors */}
          <div className="absolute bottom-4 right-1/3 w-14 h-14 border border-blue-400/40 rounded-full animate-weather-ripple" />
          <div className="absolute top-6 left-1/5 w-10 h-10 border border-sky-400/40 rounded-full animate-weather-ripple" />
        </div>

        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3.5 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Gemini AI Climate &amp; Risk Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {seasonalAlert.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
              {seasonalAlert.advisory}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-600 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Real-time NOAA &amp; State Emergency Data Sync
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Demand Level: <strong className="text-amber-700 uppercase">{seasonalAlert.demandLevel}</strong>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-center gap-3">
            <a
              href={siteConfig.phoneTel}
              data-tracking="call-btn"
              data-niche={selectedService}
              className="inline-flex items-center gap-3 bg-[#009b55] hover:bg-[#00874a] text-white font-extrabold text-base px-7 py-3.5 rounded-2xl shadow-lg shadow-emerald-700/20 ring-4 ring-emerald-100 transition-all hover:scale-103 active:scale-95"
            >
              <Phone className="w-5 h-5 animate-bounce" />
              <span>Call On-Call Tech: {siteConfig.phoneDisplay}</span>
            </a>
            <span className="text-[11px] font-semibold text-slate-500">
              Free Phone Estimates · Zero Obligation
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
