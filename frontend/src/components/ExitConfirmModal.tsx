"use client";

import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  examName?: string;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
  examName = "Exam",
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-955/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Exit {examName}?</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Are you sure you want to exit your active test session?
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-amber-300">Important Note:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Your current responses will be saved in your test history.</li>
            <li>You can return to the dashboard and resume practice anytime.</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            Resume Test
          </button>
          <button
            onClick={onConfirmExit}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
          >
            <LogOut className="w-4 h-4" /> Exit Exam
          </button>
        </div>
      </div>
    </div>
  );
};
