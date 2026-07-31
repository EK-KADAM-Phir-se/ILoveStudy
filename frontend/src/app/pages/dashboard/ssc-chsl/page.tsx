"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SscChslDashboard() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-orange-50/30 p-6">
      <div className="max-w-4xl mx-auto mb-4">
        <button onClick={() => router.push('/pages/dashboard')} className="text-sm font-semibold text-orange-600 hover:text-orange-800 flex items-center gap-1">&larr; Back to Dashboard</button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">SSC CHSL Speed Engine</h1>
        <p className="text-slate-500 mb-6">Test your speed-run agility. High accuracy at top speeds secures the rank.</p>

        <div className="p-5 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/20 mb-8 flex justify-between items-center">
          <div>
            <p className="font-bold text-slate-800">Full Length Speed Mock-01</p>
            <p className="text-xs text-slate-500 mt-1">Time Limit: 60 Minutes • Total Marks: 200</p>
          </div>
          <button onClick={() => setSelectedSession("mock-01")} className={`px-5 py-2 rounded-lg font-bold transition ${selectedSession ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
            {selectedSession ? 'Selected' : 'Select Paper'}
          </button>
        </div>

        <button disabled={!selectedSession} className={`w-full py-3.5 rounded-xl font-bold text-white transition ${selectedSession ? 'bg-orange-500 hover:bg-orange-600 shadow-md' : 'bg-slate-200 cursor-not-allowed'}`}>
          Begin Rapid Exam Run
        </button>
      </div>
    </div>
  );
}