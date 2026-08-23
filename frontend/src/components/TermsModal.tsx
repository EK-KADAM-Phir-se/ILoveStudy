"use client";

import React, { useEffect, useRef } from "react";
import { X, AlertTriangle, FileText, CheckCircle2, ShieldAlert, Info, HelpCircle } from "lucide-react";

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
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden z-10 transition-all transform"
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
                Terms &amp; Conditions / Legal Disclaimer
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Please read before practicing on ILoveStudy
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
          
          {/* Critical Highlight Box - Accuracy & Error Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3.5 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                Accuracy &amp; Answer Key Disclaimer
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                This platform is provided strictly for educational self-assessment. <strong>Questions, options, explanations, and answer keys are compiled from practice datasets and may contain typographical errors, incorrect options, or mathematical inaccuracies. They are NOT guaranteed to be 100% perfect or error-free.</strong>
              </p>
            </div>
          </div>

          {/* Detailed Terms Sections */}
          <div className="space-y-5">
            
            <section className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                1. Practice Platform &amp; Non-Guarantee of Perfection
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                ILoveStudy provides simulated CBT (Computer Based Test) mock examinations for competitive exams like JEE, NEET, SSC, and GATE. While our team makes every attempt to maintain high quality, <strong>some questions or answers may contain errors or discrepancies.</strong> Users are advised to verify critical concepts against standard textbooks or official NTA/SSC/IIT answer keys.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                2. Limitation of Liability
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                All mock tests, scoring metrics, and solutions are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. ILoveStudy, its developers, and maintainers <strong>shall not be held liable for any academic outcomes, score variations, or decisions made</strong> based on mock practice results on this platform.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                3. User Reporting &amp; Error Corrections
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                If you find a question, option, or solution that contains a mistake, please inform us using the <strong>&quot;Feedback&quot;</strong> button in the footer or the error report feature on the test workspace. We review user reports regularly and update answer keys accordingly.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                4. Independent Educational Entity &amp; Trademarks
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm pl-4">
                ILoveStudy is an independent educational tool and is <strong>not officially affiliated with, authorized by, or endorsed by NTA, SSC, IITs, or any government examination body.</strong> Exam names (JEE Main, JEE Advanced, NEET, GATE, SSC CGL) belong to their respective trademark holders and are referenced purely for identification and practice purposes under fair use.
              </p>
            </section>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 font-medium">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <span>By practicing on this site, you accept these terms.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
