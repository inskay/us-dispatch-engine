import Link from 'next/link';
import { ShieldCheck, PhoneCall, Droplets, Bug, Hammer, CheckCircle2, Award, Clock } from 'lucide-react';

export default function HomePage() {
  const categories = [
    {
      title: 'Water Damage Restoration',
      slug: 'water-damage',
      desc: 'Burst pipes, flood cleanup, structural drying & black mold mitigation.',
      icon: Droplets,
      color: 'blue',
      badge: 'Immediate Crew Dispatch',
    },
    {
      title: 'Emergency Pest Control',
      slug: 'pest-control',
      desc: 'Termites, rodent infestation, bed bugs, wasps, and crawlspace treatments.',
      icon: Bug,
      color: 'amber',
      badge: 'Safe & Certified Exterminators',
    },
    {
      title: 'Roof Leak & Storm Repair',
      slug: 'roof-repair',
      desc: 'Emergency tarping, shingle replacement, storm damage, and structural roof repairs.',
      icon: Hammer,
      color: 'emerald',
      badge: 'Insurance-Approved Estimates',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-400" />
            Top-Rated US Dispatch Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Emergency Home Repair Dispatch <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
              When Minutes Matter Most.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Directly connecting property owners across 180+ cities with vetted, local, on-call contractors for rapid emergency restoration.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:18005550199"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PhoneCall className="w-5 h-5 animate-pulse" />
              Call Dispatch: (800) 555-0199
            </a>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Free Phone Estimates</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Upfront Dispatch Fee</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Licensed Contractors</span>
          </div>
        </div>
      </section>

      {/* Services Grid (Clean UX) */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Select Your Emergency Category</h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">Trained dispatch teams are ready to connect you with specialists in your exact zip code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.slug} 
                className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:border-blue-400 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {cat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a 
                    href="tel:18005550199" 
                    className="text-emerald-700 font-extrabold text-sm flex items-center gap-1 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call Dispatch
                  </a>
                  <span className="text-xs font-semibold text-slate-400">24/7 Priority</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-4 space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Rapid Response</h4>
            <p className="text-xs text-slate-500">Fast phone connection with verified technicians ready to assess the issue.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Vetted Contractors</h4>
            <p className="text-xs text-slate-500">Qualified local partners operating with up-to-date regional certifications.</p>
          </div>

          <div className="p-4 space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Direct Quotes</h4>
            <p className="text-xs text-slate-500">Transparent phone evaluations before any physical work starts on your property.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
