"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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

  useEffect(() => {
    if (!attemptId) return;

    const fetchReviewData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? (localStorage.getItem("token") || "SIMULATED_TOKEN") : "SIMULATED_TOKEN";
        const res = await axios.get(`http://localhost:5000/api/test/review/${attemptId}`, {
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

  // Helper to extract numeric values from option strings
  const getNumericVal = (str: string) => {
    if (!str) return "";
    const match = str.toString().match(/\(?[1-4]?\)?\s*(-?\d+(\.\d+)?)/);
    return match ? match[1] : str.toString().trim();
  };

  const isNumericalQuestion = (q: ReviewQuestion) => {
    if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) return true;
    return getNumericVal(q.optionA) === getNumericVal(q.optionB);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* TOP HEADER BAR */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg">
              🔍
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
                {attempt ? `${attempt.examName} — ${attempt.shiftName}` : "Test Attempt Review"}
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Detailed Review
                </span>
              </h2>
              {attempt && (
                <p className="text-xs text-slate-400">
                  Submitted on {new Date(attempt.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {attempt && (
              <div className="hidden md:flex items-center space-x-3 text-xs bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">Score: </span>
                  <span className="font-extrabold text-indigo-400 text-sm">{attempt.score}</span>
                  <span className="text-slate-400"> / {attempt.maxMarks}</span>
                </div>
                <div className="h-4 w-px bg-slate-800"></div>
                <div>
                  <span className="text-slate-400">Accuracy: </span>
                  <span className="font-extrabold text-emerald-400 text-sm">{attempt.percentage}%</span>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700"
              title="Close Review"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center space-y-4 p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-sm font-semibold text-slate-400 animate-pulse">Loading attempt review data...</p>
          </div>
        ) : error ? (
          <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <p className="text-rose-400 font-semibold">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              Close
            </button>
          </div>
        ) : !attempt || questions.length === 0 ? (
          <div className="flex-1 min-h-[400px] flex items-center justify-center p-8 text-slate-400 text-sm">
            No review questions found for this attempt.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            
            {/* LEFT MAIN PANEL: QUESTION DETAILS */}
            <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
              
              {/* SUMMARY STATS BANNER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex flex-col">
                  <span className="text-slate-400">Total Score</span>
                  <span className="text-base font-extrabold text-indigo-400">
                    {attempt.score} <span className="text-xs font-normal text-slate-400">/ {attempt.maxMarks}</span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">Correct ({attempt.correctCount})</span>
                  <span className="text-base font-extrabold text-emerald-400">+{attempt.correctCount * 4} pts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">Incorrect ({attempt.incorrectCount})</span>
                  <span className="text-base font-extrabold text-rose-400">-{attempt.incorrectCount} pts</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400">Unattempted</span>
                  <span className="text-base font-extrabold text-slate-400">{attempt.unattemptedCount}</span>
                </div>
              </div>

              {/* ACTIVE QUESTION CONTAINER */}
              {activeQuestion ? (
                <div className="space-y-6">
                  
                  {/* QUESTION HEADER TAGS */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide">
                        Question {questions.findIndex((q) => q.id === activeQuestion.id) + 1} of {questions.length}
                      </span>
                      <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-lg text-xs font-semibold">
                        {activeQuestion.subject}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* STATUS BADGE */}
                      {activeQuestion.status === "Correct" && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          ✓ Correct (+{activeQuestion.positiveMarks})
                        </span>
                      )}
                      {activeQuestion.status === "Wrong" && (
                        <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          ✕ Wrong ({activeQuestion.negativeMarks})
                        </span>
                      )}
                      {activeQuestion.status === "Unattempted" && (
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                          ⚪ Unattempted (0)
                        </span>
                      )}

                      <ReportErrorButton questionId={activeQuestion.id} />
                    </div>
                  </div>

                  {/* QUESTION TEXT */}
                  <div className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                    <LatexRenderer text={activeQuestion.questionText} />
                    {activeQuestion.imageUrl && (
                      <div className="mt-3">
                        <QuestionImage imageUrl={activeQuestion.imageUrl} examName={attempt?.examName} alt="Question Diagram" />
                      </div>
                    )}
                  </div>

                  {/* OPTIONS / ANSWER DISPLAY */}
                  {isNumericalQuestion(activeQuestion) ? (
                    /* NUMERICAL QUESTION TYPE */
                    <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Numerical Answer Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-3.5 rounded-xl border ${activeQuestion.status === "Correct" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : activeQuestion.status === "Wrong" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                          <span className="text-xs text-slate-400 block mb-1">Your Answer:</span>
                          <span className="font-extrabold text-base">
                            {activeQuestion.userAnswer !== null && activeQuestion.userAnswer !== "" ? activeQuestion.userAnswer : "Not Attempted"}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                          <span className="text-xs text-emerald-400/80 block mb-1">Correct Answer:</span>
                          <span className="font-extrabold text-base">
                            {getNumericVal(activeQuestion.optionA) || activeQuestion.correctOption}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* MULTIPLE CHOICE QUESTIONS (A, B, C, D) */
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Options &amp; Analysis</h4>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: "A", value: activeQuestion.optionA },
                          { key: "B", value: activeQuestion.optionB },
                          { key: "C", value: activeQuestion.optionC },
                          { key: "D", value: activeQuestion.optionD },
                        ].map((opt) => {
                          const isCorrectOption = activeQuestion.correctOption?.toUpperCase() === opt.key;
                          const isUserSelected = activeQuestion.userAnswer?.toUpperCase() === opt.key || activeQuestion.userAnswer === getNumericVal(opt.value);

                          let borderClass = "border-slate-800 bg-slate-950/40 text-slate-300";
                          let badge = null;

                          if (isCorrectOption && isUserSelected) {
                            borderClass = "border-emerald-500/60 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
                            badge = <span className="text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">✓ Your Answer (Correct)</span>;
                          } else if (isCorrectOption) {
                            borderClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                            badge = <span className="text-[11px] font-extrabold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">✓ Correct Answer</span>;
                          } else if (isUserSelected) {
                            borderClass = "border-rose-500/60 bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30";
                            badge = <span className="text-[11px] font-extrabold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">✕ Your Choice (Incorrect)</span>;
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-3.5 rounded-xl border flex items-start space-x-3 transition ${borderClass}`}
                            >
                              <span className="font-extrabold text-sm px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shrink-0">
                                {opt.key}
                              </span>
                              <div className="flex-1 text-sm font-medium pt-0.5">
                                <LatexRenderer text={opt.value} />
                              </div>
                              {badge && <div className="shrink-0">{badge}</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SOLUTION / EXPLANATION SECTION */}
                  {activeQuestion.explanation && (
                    <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 space-y-2">
                      <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        💡 Solution &amp; Explanation
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <LatexRenderer text={activeQuestion.explanation} />
                      </div>
                    </div>
                  )}

                  {/* BOTTOM PREV/NEXT NAV BUTTONS */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition"
                    >
                      ← Previous Question
                    </button>
                    <span className="text-xs text-slate-400 font-semibold">
                      {currentIndex + 1} / {filteredQuestions.length}
                    </span>
                    <button
                      onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
                      disabled={currentIndex === filteredQuestions.length - 1}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/10"
                    >
                      Next Question →
                    </button>
                  </div>

                </div>
              ) : (
                <div className="min-h-[250px] flex items-center justify-center text-slate-400 text-sm">
                  No questions match the selected filters.
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: QUESTION GRID & FILTERS */}
            <div className="w-full lg:w-80 bg-slate-900/60 p-4 sm:p-5 space-y-5 border-l border-slate-800 shrink-0">
              
              {/* SUBJECT FILTER TABS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Subject Filter
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((subj) => (
                    <button
                      key={subj}
                      onClick={() => setSelectedSubject(subj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedSubject === subj
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* STATUS FILTER TABS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Result Status Filter
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "All", label: "All Questions", count: questions.length },
                    { id: "Correct", label: "✓ Correct", count: attempt.correctCount },
                    { id: "Wrong", label: "✕ Wrong", count: attempt.incorrectCount },
                    { id: "Unattempted", label: "⚪ Unattempted", count: attempt.unattemptedCount },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStatusFilter(st.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition text-left flex justify-between items-center ${
                        selectedStatusFilter === st.id
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/80"
                      }`}
                    >
                      <span>{st.label}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-300">
                        {st.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUESTION PALETTE GRID */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question Palette ({filteredQuestions.length})
                  </label>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-1 pt-1">
                  {filteredQuestions.map((q, idx) => {
                    const originalIdx = questions.findIndex((orig) => orig.id === q.id);
                    const isSelected = activeQuestion?.id === q.id;

                    let bgClass = "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700";

                    if (q.status === "Correct") {
                      bgClass = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30";
                    } else if (q.status === "Wrong") {
                      bgClass = "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30";
                    } else if (q.status === "Unattempted") {
                      bgClass = "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-700";
                    }

                    if (isSelected) {
                      bgClass += " ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 font-black";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-bold border transition flex items-center justify-center ${bgClass}`}
                        title={`Q${originalIdx + 1} (${q.subject}) - ${q.status}`}
                      >
                        {originalIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* LEGEND */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span>Correct Answer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500"></span>
                  <span>Incorrect Answer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-slate-600"></span>
                  <span>Unattempted Question</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TestReviewModal;
