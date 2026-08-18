"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Code2, AlignLeft, BookOpen,
  Upload, Sparkles, Brain, Database,
  AlertCircle, CheckCircle2, Download, Edit3, Trash2, Play, X
} from "lucide-react";
import NavBar from "../../../../components/NavBar";

import GuestRestrictionModal from "@/src/components/GuestRestrictionModal";
import { isGuestUser } from "@/src/lib/authUtils";
import { API_BASE_URL } from "@/src/lib/apiConfig";

/* ─────────────────────────── Tool card data ─────────────────────────── */
const TOOLS = [
  {
    id: "pdf",
    category: "upload",
    icon: "/icons/pdf.svg",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50",
    border: "border-red-100",
    title: "Upload PDF",
    description: "Upload any question paper PDF. We extract text and diagrams automatically.",
  },
  {
    id: "json",
    category: "import",
    icon: "/icons/json.svg",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    title: "Import JSON",
    description: "Drop a structured JSON file of questions for instant, offline test creation.",
  },
  {
    id: "text",
    category: "ai",
    icon: "/icons/text.svg",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    title: "Paste & Parse",
    description: "Paste raw question text. Groq Llama 3.1 extracts MCQs and formats LaTeX.",
  },
  {
    id: "jee",
    category: "library",
    icon: "/icons/jee.svg",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    title: "JEE Main Papers",
    description: "Pick from curated JEE Main 2025 question papers already in our library.",
  },
];

const CATEGORIES = ["All", "Upload", "Import", "AI", "Library"];

