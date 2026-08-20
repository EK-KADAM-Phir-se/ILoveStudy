"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import NavBar from "../../components/NavBar";

const TestReviewModal = dynamic(() => import("@/src/components/TestReviewModal"), {
  ssr: false,
});
import {
  fetchProfile,
  updateProfile,
  fetchTestPerformance,
  EXAM_OPTIONS,
  type UserProfile,
  type PerformanceSummary,
  type TestAttemptItem,
} from "../../lib/profileApi";
import { MyErrorReports } from "../../components/MyErrorReports";

import { isGuestUser, clearGuestMode } from "@/src/lib/authUtils";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedFilterExam, setSelectedFilterExam] = useState<string>("All");
  const [hoveredAttempt, setHoveredAttempt] = useState<TestAttemptItem | null>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    school: "",
    targetExam: "JEE Mains",
  });

  const normalizeExamName = (name: string = "") => {
  const value = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();

  // Keep JEE Main and JEE Advanced completely separate
  if (value === "jee" || value === "jeemain" || value === "jeemains") {
    return "jee-main";
  }

  if (value === "jeeadvanced") {
    return "jee-advanced";
  }

  if (value === "neet") {
    return "neet";
  }

  if (value === "ssc") {
    return "ssc";
  }

  if (value === "upsc") {
    return "upsc";
  }

  if (value === "gate") {
    return "gate";
  }

  return value;
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isGuest = isGuestUser();

    if (!token && !isGuest) {
      router.push("/login");
      return;
    }

    if (isGuest) {
      setProfile({
        id: "guest",
        email: "guest@ilovestudy.explore",
        fullName: "Guest Explorer",
        targetExam: "JEE Mains",
        age: null,
        school: "Website Tour Mode",
        avatarUrl: null,
      });
      setForm({
        fullName: "Guest Explorer",
        age: "",
        school: "Website Tour Mode",
        targetExam: "JEE Mains",
      });
      setLoading(false);
      return;
    }

    const cachedEmail = localStorage.getItem("userEmail") || "";
    const cachedName = localStorage.getItem("displayName") || "Student";
    
    setProfile((prev) => prev || {
      id: "",
      email: cachedEmail,
      fullName: cachedName,
      targetExam: "JEE Mains",
      age: null,
      school: "",
      avatarUrl: null,
    });
    setForm((prev) => ({
      ...prev,
      fullName: cachedName,
    }));
    setLoading(false);

    Promise.all([fetchProfile(), fetchTestPerformance()])
      .then(([profData, perfData]) => {
        setProfile(profData);
        setPerformance(perfData);

        setForm({
          fullName: profData.fullName,
          age: profData.age != null ? String(profData.age) : "",
          school: profData.school || "",
          targetExam: profData.targetExam || "JEE Mains",
        });
      })
      .catch((err) => {
        console.warn("Error loading profile or performance data:", err);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("backendToken");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userEmail");

    router.push("/login");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const updated = await updateProfile({
        fullName: form.fullName,
        age: form.age === "" ? null : parseInt(form.age, 10),
        school: form.school,
        targetExam: form.targetExam,
      });

      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // Dynamically generate filter tabs (includes default exams plus any attended exams like SSC, UPSC, GATE etc.)
  const dynamicFilterTabs = React.useMemo(() => {
    const baseTabs = ["All", "JEE Main", "JEE Advanced", "NEET"];
    const extraExams: string[] = [];

    const normBase = baseTabs.map((t) => t.toLowerCase().replace(/s$/, "").trim());

    if (performance?.attempts) {
      performance.attempts.forEach((item) => {
        const name = item.examName?.trim();
        if (!name) return;
        const norm = name.toLowerCase().replace(/s$/, "").trim();
        if (
          !normBase.includes(norm) &&
          !extraExams.some((e) => e.toLowerCase().replace(/s$/, "").trim() === norm)
        ) {
          extraExams.push(name);
        }
      });
    }

    if (performance?.highestScoresByExam) {
      Object.keys(performance.highestScoresByExam).forEach((key) => {
        const name = key.trim();
        if (!name) return;
        const norm = name.toLowerCase().replace(/s$/, "").trim();
        if (
          !normBase.includes(norm) &&
          !extraExams.some((e) => e.toLowerCase().replace(/s$/, "").trim() === norm)
        ) {
          extraExams.push(name);
        }
      });
    }

    return [...baseTabs, ...extraExams];
  }, [performance]);

  // Filter attempts strictly by selected exam
  const filteredAttempts = React.useMemo(() => {
    if (!performance?.attempts) return [];

    if (selectedFilterExam === "All") {
      return performance.attempts;
    }

    const selectedExam = normalizeExamName(selectedFilterExam);

    return performance.attempts.filter((item) => {
      return normalizeExamName(item.examName) === selectedExam;
    });
  }, [performance, selectedFilterExam]);

  // Calculate highest score & max marks in filtered view
  const highestScoreInFilter = React.useMemo(() => {
    if (filteredAttempts.length === 0) return 0;
    return Math.max(...filteredAttempts.map((item) => item.score));
  }, [filteredAttempts]);

  const maxMarksInFilter = React.useMemo(() => {
    if (filteredAttempts.length === 0) return 300;
    return Math.max(...filteredAttempts.map((item) => item.maxMarks || 300));
  }, [filteredAttempts]);

  // Summary Metrics per Filter tab selection
  const cardMaxScore = selectedFilterExam === "All"
    ? (performance?.overallMaxScore || 0)
    : highestScoreInFilter;

  const cardMaxMarks = selectedFilterExam === "All"
    ? (performance?.attempts && performance.attempts.length > 0
      ? Math.max(...performance.attempts.map((a) => a.maxMarks || 300))
      : 300)
    : maxMarksInFilter;

  const cardTotalTests = selectedFilterExam === "All"
    ? (performance?.totalTestsTaken || 0)
    : filteredAttempts.length;

  const cardAverageAccuracy = React.useMemo(() => {
    if (selectedFilterExam === "All") {
      return performance?.averagePercentage || 0;
    }
    if (filteredAttempts.length === 0) return 0;
    const totalPct = filteredAttempts.reduce((sum, item) => sum + item.percentage, 0);
    return parseFloat((totalPct / filteredAttempts.length).toFixed(1));
  }, [performance, selectedFilterExam, filteredAttempts]);

  // Helper to find peak score for any target/selected exam name
  const getExamPeakScore = (examName: string) => {
    if (!performance?.attempts || performance.attempts.length === 0) {
      if (performance?.highestScoresByExam?.[examName]) {
        return performance.highestScoresByExam[examName].score || 0;
      }
      return 0;
    }

    const normTarget = examName.toLowerCase().replace(/s$/, "").trim();
    const matching = performance.attempts.filter((item) => {
      const normExam = (item.examName || "").toLowerCase().replace(/s$/, "").trim();
      return normExam.includes(normTarget) || normTarget.includes(normExam);
    });

    if (matching.length > 0) {
      return Math.max(...matching.map((item) => item.score));
    }

    if (performance?.highestScoresByExam) {
      for (const [key, val] of Object.entries(performance.highestScoresByExam)) {
        const normKey = key.toLowerCase().replace(/s$/, "").trim();
        if (normKey.includes(normTarget) || normTarget.includes(normKey)) {
          return val.score || 0;
        }
      }
    }

    return 0;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc]">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">
              Loading profile & performance data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <NavBar />
      <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* =========================================================
            LEFT SIDEBAR
        ========================================================= */}
        <aside className="h-fit self-start relative overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

          {/* Top profile */}
          <div className="px-6 pb-6 pt-8 text-center">

            {/* Avatar */}
            <div className="relative mx-auto h-24 w-24">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Profile avatar"
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold uppercase text-white shadow-lg">
                  {(profile?.fullName || "S").charAt(0)}
                </div>
              )}

              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" />
            </div>

            <h1 className="mt-5 text-[22px] font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {profile?.fullName || "Student"}
            </h1>

            <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
              {profile?.email || "No email linked"}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-slate-100 dark:border-slate-800" />

          {/* Quick information */}
          <div className="space-y-3 px-6 py-6">

            {/* Exam */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <TargetIcon />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Exam Focus
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.targetExam || "Not set"}
                </p>
              </div>
            </div>

            {/* Age */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <CalendarIcon />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Age
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.age ?? "Not set"}
                </p>
              </div>
            </div>

            {/* School */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-3.5 transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                <SchoolIcon />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  School / College
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {profile?.school || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 hover:shadow-[0_8px_22px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              <EditIcon />
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-4 py-3.5 text-sm font-semibold text-red-500 transition hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
            >
              <LogoutIcon />
              Log Out
            </button>

            <button
              onClick={() => router.push("/pages/dashboard")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 dark:bg-slate-800 border border-transparent dark:border-slate-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
            >
              <ArrowLeftIcon />
              Back to Dashboard
            </button>
          </div>
        </aside>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <main className="min-w-0 rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-8 lg:px-10 lg:py-9 space-y-8 transition-colors">

          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-slate-100 dark:border-slate-800 pb-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              {/* Header icon */}
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 sm:flex">
                <UserIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500 dark:text-blue-400">
                  Profile & Performance Analytics
                </p>

                <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {isEditing ? "Edit your profile" : "Student Dashboard & Test History"}
                </h2>

                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  {isEditing
                    ? "Update your personal and academic information."
                    : "Track your test results, maximum marks achieved, and performance progression graph."}
                </p>
              </div>
            </div>

            {/* Edit button / status */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                <EditIcon />
                Edit Profile
              </button>
            ) : (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Editing
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          {/* EDIT MODE */}
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <UserSmallIcon />
                    </div>

                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Age
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <CalendarIcon />
                    </div>

                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={form.age}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          age: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                {/* Exam */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Exam Preparing For
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <BookIcon />
                    </div>

                    <select
                      value={form.targetExam}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          targetExam: e.target.value,
                        })
                      }
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                    >
                      {EXAM_OPTIONS.map((exam) => (
                        <option key={exam} value={exam}>
                          {exam}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronIcon />
                    </div>
                  </div>
                </div>

                {/* School */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    School / College
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <SchoolIcon />
                    </div>

                    <input
                      type="text"
                      value={form.school}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          school: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                      placeholder="Enter your school or college"
                    />
                  </div>
                </div>
              </div>

              {/* Form buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Error Reports History Section */}
              <MyErrorReports />

              {/* =========================================================
                  TEST PERFORMANCE & HIGHEST MARKS SECTION
              ========================================================= */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <TrophyIcon className="text-amber-500" />
                      Test Performance & High Scores
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Historical results, peak score records, and exam-by-exam analytics.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-1.5 border border-slate-200/60 dark:border-slate-700">
                    {dynamicFilterTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedFilterExam(tab)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${selectedFilterExam === tab
                            ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PERFORMANCE HIGHLIGHT CARDS */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* 1. Maximum Score Card */}
                  <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 dark:from-amber-950/30 dark:via-slate-800 dark:to-amber-950/20 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Max Score Achieved
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 font-bold">
                        🏆
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
                      {cardMaxScore}{" "}
                      <span className="text-xs font-semibold text-slate-400">/ {cardMaxMarks}</span>
                    </p>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400 font-medium">
                      {selectedFilterExam === "All"
                        ? (cardMaxScore > 0 ? "Highest score till now across attempts" : "No test records yet")
                        : (filteredAttempts.length > 0 ? `Highest score in ${selectedFilterExam}` : `No ${selectedFilterExam} records yet`)}
                    </p>
                  </div>

                  {/* 2. Total Tests Attended */}
                  <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 dark:from-blue-950/30 dark:via-slate-800 dark:to-blue-950/20 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        Tests Attended
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 font-bold">
                        📝
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
                      {cardTotalTests}
                    </p>
                    <p className="mt-1 text-xs text-blue-700 dark:text-blue-400 font-medium">
                      {selectedFilterExam === "All" ? "Completed test attempts" : `Completed ${selectedFilterExam} attempts`}
                    </p>
                  </div>

                  {/* 3. Average Accuracy */}
                  <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-slate-800 dark:to-emerald-950/20 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                        Average Accuracy
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 font-bold">
                        🎯
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900 dark:text-slate-100">
                      {cardAverageAccuracy}%
                    </p>
                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {selectedFilterExam === "All" ? "Overall average score rate" : `${selectedFilterExam} average score rate`}
                    </p>
                  </div>

                  {/* 4. Exam Breakdown Record */}
                  <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 dark:from-purple-950/30 dark:via-slate-800 dark:to-purple-950/20 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                        {selectedFilterExam === "All" ? "Target Exam Peak" : `${selectedFilterExam} Peak`}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 font-bold">
                        ⚡
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                      {selectedFilterExam === "All" ? (profile?.targetExam || "JEE Mains") : selectedFilterExam}
                    </p>
                    <p className="mt-1 text-xs text-purple-700 dark:text-purple-400 font-medium">
                      Peak: {getExamPeakScore(selectedFilterExam === "All" ? (profile?.targetExam || "JEE Mains") : selectedFilterExam)} pts
                    </p>
                  </div>
                </div>

                {/* PERFORMANCE GRAPH SECTION */}
                <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-6 shadow-xl relative overflow-hidden">

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                        <h4 className="text-base font-bold tracking-wide uppercase text-indigo-300">
                          Score Progression Graph
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Visual trend of test scores across attempts over time
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                        Score (%)
                      </span>
                      <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <span className="h-0.5 w-4 bg-amber-400"></span>
                        Max Record ({highestScoreInFilter} pts)
                      </span>
                    </div>
                  </div>

                  {/* GRAPH DISPLAY */}
                  {filteredAttempts.length > 0 ? (
                    <div className="space-y-4 pt-4">

                      {/* Selected exam information */}
                      {/* Selected exam information */}
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-white">
                            {selectedFilterExam === "All"
                              ? "All Exams"
                              : `${selectedFilterExam} Performance`}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {filteredAttempts.length} test
                            {filteredAttempts.length !== 1 ? "s" : ""} recorded
                          </p>
                        </div>

                        <div className="flex items-center gap-5 text-xs">
                          <span className="text-slate-400">
                            Average:
                            <strong className="ml-1 text-emerald-400">
                              {cardAverageAccuracy}%
                            </strong>
                          </span>

                          <span className="text-slate-400 flex items-center gap-1">
                            Peak:
                            {(() => {
                              const score = highestScoreInFilter;
                              const max = maxMarksInFilter || 300;
                              const pct = score / max;
                              let color = "text-slate-400";
                              if (pct >= 0.8) color = "text-red-500";
                              else if (pct >= 0.55) color = "text-amber-500";
                              else if (pct >= 0.45) color = "text-fuchsia-400";
                              else if (pct >= 0.3) color = "text-blue-400";
                              else if (pct >= 0.2) color = "text-cyan-400";
                              else if (pct >= 0.1) color = "text-emerald-400";
                              return (
                                <strong className={`ml-1 font-bold ${color}`}>
                                  {score}/{max}
                                </strong>
                              );
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* LINE GRAPH */}
                      <div className="relative h-[330px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#080f23] px-2 pt-5 sm:px-4">

                        {(() => {
                          const chartAttempts = filteredAttempts;

                          const chartWidth = 1000;
                          const chartHeight = 250;

                          const maxMarks =
                            Math.max(
                              ...chartAttempts.map((item) => item.maxMarks || 300),
                              300
                            );

                          const yMin = 15.15;
                          const yMax = 219.7;

                          // Helper to get hex colors for score percentages
                          const getScoreHexColor = (score: number, max: number) => {
                            const pct = score / (max || 300);
                            if (pct >= 0.8) return "#ff3333"; // Red
                            if (pct >= 0.7) return "#ff7777"; // Light red
                            if (pct >= 0.65) return "#ffbb55"; // Orange
                            if (pct >= 0.55) return "#ffcc88"; // Master orange/yellow
                            if (pct >= 0.45) return "#e040fb"; // Candidate Master purple
                            if (pct >= 0.3) return "#4a90e2"; // Expert blue
                            if (pct >= 0.2) return "#26a69a"; // Specialist teal
                            if (pct >= 0.1) return "#9ccc65"; // Pupil green
                            return "#b0bec5"; // Newbie grey
                          };

                          const points = chartAttempts.map((item, index) => {
                            const x =
                              chartAttempts.length === 1
                                ? chartWidth / 2
                                : (index / (chartAttempts.length - 1)) *
                                (chartWidth - 40) +
                                20;

                            const y = yMax - (item.score / maxMarks) * (yMax - yMin);
                            const hexColor = getScoreHexColor(item.score, item.maxMarks);

                            return {
                              x,
                              y,
                              item,
                              index,
                              hexColor
                            };
                          });

                          const highestScore = Math.max(
                            ...chartAttempts.map((item) => item.score)
                          );

                          const linePath = points
                            .map(
                              (point, index) =>
                                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
                            )
                            .join(" ");

                          const areaPath = `
                            ${linePath}
                            L ${points[points.length - 1].x} ${chartHeight}
                            L ${points[0].x} ${chartHeight}
                            Z
                          `;

                          // Rating bands definitions matching the Codeforces graph colors exactly, scaled to score percentages
                          const ratingBands = [
                            { min: 0.8, max: 1.0, color: "#e74c3c" }, // Red
                            { min: 0.7, max: 0.8, color: "#ff7777" }, // Light red
                            { min: 0.65, max: 0.7, color: "#ffbb55" }, // Orange
                            { min: 0.55, max: 0.65, color: "#f39c12" }, // Master yellow
                            { min: 0.45, max: 0.55, color: "#e040fb" }, // Candidate Master purple
                            { min: 0.3, max: 0.45, color: "#4a90e2" }, // Expert blue
                            { min: 0.2, max: 0.3, color: "#26a69a" }, // Specialist teal
                            { min: 0.1, max: 0.2, color: "#9ccc65" }, // Pupil green
                            { min: 0.0, max: 0.1, color: "#b0bec5" }, // Newbie grey
                          ];

                          const divisionPcts = [0.1, 0.2, 0.3, 0.45, 0.55, 0.65, 0.7, 0.8, 1.0];

                          return (
                            <>
                              {/* Background color bands */}
                              <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
                                {ratingBands.map((band, idx) => {
                                  const topPct = 100 - band.max * 100;
                                  const bottomPct = 100 - band.min * 100;
                                  return (
                                    <div
                                      key={idx}
                                      className="absolute left-0 right-0"
                                      style={{
                                        top: `${(topPct * 270) / 330 + (20 * 100) / 330}%`,
                                        height: `${((bottomPct - topPct) * 270) / 330}%`,
                                        backgroundColor: band.color,
                                      }}
                                    />
                                  );
                                })}
                              </div>

                              {/* Grid lines and score ticks based on maxMarks */}
                              <div className="pointer-events-none absolute inset-x-4 top-[20px] bottom-[40px]">
                                {divisionPcts.map((pct) => {
                                  const rating = Math.round(pct * maxMarks);
                                  const pctPosition = pct * 100;
                                  // Get label color corresponding to the bracket
                                  let labelColor = "text-slate-400";
                                  if (pct >= 0.8) labelColor = "text-red-500";
                                  else if (pct >= 0.55) labelColor = "text-amber-500 font-semibold";
                                  else if (pct >= 0.45) labelColor = "text-fuchsia-400";
                                  else if (pct >= 0.3) labelColor = "text-blue-400";
                                  else if (pct >= 0.2) labelColor = "text-cyan-400";
                                  else if (pct >= 0.1) labelColor = "text-emerald-400";

                                  return (
                                    <div
                                      key={pct}
                                      className="absolute left-0 right-0 flex items-center gap-2 -translate-y-1/2"
                                      style={{ bottom: `${pctPosition}%` }}
                                    >
                                      <span className={`w-8 text-right text-[10px] font-bold ${labelColor}`}>
                                        {rating}
                                      </span>

                                      <div className="h-px flex-1 border-t border-dashed border-slate-800/80" />
                                    </div>
                                  );
                                })}
                              </div>

                              {/* SVG Chart */}
                              <svg
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                className="relative z-10 h-full w-full overflow-visible"
                                preserveAspectRatio="none"
                              >
                                {/* Gradient */}
                                <defs>
                                  <linearGradient
                                    id="scoreAreaGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#e5c158"
                                      stopOpacity="0.25"
                                    />

                                    <stop
                                      offset="100%"
                                      stopColor="#e5c158"
                                      stopOpacity="0"
                                    />
                                  </linearGradient>
                                </defs>

                                {/* Max score line */}
                                <line
                                  x1="20"
                                  x2={chartWidth - 20}
                                  y1={yMax - (highestScore / maxMarks) * (yMax - yMin)}
                                  y2={yMax - (highestScore / maxMarks) * (yMax - yMin)}
                                  stroke="#fbbf24"
                                  strokeWidth="1.5"
                                  strokeDasharray="7 6"
                                  opacity="0.8"
                                />

                                {/* Peak label */}
                                <text
                                  x={chartWidth - 25}
                                  y={yMax - (highestScore / maxMarks) * (yMax - yMin) - 8}
                                  textAnchor="end"
                                  fill="#fbbf24"
                                  fontSize="11"
                                  fontWeight="700"
                                >
                                  PEAK {highestScore}
                                </text>

                                {/* Area */}
                                <path
                                  d={areaPath}
                                  fill="url(#scoreAreaGradient)"
                                />

                                {/* Main score line - Codeforces styled */}
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke="#e5c158"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Attempts */}
                                {points.map((point) => (
                                  <g key={point.item.id || point.index}>
                                    <circle
                                      cx={point.x}
                                      cy={point.y}
                                      r="6"
                                      fill={point.hexColor}
                                      stroke="#ffffff"
                                      strokeWidth="2"
                                      className="cursor-pointer transition-all duration-200 hover:r-8"
                                      onMouseEnter={() =>
                                        setHoveredAttempt(point.item)
                                      }
                                      onMouseLeave={() =>
                                        setHoveredAttempt(null)
                                      }
                                    />

                                    {/* Show score labels only for important points */}
                                    {(point.index === 0 ||
                                      point.index === chartAttempts.length - 1 ||
                                      point.item.score === highestScore) && (
                                        <text
                                          x={point.x}
                                          y={point.y - 12}
                                          textAnchor="middle"
                                          fill={point.hexColor}
                                          fontSize="11"
                                          fontWeight="700"
                                        >
                                          {point.item.score}
                                        </text>
                                      )}
                                  </g>
                                ))}
                              </svg>

                              {/* X-axis labels */}
                              <div className="absolute bottom-1 left-12 right-5 flex justify-between text-[10px] text-slate-500">
                                {chartAttempts.length <= 10 ? (
                                  chartAttempts.map((_, index) => (
                                    <span key={index}>
                                      #{index + 1}
                                    </span>
                                  ))
                                ) : (
                                  <>
                                    <span>#1</span>

                                    <span>
                                      #{Math.floor(chartAttempts.length * 0.25)}
                                    </span>

                                    <span>
                                      #{Math.floor(chartAttempts.length * 0.5)}
                                    </span>

                                    <span>
                                      #{Math.floor(chartAttempts.length * 0.75)}
                                    </span>

                                    <span>
                                      #{chartAttempts.length}
                                    </span>
                                  </>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Hover details */}
                      <div className="min-h-[42px] rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs">
                        {hoveredAttempt ? (
                          (() => {
                            const score = hoveredAttempt.score;
                            const max = hoveredAttempt.maxMarks || 300;
                            const pct = score / max;
                            let scoreColor = "text-slate-400";
                            if (pct >= 0.8) scoreColor = "text-red-500";
                            else if (pct >= 0.55) scoreColor = "text-amber-500";
                            else if (pct >= 0.45) scoreColor = "text-fuchsia-400";
                            else if (pct >= 0.3) scoreColor = "text-blue-400";
                            else if (pct >= 0.2) scoreColor = "text-cyan-400";
                            else if (pct >= 0.1) scoreColor = "text-emerald-400";

                            return (
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="font-bold text-indigo-300">
                                  {hoveredAttempt.shiftName}
                                </span>

                                <span className="text-slate-300">
                                  Score:
                                  <strong className={`ml-1 font-bold ${scoreColor}`}>
                                    {score}
                                  </strong>
                                  {" / "}
                                  {max}
                                </span>

                                <span className="text-slate-300">
                                  Accuracy:
                                  <strong className="ml-1 text-blue-400">
                                    {hoveredAttempt.percentage}%
                                  </strong>
                                </span>

                                <span className="text-slate-400">
                                  Correct: {hoveredAttempt.correctCount}
                                  {" | "}
                                  Wrong: {hoveredAttempt.incorrectCount}
                                </span>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">
                              Hover over a point to see test details
                            </span>

                            <span className="hidden text-slate-500 sm:block">
                              {selectedFilterExam === "All"
                                ? "Showing all exams"
                                : `Showing only ${selectedFilterExam}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl text-slate-400">
                        📊
                      </div>

                      <p className="text-sm font-semibold text-slate-300">
                        No test attempts recorded for {selectedFilterExam}.
                      </p>

                      <p className="mx-auto max-w-sm text-xs text-slate-500">
                        Attend a {selectedFilterExam} test from the workspace to
                        start tracking your performance here.
                      </p>
                    </div>
                  )}

                  {/* DETAILED TEST ATTEMPTS HISTORY TABLE */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        Test Attendance History ({filteredAttempts.length})
                      </h4>
                      <button
                        onClick={() => router.push("/pages/dashboard/jee-mains")}
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition cursor-pointer"
                      >
                        + Attend New Test
                      </button>
                    </div>

                    {filteredAttempts.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                              <th className="px-6 py-3">Test Name / Shift</th>
                              <th className="px-6 py-3">Exam Type</th>
                              <th className="px-6 py-3">Date</th>
                              <th className="px-6 py-3">Score / Max</th>
                              <th className="px-6 py-3">Accuracy %</th>
                              <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                            {filteredAttempts.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                                  {item.shiftName}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                    {item.examName}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                  {new Date(item.submittedAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </td>
                                <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-slate-100">
                                  {item.score} <span className="text-slate-400 font-normal">/ {item.maxMarks}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${item.percentage >= 70
                                        ? "bg-emerald-50 text-emerald-600"
                                        : item.percentage >= 40
                                          ? "bg-amber-50 text-amber-600"
                                          : "bg-rose-50 text-rose-600"
                                      }`}
                                  >
                                    {item.percentage}%
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => setReviewAttemptId(item.id)}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                                  >
                                    Review &rarr;
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No test history found. Attend an exam from the dashboard to start tracking!
                      </div>
                    )}
                  </div>

                </div>

                {/* Security / information banner */}
                <div className="relative mt-7 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6">
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                      <ShieldIcon />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Your information is secure
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Your profile and performance analytics are encrypted and personalized for your learning journey.
                      </p>
                    </div>
                  </div>

                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100/60" />
                  <div className="absolute -bottom-12 right-16 h-24 w-24 rounded-full bg-indigo-100/60" />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      </div>

      {reviewAttemptId && (
        <TestReviewModal
          attemptId={reviewAttemptId}
          onClose={() => setReviewAttemptId(null)}
        />
      )}
    </div>
  );
}

/* ===============================================================
   HELPER COMPONENTS & ICONS
================================================================ */

function ProfileCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_5px_20px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 truncate text-lg font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </article>
  );
}

function UserIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function UserSmallIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v9h14v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M3 19h18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 5.5v16" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TrophyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}