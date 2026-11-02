'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  PhoneCall, 
  Droplets, 
  Bug, 
  Hammer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Sparkles, 
  ArrowRight,
  CloudLightning,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Wind
} from 'lucide-react';

export default function HomePage() {
  const [selectedService, setSelectedService] = useState('water-damage');
  const [locationInput, setLocationInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showDirectory, setShowDirectory] = useState(false);
  const [directoryFilter, setDirectoryFilter] = useState<'water-damage' | 'pest-control' | 'roof-repair'>('water-damage');

  // Live Dispatch Social Proof Toasts
  const dispatchEvents = [
    { city: 'Tampa, FL', service: 'Emergency Water Extraction crew dispatched' },
    { city: 'Dallas, TX', service: 'Storm roof tarping unit routed on-site' },
    { city: 'Atlanta, GA', service: 'Emergency pest technician assigned' },
    { city: 'Orlando, FL', service: 'Basement flood mitigation active' },
    { city: 'Houston, TX', service: 'Burst pipe repair dispatched' },
  ];
  const [currentEventIdx, setCurrentEventIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEventIdx((prev) => (prev + 1) % dispatchEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [dispatchEvents.length]);

  const topHubs = [
    { name: 'Dallas, TX', slug: 'dallas-tx' },
    { name: 'Houston, TX', slug: 'houston-tx' },
    { name: 'Austin, TX', slug: 'austin-tx' },
    { name: 'Orlando, FL', slug: 'orlando-fl' },
    { name: 'Tampa, FL', slug: 'tampa-fl' },
    { name: 'Miami, FL', slug: 'miami-fl' },
    { name: 'Atlanta, GA', slug: 'atlanta-ga' },
    { name: 'Phoenix, AZ', slug: 'phoenix-az' },
    { name: 'Charlotte, NC', slug: 'charlotte-nc' },
    { name: 'Las Vegas, NV', slug: 'las-vegas-nv' },
    { name: 'Denver, CO', slug: 'denver-co' },
    { name: 'Nashville, TN', slug: 'nashville-tn' },
    { name: 'Columbus, OH', slug: 'columbus-oh' },
    { name: 'Indianapolis, IN', slug: 'indianapolis-in' },
    { name: 'Kansas City, MO', slug: 'kansas-city-mo' },
    { name: 'Philadelphia, PA', slug: 'philadelphia-pa' },
  ];

  const handleDetectLocation = () => {
    setIsLocating(true);
    setStatusMessage('Locating regional dispatch grid...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setLocationInput('Detected: Active US Metro Area');
          setStatusMessage('Location matched! Local priority line connected.');
        },
        () => {
          setIsLocating(false);
          setLocationInput('Dallas, TX (Regional Hub)');
          setStatusMessage('Regional dispatch auto-selected.');
        }
      );
    } else {
      setIsLocating(false);
      setLocationInput('Orlando, FL');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = 'tel:18005550199';
  };

  const services = [
    {
      id: 'water-damage',
      title: 'Water Damage Restoration',
      tagline: 'Rapid Extraction & Mold Prevention',
      desc: 'Burst pipes, appliance leaks, flooded basements, and structural thermal drying.',
      icon: Droplets,
      badge: 'Avg Response: 18 Mins',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      features: ['24/7 Water Extraction', 'Insurance Billing Direct', 'Certified Antimicrobial Drying'],
      sampleSlug: 'water-damage/dallas-tx',
    },
    {
      id: 'pest-control',
      title: 'Emergency Pest Extermination',
      tagline: 'Immediate Pest Removal',
      desc: 'Targeted extermination for bed bugs, termites, rodents, hornets, and invasive pests.',
      icon: Bug,
      badge: 'Same-Day Dispatch',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      features: ['Eco-Safe Treatments', 'Complete Colony Removal', 'Preventive Barrier Defense'],
      sampleSlug: 'pest-control/orlando-fl',
    },
    {
      id: 'roof-repair',
      title: 'Emergency Roof & Storm Repair',
      tagline: 'Emergency Tarping & Leak Stop',
      desc: 'Severe storm damage, fallen tree limbs, missing shingles, and immediate roof seal.',
      icon: Hammer,
      badge: 'Critical Crew On-Call',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      features: ['Immediate Waterproof Tarping', 'Storm Insurance Support', 'Commercial & Residential'],
      sampleSlug: 'roof-repair/miami-fl',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50 selection:bg-blue-500 selection:text-white relative">
      
      {/* 1. Live AI Advisory with Ambient Vector Weather Motion Backdrop */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-blue-900/40 text-slate-100 py-3.5 px-4 shadow-sm">
        {/* Animated Vector Stream: Rain Streams & Wind Flow */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {/* Horizontal Wind Lines */}
          <div className="absolute top-2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-wind-slow" />
          <div className="absolute top-6 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-wind-fast" />
          <div className="absolute bottom-2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-wind-slow" />

          {/* Vertical Rain & Droplet SVG Shapes */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-cyan-300">
              <line x1="15%" y1="0" x2="14%" y2="22" className="animate-rain-drop" />
              <line x1="38%" y1="0" x2="37%" y2="28" className="animate-rain-drop" style={{ animationDelay: '0.4s' }} />
              <line x1="62%" y1="0" x2="61%" y2="24" className="animate-rain-drop" style={{ animationDelay: '0.9s' }} />
              <line x1="84%" y1="0" x2="83%" y2="20" className="animate-rain-drop" style={{ animationDelay: '1.2s' }} />
            </g>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-black text-[10px] tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-xs">
                <Wind className="w-3.5 h-3.5 animate-spin" /> Weather AI Alert
              </span>
              <span className="text-slate-300">
                <strong className="text-white font-bold">Severe Moisture & Freeze Warning:</strong> Active wind & storm front detected. Unchecked water leaks double remediation costs within 6 hours.
              </span>
            </div>
          </div>

          <a 
            href="tel:18005550199" 
            className="flex-shrink-0 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl transition transform hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce text-slate-950" />
            <span>Prevent Structural Loss: (800) 555-0199</span>
          </a>
        </div>
      </section>

      {/* 2. Interactive Hero Header */}
      <section className="relative bg-white border-b border-slate-200/80 pt-12 pb-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>LinesFix Dispatch Live: 412 Technicians Active Across 182 US Cities</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            US Home Emergency Dispatch <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              Assistance Dispatched In Minutes.
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Select your emergency type, confirm your city or zip code, and get instantly routed to a certified, licensed local contractor.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-3xl mx-auto">
            <form 
              onSubmit={handleSearchSubmit} 
              className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 transition hover:border-blue-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4 text-left">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                    Emergency Service
                  </label>
                  <select 
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                  >
                    <option value="water-damage">💧 Water Damage</option>
                    <option value="pest-control">🐜 Pest Control</option>
                    <option value="roof-repair">🔨 Emergency Roofing</option>
                  </select>
                </div>

                <div className="sm:col-span-5 text-left relative">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1 flex justify-between items-center">
                    <span>City, State or Zip</span>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-1 transition"
                    >
                      <Navigation className="w-3 h-3 text-blue-500 animate-pulse" />
                      {isLocating ? 'Locating...' : 'Use My GPS'}
                    </button>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input 
                      type="text" 
                      placeholder="e.g. Dallas, TX or 75001"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3 flex items-end">
                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Find Pro</span>
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div className="mt-3 text-xs text-blue-700 font-medium bg-blue-50 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  {statusMessage}
                </div>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* 3. Dynamic Services Cards */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Immediate Response</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Available Dispatch Categories</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-md">
            Click on any card to connect with an on-duty local technician or view dedicated regional pages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-1 mb-4">
                    {item.tagline}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <a 
                    href="tel:18005550199"
                    className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-center text-xs transition duration-200 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Desk: (800) 555-0199</span>
                  </a>
                  <Link 
                    href={`/${item.id}`}
                    className="p-3 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-xl transition"
                    title="View Directory"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Elegant Interactive Coverage Hubs Drawer */}
      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" /> Nationwide Service Directory
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Our Regional Dispatch Hubs</h3>
              <p className="text-xs text-slate-500 mt-0.5">Direct access to local programmatic dispatch pages across 182 US Tier-2 and Tier-3 cities.</p>
            </div>

            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition"
            >
              <span>{showDirectory ? 'Collapse Hubs' : 'Browse All City Hubs'}</span>
              {showDirectory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-6 pb-4 overflow-x-auto">
            <button
              onClick={() => setDirectoryFilter('water-damage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                directoryFilter === 'water-damage' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" /> Water Damage Hubs
            </button>

            <button
              onClick={() => setDirectoryFilter('pest-control')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                directoryFilter === 'pest-control' 
                  ? 'bg-amber-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bug className="w-3.5 h-3.5" /> Pest Control Hubs
            </button>

            <button
              onClick={() => setDirectoryFilter('roof-repair')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                directoryFilter === 'roof-repair' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Hammer className="w-3.5 h-3.5" /> Roofing Hubs
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 pt-2">
            {(showDirectory ? topHubs : topHubs.slice(0, 8)).map((city) => (
              <Link
                key={city.slug}
                href={`/${directoryFilter}/${city.slug}`}
                className="p-2.5 text-center rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs font-semibold transition"
              >
                {city.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <Link 
              href="/sitemap.xml" 
              className="text-xs text-slate-400 hover:text-blue-600 transition inline-flex items-center gap-1"
            >
              <span>View complete programmatic search index (546 Live City Pages)</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Fixed Live Dispatch Activity Toast (Social Proof for High Conversion) */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-slate-200/90 py-2.5 px-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all duration-500 animate-fadeIn">
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div className="text-left text-xs">
          <div className="font-extrabold text-slate-900 flex items-center gap-1">
            <span>{dispatchEvents[currentEventIdx].city}</span>
            <span className="text-[10px] text-slate-400 font-normal">• Just now</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium">
            {dispatchEvents[currentEventIdx].service}
          </div>
        </div>
      </div>

    </div>
  );
}
