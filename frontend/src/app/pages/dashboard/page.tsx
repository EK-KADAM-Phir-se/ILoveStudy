"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProfile,
  fetchStreakData,
  recordDailyCheckIn,
  type StreakData,
} from "../../../lib/profileApi";

import {
  GraduationCap,
  User,
  ArrowRight,
  BookOpen,
  Brain,
  Users,
  Landmark,
  Sparkles,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  X,
  Zap,
} from "lucide-react";

export default function GeneralDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("displayName") || "Student";
    }
    return "Student";
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString(),
    isActiveToday: true,
    streakHistory: [new Date().toISOString().split("T")[0]],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchProfile()
      .then((prof) => {
        if (prof?.fullName) {
          setDisplayName(prof.fullName);
        }
        if (prof) {
          const todayStr = new Date().toISOString().split("T")[0];
          const history = prof.streakHistory || [];
          setStreakData({
            currentStreak: prof.currentStreak ?? 1,
            longestStreak: prof.longestStreak ?? 1,
            lastActiveDate: prof.lastActiveDate ?? new Date().toISOString(),
            isActiveToday: history.includes(todayStr),
            streakHistory: history,
          });
        }
      })
      .catch((err) => {
        console.warn("Error loading dashboard profile:", err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleManualCheckIn = async () => {
    setCheckingIn(true);
    try {
      const updatedStreak = await recordDailyCheckIn();
      setStreakData(updatedStreak);
    } catch (err) {
      console.error("Failed to check in:", err);
    } finally {
      setCheckingIn(false);
    }
  };

  const getPastSevenDays = () => {
    const days = [];
    const today = new Date();
    const history = streakData.streakHistory || [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const isToday = i === 0;
      const isActive = history.includes(dateStr);
      days.push({ dateStr, dayName, isToday, isActive });
    }
    return days;
  };

  const getStreakMessage = (count: number) => {
    if (count <= 1) return "First day – Off to a great start!";
    if (count <= 3) return "Keep it going!";
    if (count <= 7) return "🔥 You're on fire!";
    return "⚡ Unstoppable Legend!";
  };

  const streakMessage = getStreakMessage(streakData.currentStreak);

  const exams = [
    {
      id: "jee-mains",
      name: "JEE Mains",
      route: "/pages/dashboard/jee-mains?type=mains",
      category: "Engineering",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "jee-advanced",
      name: "JEE Advanced",
      route: "/pages/dashboard/jee-advanced",
      category: "Engineering",
      icon: Brain,
      color: "purple",
    },
    {
      id: "ssc-cgl",
      name: "SSC CGL",
      route: "/pages/dashboard/ssc-cgl",
      category: "Staff Selection",
      icon: Users,
      color: "green",
    },
    {
      id: "ssc-chsl",
      name: "SSC CHSL",
      route: "/pages/dashboard/ssc-chsl",
      category: "Staff Selection",
      icon: Landmark,
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          darkMode ? "bg-slate-950 text-white" : "bg-[#f8fafc] text-slate-900"
        }`}
      >
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const pastSevenDays = getPastSevenDays();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* ================= HEADER ================= */}
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-gray-200"
        }`}
      >
        <div className="w-full px-5 md:px-8 py-4 flex items-center justify-between">
          {/* ================= LOGO ================= */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap size={25} strokeWidth={2.3} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-600">
                ILoveStudy
              </h1>

              <p className={`text-xs md:text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                Welcome back, {displayName}.
              </p>
            </div>
          </div>

          {/* ================= HEADER ACTIONS ================= */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* ================= STREAK BUTTON ================= */}
            <button
              onClick={() => setShowStreakModal(true)}
              title={
                streakData.isActiveToday
                  ? `${streakData.currentStreak} Day Streak – Active Today! ✨`
                  : `${streakData.currentStreak} Day Streak – Complete a test today to color your streak!`
              }
              className={`
                flex items-center gap-1.5
                h-9 px-3.5
                rounded-full border
                text-xs font-extrabold
                cursor-pointer
                shadow-sm hover:shadow-md
                hover:scale-105
                transition-all duration-200
                ${
                  streakData.isActiveToday
                    ? darkMode
                      ? "bg-orange-950/70 border-orange-800 text-orange-400 hover:bg-orange-900/80 shadow-orange-950/40"
                      : "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100 shadow-orange-100"
                    : darkMode
                    ? "bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700/80 grayscale opacity-80"
                    : "bg-gray-100/90 border-gray-200 text-gray-500 hover:bg-gray-200/70 grayscale opacity-80"
                }
              `}
            >
              <span className={streakData.isActiveToday ? "text-base animate-bounce" : "text-base opacity-60"}>
                🔥
              </span>
              <span>
                {streakData.currentStreak}
              </span>
            </button>

            {/* ================= THEME BUTTON ================= */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className={`
                h-10 w-10
                flex items-center justify-center
                rounded-full
                border
                transition-all
                duration-200
                ${
                  darkMode
                    ? "bg-slate-800 border-slate-700 text-yellow-300 hover:bg-slate-700"
                    : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100"
                }
              `}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* ================= PROFILE ================= */}
            <button
              onClick={() => router.push("/profile")}
              className="
                h-10
                px-4 md:px-5
                flex items-center gap-2
                bg-blue-600
                text-white
                rounded-full
                font-semibold
                text-sm
                shadow-sm
                hover:bg-blue-700
                hover:shadow-md
                transition-all
                duration-200
                focus:outline-none
              "
            >
              <User size={17} />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= STREAK MODAL ================= */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border transition-all ${
              darkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-900 border-orange-100"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                  <Flame size={26} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Study Streak Breakdown</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Keep learning every day!</p>
                </div>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Streak Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  darkMode ? "bg-orange-950/30 border-orange-900/50" : "bg-orange-50/80 border-orange-100"
                }`}
              >
                <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                  <Zap size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Current</span>
                </div>
                <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">
                  {streakData.currentStreak}
                </p>
                <span className="text-xs text-orange-500/80 font-medium mt-0.5">Days Active</span>
              </div>

              <div
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${
                  darkMode ? "bg-amber-950/30 border-amber-900/50" : "bg-amber-50/80 border-amber-100"
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-500 mb-1">
                  <Trophy size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Best Record</span>
                </div>
                <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {streakData.longestStreak}
                </p>
                <span className="text-xs text-amber-500/80 font-medium mt-0.5">Longest Streak</span>
              </div>
            </div>

            {/* Last 7 Days Activity Tracker */}
            <div
              className={`mb-5 p-4 rounded-2xl border ${
                darkMode ? "bg-slate-800/60 border-slate-700" : "bg-gray-50/80 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Calendar size={14} /> Last 7 Days
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Checked In Today
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center">
                {pastSevenDays.map((d, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold ${
                        d.isToday ? "text-orange-500" : "text-gray-400 dark:text-slate-500"
                      }`}
                    >
                      {d.dayName}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        d.isActive
                          ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                          : darkMode
                          ? "bg-slate-700 text-slate-500"
                          : "bg-gray-200/70 text-gray-400"
                      } ${d.isToday ? "ring-2 ring-orange-500 ring-offset-1 dark:ring-offset-slate-900" : ""}`}
                    >
                      {d.isActive ? <CheckCircle2 size={18} /> : <span className="text-xs font-medium">•</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-In Button */}
            <button
              onClick={handleManualCheckIn}
              disabled={checkingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>{checkingIn ? "Recording Check-In..." : "Check-In Completed ✨"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="flex-grow w-full px-4 md:px-8 lg:px-10 py-6 md:py-8">
        {/* ================= HERO ================= */}
        <section className="w-full mb-8 rounded-2xl overflow-hidden shadow-sm border border-blue-100 bg-[#f4f7fc]">
          <img
            src="/hero-study.png"
            alt="Start learning"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </section>

        {/* ================= EXAMS ================= */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Explore Exams</h2>
              <div className="mt-2 w-10 h-1 rounded-full bg-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            {exams.map((exam) => {
              const ExamIcon = exam.icon;

              const colorClasses: Record<
                string,
                { icon: string; badge: string; button: string }
              > = {
                blue: {
                  icon: "bg-blue-600 text-white shadow-blue-200",
                  badge: "bg-blue-50 text-blue-600 border-blue-100",
                  button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
                },

                purple: {
                  icon: "bg-purple-600 text-white shadow-purple-200",
                  badge: "bg-purple-50 text-purple-600 border-purple-100",
                  button: "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
                },

                green: {
                  icon: "bg-emerald-500 text-white shadow-emerald-200",
                  badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
                  button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200",
                },

                orange: {
                  icon: "bg-orange-500 text-white shadow-orange-200",
                  badge: "bg-orange-50 text-orange-600 border-orange-100",
                  button: "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
                },
              };

              const colors = colorClasses[exam.color] || colorClasses.blue;

              return (
                <div
                  key={exam.id}
                  onClick={() => router.push(exam.route)}
                  className="
                    group
                    w-full
                    bg-white
                    border border-gray-200
                    rounded-2xl
                    p-4 md:p-5
                    flex
                    items-center
                    justify-between
                    gap-4
                    cursor-pointer
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    hover:border-blue-200
                    transition-all
                    duration-200
                  "
                >
                  {/* Left */}
                  <div className="flex items-center gap-4 md:gap-5 min-w-0">
                    {/* Exam Icon */}
                    <div
                      className={`
                        shrink-0
                        w-12 h-12 md:w-14 md:h-14
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shadow-md
                        ${colors.icon}
                      `}
                    >
                      <ExamIcon size={25} strokeWidth={2} />
                    </div>

                    {/* Exam details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-md
                            border
                            text-[10px]
                            md:text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            ${colors.badge}
                          `}
                        >
                          {exam.category}
                        </span>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-slate-900 truncate">
                        {exam.name}
                      </h3>

                      <p className="hidden md:block mt-1 text-sm text-gray-500">
                        Previous year papers and exam preparation
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(exam.route);
                      }}
                      className={`
                        hidden sm:flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        text-white
                        text-sm
                        font-semibold
                        shadow-md
                        group-hover:shadow-lg
                        transition-all
                        ${colors.button}
                      `}
                    >
                      <span>Access Papers</span>
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>

                    {/* Mobile arrow */}
                    <div className="sm:hidden w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= BOTTOM MESSAGE ================= */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap size={21} />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Prepare smarter. Practice consistently.
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Choose an exam above to start practicing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


