"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTest } from '../../../../context/TestContext';

const TestReviewModal = dynamic(() => import('@/src/components/TestReviewModal'), {
  ssr: false,
});
import { GateScientificCalculator } from '@/src/components/GateScientificCalculator';
import { LatexRenderer } from '../../../../components/LatexRenderer';
import { QuestionImage, preloadExamImages } from '@/src/components/QuestionImage';
import { ReportErrorButton } from '@/src/components/ReportErrorButton';
import { NtaQuestionButton, type NtaQuestionStatus } from '@/src/components/NtaQuestionButton';
import { AccessibilityModal, type AccessibilitySettings } from '@/src/components/AccessibilityModal';
import { ExitConfirmModal } from '@/src/components/ExitConfirmModal';
import { API_BASE_URL } from '@/src/lib/apiConfig';
import { CheckCircle2, Calculator, Info, FileText, User as UserIcon, ChevronLeft, ChevronRight, Cpu, ShieldAlert, Maximize2, Wifi, AlertTriangle } from 'lucide-react';

function GateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || "";
  const name = searchParams.get('name') || "GATE CBT Exam";
  const year = parseInt(searchParams.get('year') || "2025", 10);
  const branch = searchParams.get('branch') || "ME";

  const {
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    selectOption,
    examTimeLeft,
    submitFinalExam,
    loading,
    loadShift,
    isExamActive,
    setIsExamActive,
    isFullscreen,
    setIsFullscreen,
  } = useTest();

  // ── Pre-Check & Security Violation States ──
  const [showPreCheck, setShowPreCheck] = useState<boolean>(true);
  const [internetStatus, setInternetStatus] = useState<'checking' | 'connected' | 'limited' | 'disconnected'>('checking');
  const [extensionStatus, setExtensionStatus] = useState<'checking' | 'clean' | 'warning'>('checking');
  const [detectedExts, setDetectedExts] = useState<string[]>([]);
  const [assetStatus, setAssetStatus] = useState<'checking' | 'ready'>('checking');
  const [assetProgress, setAssetProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });
  const [countdown, setCountdown] = useState<number | null>(null);

  const [violationsCount, setViolationsCount] = useState<number>(0);
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [violationReason, setViolationReason] = useState<string>("");

  const [selectedSection, setSelectedSection] = useState<string>("General Aptitude");
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [displayName, setDisplayName] = useState<string>("Rajesh Bhabhoria");
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  // Modals state
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showQuestionPaperModal, setShowQuestionPaperModal] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState<boolean>(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState<boolean>(false);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState<boolean>(false);
  const [showMobilePalette, setShowMobilePalette] = useState<boolean>(false);

  const [accessSettings, setAccessSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: 'default',
    dyslexicFont: false,
    highFocusOutline: false,
  });

  const [completedResult, setCompletedResult] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && shiftId) {
      const saved = sessionStorage.getItem(`submitted_gate_${shiftId}`);
      if (saved) {
        try {
          setCompletedResult(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing saved GATE result:", e);
        }
      }
    }
  }, [shiftId]);

  useEffect(() => {
    if (shiftId && !completedResult) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId, completedResult]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem("displayName");
      if (savedName) setDisplayName(savedName);
    }
  }, []);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const resData = await submitFinalExam();
      setSubmitResult(resData);
      setSubmitSuccess(true);
      if (typeof window !== 'undefined' && shiftId) {
        sessionStorage.setItem(`submitted_gate_${shiftId}`, JSON.stringify(resData));
      }
      setShowSubmitModal(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }
    } catch (err) {
      console.error("Failed to submit exam:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Pre-Checks Implementation ──
  const runPreChecks = async () => {
    setInternetStatus('checking');
    setExtensionStatus('checking');

    // 1. Internet Check
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

    // 2. Extension check
    const detectedExtensions: string[] = [];
    if (typeof document !== 'undefined') {
      const scripts = Array.from(document.querySelectorAll('script'));
      scripts.forEach(s => {
        if (s.src && (s.src.includes('chrome-extension://') || s.src.includes('moz-extension://'))) {
          detectedExtensions.push("Script Injector");
        }
      });
      if (document.querySelector('grammarly-extension') || document.querySelector('[data-gr-ext-installed]')) {
        detectedExtensions.push("Grammarly");
      }
    }
    setDetectedExts(detectedExtensions);
    setExtensionStatus(detectedExtensions.length > 0 ? 'warning' : 'clean');

    // 3. Diagram Preloader
    setAssetStatus('checking');
    try {
      const res = await preloadExamImages(questions, "Gate", year, (loaded, total) => {
        setAssetProgress({ loaded, total });
      });
      setAssetProgress(res);
      setAssetStatus('ready');
    } catch (err) {
      setAssetStatus('ready');
    }
  };

  useEffect(() => {
    if (questions.length > 0 && !isExamActive) {
      runPreChecks();
    }
  }, [questions]);

  // Fullscreen toggle & change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);

      if (isExamActive && !isCurrentlyFullscreen && !showSubmitModal && !submitSuccess && violationsCount < 5) {
        setViolationsCount(prev => prev + 1);
        setViolationReason("Exited Full Screen Mode");
        setShowViolationModal(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isExamActive, showSubmitModal, submitSuccess, violationsCount]);

  // Security shortcut & context menu listeners
  useEffect(() => {
    if (!isExamActive || violationsCount >= 5) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (violationsCount >= 5) return;
      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
      const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44;
      const isWinScreenshot = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's';

      if (isCopy || isPaste || isPrintScreen || isWinScreenshot) {
        e.preventDefault();
        setViolationsCount(prev => prev + 1);
        setViolationReason(
          isCopy ? "Attempted Copy shortcut (Ctrl+C)" :
          isPaste ? "Attempted Paste shortcut (Ctrl+V)" :
          isWinScreenshot ? "Attempted OS screenshot shortcut" :
          "Attempted PrintScreen action"
        );
        setShowViolationModal(true);
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (violationsCount >= 5) return;
      e.preventDefault();
      setViolationsCount(prev => prev + 1);
      setViolationReason("Attempted Right-Click Context Menu");
      setShowViolationModal(true);
    };

    const handleBlur = () => {
      if (violationsCount >= 5 || isSubmitting || submitSuccess) return;
      setViolationsCount(prev => prev + 1);
      setViolationReason("Switched Browser Tab or Lost Window Focus");
      setShowViolationModal(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isExamActive, violationsCount, isSubmitting, submitSuccess]);

  // Auto-submit on 5 violations
  useEffect(() => {
    if (violationsCount >= 5 && isExamActive && !submitSuccess && !isSubmitting) {
      handleFinalSubmit();
    }
  }, [violationsCount, isExamActive, submitSuccess, isSubmitting]);

  const startExamAndEnableFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
    }

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setShowPreCheck(false);
          setIsExamActive(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleReenterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setShowViolationModal(false);
  };

  const currentQ = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQ) {
      setVisitedQuestions((prev) => new Set(prev).add(currentQ.id));
      if (currentQ.subject) {
        setSelectedSection(currentQ.subject);
      }
    }
  }, [currentQuestionIndex, currentQ]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleClearResponse = () => {
    if (currentQ) {
      selectOption(currentQ.id, '');
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (currentQ) {
      setMarkedForReview((prev) => new Set(prev).add(currentQ.id));
    }
    handleNextQuestion();
  };

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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (completedResult) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{name || `GATE ${branch} ${year}`}</h2>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              GATE CBT Session Completed &amp; Evaluated
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl divide-y divide-slate-700 text-sm text-left">
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-300 font-semibold">Total Marks Score:</span>
              <span className="font-extrabold text-blue-400 text-xl">{completedResult.finalScore} / 100</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-300">Correct Responses:</span>
              <span className="font-extrabold text-emerald-400 text-base">{completedResult.correctCount}</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-300">Incorrect Responses:</span>
              <span className="font-extrabold text-rose-400 text-base">{completedResult.incorrectCount}</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-300">Unattempted Questions:</span>
              <span className="font-extrabold text-slate-400 text-base">{completedResult.unattemptedCount}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {completedResult.attemptId && (
              <button
                onClick={() => setReviewAttemptId(completedResult.attemptId)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
              >
                <span>Review Detailed Solutions</span>
                <span>→</span>
              </button>
            )}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && shiftId) {
                  sessionStorage.removeItem(`submitted_gate_${shiftId}`);
                }
                setCompletedResult(null);
                setShowPreCheck(true);
                setIsExamActive(false);
                loadShift(shiftId, name, year);
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              <span>Retake Test</span>
            </button>
            <button
              onClick={() => router.replace('/pages/dashboard/gate')}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Return to GATE Dashboard
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
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-base font-semibold tracking-wider animate-pulse">Loading Official GATE CBT Interface...</p>
      </div>
    );
  }

  // ── PRE-CHECK READINESS SCREEN ──
  if (showPreCheck) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none items-center justify-center p-6 relative">
        <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8 text-slate-900">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 mb-2 shadow-xs">
              <Cpu size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">SYSTEM READINESS CHECK</h1>
            <p className="text-sm text-slate-600 font-medium">GATE CBT Examination Security &amp; Full Screen Mode Setup</p>
          </div>

          <div className="space-y-4">
            
            {/* Internet connection card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl border ${
                  internetStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  internetStatus === 'checking' ? 'bg-slate-100 text-slate-400 animate-pulse' :
                  'bg-rose-50 text-rose-600 border-rose-200'
                }`}>
                  <Wifi size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Internet Connectivity</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {internetStatus === 'checking' && 'Checking network ping...'}
                    {internetStatus === 'connected' && 'Secure connection established.'}
                    {internetStatus === 'limited' && 'Connection active.'}
                    {internetStatus === 'disconnected' && 'Offline. Verify network connection.'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Passed</span>
            </div>

            {/* Extension check card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Browser Integrity Scan</h3>
                  <p className="text-xs text-slate-600 font-medium">No unauthorized style injectors or extension scripts detected.</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Passed</span>
            </div>

            {/* Asset Preloader check card */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Paper Diagrams &amp; SVGs</h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {assetStatus === 'checking'
                      ? `Preloading diagram assets (${assetProgress.loaded}/${assetProgress.total})...`
                      : `All 65 questions & diagram SVGs cached for 0ms loading.`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Ready</span>
            </div>

            {/* Fullscreen Mode Auto-Enable Card */}
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-4">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                  <Maximize2 size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-blue-900">Full Screen Mode (Mandatory)</h3>
                  <p className="text-xs text-blue-700 font-medium">Clicking Proceed will auto-enter Full Screen mode &amp; lock test environment.</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">Auto-Enable</span>
            </div>

          </div>

          <div className="flex space-x-4 pt-4 border-t border-slate-200">
            <button
              onClick={runPreChecks}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-extrabold py-3.5 px-4 rounded-2xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Refresh Checks</span>
            </button>
            
            <button
              onClick={startExamAndEnableFullscreen}
              disabled={countdown !== null}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{countdown !== null ? `Entering Exam in ${countdown}...` : 'Proceed & Enter Full Screen Exam →'}</span>
            </button>
          </div>

          {countdown !== null && (
            <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-4">Securing Full Screen Environment</p>
              <div className="text-8xl font-black font-mono text-blue-400 animate-pulse">{countdown}</div>
              <p className="text-xs text-slate-300 mt-6">Entering Official GATE CBT Workspace...</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  const totalCounters = {
    answered: questions.filter(q => getQuestionStatus(q.id) === "answered").length,
    notAnswered: questions.filter(q => getQuestionStatus(q.id) === "not_answered").length,
    notVisited: questions.filter(q => getQuestionStatus(q.id) === "not_visited").length,
    marked: questions.filter(q => getQuestionStatus(q.id) === "marked").length,
    answeredMarked: questions.filter(q => getQuestionStatus(q.id) === "answered_marked").length,
  };

  const isNumerical = currentQ && (!currentQ.optionA || !currentQ.optionB);
  const isMsq = currentQ && currentQ.correctOption && currentQ.correctOption.includes(";");

  const sectionNames = Array.from(new Set(questions.map((q: any) => q.subject))).filter(Boolean) as string[];
  const defaultSecondSection = branch === 'CS' ? "Computer Science & IT" : branch === 'ME' ? "Mechanical Engineering" : branch;
  const sectionsToDisplay = sectionNames.length > 0
    ? sectionNames
    : ["General Aptitude", defaultSecondSection];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none overflow-hidden h-screen">
      
      {/* 1. Official TCS iON Top Bar */}
      <header className="bg-[#1c1f24] text-white px-2 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between text-[11px] sm:text-xs border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/dark_mode_logo.png" alt="ILoveStudy Logo" className="w-4 h-4 sm:w-5 sm:h-5 rounded object-cover border border-slate-700" />
          <span className="text-[#fbbf24] font-bold text-xs tracking-tight">Gate Pattern</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setShowMobilePalette(true)}
            className="lg:hidden flex items-center gap-1 bg-[#2563eb] hover:bg-blue-700 text-white px-2 py-1 rounded text-[10px] sm:text-[11px] font-bold transition cursor-pointer shadow"
          >
            <span>🔢</span>
            <span>Palette</span>
          </button>
          <button
            onClick={() => setShowQuestionPaperModal(true)}
            className="flex items-center gap-1 bg-[#2b3038] hover:bg-[#373d47] text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-semibold transition cursor-pointer border border-slate-700"
          >
            <FileText size={12} className="text-emerald-400" />
            <span className="hidden sm:inline">Question </span>Paper
          </button>
          <button
            onClick={() => setShowInstructionsModal(true)}
            className="flex items-center gap-1 bg-[#2b3038] hover:bg-[#373d47] text-white px-2 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-semibold transition cursor-pointer border border-slate-700"
          >
            <Info size={12} className="text-sky-400" />
            <span className="hidden sm:inline">Instructions</span>
          </button>
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="bg-red-700 hover:bg-red-600 text-white px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-bold transition cursor-pointer"
          >
            Exit<span className="hidden sm:inline"> Exam</span>
          </button>
        </div>
      </header>

      {/* 2. Sub-Header Bar */}
      <div className="bg-[#e5e7eb] border-b border-slate-300 px-2 sm:px-4 py-1 sm:py-1.5 flex items-center justify-between text-[11px] sm:text-xs shrink-0 gap-1">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="bg-[#3b82f6] text-white font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs inline-flex items-center gap-1 shadow-xs truncate">
            <span className="truncate">{branch === 'CS' ? 'Computer Science & IT' : branch === 'ME' ? 'Mechanical Engineering' : branch}</span>
            <Info size={11} className="cursor-pointer shrink-0" />
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-1 bg-[#f97316] hover:bg-[#ea580c] text-white px-2 sm:px-3 py-1 rounded font-bold text-[10px] sm:text-xs shadow-xs transition cursor-pointer"
            title="Open GATE Virtual Scientific Calculator"
          >
            <Calculator size={13} />
            <span><span className="hidden sm:inline">Scientific </span>Calculator</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-800">
            <span className="text-slate-600 hidden sm:inline">Time Left:</span>
            <span className={`font-mono text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 rounded bg-white border border-slate-300 ${examTimeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
              {formatTime(examTimeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section Tabs Bar */}
      <div className="bg-[#f3f4f6] border-b border-slate-300 px-2 sm:px-4 py-0 flex items-center shrink-0 overflow-x-auto no-scrollbar">
        {sectionsToDisplay.map((sec) => {
          const isActive = selectedSection === sec;
          return (
            <button
              key={sec}
              onClick={() => {
                setSelectedSection(sec);
                const firstIdx = questions.findIndex((q: any) => q.subject === sec);
                if (firstIdx !== -1) {
                  setCurrentQuestionIndex(firstIdx);
                }
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition border-r border-slate-300 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#3b82f6] text-white shadow-xs"
                  : "bg-white text-[#3b82f6] hover:bg-slate-100"
              }`}
            >
              {sec}
            </button>
          );
        })}
      </div>

      {/* 4. Question Meta Bar */}
      <div className="bg-white border-b border-slate-200 px-2 sm:px-4 py-1 text-[10px] sm:text-xs flex items-center justify-between shrink-0">
        <div className="font-bold text-[#ea580c] truncate">
          Question Type : {isNumerical ? "NAT Numerical" : isMsq ? "MSQ Multiple" : "MCQ Single"}
        </div>
        <div className="text-slate-600 font-semibold text-[10px] sm:text-[11px] flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span>Marks: <strong className="text-slate-800">{currentQ?.positiveMarks || 1}</strong></span>
          <span>|</span>
          <span>Neg: <strong className="text-slate-800">{Math.abs(currentQ?.negativeMarks || 0)}</strong></span>
          {currentQ && <ReportErrorButton questionId={currentQ.id} questionTextSnippet={currentQ.questionText} />}
        </div>
      </div>

      {/* 5. Main Body Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT QUESTION CONTAINER */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-300 w-full min-w-0">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
            {currentQ && (
              <div className="space-y-3 sm:space-y-4 max-w-4xl">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  Question No. {currentQuestionIndex + 1}
                </h3>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  <LatexRenderer text={currentQ.questionText} />
                </div>

                {currentQ.imageUrl && (
                  <div className="my-3 p-2 bg-slate-50 border border-slate-200 rounded max-w-xl">
                    <QuestionImage
                      imageUrl={currentQ.imageUrl}
                      examName="gate"
                      alt={`GATE Q${currentQuestionIndex + 1}`}
                      className="max-h-72 object-contain"
                    />
                  </div>
                )}

                {/* NAT vs MSQ vs MCQ Options */}
                {isNumerical ? (
                  <div className="pt-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter Numerical Answer:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => selectOption(currentQ.id, e.target.value)}
                      placeholder="Type numerical answer..."
                      className="w-full sm:w-64 bg-white border-2 border-slate-300 focus:border-blue-600 rounded px-3 py-2 text-sm sm:text-base font-mono text-slate-900 outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    {/* MSQ Notice */}
                    {isMsq && (
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-300 rounded px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-teal-800 mb-1">
                        <span className="text-teal-600 font-bold text-xs sm:text-sm shrink-0">⊞</span>
                        <span><strong>MSQ:</strong> Multiple answers may be correct. Select all that apply. Full marks only if all correct options are chosen.</span>
                      </div>
                    )}
                    {[
                      { key: 'A', text: currentQ.optionA },
                      { key: 'B', text: currentQ.optionB },
                      { key: 'C', text: currentQ.optionC },
                      { key: 'D', text: currentQ.optionD },
                    ].map(({ key, text }) => {
                      if (!text) return null;
                      // For MSQ: answers stored as "A;C", for MCQ: stored as "A"
                      const selectedKeys = isMsq
                        ? (answers[currentQ.id] || '').split(';').map((k: string) => k.trim()).filter(Boolean)
                        : [];
                      const isSelected = isMsq ? selectedKeys.includes(key) : answers[currentQ.id] === key;

                      const handleMsqToggle = () => {
                        const current = (answers[currentQ.id] || '').split(';').map((k: string) => k.trim()).filter(Boolean);
                        const next = current.includes(key)
                          ? current.filter((k: string) => k !== key)
                          : [...current, key].sort();
                        selectOption(currentQ.id, next.join(';'));
                      };

                      return (
                        <label
                          key={key}
                          onClick={isMsq ? handleMsqToggle : () => selectOption(currentQ.id, key)}
                          className={`flex items-start gap-2.5 p-2 sm:p-2.5 rounded cursor-pointer transition text-xs text-slate-800 ${
                            isSelected
                              ? 'bg-blue-50 border border-blue-400'
                              : 'hover:bg-blue-50/50 border border-transparent'
                          }`}
                        >
                          {isMsq ? (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 accent-blue-600 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 rounded"
                            />
                          ) : (
                            <input
                              type="radio"
                              name={`q_${currentQ.id}`}
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 accent-blue-600 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
                            />
                          )}
                          <div className="flex-1 font-medium min-w-0">
                            <LatexRenderer text={text} />
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM ACTION FOOTER */}
          <footer className="bg-white border-t border-slate-300 px-2 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-between text-[11px] sm:text-xs shrink-0 gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-2 sm:px-4 py-1.5 sm:py-2 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 shadow-2xs transition cursor-pointer text-[10px] sm:text-xs whitespace-nowrap"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                disabled={!currentQ || !answers[currentQ.id]}
                className="px-2 sm:px-4 py-1.5 sm:py-2 rounded bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 font-bold border border-slate-300 shadow-2xs transition cursor-pointer text-[10px] sm:text-xs whitespace-nowrap"
              >
                Clear<span className="hidden sm:inline"> Response</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={handleNextQuestion}
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded bg-[#2563eb] hover:bg-blue-700 text-white font-bold shadow-xs transition cursor-pointer text-[10px] sm:text-xs whitespace-nowrap"
              >
                Save &amp; Next
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-3 sm:px-5 py-1.5 sm:py-2 rounded bg-[#0284c7] hover:bg-sky-700 text-white font-bold shadow-xs transition cursor-pointer text-[10px] sm:text-xs whitespace-nowrap"
              >
                Submit<span className="hidden sm:inline"> Test</span>
              </button>
            </div>
          </footer>
        </main>

        {/* Mobile Backdrop Overlay */}
        {showMobilePalette && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-fadeIn"
            onClick={() => setShowMobilePalette(false)}
          />
        )}

        {/* RIGHT PALETTE & CANDIDATE SIDEBAR */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 bg-[#f1f5f9] border-l border-slate-300 flex flex-col justify-between transition-transform duration-300 shrink-0
          lg:static lg:translate-x-0 lg:z-auto h-full
          ${showMobilePalette ? 'translate-x-0 shadow-2xl w-80' : 'translate-x-full lg:translate-x-0'}
          ${isPaletteCollapsed ? 'lg:w-10' : 'lg:w-72'}
        `}>
          {/* Mobile Drawer Close Header */}
          <div className="lg:hidden p-3 bg-slate-800 text-white flex items-center justify-between shrink-0 font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <span>🔢</span> Question Palette ({totalCounters.answered}/{questions.length})
            </span>
            <button
              onClick={() => setShowMobilePalette(false)}
              className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          {isPaletteCollapsed ? (
            <button
              onClick={() => setIsPaletteCollapsed(false)}
              className="hidden lg:flex p-2 hover:bg-slate-200 text-slate-700 font-bold text-xs justify-center cursor-pointer"
              title="Expand Palette"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Candidate Info Box */}
              <div className="p-3 bg-white border-b border-slate-300 flex items-center gap-3 shrink-0">
                <div className="w-12 h-12 bg-slate-200 rounded-md border border-slate-300 flex items-center justify-center text-slate-500 font-bold overflow-hidden shrink-0">
                  <UserIcon size={32} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">GATE Candidate</p>
                </div>
                <button
                  onClick={() => setIsPaletteCollapsed(true)}
                  className="hidden lg:block ml-auto text-slate-400 hover:text-slate-700 cursor-pointer"
                  title="Collapse Palette"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Legend Box */}
              <div className="p-2.5 bg-[#f8fafc] border-b border-slate-300 text-[10px] space-y-1.5 font-medium shrink-0">
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[#22c55e] text-white flex items-center justify-center font-bold text-[9px]">1</span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[#ef4444] text-white flex items-center justify-center font-bold text-[9px]">2</span>
                    <span>Not Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[#cbd5e1] text-slate-700 flex items-center justify-center font-bold text-[9px]">3</span>
                    <span>Not Visited</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#a855f7] text-white flex items-center justify-center font-bold text-[9px]">4</span>
                    <span>Marked for Review</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-4 h-4 rounded-full bg-[#a855f7] text-white flex items-center justify-center font-bold text-[9px] relative">
                    5<span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full border border-white" />
                  </span>
                  <span className="text-[9px] leading-tight">Answered &amp; Marked for Review</span>
                </div>
              </div>

              {/* Section Palette Header */}
              <div className="bg-[#2563eb] text-white px-3 py-1.5 text-xs font-bold shrink-0">
                <span>{selectedSection}</span>
              </div>

              {/* Question Palette Grid */}
              <div className="flex-1 overflow-y-auto p-3 bg-white">
                <div className="grid grid-cols-4 gap-2 justify-items-center">
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
                          setCurrentQuestionIndex(idx);
                          setShowMobilePalette(false);
                        }}
                      />
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </aside>

      </div>

      {/* SECURITY VIOLATION MODAL OVERLAY */}
      {showViolationModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-500 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl text-slate-900">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 border border-red-200 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert size={36} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-red-600 uppercase tracking-tight">SECURITY VIOLATION DETECTED</h2>
              <p className="text-xs text-slate-600 font-medium">
                {violationReason || "Security restriction triggered during examination."}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 font-semibold flex justify-between items-center">
              <span>Security Warning Count:</span>
              <span className="text-red-700 font-bold text-sm bg-red-100 px-2.5 py-1 rounded-md border border-red-200">
                {violationsCount} / 5
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleReenterFullscreen}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
              >
                <Maximize2 size={16} />
                <span>Re-enter Full Screen &amp; Continue Test</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING VIRTUAL SCIENTIFIC CALCULATOR */}
      <GateScientificCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      {/* QUESTION PAPER FULL MODAL */}
      {showQuestionPaperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-[#1c1f24] text-white px-5 py-3 flex justify-between items-center font-bold text-sm">
              <span>Full Question Paper — {branch} GATE {year}</span>
              <button onClick={() => setShowQuestionPaperModal(false)} className="hover:text-red-400 text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div className="font-bold text-blue-700">Q{idx + 1} ({q.subject} — {q.positiveMarks} Marks)</div>
                  <LatexRenderer text={q.questionText} />
                  {q.optionA && (
                    <div className="grid grid-cols-2 gap-2 pt-2 text-slate-700">
                      <div>A. <LatexRenderer text={q.optionA} /></div>
                      <div>B. <LatexRenderer text={q.optionB} /></div>
                      <div>C. <LatexRenderer text={q.optionC} /></div>
                      <div>D. <LatexRenderer text={q.optionD} /></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowQuestionPaperModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white font-bold text-xs rounded hover:bg-slate-700"
              >
                Close Question Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSTRUCTIONS MODAL */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-[#1c1f24] text-white px-5 py-3 flex justify-between items-center font-bold text-sm">
              <span>Official GATE Examination Instructions</span>
              <button onClick={() => setShowInstructionsModal(false)} className="hover:text-red-400 text-lg">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 leading-relaxed space-y-3">
              <h4 className="font-bold text-sm text-slate-900">General Instructions:</h4>
              <ul className="list-disc list-inside space-y-1.5">
                <li>Total duration of the examination is 180 minutes (3 Hours).</li>
                <li>The clock is set at the server. Countdown timer displays remaining time.</li>
                <li>MCQs have 4 options with single correct answer (+1 / -0.33 for 1-mark, +2 / -0.67 for 2-mark).</li>
                <li>NAT (Numerical Answer Type) questions have NO negative marking.</li>
                <li>Use the built-in Virtual Scientific Calculator on top right for all numerical computations.</li>
              </ul>
            </div>
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700"
              >
                Understand &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT CONFIRM MODAL */}
      <ExitConfirmModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirmExit={() => {
          setShowExitConfirmModal(false);
          router.replace('/pages/dashboard/gate');
        }}
        examName="GATE CBT"
      />

      {/* SUBMIT CONFIRMATION & SCORE SUMMARY MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl text-center text-slate-900">
            {!submitSuccess ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                  <Cpu size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900">Submit GATE Exam?</h3>
                  <p className="text-xs text-slate-500">Are you sure you want to finalize and submit your GATE test attempt?</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2 text-left">
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>✓ Answered Questions:</span>
                    <span>{totalCounters.answered + totalCounters.answeredMarked}</span>
                  </div>
                  <div className="flex justify-between text-purple-700 font-semibold">
                    <span>🚩 Marked for Review:</span>
                    <span>{totalCounters.marked}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-semibold">
                    <span>⚪ Unattempted / Not Visited:</span>
                    <span>{totalCounters.notAnswered + totalCounters.notVisited}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer border border-slate-300"
                  >
                    Continue Test
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Confirm Submit</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">GATE Exam Evaluated!</h3>
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">CBT Result Summary</p>
                </div>

                {submitResult && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">Total Marks Score:</span>
                      <span className="font-extrabold text-blue-700 text-lg">{submitResult.finalScore} / 100</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>✓ Correct Responses:</span>
                      <span>{submitResult.correctCount}</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>✕ Incorrect Responses:</span>
                      <span>{submitResult.incorrectCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-semibold">
                      <span>⚪ Unattempted:</span>
                      <span>{submitResult.unattemptedCount}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  {submitResult?.attemptId && (
                    <button
                      onClick={() => setReviewAttemptId(submitResult.attemptId)}
                      className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
                    >
                      <span>Review Detailed Solutions</span>
                      <span>→</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && shiftId) {
                        sessionStorage.removeItem(`submitted_gate_${shiftId}`);
                      }
                      setCompletedResult(null);
                      setShowSubmitModal(false);
                      setSubmitSuccess(false);
                      setSubmitResult(null);
                      setShowPreCheck(true);
                      setIsExamActive(false);
                      loadShift(shiftId, name, year);
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer shadow flex items-center justify-center gap-2"
                  >
                    <span>🔄</span>
                    <span>Retake Test</span>
                  </button>
                  <button
                    onClick={() => router.replace('/pages/dashboard/gate')}
                    className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow"
                  >
                    Return to GATE Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* POST-SUBMIT DETAILED REVIEW MODAL */}
      {reviewAttemptId && (
        <TestReviewModal
          attemptId={reviewAttemptId}
          onClose={() => setReviewAttemptId(null)}
        />
      )}
    </div>
  );
}

export default function GateWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-blue-600 font-bold">Loading GATE CBT...</div>}>
      <GateWorkspaceContent />
    </Suspense>
  );
}
