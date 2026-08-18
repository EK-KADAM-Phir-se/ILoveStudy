"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText, Calendar, ArrowRight,
  BookOpen, FlaskConical, Sigma, Atom, X, Play
} from "lucide-react";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";

/* ─────────────────────────── Static data ─────────────────────────── */
const janExamDays = [22, 23, 24, 28, 29];

const mainsPapersData: Record<number, { january: string[]; april: string[] }> = {
  2026: {
    january: Array.from({ length: 10 }, (_, i) => {
      const day = janExamDays[Math.floor(i / 2)];
      return `${day} Jan - Shift ${i % 2 === 0 ? 1 : 2}`;
    }),
    april: Array.from({ length: 8 }, (_, i) => `25 Apr - Shift ${i % 2 === 0 ? 1 : 2}`),
  },
};

const SUBJECT_TAGS = [
  { label: "Physics",     icon: <Atom size={12} />,        color: "bg-blue-50   text-blue-600   border-blue-100"   },
  { label: "Chemistry",   icon: <FlaskConical size={12} />, color: "bg-green-50  text-green-600  border-green-100"  },
  { label: "Mathematics", icon: <Sigma size={12} />,        color: "bg-purple-50 text-purple-600 border-purple-100" },
];

/* year card accent colours */
const YEAR_COLORS = [
  { icon: "bg-indigo-600 text-white", ring: "group-hover:border-indigo-300" },
  { icon: "bg-emerald-600 text-white", ring: "group-hover:border-emerald-300" },
  { icon: "bg-rose-500   text-white", ring: "group-hover:border-rose-300"    },
  { icon: "bg-amber-500  text-white", ring: "group-hover:border-amber-300"   },
  { icon: "bg-sky-500    text-white", ring: "group-hover:border-sky-300"     },
  { icon: "bg-violet-600 text-white", ring: "group-hover:border-violet-300"  },
];

