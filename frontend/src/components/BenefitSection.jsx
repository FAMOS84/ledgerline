function DataTable({ columns, rows, emptyLabel }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="px-2 py-2 text-[11px] text-zinc-400 italic border border-dashed border-zinc-200">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="border border-zinc-200 overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b-2 border-zinc-950">
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-semibold py-1.5 px-2"
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
                  <td key={c.key} className="py-1.5 px-2 align-top text-zinc-800 leading-snug">
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

function Column({ title, children }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono mb-1.5">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function BenefitSection({ meta, data }) {
  const entry = data || { plan_design: [], rates: [], coverages: [], notes: "" };
  const total =
    (entry.plan_design?.length || 0) +
    (entry.rates?.length || 0) +
    (entry.coverages?.length || 0);

  return (
    <div className="border border-zinc-200 bg-white fade-in-up" data-testid={`benefit-section-${meta.key}`}>
      <div className={`px-4 py-2 border-b border-zinc-200 flex items-center justify-between ${meta.bg}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${meta.dot}`} />
          <h3 className={`font-heading text-lg tracking-tight ${meta.text}`}>
            {meta.label}
          </h3>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
          {total} rows
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Column title="Plan Design">
          <DataTable
            columns={[
              { key: "label", label: "Item" },
              { key: "value", label: "Value" },
            ]}
            rows={entry.plan_design}
            emptyLabel="No plan design extracted."
          />
        </Column>

        <Column title="Rates">
          <DataTable
            columns={[
              { key: "tier", label: "Tier" },
              { key: "rate", label: "Rate" },
              { key: "frequency", label: "Freq." },
            ]}
            rows={entry.rates}
            emptyLabel="No rates extracted."
          />
        </Column>

        <Column title="Coverages">
          <DataTable
            columns={[
              { key: "label", label: "Benefit" },
              { key: "value", label: "Amount" },
            ]}
            rows={entry.coverages}
            emptyLabel="No coverages extracted."
          />
        </Column>
      </div>

      {entry.notes && (
        <div className="px-4 pb-3 text-[11px] text-zinc-600 italic leading-snug border-t border-zinc-100 pt-2">
          <span className="text-zinc-400 not-italic font-mono tracking-[0.15em] mr-2">NOTE</span>
          {entry.notes}
        </div>
      )}
    </div>
  );
}
