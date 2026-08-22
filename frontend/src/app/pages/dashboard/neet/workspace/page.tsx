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
import { AccessibilityModal, type AccessibilitySettings } from '@/src/components/AccessibilityModal';
import { ScreenMagnifierBar } from '@/src/components/ScreenMagnifierBar';
import { ExitConfirmModal } from '@/src/components/ExitConfirmModal';
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

  // ── Accessibility & Screen Magnifier States ──
  const [showAccessibilityModal, setShowAccessibilityModal] = useState<boolean>(false);
  const [showMagnifierBar, setShowMagnifierBar] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);
  const [showMobilePalette, setShowMobilePalette] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [accessSettings, setAccessSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: 'default',
    dyslexicFont: false,
    highFocusOutline: false,
  });

  const speakQuestionText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !questions[currentQuestionIndex]) return;
    const currentQ = questions[currentQuestionIndex];
    window.speechSynthesis.cancel();
    const cleanText = (currentQ.questionText || '').replace(/\$/g, '').replace(/\\text\{([^}]+)\}/g, '$1');
    const opts = [
      currentQ.optionA ? `Option A: ${currentQ.optionA.replace(/\$/g, '')}` : '',
      currentQ.optionB ? `Option B: ${currentQ.optionB.replace(/\$/g, '')}` : '',
      currentQ.optionC ? `Option C: ${currentQ.optionC.replace(/\$/g, '')}` : '',
      currentQ.optionD ? `Option D: ${currentQ.optionD.replace(/\$/g, '')}` : '',
    ].filter(Boolean).join('. ');
    const textToRead = `Question ${currentQuestionIndex + 1}. ${cleanText}. ${opts}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

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
  const [completedResult, setCompletedResult] = useState<any>(null);

  // Check if exam was previously completed & submitted
  useEffect(() => {
    if (typeof window !== 'undefined' && shiftId) {
      const saved = sessionStorage.getItem(`submitted_neet_${shiftId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedResult(parsed);
        } catch (e) {
          console.error("Error parsing saved exam result:", e);
        }
      }
    }
  }, [shiftId]);

  // Load shift on mount
  useEffect(() => {
    if (shiftId && !completedResult) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId, completedResult]);

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
      if (typeof window !== 'undefined' && shiftId) {
        sessionStorage.setItem(`submitted_neet_${shiftId}`, JSON.stringify(res));
      }
      setShowAutoSubmitModal(false);
      setShowSubmitModal(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }
    } catch (err) {
      console.error("Submission failed:", err);
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

  if (completedResult) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{name || `NEET ${year}`}</h2>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Exam Session Completed &amp; Evaluated
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-sm text-left">
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400 font-semibold">Total Score:</span>
              <span className="font-extrabold text-emerald-400 text-xl">
                {completedResult.finalScore} / {(completedResult.totalQuestions || 200) * 4}
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400">Correct Answers:</span>
              <span className="font-extrabold text-emerald-400 text-base">{completedResult.correctCount}</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400">Incorrect Answers:</span>
              <span className="font-extrabold text-rose-400 text-base">{completedResult.incorrectCount}</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400">Unattempted Questions:</span>
              <span className="font-extrabold text-slate-400 text-base">{completedResult.unattemptedCount}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {completedResult.attemptId && (
              <button
                onClick={() => setReviewAttemptId(completedResult.attemptId)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <span>Review Detailed Solutions</span>
                <span>→</span>
              </button>
            )}

            <button
              onClick={() => router.replace('/pages/dashboard/neet')}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Return to NEET Dashboard
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && shiftId) {
                  sessionStorage.removeItem(`submitted_neet_${shiftId}`);
                }
                setCompletedResult(null);
                loadShift(shiftId, name, year);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer border border-slate-700"
            >
              Retake Exam Practice
            </button>
          </div>

          {reviewAttemptId && (
            <TestReviewModal
              attemptId={reviewAttemptId}
              onClose={() => setReviewAttemptId(null)}
            />
          )}
        </div>
      </div>
    );
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-900 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Setting up your {name || `NEET ${year}`} Examination...</p>
        </div>
      </div>
    );
  }

  // ── PRE-CHECK INTEGRITY MODAL ──
  if (showPreCheck) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none items-center justify-center p-6 relative">
        <div className="max-w-2xl w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-slate-900">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200/80 mb-2 shadow-xs">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">NEET EXAM READINESS CHECK</h2>
            <p className="text-sm text-slate-600 font-medium">
              Verifying system requirements, anti-cheat guards, and full-screen security.
            </p>
          </div>

          <div className="space-y-4">
            {/* 0. Diagrams & Assets Preloading Status */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl border bg-purple-50 text-purple-600 border-purple-200">
                  <Puzzle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Paper Diagrams &amp; Assets</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {assetStatus === 'checking'
                      ? `Preloading question diagrams (${assetProgress.loaded}/${assetProgress.total})...`
                      : `${assetProgress.total > 0 ? `${assetProgress.total} question diagrams cached & ready for instant viewing.` : 'No diagram images required for this paper.'}`}
                  </p>
                </div>
              </div>
              <div>
                {assetStatus === 'checking' ? (
                  <span className="text-xs font-semibold text-slate-500 animate-pulse">Preloading...</span>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Passed</span>
                )}
              </div>
            </div>

            {/* 1. Full Screen Mode Enforced */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl border bg-indigo-50 text-indigo-600 border-indigo-200">
                  <Maximize2 size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Fullscreen Security Mode</h3>
                  <p className="text-xs text-slate-600 font-medium">Exiting fullscreen or taking screenshots will trigger security violations.</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">Auto-Enable</span>
            </div>

            {/* 2. Network Check */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-xl border bg-emerald-50 text-emerald-600 border-emerald-200">
                  <Wifi size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Internet Connection</h3>
                  <p className="text-xs text-slate-600 font-medium">Real-time sync to answer database</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Connected</span>
            </div>

            {/* 3. Anti-cheat guidelines */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-slate-700 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                <AlertCircle size={15} />
                <span>Anti-Cheating Rules:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 font-medium">
                <li>Right-click and copy-paste are strictly disabled.</li>
                <li>Screenshots (PrintScreen / Win+Shift+S / Snipping Tool) trigger a violation.</li>
                <li>Switching windows or tabs will record a violation.</li>
                <li>5 violations will result in automatic exam submission.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartExamFlow}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 size={16} />
            <span>Enter Full Screen &amp; Start NEET Exam</span>
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none overflow-hidden h-screen">
      {/* 1. NTA Topmost Dark Banner */}
      <div className="bg-[#1a1d20] text-yellow-400 font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-wrap items-center justify-between border-b border-slate-800 shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-sm">NEET Mock Test UPDATED AS PER LATEST NTA PATTERN</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <button
            onClick={() => setShowAccessibilityModal(true)}
            className="bg-[#4caf50] hover:bg-[#43a047] text-white px-2 sm:px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer shadow-sm transition text-[11px] sm:text-xs"
          >
            <span>♿</span> <span className="hidden sm:inline">Accessibility</span>
          </button>
          <button
            onClick={() => setShowMagnifierBar(prev => !prev)}
            className={`px-2 sm:px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer shadow-sm transition text-[11px] sm:text-xs ${
              showMagnifierBar ? 'bg-amber-600 ring-2 ring-amber-400 text-white' : 'bg-[#ff9800] hover:bg-[#fb8c00] text-white'
            }`}
          >
            <span>🔍</span> <span className="hidden sm:inline">Screen Magnifier</span>
          </button>
        </div>
      </div>

      {/* Screen Magnifier Floating Control Toolbar */}
      {showMagnifierBar && (
        <ScreenMagnifierBar
          zoomLevel={zoomLevel}
          onZoomChange={(z) => setZoomLevel(z)}
          onClose={() => setShowMagnifierBar(false)}
        />
      )}

      {/* 2. Sub-Header Bar (Paper Badge + Timer) */}
      <div className="bg-[#e2e8f0] text-slate-800 px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-wrap items-center justify-between text-xs border-b border-slate-300 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="bg-[#31708f] text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md font-bold text-[11px] sm:text-xs shadow-sm">
            NEET {year}
          </span>
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="text-slate-600 hover:text-slate-900 text-[11px] sm:text-xs font-semibold cursor-pointer"
          >
            &larr; Exit Exam
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 font-bold text-xs sm:text-sm">
          <span className="text-slate-600 text-[10px] sm:text-xs uppercase tracking-wide hidden sm:inline">Sections</span>
          <div className="bg-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded border border-slate-300 shadow-xs text-xs sm:text-sm">
            Time Left : <span className={`font-mono text-xs sm:text-base font-bold ${examTimeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>{formatTime(examTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3. NTA Section Tabs Bar */}
      <div className="bg-[#f1f5f9] border-b border-slate-300 px-2.5 sm:px-4 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0 no-scrollbar">
        {neetSubjects.map((subj) => (
          <button
            key={subj.name}
            onClick={() => handleSelectSubject(subj.name)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedSubject === subj.name
                ? "bg-[#337ab7] text-white shadow-sm"
                : "bg-white text-[#337ab7] border border-slate-300 hover:bg-blue-50 font-bold"
            }`}
          >
            <span>{subj.name}</span>
            <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono">i</span>
          </button>
        ))}
      </div>

      {/* 4. Question Metadata Bar */}
      <div className="bg-white border-b border-slate-200 px-2.5 sm:px-4 py-1.5 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-slate-700 shrink-0 gap-1">
        <span className="font-semibold">Question Type: <strong className="text-slate-900">Multiple Choice</strong></span>
        <span>Marks for correct: <strong className="text-emerald-600">+4</strong> | Negative: <strong className="text-rose-600">1</strong></span>
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Left Side Panel: Question view & options */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden border-r-0 lg:border-r border-slate-300 w-full min-w-0">
          
          {/* Question No & Bookmark bar */}
          <div className="bg-[#f8fafc] border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">Question No. {currentQuestionIndex + 1}</span>
              {currentQ && (
                <button
                  onClick={handleToggleBookmark}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                    bookmarkedQuestions.has(currentQ.id)
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>🔖</span> <span className="hidden sm:inline">Bookmark</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {currentQ && <ReportErrorButton questionId={currentQ.id} questionTextSnippet={currentQ.questionText} />}
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
              >
                <span>🔢</span> <span className="hidden sm:inline">Palette</span> ({totalCounters.answered}/{questions.length})
              </button>
              <button
                onClick={() => setShowInstructionBox(!showInstructionBox)}
                className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                title="Toggle Instructions"
              >
                {showInstructionBox ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* Section Instruction Box (Collapsible Card) */}
          {showInstructionBox && (
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl m-2 sm:m-4 p-3 sm:p-4 text-xs text-slate-800 space-y-2 shrink-0 shadow-xs">
              <div className="flex justify-between items-center font-bold border-b border-blue-200 pb-2">
                <span className="text-blue-900 text-sm font-extrabold">{selectedSubject} (Maximum Marks: 720)</span>
                <button onClick={() => setShowInstructionBox(false)} className="text-slate-500 hover:text-slate-900">▲</button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px] sm:text-xs font-medium">
                <li>This section contains questions for <strong>{selectedSubject}</strong>.</li>
                <li>Each question has <strong>FOUR</strong> options (A), (B), (C) and (D). <strong>ONLY ONE</strong> option is correct.</li>
                <li>Marking Scheme: <strong>+4</strong> for correct answer, <strong>0</strong> if unattempted, <strong>-1</strong> for incorrect.</li>
              </ul>
            </div>
          )}

          {/* Question and Option Display */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white">
            <div 
              className="max-w-4xl mx-auto space-y-4 sm:space-y-6 transition-all duration-150 w-full min-w-0"
              style={zoomLevel !== 100 ? { zoom: `${zoomLevel}%` } : undefined}
            >
              {currentQ && (
                <>
                  {/* Question card */}
                  <div className={`rounded-2xl p-4 sm:p-6 transition-all break-words min-w-0 ${
                    accessSettings.highContrast === 'yellow-on-black'
                      ? 'bg-black border-2 border-yellow-400 text-yellow-300 font-mono shadow-2xl'
                      : accessSettings.highContrast === 'high-contrast-light'
                      ? 'bg-white border-2 border-slate-900 text-black shadow-2xl'
                      : 'bg-white border border-slate-200/90 text-slate-900 shadow-xs'
                  }`}>
                    <div className={`whitespace-pre-line break-words overflow-x-auto text-slate-900 font-medium ${
                      accessSettings.fontSize === 'large' ? 'text-base sm:text-xl' :
                      accessSettings.fontSize === 'xlarge' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'
                    } ${accessSettings.dyslexicFont ? 'tracking-wider leading-loose font-mono' : 'leading-relaxed'}`}>
                      <LatexRenderer text={currentQ.questionText} />
                    </div>

                    {currentQ.imageUrl && (
                      <div className="mt-4 border border-slate-200 rounded-xl p-2 sm:p-4 bg-slate-50 flex justify-center">
                        <QuestionImage
                          imageUrl={currentQ.imageUrl}
                          examName="neet"
                          alt={`Question ${currentQuestionIndex + 1} Diagram`}
                          className="max-h-60 sm:max-h-72 max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5 sm:space-y-3">
                    {[
                      { key: 'A', text: currentQ.optionA },
                      { key: 'B', text: currentQ.optionB },
                      { key: 'C', text: currentQ.optionC },
                      { key: 'D', text: currentQ.optionD },
                    ].map(({ key, text }) => {
                      if (!text) return null;
                      const isSelected = answers[currentQ.id] === key;
                      
                      let optionBg = 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-800 shadow-xs';
                      if (isSelected) {
                        optionBg = 'bg-blue-50/80 border-2 border-blue-600 text-blue-950 font-bold shadow-xs';
                      }

                      if (accessSettings.highContrast === 'yellow-on-black') {
                        optionBg = isSelected
                          ? 'bg-yellow-400 text-black font-extrabold border-2 border-yellow-300 shadow-lg'
                          : 'bg-black text-yellow-300 border-2 border-yellow-500/80 hover:bg-yellow-950/40';
                      } else if (accessSettings.highContrast === 'high-contrast-light') {
                        optionBg = isSelected
                          ? 'bg-blue-600 text-white font-bold border-2 border-blue-900 shadow-lg'
                          : 'bg-slate-100 text-black border-2 border-slate-900 hover:bg-slate-200';
                      }

                      return (
                        <div
                          key={key}
                          onClick={() => handleOptionChange(key)}
                          className={`group flex items-start sm:items-center p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 ${optionBg} ${
                            accessSettings.highFocusOutline ? 'focus:ring-4 focus:ring-emerald-400' : ''
                          }`}
                        >
                          <span className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg font-bold flex items-center justify-center mr-3 shrink-0 text-xs sm:text-sm transition ${
                            isSelected
                              ? 'bg-[#337ab7] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                          }`}>
                            {key}
                          </span>
                          <div className={`text-xs sm:text-sm break-words min-w-0 flex-1 ${
                            accessSettings.fontSize === 'large' ? 'text-sm sm:text-base' :
                            accessSettings.fontSize === 'xlarge' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                          } ${isSelected ? 'text-blue-950 font-bold' : 'text-slate-800 font-medium'}`}>
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
          <footer className="bg-[#e2e8f0] border-t border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                disabled={!currentQ || !answers[currentQ.id]}
                className="px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 disabled:opacity-40 font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Clear Response
              </button>
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span>🔢</span> Palette ({totalCounters.answered}/{questions.length})
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleNextQuestion}
                className="px-4 sm:px-5 py-2 rounded-lg bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Save &amp; Next
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 sm:px-5 py-2 rounded-lg bg-[#5cb85c] hover:bg-[#449d44] text-white font-bold text-xs transition cursor-pointer shadow-sm"
              >
                Submit
              </button>
            </div>
          </footer>
        </main>

        {/* Mobile Backdrop Overlay */}
        {showMobilePalette && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-fadeIn"
            onClick={() => setShowMobilePalette(false)}
          />
        )}

        {/* 6. NTA Right Sidebar (Profile + Legend + Palette Grid) */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-80 bg-[#f8fafc] border-l border-slate-300 flex flex-col h-full 
          transition-transform duration-300 transform 
          lg:static lg:translate-x-0 lg:z-auto shrink-0
          ${showMobilePalette ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          
          {/* Mobile Drawer Close Header */}
          <div className="lg:hidden p-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>🔢</span> Question Palette ({totalCounters.answered}/{questions.length})
            </span>
            <button 
              onClick={() => setShowMobilePalette(false)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              ✕ Close
            </button>
          </div>

          {/* Candidate Profile Box */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
              <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm truncate max-w-[170px]">{displayName}</p>
              <p className="text-[11px] text-slate-500 font-semibold">Candidate</p>
            </div>
          </div>

          {/* NTA Status Legend Box */}
          <div className="p-3 bg-white border-b border-slate-200 text-xs space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.answered} status="answered" size="sm" />
                <span className="text-slate-700 text-[11px] font-medium">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notAnswered} status="not_answered" size="sm" />
                <span className="text-slate-700 text-[11px] font-medium">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notVisited} status="not_visited" size="sm" />
                <span className="text-slate-700 text-[11px] font-medium">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.marked} status="marked" size="sm" />
                <span className="text-slate-700 text-[11px] font-medium">Marked for Review</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
              <NtaQuestionButton questionNumber={totalCounters.answeredMarked} status="answered_marked" size="sm" />
              <span className="text-slate-700 text-[10px] leading-tight font-medium">
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
                      setShowMobilePalette(false);
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
                      router.replace('/pages/dashboard/neet');
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

      {/* Accessibility & Inclusive Options Modal */}
      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
        settings={accessSettings}
        onUpdateSettings={(newS) => setAccessSettings(prev => ({ ...prev, ...newS }))}
        onSpeakQuestion={speakQuestionText}
        onStopSpeaking={stopSpeaking}
        isSpeaking={isSpeaking}
      />

      {/* Exit Exam Confirmation Modal */}
      <ExitConfirmModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirmExit={() => {
          setShowExitConfirmModal(false);
          router.replace('/pages/dashboard/neet');
        }}
        examName="NEET CBT"
      />
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
