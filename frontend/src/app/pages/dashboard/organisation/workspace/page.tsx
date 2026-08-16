"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LatexRenderer } from "@/src/app/components/LatexRenderer";
import {
  fetchStudentTestQuestions,
  submitStudentTest,
  OrgQuestion
} from "@/src/lib/orgApi";
import {
  Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight,
  Maximize2, Minimize2, Bookmark, RotateCcw, Send, Building2,
  HelpCircle, CheckCircle2, ChevronRight, X
} from "lucide-react";

function OrgWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testData, setTestData] = useState<any>(null);
  const [questions, setQuestions] = useState<OrgQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student exam state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // in seconds
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Candidate metadata
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  useEffect(() => {
    // Read session candidate metadata
    const name = sessionStorage.getItem("org_student_name") || "Student";
    const roll = sessionStorage.getItem("org_student_roll") || "";
    const email = sessionStorage.getItem("org_student_email") || "";
    const code = codeParam || sessionStorage.getItem("org_access_code") || "";

    setStudentName(name);
    setStudentRoll(roll);
    setStudentEmail(email);

    if (!code) {
      setError("No access code provided. Please enter an access code to join the test.");
      setLoading(false);
      return;
    }

    const loadExam = async () => {
      try {
        setLoading(true);
        const res = await fetchStudentTestQuestions(code);
        if (res.test && res.test.questions && res.test.questions.length > 0) {
          setTestData(res.test);
          setQuestions(res.test.questions);
          setTimeLeft((res.test.durationMinutes || 60) * 60);
        } else {
          setError("No questions found for this examination.");
        }
      } catch (err: any) {
        console.error("Failed to load test questions:", err);
        setError(err.response?.data?.error || "Failed to load examination questions.");
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [codeParam]);

  // Master countdown timer
  useEffect(() => {
    if (loading || timeLeft <= 0 || !testData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Track time spent on current question
      if (questions[currentIndex]?.id) {
        const qId = questions[currentIndex].id!;
        setTimeSpentMap((prev) => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft, testData, currentIndex, questions]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.log(e));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => console.log(e));
      }
      setIsFullscreen(false);
    }
  };

  const handleSelectOption = (optionKey: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ?.id) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id!]: optionKey,
    }));
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ?.id) return;
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQ.id!];
      return updated;
    });
  };

  const handleToggleReview = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ?.id) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQ.id!]: !prev[currentQ.id!],
    }));
  };

  const handleAutoSubmit = () => {
    alert("Time is up! Submitting your examination automatically.");
    handleSubmitFinal();
  };

  const handleSubmitFinal = async () => {
    if (isSubmitting || !testData) return;
    setIsSubmitting(true);
    try {
      const res = await submitStudentTest({
        accessCode: testData.accessCode,
        studentName: studentName || "Student Candidate",
        studentEmail: studentEmail || undefined,
        studentRollNumber: studentRoll || undefined,
        answers,
        timeSpentMap,
      });

      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }

      // Route to instant result scorecard
      router.push(`/pages/dashboard/organisation/result/${res.attemptId}`);
    } catch (err: any) {
      console.error("Submission failed:", err);
      alert(err.response?.data?.error || "Submission failed. Please try again.");
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Status stats
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const totalQuestions = questions.length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Setting up your examination workspace...</p>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold">Examination Unavailable</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/pages/dashboard/organisation")}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
          >
            Return to Portal Hub
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOpt = currentQ?.id ? answers[currentQ.id] : undefined;
  const isMarked = currentQ?.id ? !!markedForReview[currentQ.id] : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ── Top Bar / Exam Header ── */}
      <header className="h-14 bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
            <Building2 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide truncate max-w-[200px] sm:max-w-xs">
                {testData.organizationName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                {testData.accessCode}
              </span>
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-[220px] sm:max-w-md">
              {testData.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer Clock */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wider shadow-sm transition ${
              timeLeft < 300
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                : "bg-slate-950/80 border-slate-700 text-amber-400"
            }`}
          >
            <Clock size={16} className={timeLeft < 300 ? "text-rose-400" : "text-amber-400"} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition cursor-pointer"
          >
            <Send size={13} />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Question Canvas */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto max-w-5xl">
          {/* Question Top Meta */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                {currentQ.subject || testData.subject || "General"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-semibold">+{currentQ.positiveMarks ?? testData.positiveMarks ?? 4}</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-semibold">{currentQ.negativeMarks ?? testData.negativeMarks ?? -1}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 mb-6 text-sm sm:text-base leading-relaxed text-slate-100">
            <LatexRenderer text={currentQ.questionText} />
            {currentQ.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 max-w-md">
                <img src={currentQ.imageUrl} alt="Question Diagram" className="w-full object-contain" />
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-3 mb-8">
            {(["A", "B", "C", "D"] as const).map((optKey) => {
              const optionText = currentQ[`option${optKey}` as keyof OrgQuestion] as string;
              if (!optionText) return null;
              const isSelected = selectedOpt === optKey;

              return (
                <button
                  key={optKey}
                  onClick={() => handleSelectOption(optKey)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500 text-white ring-1 ring-blue-500"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900/90 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {optKey}
                  </div>
                  <div className="flex-1 text-sm pt-0.5 leading-relaxed">
                    <LatexRenderer text={optionText} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Action Controls */}
          <div className="mt-auto pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isMarked
                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                <Bookmark size={14} className={isMarked ? "fill-purple-400 text-purple-400" : ""} />
                <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
              </button>

              {selectedOpt && (
                <button
                  onClick={handleClearResponse}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 transition cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Save & Next</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </main>

        {/* Right Side: Question Navigation Palette */}
        <aside className="w-full lg:w-80 bg-slate-900/70 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col">
          {/* Candidate Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{studentName}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {studentRoll ? `Roll: ${studentRoll}` : "Candidate"}
              </p>
            </div>
          </div>

          {/* Palette Summary Badges */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-semibold">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-between">
              <span>Answered</span>
              <span className="font-bold">{answeredCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 flex items-center justify-between">
              <span>Unanswered</span>
              <span className="font-bold">{unansweredCount}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-between col-span-2">
              <span>Marked for Review</span>
              <span className="font-bold">{markedCount}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Question Palette
          </h3>

          {/* Numbered Questions Grid */}
          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-64 sm:max-h-80 pr-1">
            {questions.map((q, idx) => {
              const isCurr = idx === currentIndex;
              const hasAns = q.id ? !!answers[q.id] : false;
              const isRev = q.id ? !!markedForReview[q.id] : false;

              let btnClass = "bg-slate-800/80 text-slate-400 border-slate-700";
              if (hasAns && isRev) {
                btnClass = "bg-purple-600 text-white border-purple-500 ring-2 ring-emerald-400";
              } else if (hasAns) {
                btnClass = "bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-500/20";
              } else if (isRev) {
                btnClass = "bg-purple-600 text-white border-purple-500";
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl font-bold text-xs border transition-all flex items-center justify-center cursor-pointer ${btnClass} ${
                    isCurr ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send size={16} className="text-emerald-400" />
                <span>Submit Examination</span>
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to submit your examination? Once submitted, answers cannot be modified.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Answered</p>
                <p className="text-base font-black text-emerald-400 mt-0.5">{answeredCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Unanswered</p>
                <p className="text-base font-black text-slate-400 mt-0.5">{unansweredCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Marked</p>
                <p className="text-base font-black text-purple-400 mt-0.5">{markedCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={isSubmitting}
                className="w-1/2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="w-1/2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold tracking-wide shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Submit</span>
                    <CheckCircle size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrgWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OrgWorkspaceContent />
    </Suspense>
  );
}
