"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import {
  fetchAdminErrorReports,
  updateAdminReportStatus,
  AdminErrorReport,
  ErrorReportStatus,
} from "@/src/lib/reportApi";

const STATUS_BADGES: Record<ErrorReportStatus, { label: string; badge: string; icon: string }> = {
  pending: { label: "Pending", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: "🟡" },
  reviewing: { label: "Reviewing", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: "🔵" },
  resolved: { label: "Resolved", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: "🟢" },
  rejected: { label: "Rejected", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: "🔴" },
};

export default function AdminErrorReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<AdminErrorReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [examFilter, setExamFilter] = useState<string>("All");
  
  // Selected Report Modal
  const [selectedReport, setSelectedReport] = useState<AdminErrorReport | null>(null);
  const [newStatus, setNewStatus] = useState<ErrorReportStatus>("pending");
  const [adminComment, setAdminComment] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateMsg, setUpdateMsg] = useState<string>("");

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminErrorReports({
        status: statusFilter !== "All" ? statusFilter : undefined,
        exam: examFilter !== "All" ? examFilter : undefined,
      });
      setReports(data);
    } catch (err: any) {
      console.error("Admin fetch reports error:", err);
      setError(err.message || "Failed to fetch error reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter, examFilter]);

  const openReportModal = (report: AdminErrorReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminComment(report.adminComment || "");
    setUpdateMsg("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;
    setUpdating(true);
    setUpdateMsg("");

    try {
      await updateAdminReportStatus(selectedReport.id, {
        status: newStatus,
        adminComment: adminComment.trim(),
      });

      setUpdateMsg("Status updated successfully!");
      loadReports();
      setTimeout(() => {
        setSelectedReport(null);
      }, 1200);
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.message || "Failed to update report status.");
    } finally {
      setUpdating(false);
    }
  };

  const examOptions = React.useMemo(() => {
    const exams = new Set<string>();
    reports.forEach((r) => {
      if (r.question?.examName) exams.add(r.question.examName);
    });
    return ["All", ...Array.from(exams)];
  }, [reports]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <NavBar />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
              <span>🛠️ Admin Console</span>
            </div>
            <h1 className="text-3xl font-black text-slate-100 mt-1">Question Error Reports</h1>
            <p className="text-xs text-slate-400 mt-1">
              Review, manage, and resolve student-reported errors across all exams and shifts.
            </p>
          </div>

          <button
            onClick={loadReports}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 w-fit"
          >
            <span>↻ Refresh Data</span>
          </button>
        </div>

        {/* Filters bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
              {["All", "Pending", "Reviewing", "Resolved", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    statusFilter === st
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Exam Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400">Exam:</span>
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500"
              >
                {examOptions.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Total Reports: <strong className="text-slate-200">{reports.length}</strong>
          </div>
        </div>

        {/* Reports Table / List */}
        {loading ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-xs text-slate-400 mt-3">Loading error reports database...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-950/20 border border-rose-900 rounded-2xl text-xs text-rose-400">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-base font-bold text-slate-300">No Error Reports Found</p>
            <p className="text-xs text-slate-500 mt-1">There are no reports matching the selected filters.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Exam / Shift</th>
                    <th className="p-3.5">Error Type</th>
                    <th className="p-3.5">Student Description</th>
                    <th className="p-3.5">Reported By</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {reports.map((r) => {
                    const badge = STATUS_BADGES[r.status] || STATUS_BADGES.pending;
                    return (
                      <tr key={r.id} className="hover:bg-slate-850/50 transition">
                        <td className="p-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-bold ${badge.badge}`}>
                            <span>{badge.icon}</span>
                            <span>{badge.label}</span>
                          </span>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-bold text-slate-200">{r.question.examName}</div>
                          <div className="text-[11px] text-slate-400">{r.question.shiftName}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-bold text-indigo-400">{r.errorType}</span>
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <p className="line-clamp-2 text-slate-300 font-medium">&quot;{r.description}&quot;</p>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-200">{r.user.fullName}</div>
                          <div className="text-[11px] text-slate-500">{r.user.email}</div>
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                          {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="p-3.5 whitespace-nowrap text-right">
                          <button
                            onClick={() => openReportModal(r)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                          >
                            Review Report →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Admin Report Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-955/80 backdrop-blur-sm"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Report Detail</span>
                <h2 className="text-lg font-bold text-slate-100 mt-0.5">
                  {selectedReport.question.examName} ({selectedReport.question.shiftName})
                </h2>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-200 text-lg p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {updateMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs font-bold text-center">
                {updateMsg}
              </div>
            )}

            {/* Question Details */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-850 pb-2">
                <span>Subject: <strong className="text-slate-200">{selectedReport.question.subject}</strong></span>
                <span>Question ID: <code className="text-indigo-400">{selectedReport.question.id}</code></span>
              </div>

              <div className="text-xs text-slate-200 font-medium whitespace-pre-line">
                {selectedReport.question.questionText}
              </div>

              {selectedReport.question.imageUrl && (
                <div className="p-2 border border-slate-800 rounded-lg bg-slate-900 flex justify-center">
                  <img src={selectedReport.question.imageUrl} alt="Diagram" className="max-h-40 object-contain" />
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-850">
                <div className={`p-2 rounded-lg border ${selectedReport.question.correctOption === "A" ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
                  A) {selectedReport.question.optionA}
                </div>
                <div className={`p-2 rounded-lg border ${selectedReport.question.correctOption === "B" ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
                  B) {selectedReport.question.optionB}
                </div>
                <div className={`p-2 rounded-lg border ${selectedReport.question.correctOption === "C" ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
                  C) {selectedReport.question.optionC}
                </div>
                <div className={`p-2 rounded-lg border ${selectedReport.question.correctOption === "D" ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold" : "border-slate-800 bg-slate-900 text-slate-400"}`}>
                  D) {selectedReport.question.optionD}
                </div>
              </div>
            </div>

            {/* Reporter info & User Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Reported By: <strong className="text-slate-200">{selectedReport.user.fullName} ({selectedReport.user.email})</strong></span>
                <span className="font-bold text-amber-400">Issue: {selectedReport.errorType}</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-1">
                <span className="text-slate-400 font-bold">Student Explanation:</span>
                <p>&quot;{selectedReport.description}&quot;</p>
              </div>
            </div>

            {/* Status & Admin Comment Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Update Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ErrorReportStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-slate-100 outline-none focus:border-indigo-500"
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="reviewing">🔵 Reviewing</option>
                    <option value="resolved">🟢 Resolved</option>
                    <option value="rejected">🔴 Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Resolved Date
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-400 font-mono">
                    {selectedReport.resolvedAt ? new Date(selectedReport.resolvedAt).toLocaleDateString() : "Not resolved yet"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Comment / Note
                </label>
                <textarea
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  placeholder="e.g. Verified answer key change to option B in database update."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-slate-100 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
