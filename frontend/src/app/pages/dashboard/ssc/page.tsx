"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import { Users, Landmark, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { isGuestUser } from "@/src/lib/authUtils";

export default function SSCSelectionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans flex flex-col transition-colors">
      <NavBar displayName={mounted ? (localStorage.getItem("displayName") || "Student") : "Student"} />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Top Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/pages/dashboard")}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-4">
            <Sparkles size={14} />
            Official Staff Selection Commission Papers
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            Select Your SSC Exam
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Choose between SSC CGL and SSC CHSL to access year-wise previous papers, section-wise practice, and full CBT mock exams.
          </p>
        </div>

        {/* Exam Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          
          {/* SSC CGL Card */}
          <div
            onClick={() => router.push("/pages/dashboard/ssc-cgl")}
            className="group relative bg-white dark:bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                SSC CGL
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Staff Selection Commission CGL papers with GK, Reasoning, Quantitative Aptitude, and English Language sections for Tier I and Tier II.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} /> Tier I &amp; II Pattern
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-xs">
                Explore Papers <ArrowRight size={14} />
              </span>
            </div>
          </div>

          {/* SSC CHSL Card */}
          <div
            onClick={() => router.push("/pages/dashboard/ssc-chsl")}
            className="group relative bg-white dark:bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500/80 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Landmark size={28} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                SSC CHSL
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                Combined Higher Secondary Level papers for 10+2 level posts. Comprehensive question bank for Tier I and Tier II preparation.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} /> 10+2 Level Preparation
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl transition shadow-xs">
                Explore Papers <ArrowRight size={14} />
              </span>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
