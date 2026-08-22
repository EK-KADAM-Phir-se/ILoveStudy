"use client";

import React, { useEffect, useRef } from "react";
import { X, ShieldAlert, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden z-10 transition-all transform animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <FileText size={22} />
            </div>
            <div>
              <h2 id="terms-modal-title" className="text-lg font-bold text-gray-900 dark:text-white">
                Terms & Conditions / Disclaimer
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Please read before taking mock tests
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="px-6 py-6 overflow-y-auto space-y-6 text-sm text-gray-600 dark:text-slate-300">
          {/* Important Highlight Box */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                Mock Test & Accuracy Notice
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                This platform provides practice mock tests strictly for educational and preparation purposes. <strong>Questions, options, solutions, and key details may occasionally contain errors or inaccuracies.</strong>
              </p>
            </div>
          </div>

          {/* Detailed Terms Sections */}
          <div className="space-y-5">
            <section className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                1. Educational Practice Platform
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                ILoveStudy provides simulated CBT (Computer Based Test) mock examinations to assist students in preparing for competitive exams like JEE, NEET, SSC, and GATE. We are an independent educational practice platform and are not officially affiliated with or endorsed by NTA, SSC, IITs, or any official examination conducting body.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                2. Potential Errors & Verification
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                While we strive for accuracy, questions and answer keys are compiled from various practice datasets and user contributions. <strong>Questions, options, or answer keys might contain errors, typos, or inaccuracies.</strong> Users are advised to double-check formulas, solutions, and answers with official textbooks or standard resources.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                3. User Reporting & Improvements
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                If you encounter any mistake in a question, options, or solution, please use the <strong>"Report Error"</strong> button on the test page or submit feedback via the <strong>"Feedback"</strong> option in the footer. Our team reviews reported questions to maintain high quality standards.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                4. Limitation of Liability
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                All mock tests and materials are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. ILoveStudy and its maintainers shall not be liable for any direct or indirect consequences, grade variations, or decisions made based on mock test practice results.
              </p>
            </section>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>By using this site, you accept these terms.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
