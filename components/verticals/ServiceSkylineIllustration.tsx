'use client';

import { useState } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  service: string;
  phoneDisplay: string;
  phoneTel: string;
}

export function ServiceSkylineIllustration({ service, phoneDisplay, phoneTel }: Props) {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);

  // Configuration per vertical
  if (service === 'pest-control') {
    const hotspots = [
      {
        id: 0,
        x: '28%',
        y: '26%',
        title: 'Attic & Roofline Soffits',
        badge: 'High Rodent Risk',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        detail: 'Mice and rats exploit 1/4-inch roof vents and fascia gaps to nest in fiberglass attic insulation.',
        action: 'Attic Sanitization & Steel Mesh Exclusion',
      },
      {
        id: 1,
        x: '52%',
        y: '78%',
        title: 'Foundation Perimeter Trench',
        badge: 'Termite Defense',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        detail: 'Subterranean termite worker colonies travel through ground moisture channels toward structural sill plates.',
        action: 'Termidor HE Liquid Barrier Protection',
      },
      {
        id: 2,
        x: '75%',
        y: '58%',
        title: 'Crawlspace & Wall Voids',
        badge: 'Roach & Pest Harbor',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        detail: 'Moisture accumulation in crawlspace ductwork provides ideal breeding conditions for German roaches.',
        action: 'Micro-Encapsulated Residual Eradication',
      },
    ];

    const current = activeHotspot !== null ? hotspots[activeHotspot] : hotspots[0];

    return (
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Animated Radar Scanning Line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-weather-wind-1" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Vector Illustration Canvas */}
          <div className="w-full lg:w-3/5 relative bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                ACTIVE PERIMETER DEFENSE RADAR
              </span>
              <span>Scanning: 3 Critical Zones</span>
            </div>

            {/* SVG Home Vector with Radar Grids */}
            <div className="relative aspect-[16/9] w-full flex items-center justify-center">
              <svg
                viewBox="0 0 600 340"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Radar Rings */}
                <circle cx="300" cy="180" r="160" stroke="#059669" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
                <circle cx="300" cy="180" r="110" stroke="#059669" strokeWidth="1" strokeDasharray="3 5" opacity="0.4" />
                <circle cx="300" cy="180" r="60" stroke="#10b981" strokeWidth="1.2" opacity="0.5" />

                {/* Ground Line */}
                <line x1="20" y1="270" x2="580" y2="270" stroke="#334155" strokeWidth="2" />
                <rect x="20" y="270" width="560" height="40" fill="#0f172a" opacity="0.6" />

                {/* House Architecture */}
                {/* Main Body */}
                <rect x="180" y="150" width="240" height="120" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                {/* Roof */}
                <polygon points="160,150 300,60 440,150" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                {/* Chimney */}
                <rect x="360" y="80" width="30" height="50" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                {/* Attic Vent */}
                <circle cx="300" cy="115" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Front Door */}
                <rect x="275" y="200" width="50" height="70" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Windows with Lights */}
                <rect x="205" y="175" width="45" height="40" rx="2" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="350" y="175" width="45" height="40" rx="2" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.5" />

                {/* Subterranean Foundation Trench */}
                <rect x="160" y="268" width="280" height="12" fill="#065f46" fillOpacity="0.4" stroke="#10b981" strokeWidth="1" strokeDasharray="4 2" />

                {/* Shrubbery & Lawn */}
                <path d="M120,270 Q140,240 160,270 Z" fill="#047857" opacity="0.6" />
                <path d="M440,270 Q460,240 480,270 Z" fill="#047857" opacity="0.6" />
              </svg>

              {/* Interactive Hotspot Nodes */}
              {hotspots.map((h) => {
                const isSelected = activeHotspot === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotspot(h.id)}
                    style={{ left: h.x, top: h.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    title={h.title}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? 'bg-emerald-400' : 'bg-blue-400 group-hover:bg-emerald-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-xs font-black border-2 ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-white shadow-lg shadow-emerald-500/50 scale-110'
                            : 'bg-slate-900 text-emerald-400 border-emerald-500 hover:scale-110'
                        } transition-all duration-200`}
                      >
                        {h.id + 1}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Click radar nodes <span className="text-emerald-400 font-bold">1, 2, or 3</span> to inspect vulnerability telemetry
            </p>
          </div>

          {/* Interactive Inspection Card */}
          <div className="w-full lg:w-2/5 space-y-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Zone #{current.id + 1} Telemetry
              </span>
              <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                {current.badge}
              </span>
            </div>

            <h3 className="text-lg font-black text-white">{current.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.detail}
            </p>

            <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Mitigation
              </span>
              <p className="text-xs font-semibold text-slate-200">{current.action}</p>
            </div>

            <div className="pt-2">
              <a
                href={phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Dispatch Tech to Zone: {phoneDisplay}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (service === 'roof-repair') {
    const hotspots = [
      {
        id: 0,
        x: '34%',
        y: '22%',
        title: 'Chimney & Step Flashing',
        badge: 'Water Entry Point',
        badgeColor: 'bg-red-100 text-red-800 border-red-200',
        detail: 'Rusted or separated flashing around the chimney masonry allows wind-driven rain to run straight onto drywall.',
        action: 'Immediate Silicone Sealing & Counter-Flashing Repair',
      },
      {
        id: 1,
        x: '55%',
        y: '38%',
        title: 'Windward Asphalt Shingles',
        badge: 'Wind Shear Failure',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        detail: 'High gusts over 45 MPH tear away granule seals, curling shingle tabs and exposing vulnerable plywood decking.',
        action: 'Heavy-Duty 20-Mil Emergency Storm Tarping',
      },
      {
        id: 2,
        x: '76%',
        y: '65%',
        title: 'Gutter Eaves & Valley Dam',
        badge: 'Ice Dam / Overflow',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
        detail: 'Clogged gutter aprons cause standing rainwater to back up underneath the first two rows of starter shingles.',
        action: 'Valley Debris Clearing & Drip Edge Re-alignment',
      },
    ];

    const current = activeHotspot !== null ? hotspots[activeHotspot] : hotspots[0];

    return (
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Animated Storm Flow Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
            <line x1="0" y1="20" x2="800" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="16 12" className="animate-weather-wind-1" />
            <line x1="0" y1="120" x2="800" y2="180" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="20 16" className="animate-weather-wind-2" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Vector Illustration Canvas */}
          <div className="w-full lg:w-3/5 relative bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                STORM CLOUD &amp; WIND SHEAR TRAJECTORY
              </span>
              <span>Telemetry: 3 Critical Points</span>
            </div>

            {/* SVG Rooftop Vector with Wind Vectors */}
            <div className="relative aspect-[16/9] w-full flex items-center justify-center">
              <svg
                viewBox="0 0 600 340"
                className="w-full h-full select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Storm Clouds */}
                <path
                  d="M80,50 Q110,20 150,35 Q180,10 220,30 Q260,20 280,50 Q310,70 280,90 Q120,95 80,50 Z"
                  fill="#334155"
                  opacity="0.7"
                />
                <path
                  d="M240,65 Q270,35 310,50 Q340,30 380,55 Q410,70 380,95 Q280,100 240,65 Z"
                  fill="#1e293b"
                  opacity="0.8"
                />

                {/* Rain Trajectory Lines */}
                <line x1="120" y1="80" x2="190" y2="150" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                <line x1="180" y1="85" x2="250" y2="155" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
                <line x1="260" y1="90" x2="330" y2="160" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />

                {/* Ground */}
                <line x1="20" y1="280" x2="580" y2="280" stroke="#334155" strokeWidth="2" />

                {/* House Structure */}
                <rect x="140" y="180" width="320" height="100" fill="#1e293b" stroke="#475569" strokeWidth="2" />

                {/* Roof Pitches & Shingles */}
                <polygon points="120,180 300,75 480,180" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="160" y1="157" x2="440" y2="157" stroke="#475569" strokeWidth="1" strokeDasharray="8 6" />
                <line x1="200" y1="133" x2="400" y2="133" stroke="#475569" strokeWidth="1" strokeDasharray="8 6" />
                <line x1="250" y1="105" x2="350" y2="105" stroke="#475569" strokeWidth="1" strokeDasharray="8 6" />

                {/* Chimney & Flashing */}
                <rect x="200" y="70" width="35" height="55" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                <polygon points="195,125 240,125 235,115 200,115" fill="#e2e8f0" opacity="0.8" />

                {/* Gutters & Downspout */}
                <rect x="115" y="178" width="370" height="8" rx="2" fill="#64748b" />
                <rect x="475" y="186" width="10" height="94" fill="#475569" />
              </svg>

              {/* Interactive Hotspot Nodes */}
              {hotspots.map((h) => {
                const isSelected = activeHotspot === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotspot(h.id)}
                    style={{ left: h.x, top: h.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    title={h.title}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isSelected ? 'bg-amber-400' : 'bg-sky-400 group-hover:bg-amber-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-xs font-black border-2 ${
                          isSelected
                            ? 'bg-amber-500 text-white border-white shadow-lg shadow-amber-500/50 scale-110'
                            : 'bg-slate-900 text-amber-400 border-amber-500 hover:scale-110'
                        } transition-all duration-200`}
                      >
                        {h.id + 1}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Click storm nodes <span className="text-amber-400 font-bold">1, 2, or 3</span> to inspect impact trajectory
            </p>
          </div>

          {/* Interactive Inspection Card */}
          <div className="w-full lg:w-2/5 space-y-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Impact Point #{current.id + 1}
              </span>
              <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                {current.badge}
              </span>
            </div>

            <h3 className="text-lg font-black text-white">{current.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.detail}
            </p>

            <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Emergency Protocol
              </span>
              <p className="text-xs font-semibold text-slate-200">{current.action}</p>
            </div>

            <div className="pt-2">
              <a
                href={phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>Dispatch Tarping Unit: {phoneDisplay}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Water Damage Default
  const hotspots = [
    {
      id: 0,
      x: '28%',
      y: '72%',
      title: 'Basement Slab & Sump Well',
      badge: 'Flood Inundation',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      detail: 'Hydrostatic groundwater pressure forces water through hairline concrete cracks and failed check valves.',
      action: 'High-Volume Submersible Pump Extraction & Sludge Clearing',
    },
    {
      id: 1,
      x: '48%',
      y: '48%',
      title: 'Main Supply Line & Manifold',
      badge: 'Pipe Burst Risk',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      detail: 'Freezing cycles cause internal ice expansion, rupturing copper and PEX lines inside exterior wall cavities.',
      action: 'Line Isolation, Thermal Drying & Moisture Extraction',
    },
    {
      id: 2,
      x: '72%',
      y: '56%',
      title: 'Drywall & Baseboard Cavity',
      badge: 'Toxic Mold Zone',
      badgeColor: 'bg-red-100 text-red-800 border-red-200',
      detail: 'Wicking action pulls standing water 30 inches up drywall, initiating toxic black mold colonies within 24 hours.',
      action: 'Flood Cuts, Dehumidification & Antimicrobial Sanitization',
    },
  ];

  const current = activeHotspot !== null ? hotspots[activeHotspot] : hotspots[0];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Animated Water Reflection Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent animate-weather-wind-1" />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Vector Illustration Canvas */}
        <div className="w-full lg:w-3/5 relative bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-sky-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              HYDROLOGICAL WATER LEVEL &amp; FLOOD CROSS-SECTION
            </span>
            <span>Telemetry: 3 Critical Nodes</span>
          </div>

          {/* SVG Home Cross-Section with Water Wave */}
          <div className="relative aspect-[16/9] w-full flex items-center justify-center">
            <svg
              viewBox="0 0 600 340"
              className="w-full h-full select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky / Horizon */}
              <line x1="20" y1="180" x2="580" y2="180" stroke="#334155" strokeWidth="2" />
              <rect x="20" y="180" width="560" height="140" fill="#0f172a" opacity="0.8" />

              {/* House Cross Section */}
              {/* Above Ground Living Area */}
              <rect x="150" y="80" width="300" height="100" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              {/* Roof */}
              <polygon points="130,80 300,15 470,80" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

              {/* Below Ground Basement */}
              <rect x="150" y="180" width="300" height="110" fill="#020617" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />

              {/* Water Flooding Wave in Basement */}
              <path
                d="M152,240 Q 225,230 300,245 T 448,238 L 448,288 L 152,288 Z"
                fill="url(#waterGradient)"
                opacity="0.85"
              />
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Pipe Burst Concentric Rings */}
              <circle cx="280" cy="180" r="10" stroke="#38bdf8" strokeWidth="1.5" className="animate-ping" opacity="0.7" />
              <circle cx="280" cy="180" r="22" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
              <line x1="280" y1="120" x2="280" y2="240" stroke="#0ea5e9" strokeWidth="3" />

              {/* Ground Trees / Shrubbery */}
              <path d="M70,180 Q95,140 120,180 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <path d="M480,180 Q510,135 540,180 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            </svg>

            {/* Interactive Hotspot Nodes */}
            {hotspots.map((h) => {
              const isSelected = activeHotspot === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHotspot(h.id)}
                  style={{ left: h.x, top: h.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                  title={h.title}
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? 'bg-sky-400' : 'bg-blue-400 group-hover:bg-sky-400'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-xs font-black border-2 ${
                        isSelected
                          ? 'bg-sky-500 text-white border-white shadow-lg shadow-sky-500/50 scale-110'
                          : 'bg-slate-900 text-sky-400 border-sky-500 hover:scale-110'
                      } transition-all duration-200`}
                    >
                      {h.id + 1}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            Click flood nodes <span className="text-sky-400 font-bold">1, 2, or 3</span> to inspect hydrostatic cross-section
          </p>
        </div>

        {/* Interactive Inspection Card */}
        <div className="w-full lg:w-2/5 space-y-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Hydro Sensor #{current.id + 1}
            </span>
            <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          <h3 className="text-lg font-black text-white">{current.title}</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {current.detail}
          </p>

          <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-sky-400 tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Extraction Strategy
            </span>
            <p className="text-xs font-semibold text-slate-200">{current.action}</p>
          </div>

          <div className="pt-2">
            <a
              href={phoneTel}
              data-tracking="call-btn"
              data-niche={service}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>Dispatch Water Crew: {phoneDisplay}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
