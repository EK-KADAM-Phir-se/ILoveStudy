"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/src/components/NavBar";
import {
  fetchOrganizations,
  createOrganization,
  createOrgTest,
  fetchOrgTests,
  fetchOrgTestResults,
  getExportCSVUrl,
  fetchAdminEmails,
  addAdminEmail,
  removeAdminEmail,
  checkAdminAccess,
  AdminEmailRecord,
  Organization,
  OrgTest,
  OrgTestResultsResponse,
  OrgQuestion,
} from "@/src/lib/orgApi";
import { fetchProfile } from "@/src/lib/profileApi";
import {
  Building2, Plus, KeyRound, Download, Share2, Users,
  CheckCircle2, Copy, FileText, Calendar, Clock, Award,
  Sparkles, Search, Filter, AlertCircle, X, ChevronRight,
  Printer, ArrowUpRight, BarChart3, HelpCircle, Lock, ShieldAlert, LogOut,
  UserCheck, Trash2, Mail
} from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [activeOrgFilter, setActiveOrgFilter] = useState<string>("All");

  // Admin Whitelist State
  const [showAdminsModal, setShowAdminsModal] = useState<boolean>(false);
  const [adminEmailsList, setAdminEmailsList] = useState<AdminEmailRecord[]>([]);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState<string>("");
  const [newAdminRoleInput, setNewAdminRoleInput] = useState<string>("ADMIN");
  const [isAddingAdmin, setIsAddingAdmin] = useState<boolean>(false);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string>("");

  // Check saved admin authentication & auto-verify logged-in admin email
  useEffect(() => {
    const verifyAdmin = async () => {
      const isAuthed = sessionStorage.getItem("org_admin_auth") === "true";
      if (isAuthed) {
        setIsAdminAuth(true);
        setAuthChecking(false);
        return;
      }

      try {
        const storedEmail = localStorage.getItem("userEmail") || "";
        const profile = await fetchProfile().catch(() => null);
        const activeEmail = profile?.email || storedEmail;

        if (activeEmail) {
          const res = await checkAdminAccess(activeEmail);
          if (res.isAdmin) {
            sessionStorage.setItem("org_admin_auth", "true");
            setIsAdminAuth(true);
            loadData();
          }
        }
      } catch (err) {
        console.warn("Admin check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminPinInput.trim();
    // Accepted secure admin passcodes
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

  // Modals
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // New Organization Form
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);

  // New Test Form
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [testSubject, setTestSubject] = useState("General");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [positiveMarks, setPositiveMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(-1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questions, setQuestions] = useState<OrgQuestion[]>([
    {
      subject: "General",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "A",
      explanation: "",
      positiveMarks: 4,
      negativeMarks: -1,
    },
  ]);
  const [bulkJson, setBulkJson] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  // Selected Test Results Viewer
  const [selectedTestResults, setSelectedTestResults] = useState<OrgTestResultsResponse | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [orgs, tsts] = await Promise.all([
        fetchOrganizations(),
        fetchOrgTests(activeOrgFilter !== "All" ? activeOrgFilter : undefined),
      ]);
      setOrganizations(orgs);
      setTests(tsts);
      if (orgs.length > 0 && !selectedOrgId) {
        setSelectedOrgId(orgs[0].id);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeOrgFilter]);

  // Handle Organization Creation
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    setIsCreatingOrg(true);
    try {
      const newOrg = await createOrganization({
        name: orgName.trim(),
        code: orgCode.trim() || undefined,
        contactEmail: orgEmail.trim() || undefined,
        contactPhone: orgPhone.trim() || undefined,
        address: orgAddress.trim() || undefined,
      });
      setShowOrgModal(false);
      setOrgName("");
      setOrgCode("");
      setOrgEmail("");
      setOrgPhone("");
      setOrgAddress("");
      loadData();
      setSelectedOrgId(newOrg.id);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create organization.");
    } finally {
      setIsCreatingOrg(false);
    }
  };

  // Handle Question Management in Test Form
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        subject: testSubject || "General",
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
        explanation: "",
        positiveMarks: positiveMarks,
        negativeMarks: negativeMarks,
      },
    ]);
  };

  const handleUpdateQuestion = (index: number, field: keyof OrgQuestion, value: any) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyBulkJson = () => {
    try {
      const parsed = JSON.parse(bulkJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuestions(parsed);
        setIsBulkMode(false);
      } else {
        alert("JSON must be an array of question objects.");
      }
    } catch (e) {
      alert("Invalid JSON format. Please check syntax.");
    }
  };

  // Handle Test Creation
  const handleCreateTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || !testTitle.trim()) {
      alert("Please select an organization and enter a test title.");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    setIsCreatingTest(true);
    try {
      await createOrgTest({
        organizationId: selectedOrgId,
        title: testTitle.trim(),
        customCode: customCode.trim() || undefined,
        subject: testSubject.trim() || "General",
        durationMinutes: Number(durationMinutes) || 60,
        positiveMarks: Number(positiveMarks) || 4,
        negativeMarks: Number(negativeMarks) || -1,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        questions,
      });

      setShowTestModal(false);
      // Reset form
      setTestTitle("");
      setCustomCode("");
      setQuestions([
        {
          subject: "General",
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctOption: "A",
          explanation: "",
          positiveMarks: 4,
          negativeMarks: -1,
        },
      ]);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to create test.");
    } finally {
      setIsCreatingTest(false);
    }
  };

  // Open Results & Marks Viewer
  const handleViewResults = async (testId: string) => {
    setShowResultsModal(true);
    setLoadingResults(true);
    try {
      const data = await fetchOrgTestResults(testId);
      setSelectedTestResults(data);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to load marks.");
      setShowResultsModal(false);
    } finally {
      setLoadingResults(false);
    }
  };

  // Open & Load Admin Emails
  const handleOpenAdminsModal = async () => {
    setShowAdminsModal(true);
    setAdminSuccessMsg("");
    try {
      const res = await fetchAdminEmails();
      setAdminEmailsList(res.admins || []);
    } catch (err) {
      console.error("Failed to load admin emails:", err);
    }
  };

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmailInput.trim()) return;
    setIsAddingAdmin(true);
    setAdminSuccessMsg("");
    try {
      const newAdmin = await addAdminEmail(newAdminEmailInput.trim(), newAdminRoleInput);
      setAdminEmailsList((prev) => [...prev, newAdmin]);
      setNewAdminEmailInput("");
      setAdminSuccessMsg("Admin email added successfully!");
      setTimeout(() => setAdminSuccessMsg(""), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to add admin email.");
    } finally {
      setIsAddingAdmin(false);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
              Upload custom exams for institutions, generate unique test codes, and share student marks.
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
              onClick={() => setShowTestModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Create New Test</span>
            </button>
          </div>
        </div>

        {/* ── Overview Statistics Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* ── Organization Filter Bar ── */}
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

        {/* ── Tests List Table ── */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={16} className="text-blue-400" />
              <span>Created Institutional Tests</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {tests.length} {tests.length === 1 ? "Test" : "Tests"} Available
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading tests...
            </div>
          ) : tests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <FileText size={36} className="mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No tests created yet.</p>
              <p className="text-xs text-slate-500">Click &quot;Create New Test&quot; above to publish your first exam.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Test Title & Subject</th>
                    <th className="px-5 py-4">School / College</th>
                    <th className="px-5 py-4">Unique Access Code</th>
                    <th className="px-5 py-4">Duration & Questions</th>
                    <th className="px-5 py-4">Submissions</th>
                    <th className="px-5 py-4 text-right">Actions & Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {tests.map((test) => (
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

                      <td className="px-5 py-4 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-xs">
                            {test.accessCode}
                          </span>
                          <button
                            onClick={() => handleCopyCode(test.accessCode)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                            title="Copy code"
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
                            onClick={() => handleViewResults(test.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <BarChart3 size={13} />
                            <span>View Marks & Share</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

      {/* ── MODAL 2: Create Test & Upload Questions ── */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-400" />
                  <span>Create Institutional Test</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set exam parameters, generate access code, and upload questions.
                </p>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-4">
              {/* Row 1: Org & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Select School / College *
                  </label>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="e.g. Midterm Physics Assessment 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Access Code & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Custom Unique Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    placeholder="Auto-generated if empty"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Subject / Stream
                  </label>
                  <input
                    type="text"
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    placeholder="e.g. Physics / Mathematics"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    min={5}
                    max={360}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Marking Scheme */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-emerald-400 mb-1">
                    Positive Marks (+ve)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={positiveMarks}
                    onChange={(e) => setPositiveMarks(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-rose-400 mb-1">
                    Negative Marks (-ve)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(parseFloat(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Schedule Start Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Schedule End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-[11px]"
                  />
                </div>
              </div>

              {/* Question Section Header */}
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Questions ({questions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsBulkMode(!isBulkMode)}
                    className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
                  >
                    {isBulkMode ? "Switch to Manual Mode" : "Switch to Bulk JSON Upload"}
                  </button>
                </div>

                {!isBulkMode && (
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Question</span>
                  </button>
                )}
              </div>

              {/* Question Content */}
              {isBulkMode ? (
                <div className="space-y-2">
                  <textarea
                    rows={8}
                    value={bulkJson}
                    onChange={(e) => setBulkJson(e.target.value)}
                    placeholder='[&#10;  {&#10;    "questionText": "What is the unit of electric force?",&#10;    "optionA": "Newton",&#10;    "optionB": "Joule",&#10;    "optionC": "Watt",&#10;    "optionD": "Pascal",&#10;    "correctOption": "A",&#10;    "explanation": "Electric force is measured in Newtons."&#10;  }&#10;]'
                    className="w-full p-3 bg-slate-950 font-mono text-xs text-slate-200 border border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyBulkJson}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                  >
                    Apply Bulk Questions
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {questions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400">
                          Question {qIndex + 1}
                        </span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={q.questionText}
                        onChange={(e) =>
                          handleUpdateQuestion(qIndex, "questionText", e.target.value)
                        }
                        placeholder="Enter Question Statement (supports LaTeX like $$x^2$$) *"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={q.optionA}
                          onChange={(e) => handleUpdateQuestion(qIndex, "optionA", e.target.value)}
                          placeholder="Option A *"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          required
                        />
                        <input
                          type="text"
                          value={q.optionB}
                          onChange={(e) => handleUpdateQuestion(qIndex, "optionB", e.target.value)}
                          placeholder="Option B *"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          required
                        />
                        <input
                          type="text"
                          value={q.optionC}
                          onChange={(e) => handleUpdateQuestion(qIndex, "optionC", e.target.value)}
                          placeholder="Option C *"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          required
                        />
                        <input
                          type="text"
                          value={q.optionD}
                          onChange={(e) => handleUpdateQuestion(qIndex, "optionD", e.target.value)}
                          placeholder="Option D *"
                          className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-emerald-400 mb-1">
                            Correct Option Key *
                          </label>
                          <select
                            value={q.correctOption}
                            onChange={(e) =>
                              handleUpdateQuestion(qIndex, "correctOption", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          >
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                            Explanation / Solution (Optional)
                          </label>
                          <input
                            type="text"
                            value={q.explanation || ""}
                            onChange={(e) =>
                              handleUpdateQuestion(qIndex, "explanation", e.target.value)
                            }
                            placeholder="Detailed explanation"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTest}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCreatingTest ? "Creating..." : "Save & Generate Test Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Student Marks & Results Sharing Viewer ── */}
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
                Loading student marks...
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
                      <span>Export Marks CSV (Excel)</span>
                    </a>
                  </div>
                </div>

                {/* Performance Analytics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Total Submissions</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      {selectedTestResults.analytics.totalSubmissions}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] font-bold uppercase text-blue-400">Average Score</p>
                    <p className="text-xl font-black text-blue-400 mt-0.5">
                      {selectedTestResults.analytics.averageScore}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] font-bold uppercase text-emerald-400">Highest Score</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">
                      {selectedTestResults.analytics.highestScore}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-[10px] font-bold uppercase text-amber-400">Max Possible</p>
                    <p className="text-xl font-black text-amber-400 mt-0.5">
                      {selectedTestResults.test.maxPossibleMarks}
                    </p>
                  </div>
                </div>

                {/* Ranked Students Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Student Marksheet & Rankings
                  </h4>

                  {selectedTestResults.results.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                      No students have submitted this examination yet. Share the code{" "}
                      <strong className="text-blue-400">{selectedTestResults.test.accessCode}</strong> with students to start collecting results.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Student Name</th>
                            <th className="px-4 py-3">Roll Number</th>
                            <th className="px-4 py-3">Score / Total</th>
                            <th className="px-4 py-3">Percentage</th>
                            <th className="px-4 py-3">Correct / Wrong</th>
                            <th className="px-4 py-3">Submitted At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-200">
                          {selectedTestResults.results.map((student) => (
                            <tr key={student.attemptId} className="hover:bg-slate-800/40 transition">
                              <td className="px-4 py-3 font-bold">
                                {student.rank === 1 ? (
                                  <span className="text-amber-400">🥇 1</span>
                                ) : student.rank === 2 ? (
                                  <span className="text-slate-300">🥈 2</span>
                                ) : student.rank === 3 ? (
                                  <span className="text-amber-600">🥉 3</span>
                                ) : (
                                  `#${student.rank}`
                                )}
                              </td>

                              <td className="px-4 py-3 font-semibold text-white">
                                {student.studentName}
                                {student.studentEmail && student.studentEmail !== "N/A" && (
                                  <div className="text-[10px] text-slate-400 font-normal">
                                    {student.studentEmail}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-3 font-mono text-slate-300">
                                {student.studentRollNumber || "—"}
                              </td>

                              <td className="px-4 py-3 font-bold text-white">
                                <span className={student.score >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                  {student.score}
                                </span>
                                <span className="text-slate-500 font-normal"> / {student.maxScore}</span>
                              </td>

                              <td className="px-4 py-3 font-bold text-blue-400">
                                {student.percentage}%
                              </td>

                              <td className="px-4 py-3 text-[11px]">
                                <span className="text-emerald-400 font-semibold">{student.correctCount}C</span>
                                <span className="text-slate-500 mx-1">/</span>
                                <span className="text-rose-400 font-semibold">{student.incorrectCount}W</span>
                              </td>

                              <td className="px-4 py-3 text-slate-400 text-[11px]">
                                {new Date(student.submittedAt).toLocaleDateString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ── MODAL 4: Manage Authorized Admin Emails ── */}
      {showAdminsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <UserCheck size={18} className="text-purple-400" />
                  <span>Manage Authorized Admins</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Only users with these emails will have access to create and edit tests.
                </p>
              </div>
              <button
                onClick={() => setShowAdminsModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Add New Admin Form */}
            <form onSubmit={handleAddAdminSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={13} />
                <span>Grant Admin Access to Email</span>
              </h4>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail size={14} />
                  </div>
                  <input
                    type="email"
                    value={newAdminEmailInput}
                    onChange={(e) => setNewAdminEmailInput(e.target.value)}
                    placeholder="e.g. teacher@school.edu"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>

                <select
                  value={newAdminRoleInput}
                  onChange={(e) => setNewAdminRoleInput(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                  <option value="TEACHER">Teacher</option>
                </select>

                <button
                  type="submit"
                  disabled={isAddingAdmin}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isAddingAdmin ? "Adding..." : "Add Admin"}
                </button>
              </div>

              {adminSuccessMsg && (
                <p className="text-xs font-semibold text-emerald-400 mt-1">
                  ✓ {adminSuccessMsg}
                </p>
              )}
            </form>

            {/* List of Existing Admins */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Current Authorized Admins ({adminEmailsList.length})
              </h4>

              {adminEmailsList.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  No custom admin emails added yet. Add an email above to grant editing permissions.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {adminEmailsList.map((admin) => (
                    <div
                      key={admin.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {admin.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate">{admin.email}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-mono">
                            {admin.role}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Revoke Admin Access"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAdminsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
