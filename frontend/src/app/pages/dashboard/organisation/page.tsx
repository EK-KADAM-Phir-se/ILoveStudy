"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import {
  Building2, KeyRound, ArrowRight, ShieldCheck, Clock,
  Award, Sparkles, CheckCircle2, AlertCircle, Users,
  GraduationCap, HelpCircle, Lock, UserCheck
} from "lucide-react";
import { verifyStudentAccessCode, checkAdminAccess, StudentVerifyResponse } from "@/src/lib/orgApi";
import { fetchProfile } from "@/src/lib/profileApi";

export default function OrganisationStudentPage() {
  const router = useRouter();

  const [accessCode, setAccessCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedTest, setVerifiedTest] = useState<StudentVerifyResponse["test"] | null>(null);

  useEffect(() => {
    const verifyUserAdmin = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail") || "";
        const profile = await fetchProfile().catch(() => null);
        const activeEmail = profile?.email || storedEmail;
        if (activeEmail) setUserEmail(activeEmail);

        const res = await checkAdminAccess(activeEmail);
        if (res.isAdmin) {
          setIsAdmin(true);
          sessionStorage.setItem("org_admin_auth", "true");
        }
      } catch (err) {
        console.warn("Admin check warning:", err);
      }
    };

    verifyUserAdmin();
  }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setError("Please enter your examination access code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await verifyStudentAccessCode(accessCode.trim());
      if (res.valid && res.test) {
        setVerifiedTest(res.test);
      } else {
        setError("Invalid test code or test is currently not available.");
      }
    } catch (err: any) {
      console.error("Code verification failed:", err);
      setError(
        err.response?.data?.error ||
        "Could not find an active test with this code. Please verify with your institution."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    if (!verifiedTest) return;
    if (!studentName.trim()) {
      setError("Please enter your full name before starting the exam.");
      return;
    }

    // Store student exam session in sessionStorage for smooth access
    sessionStorage.setItem("org_student_name", studentName.trim());
    sessionStorage.setItem("org_student_roll", studentRollNumber.trim());
    sessionStorage.setItem("org_student_email", studentEmail.trim());
    sessionStorage.setItem("org_access_code", verifiedTest.accessCode);

    router.push(
      `/pages/dashboard/organisation/workspace?code=${encodeURIComponent(
        verifiedTest.accessCode
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 flex flex-col items-center">
        {/* Top Badges & Conditional Admin Switcher (Visible ONLY to Admins) */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Building2 size={14} />
            <span>Institutional Examination Portal</span>
          </div>

          {isAdmin && (
            <button
              onClick={() => router.push("/admin/organisation")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold transition shadow-md cursor-pointer animate-in fade-in"
            >
              <ShieldCheck size={15} className="text-purple-400" />
              <span>Admin Management Portal</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Access Your Institutional Exam
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Enter the unique test code provided by your school, college, or coaching institute to start your examination.
          </p>
        </div>

        {/* Code Entry Card / Verification Flow */}
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {!verifiedTest ? (
            /* STEP 1: Enter Access Code */
            <form onSubmit={handleVerifyCode} className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Examination Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DPS-MATH-8821"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-700 rounded-2xl text-white font-mono text-base tracking-wider placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 uppercase transition"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <HelpCircle size={13} />
                  Ask your teacher or institute administrator if you don&apos;t have an access code.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify Code & Proceed</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Candidate Details & Exam Preview */
            <div className="space-y-6 relative z-10">
              {/* Test Information Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Building2 size={13} />
                    {verifiedTest.organizationName}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Code Verified ✓
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-3">
                  {verifiedTest.title}
                </h2>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">Subject</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{verifiedTest.subject}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">Duration</p>
                    <p className="text-xs font-bold text-amber-400 mt-0.5">{verifiedTest.durationMinutes} Mins</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold">Questions</p>
                    <p className="text-xs font-bold text-blue-400 mt-0.5">{verifiedTest.totalQuestions}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Marking: <strong className="text-emerald-400">+{verifiedTest.positiveMarks}</strong> / <strong className="text-rose-400">{verifiedTest.negativeMarks}</strong> per question</span>
                  <button
                    onClick={() => { setVerifiedTest(null); setError(null); }}
                    className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Change Code
                  </button>
                </div>
              </div>

              {/* Student Identification Form */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student Information
                </label>

                <div>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Full Name (e.g. Rahul Sharma) *"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={studentRollNumber}
                    onChange={(e) => setStudentRollNumber(e.target.value)}
                    placeholder="Roll No. / Student ID (Optional)"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="Email Address (Optional)"
                    className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifiedTest(null)}
                  className="w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartExam}
                  className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Examination</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12">
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <KeyRound size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Unique Code Access</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Take scheduled exams securely created by your institution using dedicated access keys.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Timed Proctored Exam</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Experience realistic CBT exam timers with LaTeX math formulas and full question palettes.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Instant Marks & Analytics</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Receive comprehensive scorecards, solutions, and reports automatically shared with your school.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
