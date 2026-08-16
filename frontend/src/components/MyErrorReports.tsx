"use client";

import React, { useEffect, useState } from "react";
import { fetchUserErrorReports, getCachedUserReports, UserErrorReport, ErrorReportStatus } from "@/src/lib/reportApi";

const STATUS_CONFIG: Record<
  ErrorReportStatus,
  { label: string; badgeClass: string; icon: string }
> = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: "🟡",
  },
  reviewing: {
    label: "Reviewing",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "🔵",
  },
  resolved: {
    label: "Resolved",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "🟢",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: "🔴",
  },
};

export const MyErrorReports: React.FC = () => {
  const cachedData = getCachedUserReports();
  const [reports, setReports] = useState<UserErrorReport[]>(cachedData || []);
  const [loading, setLoading] = useState<boolean>(!cachedData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadReports = async () => {
    // Only show full loading UI if we have no cached or displayed reports yet
    if (!reports.length && !getCachedUserReports()) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError("");

    try {
      const data = await fetchUserErrorReports();
      setReports(data);
    } catch (err: any) {
      console.warn("Failed to load user error reports:", err);
      if (!reports.length && !getCachedUserReports()) {
        setError(err.message || "Failed to load report history.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🚩</span> My Error Reports
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track the status of question issues and feedback you submitted.
          </p>
        </div>

        <button
          onClick={() => loadReports()}
          disabled={loading || isRefreshing}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          <span className={isRefreshing ? "animate-spin inline-block" : ""}>↻</span>
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading your error reports...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Error Reports Submitted</p>
          <p className="text-xs text-slate-400">
            When you report an error on any question during test practice, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG.pending;

            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2.5 transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {report.examName} · {report.shiftName}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Subject: <strong className="text-slate-600 dark:text-slate-200">{report.subject}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusConfig.badgeClass}`}>
                      <span>{statusConfig.icon}</span>
                      <span>{statusConfig.label}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Issue: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{report.errorType}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    &quot;{report.description}&quot;
                  </p>
                </div>

                {report.questionText && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    <strong className="text-slate-600 dark:text-slate-300">Question:</strong> {report.questionText}
                  </p>
                )}

                {report.adminComment && (
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-2.5 rounded-xl text-xs space-y-0.5">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">Admin Response:</span>
                    <p className="text-indigo-900 dark:text-indigo-200">{report.adminComment}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
