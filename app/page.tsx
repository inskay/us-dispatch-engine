'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  PhoneCall, 
  Droplets, 
  Bug, 
  Hammer, 
  CheckCircle2, 
  Award, 
  Clock, 
  MapPin, 
  Search, 
  Navigation, 
  Sparkles, 
  ArrowRight,
  Flame,
  Wrench
} from 'lucide-react';

export default function HomePage() {
  const [selectedService, setSelectedService] = useState('water-damage');
  const [locationInput, setLocationInput] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Auto detect location simulation
  const handleDetectLocation = () => {
    setIsLocating(true);
    setStatusMessage('Locating your area...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setLocationInput('Detected: Current Area (US Dispatch Region)');
          setStatusMessage('Location identified! Dispatch crews ready.');
        },
        () => {
          setIsLocating(false);
          setLocationInput('Dallas, TX (Default Regional Hub)');
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
    // Redirect to direct tel or specific location search
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
      activeColor: 'border-blue-600 shadow-blue-100',
      features: ['24/7 Water Extraction', 'Insurance Billing Direct', 'Certified Antimicrobial Drying'],
      phone: '(800) 555-0199',
    },
    {
      id: 'pest-control',
      title: 'Emergency Pest Extermination',
      tagline: 'Immediate Pest Removal',
      desc: 'Targeted extermination for bed bugs, termites, rodents, hornets, and invasive pests.',
      icon: Bug,
      badge: 'Same-Day Dispatch',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      activeColor: 'border-amber-600 shadow-amber-100',
      features: ['Eco-Safe Treatments', 'Complete Colony Removal', 'Preventive Barrier Defense'],
      phone: '(800) 555-0199',
    },
    {
      id: 'roof-repair',
      title: 'Emergency Roof & Storm Repair',
      tagline: 'Emergency Tarping & Leak Stop',
      desc: 'Severe storm damage, fallen tree limbs, missing shingles, and immediate roof seal.',
      icon: Hammer,
      badge: 'Critical Crew On-Call',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeColor: 'border-emerald-600 shadow-emerald-100',
      features: ['Immediate Waterproof Tarping', 'Storm Insurance Support', 'Commercial & Residential'],
      phone: '(800) 555-0199',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-50 selection:bg-blue-500 selection:text-white">
      
      {/* Interactive Hero Header */}
      <section className="relative bg-white border-b border-slate-200/80 pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-slate-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Live Activity Pulse Indicator */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs transition hover:bg-emerald-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>LinesFix Dispatch Live: 412 Techs Currently Active Across 182 US Cities</span>
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

          {/* Interactive Dispatch Search & Matching Engine */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form 
              onSubmit={handleSearchSubmit} 
              className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 transition hover:border-blue-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                
                {/* Service Selector Dropdown */}
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

                {/* Location / Zip / Address Input */}
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

                {/* Submit / Match CTA */}
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

              {/* Status Indicator */}
              {statusMessage && (
                <div className="mt-3 text-xs text-blue-700 font-medium bg-blue-50 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  {statusMessage}
                </div>
              )}
            </form>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fast Phone Dispatch</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct Local Contractor</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Upfront Deposit</span>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Services Cards */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Certified Emergency Networks</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">Available Dispatch Categories</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-md">
            Click on any service category to instantly connect with an on-duty technician or review coverage specs.
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
                  {/* Top Badge & Icon */}
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

                  {/* Bullet features */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                    {item.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Emergency Call Button for this Card */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <a 
                    href="tel:18005550199"
                    className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-center text-xs transition duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Desk: {item.phone}</span>
                  </a>
                  <Link 
                    href={`/${item.id}`}
                    className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition"
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

      {/* Trust & Verification Credentials */}
      <section className="bg-white border-y border-slate-200/80 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="p-3 rounded-xl bg-blue-100/60 text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Under 60-Sec Connection</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">No robotic IVR mazes. Your call routes directly to local dispatch operators on duty.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="p-3 rounded-xl bg-emerald-100/60 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">State-Licensed Specialists</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Contractors maintain state-level compliance, liability coverage, and required certifications.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="p-3 rounded-xl bg-amber-100/60 text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Free Transparent Estimates</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Discuss repair scopes directly over the phone before dispatching physical equipment to your site.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
