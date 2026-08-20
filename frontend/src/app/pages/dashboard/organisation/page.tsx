"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import {
  Building2, KeyRound, ArrowRight, ShieldCheck, Clock,
  Award, Sparkles, CheckCircle2, AlertCircle, Users,
  GraduationCap, HelpCircle, Lock, UserCheck, Plus,
  FileUp, Copy, Download, BarChart3, X, FileText, Check,
  ExternalLink, Inbox, ShieldAlert, Eye, Calendar, CalendarDays,
  Timer, AlertTriangle
} from "lucide-react";
import { LatexRenderer } from "@/src/app/components/LatexRenderer";
import {
  verifyStudentAccessCode,
  checkAdminAccess,
  fetchOrganizations,
  createOrgTestRequest,
  fetchOrganiserTestRequests,
  fetchOrgTestResults,
  fetchOrgTestDetails,
  toggleOrganiserTestOpen,
  getExportCSVUrl,
  StudentVerifyResponse,
  Organization,
  OrgTest,
  OrgTestRequest,
  OrgTestResultsResponse
} from "@/src/lib/orgApi";
import { fetchProfile } from "@/src/lib/profileApi";
import { supabase } from "@/src/lib/supabase";
import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";

export default function OrganisationStudentPage() {
  const router = useRouter();

  // Guest restriction modal state
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Mode switcher: "student" vs "organiser"
  const [activeTab, setActiveTab] = useState<"student" | "organiser">("student");

  // Student State
  const [accessCode, setAccessCode] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedTest, setVerifiedTest] = useState<StudentVerifyResponse["test"] | null>(null);
  const [scheduledNotice, setScheduledNotice] = useState<string | null>(null);

  // Admin Check State
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");

  // Organiser State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [organiserRequests, setOrganiserRequests] = useState<OrgTestRequest[]>([]);
  const [loadingOrganiserData, setLoadingOrganiserData] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [togglingTestId, setTogglingTestId] = useState<string | null>(null);

  // New Test Request Form State
  const [reqOrgName, setReqOrgName] = useState("");
  const [reqTitle, setReqTitle] = useState("");
  const [reqDesc, setReqDesc] = useState("");
  const [reqSubject, setReqSubject] = useState("BPSC");
  const [reqDuration, setReqDuration] = useState("120");
  const [reqPosMarks, setReqPosMarks] = useState("4");
  const [reqNegMarks, setReqNegMarks] = useState("1");

  // Start Date & Time with AM/PM
  const [reqStartDate, setReqStartDate] = useState(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [reqStartHour, setReqStartHour] = useState("10");
  const [reqStartMinute, setReqStartMinute] = useState("00");
  const [reqStartAmPm, setReqStartAmPm] = useState<"AM" | "PM">("AM");

  // Optional Closing / End Test Time (Entry Gate Closes)
  const [hasCustomClosingTime, setHasCustomClosingTime] = useState(false);
  const [reqClosingDate, setReqClosingDate] = useState(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });
  const [reqClosingHour, setReqClosingHour] = useState("12");
  const [reqClosingMinute, setReqClosingMinute] = useState("00");
  const [reqClosingAmPm, setReqClosingAmPm] = useState<"AM" | "PM">("PM");

  const [reqStudents, setReqStudents] = useState("50");
  const [pdfDataUri, setPdfDataUri] = useState<string>("");
  const [pdfFileName, setPdfFileName] = useState<string>("");
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  // Helper to get combined Date object
  const getCombinedDateTime = (dateStr: string, hourStr: string, minStr: string, ampm: "AM" | "PM"): Date => {
    let h = parseInt(hourStr, 10) || 12;
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return new Date(`${dateStr}T${pad(h)}:${pad(parseInt(minStr, 10) || 0)}:00`);
  };

  // Toggle Test Open for All / Practice Retakes
  const handleToggleTestOpen = async (testId: string, currentStatus: string, currentEndTime?: string | null) => {
    const isCurrentlyOpen = currentStatus === "ACTIVE" && !currentEndTime;
    const nextOpen = !isCurrentlyOpen;
    setTogglingTestId(testId);
    try {
      await toggleOrganiserTestOpen(testId, nextOpen);
      setOrganiserRequests((prev) =>
        prev.map((req) => {
          if (req.orgTest && req.orgTest.id === testId) {
            return {
              ...req,
              orgTest: {
                ...req.orgTest,
                status: nextOpen ? "ACTIVE" : "ENDED",
                endTime: nextOpen ? null : new Date().toISOString()
              }
            };
          }
          return req;
        })
      );
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update test status.");
    } finally {
      setTogglingTestId(null);
    }
  };

  // Results Viewer State for Organiser
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedTestResults, setSelectedTestResults] = useState<OrgTestResultsResponse | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [resultsTab, setResultsTab] = useState<"leaderboard" | "topics" | "questions">("leaderboard");

  // Questions Preview State for Organiser
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [previewTest, setPreviewTest] = useState<OrgTest | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handlePreviewQuestions = async (testId: string) => {
    setShowQuestionsModal(true);
    setLoadingQuestions(true);
    try {
      const details = await fetchOrgTestDetails(testId);
      setPreviewTest(details);
    } catch (err) {
      console.error("Failed to load test questions:", err);
      alert("Failed to load question details.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    const verifyUserAdmin = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail") || "";
        const profile = await fetchProfile().catch(() => null);
        const activeEmail = profile?.email || storedEmail;

        if (activeEmail) {
          setCurrentUserEmail(activeEmail);
        }

        const res = await checkAdminAccess(activeEmail).catch(() => ({ isAdmin: false, email: activeEmail }));
        if (res?.isAdmin) {
          setIsAdmin(true);
          sessionStorage.setItem("org_admin_auth", "true");
        }
      } catch (err) {
        console.warn("Admin check warning:", err);
      }
    };

    verifyUserAdmin();
  }, []);

  const loadOrganiserData = async (emailOverride?: string) => {
    setLoadingOrganiserData(true);
    try {
      const email = emailOverride !== undefined ? emailOverride : (currentUserEmail || localStorage.getItem("userEmail") || "");
      const [orgs, reqs] = await Promise.all([
        fetchOrganizations(),
        fetchOrganiserTestRequests(selectedOrgId || undefined, email),
      ]);
      setOrganizations(orgs);
      setOrganiserRequests(reqs);
      if (orgs.length > 0 && !selectedOrgId) {
        setSelectedOrgId(orgs[0].id);
      }
    } catch (err) {
      console.error("Failed to load organiser data:", err);
    } finally {
      setLoadingOrganiserData(false);
    }
  };

  const handleTabSwitch = (tab: "student" | "organiser") => {
    setActiveTab(tab);
    if (tab === "organiser" && (organizations.length === 0 || organiserRequests.length === 0) && !loadingOrganiserData) {
      loadOrganiserData();
    }
  };

  const [pdfFileObj, setPdfFileObj] = useState<File | null>(null);

  // PDF File Upload Handler for Organiser
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileObj(file);
    setPdfFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      if (dataUri) setPdfDataUri(dataUri);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    if (!selectedOrgId) {
      alert("Please select or register an institution.");
      return;
    }
    if (!reqTitle.trim()) {
      alert("Please enter the test title.");
      return;
    }
    setIsSubmittingReq(true);
    try {
      let finalPdfUrl = pdfDataUri;

      // Attempt Dynamic PDF Compression & Supabase Storage Bucket Upload (Lazy loaded pdf-lib)
      if (pdfFileObj) {
        let fileToUpload: Blob = pdfFileObj;
        try {
          const { PDFDocument } = await import("pdf-lib");
          const arrayBuffer = await pdfFileObj.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
          fileToUpload = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
          console.log(`PDF Compressed: ${pdfFileObj.size} B -> ${fileToUpload.size} B`);
        } catch (compErr) {
          console.warn("PDF compression fallback:", compErr);
        }

        try {
          const cleanFileName = `${Date.now()}_${pdfFileObj.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("test-pdfs")
            .upload(cleanFileName, fileToUpload, {
              cacheControl: "3600",
              upsert: true,
              contentType: "application/pdf"
            });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from("test-pdfs")
              .getPublicUrl(uploadData.path);
            if (publicUrlData?.publicUrl) {
              finalPdfUrl = publicUrlData.publicUrl;
            }
          } else {
            console.warn("Supabase bucket upload warning (using fallback DataURI):", uploadError);
          }
        } catch (supErr) {
          console.warn("Supabase storage exception (using fallback DataURI):", supErr);
        }
      }

      let finalScheduledStart: string | undefined = undefined;
      let finalScheduledEnd: string | undefined = undefined;

      if (reqStartDate) {
        const startDt = getCombinedDateTime(reqStartDate, reqStartHour, reqStartMinute, reqStartAmPm);
        const minAllowed = new Date(Date.now() + 12 * 60 * 60 * 1000);
        if (startDt < minAllowed) {
          alert("⚠️ Examination start time must be at least 12 hours in advance to allow our admin team to digitise and verify your question paper.");
          setIsSubmittingReq(false);
          return;
        }
        finalScheduledStart = startDt.toISOString();

        if (hasCustomClosingTime && reqClosingDate) {
          const endDt = getCombinedDateTime(reqClosingDate, reqClosingHour, reqClosingMinute, reqClosingAmPm);
          if (endDt <= startDt) {
            alert("⚠️ Test closing time must be after the scheduled start time.");
            setIsSubmittingReq(false);
            return;
          }
          finalScheduledEnd = endDt.toISOString();
        } else {
          const dur = parseInt(reqDuration, 10) || 60;
          finalScheduledEnd = new Date(startDt.getTime() + dur * 60 * 1000).toISOString();
        }
      }

      if (!reqOrgName.trim()) {
        alert("Please enter your school or college name.");
        setIsSubmittingReq(false);
        return;
      }

      await createOrgTestRequest({
        organizationName: reqOrgName.trim(),
        organizationId: selectedOrgId || undefined,
        title: reqTitle.trim(),
        description: reqDesc.trim(),
        subject: reqSubject.trim(),
        durationMinutes: parseInt(reqDuration, 10) || 60,
        positiveMarks: parseFloat(reqPosMarks) || 4,
        negativeMarks: parseFloat(reqNegMarks) || 1,
        scheduledStart: finalScheduledStart,
        scheduledEnd: finalScheduledEnd,
        expectedStudents: parseInt(reqStudents, 10) || 50,
        pdfUrl: finalPdfUrl || undefined,
        pdfFileName: pdfFileName || undefined,
        requesterEmail: currentUserEmail || localStorage.getItem("userEmail") || undefined,
        requesterName: studentName || undefined,
      });

      alert("Test request submitted successfully! Admin will convert your PDF into an online exam.");
      setShowRequestModal(false);
      setReqOrgName("");
      setReqTitle("");
      setReqDesc("");
      setPdfDataUri("");
      setPdfFileName("");
      loadOrganiserData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to submit test request.");
    } finally {
      setIsSubmittingReq(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    if (!accessCode.trim()) {
      setError("Please enter your examination access code.");
      return;
    }
    setLoading(true);
    setError(null);
    setScheduledNotice(null);
    try {
      const res = await verifyStudentAccessCode(accessCode.trim());
      if (res.valid && res.test) {
        setVerifiedTest(res.test);
      } else if (res.scheduled) {
        setScheduledNotice(res.message || "This examination is scheduled for a future time. Please return at the scheduled time.");
      } else {
        setError(res.error || "Invalid test code or test is currently not available.");
      }
    } catch (err: any) {
      console.error("Code verification failed:", err);
      setError(
        err.response?.data?.error ||
        "Could not find an active test with this code. Please verify with your institution."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    if (!verifiedTest) return;
    if (!studentName.trim()) {
      setError("Please enter your full name before starting the exam.");
      return;
    }

    sessionStorage.setItem("org_student_name", studentName.trim());
    sessionStorage.setItem("org_student_roll", studentRollNumber.trim());
    sessionStorage.setItem("org_student_email", studentEmail.trim());
    sessionStorage.setItem("org_access_code", verifiedTest.accessCode);

    router.push(
      `/pages/dashboard/organisation/workspace?code=${encodeURIComponent(
        verifiedTest.accessCode
      )}`
    );
  };

  const handleViewResults = async (testId: string) => {
    setShowResultsModal(true);
    setLoadingResults(true);
    setResultsTab("leaderboard");
    try {
      const res = await fetchOrgTestResults(testId);
      setSelectedTestResults(res);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to load test results.");
      setShowResultsModal(false);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      <NavBar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col items-center">
        {/* Top Badges & Navigation Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          {/* View Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => handleTabSwitch("student")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "student"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <GraduationCap size={15} />
              <span>Student Exam Entrance</span>
            </button>
            <button
              onClick={() => handleTabSwitch("organiser")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                activeTab === "organiser"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Building2 size={15} />
              <span>School / College Organiser Portal</span>
            </button>
          </div>

          {/* Admin Link (Only for admins) */}
          {isAdmin && (
            <button
              onClick={() => router.push("/admin/organisation")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-600/20 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white border border-purple-200 dark:border-purple-500/40 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <ShieldCheck size={15} className="text-purple-600 dark:text-purple-400" />
              <span>Admin Management Portal</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* ── MODE 1: STUDENT EXAM ENTRANCE ── */}
        {activeTab === "student" && (
          <div className="w-full flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Access Your Institutional Exam
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Enter the unique test code provided by your school, college, or coaching institute to start your examination.
              </p>
            </div>

            {/* Code Entry Card / Verification Flow */}
            <div className="w-full max-w-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {!verifiedTest ? (
                /* STEP 1: Enter Access Code */
                <form onSubmit={handleVerifyCode} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      Examination Access Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <KeyRound size={18} />
                      </div>
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        placeholder="e.g. DPS-MATH-8821"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-base tracking-wider placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 uppercase transition"
                        required
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                      <HelpCircle size={13} />
                      Ask your teacher or institute administrator if you don&apos;t have an access code.
                    </p>
                  </div>

                  {scheduledNotice && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-amber-200">
                        <Clock size={16} className="text-amber-400 shrink-0" />
                        <span>Test Not Started Yet</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{scheduledNotice}</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify Code & Proceed</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: Candidate Details & Exam Preview */
                <div className="space-y-6 relative z-10">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                        <Building2 size={13} />
                        {verifiedTest.organizationName}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Code Verified ✓
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-3">
                      {verifiedTest.title}
                    </h2>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-400 font-semibold">Subject</p>
                        <p className="text-xs font-bold text-slate-200 mt-0.5">{verifiedTest.subject}</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-400 font-semibold">Duration</p>
                        <p className="text-xs font-bold text-amber-400 mt-0.5">{verifiedTest.durationMinutes} Mins</p>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <p className="text-[10px] uppercase text-slate-400 font-semibold">Questions</p>
                        <p className="text-xs font-bold text-blue-400 mt-0.5">{verifiedTest.totalQuestions}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Marking: <strong className="text-emerald-400">+{verifiedTest.positiveMarks}</strong> / <strong className="text-rose-400">{verifiedTest.negativeMarks}</strong> per question</span>
                      <button
                        onClick={() => { setVerifiedTest(null); setError(null); }}
                        className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                      >
                        Change Code
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Student Information
                    </label>

                    <div>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Full Name (e.g. Rahul Sharma) *"
                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={studentRollNumber}
                        onChange={(e) => setStudentRollNumber(e.target.value)}
                        placeholder="Roll No. / Student ID (Optional)"
                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="Email Address (Optional)"
                        className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setVerifiedTest(null)}
                      className="w-1/3 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleStartExam}
                      className="w-2/3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Start Examination</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mt-12">
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Unique Code Access</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Take scheduled exams securely created by your institution using dedicated access keys.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Timed Proctored Exam</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Experience realistic CBT exam timers with LaTeX math formulas and full question palettes.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Instant Marks & Analytics</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Receive comprehensive scorecards, solutions, and reports automatically shared with your school.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODE 2: SCHOOL & COLLEGE ORGANISER PORTAL ── */}
        {activeTab === "organiser" && (
          <div className="w-full space-y-6">
            {/* Organiser Portal Header */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
                  <Building2 size={13} />
                  <span>School & College Organiser Portal</span>
                </span>
                <h1 className="text-2xl font-extrabold text-white">Schedule Tests & Upload Question Papers</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your test PDF paper and schedule dates. Our admin team will convert it into an interactive exam and generate a unique test code.
                </p>
              </div>

              <button
                onClick={() => setShowRequestModal(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>+ Request New Test (Upload PDF)</span>
              </button>
            </div>

            {/* Requested Tests Dashboard Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Inbox size={18} className="text-indigo-400" />
                    <span>My Requested Examinations & Status</span>
                  </h2>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold tracking-wide">
                      👑 Admin View (All Tests)
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {organiserRequests.length} Total Requests
                </span>
              </div>

              {loadingOrganiserData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 animate-pulse space-y-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 w-2/3">
                          <div className="h-4 bg-slate-900 rounded-lg w-1/3" />
                          <div className="h-5 bg-slate-900 rounded-lg w-3/4" />
                          <div className="h-3 bg-slate-900 rounded-lg w-1/2" />
                        </div>
                        <div className="h-6 bg-slate-900 rounded-full w-28" />
                      </div>
                      <div className="h-14 bg-slate-900/60 rounded-xl" />
                      <div className="h-10 bg-slate-900/60 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : organiserRequests.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <FileText size={40} className="mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-200">No test requests submitted by your account yet.</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Test requests and access codes are strictly private to the organizer who created them and platform administrators. Click &quot;+ Request New Test (Upload PDF)&quot; above to submit a question paper.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {organiserRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px]">
                            {req.organization?.name || "Institution"}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5">{req.title}</h3>
                          <p className="text-xs text-slate-400">{req.subject} • Duration: {req.durationMinutes} mins</p>
                        </div>
                        {req.status === "PENDING_JSON_CONVERSION" ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                            ⏳ PROCESSING BY ADMIN
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                            ✓ READY FOR STUDENTS
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Marking Rules</span>
                          <p className="font-bold text-slate-200">+{req.positiveMarks} / -{Math.abs(req.negativeMarks)}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Expected Students</span>
                          <p className="font-bold text-indigo-400">{req.expectedStudents} Students</p>
                        </div>
                        {req.scheduledStart && (
                          <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                            Scheduled: <strong className="text-slate-200">{new Date(req.scheduledStart).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</strong>
                          </div>
                        )}
                      </div>

                      {/* Display Access Code if Ready */}
                      {req.orgTest?.accessCode ? (
                        <>
                          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-bold">Student Test Access Code</span>
                              <p className="text-lg font-mono font-black text-indigo-300 tracking-wider">
                                {req.orgTest.accessCode}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handlePreviewQuestions(req.orgTest!.id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Preview questions and solutions"
                              >
                                <Eye size={13} />
                                <span>View Paper</span>
                              </button>
                              <button
                                onClick={() => handleCopyCode(req.orgTest!.accessCode)}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <Copy size={13} />
                                <span>{copiedCode === req.orgTest.accessCode ? "Copied!" : "Copy Code"}</span>
                              </button>
                              <button
                                onClick={() => handleViewResults(req.orgTest!.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <BarChart3 size={13} />
                                <span>Scorecard</span>
                              </button>
                            </div>
                          </div>

                          {/* Open for All / Retakes Toggle Slider */}
                          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                  ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"
                                  : "bg-slate-600"
                              }`} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-xs">
                                    {req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                      ? "STATUS: OPEN FOR ALL"
                                      : "STATUS: SCHEDULED / CLOSED"}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                    req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : "bg-slate-800 text-slate-400"
                                  }`}>
                                    {req.orgTest.status === "ACTIVE" && !req.orgTest.endTime ? "OPEN" : "CLOSED"}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                    ? "Students can attempt & retake this examination at any time."
                                    : "Slide OPEN to allow students to take and retake this test anytime."}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={togglingTestId === req.orgTest.id}
                              onClick={() => handleToggleTestOpen(req.orgTest!.id, req.orgTest!.status, req.orgTest!.endTime)}
                              className={`relative inline-flex h-6 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                                req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                  ? "bg-emerald-600 shadow-lg shadow-emerald-600/30"
                                  : "bg-slate-800 border border-slate-700"
                              }`}
                              title="Toggle test OPEN for retakes"
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  req.orgTest.status === "ACTIVE" && !req.orgTest.endTime
                                    ? "translate-x-7"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                          <Clock size={16} className="text-amber-400 shrink-0" />
                          <span>Admin is converting your PDF. Unique code will appear here once ready.</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: Organiser Test Request Form (PDF Upload) ── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileUp size={18} className="text-blue-400" />
                <span>Submit Examination Request (Upload PDF)</span>
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  School / College / Institute Name *
                </label>
                <input
                  type="text"
                  value={reqOrgName}
                  onChange={(e) => setReqOrgName(e.target.value)}
                  placeholder="e.g. Indian Institute of Technology Bhagalpur, DPS, Allen Career Institute"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Examination Title *
                </label>
                <input
                  type="text"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g. Annual Physics Olympiad Mock 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Subject / Exam Type
                  </label>
                  <input
                    type="text"
                    value={reqSubject}
                    onChange={(e) => setReqSubject(e.target.value)}
                    placeholder="e.g. BPSC, NEET, Physics"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={reqDuration}
                    onChange={(e) => setReqDuration(e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    + Marks / Correct
                  </label>
                  <input
                    type="number"
                    value={reqPosMarks}
                    onChange={(e) => setReqPosMarks(e.target.value)}
                    placeholder="4"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    - Marks / Wrong
                  </label>
                  <input
                    type="number"
                    value={reqNegMarks}
                    onChange={(e) => setReqNegMarks(e.target.value)}
                    placeholder="1"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Expected Students
                  </label>
                  <input
                    type="number"
                    value={reqStudents}
                    onChange={(e) => setReqStudents(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              {/* ── SCHEDULE & TIMING (CALENDAR, CLOCK WITH AM/PM, OPTIONAL CLOSING TIME) ── */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-indigo-400" size={16} />
                    <label className="text-xs font-bold uppercase text-white tracking-wide">
                      Examination Schedule & Timing
                    </label>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Timer size={11} />
                    <span>Min. 12 Hours Notice</span>
                  </span>
                </div>

                {/* 1. Start Date & Start Time (12-Hour Clock with AM/PM) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-blue-400" />
                      <span>Start Date *</span>
                    </label>
                    <input
                      type="date"
                      value={reqStartDate}
                      min={(() => {
                        const d = new Date(Date.now() + 12 * 60 * 60 * 1000);
                        const pad = (n: number) => n.toString().padStart(2, "0");
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                      })()}
                      onChange={(e) => setReqStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      required
                    />
                  </div>

                  {/* Start Time (Hour : Minute : AM/PM) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-indigo-400" />
                      <span>Start Time (IST) *</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {/* Hour */}
                      <select
                        value={reqStartHour}
                        onChange={(e) => setReqStartHour(e.target.value)}
                        className="w-1/3 px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => {
                          const val = (i + 1).toString().padStart(2, "0");
                          return <option key={val} value={val}>{val}</option>;
                        })}
                      </select>

                      <span className="text-slate-500 font-bold">:</span>

                      {/* Minute */}
                      <select
                        value={reqStartMinute}
                        onChange={(e) => setReqStartMinute(e.target.value)}
                        className="w-1/3 px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>

                      {/* AM / PM Toggle */}
                      <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-0.5 w-1/3">
                        <button
                          type="button"
                          onClick={() => setReqStartAmPm("AM")}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                            reqStartAmPm === "AM"
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setReqStartAmPm("PM")}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                            reqStartAmPm === "PM"
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          PM
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Optional Test Closing / End Test Deadline */}
                <div className="pt-2 border-t border-slate-900 space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCustomClosingTime}
                      onChange={(e) => setHasCustomClosingTime(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Set Custom Closing / End Test Time (Optional)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 pl-6">
                    Students cannot enter the examination after this deadline. If unchecked, the test closes automatically based on duration.
                  </p>

                  {hasCustomClosingTime && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 pt-1">
                      {/* Closing Date */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Closing Date
                        </label>
                        <input
                          type="date"
                          value={reqClosingDate}
                          min={reqStartDate}
                          onChange={(e) => setReqClosingDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        />
                      </div>

                      {/* Closing Time */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Closing Time (IST)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <select
                            value={reqClosingHour}
                            onChange={(e) => setReqClosingHour(e.target.value)}
                            className="w-1/3 px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            {Array.from({ length: 12 }, (_, i) => {
                              const val = (i + 1).toString().padStart(2, "0");
                              return <option key={val} value={val}>{val}</option>;
                            })}
                          </select>

                          <span className="text-slate-500 font-bold">:</span>

                          <select
                            value={reqClosingMinute}
                            onChange={(e) => setReqClosingMinute(e.target.value)}
                            className="w-1/3 px-2 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          >
                            {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>

                          <div className="flex rounded-xl bg-slate-900 border border-slate-700 p-0.5 w-1/3">
                            <button
                              type="button"
                              onClick={() => setReqClosingAmPm("AM")}
                              className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                                reqClosingAmPm === "AM"
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              AM
                            </button>
                            <button
                              type="button"
                              onClick={() => setReqClosingAmPm("PM")}
                              className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                                reqClosingAmPm === "PM"
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "text-slate-400 hover:text-white"
                              }`}
                            >
                              PM
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Live Schedule Summary & 12h Advance Verification Feedback */}
                {(() => {
                  if (!reqStartDate) return null;
                  const startDt = getCombinedDateTime(reqStartDate, reqStartHour, reqStartMinute, reqStartAmPm);
                  const isValidDate = !isNaN(startDt.getTime());
                  if (!isValidDate) return null;

                  const minAdvance = new Date(Date.now() + 12 * 60 * 60 * 1000);
                  const is12HoursAhead = startDt >= minAdvance;
                  const durMinutes = parseInt(reqDuration, 10) || 60;
                  const endDt = hasCustomClosingTime && reqClosingDate
                    ? getCombinedDateTime(reqClosingDate, reqClosingHour, reqClosingMinute, reqClosingAmPm)
                    : new Date(startDt.getTime() + durMinutes * 60 * 1000);

                  return (
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        is12HoursAhead
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      }`}>
                        {is12HoursAhead ? (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <p className="font-bold">
                            {is12HoursAhead
                              ? "✓ 12+ Hours Advance Notice Verified"
                              : "⚠️ Must be at least 12 hours from now"}
                          </p>
                          <p className="text-[11px] text-slate-300">
                            {is12HoursAhead
                              ? `Exam Start: ${startDt.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" })}, ${startDt.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} | End / Close: ${endDt.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })} (IST).`
                              : "Please pick a date & time at least 12 hours ahead so admins can verify and digitise your test paper."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* PDF File Upload Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Upload Question Paper PDF (.pdf)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0">
                    <FileUp size={16} className="text-blue-400" />
                    <span>Select PDF File</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400 truncate">
                    {pdfFileName ? pdfFileName : "No PDF selected"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSubmittingReq ? "Submitting..." : "Submit to Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Scorecard & Results Viewer for Organiser ── */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                  {selectedTestResults?.test.organizationName || "Institution"}
                </span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-400" />
                  <span>{selectedTestResults?.test.title || "Examination Results"}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {loadingResults ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading student scorecards...
              </div>
            ) : selectedTestResults ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Test Access Code</p>
                      <p className="text-base font-mono font-bold text-white">
                        {selectedTestResults.test.accessCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedTestResults.test.accessCode)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>{copiedCode === selectedTestResults.test.accessCode ? "Copied!" : "Copy Code"}</span>
                    </button>

                    <a
                      href={getExportCSVUrl(selectedTestResults.test.id)}
                      download
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export Marks CSV</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Submissions</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      {selectedTestResults.analytics.totalSubmissions}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Average Score</p>
                    <p className="text-xl font-black text-indigo-400 mt-0.5">
                      {selectedTestResults.analytics.averageScore}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Highest Score</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">
                      {selectedTestResults.analytics.highestScore}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lowest Score</p>
                    <p className="text-xl font-black text-rose-400 mt-0.5">
                      {selectedTestResults.analytics.lowestScore}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setResultsTab("leaderboard")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "leaderboard" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Student Leaderboard
                  </button>
                  <button
                    onClick={() => setResultsTab("topics")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "topics" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Topic Performance Breakdown
                  </button>
                  <button
                    onClick={() => setResultsTab("questions")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "questions" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Question Accuracy
                  </button>
                </div>

                {resultsTab === "leaderboard" && (
                  <div>
                    {selectedTestResults.results.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        No student submissions recorded for this examination yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto max-h-72 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 sticky top-0">
                            <tr>
                              <th className="px-4 py-3">Rank</th>
                              <th className="px-4 py-3">Student Name</th>
                              <th className="px-4 py-3">Roll / Email</th>
                              <th className="px-4 py-3">Score</th>
                              <th className="px-4 py-3">Percentage</th>
                              <th className="px-4 py-3">Correct / Wrong</th>
                              <th className="px-4 py-3">Proctoring Security</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {selectedTestResults.results.map((r) => (
                              <tr key={r.attemptId} className="hover:bg-slate-800/30">
                                <td className="px-4 py-3 font-bold text-amber-400">#{r.rank}</td>
                                <td className="px-4 py-3 font-semibold text-white">{r.studentName}</td>
                                <td className="px-4 py-3 text-slate-400">{r.studentRollNumber !== "N/A" ? r.studentRollNumber : r.studentEmail}</td>
                                <td className="px-4 py-3 font-mono font-bold text-emerald-400">{r.score} / {r.maxScore}</td>
                                <td className="px-4 py-3 font-bold text-indigo-400">{r.percentage}%</td>
                                <td className="px-4 py-3 text-slate-300">
                                  <span className="text-emerald-400 font-bold">+{r.correctCount}</span> / <span className="text-rose-400 font-bold">-{r.incorrectCount}</span>
                                </td>
                                <td className="px-4 py-3">
                                  {r.terminatedBySecurity || (r.violationsCount && r.violationsCount >= 5) ? (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-extrabold flex items-center gap-1 w-fit" title="Student attempted to exit test / switch windows 5 times. Test auto-terminated.">
                                      <ShieldAlert size={12} />
                                      <span>TERMINATED ({r.violationsCount || 5}/5)</span>
                                    </span>
                                  ) : r.violationsCount && r.violationsCount > 0 ? (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold flex items-center gap-1 w-fit" title="Student attempted to leave exam workspace or switch tabs.">
                                      <AlertCircle size={12} />
                                      <span>{r.violationsCount} Violations</span>
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                      ✓ Clean (0)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {resultsTab === "topics" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Topic Performance Breakdown</h4>
                    {!(selectedTestResults.analytics.topicAnalytics && selectedTestResults.analytics.topicAnalytics.length > 0) ? (
                      <div className="py-8 text-center text-slate-400 text-xs">No topic analytics available.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTestResults.analytics.topicAnalytics.map((t, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-white">{t.topic}</span>
                              <span className="text-indigo-400">{t.accuracyPct}% Accuracy</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, t.accuracyPct))}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-400">{t.totalQuestions} Questions in this topic</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {resultsTab === "questions" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Question-Wise Accuracy</h4>
                    {!(selectedTestResults.analytics.questionAnalytics && selectedTestResults.analytics.questionAnalytics.length > 0) ? (
                      <div className="py-8 text-center text-slate-400 text-xs">No question-wise analytics available.</div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {selectedTestResults.analytics.questionAnalytics.map((q) => (
                          <div key={q.questionId} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                            <div className="flex-1 truncate">
                              <span className="font-bold text-indigo-400 mr-2">Q{q.orderIndex}.</span>
                              <span className="text-slate-200">{q.questionText}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-emerald-400 font-bold">{q.correctPct}% Correct</span>
                              <span className="text-rose-400 font-bold">{q.wrongPct}% Wrong</span>
                              <span className="text-slate-400 font-medium">{q.unattemptedPct}% Unattempted</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── MODAL 3: Organiser Question Preview & Paper Inspection ── */}
      {showQuestionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                  Question Paper Preview
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {previewTest?.title || "Exam Paper Questions"}
                </h3>
                <p className="text-xs text-slate-400">
                  {previewTest?.subject} • {previewTest?.questions?.length || 0} Questions • Code: <strong className="text-indigo-300 font-mono">{previewTest?.accessCode}</strong>
                </p>
              </div>
              <button
                onClick={() => { setShowQuestionsModal(false); setPreviewTest(null); }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {loadingQuestions ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold">Loading questions & paper solutions...</p>
                </div>
              ) : !previewTest || !previewTest.questions || previewTest.questions.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <FileText size={36} className="mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">No questions uploaded yet for this examination.</p>
                </div>
              ) : (
                previewTest.questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3.5 shadow-sm">
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                      <span className="font-extrabold text-indigo-400">Question {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">{q.subject || "General"}</span>
                    </div>

                    <div className="text-sm text-slate-100 font-medium leading-relaxed">
                      <LatexRenderer text={q.questionText} />
                    </div>

                    {q.imageUrl && (
                      <div className="rounded-xl overflow-hidden max-w-sm border border-slate-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={q.imageUrl} alt={`Question ${idx + 1}`} className="w-full h-auto object-contain" />
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      {[
                        { key: "A", text: q.optionA },
                        { key: "B", text: q.optionB },
                        { key: "C", text: q.optionC },
                        { key: "D", text: q.optionD }
                      ].map((opt) => {
                        const isCorrect = q.correctOption?.toUpperCase() === opt.key;
                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                              isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-semibold"
                                : "bg-slate-900/60 border-slate-800 text-slate-300"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold ${
                              isCorrect ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                            }`}>
                              {opt.key}
                            </span>
                            <div className="flex-1">
                              <LatexRenderer text={opt.text} />
                            </div>
                            {isCorrect && <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Explanation:</span>
                        <div className="text-slate-300">
                          <LatexRenderer text={q.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => { setShowQuestionsModal(false); setPreviewTest(null); }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="Organisation Portal Restricted"
        message="You are exploring in Guest Tour mode. To verify test access codes, attempt institution exams, or manage school tests, please sign in or register."
      />
    </div>
  );
}
