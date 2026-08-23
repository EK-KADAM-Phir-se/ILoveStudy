"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Sparkles, ArrowRight, ShieldCheck, FileCheck, Layers } from 'lucide-react';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';

export default function JeeAdvancedDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors flex flex-col justify-between">
      <div>
        <NavBar />
        <div className="p-4 sm:p-8">
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors mt-4 text-center space-y-6">
            
            {/* Animated Icon Container */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Clock size={38} />
            </div>

            {/* Badge & Title */}
            <div className="space-y-3 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/80 shadow-xs">
                <Sparkles size={14} className="text-amber-500 animate-spin" />
                <span>Upcoming Release · JEE Advanced Archive</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                JEE Advanced Papers Uploading Soon
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Our expert academic faculty is currently digitizing, verifying, and formatting official JEE Advanced Paper 1 and Paper 2 exams with detailed multi-correct, numerical, and matrix-match LaTeX solutions.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Verified NTA Answer Keys &amp; Scoring Schema</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <FileCheck size={16} className="text-indigo-500 shrink-0" />
                <span>Step-by-Step Multi-Correct &amp; Matrix LaTeX Explanations</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Layers size={16} className="text-amber-500 shrink-0" />
                <span>Real-Time High Performance Exam Workspace</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => router.push("/pages/dashboard/jee-mains")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore JEE Mains Solved Papers</span>
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => router.push("/pages/dashboard/create-test")}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition cursor-pointer"
              >
                Create Custom Test
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}