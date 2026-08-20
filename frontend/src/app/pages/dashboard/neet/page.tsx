"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Calendar, ArrowRight,
  FlaskConical, Atom, Dna, Play, Sparkles, Award, Clock, X
} from "lucide-react";
import NavBar from "@/src/components/NavBar";
import Footer from "@/src/components/Footer";

import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";
import { API_BASE_URL } from "@/src/lib/apiConfig";

const SUBJECT_TAGS = [
  { label: "Physics", icon: <Atom size={13} />, color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" },
  { label: "Chemistry", icon: <FlaskConical size={13} />, color: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" },
  { label: "Biology", icon: <Dna size={13} />, color: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" },
];

const YEAR_CARDS_CONFIG = [
  { year: 2026, label: "2026 Papers", bg: "bg-indigo-600", text: "text-indigo-600" },
  { year: 2025, label: "2025 Papers", bg: "bg-emerald-600", text: "text-emerald-600" },
  { year: 2024, label: "2024 Papers", bg: "bg-rose-500", text: "text-rose-500" },
  { year: 2023, label: "2023 Papers", bg: "bg-amber-500", text: "text-amber-500" },
  { year: 2022, label: "2022 Papers", bg: "bg-sky-500", text: "text-sky-500" },
  { year: 2021, label: "2021 Papers", bg: "bg-purple-600", text: "text-purple-600" },
];

function NeetExamPageContent() {
  const router = useRouter();
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const [modalYear, setModalYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const getShiftYear = (shift: any) => {
    const match = shift?.name?.match(/\b(20\d{2})\b/);
    if (match) return parseInt(match[1], 10);
    const d = new Date(shift?.date);
    return isNaN(d.getTime()) ? 2023 : d.getUTCFullYear();
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exams`)
      .then(r => r.json())
      .then(data => {
        const neet = data.find((e: any) => e.name === "NEET" || e.name.toLowerCase().includes("neet"));
        if (neet?.shifts) {
          const sorted = [...neet.shifts].sort((a: any, b: any) => getShiftYear(b) - getShiftYear(a));
          setDbShifts(sorted);
        }
      })
      .catch((err) => console.error("Error loading NEET exams:", err))
      .finally(() => setLoading(false));
  }, []);

  const getShiftsForYear = (year: number) => {
    return dbShifts.filter((s: any) => {
      return getShiftYear(s) === year;
    });
  };

  const handleStartExam = (shift: any) => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    const shiftYear = getShiftYear(shift);
    router.push(
      `/pages/dashboard/neet/workspace?shiftId=${encodeURIComponent(
        shift.id
      )}&name=${encodeURIComponent(shift.name)}&year=${shiftYear}`
    );
  };

  const activeModalConfig = YEAR_CARDS_CONFIG.find(c => c.year === modalYear) || YEAR_CARDS_CONFIG[2];
  const modalShifts = modalYear ? getShiftsForYear(modalYear) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent dark:from-teal-600/15 dark:via-emerald-900/10 dark:to-transparent blur-3xl pointer-events-none -z-10" />

      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg dark:shadow-2xl transition-colors">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Dna size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>National Eligibility cum Entrance Test (UG)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              NEET Practice &amp; Past Papers
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Attempt official NEET papers with full timer simulations, 720 total marks, +4 / -1 marking scheme, and accurate LaTeX math &amp; diagrams in a calm, stress-free interface.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Marks</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">720 Marks</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">3 Hours (180m)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Questions</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">200 Questions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 backdrop-blur-sm shadow-xs">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Marking</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">+4 / -1 Mark</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ALL LIVE NEET PAPERS DIRECT LIST */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            All Available NEET Official Papers
          </h3>

          {loading ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-xs animate-pulse">
              Loading NEET exam papers...
            </div>
          ) : dbShifts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbShifts.map((shift: any) => {
                const shiftYear = getShiftYear(shift);
                return (
                  <div
                    key={shift.id}
                    onClick={() => handleStartExam(shift)}
                    className="group cursor-pointer bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                          NEET {shiftYear}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">200 Qs • 180 Mins</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                        {shift.name}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Physics, Chemistry, Botany &amp; Zoology with accurate LaTeX formulas and diagrams.
                      </p>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">720 Marks (+4, -1)</span>
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition">
                        <span>Attempt Paper</span>
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
              No official NEET papers uploaded yet.
            </div>
          )}
        </div>
      </main>

      {/* POPUP SHIFT SELECTION MODAL */}
      {modalYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl ${activeModalConfig.bg} flex items-center justify-center text-white shadow-md shrink-0`}>
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    NEET {modalYear} Papers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    NEET (UG) — Select a paper shift to start
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalYear(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2-COLUMN SHIFTS GRID */}
            <div className="flex-1 max-h-[55vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
                  Loading {modalYear} NEET paper shifts...
                </div>
              ) : modalShifts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {modalShifts.map((shift, idx) => (
                    <div
                      key={shift.id || idx}
                      onClick={() => {
                        setModalYear(null);
                        handleStartExam(shift);
                      }}
                      className="group cursor-pointer bg-white dark:bg-slate-955 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/60 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between space-x-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                            {shift.name}
                          </h4>
                          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                            <span>✓ Full paper with answers</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition shrink-0">
                        <Play size={14} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No live paper shifts found for {modalYear} yet.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="NEET Exam Restricted"
        message="You are exploring in Guest Tour mode. To attempt NEET past papers with full evaluation and timer controls, please sign in or register."
      />

      <Footer />
    </div>
  );
}

export default function NeetExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">Loading NEET Papers...</div>}>
      <NeetExamPageContent />
    </Suspense>
  );
}
