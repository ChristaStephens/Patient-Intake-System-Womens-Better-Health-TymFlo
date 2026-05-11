import { useEffect } from "react";
import { Link } from "wouter";
import { Printer, ArrowLeft } from "lucide-react";
import { PrintFooter } from "@/components/footer";
import {
  PRACTICE_NAME, PRACTICE_EMAIL, PRACTICE_ADDRESS, PRACTICE_PHYSICIANS,
} from "@/lib/config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/* ── Condition lists (mirrors intake-form.tsx) ──────────────── */
const CONDITIONS = [
  "Allergies", "Anemia", "Anxiety Disorder", "Arthritis", "Asthma",
  "AIDS / HIV", "Bleeding Disorder", "Blood Transfusion", "Cancer",
  "Crohn's Disease", "Diabetes", "Depression", "DVT", "GERD", "Glaucoma",
  "Heart Disease", "Heart Problems", "Hepatitis A, B, or C",
  "High Blood Pressure", "High Cholesterol", "IBS", "Kidney Disorder",
  "Liver Disorder", "Lung Disease", "Migraines", "Osteoporosis", "Phlebitis",
  "Skin Disorder", "Stomach Ulcer", "Stroke", "Thyroid Disease",
  "Tuberculosis", "Venereal Disease", "Seizure", "Sickle Cell",
];

const OBGYN_CONDITIONS = [
  "Abnormal Vaginal Bleeding", "Abnormal Pap Smear", "Bleeding Between Periods",
  "Breast Lump", "Breast Cancer", "Breast Surgery", "Cervical Cancer",
  "Chlamydia", "Colonoscopy", "Chiral Surgery", "Endometriosis",
  "Extreme Menstrual Pain", "Fibroids", "Genital Warts", "Gonorrhea",
  "Herpes", "Hot Flashes", "HPV", "Infertility", "Irregular Periods",
  "Nipple Discharge", "Ovarian Cysts", "Ovarian Cancer", "Painful Intercourse",
  "Pelvic Inflammatory Disease", "Pelvic Floor Issues", "Uterine Cancer",
  "Urinary Incontinence", "Yeast Infection", "Hormone Replacement Therapy",
];

/* ── Blank-field helpers ────────────────────────────────────── */
function BlankRow({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div className="print-row" style={wide ? { gridColumn: "1 / -1" } : {}}>
      <span className="print-label">{label}</span>
      <span className="print-value">&nbsp;</span>
    </div>
  );
}

function BlankSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-section">
      <h2 className="print-section-title">{title}</h2>
      {children}
    </div>
  );
}

function BlankYesNo({ label }: { label: string }) {
  return (
    <div className="print-yesno-row">
      <span className="print-yesno-label">{label}</span>
      <span className="print-yesno-answer" style={{ display: "flex", gap: "18pt" }}>
        <span>☐ Yes</span>
        <span>☐ No</span>
      </span>
    </div>
  );
}

