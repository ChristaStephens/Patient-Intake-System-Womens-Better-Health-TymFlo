import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/footer";
import { PRACTICE_NAME, PRACTICE_EMAIL, TYMFLO } from "@/lib/config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 mb-8 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Link>

          {/* Header */}
          <div className="mb-8">
            <img
              src={`${BASE}/tymflo-logo.png`}
              alt="TymFlo"
              className="h-8 object-contain mb-6"
            />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Terms of Use</h1>
            <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
          </div>

          {/* Video Walkthrough */}
          <div className="mb-10 rounded-2xl overflow-hidden border border-brand-pink/20 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-brand-pink/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-pink shrink-0" />
              <h2 className="text-base font-semibold text-brand-deep-berry">
                Video Walkthrough — How to Complete Your Intake Form
              </h2>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="/intake-form-tutorial/"
                title="Patient Intake Form Tutorial"
                className="absolute inset-0 w-full h-full border-0"
                allow="autoplay"
              />
            </div>
            <p className="px-5 py-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-100">
              This short video walks through all 7 sections of the form. Use the controls at the bottom to jump to any section.
            </p>
          </div>

          <div className="prose-custom">

            <Section title="1. Ownership">
              <p>
                This patient intake system, including its design, functionality, structure, and all associated materials, is owned exclusively by <strong>TymFlo</strong>. Nothing in your use of this system transfers any ownership rights to you or to any third party.
              </p>
            </Section>

            <Section title="2. License">
              <p>
                TymFlo grants <strong>{PRACTICE_NAME}</strong> a limited, non-exclusive, non-transferable license to use this intake system solely for the purpose of collecting patient intake information for that practice. This license does not convey any ownership interest in the system.
              </p>
              <p>
                This license is personal to the licensed practice and may not be transferred, sublicensed, or assigned to any other person or organization without TymFlo's prior written consent.
              </p>
            </Section>

            <Section title="3. Restrictions">
              <p>You may <strong>not</strong>:</p>
              <ul>
                <li>Copy, reproduce, or duplicate any part of this system</li>
                <li>Share, distribute, or make this system available to any third party</li>
                <li>Reuse this system for any purpose other than patient intake for the licensed practice</li>
                <li>Resell, sublicense, or redistribute this system in any form</li>
                <li>Reverse engineer, decompile, or attempt to extract the source code of this system</li>
                <li>Remove or alter any TymFlo branding, ownership notices, or licensing statements</li>
              </ul>
              <p>
                Any unauthorized use of this system is a violation of TymFlo's intellectual property rights and may result in legal action.
              </p>
            </Section>

            <Section title="4. Patient Use">
              <p>
                This intake system is intended solely for use by patients of <strong>{PRACTICE_NAME}</strong>. If you are not a patient of this practice, you are not authorized to use this system and should exit immediately.
              </p>
            </Section>

            <Section title="5. No Data Storage by TymFlo">
              <p>
                TymFlo does not collect, store, transmit, or process any patient data entered into this system. All information you enter remains entirely within your web browser on your own device and is never sent to TymFlo's servers or any third-party server.
              </p>
              <p>
                If you choose to use the "Save Progress" feature, your information is stored only in your browser's local storage on your own device. TymFlo has no access to this data at any time.
              </p>
            </Section>

            <Section title="6. Disclaimer">
              <p>
                TymFlo is not responsible for how patients choose to transmit, deliver, or share their completed intake forms. Once you download or print your form, responsibility for its handling rests with you and the practice.
              </p>
              <p>
                This system is provided as a convenience tool. TymFlo makes no representations about the completeness, accuracy, or fitness for a particular medical purpose of any information collected through this system.
              </p>
            </Section>

            <Section title="7. Contact">
              <p>
                If you have questions about this intake form or your appointment, please contact{" "}
                <strong>{PRACTICE_NAME}</strong> directly at{" "}
                <a href={`mailto:${PRACTICE_EMAIL}`} className="text-teal-600 hover:underline">{PRACTICE_EMAIL}</a>.
                Do not contact TymFlo with questions about your medical care or intake information.
              </p>
              <p>
                For licensing or business inquiries regarding TymFlo, you may reach us at:
              </p>
              <address className="not-italic mt-2 text-slate-700">
                <a href={`mailto:${TYMFLO.email}`} className="text-teal-600 hover:underline">{TYMFLO.email}</a>
                <br />
                <a href={`tel:${TYMFLO.phone}`} className="text-teal-600 hover:underline">{TYMFLO.phone}</a>
              </address>
            </Section>

          </div>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Form
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
