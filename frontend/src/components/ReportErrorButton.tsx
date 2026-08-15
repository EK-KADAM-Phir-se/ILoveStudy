"use client";

import React, { useState } from "react";
import { ReportErrorModal } from "./ReportErrorModal";

interface ReportErrorButtonProps {
  questionId: string;
  questionTextSnippet?: string;
  className?: string;
}

export const ReportErrorButton: React.FC<ReportErrorButtonProps> = ({
  questionId,
  questionTextSnippet,
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/30 transition-all duration-150 cursor-pointer select-none ${className}`}
        title="Report issue with this question"
      >
        <span className="text-xs">🚩</span>
        <span>Report Error</span>
      </button>

      <ReportErrorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questionId={questionId}
        questionTextSnippet={questionTextSnippet}
      />
    </>
  );
};
