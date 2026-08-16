"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, MessageSquare, Star, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Bug Report",
  "Question Error",
  "Suggestion",
  "UI/UX",
  "Other",
] as const;

type CategoryType = typeof CATEGORIES[number];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState<CategoryType>("Suggestion");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Reset feedback form states
    setSuccessMessage(false);
    setErrorMessage(null);
    setSubmitting(false);

    // Get prefilled info from localStorage or Supabase session
    const savedName = localStorage.getItem("displayName") || "";
    const savedEmail = localStorage.getItem("userEmail") || "";
    setName(savedName);
    setEmail(savedEmail);

    async function checkAuthSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (!savedName && session.user.user_metadata?.full_name) {
            setName(session.user.user_metadata.full_name);
          }
          if (!savedEmail && session.user.email) {
            setEmail(session.user.email);
          }
        }
      } catch (err) {
        console.warn("Session check in feedback modal:", err);
      }
    }

    checkAuthSession();
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedMessage = message.trim();

    // Validation
    if (!category) {
      setErrorMessage("Please select a feedback category.");
      return;
    }

    if (!trimmedMessage) {
      setErrorMessage("Please enter a feedback message.");
      return;
    }

    if (trimmedMessage.length > 5000) {
      setErrorMessage("Message cannot exceed 5000 characters.");
      return;
    }

    if (rating !== null && (rating < 1 || rating > 5)) {
      setErrorMessage("Rating must be between 1 and 5.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Get authenticated user ID if present
      let userId: string | null = null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          userId = session.user.id;
        }
      } catch (authErr) {
        console.warn("Could not retrieve Supabase auth user:", authErr);
      }

      // 2. Get current page URL
      const pageUrl = typeof window !== "undefined" ? window.location.href : "";

      // 3. Insert into public.feedback (Try direct Supabase client first, with API fallback)
      let isInserted = false;

      try {
        const { error } = await supabase.from("feedback").insert([
          {
            user_id: userId,
            name: name.trim() || null,
            email: email.trim() || null,
            category,
            message: trimmedMessage,
            rating: rating || null,
            page_url: pageUrl,
          },
        ]);

        if (!error) {
          isInserted = true;
        } else {
          console.warn("Direct Supabase insertion failed, attempting backend sync fallback:", error);
        }
      } catch (sbErr) {
        console.warn("Supabase client exception, attempting backend sync fallback:", sbErr);
      }

      // If Supabase client was blocked by API role permissions, send via backend database pooler
      if (!isInserted) {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_BASE}/api/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            name: name.trim() || null,
            email: email.trim() || null,
            category,
            message: trimmedMessage,
            rating: rating || null,
            page_url: pageUrl,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to submit feedback.");
        }
      }

      // Success
      setSuccessMessage(true);
      setMessage("");
      setRating(null);
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base font-bold text-gray-900 dark:text-slate-100">
                Send Private Feedback
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Help us improve your study experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {successMessage ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Thank You!
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 max-w-xs mx-auto">
                  Thank you for your feedback! Your feedback has been received.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-gray-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-semibold text-sm hover:opacity-90 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Category Dropdown */}
              <div>
                <label htmlFor="feedback-category" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-medium text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Rating <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(rating === star ? null : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={22}
                        className={`${
                          (hoverRating !== null ? star <= hoverRating : rating !== null && star <= rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-slate-700"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  {rating && (
                    <button
                      type="button"
                      onClick={() => setRating(null)}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 ml-2 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="feedback-message" className="block text-xs font-semibold text-gray-700 dark:text-slate-300">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[11px] font-mono ${message.length > 4800 ? "text-rose-500 font-bold" : "text-gray-400 dark:text-slate-500"}`}>
                    {message.length} / 5000
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind, report an issue, or suggest a feature..."
                  rows={4}
                  maxLength={5000}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition resize-y min-h-[100px]"
                  required
                />
              </div>

              {/* Name (Optional) */}
              <div>
                <label htmlFor="feedback-name" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Your Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="feedback-email" className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                  Your Email <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
