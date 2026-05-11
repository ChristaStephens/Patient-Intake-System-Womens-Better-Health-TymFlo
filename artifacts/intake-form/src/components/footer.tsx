import { Link } from "wouter";
import { FileDown } from "lucide-react";
import { PRACTICE_NAME } from "@/lib/config";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Footer() {
  return (
    <footer className="no-print mt-10 border-t border-slate-200 bg-white py-7 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-3 text-center">

        {/* Logo */}
        <img
          src={`${BASE}/tymflo-logo.png`}
          alt="TymFlo"
          className="h-5 object-contain opacity-75"
        />

        {/* Tagline */}
        <p className="text-xs font-medium text-slate-500 tracking-wide">
          Digital Intake System by TymFlo
        </p>

        {/* Blank form download */}
        <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 flex flex-col items-center gap-2 my-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">For Office Staff</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Need to send a form to a patient by email? Download a blank printable PDF.
          </p>
          <Link
            href="/blank-form"
            className="flex items-center gap-1.5 mt-1 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ backgroundColor: "#6b1e3d" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#3d0e22")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = "#6b1e3d")}
          >
            <FileDown className="w-3.5 h-3.5" />
            Download Blank Form (PDF)
          </Link>
        </div>

        {/* License */}
        <p className="text-xs text-slate-400 leading-relaxed max-w-md">
          This intake system is licensed exclusively for use by{" "}
          <span className="font-semibold text-slate-500">{PRACTICE_NAME}</span>{" "}
          and may not be copied or reused.
        </p>

        {/* Legal links */}
        <nav className="flex items-center gap-3" aria-label="Legal links">
          <Link
            href="/terms"
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            Terms of Use
          </Link>
          <span className="text-slate-300 text-xs" aria-hidden="true">|</span>
          <Link
            href="/privacy"
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            Privacy Notice
          </Link>
          <span className="text-slate-300 text-xs" aria-hidden="true">|</span>
          <a
            href="/intake-form-tutorial/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            Video Tutorial
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} TymFlo. All rights reserved. Unauthorized use is prohibited.
        </p>
      </div>
    </footer>
  );
}

/* ── Print footer ──────────────────────────────────────────── */

export function PrintFooter() {
  return (
    <div className="print-footer">
      <p>Digital Intake System by TymFlo</p>
      <p>
        Licensed exclusively for use by {PRACTICE_NAME} and may not be copied or reused.
        &nbsp;&nbsp;·&nbsp;&nbsp;
        &copy; {new Date().getFullYear()} TymFlo. All rights reserved.
      </p>
      <p>TymFlo does not collect, store, or process patient data.</p>
    </div>
  );
}
