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
import { CheckCircle2, ShieldCheck, ShieldAlert, Wifi, AlertTriangle, Maximize2, AlertCircle, Cpu } from 'lucide-react';

function GateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shiftId = searchParams.get('shiftId') || "";
  const name = searchParams.get('name') || "GATE CBT Exam";
  const year = parseInt(searchParams.get('year') || "2025", 10);
  const branch = searchParams.get('branch') || "CS";

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

  const [selectedSection, setSelectedSection] = useState<string>("General Aptitude");
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [showInstructionBox, setShowInstructionBox] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>("Candidate");
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

  const [completedResult, setCompletedResult] = useState<any>(null);

  // Check if exam was previously completed & submitted
  useEffect(() => {
    if (typeof window !== 'undefined' && shiftId) {
      const saved = sessionStorage.getItem(`submitted_gate_${shiftId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedResult(parsed);
        } catch (e) {
          console.error("Error parsing saved GATE result:", e);
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
      console.error("Failed to submit GATE exam:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQ) {
      setVisitedQuestions(prev => new Set(prev).add(currentQ.id));
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
      setMarkedForReview(prev => new Set(prev).add(currentQ.id));
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

  // Completed result safeguard screen
  if (completedResult) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">{name || `GATE ${branch} ${year}`}</h2>
            <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              GATE CBT Session Completed &amp; Evaluated
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl divide-y divide-slate-800 text-sm text-left">
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400 font-semibold">Total Marks Score:</span>
              <span className="font-extrabold text-teal-400 text-xl">
                {completedResult.finalScore} / 100
              </span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400">Correct Responses:</span>
              <span className="font-extrabold text-emerald-400 text-base">{completedResult.correctCount}</span>
            </div>
            <div className="flex justify-between items-center p-3.5">
              <span className="text-slate-400">Incorrect Responses:</span>
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
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
              >
                <span>Review Detailed Solutions</span>
                <span>→</span>
              </button>
            )}

            <button
              onClick={() => router.replace('/pages/dashboard/gate')}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
            >
              Return to GATE Dashboard
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && shiftId) {
                  sessionStorage.removeItem(`submitted_gate_${shiftId}`);
                }
                setCompletedResult(null);
                loadShift(shiftId, name, year);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer border border-slate-700"
            >
              Retake GATE Exam Practice
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500 mb-4"></div>
        <p className="text-lg font-semibold tracking-wider animate-pulse">Loading GATE Question Bank...</p>
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden h-screen">
      
      {/* 1. GATE Top Header Banner */}
      <div className="bg-[#1a1d20] text-teal-400 font-bold text-xs sm:text-sm px-4 py-2 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <span>GATE {year} {branch} OFFICIAL CBT SIMULATOR</span>
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

      {showMagnifierBar && (
        <ScreenMagnifierBar
          zoomLevel={zoomLevel}
          onZoomChange={(z) => setZoomLevel(z)}
          onClose={() => setShowMagnifierBar(false)}
        />
      )}

      {/* 2. Sub-Header Bar (Paper Title + Timer) */}
      <div className="bg-[#e8edf2] dark:bg-[#1e232a] text-slate-800 dark:text-slate-100 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-300 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="bg-teal-700 text-white px-3 py-1 rounded-md font-bold text-xs shadow-sm">
            {branch} - GATE {year}
          </span>
          <button
            onClick={() => setShowExitConfirmModal(true)}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
          >
            &larr; Exit Exam
          </button>
        </div>

        <div className="flex items-center gap-4 font-bold text-sm">
          <span className="text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Time Left</span>
          <div className="bg-white dark:bg-slate-900 px-3 py-1 rounded border border-slate-300 dark:border-slate-700 shadow-inner">
            <span className={`font-mono text-base font-bold ${examTimeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-teal-400'}`}>{formatTime(examTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3. GATE Section Tabs */}
      <div className="bg-[#f5f5f5] dark:bg-[#181b20] border-b border-slate-300 dark:border-slate-800 px-4 py-1.5 flex items-center gap-2 overflow-x-auto shrink-0">
        {["General Aptitude", "Engineering Mathematics", "Core Subject"].map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSection(sec)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              selectedSection === sec
                ? "bg-teal-700 text-white shadow"
                : "bg-white dark:bg-slate-800 text-teal-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-700"
            }`}
          >
            <span>{sec}</span>
          </button>
        ))}
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Question Panel */}
        <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden border-r-0 lg:border-r border-slate-900 w-full min-w-0">
          
          <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-bold text-slate-100 text-xs sm:text-sm">Question No. {currentQuestionIndex + 1}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {currentQ && <ReportErrorButton questionId={currentQ.id} questionTextSnippet={currentQ.questionText} />}
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
              >
                <span>🔢</span> Palette ({totalCounters.answered}/{questions.length})
              </button>
              <button
                onClick={() => setShowInstructionBox(!showInstructionBox)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                {showInstructionBox ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {showInstructionBox && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl m-2 sm:m-4 p-3 sm:p-4 text-xs text-slate-200 space-y-2 shrink-0 shadow-lg">
              <div className="flex justify-between items-center font-bold border-b border-slate-800 pb-2">
                <span className="text-teal-400 text-sm">{selectedSection} (GATE CBT Marking Scheme)</span>
                <button onClick={() => setShowInstructionBox(false)} className="text-slate-400 hover:text-white">▲</button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                <li>MCQs: <strong>+1 or +2 Marks</strong> for correct answer; <strong>-1/3 or -2/3</strong> negative marking for incorrect.</li>
                <li>NAT (Numerical Answer Type) &amp; MSQ (Multiple Select): <strong>NO Negative Marking</strong>.</li>
              </ul>
            </div>
          )}

          {/* Question & Options Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 transition-all duration-150 w-full min-w-0" style={zoomLevel !== 100 ? { zoom: `${zoomLevel}%` } : undefined}>
              {currentQ && (
                <>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 break-words min-w-0 shadow-md">
                    <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
                      <LatexRenderer text={currentQ.questionText} />
                    </div>

                    {currentQ.imageUrl && (
                      <div className="mt-4 border border-slate-800 rounded-lg p-2 sm:p-4 bg-slate-950 flex justify-center">
                        <QuestionImage
                          imageUrl={currentQ.imageUrl}
                          examName="gate"
                          alt={`GATE Question ${currentQuestionIndex + 1}`}
                          className="max-h-60 sm:max-h-72 max-w-full object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* MCQ vs NAT Input rendering */}
                  {(() => {
                    const isNumerical = !currentQ.optionA || !currentQ.optionB;

                    if (isNumerical) {
                      return (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse"></span>
                            <label className="text-xs sm:text-sm font-bold text-teal-300 uppercase tracking-wider">
                              Numerical Answer Type (NAT) Input
                            </label>
                          </div>
                          <p className="text-xs text-slate-400">
                            Enter your precise calculated integer or decimal answer below (e.g. 24, 3.14). No negative marking.
                          </p>
                          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input
                              type="text"
                              value={answers[currentQ.id] || ''}
                              onChange={(e) => selectOption(currentQ.id, e.target.value)}
                              placeholder="Enter numerical answer..."
                              className="w-full sm:w-80 bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl px-4 py-3 text-slate-100 text-base sm:text-lg font-mono focus:ring-2 focus:ring-teal-500/20 outline-none transition"
                            />
                            {answers[currentQ.id] && (
                              <button
                                onClick={handleClearResponse}
                                className="px-4 py-3 border border-slate-700 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold"
                              >
                                Clear Input
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-2.5 sm:space-y-3">
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
                              onClick={() => selectOption(currentQ.id, key)}
                              className={`group flex items-start sm:items-center p-3 sm:p-4 rounded-xl border cursor-pointer transition ${
                                isSelected
                                  ? 'bg-teal-950/40 border-teal-500 shadow-md'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <span className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg font-bold flex items-center justify-center mr-3 shrink-0 text-xs sm:text-sm ${
                                isSelected ? 'bg-teal-600 text-white' : 'bg-slate-955 text-slate-400'
                              }`}>
                                {key}
                              </span>
                              <div className="text-xs sm:text-sm break-words min-w-0 flex-1 text-slate-300">
                                <LatexRenderer text={text} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <footer className="bg-slate-900 border-t border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3 sm:px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
              >
                Mark for Review &amp; Next
              </button>
              <button
                onClick={handleClearResponse}
                disabled={!currentQ || !answers[currentQ.id]}
                className="px-3 sm:px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 disabled:opacity-40 font-semibold text-xs transition cursor-pointer"
              >
                Clear Response
              </button>
              <button
                onClick={() => setShowMobilePalette(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <span>🔢</span> Palette ({totalCounters.answered}/{questions.length})
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleNextQuestion}
                className="px-4 sm:px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs transition cursor-pointer shadow"
              >
                Save &amp; Next
              </button>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 sm:px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow"
              >
                Submit Test
              </button>
            </div>
          </footer>
        </main>

        {showMobilePalette && (
          <div 
            className="fixed inset-0 z-40 bg-slate-955/80 backdrop-blur-sm lg:hidden animate-fadeIn"
            onClick={() => setShowMobilePalette(false)}
          />
        )}

        {/* Sidebar Palette */}
        <aside className={`
          fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full 
          transition-transform duration-300 transform 
          lg:static lg:translate-x-0 lg:z-auto shrink-0
          ${showMobilePalette ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:hidden p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <span className="font-bold text-xs text-white flex items-center gap-1.5">
              <span>🔢</span> Question Palette ({totalCounters.answered}/{questions.length})
            </span>
            <button 
              onClick={() => setShowMobilePalette(false)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              ✕ Close
            </button>
          </div>

          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold">
              {displayName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm truncate max-w-[170px]">{displayName}</p>
              <p className="text-[11px] text-teal-400 font-medium">GATE Candidate</p>
            </div>
          </div>

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
                <span className="text-slate-300 text-[11px]">Marked</span>
              </div>
            </div>
          </div>

          <div className="bg-teal-800 text-white px-3 py-2 text-xs font-bold shrink-0">
            <p>GATE Question Palette</p>
          </div>

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

      <AccessibilityModal
        isOpen={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
        settings={accessSettings}
        onUpdateSettings={(newS) => setAccessSettings(prev => ({ ...prev, ...newS }))}
        onSpeakQuestion={() => setIsSpeaking(true)}
        onStopSpeaking={() => setIsSpeaking(false)}
        isSpeaking={isSpeaking}
      />

      <ExitConfirmModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onConfirmExit={() => {
          setShowExitConfirmModal(false);
          router.replace('/pages/dashboard/gate');
        }}
        examName="GATE CBT"
      />
    </div>
  );
}

export default function GateWorkspacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-teal-400">Loading GATE workspace...</div>}>
      <GateWorkspaceContent />
    </Suspense>
  );
}
