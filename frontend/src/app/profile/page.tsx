"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProfile,
  updateProfile,
  EXAM_OPTIONS,
  type UserProfile,
} from "../../lib/profileApi";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    fetchProfile()
      .then((data) => {
        setProfile(data);

        setForm({
          fullName: data.fullName,
          age: data.age != null ? String(data.age) : "",
          school: data.school || "",
          targetExam: data.targetExam || "JEE Mains",
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
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <main className="min-w-0 rounded-[28px] border border-slate-200/80 bg-white px-6 py-7 shadow-[0_10px_40px_rgba(15,23,42,0.06)] sm:px-8 lg:px-10 lg:py-9">

          {/* Header */}
          <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              {/* Header icon */}
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:flex">
                <UserIcon />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-500">
                  Profile Settings
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                  {isEditing ? "Edit your profile" : "Profile Summary"}
                </h2>

                <p className="mt-1.5 text-sm text-slate-500">
                  {isEditing
                    ? "Update your personal and academic information."
                    : "View your personal and academic details."}
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
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              <ErrorIcon />
              <span>{error}</span>
            </div>
          )}

          {/* =====================================================
              EDIT MODE
          ===================================================== */}
          {isEditing ? (
            <form
              className="mt-8"
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
              {/* =================================================
                  PROFILE CARDS
              ================================================== */}
              <div className="mt-8 grid gap-5 md:grid-cols-2">

                {/* Name */}
                <ProfileCard
                  icon={<UserIcon />}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-600"
                  label="Full Name"
                  value={profile?.fullName || "Not available"}
                />

                {/* Age */}
                <ProfileCard
                  icon={<CalendarIcon />}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-600"
                  label="Age"
                  value={profile?.age != null ? String(profile.age) : "Not set"}
                />

                {/* Exam */}
                <ProfileCard
                  icon={<BookIcon />}
                  iconBg="bg-violet-50"
                  iconColor="text-violet-600"
                  label="Exam Focus"
                  value={profile?.targetExam || "Not set"}
                />

                {/* School */}
                <ProfileCard
                  icon={<SchoolIcon />}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                  label="School / College"
                  value={profile?.school || "Not set"}
                />
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
                      Your profile information is used to personalize your
                      learning experience.
                    </p>
                  </div>
                </div>

                {/* Decorative circles */}
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
   PROFILE CARD
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

/* ===============================================================
   ICONS
================================================================ */

function UserIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function UserSmallIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v9h14v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M3 19h18" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 5.5v16" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}