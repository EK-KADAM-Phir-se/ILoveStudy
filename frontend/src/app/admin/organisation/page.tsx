"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import {
  fetchOrganizations,
  createOrganization,
  createOrgTest,
  validateOrgTestJSON,
  importOrgTestJSON,
  duplicateOrgTest,
  updateOrgTestStatus,
  fetchOrgTests,
  fetchOrgTestResults,
  getExportCSVUrl,
  fetchAdminEmails,
  addAdminEmail,
  removeAdminEmail,
  checkAdminAccess,
  fetchAdminTestRequests,
  deleteOrgTestRequest,
  AdminEmailRecord,
  Organization,
  OrgTest,
  OrgTestRequest,
  OrgTestResultsResponse,
  OrgQuestion,
  JSONValidationResult,
} from "@/src/lib/orgApi";
import {
  Building2, Plus, KeyRound, Download, Share2, Users,
  CheckCircle2, Copy, FileText, Calendar, Clock, Award,
  Sparkles, Search, Filter, AlertCircle, X, ChevronRight,
  BarChart3, HelpCircle, Lock, ShieldAlert, LogOut,
  UserCheck, Trash2, Mail, Upload, Code, Check, XCircle,
  CopyCheck, Layers, PieChart, RefreshCw, ArrowLeft, ArrowRight,
  FileUp, ExternalLink, Inbox
} from "lucide-react";

const SAMPLE_BPSC_JSON = JSON.stringify(
  {
    test: {
      title: "BPSC Full Mock Test - 01",
      description: "Full length BPSC practice examination for Delhi Public School",
      exam_type: "BPSC",
      instructions: [
        "Read all questions carefully.",
        "Do not refresh the page during the examination.",
        "The test will automatically submit when time expires."
      ],
      duration_minutes: 120,
      scheduled_start: "2026-08-25T10:00:00+05:30",
      scheduled_end: "2026-08-25T12:00:00+05:30",
      total_marks: 100,
      passing_marks: 40,
      negative_marking: true,
      negative_marks_per_wrong_answer: 0.25,
      questions: [
        {
          question_id: "q001",
          question_text: "Which of the following is the capital of Bihar?",
          question_type: "single_choice",
          options: [
            { id: "A", text: "Patna" },
            { id: "B", text: "Gaya" },
            { id: "C", text: "Muzaffarpur" },
            { id: "D", text: "Bhagalpur" }
          ],
          correct_answer: ["A"],
          marks: 1,
          negative_marks: 0.25,
          subject: "General Knowledge",
          topic: "Bihar Geography",
          difficulty: "easy",
          explanation: "Patna is the historical capital city of Bihar."
        },
        {
          question_id: "q002",
          question_text: "Who among the following led the 1857 revolt in Bihar?",
          question_type: "single_choice",
          options: [
            { id: "A", text: "Tantia Tope" },
            { id: "B", text: "Kunwar Singh" },
            { id: "C", text: "Nana Saheb" },
            { id: "D", text: "Rani Laxmibai" }
          ],
          correct_answer: ["B"],
          marks: 1,
          negative_marks: 0.25,
          subject: "History",
          topic: "Modern India",
          difficulty: "medium",
          explanation: "Veer Kunwar Singh of Jagdispur led the 1857 revolt in Bihar."
        }
      ]
    }
  },
  null,
  2
);

