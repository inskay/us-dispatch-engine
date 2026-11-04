import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Scale, AlertTriangle, Phone, FileText } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service & Contractor Disclaimer | LinesFix",
  description: "Terms of service, independent referral notice, limitation of liability, and contractor verification obligations for LinesFix.com users.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-blue-700" />
            <span>Legal Agreement &amp; Disclosure</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Terms of Service &amp; Contractor Disclaimer
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Effective Date: January 1, 2026 · Last Updated: November 2026
          </p>
        </div>

        {/* Highlight Alert Box */}
        <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 text-amber-900 text-xs sm:text-sm leading-relaxed flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">CRITICAL NOTICE FOR ALL PROPERTY OWNERS:</strong> LinesFix.com is an independent referral network connecting homeowners with third-party service providers. LinesFix is not a licensed general contractor, water damage remediator, pest control operator, or roofer.
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">1.</span> Platform Role: Independent Referral Service
            </h2>
            <p>
              LinesFix.com (&ldquo;LinesFix&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates solely as an independent marketing directory and telecommunications referral broker. LinesFix does <strong>not</strong> perform contracting, emergency plumbing, structural drying, toxic mold remediation, pest extermination, or roof tarping/repair services.
            </p>
            <p>
              When you call {siteConfig.phoneDisplay} or submit a request on LinesFix.com, your request is routed to independent third-party local service providers and trade contractors who operate in your regional area.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">2.</span> Independent Third-Party Contractors
            </h2>
            <p>
              All technicians, tradespeople, emergency responders, and trade contractors participating in our referral network are independent business entities. LinesFix does not employ, supervise, manage, control, or direct any contractor or contractor employees.
            </p>
            <p>
              LinesFix does not endorse, guarantee, or make any representations regarding any contractor&apos;s licensing status, general liability insurance, workers&apos; compensation coverage, bonding, workmanship quality, pricing, or arrival speed. Any agreement, contract, or warranty entered into is strictly between you and the respective contractor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">3.</span> Homeowner Duty of Verification
            </h2>
            <p>
              You acknowledge and agree that it is your sole responsibility as a property owner or authorized tenant to verify that the dispatched service technician holds all required municipal, county, and state licenses, bonds, and valid liability insurance policies before permitting them to access your premises or initiate any repair, mitigation, or remediation work.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">4.</span> Total Disclaimer of Liability &amp; Hold Harmless
            </h2>
            <p className="uppercase text-xs font-bold tracking-wider text-slate-500">
              Please read this section carefully — it limits our liability
            </p>
            <p>
              TO THE FULLEST EXTENT PERMITTED UNDER APPLICABLE UNITED STATES LAW, LINESFIX.COM, ITS FOUNDERS, PARENT ENTITIES, SUBSIDIARIES, OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING OUT OF OR IN CONNECTION WITH:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
              <li>Any work, acts, omissions, negligence, or misconduct of any dispatched contractor.</li>
              <li>Property damage, structural flooding, roof leaks, mold contamination, or personal injury.</li>
              <li>Pricing disputes, deceptive estimates, or unexpected charges billed by a contractor.</li>
              <li>Delays in dispatch arrival, cancellation of appointments, or failure of response times.</li>
              <li>Disputes involving insurance claims, coverage rejections, or documentation errors.</li>
            </ul>
            <p>
              You agree to indemnify, defend, and hold harmless LinesFix from and against any and all claims, liabilities, damages, losses, or expenses resulting from any service performed on your property.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">5.</span> Binding Individual Arbitration &amp; Class Action Waiver
            </h2>
            <p>
              Any dispute, claim, or controversy arising out of or relating to your use of LinesFix.com or these Terms shall be resolved exclusively through final and binding individual arbitration administered by the American Arbitration Association (&ldquo;AAA&rdquo;) under its Consumer Arbitration Rules.
            </p>
            <p>
              <strong>CLASS ACTION WAIVER:</strong> YOU EXPRESSLY WAIVE ANY RIGHT TO COMMENCE, JOIN, OR PARTICIPATE AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS ACTION, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING AGAINST LINESFIX.COM.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">6.</span> Telephone &amp; Call Recording Consent
            </h2>
            <p>
              By dialing {siteConfig.phoneDisplay} or any phone number listed on LinesFix.com, you consent to having your telephone call monitored and recorded for quality assurance, compliance tracking, and dispatcher training purposes in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <span className="text-blue-900">7.</span> Contact Information
            </h2>
            <p>
              If you have questions regarding these Terms or our referral service, you may contact our legal desk via email at <span className="font-mono font-semibold text-slate-900">legal@linesfix.com</span> or by telephone at {siteConfig.phoneDisplay}.
            </p>
          </section>
        </div>

        {/* Bottom Direct CTA */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
          <h3 className="text-base font-bold text-slate-900">Need Immediate Emergency Home Dispatch?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Our nationwide partner network provides 24/7 on-call dispatch across all 50 states.
          </p>
          <div>
            <a
              href={siteConfig.phoneTel}
              data-tracking="call-btn"
              className="inline-flex items-center gap-2 bg-[#009b55] hover:bg-[#00874a] text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-md transition transform active:scale-95"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>Call Dispatch Desk: {siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
