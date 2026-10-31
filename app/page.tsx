'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Phone, Droplets, Bug, Home, ExternalLink, MapPin, Clock, Star, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import citiesData from "@/data/cities.json";

interface CityPreview {
  city: string;
  state_code: string;
  slug: string;
  avg_cost: number;
  response_mins: number;
}

const CITIES: CityPreview[] = citiesData as CityPreview[];

const NICHES = [
  {
    id: "water-damage",
    label: "Water Damage",
    emoji: "💧",
    Icon: Droplets,
    color: "text-blue-700",
    bgColor: "bg-blue-50/70",
    borderColor: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    badge: "bg-blue-100 text-blue-900 border border-blue-200",
  },
  {
    id: "pest-control",
    label: "Pest Control",
    emoji: "🐛",
    Icon: Bug,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50/70",
    borderColor: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    badge: "bg-emerald-100 text-emerald-900 border border-emerald-200",
  },
  {
    id: "roof-repair",
    label: "Roof Repair",
    emoji: "🏠",
    Icon: Home,
    color: "text-amber-800",
    bgColor: "bg-amber-50/70",
    borderColor: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    badge: "bg-amber-100 text-amber-900 border border-amber-200",
  },
];

export default function DirectoryDashboard() {
  const [search, setSearch] = useState("");
  const [activeNiche, setActiveNiche] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return CITIES.filter((c) => {
      const q = search.toLowerCase();
      return (
        !q ||
        c.city.toLowerCase().includes(q) ||
        c.state_code.toLowerCase().includes(q) ||
        c.slug.includes(q)
      );
    });
  }, [search]);

  const totalPages = NICHES.length * CITIES.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-blue-950 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>US PAY-PER-CALL DISPATCH ENGINE — {totalPages} LOCALIZED LANDING PAGES ACTIVE</span>
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-black text-lg">
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
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>{siteConfig.phoneDisplay}</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Hero stats */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-900 rounded-full">
            Programmatic SEO Hub
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Live City Dispatch Directory
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            All high-converting programmatic landing pages generated across active US Tier-2/Tier-3 metropolitan hubs. Search or filter by niche to test any page.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
            {[
              { label: "Active Cities", value: CITIES.length },
              { label: "Service Niches", value: NICHES.length },
              { label: "Generated URLs", value: totalPages },
              { label: "Avg Dispatch", value: "23 min" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Niche Filter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by city, state code (e.g. TX, FL), or slug..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveNiche(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
                activeNiche === null
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              All Niches
            </button>
            {NICHES.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveNiche(activeNiche === n.id ? null : n.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
                  activeNiche === n.id
                    ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                    : `bg-white ${n.color} border-slate-200 hover:bg-slate-50`
                }`}
              >
                {n.emoji} {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Niche sections */}
        {NICHES.filter((n) => !activeNiche || n.id === activeNiche).map((niche) => (
          <section key={niche.id} className="space-y-4">
            {/* Section header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <niche.Icon className={`w-5 h-5 ${niche.color}`} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {niche.emoji} {niche.label}
                </h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${niche.badge}`}>
                {filtered.length} Live Cities
              </span>
            </div>

            {/* City cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((city) => {
                const href = `/${niche.id}/${city.slug}`;
                return (
                  <Link
                    key={`${niche.id}-${city.slug}`}
                    href={href}
                    className={`group block rounded-xl border border-slate-200 bg-white hover:border-blue-400 p-4 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5`}
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">
                          {city.city}
                        </p>
                        <p className="text-xs font-bold text-slate-500">{city.state_code}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-colors shrink-0" />
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{city.response_mins} min avg dispatch</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>Starts at \${city.avg_cost}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="font-mono text-[11px] text-slate-400">{city.slug}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
                      <span>Preview Page</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 text-sm">
                No cities match &quot;{search}&quot; in this category.
              </div>
            )}
          </section>
        ))}

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
            {siteConfig.siteName} · {siteConfig.domain}
          </p>
        </div>
      </main>
    </div>
  );
}
