"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../../../../components/NavBar';

export default function JeeAdvancedDashboard() {
  const router = useRouter();
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

  const papers = [
    { id: "paper-1", name: "Paper 1 (09:00 AM - 12:00 PM)", status: "Ready to Launch", questions: 54 },
    { id: "paper-2", name: "Paper 2 (02:30 PM - 05:30 PM)", status: "Ready to Launch", questions: 54 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <NavBar />
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors mt-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">JEE Advanced Ultimate Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Select your paper challenge. Advanced testing requires rigorous analytical accuracy.</p>

          <div className="space-y-3 mb-8">
            {papers.map((paper) => (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper.name)}
                className={`p-5 border-2 rounded-xl cursor-pointer transition flex justify-between items-center ${
                  selectedPaper === paper.name
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:border-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{paper.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{paper.questions} Advanced Tier Questions • <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{paper.status}</span></p>
                </div>
                <input type="radio" checked={selectedPaper === paper.name} readOnly className="h-4 w-4 text-indigo-600" />
              </div>
            ))}
          </div>

          <button disabled={!selectedPaper} className={`w-full py-3.5 rounded-xl font-bold text-white transition ${selectedPaper ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'}`}>
            Initialize Heavy Workspace
          </button>
        </div>
      </div>
    </div>
  );
}