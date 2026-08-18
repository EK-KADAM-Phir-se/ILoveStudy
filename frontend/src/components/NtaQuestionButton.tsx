"use client";

import React from "react";

export type NtaQuestionStatus =
  | "answered"
  | "not_answered"
  | "not_visited"
  | "marked"
  | "answered_marked";

interface NtaQuestionButtonProps {
  questionNumber: number | string;
  status: NtaQuestionStatus;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * NtaQuestionButton renders official NTA CBT shapes:
 * - Answered: Green House/Up-Pentagon
 * - Not Answered: Red Down-Pentagon
 * - Not Visited: Grey Rounded Box
 * - Marked for Review: Purple Circle
 * - Answered & Marked for Review: Purple Circle + Small Green Badge
 */
export function NtaQuestionButton({
  questionNumber,
  status,
  isSelected = false,
  onClick,
  className = "",
  size = "md",
}: NtaQuestionButtonProps) {
  const dimensions =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
      ? "w-11 h-11 text-sm font-extrabold"
      : "w-9 h-9 text-xs font-bold";

  const ringStyle = isSelected
    ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-slate-900 scale-105 z-10"
    : "";

  if (status === "answered") {
    // Green House / Up-pointing pentagon
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex items-center justify-center font-bold text-white transition-transform cursor-pointer ${dimensions} ${ringStyle} ${className}`}
        style={{
          clipPath: "polygon(0% 25%, 50% 0%, 100% 25%, 100% 100%, 0% 100%)",
          backgroundColor: "#4cb050",
        }}
      >
        <span className="translate-y-0.5">{questionNumber}</span>
      </button>
    );
  }

  if (status === "not_answered") {
    // Red Down-pointing pentagon
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex items-center justify-center font-bold text-white transition-transform cursor-pointer ${dimensions} ${ringStyle} ${className}`}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 75%, 50% 100%, 0% 75%)",
          backgroundColor: "#d9534f",
        }}
      >
        <span className="-translate-y-0.5">{questionNumber}</span>
      </button>
    );
  }

  if (status === "marked") {
    // Purple Circle
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full font-bold text-white transition-transform cursor-pointer ${dimensions} ${ringStyle} ${className}`}
        style={{ backgroundColor: "#7a5299" }}
      >
        {questionNumber}
      </button>
    );
  }

  if (status === "answered_marked") {
    // Purple Circle + Green Badge at bottom-right
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative inline-flex items-center justify-center rounded-full font-bold text-white transition-transform cursor-pointer ${dimensions} ${ringStyle} ${className}`}
        style={{ backgroundColor: "#7a5299" }}
      >
        <span>{questionNumber}</span>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white"
          style={{ backgroundColor: "#4cb050" }}
        >
          <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </span>
      </button>
    );
  }

  // Default: Not Visited (Grey Rounded Square)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-md font-bold text-slate-800 transition-transform cursor-pointer ${dimensions} ${ringStyle} ${className}`}
      style={{ backgroundColor: "#e0e0e0" }}
    >
      {questionNumber}
    </button>
  );
}
