import { FileText, Calendar, Building2 } from "lucide-react";

const BENEFIT_META = [
  { key: "dental", label: "Dental", dot: "bg-blue-600" },
  { key: "vision", label: "Vision", dot: "bg-red-600" },
  { key: "basic_life", label: "Basic Life", dot: "bg-emerald-700" },
  { key: "voluntary_life", label: "Vol. Life", dot: "bg-orange-600" },
  { key: "std", label: "STD", dot: "bg-slate-700" },
  { key: "ltd", label: "LTD", dot: "bg-amber-600" },
];

function countRows(b) {
  if (!b) return 0;
  return (b.plan_design?.length || 0) + (b.rates?.length || 0) + (b.coverages?.length || 0);
}

export default function ExecutiveSummary({ analysis }) {
  const benefits = analysis?.benefits || {};
  const linesCovered = BENEFIT_META.filter((m) => countRows(benefits[m.key]) > 0);

  return (
    <div className="border border-zinc-200 bg-white fade-in-up" data-testid="executive-summary">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-200 bg-zinc-50">
        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono">
          Executive Overview
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          {linesCovered.length} / {BENEFIT_META.length} lines
        </div>
      </div>

      <div className="px-5 py-4">
        <h2 className="font-heading text-xl md:text-2xl text-zinc-950 leading-tight tracking-tight mb-2">
          {analysis?.title || "Benefits Overview"}
        </h2>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-zinc-600 mb-3">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-zinc-500">Effective</span>
            <span className="text-zinc-950 font-medium">
              {analysis?.effective_date || "—"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 min-w-0">
            <Building2 className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-zinc-500">Carriers</span>
            <span className="text-zinc-950 font-medium truncate">
              {analysis?.carriers?.length ? analysis.carriers.join(", ") : "—"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-zinc-500">Files</span>
            <span className="text-zinc-950 font-medium">
              {analysis?.source_files?.length || 0}
            </span>
          </span>
        </div>

        <p
          className="text-sm text-zinc-800 leading-relaxed mb-3"
          data-testid="executive-summary-text"
        >
          {analysis?.executive_summary || "No summary generated."}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {BENEFIT_META.map((m) => {
            const n = countRows(benefits[m.key]);
            const present = n > 0;
            return (
              <div
                key={m.key}
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[11px] ${
                  present
                    ? "border-zinc-300 text-zinc-800 bg-white"
                    : "border-zinc-200 text-zinc-400 bg-zinc-50"
                }`}
                data-testid={`summary-chip-${m.key}`}
              >
                <span
                  className={`w-1.5 h-1.5 ${present ? m.dot : "bg-zinc-300"}`}
                />
                {m.label}
                <span className="font-mono opacity-60">
                  {present ? n : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