export default function AdminOrganisationPage() {
  const router = useRouter();

  // Admin Access Lock
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminPinInput, setAdminPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  // State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [tests, setTests] = useState<OrgTest[]>([]);
  const [testRequests, setTestRequests] = useState<OrgTestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrgFilter, setActiveOrgFilter] = useState<string>("All");
  const [adminTab, setAdminTab] = useState<"tests" | "requests">("tests");

  // Admin Whitelist State
  const [showAdminsModal, setShowAdminsModal] = useState<boolean>(false);
  const [adminEmailsList, setAdminEmailsList] = useState<AdminEmailRecord[]>([]);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState<string>("");

  // Modals
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // New Organization Form
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  // Multi-step JSON Test Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [jsonInput, setJsonInput] = useState<string>("");
  const [customCode, setCustomCode] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [initialStatus, setInitialStatus] = useState("ACTIVE");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const [validationResult, setValidationResult] = useState<JSONValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedTestInfo, setPublishedTestInfo] = useState<OrgTest | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null);

  // Selected Test Results Viewer State
  const [selectedTestResults, setSelectedTestResults] = useState<OrgTestResultsResponse | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [resultsTab, setResultsTab] = useState<"leaderboard" | "topics" | "questions">("leaderboard");

  // Check Master PIN / Admin Whitelist Status on Mount
  useEffect(() => {
    const verifyAdmin = async () => {
      setAuthChecking(true);
      const isPinAuth = sessionStorage.getItem("org_admin_auth") === "true";
      if (isPinAuth) {
        setIsAdminAuth(true);
        loadData();
        setAuthChecking(false);
        return;
      }
      try {
        const access = await checkAdminAccess();
        if (access.isAdmin) {
          setIsAdminAuth(true);
          loadData();
        }
      } catch (err) {
        console.error("Admin check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgs, tList, reqList] = await Promise.all([
        fetchOrganizations(),
        fetchOrgTests(),
        fetchAdminTestRequests(),
      ]);
      setOrganizations(orgs);
      setTests(tList);
      setTestRequests(reqList);
      if (orgs.length > 0 && !selectedOrgId) {
        setSelectedOrgId(orgs[0].id);
      }
    } catch (err) {
      console.error("Failed to load admin org data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminPinInput.trim();
    if (cleanPin === "admin@2026" || cleanPin === "ilovestudy@admin" || cleanPin === "admin123" || cleanPin === "2026") {
      sessionStorage.setItem("org_admin_auth", "true");
      setIsAdminAuth(true);
      setPinError("");
      loadData();
    } else {
      setPinError("Invalid Admin Master PIN. Access Denied.");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("org_admin_auth");
    setIsAdminAuth(false);
    setAdminPinInput("");
  };

  const handleOpenAdminsModal = async () => {
    setShowAdminsModal(true);
    try {
      const res = await fetchAdminEmails();
      setAdminEmailsList(res.admins);
    } catch (err) {
      console.error("Failed to fetch admin list:", err);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmailInput.trim()) return;
    try {
      const newAdmin = await addAdminEmail(newAdminEmailInput.trim());
      setAdminEmailsList((prev) => [...prev, newAdmin]);
      setNewAdminEmailInput("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add admin email.");
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove this admin email?")) return;
    try {
      await removeAdminEmail(adminId);
      setAdminEmailsList((prev) => prev.filter((a) => a.id !== adminId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to remove admin email.");
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setIsCreatingOrg(true);
    try {
      const newOrg = await createOrganization({
        name: orgName,
        code: orgCode,
        contactEmail: orgEmail,
        contactPhone: orgPhone,
      });
      setOrganizations((prev) => [newOrg, ...prev]);
      setSelectedOrgId(newOrg.id);
      setShowOrgModal(false);
      setOrgName("");
      setOrgCode("");
      setOrgEmail("");
      setOrgPhone("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create organization.");
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Open JSON Test Wizard
  const handleOpenCreateTestWizard = () => {
    setWizardStep(1);
    setJsonInput("");
    setValidationResult(null);
    setPublishedTestInfo(null);
    setCustomCode("");
    setStartTime("");
    setEndTime("");
    setInitialStatus("ACTIVE");
    setActiveRequestId(null);
    setShowTestModal(true);
  };

  // Fulfill Organiser PDF Request via JSON
  const handleFulfillRequest = (req: OrgTestRequest) => {
    setSelectedOrgId(req.organizationId);
    setActiveRequestId(req.id);
    setWizardStep(2); // Jump to JSON Input step directly!
    setValidationResult(null);
    setPublishedTestInfo(null);
    setCustomCode("");
    if (req.scheduledStart) setStartTime(req.scheduledStart.slice(0, 16));
    if (req.scheduledEnd) setEndTime(req.scheduledEnd.slice(0, 16));
    setInitialStatus("ACTIVE");

    // Pre-populate JSON template with request details
    const prefillJSON = JSON.stringify(
      {
        test: {
          title: req.title,
          description: req.description || `Examination requested by ${req.organization?.name || "Institution"}`,
          exam_type: req.subject || "General",
          instructions: [
            "Read all questions carefully.",
            "The test will automatically submit when time expires."
          ],
          duration_minutes: req.durationMinutes || 60,
          scheduled_start: req.scheduledStart || undefined,
          scheduled_end: req.scheduledEnd || undefined,
          total_marks: 100,
          total_marks_per_question: req.positiveMarks || 4,
          negative_marking: req.negativeMarks !== 0,
          negative_marks_per_wrong_answer: Math.abs(req.negativeMarks || 1),
          questions: [
            {
              question_id: "q001",
              question_text: "Sample Question 1 (Replace with question from attached PDF paper)",
              question_type: "single_choice",
              options: [
                { id: "A", text: "Option A" },
                { id: "B", text: "Option B" },
                { id: "C", text: "Option C" },
                { id: "D", text: "Option D" }
              ],
              correct_answer: ["A"],
              marks: req.positiveMarks || 4,
              negative_marks: Math.abs(req.negativeMarks || 1),
              subject: req.subject || "General",
              explanation: "Explanation here..."
            }
          ]
        }
      },
      null,
      2
    );

    setJsonInput(prefillJSON);
    setShowTestModal(true);
  };

  // JSON File Upload Reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setJsonInput(text);
        setValidationResult(null);
      }
    };
    reader.readAsText(file);
  };

  // Validate JSON Step
  const handleValidateJSON = async () => {
    if (!jsonInput.trim()) {
      alert("Please paste or upload JSON content first.");
      return;
    }
    setIsValidating(true);
    try {
      const result = await validateOrgTestJSON(jsonInput);
      setValidationResult(result);
      if (result.valid) {
        if (result.summary?.scheduledStart) {
          setStartTime(result.summary.scheduledStart.slice(0, 16));
        }
        if (result.summary?.scheduledEnd) {
          setEndTime(result.summary.scheduledEnd.slice(0, 16));
        }
        setWizardStep(3); // Proceed to Validation Result
      } else {
        setWizardStep(3); // Show errors
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "JSON parsing failed.");
    } finally {
      setIsValidating(false);
    }
  };

  // Publish Test Step
  const handlePublishTest = async () => {
    if (!selectedOrgId) {
      alert("Please select an organization.");
      return;
    }
    if (!validationResult || !validationResult.valid) {
      alert("JSON must be validated before publishing.");
      return;
    }
    setIsPublishing(true);
    try {
      const res = await importOrgTestJSON({
        organizationId: selectedOrgId,
        jsonPayload: jsonInput,
        customCode: customCode || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        status: initialStatus,
        requestId: activeRequestId || undefined,
      });
      setPublishedTestInfo(res.test);
      setWizardStep(6); // Step 6: Published Screen
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to publish test.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Duplicate Test
  const handleDuplicateTest = async (testId: string) => {
    setIsDuplicating(testId);
    try {
      const res = await duplicateOrgTest(testId);
      alert(`Test duplicated successfully! New Access Code: ${res.test.accessCode}`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to duplicate test.");
    } finally {
      setIsDuplicating(null);
    }
  };

  // Cancel Test
  const handleCancelTest = async (testId: string) => {
    if (!confirm("Are you sure you want to cancel this examination? Students will no longer be able to enter.")) return;
    try {
      await updateOrgTestStatus(testId, "CANCELLED");
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to cancel test.");
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this test request?")) return;
    try {
      await deleteOrgTestRequest(requestId);
      setTestRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete test request.");
    }
  };

  // View Results & Analytics
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

  const selectedOrg = organizations.find((o) => o.id === selectedOrgId);
  const filteredTests = activeOrgFilter === "All"
    ? tests
    : tests.filter((t) => t.organizationId === activeOrgFilter);

  const pendingRequests = testRequests.filter((r) => r.status === "PENDING_JSON_CONVERSION");

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── LOCK SCREEN IF NOT AUTHENTICATED ──
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock size={30} />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
                <ShieldAlert size={13} />
                <span>Restricted Access</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Admin Portal Authorization
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                This management section is reserved for platform administrators only. Please enter the master access key.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  placeholder="Enter Master Admin PIN"
                  className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700 rounded-2xl text-white text-center font-mono text-sm tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                  autoFocus
                  required
                />
              </div>

              {pinError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
                  <AlertCircle size={14} />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl transition cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>

            <button
              onClick={() => router.push("/pages/dashboard/organisation")}
              className="text-xs text-slate-500 hover:text-slate-400 transition cursor-pointer"
            >
              ← Return to Student Test Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Top Header & Action Buttons ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center gap-1.5">
                <Building2 size={13} />
                <span>Admin Management (Authorized)</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              School & College Test Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Upload complete institutional exams via JSON, fulfill PDF requests from schools, generate unique test codes, and view topic analytics.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-bold transition cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut size={14} />
              <span>Lock</span>
            </button>

            <button
              onClick={handleOpenAdminsModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition cursor-pointer shadow-sm"
              title="Manage Authorized Admin Emails"
            >
              <UserCheck size={14} className="text-purple-400" />
              <span>Manage Admins</span>
            </button>

            <button
              onClick={() => setShowOrgModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Building2 size={14} className="text-blue-400" />
              <span>Add School / College</span>
            </button>

            <button
              onClick={handleOpenCreateTestWizard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Create New Test (JSON)</span>
            </button>
          </div>
        </div>

        {/* ── Overview Statistics Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Institutions</p>
              <p className="text-2xl font-black text-white mt-0.5">{organizations.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <FileText size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Created Tests</p>
              <p className="text-2xl font-black text-white mt-0.5">{tests.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Inbox size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Pending Requests</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5">{pendingRequests.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Total Submissions</p>
              <p className="text-2xl font-black text-white mt-0.5">
                {tests.reduce((acc, t) => acc + (t._count?.attempts || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Admin Mode View Switcher Tabs ── */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setAdminTab("tests")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              adminTab === "tests"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <FileText size={15} />
            <span>Created Institutional Tests ({tests.length})</span>
          </button>

          <button
            onClick={() => setAdminTab("requests")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 relative ${
              adminTab === "requests"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            <Inbox size={15} />
            <span>Pending Test Requests ({testRequests.length})</span>
            {pendingRequests.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
            )}
          </button>
        </div>

        {/* ── TAB 1: Created Institutional Tests ── */}
        {adminTab === "tests" && (
          <div className="space-y-4">
            {/* Organization Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              <button
                onClick={() => setActiveOrgFilter("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                  activeOrgFilter === "All"
                    ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                All Institutions
              </button>
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => setActiveOrgFilter(org.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                    activeOrgFilter === org.id
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {org.name} ({org._count?.tests || 0})
                </button>
              ))}
            </div>

            {/* Tests List Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" />
                  <span>Created Institutional Tests</span>
                </h2>
                <span className="text-xs text-slate-400 font-medium">
                  {filteredTests.length} {filteredTests.length === 1 ? "Test" : "Tests"} Available
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Loading tests...
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <FileText size={36} className="mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">No tests created yet for this institution.</p>
                  <p className="text-xs text-slate-500">Click &quot;Create New Test (JSON)&quot; above to import and publish your exam.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-4">Test Title & Subject</th>
                        <th className="px-5 py-4">Institution</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Test Access Code</th>
                        <th className="px-5 py-4">Duration & Questions</th>
                        <th className="px-5 py-4">Submissions</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {filteredTests.map((test) => {
                        let statusBadge = (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                            ACTIVE
                          </span>
                        );
                        if (test.status === "SCHEDULED") {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase">
                              SCHEDULED
                            </span>
                          );
                        } else if (test.status === "CANCELLED") {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-extrabold uppercase">
                              CANCELLED
                            </span>
                          );
                        } else if (test.status === "ENDED" || test.status === "CLOSED") {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-extrabold uppercase">
                              ENDED
                            </span>
                          );
                        } else if (test.status === "DRAFT") {
                          statusBadge = (
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-extrabold uppercase">
                              DRAFT
                            </span>
                          );
                        }

                        return (
                          <tr key={test.id} className="hover:bg-slate-800/40 transition">
                            <td className="px-5 py-4 font-semibold text-white">
                              <div>{test.title}</div>
                              <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                                {test.subject} • Marking: +{test.positiveMarks}/{test.negativeMarks}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                                {test.organization?.name || "Institution"}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              {statusBadge}
                            </td>

                            <td className="px-5 py-4 font-mono">
                              <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-xs">
                                  {test.accessCode}
                                </span>
                                <button
                                  onClick={() => handleCopyCode(test.accessCode)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                                  title="Copy access code"
                                >
                                  {copiedCode === test.accessCode ? (
                                    <CheckCircle2 size={13} className="text-emerald-400" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-slate-300">
                              <div>{test.durationMinutes} mins</div>
                              <div className="text-[11px] text-slate-400">
                                {test._count?.questions || 0} Questions
                              </div>
                            </td>

                            <td className="px-5 py-4 font-bold text-emerald-400">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                {test._count?.attempts || 0} Students
                              </span>
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDuplicateTest(test.id)}
                                  disabled={isDuplicating === test.id}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                                  title="Duplicate Test"
                                >
                                  <Copy size={13} />
                                </button>

                                {test.status !== "CANCELLED" && (
                                  <button
                                    onClick={() => handleCancelTest(test.id)}
                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                    title="Cancel Test"
                                  >
                                    <XCircle size={13} />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleViewResults(test.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                >
                                  <BarChart3 size={13} />
                                  <span>Results & Analytics</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: Pending Test Requests from Organisations ── */}
        {adminTab === "requests" && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Inbox size={18} className="text-amber-400" />
                    <span>Incoming Test Requests from School/College Organisers</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organisers upload PDF test papers here. Click &quot;Fulfill & Convert via JSON&quot; to launch the JSON wizard and publish the test.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                  {pendingRequests.length} Pending
                </span>
              </div>

              {testRequests.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Inbox size={40} className="mx-auto text-indigo-400/80" />
                  <p className="text-base font-bold text-white">No test requests submitted yet.</p>
                  <p className="text-xs text-slate-300 max-w-md mx-auto font-medium leading-relaxed">School and college organisers can submit test requests with PDF attachments from their portal.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testRequests.map((req) => (
                    <div
                      key={req.id}
                      className={`p-5 rounded-2xl border transition space-y-4 ${
                        req.status === "PENDING_JSON_CONVERSION"
                          ? "bg-slate-950/80 border-amber-500/30"
                          : "bg-slate-950/40 border-slate-800"
                      }`}
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
                            ⏳ PENDING CONVERSION
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                            ✓ CONVERTED & LIVE
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Marking Scheme</span>
                          <p className="font-bold text-slate-200">+{req.positiveMarks} / {req.negativeMarks}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Expected Students</span>
                          <p className="font-bold text-indigo-400">{req.expectedStudents} Students</p>
                        </div>
                        {req.scheduledStart && (
                          <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                            Scheduled: <strong className="text-slate-200">{new Date(req.scheduledStart).toLocaleString("en-IN")}</strong>
                          </div>
                        )}
                      </div>

                      {/* PDF Attachment Download / View Button */}
                      {req.pdfUrl ? (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                          <div className="flex items-center gap-2 truncate">
                            <FileUp size={16} className="text-blue-400 shrink-0" />
                            <span className="font-bold text-blue-300 truncate">
                              {req.pdfFileName || "Question_Paper.pdf"}
                            </span>
                          </div>
                          <a
                            href={req.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <span>Open PDF</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">No PDF file attached to this request.</p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          title="Delete request"
                        >
                          <Trash2 size={14} />
                        </button>

                        {req.status === "PENDING_JSON_CONVERSION" ? (
                          <button
                            onClick={() => handleFulfillRequest(req)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles size={14} />
                            <span>Fulfill & Convert via JSON →</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            <span>Test Published (Code: {req.orgTest?.accessCode || "ASSIGNED"})</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL 1: Create Organization ── */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 size={16} className="text-blue-400" />
                <span>Register School / College</span>
              </h3>
              <button
                onClick={() => setShowOrgModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Delhi Public School R.K. Puram"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Short Code / Slug (Optional)
                </label>
                <input
                  type="text"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DPS-RKP"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="principal@school.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOrgModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingOrg}
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCreatingOrg ? "Creating..." : "Save Institution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Multi-Step JSON Test Creation Wizard ── */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-6 my-8">
            {/* Header & Stepper */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-indigo-400" />
                  <span>Create Institutional Test via JSON</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Import BPSC, NEET, JEE, or custom examination JSON directly.
                </p>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="grid grid-cols-6 gap-2">
              {[
                { step: 1, label: "1. Select Org" },
                { step: 2, label: "2. Input JSON" },
                { step: 3, label: "3. Validate" },
                { step: 4, label: "4. Preview" },
                { step: 5, label: "5. Schedule" },
                { step: 6, label: "6. Published" },
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => {
                    if (s.step < wizardStep) setWizardStep(s.step);
                  }}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition ${
                    wizardStep === s.step
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
                      : wizardStep > s.step
                      ? "bg-slate-800 text-slate-300 border-slate-700 cursor-pointer hover:bg-slate-750"
                      : "bg-slate-950/50 text-slate-600 border-slate-900 pointer-events-none"
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* ── STEP 1: Select Organisation ── */}
            {wizardStep === 1 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                  <span className="font-bold">Step 1: Select Target Institution</span>
                  <p className="mt-1 text-slate-400">
                    Every institutional test must belong to one specific school or college. Select the organization below.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Select Organisation / Institution *
                  </label>
                  {organizations.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                      <p className="text-xs text-rose-400">No organizations found.</p>
                      <button
                        type="button"
                        onClick={() => { setShowTestModal(false); setShowOrgModal(true); }}
                        className="text-xs font-bold text-blue-400 underline"
                      >
                        + Add a School / College First
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} (Code: {org.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedOrg && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400">Selected Institution:</p>
                    <p className="text-base font-bold text-white">{selectedOrg.name}</p>
                    <p className="text-xs font-mono text-indigo-400">Org Code: {selectedOrg.code} | ID: {selectedOrg.id}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedOrgId) { alert("Please select an organization."); return; }
                      setWizardStep(2);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    <span>Continue to Input JSON</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Input JSON (Paste or Upload) ── */}
            {wizardStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Code size={16} className="text-blue-400" />
                      <span>Paste or Upload Examination JSON</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload a `.json` file or paste JSON code. Supports BPSC, NEET, JEE, SSC, and school exam schemas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setJsonInput(SAMPLE_BPSC_JSON)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    Load Sample BPSC JSON
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer">
                    <Upload size={14} className="text-blue-400" />
                    <span>Upload .json File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-500">or paste JSON below</span>
                </div>

                <textarea
                  rows={12}
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    setValidationResult(null);
                  }}
                  placeholder="Paste complete test JSON object here..."
                  className="w-full p-4 bg-slate-950 font-mono text-xs text-slate-200 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleValidateJSON}
                    disabled={isValidating || !jsonInput.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {isValidating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Validating JSON...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        <span>Validate JSON & Proceed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: JSON Validation Results ── */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                {validationResult?.valid ? (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span>JSON Validation Passed Successfully!</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      All required fields, question IDs, option keys, and answer configurations are valid.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-400 uppercase">Test Title</span>
                        <p className="text-xs font-bold text-white truncate">{validationResult.summary?.title}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-400 uppercase">Questions</span>
                        <p className="text-xs font-bold text-white">{validationResult.summary?.totalQuestions} Questions</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                        <p className="text-xs font-bold text-white">{validationResult.summary?.durationMinutes} Minutes</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20">
                        <span className="text-[10px] text-slate-400 uppercase">Total Marks</span>
                        <p className="text-xs font-bold text-white">{validationResult.summary?.totalMarks} Marks</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <XCircle size={18} className="text-rose-400" />
                      <span>JSON Validation Failed ({validationResult?.errors.length || 1} Errors)</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Please fix the following validation errors in your JSON content:
                    </p>
                    <ul className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {validationResult?.errors.map((err, idx) => (
                        <li key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-start gap-2">
                          <span className="font-bold text-rose-400 select-none">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Edit JSON</span>
                  </button>

                  {validationResult?.valid && (
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
                    >
                      <span>Continue to Test Preview</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 4: Full Test Preview ── */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                        {validationResult?.summary?.examType || "General"}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {validationResult?.summary?.title}
                      </h3>
                      {validationResult?.summary?.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{validationResult.summary.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Target Institution</p>
                      <p className="text-sm font-bold text-white">{selectedOrg?.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Duration</span>
                      <p className="text-xs font-bold text-slate-200">{validationResult?.summary?.durationMinutes} mins</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Total Questions</span>
                      <p className="text-xs font-bold text-slate-200">{validationResult?.summary?.totalQuestions}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Total Marks</span>
                      <p className="text-xs font-bold text-slate-200">{validationResult?.summary?.totalMarks} Marks</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Negative Marking</span>
                      <p className="text-xs font-bold text-rose-400">
                        {validationResult?.summary?.negativeMarking ? `Yes (${validationResult.summary.negativeMarks})` : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Questions Preview List */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Questions Preview</h4>
                  {(validationResult?.parsedTest?.questions || []).map((q: any, idx: number) => {
                    let opts = [];
                    if (Array.isArray(q.options)) {
                      opts = q.options.map((o: any, oIdx: number) => ({
                        id: (o.id || String.fromCharCode(65 + oIdx)).toUpperCase(),
                        text: o.text || o.value || String(o)
                      }));
                    } else {
                      if (q.optionA) opts.push({ id: "A", text: q.optionA });
                      if (q.optionB) opts.push({ id: "B", text: q.optionB });
                      if (q.optionC) opts.push({ id: "C", text: q.optionC });
                      if (q.optionD) opts.push({ id: "D", text: q.optionD });
                    }
                    const correctKey = Array.isArray(q.correct_answer) ? q.correct_answer[0] : (q.correct_answer || q.correctOption || "A");

                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-400">Question {idx + 1} (ID: {q.question_id || q.id || idx + 1})</span>
                          <span className="text-slate-400">{q.subject || q.topic || "General"} • Marks: {q.marks || 1}</span>
                        </div>
                        <p className="text-xs font-medium text-white">{q.question_text || q.questionText}</p>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {opts.map((opt: any) => (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-xl text-xs border ${
                                String(opt.id).toUpperCase() === String(correctKey).toUpperCase()
                                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-bold"
                                  : "bg-slate-900 border-slate-800 text-slate-300"
                              }`}
                            >
                              <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Edit JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardStep(5)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    <span>Continue to Schedule & Settings</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Schedule & Settings ── */}
            {wizardStep === 5 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                  <span className="font-bold">Step 5: Schedule & Code Configuration</span>
                  <p className="mt-1 text-slate-400">
                    Set test access code prefix or schedule start/end dates. If left empty, an access code (e.g. DPS-BPSC-8K42) will be auto-generated.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                      Custom Access Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                      placeholder="Auto-generated e.g. DPS-BPSC-8K42"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs placeholder-slate-600 uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                      Initial Lifecycle Status
                    </label>
                    <select
                      value={initialStatus}
                      onChange={(e) => setInitialStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="ACTIVE">ACTIVE (Open to Students)</option>
                      <option value="SCHEDULED">SCHEDULED (Timed Window)</option>
                      <option value="DRAFT">DRAFT (Admin Only)</option>
                    </select>
                  </div>
                </div>

                {/* Organizer Requested Schedule (Read-Only & Exact) */}
                {(() => {
                  const linkedReq = activeRequestId ? testRequests.find(r => r.id === activeRequestId) : null;
                  return (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Clock size={14} className="text-indigo-400" />
                          <span>Examination Schedule</span>
                        </span>
                        {linkedReq ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            ✓ Inherited from Organizer Request
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                            Derived from JSON
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Scheduled Start Time</span>
                          <p className="font-bold text-white mt-0.5">
                            {linkedReq?.scheduledStart
                              ? new Date(linkedReq.scheduledStart).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                              : validationResult?.summary?.scheduledStart
                              ? new Date(validationResult.summary.scheduledStart).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                              : "Immediate / Open On-Demand"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">Scheduled End / Duration</span>
                          <p className="font-bold text-white mt-0.5">
                            {linkedReq?.scheduledEnd
                              ? new Date(linkedReq.scheduledEnd).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
                              : linkedReq?.durationMinutes
                              ? `${linkedReq.durationMinutes} Minutes Window`
                              : validationResult?.summary?.durationMinutes
                              ? `${validationResult.summary.durationMinutes} Minutes Window`
                              : "Standard Window"}
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        The schedule configured by the school organizer is applied automatically to prevent timezone mismatches.
                      </p>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishTest}
                    disabled={isPublishing}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/30 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing Test...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Publish Test & Generate Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 6: Published Screen ── */}
            {wizardStep === 6 && publishedTestInfo && (
              <div className="py-6 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white">Test Published Successfully!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your institutional test has been published and assigned to {publishedTestInfo.organization?.name || selectedOrg?.name}.
                  </p>
                </div>

                <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Unique Student Access Code</span>
                  <div className="text-3xl font-mono font-black text-indigo-400 tracking-widest py-2 bg-slate-900/90 rounded-2xl border border-slate-800">
                    {publishedTestInfo.accessCode}
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(publishedTestInfo.accessCode)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Copy size={14} />
                      <span>{copiedCode === publishedTestInfo.accessCode ? "Copied Code!" : "Copy Test Code"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTestModal(false);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    Close Wizard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setJsonInput("");
                      setValidationResult(null);
                      setPublishedTestInfo(null);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    + Create Another Test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 3: Student Marks & Topic Analytics Viewer ── */}
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
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading student marks & analytics...
              </div>
            ) : selectedTestResults ? (
              <div className="space-y-6">
                {/* Test Access & Sharing Summary */}
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

                {/* Performance Analytics Grid */}
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

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <button
                    onClick={() => setResultsTab("leaderboard")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "leaderboard" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Student Marks Leaderboard
                  </button>
                  <button
                    onClick={() => setResultsTab("topics")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "topics" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Topic-Level Performance Analytics
                  </button>
                  <button
                    onClick={() => setResultsTab("questions")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      resultsTab === "questions" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Question-Wise Accuracy
                  </button>
                </div>

                {/* Tab 1: Leaderboard */}
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

                {/* Tab 2: Topic-Level Performance */}
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

                {/* Tab 3: Question-Wise Accuracy */}
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

      {/* ── MODAL 4: Manage Authorized Admin Emails ── */}
      {showAdminsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck size={16} className="text-purple-400" />
                <span>Authorized Platform Admins</span>
              </h3>
              <button
                onClick={() => setShowAdminsModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="flex gap-2">
              <input
                type="email"
                value={newAdminEmailInput}
                onChange={(e) => setNewAdminEmailInput(e.target.value)}
                placeholder="admin@school.edu"
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer shrink-0"
              >
                + Add Admin
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {adminEmailsList.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{a.email}</p>
                    <span className="text-[10px] text-purple-400 uppercase font-bold">{a.role}</span>
                  </div>
                  {adminEmailsList.length > 1 && (
                    <button
                      onClick={() => handleDeleteAdmin(a.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
