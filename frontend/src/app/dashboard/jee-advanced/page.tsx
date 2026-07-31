"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JeeAdvancedDashboard() {
  const router = useRouter();
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

  const papers = [
    { id: "paper-1", name: "Paper 1 (09:00 AM - 12:00 PM)", status: "Ready to Launch", questions: 54 },
    { id: "paper-2", name: "Paper 2 (02:30 PM - 05:30 PM)", status: "Ready to Launch", questions: 54 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto mb-4">
        <button onClick={() => router.push('/dashboard')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">&larr; Back to Dashboard</button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">JEE Advanced Ultimate Portal</h1>
        <p className="text-slate-500 mb-6">Select your paper challenge. Advanced testing requires rigorous analytical accuracy.</p>

        <div className="space-y-3 mb-8">
          {papers.map((paper) => (
            <div 
              key={paper.id}
              onClick={() => setSelectedPaper(paper.name)}
              className={`p-5 border-2 rounded-xl cursor-pointer transition flex justify-between items-center ${
                selectedPaper === paper.name ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div>
                <p className="font-bold text-slate-800">{paper.name}</p>
                <p className="text-xs text-slate-500 mt-1">{paper.questions} Advanced Tier Questions • <span className="text-indigo-600 font-semibold">{paper.status}</span></p>
              </div>
              <input type="radio" checked={selectedPaper === paper.name} readOnly className="h-4 w-4 text-indigo-600" />
            </div>
          ))}
        </div>

        <button disabled={!selectedPaper} className={`w-full py-3.5 rounded-xl font-bold text-white transition ${selectedPaper ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' : 'bg-slate-200 cursor-not-allowed'}`}>
          Initialize Heavy Workspace
        </button>
      </div>
    </div>
  );
}