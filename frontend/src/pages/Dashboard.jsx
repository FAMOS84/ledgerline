import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  analyzeFiles,
  deleteAnalysis,
  exportUrl,
  getAnalysis,
  listAnalyses,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";
import DropZone from "../components/DropZone";
import ExecutiveSummary from "../components/ExecutiveSummary";
import BenefitSection from "../components/BenefitSection";
import HistorySidebar from "../components/HistorySidebar";
import {
  Download,
  LogOut,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const BENEFIT_ORDER = [
  {
    key: "dental",
    label: "Dental",
    text: "text-blue-700",
    bg: "bg-blue-50",
    dot: "bg-blue-600",
  },
  {
    key: "vision",
    label: "Vision",
    text: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-600",
  },
  {
    key: "basic_life",
    label: "Basic Life",
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    dot: "bg-emerald-700",
  },
  {
    key: "voluntary_life",
    label: "Voluntary Life",
    text: "text-orange-700",
    bg: "bg-orange-50",
    dot: "bg-orange-600",
  },
  {
    key: "std",
    label: "STD",
    text: "text-slate-700",
    bg: "bg-slate-100",
    dot: "bg-slate-700",
  },
  {
    key: "ltd",
    label: "LTD",
    text: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-600",
  },
];

const LOADING_STAGES = [
  "Reading documents…",
  "Identifying carriers…",
  "Extracting plan design…",
  "Parsing rate structures…",
  "Mapping coverages…",
  "Composing executive overview…",
];

export default function Dashboard() {
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dental");

  const refreshHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const list = await listAnalyses();
      setHistory(list);
    } catch (e) {
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  useEffect(() => {
    if (!analyzing) return;
    setStageIndex(0);
    const iv = setInterval(() => {
      setStageIndex((i) => (i + 1) % LOADING_STAGES.length);
    }, 2200);
    return () => clearInterval(iv);
  }, [analyzing]);

  const handleAnalyze = async () => {
    if (!files.length) {
      toast.error("Add at least one file to analyze");
      return;
    }
    setAnalyzing(true);
    try {
      const result = await analyzeFiles(files);
      setAnalysis(result);
      setActiveTab("dental");
      setFiles([]);
      toast.success("Executive overview ready");
      refreshHistory();
      setTimeout(
        () => window.scrollTo({ top: 0, behavior: "smooth" }),
        60
      );
    } catch (e) {
      const msg = e?.response?.data?.detail || "Analysis failed";
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const openAnalysis = async (id) => {
    try {
      const a = await getAnalysis(id);
      setAnalysis(a);
      setActiveTab("dental");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Could not load analysis");
    }
  };

  const removeAnalysis = async (id) => {
    try {
      await deleteAnalysis(id);
      setHistory((h) => h.filter((x) => x.id !== id));
      if (analysis?.id === id) setAnalysis(null);
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportToExcel = () => {
    if (!analysis) return;
    window.open(exportUrl(analysis.id), "_blank");
  };

  const benefits = analysis?.benefits || {};

  const linesCount = useMemo(
    () =>
      BENEFIT_ORDER.reduce((acc, m) => {
        const b = benefits[m.key];
        const n =
          (b?.plan_design?.length || 0) +
          (b?.rates?.length || 0) +
          (b?.coverages?.length || 0);
        return acc + (n > 0 ? 1 : 0);
      }, 0),
    [benefits]
  );

  return (
    <div className="min-h-screen bg-white" data-testid="dashboard-page">
      {/* Masthead */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-zinc-950 flex items-center justify-center">
              <span className="text-white font-heading text-lg leading-none">B</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                Benefits Intelligence
              </div>
              <div className="font-heading text-base tracking-tight text-zinc-950">
                Ledger &amp; Line
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono">
              Dental · Vision · Life · Disability
            </div>
            <button
              onClick={logout}
              className="text-xs uppercase tracking-wider text-zinc-600 hover:text-zinc-950 flex items-center gap-1.5 transition-colors"
              data-testid="logout-button"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <section className="min-w-0 space-y-10">
          {/* Hero lead */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono mb-4">
              / Drop zone
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-zinc-950 leading-[1.05] tracking-tight mb-3">
              An executive overview,
              <br />
              <span className="italic">from any stack of documents.</span>
            </h1>
            <p className="text-sm text-zinc-600 max-w-2xl">
              Drop proposals, SBCs, rate sheets, or screenshots. Claude Sonnet 4.5
              extracts plan design, rates, and coverages across six lines of
              coverage.
            </p>
          </div>

          {/* Dropzone + Actions */}
          <div>
            <DropZone files={files} setFiles={setFiles} disabled={analyzing} />

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={analyzing || files.length === 0}
                className="h-12 px-6 bg-zinc-950 text-white text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="analyze-button"
              >
                {analyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-pulse" strokeWidth={1.5} />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" strokeWidth={1.5} />
                    Generate executive overview
                  </>
                )}
              </button>
              {files.length > 0 && !analyzing && (
                <button
                  onClick={() => setFiles([])}
                  className="h-12 px-5 border border-zinc-200 text-sm text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                  data-testid="reset-files-button"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                  Reset
                </button>
              )}
            </div>

            {analyzing && (
              <div className="mt-6 border border-zinc-200 bg-zinc-50" data-testid="analyzing-indicator">
                <div className="relative h-1 bg-zinc-200 overflow-hidden progress-indeterminate" />
                <div className="px-5 py-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-700">
                  <span className="typewriter-cursor">
                    {LOADING_STAGES[stageIndex]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Output */}
          {analysis && (
            <div className="space-y-6" data-testid="analysis-output">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono">
                  / Result · {linesCount} of {BENEFIT_ORDER.length} lines extracted
                </div>
                <button
                  onClick={exportToExcel}
                  className="h-10 px-4 border border-zinc-300 text-sm text-zinc-950 hover:bg-zinc-50 flex items-center justify-center gap-2 transition-colors"
                  data-testid="export-excel-button"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  Export to Excel
                </button>
              </div>

              <ExecutiveSummary analysis={analysis} />

              {/* Benefit tabs (custom, matches aesthetic) */}
              <div className="border border-zinc-200 bg-white">
                <div
                  className="flex overflow-x-auto border-b border-zinc-200"
                  data-testid="benefit-tabs"
                  role="tablist"
                >
                  {BENEFIT_ORDER.map((m) => {
                    const b = benefits[m.key];
                    const n =
                      (b?.plan_design?.length || 0) +
                      (b?.rates?.length || 0) +
                      (b?.coverages?.length || 0);
                    const active = activeTab === m.key;
                    return (
                      <button
                        key={m.key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTab(m.key)}
                        className={`relative flex-1 min-w-[110px] px-3 py-2.5 text-xs transition-colors ${
                          active
                            ? "text-zinc-950 font-medium"
                            : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                        }`}
                        data-testid={`tab-${m.key}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-1.5 h-1.5 ${m.dot}`} />
                          <span className="whitespace-nowrap">{m.label}</span>
                          <span
                            className={`text-[10px] font-mono ${
                              active ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {n}
                          </span>
                        </div>
                        {active && (
                          <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-zinc-950" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="p-4">
                  {BENEFIT_ORDER.filter((m) => m.key === activeTab).map((m) => (
                    <BenefitSection
                      key={m.key}
                      meta={m}
                      data={benefits[m.key]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {!analysis && !analyzing && (
            <div
              className="border border-dashed border-zinc-200 px-6 py-10 text-center"
              data-testid="empty-state"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono mb-2">
                / Awaiting submission
              </div>
              <p className="text-sm text-zinc-500 max-w-lg mx-auto">
                Your executive overview will appear here — with per-line tables
                for plan design, rates, and coverages.
              </p>
            </div>
          )}
        </section>

        {/* History */}
        <HistorySidebar
          items={history}
          activeId={analysis?.id}
          onSelect={openAnalysis}
          onDelete={removeAnalysis}
          loading={historyLoading}
        />
      </main>

      <footer className="border-t border-zinc-200 mt-10 py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          <span>© 2026 · Ledger &amp; Line</span>
          <span>Powered by Claude Sonnet 4.5</span>
        </div>
      </footer>
    </div>
  );
}
