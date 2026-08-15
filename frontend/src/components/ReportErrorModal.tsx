"use client";

import React, { useState } from "react";
import { submitErrorReport, ErrorTypeOption } from "@/src/lib/reportApi";

interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionTextSnippet?: string;
}

const ERROR_TYPES: ErrorTypeOption[] = [
  "Wrong Question",
  "Wrong Answer",
  "Wrong Explanation",
  "Typo / Formatting",
  "Wrong Exam / Year",
  "Duplicate Question",
  "Image / Diagram Problem",
  "Other",
];

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  isOpen,
  onClose,
  questionId,
  questionTextSnippet,
}) => {
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorTypeOption>("Wrong Answer");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMsg("");
    setSuccessMsg("");

    if (!description.trim()) {
      setErrorMsg("Please describe the problem.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitErrorReport({
        questionId,
        errorType: selectedErrorType,
        description: description.trim(),
      });

      setSuccessMsg(res.message || "Error reported successfully. Thank you for helping us improve this question.");
      
      // Reset form & close modal after 1.8 seconds
      setTimeout(() => {
        setSuccessMsg("");
        setDescription("");
        setSelectedErrorType("Wrong Answer");
        onClose();
      }, 1800);
    } catch (err: any) {
      console.error("Report Error submission error:", err);
      setErrorMsg(err.message || "Failed to submit error report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-xl">🚩</span>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Report an Error</h2>
              <p className="text-xs text-slate-400">
                Found an issue with this question? Let us know and we&apos;ll fix it.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-200 transition text-lg p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-start space-x-2.5 animate-fadeIn">
            <span className="text-base leading-none">✓</span>
            <p className="flex-1">{successMsg}</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs font-semibold flex items-start space-x-2.5">
            <span className="text-base leading-none">⚠️</span>
            <p className="flex-1">{errorMsg}</p>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question ID / Snippet info */}
            {questionTextSnippet && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs text-slate-400 line-clamp-2">
                <strong className="text-slate-300">Question Snippet:</strong> {questionTextSnippet}
              </div>
            )}

            {/* Error Type Options */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Error Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ERROR_TYPES.map((type) => {
                  const isSelected = selectedErrorType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedErrorType(type)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all duration-150 flex items-center space-x-2 cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold ring-1 ring-indigo-500/30"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-indigo-400" : "bg-slate-700"}`} />
                      <span className="truncate">{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Describe the problem
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="I think the correct answer should be B because..."
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500/30 transition resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
