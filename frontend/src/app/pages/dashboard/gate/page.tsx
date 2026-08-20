"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, ArrowRight, BookOpen, Layers, CheckCircle2, ShieldAlert } from "lucide-react";
import NavBar from "../../../../components/NavBar";
import Footer from "../../../../components/Footer";
import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";
import { API_BASE_URL } from "@/src/lib/apiConfig";

export default function GateDashboard() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string>("CS");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [dbShifts, setDbShifts] = useState<any[]>([]);
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);

  const branches = [
    { code: "CS", name: "Computer Science & IT", icon: "💻" },
    { code: "DA", name: "Data Science & AI", icon: "🤖" },
    { code: "ECE", name: "Electronics & Communication", icon: "📡" },
    { code: "EE", name: "Electrical Engineering", icon: "⚡" },
    { code: "ME", name: "Mechanical Engineering", icon: "⚙️" },
    { code: "CE", name: "Civil Engineering", icon: "🏗️" },
  ];

  const years = [2026, 2025, 2024, 2023, 2022];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/exams`)
      .then(r => r.json())
      .then(data => {
        const gate = data.find((e: any) => e.name && e.name.toLowerCase().includes("gate"));
        if (gate?.shifts) setDbShifts(gate.shifts);
      })
      .catch(err => console.warn("Failed to load GATE shifts:", err));
  }, []);

  const getGatePapers = () => {
    const defaultPapers = [
      { id: `gate-${selectedBranch.toLowerCase()}-${selectedYear}-s1`, name: `GATE ${selectedYear} ${selectedBranch} - Set 1 (Morning Shift)`, questions: 65, duration: "3 Hours", totalMarks: 100 },
      { id: `gate-${selectedBranch.toLowerCase()}-${selectedYear}-s2`, name: `GATE ${selectedYear} ${selectedBranch} - Set 2 (Afternoon Shift)`, questions: 65, duration: "3 Hours", totalMarks: 100 }
    ];

    if (dbShifts.length > 0) {
      const matched = dbShifts.filter((s: any) => {
        const hasBranch = s.name.toUpperCase().includes(selectedBranch.toUpperCase()) || 
                          (selectedBranch === 'ME' && s.name.toUpperCase().includes('MECHANICAL'));
        const hasYear = s.name.includes(selectedYear.toString());
        return hasBranch && hasYear;
      });
      if (matched.length > 0) {
        return matched.map(s => ({
          id: s.id,
          name: s.name,
          questions: s.questionsCount || 65,
          duration: "3 Hours",
          totalMarks: 100,
          isDb: true
        }));
      }
    }

    return defaultPapers;
  };

  const handleLaunchWorkspace = (paper: any) => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    const shiftId = paper.id || `gate-${selectedBranch}-${selectedYear}`;
    router.push(`/pages/dashboard/gate/workspace?shiftId=${shiftId}&name=${encodeURIComponent(paper.name)}&year=${selectedYear}&branch=${selectedBranch}`);
  };

  const currentPapers = getGatePapers();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col justify-between transition-colors">
      <div>
        <NavBar />
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-b from-teal-900/30 via-slate-900 to-slate-950 border-b border-slate-800 pt-10 pb-8 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Cpu size={14} />
              <span>Graduate Aptitude Test in Engineering</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              GATE Official CBT Examination Portal
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Practice full-length 180-minute GATE CBT mock papers featuring General Aptitude, Engineering Mathematics, MCQs, MSQs, and Numerical Answer Type (NAT) questions.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Branch Selector Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Engineering Discipline / Branch</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {branches.map(b => (
                <button
                  key={b.code}
                  onClick={() => { setSelectedBranch(b.code); setSelectedShift(null); }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col items-center justify-center text-center gap-1 cursor-pointer ${
                    selectedBranch === b.code
                      ? 'bg-teal-600/20 border-teal-500 text-teal-300 font-bold shadow-lg shadow-teal-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-bold">{b.code}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{b.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Year Selector Tabs */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Examination Year</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => { setSelectedYear(y); setSelectedShift(null); }}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 ${
                    selectedYear === y
                      ? 'bg-teal-600 text-white border-teal-500 shadow'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  GATE {y}
                </button>
              ))}
            </div>
          </div>

          {/* Papers Card Selection */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <BookOpen size={16} className="text-teal-400" />
              <span>Available {selectedBranch} {selectedYear} CBT Papers</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPapers.map((paper) => {
                const isSelected = selectedShift?.id === paper.id;

                return (
                  <div
                    key={paper.id}
                    onClick={() => setSelectedShift(paper)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500 shadow-xl'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-extrabold uppercase">
                          {selectedBranch} CBT Paper
                        </span>
                        <input type="radio" checked={isSelected} readOnly className="h-4 w-4 text-teal-500" />
                      </div>
                      
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{paper.name}</h3>
                      <p className="text-xs text-slate-400">
                        {paper.questions} Questions • {paper.duration} • 100 Marks (GA + Engg Maths + Subject)
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Ready for CBT Simulation
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchWorkspace(paper);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                      >
                        <span>Start Test</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="GATE Exam Restricted"
        message="You are currently exploring in Guest Tour mode. Sign in to launch GATE CBT mock tests."
      />
      <Footer />
    </div>
  );
}
