"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../../../../components/NavBar';

export default function SscChslDashboard() {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-orange-50/30 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <NavBar />
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-orange-100 dark:border-slate-800 transition-colors mt-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">SSC CHSL Speed Engine</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Test your speed-run agility. High accuracy at top speeds secures the rank.</p>

          <div className="p-5 border-2 border-dashed border-orange-200 dark:border-orange-900/50 rounded-xl bg-orange-50/20 dark:bg-orange-950/20 mb-8 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">Full Length Speed Mock-01</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Time Limit: 60 Minutes • Total Marks: 200</p>
            </div>
            <button onClick={() => setSelectedSession("mock-01")} className={`px-5 py-2 rounded-lg font-bold transition cursor-pointer ${selectedSession ? 'bg-orange-600 text-white' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900'}`}>
              {selectedSession ? 'Selected' : 'Select Paper'}
            </button>
          </div>

          <button disabled={!selectedSession} className={`w-full py-3.5 rounded-xl font-bold text-white transition ${selectedSession ? 'bg-orange-500 hover:bg-orange-600 shadow-md cursor-pointer' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}>
            Begin Rapid Exam Run
          </button>
        </div>
      </div>
    </div>
  );
}