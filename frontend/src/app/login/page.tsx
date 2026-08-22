"use client";

import React, { useEffect, useState } from 'react';
import Login from '../components/Login';
import { useRouter } from 'next/navigation';
import { enableGuestMode, isGuestUser } from '@/src/lib/authUtils';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage() {
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

  const handleSkip = () => {
    enableGuestMode();
    router.push('/pages/dashboard');
  };

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header — same as home page */}
      <header className="bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-6 h-16 shrink-0">
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
        <button
          onClick={handleSkip}
          className="text-gray-500 hover:text-gray-800 text-xs font-semibold tracking-wide uppercase transition cursor-pointer border border-gray-300 hover:border-gray-500 px-3 py-1.5 rounded-md"
        >
          Skip →
        </button>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          {/* Logo + Brand */}
          <div className="text-center mb-7 flex flex-col items-center">
            <img src="/logo_card.jpeg" alt="ILoveStudy Logo" className="block dark:hidden w-16 h-16 object-contain mb-3" />
            <img src="/dark_mode_logo.png" alt="ILoveStudy Logo" className="hidden dark:block w-16 h-16 object-contain mb-3" />
            <span className="flex flex-col items-center leading-none">
              <span className="text-4xl font-extrabold tracking-tight leading-none">
                <span style={{ color: '#1a2744' }}>ILove</span><span style={{ color: '#2563EB' }}>Study</span>
              </span>
              <span className="mt-0.5 text-[8px] font-bold tracking-[0.08em] uppercase" style={{ color: '#1a2744', opacity: 0.6, marginLeft: '-10px' }}>
                LEARN&nbsp;&bull;&nbsp;PRACTICE&nbsp;&bull;&nbsp;SUCCEED
              </span>
            </span>
            <p className="text-gray-500 text-sm mt-3 font-medium">
              Access your ultimate exam preparation workspace
            </p>
          </div>
          <Login />
        </div>
      </div>
    </div>
  );
}