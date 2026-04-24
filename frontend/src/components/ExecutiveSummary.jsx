import { FileText, Calendar, Building2 } from "lucide-react";

const BENEFIT_META = [
  { key: "dental", label: "Dental", accent: "border-blue-200 text-blue-700 bg-blue-50" },
  { key: "vision", label: "Vision", accent: "border-red-200 text-red-700 bg-red-50" },
  { key: "basic_life", label: "Basic Life", accent: "border-emerald-200 text-emerald-800 bg-emerald-50" },
  { key: "voluntary_life", label: "Voluntary Life", accent: "border-orange-200 text-orange-700 bg-orange-50" },
  { key: "std", label: "STD", accent: "border-slate-300 text-slate-700 bg-slate-100" },
  { key: "ltd", label: "LTD", accent: "border-amber-200 text-amber-700 bg-amber-50" },
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
        <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono">
          Executive Overview
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          {linesCovered.length} / {BENEFIT_META.length} lines
        </div>
      </div>

      <div className="px-6 md:px-10 py-8 md:py-10">
        <h2 className="font-heading text-3xl md:text-4xl text-zinc-950 leading-tight tracking-tight mb-6">
          {analysis?.title || "Benefits Overview"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mb-8">
          <div className="bg-white px-5 py-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">
              <Calendar className="w-3 h-3" strokeWidth={1.5} />
              Effective
            </div>
            <div className="text-sm text-zinc-950 font-medium">
              {analysis?.effective_date || "—"}
            </div>
          </div>
          <div className="bg-white px-5 py-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">
              <Building2 className="w-3 h-3" strokeWidth={1.5} />
              Carriers
            </div>
            <div className="text-sm text-zinc-950 font-medium">
              {analysis?.carriers?.length ? analysis.carriers.join(", ") : "—"}
            </div>
          </div>
          <div className="bg-white px-5 py-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-2">
              <FileText className="w-3 h-3" strokeWidth={1.5} />
              Source files
            </div>
            <div className="text-sm text-zinc-950 font-medium">
              {analysis?.source_files?.length || 0} document
              {analysis?.source_files?.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        <p
          className="text-base text-zinc-800 leading-relaxed max-w-3xl mb-8"
          data-testid="executive-summary-text"
        >
          {analysis?.executive_summary || "No summary generated."}
        </p>

        <div className="flex flex-wrap gap-2">
          {BENEFIT_META.map((m) => {
            const n = countRows(benefits[m.key]);
            const present = n > 0;
            return (
              <div
                key={m.key}
                className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs ${
                  present ? m.accent : "border-zinc-200 text-zinc-400 bg-zinc-50"
                }`}
                data-testid={`summary-chip-${m.key}`}
              >
                <span
                  className={`w-1.5 h-1.5 ${
                    present ? "bg-current" : "bg-zinc-300"
                  }`}
                />
                {m.label}
                <span className="font-mono opacity-70">{present ? n : "—"}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
