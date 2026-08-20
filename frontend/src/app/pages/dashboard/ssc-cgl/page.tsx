"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";
import { API_BASE_URL } from "@/src/lib/apiConfig";

function CalendarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </svg>
  );
}

function DocumentIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h6" />
    </svg>
  );
}

function ArrowIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function PlayOutlineIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="6 4 18 12 6 20 6 4" />
    </svg>
  );
}

const YEAR_CARDS_CONFIG = [
  { year: 2026, label: "2026 Papers", bg: "bg-indigo-600", text: "text-indigo-600" },
  { year: 2025, label: "2025 Papers", bg: "bg-emerald-600", text: "text-emerald-600" },
  { year: 2024, label: "2024 Papers", bg: "bg-rose-500", text: "text-rose-500" },
  { year: 2023, label: "2023 Papers", bg: "bg-amber-500", text: "text-amber-500" },
  { year: 2022, label: "2022 Papers", bg: "bg-sky-500", text: "text-sky-500" },
  { year: 2021, label: "2021 Papers", bg: "bg-purple-600", text: "text-purple-600" },
];

function SscCglDashboardContent() {
  const router = useRouter();
  const [modalYear, setModalYear] = useState<number | null>(null);
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>("All");
  const [activeMonthFilter, setActiveMonthFilter] = useState<string>("All");

  useEffect(() => {
    const fetchDbShifts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/exams`);
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();

        const sscExam = data.find((e: any) => e.name === "SSC CGL");
        if (sscExam && sscExam.shifts) {
          setDbShifts(sscExam.shifts);
        }
      } catch (error) {
        console.error("Error fetching SSC CGL exams from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDbShifts();
  }, []);

  const handleStartExam = (name: string, year: number, shiftId?: string) => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    if (shiftId) {
      router.push(
        `/pages/dashboard/ssc-cgl/workspace?shiftId=${shiftId}&name=${encodeURIComponent(name)}&year=${year}`
      );
    } else {
      alert(`Launching Mock Exam...\nSSC CGL Year: ${year}\nTarget: ${name}`);
    }
  };

  const getShiftsForYear = (year: number) => {
    const matchingDbShifts = dbShifts.filter((shift: any) => {
      const nameMatch = shift.name.match(/\b(20\d{2})\b/);
      if (nameMatch) {
        return parseInt(nameMatch[1], 10) === year;
      }
      const shiftDate = new Date(shift.date);
      return shiftDate.getUTCFullYear() === year;
    });

    return matchingDbShifts.map((shift: any) => ({
      name: shift.name,
      id: shift.id,
      isDb: true,
      year: year
    }));
  };

  // Filtered shifts based on search query
  const allShiftsFiltered = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    return dbShifts.filter((shift: any) => {
      const matchName = (shift.name || "").toLowerCase().includes(query);
      const matchYear = String(shift.date ? new Date(shift.date).getUTCFullYear() : "").includes(query);
      return matchName || matchYear;
    });
  }, [dbShifts, searchQuery]);

  const activeModalConfig = YEAR_CARDS_CONFIG.find(c => c.year === modalYear) || YEAR_CARDS_CONFIG[2];
  const modalShifts = modalYear ? getShiftsForYear(modalYear) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      
      {/* BACKGROUND GRADIENT GLOWS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-600/15 dark:via-teal-900/10 dark:to-transparent blur-3xl pointer-events-none -z-10" />

      <NavBar />

      {/* MAIN CONTAINER */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl p-6 sm:p-10 shadow-lg dark:shadow-2xl transition-colors">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>OFFICIAL SSC CGL TIER-I EXAM ENGINE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                SSC CGL Previous Year <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">Question Papers</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Practice 100% authentic SSC CGL Tier-I exam shifts with real exam timer controls, section locking rules, accurate marking (+2.0 / -0.5), and step-by-step review analysis.
              </p>

              {/* STATS CHIPS */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">Official</span>
                  <span>Tier-I Shift Engine</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">100 Qs</span>
                  <span>200 Marks / Paper</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">60 Mins</span>
                  <span>Timed Exam</span>
                </div>
              </div>
            </div>

            {/* QUICK LAUNCH BANNER ACTION */}
            {dbShifts.length > 0 && (
              <div className="shrink-0 bg-gradient-to-b from-emerald-50/80 to-teal-50/80 dark:from-slate-800/90 dark:to-slate-900/90 p-5 rounded-2xl border border-emerald-200/80 dark:border-slate-700/80 flex flex-col space-y-3 shadow-md dark:shadow-xl max-w-sm">
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Featured Shift</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{dbShifts[0]?.name || "SSC CGL 2024 Tier-I Shift"}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Launch into the active NTA/SSC mock test workspace with strict 15-minute section locking.</p>
                <button
                  onClick={() => handleStartExam(dbShifts[0].name, 2024, dbShifts[0].id)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Attempt Latest Shift</span>
                  <ArrowIcon />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* YEAR PAPERS 3-COLUMN GRID MODE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {YEAR_CARDS_CONFIG.map((item) => {
            const shifts = getShiftsForYear(item.year);

            return (
              <div
                key={item.year}
                onClick={() => setModalYear(item.year)}
                className="group cursor-pointer bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* TOP SQUIRCLE ICON */}
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                    <CalendarIcon className="w-6 h-6" />
                  </div>

                  {/* YEAR TITLE & SUBTITLE */}
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {shifts.length > 0 ? `${shifts.length} papers` : "Official Papers"}
                    </p>
                  </div>
                </div>

                {/* BOTTOM ACTION LINK */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                  <span className={`text-xs font-bold flex items-center space-x-1 ${item.text} group-hover:translate-x-1 transition`}>
                    <span>View Papers</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* POPUP SHIFT SELECTION MODAL MATCHING REFERENCE UI */}
      {modalYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-slate-900 dark:text-white">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl ${activeModalConfig.bg} flex items-center justify-center text-white shadow-md shrink-0`}>
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {modalYear} Papers
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    SSC CGL — Select a paper to start
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalYear(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold flex items-center justify-center transition cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* MONTH / SHIFT FILTER TABS */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveMonthFilter("All")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeMonthFilter === "All"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>All Shifts</span>
              </button>
              <button
                onClick={() => setActiveMonthFilter("September")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                  activeMonthFilter === "September"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>September</span>
              </button>
            </div>

            {/* 2-COLUMN SHIFTS GRID */}
            <div className="flex-1 max-h-[55vh] overflow-y-auto pr-1">
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
                  Loading {modalYear} paper shifts...
                </div>
              ) : modalShifts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {modalShifts.map((shift, idx) => (
                    <div
                      key={shift.id || idx}
                      onClick={() => {
                        setModalYear(null);
                        handleStartExam(shift.name, modalYear, shift.id);
                      }}
                      className="group cursor-pointer bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/60 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between space-x-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                          <DocumentIcon className="w-5 h-5" />
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
                        <PlayOutlineIcon className="w-4 h-4" />
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
        title="SSC CGL Exam Restricted"
        message="You are exploring in Guest Tour mode. To attempt SSC CGL past papers, GK & Quant sectionals, and full evaluation, please sign in or register."
      />

      <Footer />
    </div>
  );
}

export default function SscCglDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs">Loading SSC CGL Papers...</div>}>
      <SscCglDashboardContent />
    </Suspense>
  );
}