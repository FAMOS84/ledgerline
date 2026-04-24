function DataTable({ columns, rows, emptyLabel }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="px-3 py-4 text-xs text-zinc-400 italic border border-dashed border-zinc-200">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="border border-zinc-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-zinc-950">
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold py-2 px-3"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const rowKey = r.id || r.tier || r.label || `row-${i}-${Object.values(r).join("|")}`;
            return (
              <tr key={rowKey} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                {columns.map((c) => (
                  <td key={c.key} className="py-2 px-3 align-top text-zinc-800">
                    {r[c.key] || <span className="text-zinc-300">—</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function BenefitSection({ meta, data }) {
  const entry = data || { plan_design: [], rates: [], coverages: [], notes: "" };

  return (
    <div className="border border-zinc-200 bg-white fade-in-up" data-testid={`benefit-section-${meta.key}`}>
      <div className={`px-6 py-4 border-b border-zinc-200 flex items-center justify-between ${meta.bg}`}>
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 ${meta.dot}`} />
          <h3 className={`font-heading text-2xl tracking-tight ${meta.text}`}>
            {meta.label}
          </h3>
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono">
          {(entry.plan_design?.length || 0) +
            (entry.rates?.length || 0) +
            (entry.coverages?.length || 0)}{" "}
          rows
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mb-2">
            Plan Design
          </div>
          <DataTable
            columns={[
              { key: "label", label: "Item" },
              { key: "value", label: "Value" },
            ]}
            rows={entry.plan_design}
            emptyLabel="No plan design details extracted."
          />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mb-2">
            Rates
          </div>
          <DataTable
            columns={[
              { key: "tier", label: "Tier" },
              { key: "rate", label: "Rate" },
              { key: "frequency", label: "Frequency" },
              { key: "notes", label: "Notes" },
            ]}
            rows={entry.rates}
            emptyLabel="No rate structure extracted."
          />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mb-2">
            Coverages
          </div>
          <DataTable
            columns={[
              { key: "label", label: "Benefit" },
              { key: "value", label: "Amount" },
            ]}
            rows={entry.coverages}
            emptyLabel="No coverage amounts extracted."
          />
        </div>

        {entry.notes && (
          <div className="pt-4 border-t border-zinc-100">
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono mb-1">
              Notes
            </div>
            <p className="text-sm text-zinc-700 leading-relaxed italic">
              {entry.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