/* ─────────────────────────── Main Content ─────────────────────────── */
function JeeExamPageContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const examType  = searchParams.get("type") || "mains";
  const isAdvanced = examType === "advanced";

  const [dbShifts,      setDbShifts]      = useState<any[]>([]);
  const [selectedYear,  setSelectedYear]  = useState<number | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<"january" | "april">("january");
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);

  const years = Array.from({ length: 6 }, (_, i) => 2026 - i);

  useEffect(() => {
    fetch("http://localhost:5000/api/exams")
      .then(r => r.json())
      .then(data => {
        const jee = data.find((e: any) => e.name === "JEE Main");
        if (jee?.shifts) setDbShifts(jee.shifts);
      })
      .catch(() => {});
  }, []);

  /* ── helpers ── */
  const getShifts = (year: number, attempt: "january" | "april") => {
    const staticNames = mainsPapersData[year]?.[attempt] || [];
    const dbMatched   = dbShifts.filter((s: any) => {
      const d = new Date(s.date);
      return d.getUTCFullYear() === year &&
        ((attempt === "january" && d.getUTCMonth() === 0) ||
         (attempt === "april"   && d.getUTCMonth() === 3));
    });
    const combined: { name: string; id?: string }[] = [];
    dbMatched.forEach((s: any)  => combined.push({ name: s.name, id: s.id }));
    staticNames.forEach((n: string) => { if (!combined.some(c => c.name === n)) combined.push({ name: n }); });
    combined.sort((a, b) => {
      const n = (s: string) => { const m = s.match(/^(\d+)/); return m ? +m[1] : 999; };
      return n(a.name) - n(b.name);
    });
    return combined;
  };

  const handleStart = (name: string, year: number, shiftId?: string) => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    if (shiftId) {
      router.push(`/pages/dashboard/jee-mains/workspace?shiftId=${shiftId}&name=${encodeURIComponent(name)}&year=${year}`);
    } else {
      alert(`Mock paper: ${name} (${year})\n\nThis paper is not yet in the database.`);
    }
  };

  /* ── open modal ── */
  const openYear = (year: number) => {
    setSelectedYear(year);
    setActiveAttempt("january");
  };

  /* modal data */
  const modalJan = selectedYear ? getShifts(selectedYear, "january") : [];
  const modalApr = selectedYear ? getShifts(selectedYear, "april")   : [];
  const modalShifts = activeAttempt === "january" ? modalJan : modalApr;

  /* ───────────────────────────── RENDER ───────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">

      {/* ── Nav ── */}
      <NavBar />

      {/* ── Hero ── */}
      <div className="text-center pt-14 pb-10 px-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight mb-4">
          {isAdvanced ? "JEE Advanced" : "JEE Mains"} Question Papers
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Browse year-wise shifted papers. Attempt real database exams or explore mock papers with full LaTeX and diagram support.
        </p>
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {SUBJECT_TAGS.map(tag => (
            <span key={tag.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${tag.color}`}>
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Card Grid ── */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {years.map((year, idx) => {
          const col        = YEAR_COLORS[idx % YEAR_COLORS.length];
          const janShifts  = getShifts(year, "january");
          const aprShifts  = getShifts(year, "april");
          const total      = isAdvanced ? 2 : janShifts.length + aprShifts.length;
          const dbCount    = [...janShifts, ...aprShifts].filter(s => s.id).length;

          return (
            <button
              key={year}
              onClick={() => openYear(year)}
              className={`group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-md rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer ${col.ring}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${col.icon} shadow-sm`}>
                <Calendar size={22} />
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {year} Papers
              </h3>

              {/* Meta */}
              <p className="text-gray-400 dark:text-slate-400 text-sm leading-relaxed">
                {total} papers
                {dbCount > 0 && (
                  <span className="text-emerald-500 font-semibold ml-1">· {dbCount} with answers</span>
                )}
              </p>

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                View Papers <ArrowRight size={13} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="max-w-5xl mx-auto px-6 pb-14">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 dark:text-slate-100 text-base">Want to create a custom test?</p>
            <p className="text-gray-400 dark:text-slate-400 text-sm mt-1">Upload your own PDF or JSON question paper and launch instantly.</p>
          </div>
          <button
            onClick={() => router.push("/pages/dashboard/create-test")}
            className="shrink-0 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer">
            Create Custom Test <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedYear && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setSelectedYear(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{selectedYear} Papers</h2>
                  <p className="text-xs text-gray-400">
                    {isAdvanced ? "JEE Advanced" : "JEE Mains"} — Select a paper to start
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedYear(null)} className="text-gray-400 hover:text-gray-700 transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {isAdvanced ? (
                /* Advanced papers */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Paper 1 (PCM)", "Paper 2 (PCM)"].map(paper => (
                    <button key={paper} onClick={() => handleStart(paper, selectedYear)}
                      className="group bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md rounded-xl p-4 text-left flex items-center justify-between transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">JEE Advanced {selectedYear}</p>
                          <p className="text-xs text-gray-400">{paper}</p>
                        </div>
                      </div>
                      <Play size={14} className="text-gray-300 group-hover:text-indigo-600 transition" />
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Attempt tab pills */}
                  <div className="flex gap-2">
                    {(["january", "april"] as const).map(attempt => (
                      <button key={attempt} onClick={() => setActiveAttempt(attempt)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition cursor-pointer capitalize ${
                          activeAttempt === attempt
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                        }`}>
                        {attempt === "january" ? "🔵 January" : "🟠 April"}
                      </button>
                    ))}
                  </div>

                  {/* Paper cards */}
                  {modalShifts.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl py-10 text-center text-gray-400 text-sm">
                      No {activeAttempt} papers available for {selectedYear}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modalShifts.map((shift, idx) => (
                        <button key={`${shift.name}-${idx}`}
                          onClick={() => handleStart(shift.name, selectedYear, shift.id)}
                          className="group bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md rounded-xl p-4 text-left flex items-center justify-between transition cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition ${
                              shift.id
                                ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                                : "bg-gray-100 text-gray-500 group-hover:bg-indigo-600 group-hover:text-white"
                            }`}>
                              <FileText size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 text-sm truncate">{shift.name}</p>
                              <p className={`text-xs mt-0.5 ${shift.id ? "text-emerald-500 font-medium" : "text-gray-400"}`}>
                                {shift.id ? "✓ Full paper with answers" : "Mock paper"}
                              </p>
                            </div>
                          </div>
                          <Play size={14} className="text-gray-300 group-hover:text-indigo-600 transition shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="JEE Mains Exam Restricted"
        message="You are exploring in Guest Tour mode. To attempt JEE Mains past papers and track your scores, please log in or create a free account."
      />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── Export ─────────────────────────── */
export default function JeeExamPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          <p className="text-sm font-semibold text-gray-400">Loading papers…</p>
        </div>
      </div>
    }>
      <JeeExamPageContent />
    </Suspense>
  );
}