"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProfile,
  updateProfile,
  fetchTestPerformance,
  EXAM_OPTIONS,
  type UserProfile,
  type PerformanceSummary,
  type TestAttemptItem,
} from "../../lib/profileApi";

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

  const [form, setForm] = useState({
    fullName: "",
    age: "",
    school: "",
    targetExam: "JEE Mains",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

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
      .catch(() => {
        setProfile({
          id: "",
          email: localStorage.getItem("userEmail") || "",
          fullName: localStorage.getItem("displayName") || "Student",
          targetExam: "JEE Mains",
          age: null,
          school: "",
          avatarUrl: null,
        });
      })
      .finally(() => setLoading(false));
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

  // Filter attempts by exam category
  const filteredAttempts = performance?.attempts.filter((item) => {
    if (selectedFilterExam === "All") return true;
    return item.examName.toLowerCase().includes(selectedFilterExam.toLowerCase());
  }) || [];

  // Calculate highest score in filtered view
  const highestScoreInFilter = filteredAttempts.reduce(
    (max, item) => (item.score > max ? item.score : max),
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1450px] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* =========================================================
            LEFT SIDEBAR
        ========================================================= */}
        <aside className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)]">

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

            <h1 className="mt-5 text-[22px] font-bold tracking-tight text-slate-900">
              {profile?.fullName || "Student"}
            </h1>

            <p className="mt-1 truncate text-sm text-slate-500">
              {profile?.email || "No email linked"}
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-slate-100" />

          {/* Quick information */}
          <div className="space-y-3 px-6 py-6">

            {/* Exam */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <TargetIcon />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Exam Focus
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                  {profile?.targetExam || "Not set"}
                </p>
              </div>
            </div>

            {/* Age */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <CalendarIcon />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Age
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  {profile?.age ?? "Not set"}
                </p>
              </div>
            </div>

            {/* School */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 transition hover:bg-slate-50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <SchoolIcon />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  School
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                  {profile?.school || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-6 pb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)] transition hover:bg-blue-700 hover:shadow-[0_8px_22px_rgba(37,99,235,0.3)]"
            >
              <EditIcon />
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-red-500 transition hover:border-red-100 hover:bg-red-50"
            >
              <LogoutIcon />
              Log Out
            </button>

            <button
              onClick={() => router.push("/pages/dashboard")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeftIcon />
              Back to Dashboard
            </button>
          </div>

          {/* Decorative bottom */}
          <div className="relative h-24 overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50">
            <div className="absolute -bottom-12 left-[-20px] h-28 w-40 rotate-[-8deg] rounded-[50%] bg-blue-100" />
            <div className="absolute -bottom-14 left-24 h-32 w-48 rotate-[8deg] rounded-[50%] bg-indigo-100" />
            <div className="absolute -bottom-16 right-[-30px] h-36 w-48 rotate-[-5deg] rounded-[50%] bg-blue-200/50" />
          </div>
        </aside>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <main className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white px-6 py-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-8 lg:px-10 lg:py-9 space-y-8">

          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              {/* Header icon */}
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                <UserIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
                  Profile & Performance Analytics
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {isEditing ? "Edit your profile" : "Student Dashboard & Test History"}
                </h2>

                <p className="mt-1.5 text-sm text-slate-500">
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
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
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
              {/* READ MODE: PROFILE CARDS */}
              <div className="grid gap-5 md:grid-cols-2">
                <ProfileCard
                  icon={<UserIcon />}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                  label="Full Name"
                  value={profile?.fullName || "Not available"}
                />

                <ProfileCard
                  icon={<CalendarIcon />}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                  label="Age"
                  value={profile?.age != null ? String(profile.age) : "Not set"}
                />

                <ProfileCard
                  icon={<BookIcon />}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  label="Exam Focus"
                  value={profile?.targetExam || "Not set"}
                />

                <ProfileCard
                  icon={<SchoolIcon />}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                  label="School / College"
                  value={profile?.school || "Not set"}
                />
              </div>

              {/* =========================================================
                  TEST PERFORMANCE & HIGHEST MARKS SECTION
              ========================================================= */}
              <div className="space-y-6 pt-4 border-t border-slate-100">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <TrophyIcon className="text-amber-500" />
                      Test Performance & High Scores
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Historical results, peak score records, and exam-by-exam analytics.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/60">
                    {["All", "JEE Main", "JEE Advanced", "NEET"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedFilterExam(tab)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                          selectedFilterExam === tab
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
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
                  <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                        Max Score Achieved
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                        🏆
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900">
                      {performance?.overallMaxScore || 0}{" "}
                      <span className="text-xs font-semibold text-slate-400">/ 300</span>
                    </p>
                    <p className="mt-1 text-xs text-amber-700 font-medium">
                      {performance?.overallMaxScore 
                        ? `Highest score till now across attempts`
                        : "No test records yet"}
                    </p>
                  </div>

                  {/* 2. Total Tests Attended */}
                  <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                        Tests Attended
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                        📝
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900">
                      {performance?.totalTestsTaken || 0}
                    </p>
                    <p className="mt-1 text-xs text-blue-700 font-medium">
                      Completed test attempts
                    </p>
                  </div>

                  {/* 3. Average Accuracy */}
                  <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        Average Accuracy
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                        🎯
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-black text-slate-900">
                      {performance?.averagePercentage || 0}%
                    </p>
                    <p className="mt-1 text-xs text-emerald-700 font-medium">
                      Overall average score rate
                    </p>
                  </div>

                  {/* 4. Exam Breakdown Record */}
                  <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                        Target Exam Peak
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 font-bold">
                        ⚡
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-slate-900 truncate">
                      {profile?.targetExam || "JEE Mains"}
                    </p>
                    <p className="mt-1 text-xs text-purple-700 font-medium">
                      Peak: {performance?.highestScoresByExam[profile?.targetExam || "JEE Main"]?.score || 0} pts
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

                      {/* Tooltip display box if hovering */}
                      <div className="h-10 flex items-center justify-between bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs">
                        {hoveredAttempt ? (
                          <>
                            <span className="font-bold text-indigo-300">
                              {hoveredAttempt.shiftName} ({hoveredAttempt.examName})
                            </span>
                            <span className="text-slate-300">
                              Score: <strong className="text-emerald-400">{hoveredAttempt.score}</strong> / {hoveredAttempt.maxMarks} ({hoveredAttempt.percentage}%)
                            </span>
                            <span className="text-slate-400">
                              Correct: {hoveredAttempt.correctCount} | Wrong: {hoveredAttempt.incorrectCount}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400 italic">
                            Hover over any bar in the graph to see detailed attempt metrics
                          </span>
                        )}
                      </div>

                      {/* Visual Bar Chart */}
                      <div className="relative h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 px-4 border-b border-l border-slate-800">

                        {/* Benchmark High-Water Line */}
                        <div 
                          className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400/70 z-10 transition-all"
                          style={{
                            bottom: `${Math.min(100, Math.max(10, (highestScoreInFilter / 300) * 100))}%`
                          }}
                        >
                          <span className="absolute right-2 -top-5 text-[10px] font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-amber-400/30">
                            PEAK: {highestScoreInFilter} PTS
                          </span>
                        </div>

                        {filteredAttempts.map((item, idx) => {
                          const barHeight = Math.max(12, item.percentage);
                          return (
                            <div
                              key={item.id || idx}
                              onMouseEnter={() => setHoveredAttempt(item)}
                              onMouseLeave={() => setHoveredAttempt(null)}
                              className="group flex-1 flex flex-col items-center h-full justify-end cursor-pointer relative"
                            >
                              <div
                                style={{ height: `${barHeight}%` }}
                                className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-indigo-600 via-blue-500 to-emerald-400 transition-all duration-300 group-hover:brightness-125 group-hover:scale-105 shadow-lg shadow-indigo-500/20"
                              />
                              <span className="mt-2 text-[10px] text-slate-400 truncate max-w-[50px] font-mono">
                                #{idx + 1}
                              </span>
                            </div>
                          );
                        })}
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
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Attend JEE Main, JEE Advanced, or NEET test shifts from the workspace to record your performance graph here!
                      </p>
                    </div>
                  )}

                </div>

                {/* DETAILED TEST ATTEMPTS HISTORY TABLE */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Test Attendance History ({filteredAttempts.length})
                    </h4>
                    <button
                      onClick={() => router.push("/pages/dashboard/jee-mains")}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                      + Attend New Test
                    </button>
                  </div>

                  {filteredAttempts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-3">Test Name / Shift</th>
                            <th className="px-6 py-3">Exam Type</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Score / Max</th>
                            <th className="px-6 py-3">Accuracy %</th>
                            <th className="px-6 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredAttempts.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-6 py-4 font-bold text-slate-900">
                                {item.shiftName}
                              </td>
                              <td className="px-6 py-4">
                                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                                  {item.examName}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-slate-500">
                                {new Date(item.submittedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-6 py-4 font-extrabold text-slate-900">
                                {item.score} <span className="text-slate-400 font-normal">/ {item.maxMarks}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                                    item.percentage >= 70
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
                                  onClick={() => router.push("/pages/dashboard/jee-mains")}
                                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                >
                                  Re-attempt &rarr;
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
            </>
          )}
        </main>
      </div>
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