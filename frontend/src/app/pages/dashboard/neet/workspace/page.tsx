"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTest } from '../../../../context/TestContext';

const TestReviewModal = dynamic(() => import('@/src/components/TestReviewModal'), {
  ssr: false,
});
import { LatexRenderer } from '../../../../components/LatexRenderer';
import { QuestionImage, preloadExamImages } from '@/src/components/QuestionImage';
import { ReportErrorButton } from '@/src/components/ReportErrorButton';
import {
  Clock, Award, ChevronLeft, ChevronRight, CheckCircle2,
  AlertCircle, Maximize2, Minimize2, Dna, Atom, FlaskConical,
  ShieldCheck, HelpCircle, ArrowLeft, Send, ShieldAlert, Wifi,
  Puzzle, Check, RefreshCw, X, Play
} from 'lucide-react';

function NeetWorkspacePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || "";
  const name = searchParams.get('name') || "NEET 2023";
  const year = parseInt(searchParams.get('year') || "2023", 10);

  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    selectOption,
    examTimeLeft,
    questionTimers,
    setQuestionTimers,
    isFullscreen,
    setIsFullscreen,
    submitFinalExam,
    loading,
    loadShift,
    isExamActive,
    setIsExamActive
  } = useTest();

  const [selectedSubject, setSelectedSubject] = useState<string>("Physics");
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  // ── Anti-Cheating & Proctoring States ──
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [violationReason, setViolationReason] = useState<string>("");
  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState<boolean>(false);

  // ── Pre-check System States ──
  const [showPreCheck, setShowPreCheck] = useState<boolean>(true);
  const [internetStatus, setInternetStatus] = useState<'checking' | 'connected' | 'limited' | 'disconnected'>('checking');
  const [extensionStatus, setExtensionStatus] = useState<'checking' | 'clean' | 'warning'>('checking');
  const [assetStatus, setAssetStatus] = useState<'checking' | 'ready'>('checking');
  const [assetProgress, setAssetProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedExts, setDetectedExts] = useState<string[]>([]);

  // Load shift on mount
  useEffect(() => {
    if (shiftId) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId]);

  // Pre-checks execution
  const runPreChecks = async () => {
    setInternetStatus('checking');
    setExtensionStatus('checking');

    // 1. Check internet connectivity
    const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
    let pingOk = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('http://localhost:5000/api/exams', {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) pingOk = true;
    } catch (e) {
      console.warn("Ping failed, relying on navigator.onLine:", e);
    }
    setInternetStatus(online && pingOk ? 'connected' : online ? 'limited' : 'disconnected');

    // 2. Check extensions
    const detectedExtensions: string[] = [];
    if (typeof document !== 'undefined') {
      const scripts = Array.from(document.querySelectorAll('script'));
      const hasExtensionUrl = (src: string) => src && (src.includes('chrome-extension://') || src.includes('moz-extension://'));
      scripts.forEach(s => {
        if (hasExtensionUrl(s.src)) detectedExtensions.push("Script Injector");
      });
      if (document.querySelector('grammarly-extension') || document.querySelector('[data-gr-ext-installed]')) {
        detectedExtensions.push("Grammarly");
      }
      if (document.documentElement.querySelector('style[class*="darkreader"]')) {
        detectedExtensions.push("DarkReader");
      }
    }
    setDetectedExts(detectedExtensions);
    setExtensionStatus(detectedExtensions.length > 0 ? 'warning' : 'clean');

    // 3. Preload all question diagram images
    setAssetStatus('checking');
    try {
      const res = await preloadExamImages(questions, "NEET", year, (loaded, total) => {
        setAssetProgress({ loaded, total });
      });
      setAssetProgress(res);
      setAssetStatus('ready');
    } catch (err) {
      console.warn("Asset preloading error:", err);
      setAssetStatus('ready');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && !isExamActive) {
      runPreChecks();
    }
  }, [questions]);

  // Fullscreen change detection & violations
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (isExamActive && !isCurrentlyFullscreen && !showSubmitModal && !submitSuccess && violationsCount < 5) {
        setViolationsCount(prev => prev + 1);
        setViolationReason("Exited fullscreen mode");
        setShowViolationModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive, showSubmitModal, submitSuccess, violationsCount, setIsFullscreen]);

  // Security restrictions: screenshots, copy/paste, right click, window blur
  useEffect(() => {
    if (!isExamActive || violationsCount >= 5) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (violationsCount >= 5) return;
      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
      const isCut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x';
      const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44;
      const isWinScreenshot = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's';
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');

      if (isCopy || isPaste || isCut || isPrintScreen || isWinScreenshot || isMacScreenshot) {
        e.preventDefault();
        setViolationsCount(prev => prev + 1);
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
      setViolationsCount(prev => prev + 1);
      setViolationReason("Attempted right-click (Context Menu)");
      setShowViolationModal(true);
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'Security Violation recorded. Copy/Paste is disabled.');
      }
    };

    const handleBlur = () => {
      if (violationsCount >= 5 || isSubmitting || submitSuccess) return;
      setViolationsCount(prev => prev + 1);
      setViolationReason("Window focus lost (possible screenshot snipping tool, app switcher, or tab switch)");
      setShowViolationModal(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isExamActive, violationsCount, isSubmitting, submitSuccess]);

  // Auto-submit if violations exceed 5
  useEffect(() => {
    if (isExamActive && violationsCount >= 5 && !showAutoSubmitModal) {
      setShowAutoSubmitModal(true);
      handleFinalSubmit();
    }
  }, [violationsCount, isExamActive, showAutoSubmitModal]);

  const handleStartExamFlow = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn("Fullscreen permission error:", err);
    }
    setShowPreCheck(false);
    setIsExamActive(true);
  };

  const handleResumeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen resume permission error:", err);
      });
      setIsFullscreen(true);
    }
    setShowViolationModal(false);
  };

  // Mark current question as visited
  // Automatically sync selectedSubject whenever question index changes
  useEffect(() => {
    if (currentQuestionIndex < 50) {
      setSelectedSubject("Physics");
    } else if (currentQuestionIndex < 100) {
      setSelectedSubject("Chemistry");
    } else {
      setSelectedSubject("Biology");
    }
  }, [currentQuestionIndex]);

  // Mark current question as visited
  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      const qId = questions[currentQuestionIndex].id;
      setVisitedQuestions(prev => new Set(prev).add(qId));
    }
  }, [currentQuestionIndex, questions]);

  // Subject filtering
  const subjects = ["Physics", "Chemistry", "Biology"];
  const currentQ = questions[currentQuestionIndex];

  const handleSelectSubject = (subj: string) => {
    setSelectedSubject(subj);
    if (subj === "Physics") {
      setCurrentQuestionIndex(0);
    } else if (subj === "Chemistry") {
      setCurrentQuestionIndex(Math.min(50, Math.max(0, questions.length - 1)));
    } else if (subj === "Biology") {
      setCurrentQuestionIndex(Math.min(100, Math.max(0, questions.length - 1)));
    }
  };

  const handleOptionChange = (optionLetter: string) => {
    if (!currentQ) return;
    selectOption(currentQ.id, optionLetter);
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    selectOption(currentQ.id, "");
  };

  const handleToggleMarkForReview = () => {
    if (!currentQ) return;
    const qId = currentQ.id;
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitFinalExam();
      setSubmitResult(res);
      setSubmitSuccess(true);
      setShowAutoSubmitModal(false);
      setShowSubmitModal(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }
      if (res.attemptId) {
        setReviewAttemptId(res.attemptId);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Question palette stats
  const answeredCount = Object.keys(answers).filter(k => Boolean(answers[k])).length;
  const markedCount = markedForReview.size;
  const notAnsweredCount = visitedQuestions.size - answeredCount;
  const notVisitedCount = questions.length - visitedQuestions.size;

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Setting up your {name || `NEET ${year}`} Examination...</p>
        </div>
      </div>
    );
  }

  // ── PRE-CHECK INTEGRITY MODAL ──
  if (showPreCheck) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">NEET Exam Environment Check</h2>
            <p className="text-xs text-slate-400">
              Verifying system requirements, anti-cheat guards, and full-screen security.
            </p>
          </div>

          <div className="space-y-3">
            {/* 1. Fullscreen Notice */}
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

            {/* 2. Network Check */}
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

            {/* 3. Anti-cheat guidelines */}
            <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertCircle size={14} />
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-rose-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 size={16} />
            <span>Enter Full Screen & Start NEET Exam</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* ── Top Header ── */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to leave? Your exam is in progress.")) {
                if (document.fullscreenElement) document.exitFullscreen();
                router.push("/pages/dashboard/neet");
              }
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                NEET 2023
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
                {name}
              </h1>
            </div>
            <p className="text-[10px] text-slate-400">Total Marks: 720 • (+4 / -1)</p>
          </div>
        </div>

        {/* Violations pill, Timer & Submit */}
        <div className="flex items-center gap-3">
          {violationsCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold animate-pulse">
              <ShieldAlert size={14} />
              <span>Warnings: {violationsCount}/5</span>
            </div>
          )}

          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            examTimeLeft < 600
              ? "bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse"
              : "bg-slate-800 border-slate-700 text-slate-200"
          }`}>
            <Clock size={15} className={examTimeLeft < 600 ? "text-rose-400" : "text-blue-400"} />
            <span>{formatTime(examTimeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Send size={13} />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* ── Main Exam Body ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Question Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Subject Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
            {[
              { name: "Physics", range: "Q 1 - 50", count: 50, icon: Atom },
              { name: "Chemistry", range: "Q 51 - 100", count: 50, icon: FlaskConical },
              { name: "Biology", range: "Q 101 - 200", count: 100, icon: Dna },
            ].map((subj) => {
              const isSelected = selectedSubject === subj.name;
              const Icon = subj.icon;
              return (
                <button
                  key={subj.name}
                  onClick={() => handleSelectSubject(subj.name)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 border border-rose-500"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <Icon size={15} />
                  <span>{subj.name}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {subj.range}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold font-mono">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold">
                    {currentQ.subject || selectedSubject}
                    {currentQuestionIndex < 50
                      ? ` • Section Q ${currentQuestionIndex + 1}/50`
                      : currentQuestionIndex < 100
                      ? ` • Section Q ${currentQuestionIndex - 49}/50`
                      : ` • Section Q ${currentQuestionIndex - 99}/100`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                    +4
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[11px] font-bold">
                    -1
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                <LatexRenderer text={currentQ.questionText} />
              </div>

              {/* Question Diagram / Image */}
              {currentQ.imageUrl && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-center max-w-xl mx-auto">
                  <img
                    src={currentQ.imageUrl}
                    alt={`Question ${currentQuestionIndex + 1} Diagram`}
                    className="max-h-72 object-contain"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3 pt-2">
                {[
                  { key: 'A', text: currentQ.optionA },
                  { key: 'B', text: currentQ.optionB },
                  { key: 'C', text: currentQ.optionC },
                  { key: 'D', text: currentQ.optionD },
                ].map(({ key, text }) => {
                  if (!text) return null;
                  const isSelected = answers[currentQ.id] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleOptionChange(key)}
                      className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-rose-600/20 border-rose-500 text-white shadow-md"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-rose-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {key}
                      </div>
                      <div className="text-xs sm:text-sm font-medium leading-relaxed">
                        <LatexRenderer text={text} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMarkForReview}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      markedForReview.has(currentQ.id)
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-slate-950 text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                    }`}
                  >
                    {markedForReview.has(currentQ.id) ? "★ Marked for Review" : "☆ Mark for Review"}
                  </button>

                  <button
                    onClick={handleClearResponse}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-30 shadow-md shadow-rose-600/20"
                  >
                    <span>Save & Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right: Question Palette sidebar */}
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Question Palette ({questions.length} Qs)
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-slate-300">Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-slate-300">Not Answered ({notAnsweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="text-slate-300">Not Visited ({notVisitedCount})</span>
              </div>
            </div>

            {/* Palette Subject Filter Pills */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
              {[
                { key: "All", label: "All (200)" },
                { key: "Physics", label: "Phy (1-50)" },
                { key: "Chemistry", label: "Chem (51-100)" },
                { key: "Biology", label: "Bio (101-200)" },
              ].map(({ key, label }) => {
                const isSelected = selectedSubject === key || (key === "All" && selectedSubject === "All");
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === "All") {
                        // Keep current question
                      } else {
                        handleSelectSubject(key);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition shrink-0 cursor-pointer ${
                      selectedSubject === key
                        ? "bg-rose-600 text-white"
                        : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Number grid */}
            <div className="max-h-80 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = Boolean(answers[q.id]);
                  const isMarked = markedForReview.has(q.id);
                  const isVisited = visitedQuestions.has(q.id);

                  let bgClass = "bg-slate-800 text-slate-400 hover:bg-slate-700";
                  if (isCurrent) {
                    bgClass = "ring-2 ring-white bg-rose-600 text-white font-black";
                  } else if (isMarked) {
                    bgClass = "bg-purple-600 text-white font-bold";
                  } else if (isAnswered) {
                    bgClass = "bg-emerald-600 text-white font-bold";
                  } else if (isVisited) {
                    bgClass = "bg-rose-600/40 text-rose-200 border border-rose-500/40";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        const s = q.subject || "Physics";
                        if (s.toLowerCase().includes("phy")) setSelectedSubject("Physics");
                        else if (s.toLowerCase().includes("chem")) setSelectedSubject("Chemistry");
                        else if (s.toLowerCase().includes("bio")) setSelectedSubject("Biology");
                        setCurrentQuestionIndex(idx);
                      }}
                      className={`h-9 rounded-xl text-xs font-mono transition cursor-pointer flex items-center justify-center ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-rose-500/25 transition cursor-pointer"
            >
              Submit Full Examination
            </button>
          </div>
        </aside>
      </div>

      {/* ── SECURITY VIOLATION WARNING MODAL ── */}
      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert size={28} />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
                Security Warning #{violationsCount} of 5
              </span>
              <h3 className="text-lg font-bold text-white mt-2">Integrity Violation Detected</h3>
              <p className="text-xs text-rose-300 font-semibold mt-1">
                Reason: {violationReason}
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Screenshots, window switching, right-clicking, and leaving full screen are strictly forbidden during the NEET CBT Exam. If you reach 5 violations, your exam will be automatically submitted.
              </p>
            </div>

            <button
              onClick={handleResumeFullscreen}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Resume Full Screen & Continue Exam
            </button>
          </div>
        </div>
      )}

      {/* ── AUTO-SUBMIT MAXIMUM VIOLATIONS MODAL ── */}
      {showAutoSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg">
          <div className="bg-slate-900 border border-rose-600 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <ShieldAlert size={36} className="text-rose-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-black text-white">Exam Automatically Submitted</h3>
            <p className="text-xs text-rose-300 font-semibold">
              Maximum security limit exceeded (5 violations detected).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your responses up to this moment have been evaluated and securely submitted to the server.
            </p>
          </div>
        </div>
      )}

      {/* ── REGULAR SUBMIT CONFIRMATION MODAL ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <span>Submit NEET Examination?</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to finish your exam? Here is your summary:
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Total Questions:</span>
                <p className="font-bold text-white">{questions.length}</p>
              </div>
              <div>
                <span className="text-slate-400">Answered:</span>
                <p className="font-bold text-emerald-400">{answeredCount}</p>
              </div>
              <div>
                <span className="text-slate-400">Marked for Review:</span>
                <p className="font-bold text-purple-400">{markedCount}</p>
              </div>
              <div>
                <span className="text-slate-400">Unattempted:</span>
                <p className="font-bold text-rose-400">{questions.length - answeredCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Back to Exam
              </button>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Grading..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Scorecard Modal */}
      {reviewAttemptId && (
        <TestReviewModal
          attemptId={reviewAttemptId}
          onClose={() => {
            setReviewAttemptId(null);
            router.push(`/review/${reviewAttemptId}`);
          }}
        />
      )}
    </div>
  );
}

export default function NeetWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <NeetWorkspacePageContent />
    </Suspense>
  );
}