/* ── Page component ─────────────────────────────────────────── */
export default function BlankForm() {
  useEffect(() => {
    document.title = `Blank Intake Form — ${PRACTICE_NAME}`;
  }, []);

  return (
    <>
      {/* ── Screen-only banner ──────────────────────────────── */}
      <div className="no-print min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center flex flex-col items-center gap-5">
          <img
            src={`${BASE}/tymflo-logo.png`}
            alt="TymFlo"
            className="h-6 object-contain opacity-80"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">Blank Patient Intake Form</h1>
            <p className="text-sm text-slate-500">{PRACTICE_NAME}</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Use your browser's <strong>Print</strong> dialog to save this form as a PDF.
            In the print dialog, choose <strong>"Save as PDF"</strong> as the destination.
            You can then email the PDF directly to patients.
          </p>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors"
            style={{ backgroundColor: "#6b1e3d" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#3d0e22")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#6b1e3d")}
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to the online form
          </Link>
          <p className="text-xs text-slate-400 mt-2 border-t border-slate-100 pt-4 w-full text-center">
            For technical support contact{" "}
            <a href={`mailto:${PRACTICE_EMAIL}`} className="underline">{PRACTICE_EMAIL}</a>
          </p>
        </div>
      </div>

      {/* ── Printable blank form ─────────────────────────────── */}
      <div className="print-only print-document">
        <div className="print-doc-header">
          <h1 className="print-doc-title">Patient Intake Form</h1>
          <p className="print-doc-practice">{PRACTICE_NAME}</p>
          <p className="print-doc-practice" style={{ fontStyle: "normal", fontSize: "8pt", color: "#444" }}>
            {PRACTICE_ADDRESS.street} · {PRACTICE_ADDRESS.city}, {PRACTICE_ADDRESS.state} {PRACTICE_ADDRESS.zip} · Ph: {PRACTICE_ADDRESS.phone} · Fax: {PRACTICE_ADDRESS.fax}
          </p>
          <p className="print-doc-practice" style={{ fontStyle: "normal", fontSize: "8pt", color: "#444" }}>
            {PRACTICE_PHYSICIANS.join(" · ")}
          </p>
          <p className="print-doc-subtitle">
            Please print clearly in ink. Return this completed form to our office or email it to{" "}
            <strong>{PRACTICE_EMAIL}</strong>.
          </p>
        </div>

        {/* Personal Information */}
        <BlankSection title="Personal Information">
          <div className="print-two-col">
            <BlankRow label="First Name" />
            <BlankRow label="Last Name" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Preferred Name" />
            <BlankRow label="Date of Birth (MM/DD/YYYY)" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Email Address" />
            <BlankRow label="Phone Number" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Sex Assigned at Birth" />
            <BlankRow label="Gender Identity" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Pronouns" />
            <BlankRow label="Preferred Language" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Race" />
            <BlankRow label="Ethnicity" />
          </div>
        </BlankSection>

        {/* Address */}
        <BlankSection title="Address">
          <BlankRow label="Street Address" wide />
          <div className="print-two-col">
            <BlankRow label="City" />
            <BlankRow label="State" />
          </div>
          <BlankRow label="ZIP Code" />
        </BlankSection>

        {/* Provider & Visit */}
        <BlankSection title="Provider & Visit">
          <BlankRow label="Primary Care Physician" />
          <div className="print-two-col">
            <BlankRow label="Pharmacy Name" />
            <BlankRow label="Pharmacy Phone" />
          </div>
          <BlankRow label="Pharmacy Address" />
          <BlankRow label="Reason for Visit" />
          <BlankRow label="Current Medications (list all)" />
          <div className="print-row" style={{ marginTop: "4pt" }}>
            <span className="print-label">&nbsp;</span>
            <span className="print-value">&nbsp;</span>
          </div>
          <BlankRow label="Drug Allergies" />
        </BlankSection>

        {/* Past Medical History */}
        <BlankSection title="Clinical History — Past Medical History">
          <p className="print-subtitle">Check all that apply (past or current)</p>
          <div className="print-checklist">
            {CONDITIONS.map(label => (
              <div key={label} className="print-check-item">
                <span className="print-checkbox">☐</span>
                <span>{label}</span>
              </div>
            ))}
            <div className="print-check-item">
              <span className="print-checkbox">☐</span>
              <span>Other: _______________________</span>
            </div>
          </div>
          <BlankRow label="Past Surgeries" />
          <BlankRow label="Past Hospitalizations" />
          <BlankRow label="Additional Chronic Conditions" />
        </BlankSection>

        {/* OB/GYN History */}
        <BlankSection title="OB/GYN History">
          <p className="print-subtitle">Have you ever had or do you currently have any of the following?</p>
          <div className="print-checklist">
            {OBGYN_CONDITIONS.map(label => (
              <div key={label} className="print-check-item">
                <span className="print-checkbox">☐</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </BlankSection>

        {/* Menstrual History */}
        <BlankSection title="Menstrual History">
          <div className="print-two-col">
            <BlankRow label="First Day of Last Period (MM/DD/YYYY)" />
            <BlankRow label="Period Frequency" />
          </div>
          <div className="print-two-col">
            <BlankRow label="Period Duration (days)" />
            <BlankRow label="Number of Pregnancies" />
          </div>
          <BlankRow label="Delivery Type (vaginal / C-section / other)" />
          <BlankYesNo label="Are your periods heavy?" />
          <BlankYesNo label="Do your periods affect your daily activities?" />
        </BlankSection>

        {/* Family Medical History */}
        <BlankSection title="Clinical History — Family Medical History">
          <p className="print-subtitle">Immediate family (parents, siblings, children) — check all that apply</p>
          <div className="print-checklist">
            {CONDITIONS.map(label => (
              <div key={label} className="print-check-item">
                <span className="print-checkbox">☐</span>
                <span>{label}</span>
              </div>
            ))}
            <div className="print-check-item">
              <span className="print-checkbox">☐</span>
              <span>Other: _______________________</span>
            </div>
          </div>
        </BlankSection>

        {/* Cancer History */}
        <BlankSection title="Family / Patient Cancer History">
          <p className="print-subtitle">List any cancer diagnoses in your family or personal history</p>
          <table className="print-cancer-table">
            <thead>
              <tr>
                <th>Relation (or "Self")</th>
                <th>Type of Cancer</th>
                <th>Age at Diagnosis</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(i => (
                <tr key={i}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </BlankSection>

        {/* Social History */}
        <BlankSection title="Social History">
          <div className="print-two-col">
            <BlankRow label="Tobacco Use (never / former / current)" />
            <BlankRow label="Alcohol Use (never / occasional / regular)" />
          </div>
          <BlankRow label="Substance Use" />
          <BlankYesNo label="Are you sexually active?" />
          <BlankYesNo label="Do you wish to be checked for STDs?" />
          <BlankYesNo label="Has anyone in your home ever physically or verbally abused you?" />
          <div className="print-two-col">
            <BlankRow label="Caffeine Per Day (cups / oz)" />
            <BlankRow label="Exercise Frequency" />
          </div>
        </BlankSection>

        {/* Emergency Contact */}
        <BlankSection title="Emergency Contact">
          <BlankRow label="Full Name" />
          <div className="print-two-col">
            <BlankRow label="Phone Number" />
            <BlankRow label="Relationship to Patient" />
          </div>
        </BlankSection>

        {/* Insurance */}
        <BlankSection title="Insurance">
          <BlankRow label="Relationship to Primary Insured (self / spouse / child / other)" />
          <div className="print-two-col">
            <BlankRow label="Primary Insured Name (if not self)" />
            <BlankRow label="Primary Insured Date of Birth (if not self)" />
          </div>
          <BlankRow label="Insurance Provider" />
          <div className="print-two-col">
            <BlankRow label="Policy Number" />
            <BlankRow label="Group Number" />
          </div>
          <BlankRow label="Secondary Insurance Provider (if applicable)" />
          <div className="print-two-col">
            <BlankRow label="Secondary Policy Number" />
            <BlankRow label="Secondary Group Number" />
          </div>
        </BlankSection>

        {/* Authorizations & Signature */}
        <BlankSection title="Legal Authorizations & Signature">
          <div className="print-agreement">
            <span className="print-checkbox">☐</span>
            <span><strong>Acknowledgment of Receipt of Privacy Notice:</strong> I acknowledge receipt of this practice's Notice of Privacy Practices and understand how my health information may be used.</span>
          </div>
          <div className="print-agreement">
            <span className="print-checkbox">☐</span>
            <span><strong>Assignment of Benefits:</strong> I authorize direct payment of insurance benefits to this practice and accept financial responsibility for remaining balances.</span>
          </div>
          <div className="print-agreement">
            <span className="print-checkbox">☐</span>
            <span><strong>Financial Responsibility:</strong> I acknowledge responsibility for all charges for services rendered.</span>
          </div>
          <div className="print-agreement">
            <span className="print-checkbox">☐</span>
            <span><strong>Insurance & Claims — Notice of Responsibility:</strong> I authorize claim submission on my behalf and accept full financial responsibility for any denied, uncovered, or outstanding balances.</span>
          </div>
          <div className="print-agreement">
            <span className="print-checkbox">☐</span>
            <span><strong>Patient Certification:</strong> I certify that all information provided is accurate and complete.</span>
          </div>
          <div className="print-signature-row">
            <div className="print-signature-line">
              <span className="print-label">Patient Signature</span>
            </div>
            <div className="print-signature-line">
              <span className="print-label">Date Signed (MM/DD/YYYY)</span>
            </div>
          </div>
        </BlankSection>

        <PrintFooter />
      </div>
    </>
  );
}
