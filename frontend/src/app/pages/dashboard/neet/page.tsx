"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Calendar, ArrowRight,
  BookOpen, FlaskConical, Atom, Dna, Play, Sparkles, Award, Clock
} from "lucide-react";
import NavBar from "@/src/components/NavBar";

import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";

const SUBJECT_TAGS = [
  { label: "Physics", icon: <Atom size={13} />, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { label: "Chemistry", icon: <FlaskConical size={13} />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { label: "Biology", icon: <Dna size={13} />, color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
];

function NeetExamPageContent() {
  const router = useRouter();
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [loading, setLoading] = useState(true);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

  useEffect(() => {
    fetch("http://localhost:5000/api/exams")
      .then(r => r.json())
      .then(data => {
        const neet = data.find((e: any) => e.name === "NEET" || e.name.toLowerCase().includes("neet"));
        if (neet?.shifts) setDbShifts(neet.shifts);
      })
      .catch((err) => console.error("Error loading NEET exams:", err))
      .finally(() => setLoading(false));
  }, []);

  const getShiftsForYear = (year: number) => {
    return dbShifts.filter((s: any) => {
      const d = new Date(s.date);
      return d.getUTCFullYear() === year || s.name.includes(String(year));
    });
  };

  const handleStartExam = (shift: any) => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    const shiftYear = new Date(shift.date).getUTCFullYear() || 2023;
    router.push(
      `/pages/dashboard/neet/workspace?shiftId=${encodeURIComponent(
        shift.id
      )}&name=${encodeURIComponent(shift.name)}&year=${shiftYear}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col transition-colors">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Soothing Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Dna size={14} className="text-emerald-400" />
              <span>National Eligibility cum Entrance Test (UG)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              NEET Practice &amp; Past Papers
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Attempt official NEET papers with full timer simulations, 720 total marks, +4 / -1 marking scheme, and accurate LaTeX math &amp; diagrams in a calm, stress-free interface.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Total Marks</p>
                  <p className="text-sm sm:text-base font-bold text-slate-100">720 Marks</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Duration</p>
                  <p className="text-sm sm:text-base font-bold text-slate-100">3 Hours (180m)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Questions</p>
                  <p className="text-sm sm:text-base font-bold text-slate-100">200 Questions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center gap-3 backdrop-blur-sm shadow-sm">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">Marking</p>
                  <p className="text-sm sm:text-base font-bold text-slate-100">+4 / -1 Mark</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects & Year Selector Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Select Exam Year</h2>
            <p className="text-xs text-slate-400">Choose a session to attempt past year papers</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {SUBJECT_TAGS.map((tag) => (
              <span
                key={tag.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${tag.color}`}
              >
                {tag.icon}
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Year Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {years.map((year) => {
            const isSelected = selectedYear === year;
            const shiftCount = getShiftsForYear(year).length;
            return (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20 scale-[1.02]"
                    : "bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} className={isSelected ? "text-white" : "text-slate-400"} />
                  <span>NEET {year}</span>
                  {shiftCount > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}>
                      {shiftCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Available Question Papers List */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-emerald-400" />
            <span>Available Question Papers for NEET {selectedYear}</span>
          </h3>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-400">Loading examination database...</p>
            </div>
          ) : getShiftsForYear(selectedYear).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getShiftsForYear(selectedYear).map((shift: any) => (
                <div
                  key={shift.id}
                  className="group p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 shadow-lg hover:shadow-emerald-500/5 transition duration-300 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                        Official Paper
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(shift.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition">
                      {shift.name}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Complete 200 questions covering Physics, Chemistry, and Biology with high-res diagrams and detailed solutions.
                    </p>
                  </div>

                  <button
                    onClick={() => handleStartExam(shift)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Start NEET Examination</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
              <Dna size={36} className="text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-300">No shifts published for {selectedYear} yet</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Check out NEET 2023 above to attempt the full verified examination with complete answer keys and explanations!
              </p>
              <button
                onClick={() => setSelectedYear(2023)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Switch to NEET 2023
              </button>
            </div>
          )}
        </div>
      </main>
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="NEET Examination Restricted"
        message="You are exploring in Guest Tour mode. To attempt NEET mock tests, 720-mark score tracking, and detailed answer keys, please log in or sign up."
      />
    </div>
  );
}

export default function NeetExamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <NeetExamPageContent />
    </Suspense>
  );
}
