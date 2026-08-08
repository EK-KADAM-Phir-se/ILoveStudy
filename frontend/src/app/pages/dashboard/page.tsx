"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  GraduationCap,
  User,
  LogOut,
  ArrowRight,
  BookOpen,
  Brain,
  Users,
  Landmark,
  Sparkles,
} from "lucide-react";

export default function GeneralDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Student");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const storedName = localStorage.getItem("displayName");

    if (storedName) {
      setDisplayName(storedName);
    }

    setLoading(false);
  }, [router]);

  const exams = [
    {
      id: "jee-mains",
      name: "JEE Mains",
      route: "/pages/dashboard/jee-mains?type=mains",
      category: "Engineering",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "jee-advanced",
      name: "JEE Advanced",
      route: "/pages/dashboard/jee-advanced",
      category: "Engineering",
      icon: Brain,
      color: "purple",
    },
    {
      id: "ssc-cgl",
      name: "SSC CGL",
      route: "/pages/dashboard/ssc-cgl",
      category: "Staff Selection",
      icon: Users,
      color: "green",
    },
    {
      id: "ssc-chsl",
      name: "SSC CHSL",
      route: "/pages/dashboard/ssc-chsl",
      category: "Staff Selection",
      icon: Landmark,
      color: "orange",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("backendToken");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userEmail");

    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">

        <div className="w-full px-5 md:px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <GraduationCap
                size={25}
                strokeWidth={2.3}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-blue-600">
                ILoveStudy
              </h1>

              <p className="text-xs md:text-sm text-gray-500">
                Welcome back, {displayName}.
              </p>
            </div>

          </div>


          {/* Header Buttons */}
          <div className="flex items-center gap-2 md:gap-3">

            <button
              onClick={() => router.push("/profile")}
              className="
                h-10 px-4 md:px-5
                flex items-center gap-2
                bg-blue-600
                text-white
                rounded-full
                font-semibold
                text-sm
                shadow-sm
                hover:bg-blue-700
                hover:shadow-md
                transition-all
                duration-200
                focus:outline-none
              "
            >
              <User size={17} />

              <span className="hidden sm:inline">
                Profile
              </span>
            </button>


            <button
              onClick={handleLogout}
              className="
                h-10 px-4 md:px-5
                flex items-center gap-2
                bg-red-50
                text-red-600
                border border-red-200
                rounded-full
                font-semibold
                text-sm
                hover:bg-red-100
                hover:border-red-300
                transition-all
                duration-200
                focus:outline-none
              "
            >
              <LogOut size={17} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}
      <main className="flex-grow w-full px-4 md:px-8 lg:px-10 py-6 md:py-8">


        {/* ================= HERO ================= */}
        <section className="w-full mb-8 rounded-2xl overflow-hidden shadow-sm border border-blue-100 bg-[#f4f7fc]">
          <img
            src="/hero-study.png"
            alt="Start learning"
            className="w-full h-auto object-cover rounded-2xl"
          />
        </section>


        {/* ================= EXAMS ================= */}
        <section className="w-full">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Explore Exams
              </h2>

              <div className="mt-2 w-10 h-1 rounded-full bg-blue-600" />

            </div>

          </div>


          <div className="space-y-4">

            {exams.map((exam) => {

              const ExamIcon = exam.icon;

              const colorClasses: Record<
                string,
                { icon: string; badge: string; button: string }
              > = {
                blue: {
                  icon:
                    "bg-blue-600 text-white shadow-blue-200",
                  badge:
                    "bg-blue-50 text-blue-600 border-blue-100",
                  button:
                    "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
                },

                purple: {
                  icon:
                    "bg-purple-600 text-white shadow-purple-200",
                  badge:
                    "bg-purple-50 text-purple-600 border-purple-100",
                  button:
                    "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
                },

                green: {
                  icon:
                    "bg-emerald-500 text-white shadow-emerald-200",
                  badge:
                    "bg-emerald-50 text-emerald-600 border-emerald-100",
                  button:
                    "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200",
                },

                orange: {
                  icon:
                    "bg-orange-500 text-white shadow-orange-200",
                  badge:
                    "bg-orange-50 text-orange-600 border-orange-100",
                  button:
                    "bg-orange-500 hover:bg-orange-600 shadow-orange-200",
                },
              };

              const colors = colorClasses[exam.color] || colorClasses.blue;

              return (

                <div
                  key={exam.id}
                  onClick={() => router.push(exam.route)}
                  className="
                    group
                    w-full
                    bg-white
                    border border-gray-200
                    rounded-2xl
                    p-4 md:p-5
                    flex
                    items-center
                    justify-between
                    gap-4
                    cursor-pointer
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    hover:border-blue-200
                    transition-all
                    duration-200
                  "
                >

                  {/* Left */}
                  <div className="flex items-center gap-4 md:gap-5 min-w-0">

                    {/* Exam Icon */}
                    <div
                      className={`
                        shrink-0
                        w-12 h-12 md:w-14 md:h-14
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shadow-md
                        ${colors.icon}
                      `}
                    >
                      <ExamIcon
                        size={25}
                        strokeWidth={2}
                      />
                    </div>


                    {/* Exam details */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2 mb-1.5">

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-md
                            border
                            text-[10px]
                            md:text-xs
                            font-bold
                            uppercase
                            tracking-wider
                            ${colors.badge}
                          `}
                        >
                          {exam.category}
                        </span>

                      </div>


                      <h3 className="
                        text-lg
                        md:text-xl
                        font-bold
                        text-slate-900
                        truncate
                      ">
                        {exam.name}
                      </h3>


                      <p className="hidden md:block mt-1 text-sm text-gray-500">
                        Previous year papers and exam preparation
                      </p>

                    </div>

                  </div>


                  {/* Right */}
                  <div className="shrink-0">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(exam.route);
                      }}
                      className={`
                        hidden sm:flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        text-white
                        text-sm
                        font-semibold
                        shadow-md
                        group-hover:shadow-lg
                        transition-all
                        ${colors.button}
                      `}
                    >

                      <span>
                        Access Papers
                      </span>

                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1 transition-transform"
                      />

                    </button>


                    {/* Mobile arrow */}
                    <div className="sm:hidden w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">

                      <ArrowRight size={18} />

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        </section>


        {/* ================= BOTTOM MESSAGE ================= */}
        <div className="
          mt-8
          rounded-2xl
          border border-gray-200
          bg-white
          px-6 py-5
          flex
          items-center
          gap-4
        ">

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <GraduationCap size={21} />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Prepare smarter. Practice consistently.
            </p>

            <p className="text-sm text-gray-500 mt-0.5">
              Choose an exam above to start practicing.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}