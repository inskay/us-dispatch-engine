import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Phone, Eye, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy & California Privacy Notice (CCPA) | LinesFix",
  description: "Privacy policy, call recording disclosure, information sharing practices, and California Consumer Privacy Act (CCPA) disclosures for LinesFix.com.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Data Protection &amp; CCPA Notice</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Privacy Policy &amp; Consumer Privacy Notice
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Effective Date: January 1, 2026 · Compliant with CCPA / CPRA Regulations
          </p>
        </div>

        {/* Highlight Alert Box */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-5 text-emerald-950 text-xs sm:text-sm leading-relaxed flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">WE DO NOT SELL YOUR PERSONAL DATA:</strong> LinesFix.com only shares caller and dispatch information with licensed third-party emergency technicians to fulfill your immediate service request. We never sell your personal information to external telemarketers or brokers.
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">1.</span> Call Recording &amp; Monitoring Disclosure
            </h2>
            <p>
              When you call {siteConfig.phoneDisplay} or any telephone number published on LinesFix.com, your telephone call may be recorded and monitored by our telecommunications infrastructure partners and dispatch call desks.
            </p>
            <p>
              Call recordings are collected strictly for quality assurance, dispatcher training, verification of caller dispatch addresses, dispute resolution, and regulatory compliance. By placing a call, you consent to this recording in compliance with state and federal telephone monitoring statutes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">2.</span> Information We Collect
            </h2>
            <p>
              To effectively match you with a local contractor in your metropolitan area, we may collect the following categories of information:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Caller Identification:</strong> Your telephone number, caller ID data, and the date and time of the phone call.</li>
              <li><strong>Location Data:</strong> Your city, state, ZIP code, area code, and approximate geographic location derived from IP address or mobile GPS (if you choose to use the &ldquo;Use My GPS&rdquo; feature).</li>
              <li><strong>Service Requests:</strong> The trade niche requested (water damage, pest control, roof repair) and dispatch notes provided to the telephone coordinator.</li>
              <li><strong>Website Usage Data:</strong> Browser type, operating system, pages viewed, and interaction timestamps.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">3.</span> How We Share Information
            </h2>
            <p>
              LinesFix.com shares your contact and service details solely with:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Local Dispatched Contractors:</strong> Licensed, bonded, and certified trade professionals assigned to respond to your emergency service request.</li>
              <li><strong>Telecommunications &amp; Routing Partners:</strong> Secure VoIP and call distribution systems required to connect your call to the nearest available local technician.</li>
              <li><strong>Legal Compliance:</strong> When required by court order, subpoena, or to protect property and public safety.</li>
            </ul>
            <p>
              <strong>We do not sell, rent, or lease your personal information</strong> to third-party list brokers, advertising agencies, or unsolicited spam networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">4.</span> California Consumer Privacy Act (CCPA / CPRA) Rights
            </h2>
            <p>
              If you are a California resident, you have specific privacy rights under the California Consumer Privacy Act, as amended by the California Privacy Rights Act (CPRA):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Right to Know
                </div>
                <p className="text-xs text-slate-600">
                  You have the right to request what categories and specific pieces of personal information we have collected about you.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Right to Delete
                </div>
                <p className="text-xs text-slate-600">
                  You have the right to request deletion of your personal data held by us, subject to standard statutory exemptions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Right to Non-Discrimination
                </div>
                <p className="text-xs text-slate-600">
                  We will never deny you service, charge different prices, or provide a lower quality of service for exercising your CCPA rights.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Right to Opt-Out of Sale
                </div>
                <p className="text-xs text-slate-600">
                  We do not sell personal information. Therefore, no opt-out request is necessary, but you may submit inquiries anytime.
                </p>
              </div>
            </div>
            <p className="pt-2 text-xs text-slate-600">
              To exercise any of your CCPA rights, please submit your request to <span className="font-mono font-semibold text-slate-900">privacy@linesfix.com</span> with the subject line &ldquo;California Privacy Rights Request&rdquo;.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">5.</span> Data Security &amp; Retention
            </h2>
            <p>
              We implement industry-standard technical and organizational security controls to protect caller records against unauthorized access, alteration, or disclosure. Call logs and recordings are retained only for the duration necessary to satisfy operational dispatch, insurance documentation, and regulatory requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">6.</span> Contact Our Privacy Officer
            </h2>
            <p>
              For any questions regarding this Privacy Policy or your data, you may reach our privacy desk via email at <span className="font-mono font-semibold text-slate-900">privacy@linesfix.com</span> or call our toll-free line at {siteConfig.phoneDisplay}.
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/" className="text-sm font-bold text-blue-900 hover:underline">
            ← Return to Homepage Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
