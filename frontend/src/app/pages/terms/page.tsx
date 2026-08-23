"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, AlertTriangle, ShieldCheck, HelpCircle, ArrowLeft } from 'lucide-react';
import NavBar from '../../../components/NavBar';
import Footer from '../../../components/Footer';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      <div>
        <NavBar />
        <div className="p-4 sm:p-8">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors mt-4 space-y-8">
            
            {/* Top Navigation */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Previous Page</span>
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <FileText size={14} />
                <span>Official Platform Terms &amp; Conditions</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
                Terms of Use &amp; Accuracy Disclaimer
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Effective Date: 2026 · Please read carefully before practicing on ILoveStudy
              </p>
            </div>

            {/* Highlight Disclaimer Banner */}
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-4 shadow-xs">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <h3 className="font-bold text-amber-900 dark:text-amber-200 text-base">
                  Content Accuracy &amp; Answer Key Disclaimer
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
                  This platform provides simulated mock tests strictly for educational self-assessment and practice. <strong>Questions, options, explanations, and answer keys are compiled from practice datasets and may contain typographical errors, incorrect options, or mathematical inaccuracies. They are NOT guaranteed to be 100% perfect or error-free.</strong>
                </p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              
              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  1. Educational Practice Purpose &amp; Accuracy Non-Guarantee
                </h2>
                <p className="pl-5 text-xs sm:text-sm">
                  ILoveStudy provides computer-based mock tests for competitive examinations (including JEE Main, JEE Advanced, NEET, SSC CGL, and GATE). While our team makes reasonable efforts to maintain quality, <strong>some questions, options, or answer keys may contain errors, typos, or inaccuracies.</strong> Users are advised to verify formulas and solutions against standard textbooks or official NTA/SSC/IIT answer keys.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  2. Exclusion of Liability
                </h2>
                <p className="pl-5 text-xs sm:text-sm">
                  All test content, automated scoring, and performance analytics are provided &quot;as is&quot; and &quot;as available&quot;. ILoveStudy, its creators, developers, and maintainers <strong>shall not be held liable for any academic outcomes, exam results, grade variations, or decisions made</strong> based on mock practice results on this platform.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  3. User Error Reporting &amp; Continuous Improvement
                </h2>
                <p className="pl-5 text-xs sm:text-sm">
                  If you discover an error in any question text, options, or step-by-step LaTeX solution, please click the <strong>&quot;Report Error&quot;</strong> button during an active test or submit feedback using the <strong>&quot;Feedback&quot;</strong> link in the footer. Reported items are reviewed and updated regularly.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  4. Intellectual Property &amp; Trademark Disclaimers
                </h2>
                <p className="pl-5 text-xs sm:text-sm">
                  ILoveStudy is an independent practice portal and is <strong>not officially affiliated with, authorized by, or endorsed by NTA, SSC, IITs, or any government testing agency.</strong> Exam names (JEE Main, JEE Advanced, NEET, GATE, SSC) belong to their respective trademark holders and are referenced purely for identification and educational practice.
                </p>
              </section>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
