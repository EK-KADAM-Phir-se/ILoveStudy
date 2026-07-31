"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SscCglDashboard() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto mb-4">
        <button onClick={() => router.push('/pages/dashboard')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">&larr; Back to Dashboard</button>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
        <h1 className="text-3xl font-extrabold text-zinc-900 mb-2">SSC CGL Combined Graduate Level</h1>
        <p className="text-zinc-500 mb-6">Select your active Tier workspace. Focus entirely on timing accuracy and quick question turnaround.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {['Tier 1: Prelims Mock', 'Tier 2: Mains Mock'].map((tier) => (
            <div
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition text-left ${selectedTier === tier ? 'border-emerald-600 bg-emerald-50/30' : 'border-zinc-200 bg-white hover:border-emerald-400'
                }`}
            >
              <p className="font-bold text-zinc-800 text-lg">{tier}</p>
              <p className="text-xs text-emerald-600 font-medium mt-2">● 100 Questions Live</p>
            </div>
          ))}
        </div>

        <button disabled={!selectedTier} className={`w-full py-3.5 rounded-xl font-bold text-white transition ${selectedTier ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' : 'bg-zinc-200 cursor-not-allowed'}`}>
          Launch Official SSC Exam Simulator
        </button>
      </div>
    </div>
  );
}