"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneralDashboard() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const student = {
    name: "Raushan Kumar",
    age: 20,
    examPrep: "Mechatronics Engineering & Competitive Exams"
  };

  const exams = [
    { id: 'jee-mains', name: 'JEE Mains', route: '/pages/dashboard/jee-mains?type=mains', category: 'Engineering' },
    { id: 'jee-advanced', name: 'JEE Advanced', route: '/pages/dashboard/jee-advanced', category: 'Engineering' },
    { id: 'ssc-cgl', name: 'SSC CGL', route: '/pages/dashboard/ssc-cgl', category: 'Staff Selection' },
    { id: 'ssc-chsl', name: 'SSC CHSL', route: '/pages/dashboard/ssc-chsl', category: 'Staff Selection' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Top Navbar Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center relative z-50 w-full">
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">ILoveStudy</h1>

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-10 w-10 bg-blue-600 text-white rounded-full font-bold flex items-center justify-center shadow hover:bg-blue-700 transition focus:outline-none"
          >
            {student.name.charAt(0)}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-5 text-left transition transform origin-top-right">
              <div className="border-b border-gray-100 pb-3 mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Logged In As</p>
                <p className="text-lg font-bold text-gray-800">{student.name}</p>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>Age:</strong> {student.age}</p>
                <p><strong>Target:</strong> {student.examPrep}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-center py-2 rounded-lg font-semibold text-sm transition"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Body Content List - Stretched to Full Width */}
      <main className="w-full px-8 py-6 flex-grow">
        <p className="text-gray-500 mb-6 text-sm">Select an active exam stream below to open your workspace.</p>

        <div className="space-y-4 w-full">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => router.push(exam.route)}
              className="w-full bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition"
            >
              <div className="flex items-center space-x-6">
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-3 py-1 rounded min-w-[120px] text-center">
                  {exam.category}
                </span>
                <span className="text-xl font-bold text-gray-800">{exam.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 font-semibold text-base">
                <span>Access Papers</span>
                <span>&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}