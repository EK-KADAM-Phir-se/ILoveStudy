"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Real NTA schedule days for January
const janExamDays = [22, 23, 24, 28, 29];

const mainsPapersData: Record<number, { january: string[]; april: string[] }> = {
  2026: {
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

function JeeExamPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawExamType = searchParams.get('type');
  const examType = rawExamType || 'mains';
  const isAdvanced = examType === 'advanced';
  const displayName = isAdvanced ? 'JEE Advanced' : 'JEE Mains';

  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const years = Array.from({ length: 10 }, (_, index) => 2026 - index);

  // Load database shifts on component mount
  useEffect(() => {
    const fetchDbShifts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/exams');
        if (!response.ok) throw new Error('Failed to fetch exams');
        const data = await response.json();
        
        // Find the "JEE Main" exam in the fetched exams list
        const jeeMain = data.find((e: any) => e.name === 'JEE Main');
        if (jeeMain && jeeMain.shifts) {
          setDbShifts(jeeMain.shifts);
        }
      } catch (error) {
        console.error('Error fetching exams from backend:', error);
      }
    };
    fetchDbShifts();
  }, []);

  const handleStartExam = (name: string, year: number, shiftId?: string) => {
    if (shiftId) {
      router.push(`/pages/dashboard/jee-mains/workspace?shiftId=${shiftId}&name=${encodeURIComponent(name)}&year=${year}`);
    } else {
      alert(`Launching Exam Workspace...\nSeries: ${displayName}\nYear: ${year}\nTarget: ${name}\n\n(Note: This is a static mock card; database-seeded cards will say 'Start DB Exam')`);
    }
  };

  // Helper to merge static shift structure with dynamic DB shifts
  const getShiftsForAttempt = (year: number, attempt: 'january' | 'april') => {
    const staticNames = mainsPapersData[year]?.[attempt] || [];
    
    // Filter DB shifts matching this year and attempt month
    const matchingDbShifts = dbShifts.filter((shift: any) => {
      const shiftDate = new Date(shift.date);
      const shiftYear = shiftDate.getUTCFullYear();
      const shiftMonth = shiftDate.getUTCMonth(); // 0 = Jan, 3 = Apr
      
      const matchesYear = shiftYear === year;
      const matchesAttempt = (attempt === 'january' && shiftMonth === 0) || 
                             (attempt === 'april' && shiftMonth === 3);
                             
      return matchesYear && matchesAttempt;
    });
    
    const combined: { name: string; id?: string }[] = [];
    
    // Add DB shifts first
    matchingDbShifts.forEach((shift: any) => {
      combined.push({ name: shift.name, id: shift.id });
    });
    
    // Add static mock shifts if they don't duplicate a DB shift name
    staticNames.forEach((name: string) => {
      if (!combined.some(c => c.name === name)) {
        combined.push({ name });
      }
    });

    // Sort by day number in the name
    combined.sort((a, b) => {
      const getDayNum = (name: string) => {
        const match = name.match(/^(\d+)/);
        return match ? parseInt(match[1], 10) : 999;
      };
      return getDayNum(a.name) - getDayNum(b.name);
    });
    
    return combined;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/pages/dashboard')} className="text-gray-600 hover:text-blue-600 font-semibold text-sm transition">
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
            : `Select a year to explore its shifted papers divided by session attempts.`}
        </p>

        <div className="space-y-4 w-full">
          {years.map((year) => {
            const isExpanded = expandedYear === year;
            const janShifts = getShiftsForAttempt(year, 'january');
            const aprShifts = getShiftsForAttempt(year, 'april');
            const totalPapersCount = isAdvanced ? 2 : (janShifts.length + aprShifts.length);

            return (
              <div key={year} className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition">
                {/* Accordion Row Clicker */}
                <div
                  onClick={() => setExpandedYear(isExpanded ? null : year)}
                  className={`w-full p-5 flex justify-between items-center cursor-pointer transition ${isExpanded ? 'bg-blue-50/40 border-b border-gray-100' : 'hover:bg-gray-50/50'
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
                          {janShifts.map((shift, idx) => (
                            <div key={idx} onClick={() => handleStartExam(shift.name, year, shift.id)} className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition flex justify-between items-center group">
                              <span className="text-sm font-medium text-gray-700">{shift.name}</span>
                              <span className={`text-xs font-bold px-2.5 py-1.5 rounded transition ${
                                shift.id 
                                  ? 'text-green-700 bg-green-50 group-hover:bg-green-600 group-hover:text-white' 
                                  : 'text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white'
                              }`}>
                                {shift.id ? 'Start DB Exam \u2192' : 'Start Mock \u2192'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* April Column */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wider mb-3 border-l-4 border-orange-500 pl-2">April Attempt</h3>
                          {aprShifts.map((shift, idx) => (
                            <div key={idx} onClick={() => handleStartExam(shift.name, year, shift.id)} className="w-full bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50/10 cursor-pointer transition flex justify-between items-center group">
                              <span className="text-sm font-medium text-gray-700">{shift.name}</span>
                              <span className={`text-xs font-bold px-2.5 py-1.5 rounded transition ${
                                shift.id 
                                  ? 'text-green-700 bg-green-50 group-hover:bg-green-600 group-hover:text-white' 
                                  : 'text-orange-600 bg-orange-50 group-hover:bg-orange-600 group-hover:text-white'
                              }`}>
                                {shift.id ? 'Start DB Exam \u2192' : 'Start Mock \u2192'}
                              </span>
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

export default function JeeExamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading JEE Exam Workspace...</div>}>
      <JeeExamPageContent />
    </Suspense>
  );
}