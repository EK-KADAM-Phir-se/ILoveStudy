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
import { CheckCircle2, ShieldCheck, ShieldAlert, Wifi, AlertTriangle } from 'lucide-react';

function TestWorkspacePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || "";
  const name = searchParams.get('name') || "JEE Main Paper";
  const year = parseInt(searchParams.get('year') || "2025", 10);

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
    const q = questions[currentQuestionIndex];
    window.speechSynthesis.cancel();
    const cleanText = (q.questionText || '').replace(/\$/g, '').replace(/\\text\{([^}]+)\}/g, '$1');
    const opts = [
      q.optionA ? `Option A: ${q.optionA.replace(/\$/g, '')}` : '',
      q.optionB ? `Option B: ${q.optionB.replace(/\$/g, '')}` : '',
      q.optionC ? `Option C: ${q.optionC.replace(/\$/g, '')}` : '',
      q.optionD ? `Option D: ${q.optionD.replace(/\$/g, '')}` : '',
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


  // Proctoring states
  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [violationReason, setViolationReason] = useState<string>("");
  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState<boolean>(false);

  // Pre-check states
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
      const saved = sessionStorage.getItem(`submitted_jee_${shiftId}`);
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

  // Load shift on mount if not already completed
  useEffect(() => {
    if (shiftId && !completedResult) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId, completedResult]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const resData = await submitFinalExam();
      setSubmitResult(resData);
      setSubmitSuccess(true);
      if (typeof window !== 'undefined' && shiftId) {
        sessionStorage.setItem(`submitted_jee_${shiftId}`, JSON.stringify(resData));
      }
      setShowAutoSubmitModal(false);
      setShowSubmitModal(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }
    } catch (err) {
      console.error("Failed to submit exam:", err);
      setShowAutoSubmitModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const runPreChecks = async () => {
    setInternetStatus('checking');
    setExtensionStatus('checking');

    // 1. Check internet connectivity
    const online = navigator.onLine;
    let pingOk = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE_URL}/api/exams`, { 
        method: 'HEAD',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      if (res.ok) pingOk = true;
    } catch (e) {
      console.warn("Ping failed, relying on navigator.onLine:", e);
    }
    setInternetStatus(online && pingOk ? 'connected' : (online ? 'limited' : 'disconnected'));

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

    if (typeof window !== 'undefined') {
      if (window.hasOwnProperty('__adobe_pdf_viewer__')) {
        detectedExtensions.push("Adobe Acrobat");
      }
      if (window.hasOwnProperty('tampermonkey') || window.hasOwnProperty('greasemonkey')) {
        detectedExtensions.push("Tampermonkey / Greasemonkey");
      }
    }

    setDetectedExts(detectedExtensions);
    setExtensionStatus(detectedExtensions.length > 0 ? 'warning' : 'clean');

    // 3. Preload all question diagram images
    setAssetStatus('checking');
    try {
      const res = await preloadExamImages(questions, "Jee Mains", year, (loaded, total) => {
        setAssetProgress({ loaded, total });
      });
      setAssetProgress(res);
      setAssetStatus('ready');
    } catch (err) {
      console.warn("Asset preloading encountered an error:", err);
      setAssetStatus('ready');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && !isExamActive) {
      runPreChecks();
    }
  }, [questions]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // If the exam is active and they exited fullscreen, count it as a violation!
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

  // Security restrictions (right-click, screenshots, copy/paste, blur focus loss)
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
          "Attempted PrintScreen action"
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
      setViolationReason("Window focus lost (possible screenshot tool or navigation)");
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

  // Browser Back Button & Swipe-Back Gesture Proctoring Protection
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

  useEffect(() => {
    if (isExamActive && violationsCount >= 5 && !showAutoSubmitModal) {
      setShowAutoSubmitModal(true);
      handleFinalSubmit();
    }
  }, [violationsCount, isExamActive, showAutoSubmitModal]);

  const handleResumeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen auto-enable suppressed by browser permissions:", err);
      });
      setIsFullscreen(true);
    }
    setShowViolationModal(false);
  };


  const startExamAndEnableFullscreen = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Schedule side-effects after this render cycle completes
          setTimeout(() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(err => {
                console.error("Error enabling full-screen:", err);
              });
              setIsFullscreen(true);
            }
            setIsExamActive(true);
            setShowPreCheck(false);
          }, 0);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };


  // Exam stats calculations
  const totalQuestionsCount = questions.length;
  const answeredQuestionsCount = questions.filter(q => answers[q.id]).length;
  const remainingQuestionsCount = totalQuestionsCount - answeredQuestionsCount;
  const unattemptedQuestionsCount = questions.filter(q => !answers[q.id] && !visitedQuestions.has(q.id)).length;

  // 1. Load shift questions from database on mount
  useEffect(() => {
    if (shiftId) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId]);

  // 2. Track visited questions & handle subject initialization when questions load
  useEffect(() => {
    if (questions.length > 0) {
      // Find first available subject and set it
      const uniqueSubjects = Array.from(new Set(questions.map(q => q.subject)));
      if (uniqueSubjects.length > 0 && !uniqueSubjects.includes(selectedSubject)) {
        setSelectedSubject(uniqueSubjects[0]);
      }
    }
  }, [questions]);

  // 3. Mark current question as visited
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      const activeQ = questions[currentQuestionIndex];
      setVisitedQuestions(prev => {
        const next = new Set(prev);
        next.add(activeQ.id);
        return next;
      });
      // Switch tab if the active question index is changed from outside (e.g. clicking global index)
      if (activeQ.subject !== selectedSubject) {
        setSelectedSubject(activeQ.subject);
      }
    }
  }, [currentQuestionIndex, questions]);

  // 4. Per-question timer tracking
  useEffect(() => {
    if (questions.length === 0 || loading || examTimeLeft <= 0 || !isExamActive) return;
    
    const interval = setInterval(() => {
      if (questions[currentQuestionIndex]) {
        const qId = questions[currentQuestionIndex].id;
        setQuestionTimers(prev => ({
          ...prev,
          [qId]: (prev[qId] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions, loading, examTimeLeft, isExamActive]);

  if (completedResult) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{name || `JEE Main ${year}`}</h2>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Exam Session Completed &amp; Evaluated
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-sm text-left">
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400 font-semibold">Total Score:</span>
              <span className="font-extrabold text-emerald-400 text-xl">
                {completedResult.finalScore} / {(completedResult.totalQuestions || 75) * 4}
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
                <span>Review Answers &amp; Solutions</span>
                <span>→</span>
              </button>
            )}

            <button
              onClick={() => router.replace('/pages/dashboard/jee-mains?type=mains')}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Return to JEE Mains Dashboard
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && shiftId) {
                  sessionStorage.removeItem(`submitted_jee_${shiftId}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold tracking-wider animate-pulse">Loading Question Bank...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">No Questions Found</h2>
        <p className="text-gray-400 mb-6">We could not load any questions for this shift from the server.</p>
        <button onClick={() => router.push('/pages/dashboard/jee-mains?type=mains')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (showPreCheck) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none items-center justify-center p-6 relative">
        <div className="max-w-2xl w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-slate-900">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-200/80 mb-2 shadow-xs">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">SYSTEM READINESS CHECK</h1>
            <p className="text-sm text-slate-600 font-medium">Please complete the required system checks to start the exam.</p>
          </div>

          {/* Cards for checks */}
          <div className="space-y-4">
            
            {/* Internet connection check card */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl border ${
                  internetStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  internetStatus === 'checking' ? 'bg-slate-100 text-slate-400 animate-pulse border-slate-200' :
                  'bg-rose-50 text-rose-600 border-rose-200'
                }`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Internet Connectivity</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {internetStatus === 'checking' && 'Checking connection status...'}
                    {internetStatus === 'connected' && 'Secure internet connection established.'}
                    {internetStatus === 'limited' && 'Connection detected, but server response is slow.'}
                    {internetStatus === 'disconnected' && 'No internet connection detected. Please verify link.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {internetStatus === 'checking' && (
                  <span className="text-xs font-semibold text-slate-500 animate-pulse">Checking...</span>
                )}
                {internetStatus === 'connected' && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Passed</span>
                )}
                {internetStatus === 'limited' && (
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Slow</span>
                )}
                {internetStatus === 'disconnected' && (
                  <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">Failed</span>
                )}
              </div>
            </div>

            {/* Extension check card */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex flex-col space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-xl border ${
                    extensionStatus === 'clean' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    extensionStatus === 'checking' ? 'bg-slate-100 text-slate-400 animate-pulse border-slate-200' :
                    'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Browser Integrity (Extensions)</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {extensionStatus === 'checking' && 'Scanning injected styles/scripts...'}
                      {extensionStatus === 'clean' && 'No suspicious extension styles/injectors detected.'}
                      {extensionStatus === 'warning' && `Detected ${detectedExts.length} extensions active.`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {extensionStatus === 'checking' && (
                    <span className="text-xs font-semibold text-slate-500 animate-pulse">Scanning...</span>
                  )}
                  {extensionStatus === 'clean' && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Passed</span>
                  )}
                  {extensionStatus === 'warning' && (
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Warning</span>
                  )}
                </div>
              </div>

              {extensionStatus === 'warning' && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {detectedExts.map((ext, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-mono text-[10px] font-bold">
                        {ext}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                    <strong>Notice:</strong> Browser security sandboxing prevents regular websites from disabling extensions automatically. To ensure exam integrity, please manually disable active extensions (like Grammarly, Adblockers, PDF tools) in browser settings (e.g. <code>chrome://extensions</code>) and click refresh below.
                  </p>
                </div>
              )}
            </div>

            {/* Asset Preloader check card */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl border ${
                  assetStatus === 'ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 animate-pulse border-slate-200'
                }`}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Paper Diagrams &amp; Assets</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {assetStatus === 'checking'
                      ? `Preloading question diagrams (${assetProgress.loaded}/${assetProgress.total})...`
                      : `${assetProgress.total > 0 ? `${assetProgress.total} question diagrams cached & ready for instant 0ms viewing.` : 'No diagram images required for this paper.'}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {assetStatus === 'checking' ? (
                  <span className="text-xs font-semibold text-slate-500 animate-pulse">Preloading...</span>
                ) : (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Ready</span>
                )}
              </div>
            </div>

            {/* Fullscreen check card */}
            <div className="bg-slate-50 border border-slate-200/90 p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Fullscreen Mode</h3>
                  <p className="text-xs text-slate-600 font-medium">Will automatically transition to full screen on exam start.</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">Auto-Enable</span>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex space-x-4 pt-4 border-t border-slate-200">
            <button
              onClick={runPreChecks}
              disabled={internetStatus === 'checking' || extensionStatus === 'checking' || assetStatus === 'checking'}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-extrabold py-3.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
              </svg>
              <span>Refresh Checks</span>
            </button>
            
            <button
              onClick={startExamAndEnableFullscreen}
              disabled={internetStatus === 'disconnected' || countdown !== null}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{countdown !== null ? `Starting in ${countdown}...` : 'Proceed & Start Exam \u2192'}</span>
            </button>
          </div>

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
              <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Starting Exam In</p>
              <div className="text-8xl font-black font-mono text-indigo-400 animate-pulse">{countdown}</div>
              <p className="text-xs text-slate-300 mt-6">All paper assets 100% preloaded &amp; cached. Securing workspace...</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  // Get list of unique subjects
  const subjects = Array.from(new Set(questions.map(q => q.subject)));

  // Get index-based numbers for questions filtered by subject
  const subjectQuestions = questions.filter(q => q.subject === selectedSubject);
  const activeQuestion = questions[currentQuestionIndex];

  // Helper to format remaining time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to toggle full screen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen auto-enable suppressed by browser permissions:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Subject tab click handler
  const handleSubjectTabClick = (sub: string) => {
    setSelectedSubject(sub);
    // Find index of first question in the global list for this subject
    const firstIndex = questions.findIndex(q => q.subject === sub);
    if (firstIndex !== -1) {
      setCurrentQuestionIndex(firstIndex);
    }
  };

  // Question selection from grid
  const handleGridQuestionClick = (qId: string) => {
    const globalIdx = questions.findIndex(q => q.id === qId);
    if (globalIdx !== -1) {
      setCurrentQuestionIndex(globalIdx);
    }
  };

  // Clear current response
  const handleClearResponse = () => {
    if (activeQuestion) {
      selectOption(activeQuestion.id, "");
    }
  };

  // Navigate to previous question of current subject
  const handlePrevQuestion = () => {
    const currentSubIdx = subjectQuestions.findIndex(q => q.id === activeQuestion.id);
    if (currentSubIdx > 0) {
      const prevQ = subjectQuestions[currentSubIdx - 1];
      const globalIdx = questions.findIndex(q => q.id === prevQ.id);
      if (globalIdx !== -1) {
        setCurrentQuestionIndex(globalIdx);
      }
    }
  };

  // Navigate to next question of current subject
  const handleNextQuestion = () => {
    const currentSubIdx = subjectQuestions.findIndex(q => q.id === activeQuestion.id);
    if (currentSubIdx < subjectQuestions.length - 1) {
      const nextQ = subjectQuestions[currentSubIdx + 1];
      const globalIdx = questions.findIndex(q => q.id === nextQ.id);
      if (globalIdx !== -1) {
        setCurrentQuestionIndex(globalIdx);
      }
    }
  };

  // NTA Status helper function
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
    if (activeQuestion) {
      setMarkedForReview(prev => new Set(prev).add(activeQuestion.id));
    }
    handleNextQuestion();
  };

  const handleToggleBookmark = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion.id;
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

  const activeSubjectIndex = subjectQuestions.findIndex(q => q.id === activeQuestion.id);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none overflow-hidden h-screen">
      {/* 1. NTA Topmost Dark/Contrast Banner */}
      <div className="bg-[#1e293b] text-amber-300 font-bold text-xs sm:text-sm px-4 py-2 flex items-center justify-between border-b border-slate-700 shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <span>JEE Main Mock Test UPDATED AS PER LATEST NTA PATTERN</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setShowAccessibilityModal(true)}
            className="bg-[#4caf50] hover:bg-[#43a047] text-white px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer shadow-sm transition"
          >
            <span>♿</span> Accessibility
          </button>
          <button
            onClick={() => setShowMagnifierBar(prev => !prev)}
            className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold cursor-pointer shadow-sm transition ${
              showMagnifierBar ? 'bg-amber-600 ring-2 ring-amber-400 text-white' : 'bg-[#ff9800] hover:bg-[#fb8c00] text-white'
            }`}
          >
            <span>🔍</span> Screen Magnifier
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
      <div className="bg-slate-200/90 text-slate-800 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-300 shrink-0 font-medium">
        <div className="flex items-center gap-3">
          <span className="bg-[#31708f] text-white px-3 py-1 rounded-md font-bold text-xs shadow-sm">
            Jee Main {year}
          </span>
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="text-slate-700 hover:text-slate-900 text-xs font-bold cursor-pointer"
          >
            &larr; Exit Exam
          </button>
        </div>

        <div className="flex items-center gap-4 font-bold text-sm">
          <span className="text-slate-600 text-xs uppercase tracking-wide">Sections</span>
          <div className="bg-white px-3 py-1 rounded border border-slate-300 shadow-inner">
            Time Left : <span className={`font-mono text-base font-bold ${examTimeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-blue-700'}`}>{formatTime(examTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3. NTA Section Tabs Bar */}
      <div className="bg-[#f1f5f9] border-b border-slate-300 px-4 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0">
        {subjects.map((sub) => {
          const subName = sub === 'Math' ? 'Mathematics' : sub;
          return (
            <React.Fragment key={sub}>
              <button
                onClick={() => handleSubjectTabClick(sub)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-[#337ab7] text-white shadow-sm"
                    : "bg-white text-[#337ab7] border border-slate-300 hover:bg-blue-50"
                }`}
              >
                <span>{subName} (Section A)</span>
                <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono">i</span>
              </button>
              <button
                onClick={() => handleSubjectTabClick(sub)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  selectedSubject === sub
                    ? "bg-white text-[#337ab7] border border-slate-300 font-bold"
                    : "bg-white text-[#337ab7] border border-slate-300 opacity-75 hover:opacity-100"
                }`}
              >
                <span>{subName} (Section B)</span>
                <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px] font-mono">i</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* 4. Question Metadata Bar */}
      <div className="bg-white border-b border-slate-300 px-4 py-1.5 flex items-center justify-between text-xs text-slate-700 shrink-0 font-medium">
        <span className="font-semibold">Question Type: <strong className="text-slate-900">Multiple Choice</strong></span>
        <span>Marks for correct answer: <strong className="text-emerald-700">+4</strong> | Negative Marks: <strong className="text-rose-600">1</strong></span>
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden w-full relative bg-slate-100">
        
        {/* Left Side Panel: Question view & options */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-300 w-full min-w-0">
          
          {/* Question No & Bookmark bar */}
          <div className="bg-slate-100 border-b border-slate-300 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-bold text-slate-900 text-xs sm:text-sm">Question No. {activeSubjectIndex + 1}</span>
              <button
                onClick={handleToggleBookmark}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                  bookmarkedQuestions.has(activeQuestion.id)
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>🔖</span> <span className="hidden sm:inline">Bookmark</span>
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ReportErrorButton questionId={activeQuestion.id} questionTextSnippet={activeQuestion.questionText} />
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
              >
                <span>🔢</span> <span className="hidden sm:inline">Palette</span> ({totalCounters.answered}/{questions.length})
              </button>
              <button
                onClick={() => setShowInstructionBox(!showInstructionBox)}
                className="p-1 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                title="Toggle Instructions"
              >
                {showInstructionBox ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* Section Instruction Box (Collapsible Card) */}
          {showInstructionBox && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl m-2 sm:m-4 p-3 sm:p-4 text-xs text-slate-800 space-y-2 shrink-0 shadow-sm">
              <div className="flex justify-between items-center font-bold border-b border-blue-200 pb-2">
                <span className="text-blue-900 text-sm font-extrabold">{selectedSubject === 'Math' ? 'Mathematics' : selectedSubject} (Section A) (Maximum Marks: 80)</span>
                <button onClick={() => setShowInstructionBox(false)} className="text-slate-500 hover:text-slate-800">▲</button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                <li>This section contains <strong>TWENTY (20)</strong> questions.</li>
                <li>Each question has <strong>FOUR</strong> options (A), (B), (C) and (D). <strong>ONLY ONE</strong> of these four options is the correct answer.</li>
                <li>For each question, choose the option corresponding to the correct answer.</li>
                <li>Answer to each question will be evaluated according to the marking scheme: <strong>+4</strong> for correct, <strong>0</strong> if unattempted, <strong>-1</strong> in all other cases.</li>
              </ul>
            </div>
          )}

          {/* Question and Option Display */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white">
            <div 
              className="max-w-4xl mx-auto space-y-4 sm:space-y-6 transition-all duration-150 w-full min-w-0"
              style={zoomLevel !== 100 ? { zoom: `${zoomLevel}%` } : undefined}
            >
              
              {/* Question card */}
              <div className={`rounded-xl p-4 sm:p-6 transition-all break-words min-w-0 ${
                accessSettings.highContrast === 'yellow-on-black'
                  ? 'bg-black border-2 border-yellow-400 text-yellow-300 font-mono shadow-2xl'
                  : 'bg-white border border-slate-300 text-slate-900 shadow-sm'
              }`}>
                <div className={`whitespace-pre-line break-words overflow-x-auto text-slate-900 font-medium ${
                  accessSettings.fontSize === 'large' ? 'text-base sm:text-xl' :
                  accessSettings.fontSize === 'xlarge' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'
                } ${accessSettings.dyslexicFont ? 'tracking-wider leading-loose font-mono' : 'leading-relaxed'}`}>
                  <LatexRenderer text={activeQuestion.questionText} />
                </div>

                {activeQuestion.imageUrl && (
                  <div className="mt-4 border border-slate-200 rounded-lg p-2 sm:p-4 bg-slate-50 flex justify-center">
                    <QuestionImage
                      imageUrl={activeQuestion.imageUrl}
                      examName="Jee Mains"
                      year={year}
                      alt="Question Diagram"
                      className="max-h-60 sm:max-h-72 max-w-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Options or Numerical Input lists */}
              {(() => {
                const getNumericVal = (str?: string | null) => {
                  if (!str) return "";
                  const match = str.toString().match(/\(?[1-4]?\)?\s*(-?\d+(\.\d+)?)/);
                  return match ? match[1] : str.toString().trim();
                };

                const isNumerical =
                  !activeQuestion.optionA ||
                  !activeQuestion.optionB ||
                  !activeQuestion.optionC ||
                  !activeQuestion.optionD ||
                  (getNumericVal(activeQuestion.optionA) === getNumericVal(activeQuestion.optionB));

                if (isNumerical) {
                  return (
                    <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
                      <div className="flex items-center space-x-2">
                        <span className="h-3 w-3 rounded-full bg-blue-600 animate-pulse"></span>
                        <label className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider">
                          Numerical Answer Input
                        </label>
                      </div>
                      <p className="text-xs text-slate-600">
                        This is a Section B Numerical Question. Enter your calculated integer or decimal value below.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="text"
                          value={answers[activeQuestion.id] || ''}
                          onChange={(e) => selectOption(activeQuestion.id, e.target.value)}
                          placeholder="Enter numerical response (e.g., 5120, 14)..."
                          className="w-full sm:w-80 bg-white border border-slate-300 focus:border-blue-600 rounded-xl px-4 py-3 text-slate-900 text-base sm:text-lg font-mono focus:ring-2 focus:ring-blue-500/20 outline-none transition shadow-inner"
                        />
                        {answers[activeQuestion.id] && (
                          <button
                            onClick={() => selectOption(activeQuestion.id, '')}
                            className="px-4 py-3 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Clear Value
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5 sm:space-y-3">
                    {[
                      { key: 'A', value: activeQuestion.optionA },
                      { key: 'B', value: activeQuestion.optionB },
                      { key: 'C', value: activeQuestion.optionC },
                      { key: 'D', value: activeQuestion.optionD }
                    ].map((opt) => {
                      const isSelected = answers[activeQuestion.id] === opt.key;

                      let optionBg = 'bg-white border-slate-300 text-slate-900 hover:border-blue-400 hover:bg-blue-50/40 shadow-xs';
                      if (isSelected) {
                        optionBg = 'bg-blue-50 border-2 border-blue-600 text-blue-950 font-semibold shadow-sm';
                      }

                      if (accessSettings.highContrast === 'yellow-on-black') {
                        optionBg = isSelected
                          ? 'bg-yellow-400 text-black font-extrabold border-2 border-yellow-300 shadow-lg'
                          : 'bg-black text-yellow-300 border-2 border-yellow-500/80 hover:bg-yellow-950/40';
                      }

                      return (
                        <div
                          key={opt.key}
                          onClick={() => selectOption(activeQuestion.id, opt.key)}
                          className={`group flex items-start sm:items-center p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all duration-150 ${optionBg} ${
                            accessSettings.highFocusOutline ? 'focus:ring-4 focus:ring-emerald-400' : ''
                          }`}
                        >
                          <span className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg font-bold flex items-center justify-center mr-3 shrink-0 text-xs sm:text-sm transition ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 border border-slate-300 group-hover:bg-blue-100 group-hover:text-blue-900'
                          }`}>
                            {opt.key}
                          </span>
                          <div className={`text-xs sm:text-sm break-words min-w-0 flex-1 text-slate-900 ${
                            accessSettings.fontSize === 'large' ? 'text-sm sm:text-base' :
                            accessSettings.fontSize === 'xlarge' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                          } ${isSelected ? 'text-blue-950 font-semibold' : 'text-slate-900'}`}>
                            <LatexRenderer text={opt.value} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

            </div>
          </div>

          {/* 5. NTA Bottom Control Bar */}
          <footer className="bg-slate-100 border-t border-slate-300 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                disabled={!answers[activeQuestion.id]}
                className="px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 disabled:opacity-40 font-bold text-xs transition cursor-pointer shadow-xs"
              >
                Clear Response
              </button>
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span>🔢</span> Palette ({totalCounters.answered}/{questions.length})
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleNextQuestion}
                className="px-4 sm:px-5 py-2 rounded-lg bg-[#337ab7] hover:bg-[#286090] text-white font-bold text-xs transition cursor-pointer shadow"
              >
                Save &amp; Next
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 sm:px-5 py-2 rounded-lg bg-[#2e6da4] hover:bg-[#204d74] text-white font-bold text-xs transition cursor-pointer shadow"
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
          fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-300 flex flex-col h-full 
          transition-transform duration-300 transform 
          lg:static lg:translate-x-0 lg:z-auto shrink-0
          ${showMobilePalette ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          
          {/* Mobile Drawer Close Header */}
          <div className="lg:hidden p-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between shrink-0">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>🔢</span> Question Palette ({totalCounters.answered}/{questions.length})
            </span>
            <button 
              onClick={() => setShowMobilePalette(false)}
              className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          {/* Candidate Profile Box */}
          <div className="p-3 bg-slate-100 border-b border-slate-300 flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
              <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm truncate max-w-[170px]">{displayName}</p>
              <p className="text-[11px] text-slate-500 font-medium">Candidate</p>
            </div>
          </div>

          {/* NTA Status Legend Box */}
          <div className="p-3 bg-slate-50 border-b border-slate-300 text-xs space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.answered} status="answered" size="sm" />
                <span className="text-slate-700 text-[11px] font-semibold">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notAnswered} status="not_answered" size="sm" />
                <span className="text-slate-700 text-[11px] font-semibold">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.notVisited} status="not_visited" size="sm" />
                <span className="text-slate-700 text-[11px] font-semibold">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <NtaQuestionButton questionNumber={totalCounters.marked} status="marked" size="sm" />
                <span className="text-slate-700 text-[11px] font-semibold">Marked for Review</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
              <NtaQuestionButton questionNumber={totalCounters.answeredMarked} status="answered_marked" size="sm" />
              <span className="text-slate-700 text-[10px] leading-tight font-semibold">
                Answered &amp; Marked for Review (will be evaluated)
              </span>
            </div>
          </div>

          {/* Active Subject Palette Header */}
          <div className="bg-[#337ab7] text-white p-2.5 text-xs font-bold shrink-0">
            {selectedSubject === 'Math' ? 'Mathematics' : selectedSubject} (Section A)
            <div className="text-[10px] text-blue-100 font-normal">Choose a Question</div>
          </div>

          {/* Question Number Palette Grid */}
          <div className="flex-1 overflow-y-auto p-3 bg-white">
            <div className="grid grid-cols-4 gap-2.5">
              {subjectQuestions.map((q, idx) => {
                const isCurrent = q.id === activeQuestion.id;
                const status = getQuestionStatus(q.id);

                return (
                  <NtaQuestionButton
                    key={q.id}
                    questionNumber={idx + 1}
                    status={status}
                    isSelected={isCurrent}
                    onClick={() => handleGridQuestionClick(q.id)}
                  />
                );
              })}
            </div>
          </div>

        </aside>

      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 transform scale-100 transition-all">
            
            {submitSuccess ? (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Exam Submitted!</h3>
                <p className="text-sm text-slate-400">
                  Your exam has been submitted successfully. Here is your performance:
                </p>

                {submitResult && (
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl divide-y divide-slate-800 text-sm text-left">
                    <div className="flex justify-between items-center p-3">
                      <span className="text-slate-400 font-semibold">Total Score:</span>
                      <span className="font-extrabold text-indigo-400 text-lg">{submitResult.finalScore} / {submitResult.totalQuestions * 4}</span>
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
                      <span>Review Answers</span>
                      <span>→</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      router.replace('/pages/dashboard/jee-mains?type=mains');
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 shadow-lg shadow-indigo-600/10"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-rose-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-bold text-slate-100">Are you sure you want to submit?</h3>
                </div>
                
                <p className="text-sm text-slate-400">
                  You are about to finalize and submit your exam. Once submitted, you cannot change any answers.
                </p>

                {/* Statistics Table */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl divide-y divide-slate-800">
                  <div className="flex justify-between items-center p-3 text-sm">
                    <span className="text-slate-400">Questions Answered:</span>
                    <span className="font-extrabold text-emerald-400 text-base">{answeredQuestionsCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm">
                    <span className="text-slate-400">Questions Remaining:</span>
                    <span className="font-extrabold text-amber-400 text-base">{remainingQuestionsCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm">
                    <span className="text-slate-400">Unattempted Questions:</span>
                    <span className="font-extrabold text-slate-400 text-base">{unattemptedQuestionsCount}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-red-500/20 transition flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Yes, Submit</span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Security Violation Modal */}
      {showViolationModal && isExamActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-955/90 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center">
            
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-500 animate-pulse">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-red-500 tracking-wider uppercase">Exam Security Warning</h3>
              <p className="text-sm text-slate-300 font-medium">
                A system security violation has been recorded!
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2.5 text-left text-xs text-slate-300 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Violation Reason:</span>
                <span className="font-bold text-red-400">{violationReason}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-400 font-semibold">Total Violations Count:</span>
                <span className="font-black text-red-500 text-sm bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{violationsCount}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Exiting fullscreen or using copy/paste/screenshot shortcuts is strictly prohibited during the exam. Please click the button below to resume.
            </p>

            <button
              onClick={handleResumeFullscreen}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-red-500/25 transition duration-150 transform active:translate-y-0.5"
            >
              Resume Exam &amp; Re-enable Fullscreen
            </button>

          </div>
        </div>
      )}

      {/* Auto-Submit Warning Modal */}
      {showAutoSubmitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-955 bg-opacity-95 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 text-center animate-pulse">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-500">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-red-500 tracking-wider uppercase">Exam Terminated</h3>
              <p className="text-sm text-slate-300 font-medium">
                Maximum violations limit (5) exceeded.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Your exam responses are being automatically submitted. Please wait...
            </p>
            <div className="flex items-center justify-center space-x-2 text-indigo-400 font-bold text-sm">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
              <span>Submitting exam...</span>
            </div>
          </div>
        </div>
      )}

      {/* Render lazy-loaded Review Modal when requested */}
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
          router.replace('/pages/dashboard/jee-mains?type=mains');
        }}
        examName="JEE Main CBT"
      />
    </div>
  );
}

export default function TestWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading workspace...</div>}>
      <TestWorkspacePageContent />
    </Suspense>
  );
}
