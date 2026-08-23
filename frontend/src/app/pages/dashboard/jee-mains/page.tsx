"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText, Calendar, ArrowRight,
  BookOpen, FlaskConical, Sigma, Atom, X, Play, Clock, Sparkles
} from "lucide-react";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";
import { API_BASE_URL } from "@/src/lib/apiConfig";

/* ─────────────────────────── Static data ─────────────────────────── */
const janExamDays = [22, 23, 24, 28, 29];

const mainsPapersData: Record<number, { january?: string[]; february?: string[]; april?: string[] }> = {
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
  const [selectedYear,  setSelectedYear]  = useState<number | string | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<"january" | "february" | "march" | "april" | "june" | "july" | "august" | "temp">("january");
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);

  const years = Array.from({ length: 6 }, (_, i) => 2026 - i);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exams`)
      .then(r => r.json())
      .then(data => {
        const jee = data.find((e: any) => e.name === "JEE Main");
        if (jee?.shifts) setDbShifts(jee.shifts);
      })
      .catch(() => {});
  }, []);

  /* ── helpers ── */
  const getShifts = (year: number | string, attempt: "january" | "february" | "march" | "april" | "june" | "july" | "august" | "temp") => {
    if (attempt === "temp") {
      return dbShifts.filter((s: any) =>
        s.name.includes("Wave Optics") || s.name.includes("Temp") || s.name.includes("Topic")
      ).map((s: any) => ({ name: s.name, id: s.id }));
    }
    const staticNames = (mainsPapersData[year as number] as any)?.[attempt] || [];
    const dbMatched   = dbShifts.filter((s: any) => {
      const d = new Date(s.date);
      return typeof year === "number" && d.getUTCFullYear() === year &&
        ((attempt === "january"  && d.getUTCMonth() === 0) ||
         (attempt === "february" && d.getUTCMonth() === 1) ||
         (attempt === "march"    && d.getUTCMonth() === 2) ||
         (attempt === "april"    && d.getUTCMonth() === 3) ||
         (attempt === "june"     && d.getUTCMonth() === 5) ||
         (attempt === "july"     && d.getUTCMonth() === 6) ||
         (attempt === "august"   && (d.getUTCMonth() === 7 || d.getUTCMonth() === 8)));
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

  const handleStart = (name: string, year: number | string, shiftId?: string) => {
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
  const openYear = (year: number | string) => {
    setSelectedYear(year);
    if (year === "temp") {
      setActiveAttempt("temp");
    } else if (year === 2022) {
      setActiveAttempt("june");
    } else if (year === 2021) {
      setActiveAttempt("august");
    } else {
      setActiveAttempt("january");
    }
  };

  const tempShifts = dbShifts.filter((s: any) =>
    s.name.includes("Wave Optics") || s.name.includes("Temp") || s.name.includes("Topic")
  );

  /* modal data */
  const modalShifts = selectedYear ? getShifts(selectedYear, activeAttempt) : [];

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
          Browse year-wise shifted papers and topic special papers. Attempt real database exams or explore mock papers with full LaTeX and diagram support.
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
          const febShifts  = getShifts(year, "february");
          const marShifts  = getShifts(year, "march");
          const aprShifts  = getShifts(year, "april");
          const junShifts  = getShifts(year, "june");
          const julShifts  = getShifts(year, "july");
          const augShifts  = getShifts(year, "august");
          const allShifts  = [...janShifts, ...febShifts, ...marShifts, ...aprShifts, ...junShifts, ...julShifts, ...augShifts];
          const total      = isAdvanced ? 2 : allShifts.length;
          const dbCount    = allShifts.filter(s => s.id).length;

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
                {year === 2026 ? (
                  <span className="text-amber-500 font-semibold">Upcoming · Uploading soon</span>
                ) : (
                  <>
                    {total} papers
                    {dbCount > 0 && (
                      <span className="text-emerald-500 font-semibold ml-1">· {dbCount} with answers</span>
                    )}
                  </>
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
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-slate-800">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-slate-100 text-lg">
                    {selectedYear === "temp" ? "🔥 Temp Section — Wave Optics Papers" : `${selectedYear} Papers`}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {selectedYear === 2026 || selectedYear === "2026" ? "Paper release schedule & availability" : selectedYear === "temp" ? "Select any of the 4 Wave Optics PYQ papers to attempt" : `${isAdvanced ? "JEE Advanced" : "JEE Mains"} — Select a paper to start`}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedYear(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {selectedYear === 2026 || selectedYear === "2026" ? (
                <div className="py-8 px-6 text-center space-y-4 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 rounded-2xl border border-indigo-100/80 dark:border-slate-800">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Clock size={32} />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <Sparkles size={12} /> Upcoming Paper Release
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      2026 Question Papers Uploading Soon
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Our academic team is currently verifying and formatting the official 2026 JEE Mains papers with step-by-step LaTeX solutions &amp; diagram illustrations. They will be published here shortly.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button 
                      onClick={() => setSelectedYear(2025)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Explore 2025 Solved Papers</span>
                      <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => setSelectedYear(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : selectedYear === "temp" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tempShifts.map((shift, idx) => (
                    <button key={`${shift.name}-${idx}`}
                      onClick={() => handleStart(shift.name, "2025", shift.id)}
                      className="group bg-white dark:bg-slate-950 border border-amber-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md rounded-xl p-4 text-left flex items-center justify-between transition cursor-pointer">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white">
                          <FileText size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm truncate">{shift.name}</p>
                          <p className="text-xs mt-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ Full paper with answers
                          </p>
                        </div>
                      </div>
                      <Play size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition shrink-0" />
                    </button>
                  ))}
                </div>
              ) : isAdvanced ? (
                /* Advanced papers */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Paper 1 (PCM)", "Paper 2 (PCM)"].map(paper => (
                    <button key={paper} onClick={() => handleStart(paper, selectedYear)}
                      className="group bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md rounded-xl p-4 text-left flex items-center justify-between transition cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm">JEE Advanced {selectedYear}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-400">{paper}</p>
                        </div>
                      </div>
                      <Play size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Attempt tab pills */}
                  <div className="flex gap-2 flex-wrap">
                    {(["january", "february", "march", "april", "june", "july", "august", "temp"] as const)
                      .filter(attempt => {
                        if (attempt === "temp") return tempShifts.length > 0;
                        if (selectedYear === 2021) return attempt === "august" || attempt === "july" || attempt === "february" || attempt === "march" || getShifts(selectedYear, attempt).length > 0;
                        if (selectedYear === 2022) return attempt === "june" || attempt === "july" || getShifts(selectedYear, attempt).length > 0;
                        if (attempt === "june" || attempt === "july" || attempt === "august" || attempt === "march") return getShifts(selectedYear, attempt).length > 0;
                        if (attempt === "february") return getShifts(selectedYear, "february").length > 0;
                        return true;
                      })
                      .map(attempt => (
                        <button key={attempt} onClick={() => setActiveAttempt(attempt)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition cursor-pointer capitalize ${
                            activeAttempt === attempt
                              ? "bg-gray-900 text-white border-gray-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}>
                          {attempt === "temp" ? "🔥 Temp Section" : attempt === "january" ? "🔵 January" : attempt === "february" ? "🟣 February" : attempt === "march" ? "🟡 March" : attempt === "april" ? "🟠 April" : attempt === "june" ? "🟢 June" : attempt === "july" ? "🔴 July" : "🟤 August"}
                        </button>
                      ))}
                  </div>

                  {/* Paper cards */}
                  {modalShifts.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl py-10 text-center text-gray-400 dark:text-slate-500 text-sm">
                      No {activeAttempt} papers available for {selectedYear}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {modalShifts.map((shift, idx) => (
                        <button key={`${shift.name}-${idx}`}
                          onClick={() => handleStart(shift.name, typeof selectedYear === "number" ? selectedYear : 2025, shift.id)}
                          className="group bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md rounded-xl p-4 text-left flex items-center justify-between transition cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition ${
                              shift.id
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"
                                : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white"
                            }`}>
                              <FileText size={15} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 dark:text-slate-100 text-sm truncate">{shift.name}</p>
                              <p className={`text-xs mt-0.5 ${shift.id ? "text-emerald-500 dark:text-emerald-400 font-semibold" : "text-gray-400 dark:text-slate-500"}`}>
                                {shift.id ? "✓ Full paper with answers" : "Mock paper"}
                              </p>
                            </div>
                          </div>
                          <Play size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition shrink-0" />
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