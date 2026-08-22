"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isGuestUser } from '@/src/lib/authUtils';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const guestStatus = isGuestUser();

    if (token || guestStatus) {
      router.replace('/pages/dashboard');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/pages/dashboard');
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <header className="bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="ILoveStudy"
            className="block dark:hidden h-12 w-12 object-contain rounded-lg hover:scale-105 transition transform"
          />
          <img
            src="/dark_mode_logo.png"
            alt="ILoveStudy"
            className="hidden dark:block h-12 w-12 object-contain rounded-lg hover:scale-105 transition transform"
          />
          <span className="flex flex-col leading-none">
            <span className="text-3xl font-extrabold tracking-tight leading-none">
              <span style={{ color: '#1a2744' }}>ILove</span><span style={{ color: '#2563EB' }}>Study</span>
            </span>
            <span className="mt-0.5 text-[8px] font-bold tracking-[0.08em] uppercase" style={{ color: '#1a2744', opacity: 0.6, marginLeft: '-10px' }}>
              LEARN&nbsp;&bull;&nbsp;PRACTICE&nbsp;&bull;&nbsp;SUCCEED
            </span>
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-semibold transition shadow-sm">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Body Content */}
      <main className="max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to Your Ultimate Exam Portal
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Prepare, practice, and excel in your exams with real-time analytics, mock environments, and seamless scheduling.
        </p>
        <Link href="/login" className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} ILoveStudy. All rights reserved.
      </footer>
    </div>
  );
}

