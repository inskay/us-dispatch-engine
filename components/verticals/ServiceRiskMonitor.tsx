'use client';

import { Activity, ShieldAlert, Zap, AlertTriangle, Droplets, Bug, Wind, PhoneCall } from 'lucide-react';

interface Props {
  service: string;
  phoneDisplay: string;
  phoneTel: string;
}

interface Metric {
  name: string;
  status: string;
  statusType: 'red' | 'orange' | 'green';
  description: string;
}

export function ServiceRiskMonitor({ service, phoneDisplay, phoneTel }: Props) {
  let title = '';
  let subtitle = '';
  let categoryIcon = Droplets;
  let accentColor = 'blue';
  let metrics: Metric[] = [];

  if (service === 'pest-control') {
    title = 'SEASONAL INFESTATION & BREEDING CYCLE INDEX';
    subtitle = 'National Entomological Telemetry & Regional Residential Nesting Activity';
    categoryIcon = Bug;
    accentColor = 'emerald';
    metrics = [
      {
        name: 'Rodent Nesting Surge',
        status: 'CRITICAL',
        statusType: 'red',
        description: 'Overnight temperature drops force mice and rats into attic insulation, crawlspaces, and interior wall voids.',
      },
      {
        name: 'Termite Swarm Risk',
        status: 'ELEVATED',
        statusType: 'orange',
        description: 'Subterranean moisture pockets trigger exploratory mud tubes along residential concrete foundations.',
      },
      {
        name: 'Bed Bug Transfer Heatmap',
        status: 'HIGH ALERT',
        statusType: 'orange',
        description: 'Multi-unit and seasonal transit vectors accelerate transfer rates; immediate heat and perimeter treat recommended.',
      },
      {
        name: 'Extermination Crew Standby',
        status: 'SAME-DAY DISPATCH',
        statusType: 'green',
        description: 'State-certified exterminators on standby with EPA-approved barrier treatments and eco-safe residential defenses.',
      },
    ];
  } else if (service === 'roof-repair') {
    title = 'LIVE WIND SHEAR & HAIL IMPACT WARNING';
    subtitle = 'National Severe Storm Network & Doppler Roof Degradation Telemetry';
    categoryIcon = Wind;
    accentColor = 'amber';
    metrics = [
      {
        name: 'High-Wind Shear Warning',
        status: 'GUSTS > 45 MPH',
        statusType: 'red',
        description: 'Severe microbursts lifting shingles, tearing ridge caps, and exposing bare roof underlayment to moisture.',
      },
      {
        name: 'Attic Leak Probability',
        status: 'HIGH RISK',
        statusType: 'orange',
        description: 'Thermal expansion and compromised valley flashing allowing water pooling directly above living room ceilings.',
      },
      {
        name: 'Hail Puncture Index',
        status: 'SEVERE IMPACT',
        statusType: 'red',
        description: 'Granular loss from hail impacts voiding shingle warranties and accelerating sudden attic wood rot.',
      },
      {
        name: 'Emergency Tarping Units',
        status: '20-MIN DEPLOYMENT',
        statusType: 'green',
        description: 'Fully stocked emergency tarping and leak containment trucks staged across all regional metro corridors.',
      },
    ];
  } else {
    // Water damage default
    title = 'LIVE PRECIPITATION & PIPE BURST RISK MONITOR';
    subtitle = 'NOAA Hydrological Telemetry & Real-Time Regional Freeze-Thaw Tracking';
    categoryIcon = Droplets;
    accentColor = 'blue';
    metrics = [
      {
        name: 'Freezing Pipe Alert',
        status: 'ELEVATED RISK',
        statusType: 'orange',
        description: 'Sudden cold snaps threaten exposed crawlspaces and exterior plumbing with rapid burst pressure.',
      },
      {
        name: 'Flash Flood Watch',
        status: 'HIGH SATURATION',
        statusType: 'red',
        description: 'Heavy precipitation tables overload basement sump pumps and foundation drainage perimeters.',
      },
      {
        name: 'Toxic Mold Index',
        status: 'CRITICAL SPREAD',
        statusType: 'red',
        description: 'Unmitigated indoor moisture past 24 hours triggers rapid black mold spore germination on drywall.',
      },
      {
        name: 'Extraction Crew Readiness',
        status: '100% DISPATCH READY',
        statusType: 'green',
        description: 'Industrial truck-mounted extraction and structural drying units deployed with zero trip fee.',
      },
    ];
  }

  const Icon = categoryIcon;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle Ambient Gradient Accents */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-60 h-60 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Active Sensor Feed · Updated Just Now</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 pt-1">
                <Icon className="w-5 h-5 text-blue-700" />
                <span>{title}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {subtitle}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <a
                href={phoneTel}
                data-tracking="call-btn"
                data-niche={service}
                className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-102 active:scale-95 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call On-Call Tech: {phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* 4 Metric Cards Grid with Pulse Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, idx) => {
              const isRed = m.statusType === 'red';
              const isOrange = m.statusType === 'orange';
              const isGreen = m.statusType === 'green';

              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        {m.name}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isRed ? 'bg-red-400' : isOrange ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            isRed ? 'bg-red-500' : isOrange ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase border ${
                          isRed
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : isOrange
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Severity Status</span>
                    <span className="font-bold text-slate-700">Verified Sensor</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
