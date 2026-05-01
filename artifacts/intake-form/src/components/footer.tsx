import { Link } from "wouter";
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
