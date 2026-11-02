'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, Star, ExternalLink } from "lucide-react";
import type { City } from "@/lib/niches";

interface Props {
  service: string;
  serviceLabel: string;
  accentColor: string;
  cities: City[];
}

const TOP_STATES = [
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

export function ServiceCityDirectory({
  service,
  serviceLabel,
  cities,
}: Props) {
  const [selectedState, setSelectedState] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return cities.filter((c) => {
      const matchesState =
        selectedState === "ALL" || c.state_code.toUpperCase() === selectedState;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.zip.includes(q) ||
        c.zips_list.some((z) => z.includes(q));
      return matchesState && matchesSearch;
    });
  }, [cities, selectedState, search]);

  return (
    <div className="space-y-6">
      {/* State Filter Buttons + Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${serviceLabel} coverage by city or ZIP...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="text-xs font-bold text-slate-500 whitespace-nowrap self-center sm:self-auto">
            Showing <strong className="text-slate-900 font-extrabold">{filtered.length}</strong> active dispatch hubs
          </div>
        </div>

        {/* State Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter State:</span>
          {TOP_STATES.map(({ code, label }) => {
            const isActive = selectedState === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedState(code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-blue-900 text-white border-blue-900 shadow-xs scale-102"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((city) => {
          const href = `/${service}/${city.slug}`;
          return (
            <Link
              key={city.slug}
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

              <div className="space-y-1.5 text-xs text-slate-600 mt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{city.response_mins} min avg dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Starting at \${city.avg_cost}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-400 text-[11px] truncate">
                    ZIP: {city.zip} ({city.neighborhoods[0] || "Metro Area"})
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
                <span>View {city.city} Hub</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
          <p className="font-bold text-slate-800 text-base">No cities match your filter.</p>
          <p className="text-slate-500 text-xs">
            Try searching a different city or reset the state filter. We service all 50 states via direct dispatch!
          </p>
          <button
            onClick={() => { setSelectedState("ALL"); setSearch(""); }}
            className="mt-3 px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
