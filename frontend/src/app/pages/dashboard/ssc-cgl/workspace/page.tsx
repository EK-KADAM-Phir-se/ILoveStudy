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
import { API_BASE_URL } from '@/src/lib/apiConfig';

interface PartConfig {
  id: string;
  partLabel: string;
  subjectName: string;
}

const PARTS: PartConfig[] = [
  { id: 'PART-A', partLabel: 'PART-A', subjectName: 'General Intelligence and Reasoning' },
  { id: 'PART-B', partLabel: 'PART-B', subjectName: 'General Awareness' },
  { id: 'PART-C', partLabel: 'PART-C', subjectName: 'Quantitative Aptitude' },
  { id: 'PART-D', partLabel: 'PART-D', subjectName: 'English Comprehension' }
];

function SscTestWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || "";
  const name = searchParams.get('name') || "SSC CGL Tier-I 2024";
  const year = parseInt(searchParams.get('year') || "2024", 10);

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

  const [selectedSubject, setSelectedSubject] = useState<string>("General Intelligence and Reasoning");
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [candidateName, setCandidateName] = useState<string>("Candidate Name");
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showMobilePalette, setShowMobilePalette] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("displayName") || localStorage.getItem("userName") || localStorage.getItem("user");
      if (saved) setCandidateName(saved);
    }
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  const [reviewAttemptId, setReviewAttemptId] = useState<string | null>(null);

  // Per-Section Timer State (15 Mins = 900 Seconds per section, 60 Mins Total)
  const [sectionTimeLeft, setSectionTimeLeft] = useState<Record<string, number>>({
    "General Intelligence and Reasoning": 900,
    "General Awareness": 900,
    "Quantitative Aptitude": 900,
    "English Comprehension": 900
  });

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
  const [detectedExts, setDetectedExts] = useState<string[]>([]);
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>("English");

  const cleanText = (str: string) => {
    if (!str) return '';
    return str
      .replace(/Maths By Gagan Pratap Sir/gi, '')
      .replace(/Click To Join Telegram - Maths By Gagan Pratap Sir/gi, '')
      .replace(/Click To Join Telegram -/gi, '')
      .replace(/Telegram -/gi, '')
      .trim();
  };

  const checkIsImageOption = (val: string) => {
    if (!val) return false;
    const v = val.toLowerCase().trim();
    return (
      v.startsWith('data:image') ||
      v.startsWith('http') ||
      v.startsWith('/ssc-cgl') ||
      v.startsWith('/images') ||
      v.endsWith('.jpeg') ||
      v.endsWith('.png') ||
      v.endsWith('.jpg') ||
      v.endsWith('.webp')
    );
  };

  // Overall time left dynamically calculated from all section timers
  const overallTimeLeft = Object.values(sectionTimeLeft).reduce((acc, curr) => acc + curr, 0);

  // Unique list of subjects in questions
  const availableSubjects = Array.from(new Set(questions.map(q => q.subject)));
  const currentSubjectList = availableSubjects.length > 0 ? availableSubjects : [
    "General Intelligence and Reasoning",
    "General Awareness",
    "Quantitative Aptitude",
    "English Comprehension"
  ];

  const activePart = PARTS.find(p => {
    const sName = (selectedSubject || "").toLowerCase();
    const pName = p.subjectName.toLowerCase();
    return sName.includes(pName) || pName.includes(sName) ||
      (p.id === 'PART-A' && (sName.includes('reasoning') || sName.includes('intelligence'))) ||
      (p.id === 'PART-B' && sName.includes('awareness')) ||
      (p.id === 'PART-C' && (sName.includes('quantitative') || sName.includes('aptitude') || sName.includes('math'))) ||
      (p.id === 'PART-D' && (sName.includes('english') || sName.includes('comprehension')));
  }) || PARTS[0];

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const resData = await submitFinalExam();
      setSubmitResult(resData);
      setSubmitSuccess(true);
      setShowAutoSubmitModal(false);
      setShowSubmitModal(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(err => console.error("Error exiting fullscreen:", err));
      }
    } catch (err) {
      console.error("Failed to submit SSC exam:", err);
      alert("Failed to submit exam. Please try again.");
      setShowAutoSubmitModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const runPreChecks = async () => {
    setInternetStatus('checking');
    setExtensionStatus('checking');

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

    setAssetStatus('checking');
    try {
      const res = await preloadExamImages(questions, "SSC CGL", year, (loaded, total) => {
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

  useEffect(() => {
    if (!isExamActive || violationsCount >= 5 || showSubmitModal || submitSuccess) return;

    const triggerViolation = (reason: string) => {
      setViolationsCount((prev) => prev + 1);
      setViolationReason(reason);
      setShowViolationModal(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
      const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
      const isCut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x';
      const isPrintScreen = e.key === 'PrintScreen' || e.keyCode === 44 || e.code === 'PrintScreen';
      const isWinScreenshot = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's';
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');

      if (isCopy || isPaste || isCut || isPrintScreen || isWinScreenshot || isMacScreenshot) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation(
          isCopy ? "Attempted copy shortcut (Ctrl+C / Cmd+C)" :
          isPaste ? "Attempted paste shortcut (Ctrl+V / Cmd+V)" :
          isCut ? "Attempted cut shortcut (Ctrl+X / Cmd+X)" :
          isWinScreenshot || isMacScreenshot ? "Attempted OS-level screenshot shortcut" :
          "Attempted PrintScreen action"
        );
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation("Attempted right-click (Context Menu)");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'Security Violation recorded.');
      }
    };

    const handleBlur = () => {
      if (isSubmitting || submitSuccess) return;
      triggerViolation("Window focus lost (possible screenshot tool or navigation)");
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

  const handleStartExamFromCheck = () => {
    setShowPreCheck(false);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
      setIsFullscreen(true);
    }
    setIsExamActive(true);
  };

  useEffect(() => {
    if (shiftId) {
      loadShift(shiftId, name, year);
    }
  }, [shiftId]);

  useEffect(() => {
    if (questions.length > 0) {
      const partAQ = questions.find(q => {
        const s = (q.subject || "").toLowerCase();
        return s.includes("reasoning") || s.includes("intelligence");
      }) || questions[0];
      const targetIdx = questions.findIndex(q => q.id === partAQ.id);
      setSelectedSubject(partAQ.subject);
      setCurrentQuestionIndex(targetIdx !== -1 ? targetIdx : 0);
    }
  }, [questions]);

  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      const activeQ = questions[currentQuestionIndex];
      setVisitedQuestions(prev => {
        const next = new Set(prev);
        next.add(activeQ.id);
        return next;
      });
      if (activeQ.subject && activeQ.subject !== selectedSubject) {
        setSelectedSubject(activeQ.subject);
      }
    }
  }, [currentQuestionIndex, questions]);

  // Section timer decrements
  useEffect(() => {
    if (questions.length === 0 || loading || !isExamActive) return;

    const interval = setInterval(() => {
      setSectionTimeLeft(prev => {
        const currentSecTime = prev[selectedSubject];
        if (currentSecTime === undefined) return prev;

        if (currentSecTime <= 1) {
          const currentIndex = currentSubjectList.indexOf(selectedSubject);
          if (currentIndex !== -1 && currentIndex < currentSubjectList.length - 1) {
            const nextSubject = currentSubjectList[currentIndex + 1];
            setToastNotice(`Time expired for section: ${selectedSubject}! Moving to next section: ${nextSubject}`);
            setTimeout(() => setToastNotice(null), 5000);
            setSelectedSubject(nextSubject);

            const nextSecQuestionIdx = questions.findIndex(q => q.subject === nextSubject);
            if (nextSecQuestionIdx !== -1) {
              setCurrentQuestionIndex(nextSecQuestionIdx);
            }
            return { ...prev, [selectedSubject]: 0 };
          } else {
            handleFinalSubmit();
            return { ...prev, [selectedSubject]: 0 };
          }
        }

        return {
          ...prev,
          [selectedSubject]: currentSecTime - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSubject, questions, loading, isExamActive, currentSubjectList]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error enabling fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Error exiting fullscreen:", err);
      });
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="font-bold text-lg">Loading SSC CGL Shift Questions...</p>
      </div>
    );
  }

  const subjectQuestions = questions.filter(q => q.subject === selectedSubject);
  const currentQuestion = questions[currentQuestionIndex];

  const answeredQuestionsCount = Object.keys(answers).length;

  const subjectCounters = {
    answered: subjectQuestions.filter(q => !!answers[q.id]).length,
    notAnswered: subjectQuestions.filter(q => visitedQuestions.has(q.id) && !answers[q.id]).length,
    notVisited: subjectQuestions.filter(q => !visitedQuestions.has(q.id)).length
  };

  const activePartIndex = PARTS.findIndex(p => p.subjectName.toLowerCase() === selectedSubject.toLowerCase());
  const currentActivePartIdx = activePartIndex !== -1 ? activePartIndex : 0;
  const activeSectionRemSeconds = sectionTimeLeft[selectedSubject] ?? 900;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQ = questions[currentQuestionIndex + 1];
      if (nextQ && nextQ.subject.toLowerCase() === selectedSubject.toLowerCase()) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setToastNotice(`You have reached the end of ${activePart.partLabel}. Please wait for the 15-minute section timer to finish.`);
        setTimeout(() => setToastNotice(null), 4000);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevQ = questions[currentQuestionIndex - 1];
      if (prevQ && prevQ.subject.toLowerCase() === selectedSubject.toLowerCase()) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const handleOptionClick = (optionKey: string) => {
    if (!currentQuestion) return;
    selectOption(currentQuestion.id, optionKey);
  };

  const handleGridQuestionClick = (questionId: string) => {
    const idx = questions.findIndex(q => q.id === questionId);
    if (idx !== -1) {
      const targetQ = questions[idx];
      if (targetQ && targetQ.subject.toLowerCase() === selectedSubject.toLowerCase()) {
        setCurrentQuestionIndex(idx);
      } else {
        setToastNotice(`Question belongs to another section which is currently locked.`);
        setTimeout(() => setToastNotice(null), 3000);
      }
    }
  };

  const handlePartTabClick = (partConfig: PartConfig, targetIdx: number) => {
    if (targetIdx !== currentActivePartIdx) {
      if (targetIdx > currentActivePartIdx) {
        setToastNotice(`Section locked! You must complete ${PARTS[currentActivePartIdx].partLabel} (15 mins) before moving to ${partConfig.partLabel}.`);
      } else {
        setToastNotice(`Section completed! You cannot revisit previously submitted sections.`);
      }
      setTimeout(() => setToastNotice(null), 4000);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (currentQuestion) {
      setMarkedForReview(prev => new Set(prev).add(currentQuestion.id));
      handleNextQuestion();
    }
  };

  const handleClearResponse = () => {
    if (currentQuestion) {
      selectOption(currentQuestion.id, "");
      setMarkedForReview(prev => {
        const next = new Set(prev);
        next.delete(currentQuestion.id);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col select-none overflow-hidden h-screen relative" style={{ zoom: `${zoomLevel}%` }}>
      {/* System Toast Notice */}
      {toastNotice && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-100 border border-yellow-400 text-yellow-900 font-bold px-6 py-2 rounded shadow-lg flex items-center space-x-2 text-xs">
          <span>⚠️ {toastNotice}</span>
        </div>
      )}

      {/* Hardware & Security Check Dialog */}
      {showPreCheck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-lg max-w-xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">
                  SSC
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">SSC CGL Mock Test Pre-Check</h3>
                  <p className="text-xs text-slate-500">Verifying secure browser environment</p>
                </div>
              </div>
              <button
                onClick={runPreChecks}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                Re-check
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <span>Network Connectivity</span>
                <span className="font-bold text-emerald-600">{internetStatus === 'connected' ? 'CONNECTED' : 'CHECKING...'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <span>Browser Security &amp; Fullscreen</span>
                <span className="font-bold text-emerald-600">PASSED</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-200">
                <span>Diagram Images &amp; Assets</span>
                <span className="font-bold text-emerald-600">{assetStatus === 'ready' ? 'READY' : 'PRELOADING...'}</span>
              </div>
            </div>

            <button
              onClick={handleStartExamFromCheck}
              disabled={assetStatus === 'checking'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded shadow transition"
            >
              Start SSC CGL Mock Test (Fullscreen) →
            </button>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="bg-white border-b border-slate-300 px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 shadow-sm">
        {/* Left Title */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">SSC CGL MOCK TEST</h1>
          <div className="flex sm:hidden items-center space-x-2 text-xs text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-500 text-[10px]">
              👤
            </span>
            <span className="font-semibold text-slate-800 text-xs truncate max-w-[100px]">{candidateName}</span>
          </div>
        </div>

        {/* Center Clocks: 15-Min Section Timer & 60-Min Overall Timer */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-6 w-full sm:w-auto">
          {/* Section Timer (15 Min) */}
          <div className="flex flex-col items-center bg-red-50 border border-red-200 px-2.5 sm:px-3.5 py-1 rounded shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-bold text-red-600 uppercase tracking-wider">
              Section Time ({activePart.partLabel})
            </span>
            <span className="font-mono text-base sm:text-xl font-extrabold text-red-600 tracking-widest">
              {formatTime(activeSectionRemSeconds)}
            </span>
          </div>

          {/* Overall Exam Timer (60 Min) */}
          <div className="flex flex-col items-center bg-slate-50 border border-slate-300 px-2.5 sm:px-3.5 py-1 rounded shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Overall Time (60M)
            </span>
            <span className="font-mono text-base sm:text-xl font-extrabold text-slate-800 tracking-widest">
              {formatTime(overallTimeLeft)}
            </span>
          </div>
        </div>

        {/* Right Candidate Details (Desktop) */}
        <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-500">
              👤
            </span>
            <span className="font-semibold text-slate-800">{candidateName}</span>
          </div>
        </div>
      </header>

      {/* SUB HEADER / CONTROLS & NOTICE STRIP */}
      <div className="bg-slate-100 border-b border-slate-300 text-xs shrink-0">
        {/* Controls row */}
        <div className="px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 10, 140))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-xs transition"
            >
              Zoom (+)
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-1 rounded text-xs transition"
            >
              Zoom (-)
            </button>
            <span className="hidden sm:inline font-semibold text-slate-700 ml-2">SSC-CGL Tier 1</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowMobilePalette(prev => !prev)}
              className="lg:hidden bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded text-xs border border-blue-200 hover:bg-blue-100 transition"
            >
              {showMobilePalette ? "✕ Close Palette" : `📊 Questions (${subjectQuestions.length})`}
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
        </div>

        {/* Yellow Instructions Banner */}
        <div className="bg-[#fffde7] border-b border-yellow-200 px-3 sm:px-6 py-1 text-slate-800 text-[11px] flex flex-wrap items-center gap-2 sm:space-x-4">
          <span className="font-bold text-yellow-900 cursor-pointer hover:underline">SYMBOLS</span>
          <span className="font-bold text-yellow-900 cursor-pointer hover:underline">INSTRUCTIONS</span>
          <span className="text-slate-700 text-[10px] sm:text-[11px]">Mock test for practice.</span>
        </div>
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay */}
        {showMobilePalette && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
            onClick={() => setShowMobilePalette(false)}
          />
        )}

        {/* PALETTE ASIDE - DESKTOP SIDEBAR OR MOBILE SLIDE-OVER DRAWER */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-300 flex flex-col h-full 
          transition-transform duration-300 transform 
          lg:static lg:translate-x-0 lg:z-auto shrink-0
          ${showMobilePalette ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Drawer Header */}
          <div className="lg:hidden p-3 bg-slate-800 text-white flex items-center justify-between font-bold text-xs">
            <span>📊 Question Palette ({subjectQuestions.length})</span>
            <button
              onClick={() => setShowMobilePalette(false)}
              className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* PART Navigation Buttons */}
            <div className="p-2 border-b border-slate-200 flex items-center justify-between bg-slate-50 gap-1">
              {PARTS.map((part, pIdx) => {
                const isActive = pIdx === currentActivePartIdx;
                const isPast = pIdx < currentActivePartIdx;
                const isFuture = pIdx > currentActivePartIdx;

                let btnStyle = "bg-white text-slate-400 border border-slate-200 cursor-not-allowed opacity-60";
                let statusIcon = "🔒";

                if (isActive) {
                  btnStyle = "bg-blue-600 text-white font-bold shadow-sm cursor-default";
                  statusIcon = "⏱️";
                } else if (isPast) {
                  btnStyle = "bg-slate-100 text-slate-500 border border-slate-300 cursor-not-allowed opacity-70";
                  statusIcon = "✓";
                }

                return (
                  <button
                    key={part.id}
                    disabled={!isActive}
                    onClick={() => handlePartTabClick(part, pIdx)}
                    className={`flex-1 py-1.5 px-1 rounded text-[11px] font-bold transition text-center flex items-center justify-center space-x-0.5 ${btnStyle}`}
                    title={isFuture ? "Locked: Unlocks after 15 minutes" : isPast ? "Section Completed" : "Current Active Section (15 Mins)"}
                  >
                    <span>{part.partLabel}</span>
                    <span className="text-[9px]">{statusIcon}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Subject Section Heading */}
            <div className="py-2 px-4 text-center border-b border-slate-200 bg-slate-100">
              <h2 className="text-xs font-bold text-slate-800">{selectedSubject}</h2>
            </div>

            {/* Question Palette Grid */}
            <div className="p-4">
              <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2 justify-items-center">
                {subjectQuestions.map((q, idx) => {
                  const globalIdx = questions.findIndex(item => item.id === q.id);
                  const isCurrent = currentQuestionIndex === globalIdx;
                  const isAns = Boolean(answers[q.id]);
                  const isMarked = markedForReview.has(q.id);

                  let bgStyle = "bg-blue-600 text-white"; // Unanswered default blue
                  if (isAns) {
                    bgStyle = "bg-emerald-600 text-white"; // Answered green
                  } else if (isMarked) {
                    bgStyle = "bg-amber-500 text-white"; // Marked yellow/orange
                  }

                  let borderStyle = isCurrent ? "ring-2 ring-blue-700 ring-offset-1 font-extrabold" : "";

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        handleGridQuestionClick(q.id);
                        setShowMobilePalette(false);
                      }}
                      className={`w-9 h-9 rounded text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer ${bgStyle} ${borderStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Analysis Box & Clear Response */}
          <div className="p-4 border-t border-slate-300 bg-slate-50 space-y-3">
            <div className="border border-slate-300 rounded overflow-hidden">
              <div className="bg-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                {activePart.partLabel} Analysis
              </div>
              <div className="p-3 bg-white space-y-1 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Answered</span>
                  <span className="font-bold text-slate-900">{subjectCounters.answered}</span>
                </div>
                <div className="flex justify-between">
                  <span>Not Answered</span>
                  <span className="font-bold text-slate-900">{subjectCounters.notAnswered + subjectCounters.notVisited}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleClearResponse();
                setShowMobilePalette(false);
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-xs shadow transition cursor-pointer"
            >
              Clear Response
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: QUESTION CONTENT + ACTIONS + SUBMIT */}
        <main className="flex-1 bg-white flex flex-col justify-between overflow-y-auto w-full min-w-0">
          <div className="p-3 sm:p-6 space-y-4 max-w-5xl mx-auto w-full">
            {/* Top Action Bar & Language Select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleMarkForReviewAndNext}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 sm:px-4 py-2.5 rounded shadow transition cursor-pointer text-center"
                >
                  Mark for Review &amp; Next
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 sm:px-4 py-2.5 rounded shadow transition cursor-pointer text-center"
                >
                  Save &amp; Next
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-700 w-full sm:w-auto">
                <span className="font-medium text-[11px] sm:text-xs">Answered: <strong className="text-slate-900">{answeredQuestionsCount}</strong></span>
                <div className="flex items-center space-x-1">
                  <span>View in:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 bg-white text-xs text-slate-800 font-semibold focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Display */}
            {currentQuestion ? (
              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Question : {currentQuestionIndex + 1}
                  </h3>
                  <ReportErrorButton questionId={currentQuestion.id} questionTextSnippet={currentQuestion.questionText} />
                </div>

                {/* Question Text */}
                <div className="text-sm text-slate-800 font-medium leading-relaxed">
                  <LatexRenderer text={cleanText(currentQuestion.questionText)} />
                </div>

                {/* Question Image Diagram */}
                {currentQuestion.imageUrl && (
                  <div className="my-3 border border-slate-200 rounded p-3 bg-slate-50 flex justify-start">
                    <QuestionImage
                      imageUrl={currentQuestion.imageUrl}
                      examName="SSC CGL"
                      year={year}
                      alt="Question Figure"
                      className="max-h-72 object-contain rounded"
                    />
                  </div>
                )}

                {/* Options List (Radio Button Style) */}
                <div className="space-y-3 pt-4">
                  {[
                    { key: 'A', text: currentQuestion.optionA },
                    { key: 'B', text: currentQuestion.optionB },
                    { key: 'C', text: currentQuestion.optionC },
                    { key: 'D', text: currentQuestion.optionD }
                  ].map(({ key, text }) => {
                    const cleanedOptText = cleanText(text);
                    const isSelected = answers[currentQuestion.id] === key;
                    const isImg = checkIsImageOption(cleanedOptText);

                    return (
                      <label
                        key={key}
                        onClick={() => handleOptionClick(key)}
                        className={`flex items-start space-x-3 text-xs text-slate-800 p-2.5 rounded cursor-pointer transition ${
                          isSelected ? 'bg-blue-50 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question_${currentQuestion.id}`}
                          checked={isSelected}
                          onChange={() => handleOptionClick(key)}
                          className="mt-0.5 h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          {isImg ? (
                            <QuestionImage
                              imageUrl={cleanedOptText}
                              examName="SSC CGL"
                              year={year}
                              alt={`Option ${key}`}
                              className="max-h-24 object-contain rounded"
                            />
                          ) : (
                            <LatexRenderer text={cleanedOptText} />
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500 text-xs">No question selected.</div>
            )}
          </div>

          {/* Footer Submit Bar */}
          <footer className="border-t border-slate-300 bg-slate-50 px-6 py-3 flex items-center justify-end shrink-0">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2 rounded shadow transition cursor-pointer"
            >
              Submit
            </button>
          </footer>
        </main>
      </div>

      {/* Security Violation Modal */}
      {showViolationModal && isExamActive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white border border-red-300 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-red-600 uppercase">Security Violation Warning</h3>
            <p className="text-xs text-slate-600">Reason: {violationReason}</p>
            <p className="text-xs font-bold text-red-700">Violations Count: {violationsCount} / 5</p>
            <button
              onClick={handleResumeFullscreen}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs shadow"
            >
              Resume Exam &amp; Re-enable Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-lg max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800">
            {submitSuccess ? (
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-slate-800">SSC CGL Exam Submitted!</h3>
                {submitResult && (
                  <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span>Total Score:</span>
                      <span className="font-bold text-emerald-600">{submitResult.finalScore} / {submitResult.totalQuestions * 2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Correct:</span>
                      <span className="font-bold text-emerald-600">{submitResult.correctCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incorrect:</span>
                      <span className="font-bold text-red-600">{submitResult.incorrectCount}</span>
                    </div>
                  </div>
                )}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {submitResult?.attemptId && (
                    <button
                      onClick={() => setReviewAttemptId(submitResult.attemptId)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded text-xs shadow transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Review Answers</span>
                      <span>→</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      router.replace('/pages/dashboard/ssc-cgl');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded text-xs shadow"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800">Submit SSC CGL Exam?</h3>
                <p className="text-xs text-slate-600">Are you sure you want to finalize your exam submission?</p>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 rounded text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs shadow"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Submit"}
                  </button>
                </div>
              </div>
            )}
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
    </div>
  );
}

export default function SscTestWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center text-slate-500 text-xs">Loading SSC workspace...</div>}>
      <SscTestWorkspaceContent />
    </Suspense>
  );
}