const TOOL_ICONS: Record<string, React.ReactNode> = {
  pdf: (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md shadow-red-200">
      <FileText size={22} className="text-white" />
    </div>
  ),
  json: (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-200">
      <Code2 size={22} className="text-white" />
    </div>
  ),
  text: (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-200">
      <Brain size={22} className="text-white" />
    </div>
  ),
  jee: (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-200">
      <BookOpen size={22} className="text-white" />
    </div>
  ),
};

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function CreateTestPage() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Form states
  const [testName, setTestName] = useState("");
  const [subject, setSubject] = useState("General");
  const [paperText, setPaperText] = useState("");
  const [fileName, setFileName] = useState("");
  const [pdfImages, setPdfImages] = useState<Array<{ page: number; imgKey: string; base64: string }>>([]);
  const [pdfPages, setPdfPages] = useState<Array<{ pageNum: number; text: string }>>([]);

  // Preview states
  const [previewMode, setPreviewMode] = useState(false);
  const [jsonPreview, setJsonPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isGuest = isGuestUser();
    if (!token && !isGuest) { router.push("/login"); return; }

    if (typeof window !== "undefined" && !(window as any).pdfjsLib) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {};
      document.body.appendChild(script);
    }
  }, [router]);

  /* ── helpers ── */
  const cleanLooseJson = (text: string): string => {
    try { return JSON.stringify(JSON.parse(text), null, 2); } catch (_) {}
    try {
      const cleaned = text
        .replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
        .replace(/'([^'\n]*)'/g, '"$1"');
      return JSON.stringify(JSON.parse(cleaned), null, 2);
    } catch (_) { return text; }
  };

  const resetModal = () => {
    setActiveTool(null);
    setError(""); setSuccess("");
    setPaperText(""); setFileName("");
    setPdfImages([]); setPdfPages([]);
    setPreviewMode(false); setJsonPreview("");
    setLoading(false);
  };

  /* ── file handler ── */
  const handleProcessFile = async (file: File) => {
    setError(""); setSuccess("");
    setFileName(file.name);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "pdf") {
      if (!(window as any).pdfjsLib) { setError("PDF library still loading, wait a moment."); return; }
      setLoading(true); setLoadingStatus("Reading PDF…");
      try {
        const ab = await file.arrayBuffer();
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await lib.getDocument({ data: ab }).promise;
        let fullText = "";
        const imgs: typeof pdfImages = [];
        const pages: typeof pdfPages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          setLoadingStatus(`Extracting page ${i}/${pdf.numPages}…`);
          const pg = await pdf.getPage(i);
          const tc = await pg.getTextContent();
          const pt = tc.items.map((it: any) => it.str).join(" ");
          fullText += `\n--- Page ${i} ---\n` + pt;
          pages.push({ pageNum: i, text: pt });
          try {
            const ops = await pg.getOperatorList();
            for (let j = 0; j < ops.fnArray.length; j++) {
              if (ops.fnArray[j] === lib.OPS.paintImageXObject || ops.fnArray[j] === lib.OPS.paintJpegXObject) {
                const key = ops.argsArray[j][0];
                const obj = await pg.objs.get(key);
                if (obj?.width && obj?.height) {
                  const cv = document.createElement("canvas");
                  cv.width = obj.width; cv.height = obj.height;
                  const ctx = cv.getContext("2d");
                  if (ctx) {
                    const id = ctx.createImageData(obj.width, obj.height);
                    const src = obj.data;
                    if (src.length === obj.width * obj.height * 3) {
                      let x = 0;
                      for (let k = 0; k < src.length; k += 3) { id.data[x]=src[k]; id.data[x+1]=src[k+1]; id.data[x+2]=src[k+2]; id.data[x+3]=255; x+=4; }
                    } else { for (let k=0;k<src.length;k++) id.data[k]=src[k]; }
                    ctx.putImageData(id, 0, 0);
                    imgs.push({ page: i, imgKey: key, base64: cv.toDataURL("image/png") });
                  }
                }
              }
            }
          } catch (_) {}
        }
        setPaperText(fullText); setPdfImages(imgs); setPdfPages(pages);
        setSuccess(`Extracted ${pdf.numPages} pages and ${imgs.length} diagrams.`);
      } catch (e: any) { setError(`PDF parse error: ${e.message}`); }
      finally { setLoading(false); }

    } else if (ext === "json") {
      setLoading(true); setLoadingStatus("Importing JSON…");
      const r = new FileReader();
      r.onload = (ev) => {
        const t = ev.target?.result;
        if (typeof t === "string") {
          const c = cleanLooseJson(t);
          setJsonPreview(c); setPaperText(c);
          setPreviewMode(true);
          setSuccess("JSON imported successfully!");
        } else setError("Could not read file.");
        setLoading(false);
      };
      r.readAsText(file);

    } else {
      setLoading(true);
      const r = new FileReader();
      r.onload = (ev) => {
        const t = ev.target?.result;
        if (typeof t === "string") { setPaperText(t); setSuccess("File loaded!"); }
        else setError("Could not read file.");
        setLoading(false);
      };
      r.readAsText(file);
    }
  };

  /* ── submit (AI parse) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    setError(""); setSuccess("");
    if (!testName.trim()) { setError("Enter a test name."); return; }
    if (!paperText.trim()) { setError("No content to process."); return; }

    const trimmed = paperText.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      setJsonPreview(cleanLooseJson(trimmed));
      setPreviewMode(true);
      setSuccess("JSON parsed — review and launch!");
      return;
    }

    setLoading(true); setLoadingStatus("Connecting to Groq AI…");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/test/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ testName: testName.trim(), subject, paperText: trimmed, pages: pdfPages, images: pdfImages })
      });
      setLoadingStatus("Parsing with Llama 3.1…");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setSuccess("Test ready! Redirecting…");
      setTimeout(() => router.push(`/pages/dashboard/jee-mains/workspace?shiftId=${data.shiftId}&name=${encodeURIComponent(data.name)}&year=${new Date().getFullYear()}`), 1200);
    } catch (e: any) { setError(e.message); setLoading(false); }
  };

  /* ── launch from JSON ── */
  const handleLaunchFromJSON = async () => {
    if (isGuestUser()) {
      setShowGuestModal(true);
      return;
    }
    setError(""); setSuccess("");
    if (!testName.trim()) { setError("Enter a test name."); return; }
    if (!jsonPreview.trim()) { setError("JSON preview is empty."); return; }

    let finalJson = jsonPreview.trim();
    try {
      const parsed = JSON.parse(finalJson);
      const list: any[] = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      list.forEach((q: any) => {
        if (!q.correctOption || !["A","B","C","D"].includes(String(q.correctOption).toUpperCase())) q.correctOption = "A";
      });
      finalJson = JSON.stringify(Array.isArray(parsed) ? list : { ...parsed, questions: list }, null, 2);
      setJsonPreview(finalJson);
    } catch (_) {}

    setLoading(true); setLoadingStatus("Importing JSON and launching…");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/test/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ testName: testName.trim(), subject, paperText: finalJson, images: pdfImages })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed.");
      setSuccess("Launching workspace…");
      setTimeout(() => router.push(`/pages/dashboard/jee-mains/workspace?shiftId=${data.shiftId}&name=${encodeURIComponent(data.name)}&year=${new Date().getFullYear()}`), 1200);
    } catch (e: any) { setError(e.message); setLoading(false); }
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonPreview], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${testName.trim() || "custom_test"}.json`;
    a.click();
  };

  const filteredTools = activeCategory === "All"
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory.toLowerCase());

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">

      {/* ── Top Nav ── */}
      <NavBar />

      {/* ── Hero ── */}
      <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight mb-4">
          Every tool you need to<br />build a custom test
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Upload a PDF, import a JSON paper, or paste raw text. LaTeX math and diagram images are extracted automatically.
        </p>
      </div>

      {/* ── Category Pills ── */}
      <div className="flex justify-center gap-2 flex-wrap px-4 py-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${
              activeCategory === cat
                ? "bg-gray-900 text-white border-gray-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:text-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Tool Cards Grid ── */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setError(""); setSuccess(""); }}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-md rounded-2xl p-5 text-left transition-all duration-200 cursor-pointer group"
          >
            <div className="mb-4">{TOOL_ICONS[tool.id]}</div>
            <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{tool.title}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{tool.description}</p>
          </button>
        ))}
      </div>

      {/* ── Modal Overlay ── */}
      {activeTool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) resetModal(); }}>
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {TOOL_ICONS[activeTool]}
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{TOOLS.find(t => t.id === activeTool)?.title}</h2>
                  <p className="text-gray-400 text-xs">{previewMode ? "Review and edit questions before launching" : TOOLS.find(t => t.id === activeTool)?.description}</p>
                </div>
              </div>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-700 transition cursor-pointer p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Alerts */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" /> {success}
                </div>
              )}

              {/* ── PREVIEW MODE ── */}
              {previewMode ? (
                <div className="space-y-4">
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Test Name</label>
                      <input value={testName} onChange={e => setTestName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition cursor-pointer">
                        <option value="General">General / Mix</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Math">Math</option>
                      </select>
                    </div>
                  </div>

                  {/* JSON Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Edit3 size={12} /> Edit JSON
                      </label>
                      <div className="flex gap-3">
                        <button onClick={handleDownloadJSON} className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer">
                          <Download size={12} /> Export
                        </button>
                        <button onClick={() => { setPreviewMode(false); setJsonPreview(""); }}
                          className="text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1 cursor-pointer">
                          <Trash2 size={12} /> Reset
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={jsonPreview}
                      onChange={e => setJsonPreview(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-indigo-700 font-mono text-xs p-4 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 min-h-[280px] resize-y transition"
                    />
                  </div>

                  {/* Launch Button */}
                  <button onClick={handleLaunchFromJSON} disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
                    <Play size={16} />
                    {loading ? loadingStatus || "Preparing…" : "Create Test & Launch Workspace"}
                  </button>
                </div>

              ) : (
                /* ── INPUT MODE ── */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Test Name & Subject */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Test Name</label>
                      <input
                        placeholder="My Physics Test"
                        value={testName} onChange={e => setTestName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                        required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Subject</label>
                      <select value={subject} onChange={e => setSubject(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition cursor-pointer">
                        <option value="General">General / Mix</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Math">Math</option>
                      </select>
                    </div>
                  </div>

                  {/* Dropzone — shown for pdf, json, text tools */}
                  {(activeTool === "pdf" || activeTool === "json" || activeTool === "text") && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                        {activeTool === "pdf" ? "Upload PDF" : activeTool === "json" ? "Upload JSON File" : "Upload Text File"}
                      </label>
                      <label className="border-2 border-dashed border-gray-200 hover:border-indigo-300 rounded-xl bg-gray-50 hover:bg-indigo-50/30 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group relative block">
                        <input type="file"
                          accept={activeTool === "pdf" ? ".pdf" : activeTool === "json" ? ".json" : ".txt,.md,.csv,.json,.pdf"}
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleProcessFile(f); }}
                          className="absolute inset-0 opacity-0 cursor-pointer" />
                        <Upload size={28} className="text-gray-300 group-hover:text-indigo-400 transition mb-3" />
                        <p className="text-gray-600 text-sm font-semibold mb-1">
                          {fileName || "Click to select or drag & drop"}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {activeTool === "pdf" ? "PDF files up to 50MB" : activeTool === "json" ? "JSON question paper files" : "TXT, MD, CSV, PDF, JSON"}
                        </p>
                      </label>
                    </div>
                  )}

                  {/* Textarea for paste/text tools */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {activeTool === "json" ? "Or Paste JSON" : activeTool === "pdf" ? "Extracted Text Preview" : "Paste Question Text"}
                      </label>
                      {paperText && (
                        <button type="button" onClick={() => { setPaperText(""); setFileName(""); }}
                          className="text-xs text-gray-400 hover:text-gray-700 transition cursor-pointer">Clear</button>
                      )}
                    </div>
                    <textarea
                      placeholder={
                        activeTool === "json"
                          ? `Paste JSON directly:\n[\n  {\n    "questionText": "Find x if...",\n    "optionA": "1",\n    ...\n  }\n]`
                          : activeTool === "pdf"
                          ? "Text extracted from PDF will appear here after upload…"
                          : "Paste your question paper text here. AI will extract MCQs automatically."
                      }
                      value={paperText}
                      onChange={e => setPaperText(e.target.value)}
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 min-h-[140px] resize-y transition font-mono"
                    />
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingStatus || "Processing…"}</>
                    ) : (
                      <>
                        {(paperText.trim().startsWith("{") || paperText.trim().startsWith("["))
                          ? <><Database size={16} /> Load Questions Directly</>
                          : <><Sparkles size={16} /> Parse & Generate Test</>
                        }
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-screen Loading Overlay (AI parse) ── */}
      {loading && activeTool && !previewMode && (
        <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-5" />
          <p className="text-gray-900 font-bold text-lg mb-1">Processing your paper…</p>
          <p className="text-indigo-500 text-sm font-medium animate-pulse">{loadingStatus}</p>
        </div>
      )}

      {/* ── Guest Restriction Modal ── */}
      <GuestRestrictionModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        title="Custom Test Generator Restricted"
        message="You are exploring in Guest Tour mode. To upload PDFs, import JSONs, or generate custom AI test papers, please log in or register."
      />
    </div>
  );
}
