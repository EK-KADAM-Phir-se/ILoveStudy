"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTest } from '../context/TestContext';

export default function JeeExamPage() {
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    answers, 
    selectOption, 
    examTimeLeft, 
    questionTimers,
    submitFinalExam
  } = useTest();

  // Fullscreen & Security states
  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(true); // Starts with a gatekeeper prompt
  const examContainerRef = useRef<HTMLDivElement>(null);

  // Mock array for testing layout
  const mockQuestions = Array.from({ length: 90 }, (_, i) => ({
    id: `q-${i + 1}`,
    subject: i < 30 ? "Physics" : i < 60 ? "Chemistry" : "Mathematics",
    questionText: `This is the sample question text for Question ${i + 1}. A particle moves along a straight trajectory matching our optimized real-time state vectors. Select the correct parameter asset below.`,
    optionA: "Option vector configuration parameters Alpha",
    optionB: "Option vector configuration parameters Beta",
    optionC: "Option vector configuration parameters Gamma",
    optionD: "Option vector configuration parameters Delta",
  }));

  const currentQuestion = mockQuestions[currentQuestionIndex];

  // Helper formatting raw seconds into HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // --- SECURITY INTERCEPTOR LOGIC ---
  
  // 1. Enter Fullscreen Mode
  const requestFullscreenLock = async () => {
    if (examContainerRef.current) {
      try {
        if (examContainerRef.current.requestFullscreen) {
          await examContainerRef.current.requestFullscreen();
        }
        setShowWarningModal(false);
        setIsFullscreenActive(true);
      } catch (err) {
        console.error("Fullscreen request failed:", err);
        alert("Please allow fullscreen mode to proceed with the exam.");
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFull = document.fullscreenElement !== null;
      setIsFullscreenActive(isCurrentlyFull);
      
      // If they exited fullscreen mid-test, trigger a lock warning and count a violation
      if (!isCurrentlyFull && !showWarningModal) {
        setShowWarningModal(true);
        setViolationCount((prev) => prev + 1);
      }
    };

    const handleWindowBlur = () => {
      // Detects Alt+Tab or opening another app
      if (isFullscreenActive) {
        setViolationCount((prev) => prev + 1);
        alert("WARNING: Window focus lost! Switching apps or tabs is recorded as a violation.");
      }
    };

    // Bind listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isFullscreenActive, showWarningModal]);

  return (
    <div ref={examContainerRef} className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800 select-none font-sans relative">
      
      {/* 🛑 BLOCKING SECURITY LOCKOVERLAY */}
      {showWarningModal && (
        <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-6 text-center text-white animate-fade-in">
          <div className="bg-slate-800 max-w-md w-full p-8 rounded-2xl border border-red-500/30 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0-6V9m0-6H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-2z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Secure Test Mode Active</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              To guarantee exam integrity, this test requires a strict fullscreen layout environment. Switching tabs, exiting fullscreen, or launching background software will trigger system alerts.
            </p>

            {violationCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6">
                <span className="text-red-400 font-semibold text-sm">
                  Active Security Violations: {violationCount}
                </span>
              </div>
            )}

            <button 
              onClick={requestFullscreenLock}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
            >
              {violationCount === 0 ? "Agree & Start Exam" : "Resume Test Session"}
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Dashboard Bar */}
      <header className="h-14 bg-blue-700 text-white flex items-center justify-between px-6 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">ILoveStudy | JEE Advanced Simulator</h1>
        
        {/* Violation Live Counter */}
        {violationCount > 0 && (
          <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold animate-pulse">
            Alerts: {violationCount}
          </div>
        )}

        <div className="flex items-center gap-4 bg-blue-800 px-4 py-1.5 rounded-lg border border-blue-600">
          <span className="text-sm font-medium text-blue-200">Time Remaining:</span>
          <span className="font-mono text-lg font-bold tracking-wider text-yellow-300">{formatTime(examTimeLeft)}</span>
        </div>
      </header>

      {/* Main Panel Sections */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Question Sheet */}
        <main className="flex-1 flex flex-col p-6 overflow-y-auto border-r border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded text-sm uppercase">
              {currentQuestion?.subject}
            </span>
            <span className="text-sm text-slate-500 font-mono">
              Focus Timer: {questionTimers[currentQuestion?.id] || 0}s
            </span>
          </div>

          <h3 className="text-lg font-medium leading-relaxed mb-6">
            <span className="font-bold text-blue-600 mr-2">Q{currentQuestionIndex + 1}.</span>
            {currentQuestion?.questionText}
          </h3>

          {/* Radio Options */}
          <div className="space-y-3 max-w-3xl">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const optionKey = `option${opt}` as keyof typeof currentQuestion;
              const isSelected = answers[currentQuestion?.id] === opt;

              return (
                <button
                  key={opt}
                  onClick={() => selectOption(currentQuestion?.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-4 ${
                    isSelected 
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {opt}
                  </span>
                  <span className="text-slate-700 font-medium">{currentQuestion?.[optionKey]}</span>
                </button>
              );
            })}
          </div>

          {/* Action Footer control */}
          <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
            <button 
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              className="px-5 py-2.5 rounded-lg border border-slate-300 font-medium hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm transition-colors"
            >
              Save & Next
            </button>
          </div>
        </main>

        {/* Right Side: Matrix Question Indicator */}
        <aside className="w-80 bg-white flex flex-col shadow-inner">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-1">Question Navigator</h4>
            <p className="text-xs text-slate-500">Click a box to hop directly</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-5 gap-2.5 content-start">
            {mockQuestions.map((q, index) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-10 text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center ${
                    isCurrent 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : isAnswered 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {(index + 1).toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={submitFinalExam}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold tracking-wide hover:bg-emerald-700 shadow-md transition-all"
            >
              Submit Entire Exam
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}