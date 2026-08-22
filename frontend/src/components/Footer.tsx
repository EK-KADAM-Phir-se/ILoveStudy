"use client";

import React, { useState } from "react";
import { MessageSquareHeart, FileText } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { TermsModal } from "./TermsModal";

export default function Footer() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-gray-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ILoveStudy. All rights reserved.</p>

          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => setIsTermsOpen(true)}
              className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition cursor-pointer group"
              aria-label="Open Terms and Conditions Dialog"
            >
              <FileText size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span>Terms & Conditions</span>
            </button>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition cursor-pointer group"
              aria-label="Open Feedback Dialog"
            >
              <MessageSquareHeart size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
              <span>Feedback</span>
            </button>
          </div>
        </div>
      </footer>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </>
  );
}


