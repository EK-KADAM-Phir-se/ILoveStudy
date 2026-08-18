"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Lock, Sparkles, LogIn, X, Eye } from "lucide-react";
import { clearGuestMode } from "@/src/lib/authUtils";

interface GuestRestrictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  actionText?: string;
}

export default function GuestRestrictionModal({
  isOpen,
  onClose,
  title = "Guest Tour Mode Limit",
  message = "You are currently exploring ILoveStudy in Guest Tour mode. Taking tests, submitting answers, and accessing organization portals require a free account.",
  actionText = "Sign In / Register",
}: GuestRestrictionModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    clearGuestMode();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden transform transition-all">
        {/* Glowing top backdrop highlight */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center mt-2 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-4">
            <Lock size={28} />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <Eye size={12} /> Overview Only Mode
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleLoginRedirect}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogIn size={18} />
            <span>{actionText}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-center"
          >
            Continue Website Tour
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Sparkles size={13} className="text-indigo-500" />
          <span>Create an account in less than 30 seconds</span>
        </div>
      </div>
    </div>
  );
}
