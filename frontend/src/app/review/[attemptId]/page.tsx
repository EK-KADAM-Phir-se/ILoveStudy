"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const TestReviewModal = dynamic(() => import("@/src/components/TestReviewModal"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-slate-300">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="text-sm font-semibold text-slate-400">Loading attempt review...</p>
    </div>
  ),
});

export default function AttemptReviewPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = (params.attemptId as string) || "";

  if (!attemptId) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-400">
        <p>Invalid attempt ID.</p>
        <button
          onClick={() => router.push("/profile")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <TestReviewModal
        attemptId={attemptId}
        onClose={() => router.push("/profile")}
      />
    </div>
  );
}
