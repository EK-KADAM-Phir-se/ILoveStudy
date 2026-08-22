"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/src/lib/apiConfig";
import { LatexRenderer } from "@/src/app/components/LatexRenderer";
import { QuestionImage } from "@/src/components/QuestionImage";
import { ReportErrorButton } from "@/src/components/ReportErrorButton";

export interface ReviewQuestion {
  id: string;
  subject: string;
  questionText: string;
  imageUrl?: string | null;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  positiveMarks: number;
  negativeMarks: number;
  explanation?: string | null;
  userAnswer: string | null;
  status: "Correct" | "Wrong" | "Unattempted";
  timeSpentSeconds: number;
}

export interface ReviewAttempt {
  id: string;
  submittedAt: string;
  score: number;
  maxMarks: number;
  percentage: number;
  shiftName: string;
  examName: string;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  totalQuestions: number;
}

interface TestReviewModalProps {
  attemptId: string;
  onClose: () => void;
}

export const TestReviewModal: React.FC<TestReviewModalProps> = ({ attemptId, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<ReviewAttempt | null>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);

  // Navigation & Filtering States
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  useEffect(() => {
    if (!attemptId) return;

    const fetchReviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? (localStorage.getItem("token") || "SIMULATED_TOKEN") : "SIMULATED_TOKEN";
        const res = await axios.get(`${API_BASE_URL}/api/test/review/${attemptId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAttempt(res.data.attempt);
        setQuestions(res.data.questions || []);
        setCurrentIndex(0);
      } catch (err: any) {
        console.error("Failed to load review data:", err);
        setError(err.response?.data?.error || "Failed to load test review data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [attemptId]);

  // Derived subjects from questions
  const subjects = React.useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.subject) set.add(q.subject);
    });
    return ["All", ...Array.from(set)];
  }, [questions]);

  // Filtered questions based on subject & status
  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      const matchSubject = selectedSubject === "All" || q.subject?.toLowerCase() === selectedSubject.toLowerCase();
      const matchStatus =
        selectedStatusFilter === "All" ||
        (selectedStatusFilter === "Correct" && q.status === "Correct") ||
        (selectedStatusFilter === "Wrong" && q.status === "Wrong") ||
        (selectedStatusFilter === "Unattempted" && q.status === "Unattempted");

      return matchSubject && matchStatus;
    });
  }, [questions, selectedSubject, selectedStatusFilter]);

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedSubject, selectedStatusFilter]);

  const activeQuestion = filteredQuestions[currentIndex] || null;
  const isSsc = attempt?.examName?.toUpperCase().includes("SSC") || attempt?.shiftName?.toUpperCase().includes("SSC");
  const positiveMultiplier = isSsc ? 2 : 4;
  const negativeMultiplier = isSsc ? 0.5 : 1;

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

  // Helper to check if a question is Numerical Answer Type (NAT)
  const isNumericalQuestion = (q: ReviewQuestion) => {
    const hasOptions = Boolean(
      (q.optionA && q.optionA.trim()) ||
      (q.optionB && q.optionB.trim()) ||
      (q.optionC && q.optionC.trim()) ||
      (q.optionD && q.optionD.trim())
    );
    return !hasOptions;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 select-none" style={{ zoom: `${zoomLevel}%` }}>
        
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-slate-300 px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 shadow-xs gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-sm sm:text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
              {attempt ? `${attempt.examName} — ${attempt.shiftName}` : "SSC CGL MOCK TEST — ANSWER REVIEW"}
            </h1>
            <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Answer Key &amp; Review
            </span>
          </div>

          {attempt && (
            <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4 text-xs">
              <div className="flex items-center gap-2 bg-slate-100 px-2.5 sm:px-3.5 py-1 rounded border border-slate-200 text-[11px] sm:text-xs">
                <span>Score: <strong className="text-blue-700 text-xs sm:text-sm font-bold">{attempt.score} / {attempt.maxMarks}</strong></span>
                <span>•</span>
                <span>Accuracy: <strong className="text-emerald-700 text-xs sm:text-sm font-bold">{attempt.percentage}%</strong></span>
              </div>
              <button
                onClick={onClose}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 sm:px-3 py-1 rounded text-xs transition shrink-0 cursor-pointer"
              >
                ✕ Close Review
              </button>
            </div>
          )}
        </header>

        {/* SUB HEADER / CONTROLS & SUMMARY BANNER */}
        <div className="bg-slate-100 border-b border-slate-300 text-xs shrink-0">
          <div className="px-3 sm:px-6 py-1.5 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 bg-white gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 10, 140))}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-xs transition cursor-pointer"
              >
                Zoom (+)
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 10, 80))}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1 rounded text-xs transition cursor-pointer"
              >
                Zoom (-)
              </button>
              <span className="ml-2 font-semibold text-slate-700 text-[11px] sm:text-xs">Detailed Attempt Evaluation</span>
            </div>

            {attempt && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-medium text-slate-700 text-[11px] sm:text-xs">
                <span className="text-emerald-700 font-bold">✓ Correct: {attempt.correctCount} (+{attempt.correctCount * positiveMultiplier} pts)</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-red-600 font-bold">✕ Wrong: {attempt.incorrectCount} (-{attempt.incorrectCount * negativeMultiplier} pts)</span>
                <span className="hidden sm:inline">|</span>
                <span className="text-slate-600 font-bold">⚪ Unattempted: {attempt.unattemptedCount}</span>
              </div>
            )}
          </div>

          <div className="bg-[#fffde7] border-b border-yellow-200 px-3 sm:px-6 py-1 text-slate-800 text-[10px] sm:text-[11px] flex flex-wrap items-center gap-2">
            <span className="font-bold text-yellow-900">ANSWER REVIEW MODE</span>
            <span className="text-slate-700">Green indicates correct choice, Red indicates incorrect choice.</span>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center space-y-4 p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-sm font-semibold text-slate-600 animate-pulse">Loading detailed question analysis...</p>
          </div>
        ) : error ? (
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <p className="text-red-600 font-semibold text-sm">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded transition cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : !attempt || questions.length === 0 ? (
          <div className="flex-1 min-h-[300px] flex items-center justify-center p-8 text-slate-500 text-xs">
            No review questions found for this attempt.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
            
            {/* LEFT SIDEBAR: FILTERS & QUESTION PALETTE GRID */}
            <aside className="w-full lg:w-80 bg-white border-b lg:border-b-0 lg:border-r border-slate-300 flex flex-col justify-between shrink-0 max-h-[280px] lg:max-h-none overflow-y-auto">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                
                {/* SUBJECT FILTER */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Subject Filter
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {subjects.map((subj) => (
                      <button
                        key={subj}
                        onClick={() => setSelectedSubject(subj)}
                        className={`px-2 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                          selectedSubject === subj
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white text-blue-600 border border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RESULT STATUS FILTER */}
                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    Status Filter
                  </label>
                  <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                    {[
                      { id: "All", label: "All Questions", count: questions.length },
                      { id: "Correct", label: "✓ Correct", count: attempt.correctCount },
                      { id: "Wrong", label: "✕ Wrong", count: attempt.incorrectCount },
                      { id: "Unattempted", label: "⚪ Unattempted", count: attempt.unattemptedCount },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedStatusFilter(st.id)}
                        className={`px-2 py-1 rounded text-[11px] sm:text-xs font-semibold transition text-left flex justify-between items-center cursor-pointer ${
                          selectedStatusFilter === st.id
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300"
                        }`}
                      >
                        <span>{st.label}</span>
                        <span className="text-[9px] sm:text-[10px] px-1 py-0.2 rounded bg-slate-200 text-slate-800 font-bold">
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* QUESTION PALETTE GRID */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Questions Palette ({filteredQuestions.length})
                  </h4>
                  <div className="grid grid-cols-6 sm:grid-cols-5 lg:grid-cols-5 gap-1.5 max-h-[160px] sm:max-h-[220px] overflow-y-auto pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const originalIdx = questions.findIndex((orig) => orig.id === q.id);
                      const isSelected = activeQuestion?.id === q.id;

                      let bgClass = "bg-slate-200 text-slate-700 font-bold";
                      if (q.status === "Correct") {
                        bgClass = "bg-emerald-600 text-white font-bold";
                      } else if (q.status === "Wrong") {
                        bgClass = "bg-rose-600 text-white font-bold";
                      }

                      let borderClass = isSelected ? "ring-2 ring-blue-700 ring-offset-1" : "";

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded text-[11px] sm:text-xs flex items-center justify-center transition shadow-xs cursor-pointer ${bgClass} ${borderClass}`}
                          title={`Q${originalIdx + 1} (${q.subject}) - ${q.status}`}
                        >
                          {originalIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* LEGEND */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded bg-emerald-600"></span>
                    <span>Correct Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded bg-rose-600"></span>
                    <span>Wrong Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded bg-slate-300"></span>
                    <span>Unattempted</span>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-slate-300 bg-slate-50">
                <button
                  onClick={onClose}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded text-xs shadow transition cursor-pointer"
                >
                  Close Review
                </button>
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT AREA: QUESTION VIEW & OPTIONS */}
            <main className="flex-1 bg-white flex flex-col justify-between overflow-y-auto">
              <div className="p-6 space-y-5 max-w-5xl mx-auto w-full">
                {activeQuestion ? (
                  <div className="space-y-5">
                    
                    {/* QUESTION HEADER & STATUS TAG */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-slate-800">
                          Question : {questions.findIndex((q) => q.id === activeQuestion.id) + 1}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {activeQuestion.subject}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        {activeQuestion.status === "Correct" && (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                            ✓ Correct (+{activeQuestion.positiveMarks})
                          </span>
                        )}
                        {activeQuestion.status === "Wrong" && (
                          <span className="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
                            ✕ Wrong ({activeQuestion.negativeMarks})
                          </span>
                        )}
                        {activeQuestion.status === "Unattempted" && (
                          <span className="bg-slate-100 text-slate-600 border border-slate-300 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                            ⚪ Unattempted (0)
                          </span>
                        )}
                        <ReportErrorButton questionId={activeQuestion.id} />
                      </div>
                    </div>

                    {/* QUESTION TEXT */}
                    <div className="text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-4 rounded border border-slate-200">
                      <LatexRenderer text={cleanText(activeQuestion.questionText)} />
                      {activeQuestion.imageUrl && (
                        <div className="mt-3">
                          <QuestionImage imageUrl={activeQuestion.imageUrl} examName={attempt?.examName} alt="Question Diagram" className="max-h-72 object-contain rounded" />
                        </div>
                      )}
                    </div>

                    {/* OPTIONS ANALYSIS */}
                    {isNumericalQuestion(activeQuestion) ? (
                      <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Numerical Answer Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={`p-3 rounded border ${activeQuestion.status === "Correct" ? "bg-emerald-50 border-emerald-300 text-emerald-900" : activeQuestion.status === "Wrong" ? "bg-rose-50 border-rose-300 text-rose-900" : "bg-white border-slate-200 text-slate-700"}`}>
                            <span className="text-xs text-slate-500 block mb-1">Your Answer:</span>
                            <span className="font-bold text-sm">
                              {activeQuestion.userAnswer !== null && activeQuestion.userAnswer !== "" ? activeQuestion.userAnswer : "Not Attempted"}
                            </span>
                          </div>
                          <div className="p-3 rounded border bg-emerald-50 border-emerald-300 text-emerald-900">
                            <span className="text-xs text-emerald-700 block mb-1">Correct Answer:</span>
                            <span className="font-bold text-sm">
                              {activeQuestion.correctOption}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Options &amp; Answer Key Analysis</h4>
                        
                        <div className="grid grid-cols-1 gap-2.5">
                          {[
                            { key: "A", value: activeQuestion.optionA },
                            { key: "B", value: activeQuestion.optionB },
                            { key: "C", value: activeQuestion.optionC },
                            { key: "D", value: activeQuestion.optionD },
                          ].map((opt) => {
                            const cleanedVal = cleanText(opt.value);
                            const correctKeys = (activeQuestion.correctOption || "")
                              .toUpperCase()
                              .split(";")
                              .map((k: string) => k.trim())
                              .filter(Boolean);
                            const isCorrectOption = correctKeys.includes(opt.key);
                            const userSelectedKeys = (activeQuestion.userAnswer || "")
                              .toUpperCase()
                              .split(";")
                              .map((k: string) => k.trim())
                              .filter(Boolean);
                            const isUserSelected = userSelectedKeys.includes(opt.key);

                            let optionCardStyle = "border-slate-200 bg-white text-slate-800";
                            let badge = null;

                            if (isCorrectOption && isUserSelected) {
                              optionCardStyle = "border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                              badge = <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded">✓ Your Choice (Correct)</span>;
                            } else if (isCorrectOption) {
                              optionCardStyle = "border-2 border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                              badge = <span className="text-xs font-bold bg-emerald-700 text-white px-2.5 py-0.5 rounded">✓ Official Correct Answer</span>;
                            } else if (isUserSelected) {
                              optionCardStyle = "border-2 border-rose-500 bg-rose-50 text-rose-900 font-semibold";
                              badge = <span className="text-xs font-bold bg-rose-600 text-white px-2.5 py-0.5 rounded">✕ Your Choice (Incorrect)</span>;
                            }

                            const isImg = checkIsImageOption(cleanedVal);

                            return (
                              <div
                                key={opt.key}
                                className={`p-2.5 sm:p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs transition gap-2 ${optionCardStyle}`}
                              >
                                <div className="flex items-start sm:items-center space-x-2.5 sm:space-x-3 flex-1 min-w-0">
                                  <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0 ${
                                    isCorrectOption ? 'bg-emerald-600 text-white' : isUserSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {opt.key}
                                  </span>
                                  <div className="flex-1 font-medium break-words min-w-0 text-xs sm:text-sm">
                                    {isImg ? (
                                      <QuestionImage imageUrl={cleanedVal} examName={attempt?.examName} alt={`Option ${opt.key}`} className="max-h-24 object-contain rounded" />
                                    ) : (
                                      <LatexRenderer text={cleanedVal} />
                                    )}
                                  </div>
                                </div>
                                {badge && <div className="shrink-0 self-end sm:self-auto text-[10px] sm:text-xs">{badge}</div>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* SOLUTION / EXPLANATION SECTION */}
                    {activeQuestion.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 space-y-2 text-xs text-slate-800">
                        <h4 className="font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 text-xs sm:text-sm">
                          💡 Solution &amp; Detailed Explanation
                        </h4>
                        <div className="leading-relaxed text-xs sm:text-sm">
                          <LatexRenderer text={activeQuestion.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="min-h-[200px] flex items-center justify-center text-slate-500 text-xs">
                    No questions match the selected filters.
                  </div>
                )}
              </div>

              {/* FOOTER NAVIGATION */}
              <footer className="border-t border-slate-300 bg-slate-50 px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between shrink-0 gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 border border-slate-300 disabled:opacity-40 text-slate-700 shadow-xs transition cursor-pointer"
                >
                  ← <span className="hidden sm:inline">Previous</span>
                </button>
                <span className="text-[11px] sm:text-xs text-slate-600 font-bold text-center">
                  {currentIndex + 1} of {filteredQuestions.length}
                </span>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                  disabled={currentIndex === filteredQuestions.length - 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-xs transition cursor-pointer"
                >
                  <span className="hidden sm:inline">Next Question</span> →
                </button>
              </footer>
            </main>
          </div>
        )}

      </div>
    </div>
  );
};

export default TestReviewModal;
