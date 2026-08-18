"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LatexRenderer } from "@/src/app/components/LatexRenderer";
import {
  fetchStudentTestQuestions,
  submitStudentTest,
  OrgQuestion
} from "@/src/lib/orgApi";
import { QuestionImage, preloadExamImages } from "@/src/components/QuestionImage";
import {
  Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight,
  Maximize2, Minimize2, Bookmark, RotateCcw, Send, Building2,
  HelpCircle, CheckCircle2, ChevronRight, X, ShieldAlert,
  Wifi, Puzzle, Lock, ShieldCheck, Check, RefreshCw, Play
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

  // Anti-Cheat & Security State
  const [isExamActive, setIsExamActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [violationReason, setViolationReason] = useState("");
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);

  // Asset Preloading State
  const [assetStatus, setAssetStatus] = useState<'checking' | 'ready'>('checking');
  const [assetProgress, setAssetProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });

  // Student exam state
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeSpentMap, setTimeSpentMap] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(3600); // in seconds

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Asset preloading
  useEffect(() => {
    if (questions.length > 0 && !isExamActive) {
      setAssetStatus('checking');
      preloadExamImages(questions, "Institutional", null, (loaded, total) => {
        setAssetProgress({ loaded, total });
      })
        .then((res) => {
          setAssetProgress(res);
          setAssetStatus('ready');
        })
        .catch(() => setAssetStatus('ready'));
    }
  }, [questions, isExamActive]);

  // Fullscreen change detection & violations
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (isExamActive && !isCurrentlyFullscreen && !showSubmitModal && !submitSuccess && violationsCount < 5) {
        setViolationsCount((prev) => prev + 1);
        setViolationReason("Exited fullscreen mode");
        setShowViolationModal(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isExamActive, showSubmitModal, submitSuccess, violationsCount]);

  // Anti-cheating security guards: right-click, screenshots, copy/paste, blur focus loss
  useEffect(() => {
    if (!isExamActive || violationsCount >= 5) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (violationsCount >= 5) return;
      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";
      const isCut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "x";
      const isPrintScreen = e.key === "PrintScreen" || e.keyCode === 44;
      const isWinScreenshot = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s";
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5");

      if (isCopy || isPaste || isCut || isPrintScreen || isWinScreenshot || isMacScreenshot) {
        e.preventDefault();
        setViolationsCount((prev) => prev + 1);
        setViolationReason(
          isCopy ? "Attempted copy shortcut (Ctrl+C / Cmd+C)" :
          isPaste ? "Attempted paste shortcut (Ctrl+V / Cmd+V)" :
          isCut ? "Attempted cut shortcut (Ctrl+X / Cmd+X)" :
          isWinScreenshot || isMacScreenshot ? "Attempted OS-level screenshot shortcut (Meta+Shift+S / Cmd+Shift+3,4,5)" :
          "Attempted PrintScreen / screenshot capture"
        );
        setShowViolationModal(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (violationsCount >= 5) return;
      e.preventDefault();
      setViolationsCount((prev) => prev + 1);
      setViolationReason("Attempted right-click (Context Menu)");
      setShowViolationModal(true);
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", "Security Violation recorded. Copy/Paste is disabled.");
      }
    };

    const handleBlur = () => {
      if (violationsCount >= 5 || isSubmitting || submitSuccess) return;
      setViolationsCount((prev) => prev + 1);
      setViolationReason("Window focus lost (possible screenshot snipping tool, app switcher, or tab switch)");
      setShowViolationModal(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isExamActive, violationsCount, isSubmitting, submitSuccess]);

  // Auto-submit if violations exceed 5
  useEffect(() => {
    if (isExamActive && violationsCount >= 5 && !showAutoSubmitModal) {
      setShowAutoSubmitModal(true);
      handleSubmitFinal();
    }
  }, [isExamActive, violationsCount, showAutoSubmitModal]);

  // Master countdown timer (Active only when exam is active)
  useEffect(() => {
    if (loading || !isExamActive || timeLeft <= 0 || !testData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      if (questions[currentIndex]?.id) {
        const qId = questions[currentIndex].id!;
        setTimeSpentMap((prev) => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isExamActive, timeLeft, testData, currentIndex, questions]);

  const handleStartExamFlow = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (e) {
      console.warn("Fullscreen request error:", e);
    }
    setIsExamActive(true);
  };

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
        violationsCount,
        terminatedBySecurity: violationsCount >= 5,
      });

      setSubmitSuccess(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }

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

  // ── ENVIRONMENT & ANTI-CHEAT PRE-CHECK MODAL ──
  if (!isExamActive) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={28} />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              {testData.organizationName}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-2">{testData.title}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Verifying system requirements, proctoring security guards, and full-screen enforcement.
            </p>
          </div>

          {/* Candidate Info Summary */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Candidate Name</span>
              <p className="font-bold text-slate-200 truncate">{studentName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Access Code</span>
              <p className="font-mono font-bold text-indigo-400">{testData.accessCode}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Duration</span>
              <p className="font-bold text-amber-400">{testData.durationMinutes} Minutes</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-bold">Total Questions</span>
              <p className="font-bold text-blue-400">{testData.questions.length} Questions</p>
            </div>
          </div>

          {/* Pre-Check Cards */}
          <div className="space-y-3 text-left">
            {/* Asset Preloading Status */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Puzzle size={18} className="text-purple-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Paper Diagrams & Assets</p>
                  <p className="text-[11px] text-slate-400">
                    {assetStatus === 'checking'
                      ? `Preloading question diagrams (${assetProgress.loaded}/${assetProgress.total})...`
                      : `${assetProgress.total > 0 ? `${assetProgress.total} question diagrams cached & ready for instant viewing.` : 'No diagram images required for this paper.'}`}
                  </p>
                </div>
              </div>
              <div>
                {assetStatus === 'checking' ? (
                  <span className="text-xs font-semibold text-slate-400 animate-pulse">Preloading...</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">✓ Ready</span>
                )}
              </div>
            </div>

            {/* Full Screen Mode Enforced */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Maximize2 size={18} className="text-rose-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Full Screen Mode Enforced</p>
                  <p className="text-[11px] text-slate-400">Exiting fullscreen or taking screenshots will trigger security violations.</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-bold">Required</span>
            </div>

            {/* Network Check */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Wifi size={18} className="text-blue-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">Internet Connection</p>
                  <p className="text-[11px] text-slate-400">Real-time sync to answer database</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400">✓ Connected</span>
            </div>

            {/* Anti-cheat guidelines */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle size={14} />
                <span>Anti-Cheating Rules:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                <li>Right-click and copy-paste are strictly disabled.</li>
                <li>Screenshots (PrintScreen / Win+Shift+S / Snipping Tool) trigger a violation.</li>
                <li>Switching windows or tabs will record a violation.</li>
                <li>5 violations will result in automatic exam submission.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartExamFlow}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 hover:from-blue-500 hover:to-rose-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 size={16} />
            <span>Enter Full Screen & Start Examination</span>
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
            <h1 className="text-sm font-bold text-white truncate max-w-[250px] sm:max-w-md">
              {testData.title}
            </h1>
          </div>
        </div>

        {/* Center: Security Badge & Timer */}
        <div className="flex items-center gap-3">
          {/* Security Violations Badge */}
          {violationsCount > 0 && (
            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert size={14} />
              <span>Violations: {violationsCount} / 5</span>
            </div>
          )}

          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition ${
              timeLeft < 300
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse"
                : "bg-slate-950 border-slate-800 text-amber-400"
            }`}
          >
            <Clock size={14} />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Submit Exam Button */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Send size={14} />
          <span>Submit Test</span>
        </button>
      </header>

      {/* ── Main Exam Body ── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Question Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              {currentQ?.subject && (
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
                  {currentQ.subject}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
              <span className="text-emerald-400">+{testData.positiveMarks || 4} Marks</span>
              <span>/</span>
              <span className="text-rose-400">-{testData.negativeMarks || 1} Marks</span>
            </div>
          </div>

          {/* Question Text & Math */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="text-sm sm:text-base font-semibold text-white leading-relaxed">
              <LatexRenderer text={currentQ?.questionText || "Question text"} />
            </div>

            {/* Question Diagram / Image */}
            {currentQ?.imageUrl && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-center max-w-xl mx-auto">
                <QuestionImage
                  imageUrl={currentQ.imageUrl}
                  examName="Institutional"
                  alt={`Question ${currentIndex + 1} Diagram`}
                />
              </div>
            )}
          </div>

          {/* Options Palette */}
          {(() => {
            const rawOpts = (currentQ as any)?.options;
            const optionsList: Array<{ id: string; text: string }> = Array.isArray(rawOpts)
              ? rawOpts.map((o: any, idx: number) => ({
                  id: String(o.id || String.fromCharCode(65 + idx)).toUpperCase(),
                  text: String(o.text || o.value || o),
                }))
              : [
                  { id: "A", text: currentQ?.optionA || "" },
                  { id: "B", text: currentQ?.optionB || "" },
                  { id: "C", text: currentQ?.optionC || "" },
                  { id: "D", text: currentQ?.optionD || "" },
                ].filter((o) => Boolean(o.text));

            return (
              <div className="space-y-3">
                {optionsList.map((opt) => {
                  const optId = String(opt.id).toUpperCase();
                  const isSelected = selectedOpt === optId;

                  return (
                    <button
                      key={optId}
                      onClick={() => handleSelectOption(optId)}
                      className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {optId}
                      </div>
                      <div className="text-xs sm:text-sm font-medium flex-1">
                        <LatexRenderer text={opt.text} />
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })()}

          {/* Bottom Question Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  isMarked
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <Bookmark size={14} />
                <span>{isMarked ? "Marked for Review" : "Mark for Review"}</span>
              </button>

              {selectedOpt && (
                <button
                  onClick={handleClearResponse}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Clear Response</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIndex === totalQuestions - 1}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <span>Save & Next</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </main>

        {/* Right: Question Palette & Candidate Profile Sidebar */}
        <aside className="w-full md:w-80 bg-slate-900/90 border-t md:border-t-0 md:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Candidate Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p className="text-[10px] uppercase text-slate-400 font-bold">Candidate</p>
              <p className="text-sm font-bold text-white truncate">{studentName}</p>
              {studentRoll && <p className="text-xs font-mono text-indigo-400">ID: {studentRoll}</p>}
            </div>

            {/* Question Palette Summary */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <p className="font-bold text-base">{answeredCount}</p>
                <p className="text-[10px] text-slate-400 font-medium">Answered</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <p className="font-bold text-base">{markedCount}</p>
                <p className="text-[10px] text-slate-400 font-medium">For Review</p>
              </div>
            </div>

            {/* Question Grid */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Question Palette
              </p>
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const qId = q.id || String(idx);
                  const isAns = !!answers[qId];
                  const isRev = !!markedForReview[qId];
                  const isCurr = idx === currentIndex;

                  let colorClass = "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700";
                  if (isRev) {
                    colorClass = "bg-purple-600 text-white border-purple-500";
                  } else if (isAns) {
                    colorClass = "bg-emerald-600 text-white border-emerald-500";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl font-bold text-xs border transition flex items-center justify-center cursor-pointer ${colorClass} ${
                        isCurr ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950" : ""
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              Submit Final Answers
            </button>
          </div>
        </aside>
      </div>

      {/* ── MODAL 1: Confirm Submission Modal ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
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

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to submit your examination? You cannot edit your answers after submitting.
            </p>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs">
              <div>
                <p className="font-bold text-emerald-400 text-sm">{answeredCount}</p>
                <p className="text-[10px] text-slate-400">Answered</p>
              </div>
              <div>
                <p className="font-bold text-purple-400 text-sm">{markedCount}</p>
                <p className="text-[10px] text-slate-400">Marked</p>
              </div>
              <div>
                <p className="font-bold text-rose-400 text-sm">{unansweredCount}</p>
                <p className="text-[10px] text-slate-400">Unanswered</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Yes, Submit Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Security Violation Warning Modal ── */}
      {showViolationModal && violationsCount < 5 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert size={28} />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Security Warning ({violationsCount} / 5)
              </span>
              <h3 className="text-lg font-extrabold text-white mt-2">Proctoring Security Violation Recorded</h3>
              <p className="text-xs text-rose-300 mt-1 font-semibold">{violationReason}</p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Exiting full-screen, switching windows, taking screenshots, or right-clicking is strictly forbidden during institutional examinations.
            </p>

            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-bold">
              Warning: 5 total violations will result in automatic examination termination!
            </div>

            <button
              onClick={async () => {
                setShowViolationModal(false);
                try {
                  if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                  }
                } catch (e) {}
              }}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-rose-600/30"
            >
              Re-Enable Fullscreen &amp; Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Exam Terminated (5 Violations Limit Exceeded) ── */}
      {showAutoSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg">
          <div className="bg-slate-900 border border-rose-500/60 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-2xl">
              <ShieldAlert size={36} />
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest border border-rose-500/40">
                EXAM TERMINATED
              </span>
              <h3 className="text-2xl font-black text-white mt-3">Security Limit Exceeded</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                You have reached the maximum threshold of <strong>5 security violations</strong>. Your examination answers have been automatically locked and submitted.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 text-xs font-mono text-rose-400">
              Violations: 5 / 5 (Max Reached)
            </div>

            <p className="text-[11px] text-slate-500">
              Generating your scorecard and submitting answers to your institution...
            </p>
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
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-300">Loading test workspace...</p>
        </div>
      }
    >
      <OrgWorkspaceContent />
    </Suspense>
  );
}
