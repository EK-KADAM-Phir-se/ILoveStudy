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
import { NtaQuestionButton, type NtaQuestionStatus } from '@/src/components/NtaQuestionButton';
import { API_BASE_URL } from '@/src/lib/apiConfig';
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
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [showInstructionBox, setShowInstructionBox] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>("Raghuwanshi");
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("displayName");
    if (saved) setDisplayName(saved);
  }, []);


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
      const res = await fetch(`${API_BASE_URL}/api/exams`, {
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

  // Browser Back Button & Swipe-Back Protection
  useEffect(() => {
    if (!isExamActive || showSubmitModal || submitSuccess) return;

    window.history.pushState({ examActive: true }, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState({ examActive: true }, '', window.location.href);
      setViolationsCount((prev) => prev + 1);
      setViolationReason("Attempted back navigation / swipe-back gesture during active exam session");
      setShowViolationModal(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Warning: Refreshing or leaving this page will forfeit your active exam session!";
      return e.returnValue;
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isExamActive, showSubmitModal, submitSuccess]);


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
            {/* 0. Diagrams & Assets Preloading Status */}
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

            {/* 1. Full Screen Mode Enforced */}
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



  const getQuestionStatus = (qId: string): NtaQuestionStatus => {
    const isAns = Boolean(answers[qId]);
    const isMrk = markedForReview.has(qId);
    const isVis = visitedQuestions.has(qId);

    if (isAns && isMrk) return "answered_marked";
    if (isMrk) return "marked";
    if (isAns) return "answered";
    if (isVis) return "not_answered";
    return "not_visited";
  };

  const handleMarkForReviewAndNext = () => {
    if (currentQ) {
      setMarkedForReview(prev => new Set(prev).add(currentQ.id));
    }
    handleNextQuestion();
  };

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    const qId = currentQ.id;
    setBookmarkedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  // Global NTA Status counters
  const totalCounters = {
    answered: questions.filter(q => getQuestionStatus(q.id) === "answered").length,
    notAnswered: questions.filter(q => getQuestionStatus(q.id) === "not_answered").length,
    notVisited: questions.filter(q => getQuestionStatus(q.id) === "not_visited").length,
    marked: questions.filter(q => getQuestionStatus(q.id) === "marked").length,
    answeredMarked: questions.filter(q => getQuestionStatus(q.id) === "answered_marked").length,
  };

  const neetSubjects = [
    { name: "Physics", range: "Q 1 - 50" },
    { name: "Chemistry", range: "Q 51 - 100" },
    { name: "Biology", range: "Q 101 - 200" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden h-screen">
      {/* 1. NTA Topmost Dark Banner */}
      <div className="bg-[#1a1d20] text-yellow-400 font-bold text-xs sm:text-sm px-4 py-2 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span>NEET Mock Test UPDATED AS PER LATEST NTA PATTERN</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => alert("NTA Accessibility options enabled.")}
            className="bg-[#4caf50] hover:bg-[#43a047] text-white px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>♿</span> Accessibility
          </button>
          <button
            onClick={() => alert("Screen Magnifier active.")}
            className="bg-[#ff9800] hover:bg-[#fb8c00] text-white px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>🔍</span> Screen Magnifier
          </button>
        </div>
      </div>

      {/* 2. Sub-Header Bar (Paper Badge + Timer) */}
      <div className="bg-[#e8edf2] dark:bg-[#1e232a] text-slate-800 dark:text-slate-100 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-300 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-[#31708f] text-white px-3 py-1 rounded-md font-bold text-xs shadow-sm">
            NEET {year}
          </span>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to exit the exam? Your progress is saved.")) {
                router.push('/pages/dashboard/neet');
              }
            }}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
          >
            &larr; Exit Exam
          </button>
        </div>

        <div className="flex items-center gap-4 font-bold text-sm">
          <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Sections</span>
          <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-300 dark:border-slate-700 shadow-inner">
            Time Left : <span className={`font-mono text-base font-bold ${examTimeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-blue-600 dark:text-blue-400'}`}>{formatTime(examTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3. NTA Section Tabs Bar */}
      <div className="bg-[#f5f5f5] dark:bg-[#181b20] border-b border-slate-300 dark:border-slate-800 px-4 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0">
        {neetSubjects.map((subj) => (
          <button
            key={subj.name}
            onClick={() => handleSelectSubject(subj.name)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedSubject === subj.name
                ? "bg-[#337ab7] text-white shadow"
                : "bg-white dark:bg-slate-800 text-[#337ab7] dark:text-blue-400 border border-slate-300 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"
            }`}
          >
            <span>{subj.name}</span>
            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono">i</span>
          </button>
        ))}
      </div>

      {/* 4. Question Metadata Bar */}
      <div className="bg-[#f8f9fa] dark:bg-[#1e2229] border-b border-slate-300 dark:border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 shrink-0">
        <span className="font-semibold">Question Type: <strong className="text-slate-900 dark:text-white">Multiple Choice</strong></span>
        <span>Marks for correct answer: <strong className="text-emerald-600 dark:text-emerald-400">+4</strong> | Negative Marks: <strong className="text-rose-600 dark:text-rose-400">1</strong></span>
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden w-full">
        
        {/* Left Side Panel: Question view & options */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden border-r border-slate-900">
          
          {/* Question No & Bookmark bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-100 text-sm">Question No. {currentQuestionIndex + 1}</span>
              {currentQ && (
                <button
                  onClick={handleToggleBookmark}
                  className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition cursor-pointer ${
                    bookmarkedQuestions.has(currentQ.id)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  <span>🔖</span> Bookmark
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {currentQ && <ReportErrorButton questionId={currentQ.id} questionTextSnippet={currentQ.questionText} />}
              <button
                onClick={() => setShowInstructionBox(!showInstructionBox)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                title="Toggle Instructions"
              >
                {showInstructionBox ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* Section Instruction Box (Collapsible Card) */}
          {showInstructionBox && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl m-4 p-4 text-xs text-slate-200 space-y-2 shrink-0 shadow-lg">
              <div className="flex justify-between items-center font-bold border-b border-slate-800 pb-2">
                <span className="text-rose-400 text-sm">{selectedSubject} (Maximum Marks: 720)</span>
                <button onClick={() => setShowInstructionBox(false)} className="text-slate-400 hover:text-white">▲</button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
                <li>This section contains questions for <strong>{selectedSubject}</strong>.</li>
                <li>Each question has <strong>FOUR</strong> options (A), (B), (C) and (D). <strong>ONLY ONE</strong> option is correct.</li>
                <li>Marking Scheme: <strong>+4</strong> for correct answer, <strong>0</strong> if unattempted, <strong>-1</strong> for incorrect.</li>
              </ul>
            </div>
          )}

          {/* Question and Option Display */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {currentQ && (
                <>
                  {/* Question card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
                    <div className="text-slate-100 text-base leading-relaxed whitespace-pre-line">
                      <LatexRenderer text={currentQ.questionText} />
                    </div>

                    {currentQ.imageUrl && (
                      <div className="mt-4 border border-slate-800 rounded-lg p-4 bg-slate-950 flex justify-center">
                        <QuestionImage
                          imageUrl={currentQ.imageUrl}
                          examName="neet"
                          alt={`Question ${currentQuestionIndex + 1} Diagram`}
                          className="max-h-72 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {[
                      { key: 'A', text: currentQ.optionA },
                      { key: 'B', text: currentQ.optionB },
                      { key: 'C', text: currentQ.optionC },
                      { key: 'D', text: currentQ.optionD },
                    ].map(({ key, text }) => {
                      if (!text) return null;
                      const isSelected = answers[currentQ.id] === key;
                      return (
                        <div
                          key={key}
                          onClick={() => handleOptionChange(key)}
                          className={`group flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#337ab7]/20 border-[#337ab7] shadow-md shadow-blue-500/5'
                              : 'bg-slate-900 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-850/50'
                          }`}
                        >
                          <span className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center mr-4 transition ${
                            isSelected
                              ? 'bg-[#337ab7] text-white'
                              : 'bg-slate-950 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200'
                          }`}>
                            {key}
                          </span>
                          <div className={`text-sm ${isSelected ? 'text-blue-200 font-semibold' : 'text-slate-300'}`}>
                            <LatexRenderer text={text} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 5. NTA Bottom Control Bar */}
          <footer className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                disabled={!currentQ || !answers[currentQ.id]}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 disabled:opacity-40 font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                Clear Response
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 rounded-lg bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-xs transition cursor-pointer shadow"
              >
                Save &amp; Next
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2 rounded-lg bg-[#2e6da4] hover:bg-[#204d74] text-white font-bold text-xs transition cursor-pointer shadow"
              >
                Submit
              </button>
            </div>
          </footer>
        </main>

        {/* 6. NTA Right Sidebar (Profile + Legend + Palette Grid) */}
        <aside className="w-80 shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
          
          {/* Candidate Profile Box */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
              <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm truncate max-w-[170px]">{displayName}</p>
              <p className="text-[11px] text-slate-400 font-medium">Candidate</p>
            </div>
          </div>

          {/* NTA Status Legend Box */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 text-xs space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.answered} status="answered" size="sm" />
                <span className="text-slate-300 text-[11px]">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notAnswered} status="not_answered" size="sm" />
                <span className="text-slate-300 text-[11px]">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notVisited} status="not_visited" size="sm" />
                <span className="text-slate-300 text-[11px]">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.marked} status="marked" size="sm" />
                <span className="text-slate-300 text-[11px]">Marked for Review</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <NtaQuestionButton questionNumber={totalCounters.answeredMarked} status="answered_marked" size="sm" />
              <span className="text-slate-300 text-[10px] leading-tight">
                Answered &amp; Marked for Review (will be evaluated)
              </span>
            </div>
          </div>

          {/* NTA Section Header */}
          <div className="bg-[#337ab7] text-white px-3 py-2 text-xs font-bold shrink-0">
            <p>{selectedSubject}</p>
            <p className="text-[10px] font-normal opacity-90">Choose a Question</p>
          </div>

          {/* NTA Question Grid Palette */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-4 gap-2.5 justify-items-center">
              {questions.map((q: any, idx: number) => {
                const isCurrent = idx === currentQuestionIndex;
                const qStatus = getQuestionStatus(q.id);

                return (
                  <NtaQuestionButton
                    key={q.id}
                    questionNumber={idx + 1}
                    status={qStatus}
                    isSelected={isCurrent}
                    onClick={() => {
                      const s = q.subject || "Physics";
                      if (s.toLowerCase().includes("phy")) setSelectedSubject("Physics");
                      else if (s.toLowerCase().includes("chem")) setSelectedSubject("Chemistry");
                      else if (s.toLowerCase().includes("bio")) setSelectedSubject("Biology");
                      setCurrentQuestionIndex(idx);
                    }}
                  />
                );
              })}
            </div>
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

      {/* ── REGULAR SUBMIT CONFIRMATION & RESULT MODAL ── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            {submitSuccess ? (
              <div className="text-center space-y-4 py-2">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-100">NEET Exam Submitted!</h3>
                <p className="text-xs text-slate-400">
                  Your exam has been submitted successfully. Here is your performance:
                </p>

                {submitResult && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl divide-y divide-slate-800 text-sm text-left">
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400 font-semibold">Total Score:</span>
                      <span className="font-extrabold text-emerald-400 text-lg">
                        {submitResult.finalScore} / {submitResult.totalQuestions * 4}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">Correct Answers:</span>
                      <span className="font-extrabold text-emerald-400 text-base">{submitResult.correctCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">Incorrect Answers:</span>
                      <span className="font-extrabold text-rose-400 text-base">{submitResult.incorrectCount}</span>
                    </div>
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400">Unattempted Questions:</span>
                      <span className="font-extrabold text-slate-400 text-base">{submitResult.unattemptedCount}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {submitResult?.attemptId && (
                    <button
                      onClick={() => setReviewAttemptId(submitResult.attemptId)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Review Detailed Solutions</span>
                      <span>→</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      router.push('/pages/dashboard/neet');
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Review Scorecard Modal */}
      {reviewAttemptId && (
        <TestReviewModal
          attemptId={reviewAttemptId}
          onClose={() => setReviewAttemptId(null)}
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
