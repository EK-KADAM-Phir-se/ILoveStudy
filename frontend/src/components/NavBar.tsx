"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GraduationCap, User, ScanLine } from "lucide-react";

interface NavBarProps {
  displayName?: string;
  streak?: number;
  isStreakActive?: boolean;
  onStreakClick?: () => void;
  darkMode?: boolean;
  onToggleDark?: () => void;
}

export default function NavBar({
  displayName: displayNameProp,
  streak = 1,
  isStreakActive = false,
  onStreakClick,
  darkMode: darkModeProp,
  onToggleDark,
}: NavBarProps) {
  const router   = useRouter();
  const pathname = usePathname();

  // Read name from localStorage when not provided via prop
  const [localName, setLocalName] = useState("Profile");
  useEffect(() => {
    const saved = localStorage.getItem("displayName");
    if (saved) setLocalName(saved);
  }, []);

  const displayName = displayNameProp || localName;

  // Dark mode state & global html toggle
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    let activeDark = false;
    if (saved === "dark") {
      activeDark = true;
    } else if (saved === "light") {
      activeDark = false;
    } else if (darkModeProp !== undefined) {
      activeDark = darkModeProp;
    } else {
      activeDark = document.documentElement.classList.contains("dark");
    }

    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkModeProp]);

  const handleToggleDark = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    if (onToggleDark) onToggleDark();
  };

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href.split("?")[0]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between gap-4">

        {/* ── Logo + Custom Test ── */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => router.push("/pages/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
              <GraduationCap size={19} strokeWidth={2.3} className="text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-blue-600 dark:text-blue-400 hidden sm:block">
              ILoveStudy
            </span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-200 dark:bg-slate-800 hidden sm:block" />

          {/* Custom Test pill — right next to logo */}
          <button
            onClick={() => router.push("/pages/dashboard/create-test")}
            className={`hidden sm:flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full transition cursor-pointer border ${
              isActive("/pages/dashboard/create-test")
                ? "bg-gray-900 text-white border-gray-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
            }`}
          >
            <ScanLine size={13} />
            Custom Test
          </button>

          {/* Organisation Portal Link */}
          <button
            onClick={() => router.push("/pages/dashboard/organisation")}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium tracking-wide uppercase rounded-full transition cursor-pointer border ${
              isActive("/pages/dashboard/organisation")
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
            }`}
          >
            <span>🏢</span> Organisation
          </button>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Streak */}
          {onStreakClick && (
            <button
              onClick={onStreakClick}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-extrabold cursor-pointer transition-all hover:scale-105 ${
                isStreakActive
                  ? "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900 text-orange-600 dark:text-orange-400"
                  : "bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 grayscale opacity-70"
              }`}
            >
              <span className={isStreakActive ? "animate-bounce" : "opacity-60"}>🔥</span>
              <span>{streak}</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={handleToggleDark}
            aria-label="Toggle theme"
            className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-slate-600 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition text-sm cursor-pointer"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Profile pill — matches ilovepdf "Sign up" red pill */}
          <button
            onClick={() => router.push("/profile")}
            className="h-8 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs tracking-wide uppercase shadow-sm transition cursor-pointer"
          >
            <User size={13} />
            <span className="hidden sm:inline">{displayName || "Profile"}</span>
          </button>

          {/* Grid dots — apps menu */}
          <button className="h-8 w-8 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer text-gray-500 dark:text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5"  cy="5"  r="2" />
              <circle cx="12" cy="5"  r="2" />
              <circle cx="19" cy="5"  r="2" />
              <circle cx="5"  cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
              <circle cx="5"  cy="19" r="2" />
              <circle cx="12" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
