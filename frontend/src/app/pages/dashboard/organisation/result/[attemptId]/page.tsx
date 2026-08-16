"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import { LatexRenderer } from "@/src/app/components/LatexRenderer";
import {
  fetchStudentAttemptResult,
  StudentAttemptResultResponse,
  OrgQuestion,
} from "@/src/lib/orgApi";
import {
  Award, CheckCircle2, XCircle, HelpCircle, ArrowLeft,
  Clock, Printer, RotateCcw, Building2, User, Sparkles
} from "lucide-react";

export default function OrgStudentResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params?.attemptId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StudentAttemptResultResponse | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Correct" | "Wrong" | "Unattempted">("All");

  useEffect(() => {
    if (!attemptId) return;

    const loadResult = async () => {
      try {
        setLoading(true);
        const res = await fetchStudentAttemptResult(attemptId);
        setData(res);
      } catch (err: any) {
        console.error("Failed to load attempt result:", err);
        setError(err.response?.data?.error || "Failed to load examination result.");
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-300">Calculating your performance & scorecard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <h2 className="text-lg font-bold">Result Not Found</h2>
          <p className="text-xs text-slate-400">{error || "Unable to locate this attempt record."}</p>
          <button
            onClick={() => router.push("/pages/dashboard/organisation")}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  const { attempt, questions } = data;

  const filteredQuestions =
    selectedFilter === "All"
      ? questions
      : questions.filter((q) => q.status === selectedFilter);

  const isPassed = attempt.percentage >= 40;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Breadcrumb & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/pages/dashboard/organisation")}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Portal Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Printer size={13} />
              <span>Print Scorecard</span>
            </button>
          </div>
        </div>

        {/* ── Scorecard Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Award size={180} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center gap-1.5">
                  <Building2 size={13} />
                  {attempt.organizationName}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Code: {attempt.accessCode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {attempt.testTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-slate-500" />
                  <strong className="text-slate-200">{attempt.studentName}</strong>
                  {attempt.studentRollNumber && ` (Roll: ${attempt.studentRollNumber})`}
                </span>
                <span>•</span>
                <span>{new Date(attempt.submittedAt).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Score Big Display */}
            <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shrink-0">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Marks Obtained
                </p>
                <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
                  <span className={attempt.score >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {attempt.score}
                  </span>
                  <span className="text-lg text-slate-500 font-normal"> / {attempt.maxScore}</span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-800" />

              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Percentage
                </p>
                <p className={`text-2xl sm:text-3xl font-black mt-0.5 ${isPassed ? "text-blue-400" : "text-amber-400"}`}>
                  {attempt.percentage}%
                </p>
              </div>
            </div>
          </div>

          {/* 4 Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-[11px] font-bold uppercase text-emerald-400">Correct</p>
              <p className="text-xl font-black text-white mt-0.5">{attempt.correctCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <p className="text-[11px] font-bold uppercase text-rose-400">Incorrect</p>
              <p className="text-xl font-black text-white mt-0.5">{attempt.incorrectCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <p className="text-[11px] font-bold uppercase text-slate-400">Unattempted</p>
              <p className="text-xl font-black text-white mt-0.5">{attempt.unattemptedCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <p className="text-[11px] font-bold uppercase text-blue-400">Total Questions</p>
              <p className="text-xl font-black text-white mt-0.5">{questions.length}</p>
            </div>
          </div>
        </div>

        {/* ── Question by Question Review Section ── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Detailed Question Review</span>
                <span className="text-xs font-normal text-slate-400">({filteredQuestions.length} questions)</span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(["All", "Correct", "Wrong", "Unattempted"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const isCorrect = q.status === "Correct";
              const isWrong = q.status === "Wrong";
              const isUnattempted = q.status === "Unattempted";

              return (
                <div
                  key={q.id || idx}
                  className={`rounded-2xl border p-5 transition bg-slate-900/60 ${
                    isCorrect
                      ? "border-emerald-500/30"
                      : isWrong
                      ? "border-rose-500/30"
                      : "border-slate-800"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Q{idx + 1}.
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                        {q.subject || "General"}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : isWrong
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {isCorrect && <CheckCircle2 size={12} />}
                      {isWrong && <XCircle size={12} />}
                      {isUnattempted && <HelpCircle size={12} />}
                      <span>{q.status}</span>
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="text-sm text-slate-200 mb-4 leading-relaxed">
                    <LatexRenderer text={q.questionText} />
                    {q.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 max-w-sm">
                        <img src={q.imageUrl} alt="Question diagram" className="w-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {(["A", "B", "C", "D"] as const).map((optKey) => {
                      const optText = q[`option${optKey}` as keyof OrgQuestion] as string;
                      if (!optText) return null;

                      const isOfficialCorrect = q.correctOption === optKey;
                      const isStudentSelected = q.userAnswer === optKey;

                      let optStyles = "bg-slate-950/60 border-slate-800 text-slate-300";
                      if (isOfficialCorrect) {
                        optStyles = "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium ring-1 ring-emerald-500/50";
                      } else if (isStudentSelected && !isOfficialCorrect) {
                        optStyles = "bg-rose-500/10 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/50";
                      }

                      return (
                        <div
                          key={optKey}
                          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${optStyles}`}
                        >
                          <span className="font-bold shrink-0">{optKey}.</span>
                          <div className="flex-1">
                            <LatexRenderer text={optText} />
                          </div>
                          {isOfficialCorrect && (
                            <span className="text-[10px] uppercase font-bold text-emerald-400 shrink-0">
                              Correct ✓
                            </span>
                          )}
                          {isStudentSelected && !isOfficialCorrect && (
                            <span className="text-[10px] uppercase font-bold text-rose-400 shrink-0">
                              Your Ans ✗
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution / Explanation */}
                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
                      <p className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                        <Sparkles size={13} />
                        <span>Explanation & Solution:</span>
                      </p>
                      <LatexRenderer text={q.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
