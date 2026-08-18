"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProfile,
  recordDailyCheckIn,
  type StreakData,
} from "../../../lib/profileApi";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";

import {
  GraduationCap, ArrowRight, BookOpen, Brain,
  Users, Landmark, Sparkles, Flame, Trophy,
  CheckCircle2, Calendar, X, Zap, Building2, Dna,
} from "lucide-react";

import { isGuestUser, clearGuestMode } from "@/src/lib/authUtils";
import { LogIn, Eye } from "lucide-react";

export default function GeneralDashboard() {
  const router = useRouter();

  // ── NO localStorage in useState initialiser (prevents hydration mismatch) ──
  const [loading,         setLoading]         = useState(false);
  const [displayName,     setDisplayName]     = useState("Student");
  const [mounted,         setMounted]         = useState(false);
  const [isGuest,         setIsGuest]         = useState(false);
  const [darkMode,        setDarkMode]        = useState(false);
  const [showStreakModal, setShowStreakModal]  = useState(false);
  const [checkingIn,      setCheckingIn]      = useState(false);
  const [activeCategory,  setActiveCategory]  = useState("All");

  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString(),
    isActiveToday: true,
    streakHistory: [new Date().toISOString().split("T")[0]],
  });

  // ── Mount guard (client-only work goes here) ──
  useEffect(() => {
    setMounted(true);
    const guestStatus = isGuestUser();
    setIsGuest(guestStatus);
    if (guestStatus) {
      setDisplayName("Guest Explorer");
    } else {
      const saved = localStorage.getItem("displayName");
      if (saved) setDisplayName(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem("token");
    const guestStatus = isGuestUser();
    setIsGuest(guestStatus);

    if (!token && !guestStatus) { router.push("/login"); return; }
    if (guestStatus) { setLoading(false); return; }

    fetchProfile()
      .then(prof => {
        if (prof?.fullName) {
          setDisplayName(prof.fullName);
          localStorage.setItem("displayName", prof.fullName);
        }
        if (prof) {
          const todayStr = new Date().toISOString().split("T")[0];
          const history  = prof.streakHistory || [];
          setStreakData({
            currentStreak:  prof.currentStreak  ?? 1,
            longestStreak:  prof.longestStreak  ?? 1,
            lastActiveDate: prof.lastActiveDate ?? new Date().toISOString(),
            isActiveToday:  history.includes(todayStr),
            streakHistory:  history,
          });
        }
      })
      .catch(err => console.warn("Error loading dashboard profile:", err))
      .finally(() => setLoading(false));
  }, [mounted, router]);

  const handleManualCheckIn = async () => {
    setCheckingIn(true);
    try {
      const updated = await recordDailyCheckIn();
      setStreakData(updated);
    } catch (err) {
      console.error("Failed to check in:", err);
    } finally {
      setCheckingIn(false);
    }
  };

  const getPastSevenDays = () => {
    const days    = [];
    const today   = new Date();
    const history = streakData.streakHistory || [];
    for (let i = 6; i >= 0; i--) {
      const d       = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ dateStr, dayName, isToday: i === 0, isActive: history.includes(dateStr) });
    }
    return days;
  };

  const getStreakMessage = (count: number) => {
    if (count <= 1) return "First day – Off to a great start!";
    if (count <= 3) return "Keep it going!";
    if (count <= 7) return "🔥 You're on fire!";
    return "⚡ Unstoppable Legend!";
  };

  const streakMessage  = getStreakMessage(streakData.currentStreak);
  const pastSevenDays  = getPastSevenDays();

  const exams = [
    {
      id: "organisation",
      name: "Organisation & School Tests",
      description: "Join custom exams with a unique code provided by your school or college, or manage tests as an admin.",
      route: "/pages/dashboard/organisation",
      category: "Institutions",
      icon: Building2,
      iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      shadow: "shadow-cyan-200",
      hover: "group-hover:border-cyan-300",
    },
    {
      id: "custom-test",
      name: "AI Custom Test Generator",
      description: "Upload a PDF or JSON question paper. Groq AI extracts MCQs and builds an exam instantly.",
      route: "/pages/dashboard/create-test",
      category: "AI",
      icon: Sparkles,
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
      shadow: "shadow-violet-200",
      hover: "group-hover:border-violet-300",
    },
    {
      id: "jee-mains",
      name: "JEE Mains",
      description: "Browse year-wise shifted papers from 2016 to 2026 with full LaTeX math rendering.",
      route: "/pages/dashboard/jee-mains?type=mains",
      category: "Engineering",
      icon: BookOpen,
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      shadow: "shadow-blue-200",
      hover: "group-hover:border-blue-300",
    },
    {
      id: "jee-advanced",
      name: "JEE Advanced",
      description: "Practice Paper 1 and Paper 2 from past JEE Advanced sessions.",
      route: "/pages/dashboard/jee-advanced",
      category: "Engineering",
      icon: Brain,
      iconBg: "bg-gradient-to-br from-indigo-500 to-violet-600",
      shadow: "shadow-indigo-200",
      hover: "group-hover:border-indigo-300",
    },
    {
      id: "neet",
      name: "NEET (UG)",
      description: "National Eligibility Entrance Test with Physics, Chemistry, and Biology, 720 total marks, and 3 hours duration.",
      route: "/pages/dashboard/neet",
      category: "Medical",
      icon: Dna,
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
      shadow: "shadow-rose-200",
      hover: "group-hover:border-rose-300",
    },
    {
      id: "ssc-cgl",
      name: "SSC CGL",
      description: "Staff Selection Commission CGL papers with GK, Reasoning, and Quant sections.",
      route: "/pages/dashboard/ssc-cgl",
      category: "Government",
      icon: Users,
      iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
      shadow: "shadow-emerald-200",
      hover: "group-hover:border-emerald-300",
    },
    {
      id: "ssc-chsl",
      name: "SSC CHSL",
      description: "Combined Higher Secondary Level papers for Tier I and Tier II preparation.",
      route: "/pages/dashboard/ssc-chsl",
      category: "Government",
      icon: Landmark,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
      shadow: "shadow-amber-200",
      hover: "group-hover:border-amber-300",
    },
  ];

  const CATEGORIES = ["All", "Institutions", "AI", "Engineering", "Medical", "Government"];
  const filtered   = activeCategory === "All" ? exams : exams.filter(e => e.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans flex flex-col transition-colors">

      {/* ── Shared NavBar ── */}
      <NavBar
        displayName={mounted ? displayName : "Student"}
        streak={streakData.currentStreak}
        isStreakActive={streakData.isActiveToday}
        onStreakClick={() => setShowStreakModal(true)}
      />

      {/* ── Streak Modal ── */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl p-6 shadow-2xl border bg-white dark:bg-slate-900 border-orange-100 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <Flame size={26} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">Study Streak</h2>
                  <p className="text-xs text-gray-400 dark:text-slate-400">Keep learning every day!</p>
                </div>
              </div>
              <button onClick={() => setShowStreakModal(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-4 rounded-2xl border bg-orange-50/80 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/40 flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-orange-500 mb-1"><Zap size={16} /><span className="text-xs font-bold uppercase">Current</span></div>
                <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">{streakData.currentStreak}</p>
                <span className="text-xs text-orange-500/80 font-medium mt-0.5">Days Active</span>
              </div>
              <div className="p-4 rounded-2xl border bg-amber-50/80 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40 flex flex-col items-center text-center">
                <div className="flex items-center gap-1.5 text-amber-500 mb-1"><Trophy size={16} /><span className="text-xs font-bold uppercase">Best</span></div>
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{streakData.longestStreak}</p>
                <span className="text-xs text-amber-500/80 font-medium mt-0.5">Longest Streak</span>
              </div>
            </div>

            <div className="mb-5 p-4 rounded-2xl border bg-gray-50/80 dark:bg-slate-800/50 border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5"><Calendar size={13} /> Last 7 Days</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Checked In Today</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {pastSevenDays.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className={`text-[11px] font-bold ${d.isToday ? "text-orange-500" : "text-gray-400 dark:text-slate-500"}`}>{d.dayName}</span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${d.isActive ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md" : "bg-gray-200/70 dark:bg-slate-700 text-gray-400 dark:text-slate-500"} ${d.isToday ? "ring-2 ring-orange-500 ring-offset-1 dark:ring-offset-slate-900" : ""}`}>
                      {d.isActive ? <CheckCircle2 size={16} /> : <span className="text-xs">·</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleManualCheckIn} disabled={checkingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles size={18} />
              <span>{checkingIn ? "Recording…" : "Check-In Completed ✨"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Guest Tour Banner ── */}
      {isGuest && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border-b border-amber-500/20 px-4 py-3 text-center">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                <Eye size={16} />
              </span>
              <span>
                <strong>Guest Tour Mode:</strong> You are exploring an overview of ILoveStudy. Sign in to attempt tests and join organizations.
              </span>
            </div>
            <button
              onClick={() => { clearGuestMode(); router.push("/login"); }}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide uppercase transition shadow-sm shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <LogIn size={13} />
              Log In Now
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="text-center pt-14 pb-10 px-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight mb-4">
          Every exam tool you need<br />in one place
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Practice JEE, SSC and more with real past papers. Upload your own PDF for instant AI-powered custom tests.
        </p>
      </div>

      {/* ── Category Pills ── */}
      <div className="flex justify-center gap-2 flex-wrap px-4 py-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 cursor-pointer ${
              activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:text-slate-100"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Card Grid ── */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {filtered.map(exam => {
          const Icon = exam.icon;
          return (
            <button key={exam.id} onClick={() => router.push(exam.route)}
              className={`group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-md ${exam.hover} rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${exam.iconBg} shadow-md ${exam.shadow} text-white`}>
                <Icon size={22} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {exam.name}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{exam.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition">
                Access Papers <ArrowRight size={13} />
              </div>
            </button>
          );
        })}
      </main>

      {/* ── Footer CTA ── */}
      <div className="max-w-5xl w-full mx-auto px-6 pb-14">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-slate-100">Prepare smarter. Practice consistently.</p>
              <p className="text-sm text-gray-400 dark:text-slate-400 mt-0.5">{streakMessage}</p>
            </div>
          </div>
          <button onClick={() => setShowStreakModal(true)}
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer">
            🔥 View Streak
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
