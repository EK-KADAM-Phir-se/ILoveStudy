"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Real NTA schedule days for January
const janExamDays = [22, 23, 24, 28, 29];

const mainsPapersData: Record<number, { january: string[]; april: string[] }> = {
  2026: {
    // Generates 10 distinct papers using the explicit exam timeline
    january: Array.from({ length: 10 }, (_, i) => {
      const day = janExamDays[Math.floor(i / 2)];
      const shift = i % 2 === 0 ? 1 : 2;
      return `${day} Jan - Shift ${shift}`;
    }),
    april: Array.from({ length: 8 }, (_, i) => `25 Apr - Shift ${i % 2 === 0 ? 1 : 2}`)
  },
  2025: {
    january: Array.from({ length: 8 }, (_, i) => `25 Jan - Shift ${i % 2 === 0 ? 1 : 2}`),
    april: Array.from({ length: 8 }, (_, i) => `25 Apr - Shift ${i % 2 === 0 ? 1 : 2}`)
  }
};

const advancedPapersData = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

export default function JeeExamPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const examType = searchParams.get('type') || 'mains';
  const isAdvanced = examType === 'advanced';
  const displayName = isAdvanced ? 'JEE Advanced' : 'JEE Mains';
  
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const years = Array.from({ length: 10 }, (_, index) => 2026 - index);

  const handleStartExam = (details: string, year: number) => {
    alert(`Launching Exam Workspace...\nSeries: ${displayName}\nYear: ${year}\nTarget: ${details}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/dashboard')} className="text-gray-600 hover:text-blue-600 font-semibold text-sm transition">
            &larr; Dashboard
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">{displayName} Workspace</h1>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full px-8 py-6 flex-grow">
        <p className="text-gray-500 mb-6 text-sm">
          {isAdvanced 
            ? "Select an examination year to instantly access Paper 1 and Paper 2 workspaces." 
            : `Select a year to explore its ${expandedYear === 2026 ? '10' : '16'} shifted papers divided by session attempts.`}
        </p>
        
        <div className="space-y-4 w-full">
          {years.map((year) => {
            const isExpanded = expandedYear === year;
            const totalPapersCount = isAdvanced ? 2 : (year === 2026 ? 10 : 16);

            return (
              <div key={year} className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition">
                {/* Accordion Row Clicker */}
                <div 
                  onClick={() => setExpandedYear(isExpanded ? null : year)}
                  className={`w-full p-5 flex justify-between items-center cursor-pointer transition ${
                    isExpanded ? 'bg-blue-50/40 border-b border-gray-100' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <span className="text-xl font-bold text-gray-800">{year} Papers</span>
                  <span className="text-blue-600 font-semibold text-sm">
                    {isExpanded ? 'Hide Sheets ▲' : `View ${totalPapersCount} Papers ▼`}
                  </span>
                </div>

                {/* Conditional Rendering Block Based on Exam Type */}
                {isExpanded && (
                  <div className="bg-gray-50/50 p-6 border-t border-gray-100 w-full">
                    {isAdvanced ? (
                      /* ====== JEE ADVANCED VIEW ====== */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          onClick={() => handleStartExam("Paper 1 (PCM)", year)}
                          className="bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition flex justify-between items-center group"
                        >
                          <div>
                            <p className="text-base font-bold text-gray-800">JEE Advanced - Paper 1</p>
                            <p className="text-xs text-gray-400 mt-1">Physics, Chemistry, Mathematics</p>
                          </div>
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-4 py-2 rounded-md transition">
                            Start Paper 1 &rarr;
                          </span>
                        </div>

                        <div 
                          onClick={() => handleStartExam("Paper 2 (PCM)", year)}
                          className="bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition flex justify-between items-center group"
                        >
                          <div>
                            <p className="text-base font-bold text-gray-800">JEE Advanced - Paper 2</p>
                            <p className="text-xs text-gray-400 mt-1">Physics, Chemistry, Mathematics</p>
                          </div>
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-4 py-2 rounded-md transition">
                            Start Paper 2 &rarr;
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* ====== JEE MAINS VIEW ====== */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* January Column */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 border-l-4 border-blue-600 pl-2">January Attempt</h3>
                          {(mainsPapersData[year]?.january || []).map((shift, idx) => (
                            <div key={idx} onClick={() => handleStartExam(shift, year)} className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition flex justify-between items-center group">
                              <span className="text-sm font-medium text-gray-700">{shift}</span>
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-2.5 py-1.5 rounded transition">Start &rarr;</span>
                            </div>
                          ))}
                        </div>
                        {/* April Column */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wider mb-3 border-l-4 border-orange-500 pl-2">April Attempt</h3>
                          {(mainsPapersData[year]?.april || []).map((shift, idx) => (
                            <div key={idx} onClick={() => handleStartExam(shift, year)} className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50/10 cursor-pointer transition flex justify-between items-center group">
                              <span className="text-sm font-medium text-gray-700">{shift}</span>
                              <span className="text-xs font-bold text-orange-600 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white px-2.5 py-1.5 rounded transition">Start &rarr;</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}