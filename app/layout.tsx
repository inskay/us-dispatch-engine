import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { PhoneCall, ShieldCheck, Clock, MapPin } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinesFix | Emergency US Home Services Dispatch Network',
  description: '24/7 Rapid dispatch for Water Damage Restoration, Pest Extermination, and Emergency Roof Repair across the United States.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        {/* Top Emergency Ribbon */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Dispatch Active Across 50 States
            </span>
            <span className="hidden sm:flex items-center gap-4">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Licensed & Insured Pros</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> 24/7 Immediate Response</span>
            </span>
          </div>
        </div>

        {/* Global Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-blue-700 transition">
                LF
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Lines<span className="text-blue-600">Fix</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  National Dispatch
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link href="/water-damage" className="hover:text-blue-600 transition">Water Damage</Link>
              <Link href="/pest-control" className="hover:text-blue-600 transition">Pest Control</Link>
              <Link href="/roof-repair" className="hover:text-blue-600 transition">Roof Repair</Link>
            </nav>

            <a 
              href="tel:18005550199" 
              className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-emerald-100 font-medium">24/7 Dispatch</span>
                <span className="text-sm font-black tracking-wide">(800) 555-0199</span>
              </div>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Professional Footer */}
        <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-sm">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="text-xl font-black text-white">
                Lines<span className="text-blue-500">Fix</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                LinesFix is a nationwide independent home services referral platform matching property owners with local licensed, bonded, and certified contractors 24 hours a day.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs tracking-wider uppercase">Emergency Services</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/water-damage" className="hover:text-white transition">Water Extraction & Flood Cleanup</Link></li>
                <li><Link href="/pest-control" className="hover:text-white transition">Emergency Pest Extermination</Link></li>
                <li><Link href="/roof-repair" className="hover:text-white transition">Storm & Roof Leak Repair</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs tracking-wider uppercase">Trust & Legal</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition">Contractor Disclaimer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs tracking-wider uppercase">Direct Dispatch Desk</h4>
              <p className="text-xs text-slate-400 mb-3">Toll-free 24/7 hotline for residential and commercial emergency dispatch.</p>
              <div className="text-white font-mono font-bold text-base">1-800-555-0199</div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} LinesFix.com. All rights reserved. Professional Contractor Matching Engine.
          </div>
        </footer>
      </body>
    </html>
  );
}
