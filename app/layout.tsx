import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Link from 'next/link';
import { PhoneCall, ShieldCheck, Clock } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { CallTracking } from '@/components/CallTracking';

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
      <head />
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BGVPS204PR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BGVPS204PR', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Global Call Conversion Tracking */}
        <CallTracking />

        {/* Top Emergency Ribbon - Light Trust */}
        <div className="bg-slate-100 text-slate-700 text-xs py-2 px-4 border-b border-slate-200/80 font-medium">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-800">Live Dispatch Active</span> Across 50 States
            </span>
            <span className="hidden sm:flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Licensed &amp; Insured Pros</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600" /> 24/7 Immediate Response</span>
            </span>
          </div>
        </div>

        {/* Global Header - Light Trust */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-blue-800 transition">
                LF
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Lines<span className="text-blue-700">Fix</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                  National Dispatch
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link href="/water-damage" className="hover:text-blue-700 transition">Water Damage</Link>
              <Link href="/pest-control" className="hover:text-blue-700 transition">Pest Control</Link>
              <Link href="/roof-repair" className="hover:text-blue-700 transition">Roof Repair</Link>
            </nav>

            <a 
              href={siteConfig.phoneTel}
              data-tracking="call-btn"
              className="flex items-center gap-2.5 bg-[#009b55] hover:bg-[#00874a] text-white font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-700/15 transition transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-wider text-emerald-100 font-medium">24/7 Dispatch</span>
                <span className="text-sm font-black tracking-wide">{siteConfig.phoneDisplay}</span>
              </div>
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Professional Footer - Full Light Trust Palette */}
        <footer className="bg-slate-100/90 border-t border-slate-200 text-slate-600 pt-14 pb-12 text-sm">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <div className="text-xl font-black text-slate-900">
                Lines<span className="text-blue-700">Fix</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                LinesFix is a nationwide independent home services referral platform matching property owners with local licensed, bonded, and certified contractors 24 hours a day.
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Emergency Services</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/water-damage" className="hover:text-blue-700 transition text-slate-600">Water Extraction &amp; Flood Cleanup</Link></li>
                <li><Link href="/pest-control" className="hover:text-blue-700 transition text-slate-600">Emergency Pest Extermination</Link></li>
                <li><Link href="/roof-repair" className="hover:text-blue-700 transition text-slate-600">Storm &amp; Roof Leak Repair</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Trust &amp; Legal</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/terms" className="hover:text-blue-700 transition text-slate-600 font-medium">Terms of Service &amp; Disclaimer</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-700 transition text-slate-600 font-medium">Privacy Policy (CCPA)</Link></li>
                <li><span className="text-slate-500">Licensed &amp; Insured Contractors</span></li>
                <li><span className="text-slate-500">Zero Obligation Phone Quotes</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-4 text-xs tracking-wider uppercase">Direct Dispatch Desk</h4>
              <p className="text-xs text-slate-500 mb-3">Toll-free 24/7 emergency hotline for residential and commercial dispatch.</p>
              <a 
                href={siteConfig.phoneTel} 
                data-tracking="call-btn" 
                className="inline-block text-slate-900 font-mono font-bold text-lg hover:text-blue-700 transition"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-10 pt-6 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © 2026 LinesFix.com · All rights reserved · 24/7 National Emergency Dispatch Network
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Link href="/terms" className="hover:text-blue-700 transition">Terms of Service</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-blue-700 transition">Privacy Policy</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
