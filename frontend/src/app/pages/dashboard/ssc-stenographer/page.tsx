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

function PlayOutlineIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="6 4 18 12 6 20 6 4" />
    </svg>
  );
}

const YEAR_CARDS_CONFIG = [
  { year: 2026, label: "2026 Papers", bg: "bg-indigo-600", text: "text-indigo-600", tag: "COMING SOON" },
  { year: 2025, label: "2025 Papers", bg: "bg-purple-600", text: "text-purple-600", tag: "5 PAPERS" },
  { year: 2024, label: "2024 Archive", bg: "bg-purple-800", text: "text-purple-700", tag: "ARCHIVE" },
  { year: 2023, label: "2023 Archive", bg: "bg-slate-700", text: "text-slate-600", tag: "ARCHIVE" },
  { year: 2022, label: "2022 Archive", bg: "bg-slate-800", text: "text-slate-600", tag: "ARCHIVE" },
];

function SscStenographerDashboardContent() {
  const router = useRouter();
  const [modalYear, setModalYear] = useState<number | null>(null);
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [activeDayFilter, setActiveDayFilter] = useState<string>("All Shifts");

  useEffect(() => {
    const fetchDbShifts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/exams`);
        if (!response.ok) throw new Error("Failed to fetch exams");
        const data = await response.json();

        const stenoExam = data.find((e: any) => 
          e.name && e.name.toLowerCase().includes("stenographer")
        );
        if (stenoExam && stenoExam.shifts) {
          setDbShifts(stenoExam.shifts);
        }
      } catch (error) {
        console.error("Error fetching SSC Stenographer exams:", error);
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
    const fullExamName = name.toLowerCase().includes("stenographer")
      ? name
      : `SSC Stenographer ${year} (${name})`;

    if (shiftId) {
      router.push(
        `/pages/dashboard/ssc-cgl/workspace?shiftId=${shiftId}&name=${encodeURIComponent(fullExamName)}&year=${year}`
      );
    } else {
      const matched = dbShifts.find((s: any) => 
        s.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(s.name.toLowerCase())
      );
      if (matched) {
        router.push(
          `/pages/dashboard/ssc-cgl/workspace?shiftId=${matched.id}&name=${encodeURIComponent(fullExamName)}&year=${year}`
        );
      } else {
        alert(`Launching ${fullExamName}...`);
      }
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

  const activeModalConfig = YEAR_CARDS_CONFIG.find(c => c.year === modalYear) || YEAR_CARDS_CONFIG[1];
  const rawModalShifts = modalYear ? getShiftsForYear(modalYear) : [];

  // Filter modal shifts based on day filter
  const modalShifts = useMemo(() => {
    if (activeDayFilter === "All Shifts") return rawModalShifts;
    return rawModalShifts.filter((s: any) => 
      s.name.toLowerCase().includes(activeDayFilter.toLowerCase())
    );
  }, [rawModalShifts, activeDayFilter]);

  const featuredShift = dbShifts.length > 0 ? dbShifts[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      
      {/* BACKGROUND GRADIENT GLOWS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-600/15 dark:via-indigo-900/10 dark:to-transparent blur-3xl pointer-events-none -z-10" />

      <NavBar />

      {/* MAIN CONTAINER */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO BANNER SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 backdrop-blur-xl p-6 sm:p-10 shadow-lg dark:shadow-2xl transition-colors">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-bold uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse" />
                <span>OFFICIAL SSC STENOGRAPHER EXAM ENGINE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                SSC Stenographer Previous Year <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 dark:from-purple-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">Question Papers</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Practice 100% authentic SSC Stenographer exam shifts with real CBT exam timer controls (2 Hours), 200 Qs per paper, accurate marking (+1.0 / -0.25), and step-by-step review analysis.
              </p>

              {/* STATS CHIPS */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">Official</span>
                  <span>CBT Shift Engine</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">200 Qs</span>
                  <span>200 Marks / Paper</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">120 Mins</span>
                  <span>Timed Exam</span>
                </div>
              </div>
            </div>

            {/* QUICK LAUNCH BANNER ACTION */}
            {featuredShift && (
              <div className="shrink-0 bg-gradient-to-b from-purple-50/80 to-indigo-50/80 dark:from-slate-800/90 dark:to-slate-900/90 p-5 rounded-2xl border border-purple-200/80 dark:border-slate-700/80 flex flex-col space-y-3 shadow-md dark:shadow-xl max-w-sm">
                <span className="text-xs font-extrabold text-purple-700 dark:text-purple-400 uppercase tracking-wider">Featured Shift</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{featuredShift.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Launch into the active NTA/SSC Stenographer mock test workspace with 2-hour duration and free section navigation.</p>
                <button
                  onClick={() => handleStartExam(featuredShift.name, 2025, featuredShift.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Attempt Latest Shift</span>
                  <ArrowIcon />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* YEAR PAPERS GRID MODE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
          {YEAR_CARDS_CONFIG.map((item) => {
            const shifts = getShiftsForYear(item.year);

            return (
              <div
                key={item.year}
                onClick={() => setModalYear(item.year)}
                className="group cursor-pointer bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 rounded-3xl p-5 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* TOP SQUIRCLE ICON */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl ${item.bg} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                    {item.tag && (
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        item.year === 2026 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                        item.year === 2025 ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* YEAR TITLE & SUBTITLE */}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                      {shifts.length > 0 ? `${shifts.length} papers` : item.year === 2026 ? "Coming Soon" : "Archive"}
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
                    SSC Stenographer — Select a paper to start
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

            {/* DAY FILTER TABS (All Shifts | 6 Aug | 7 Aug | 8 Aug) */}
            <div className="flex items-center space-x-2">
              {["All Shifts", "6 Aug", "7 Aug", "8 Aug"].map((dayName) => (
                <button
                  key={dayName}
                  onClick={() => setActiveDayFilter(dayName)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    activeDayFilter === dayName
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    dayName === "All Shifts" ? "bg-purple-500" :
                    dayName === "6 Aug" ? "bg-indigo-400" :
                    dayName === "7 Aug" ? "bg-emerald-400" : "bg-rose-400"
                  }`} />
                  <span>{dayName}</span>
                </button>
              ))}
            </div>

            {/* 2-COLUMN SHIFTS GRID OR UPCOMING RELEASE BANNER */}
            <div className="flex-1 max-h-[60vh] sm:max-h-[55vh] overflow-y-auto pr-1">
              {modalYear === 2026 ? (
                <div className="py-6 px-4 sm:px-6 text-center space-y-4 bg-gradient-to-b from-purple-50/50 via-white to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950 rounded-2xl border border-purple-100 dark:border-slate-800">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-tr from-purple-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      <span>✨ Upcoming Release · SSC Stenographer 2026</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                      2026 Question Papers Uploading Soon
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      Our editorial team is currently verifying and formatting official SSC Stenographer 2026 question papers with verified answer keys &amp; solutions. They will be published here shortly.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button 
                      onClick={() => setModalYear(2025)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Explore 2025 Solved Papers</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setModalYear(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : loading ? (
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
                      className="group cursor-pointer bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 hover:border-purple-500/60 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all flex items-center justify-between space-x-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/60 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                          <DocumentIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                            {shift.name}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                            <span>✓ Full paper with answers</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition shrink-0">
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
        title="SSC Stenographer Exam Restricted"
        message="You are exploring in Guest Tour mode. To attempt SSC Stenographer past papers and full evaluation, please sign in or register."
      />

      <Footer />
    </div>
  );
}

export default function SscStenographerDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex items-center justify-center text-slate-800 dark:text-white font-bold">
        Loading SSC Stenographer Portal...
      </div>
    }>
      <SscStenographerDashboardContent />
    </Suspense>
  );
}
