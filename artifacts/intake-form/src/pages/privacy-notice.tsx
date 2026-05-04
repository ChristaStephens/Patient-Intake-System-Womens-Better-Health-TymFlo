import { Link } from "wouter";
import { ArrowLeft, Lock, Monitor, HardDrive, AlertTriangle, Send, Phone } from "lucide-react";
import Footer from "@/components/footer";
import { PRACTICE_NAME, PRACTICE_EMAIL, TYMFLO } from "@/lib/config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PrivacyNotice() {
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Privacy Notice</h1>
            <p className="text-sm text-slate-500">Last updated: {new Date().getFullYear()}</p>
          </div>

          {/* Summary banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-teal-900 mb-1">Your data never leaves your device.</p>
                <p className="text-sm text-teal-700 leading-relaxed">
                  TymFlo does not collect, store, or have access to any information you enter into this form. Everything stays entirely within your browser.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">

            <PrivacyCard
              Icon={Lock}
              title="No Data Collection by TymFlo"
              color="teal"
            >
              <p>
                TymFlo does not collect, receive, store, transmit, or process any patient information entered into this intake system — ever. There are no tracking pixels, analytics tools, or server-side data capture of any kind in this system.
              </p>
              <p>
                Your answers to every question on this form remain exclusively within your web browser and are never sent to any server operated by TymFlo or any third party.
              </p>
            </PrivacyCard>

            <PrivacyCard
              Icon={Monitor}
              title="All Data Stays in Your Browser"
              color="blue"
            >
              <p>
                When you fill out this intake form, all data is held temporarily in your browser's memory for the current session only. When you close the browser tab, that session data is automatically cleared.
              </p>
              <p>
                This means TymFlo has no technical ability to access your information, even if we wanted to.
              </p>
            </PrivacyCard>

            <PrivacyCard
              Icon={HardDrive}
              title={'"Save Progress" Stores Data on Your Device Only'}
              color="slate"
            >
              <p>
                If you use the <strong>"Save Progress on This Device"</strong> feature, your form information is written to your browser's local storage — a private storage area on your own device. This data never leaves your device and is not accessible to TymFlo.
              </p>
              <p>
                You can remove this saved data at any time by clicking <strong>"Clear Saved Data"</strong> on the form.
              </p>
            </PrivacyCard>

            <PrivacyCard
              Icon={AlertTriangle}
              title="Do Not Use Saved Progress on Shared Devices"
              color="amber"
            >
              <p>
                Because "Save Progress" stores data on the physical device you are using, you should <strong>never use this feature on a shared, public, or employer-owned computer or phone.</strong>
              </p>
              <p>
                Only use the save feature on a personal device that only you have access to. If you have any doubt, use the session-only save option, which clears automatically when the tab closes.
              </p>
            </PrivacyCard>

            <PrivacyCard
              Icon={Send}
              title="You Control How Your Form Is Sent"
              color="teal"
            >
              <p>
                When you have completed the form, you will download a PDF or export a CSV file to your device. TymFlo is not involved in how you choose to deliver that file to your provider.
              </p>
              <p>
                You are responsible for how you transmit your completed form. We recommend using a secure, private method such as hand-delivering a printed copy or using a secure file-sharing method recommended by your provider.
              </p>
            </PrivacyCard>

            <PrivacyCard
              Icon={Phone}
              title="Questions? Contact the Practice."
              color="slate"
            >
              <p>
                If you have questions about your privacy, your intake form, or your appointment, please contact <strong>{PRACTICE_NAME}</strong> directly at{" "}
                <a href={`mailto:${PRACTICE_EMAIL}`} className="text-teal-600 hover:underline">{PRACTICE_EMAIL}</a>.
              </p>
              <p>
                TymFlo provides the intake system technology but is not involved in the clinical relationship between you and your provider. We cannot answer questions about your care or your specific intake information.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                For technology or licensing inquiries:{" "}
                <a href={`mailto:${TYMFLO.email}`} className="text-teal-600 hover:underline">{TYMFLO.email}</a>
                {" · "}
                <a href={`tel:${TYMFLO.phone}`} className="text-teal-600 hover:underline">{TYMFLO.phone}</a>
              </p>
            </PrivacyCard>

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

type CardColor = "teal" | "blue" | "amber" | "slate";

const colorMap: Record<CardColor, { border: string; bg: string; icon: string }> = {
  teal:  { border: "border-teal-100",  bg: "bg-teal-50/60",  icon: "text-teal-600"  },
  blue:  { border: "border-blue-100",  bg: "bg-blue-50/60",  icon: "text-blue-600"  },
  amber: { border: "border-amber-200", bg: "bg-amber-50",    icon: "text-amber-600" },
  slate: { border: "border-slate-200", bg: "bg-white",       icon: "text-slate-500" },
};

function PrivacyCard({ Icon, title, color, children }: {
  Icon: React.FC<{ className?: string }>;
  title: string;
  color: CardColor;
  children: React.ReactNode;
}) {
  const c = colorMap[color];
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2.5 mb-3">
        <Icon className={`w-5 h-5 ${c.icon} shrink-0`} />
        <h2 className="text-base font-bold text-slate-800 leading-tight">{title}</h2>
      </div>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
