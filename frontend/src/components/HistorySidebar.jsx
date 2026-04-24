import { Clock, Trash2 } from "lucide-react";

function relTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "";
  }
}

export default function HistorySidebar({ items, activeId, onSelect, onDelete, loading }) {
  return (
    <aside
      className="border border-zinc-200 bg-white h-fit lg:sticky lg:top-6"
      data-testid="history-sidebar"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-mono">
          <Clock className="w-3 h-3" strokeWidth={1.5} />
          Archive
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          {items.length}
        </div>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-xs text-zinc-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div className="text-xs text-zinc-400 italic">
            No analyses yet.
            <br />
            Drop files to begin.
          </div>
        </div>
      ) : (
        <ul className="max-h-[70vh] overflow-y-auto">
          {items.map((it) => {
            const active = it.id === activeId;
            return (
              <li
                key={it.id}
                className={`border-b border-zinc-100 last:border-b-0 cursor-pointer transition-colors group ${
                  active ? "bg-zinc-50" : "hover:bg-zinc-50"
                }`}
                onClick={() => onSelect(it.id)}
                data-testid={`history-item-${it.id}`}
              >
                <div className="flex items-start justify-between gap-2 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm leading-snug truncate ${
                        active ? "text-zinc-950 font-medium" : "text-zinc-800"
                      }`}
                    >
                      {it.title || "Untitled"}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-mono">
                      <span>{relTime(it.created_at)}</span>
                      <span className="w-0.5 h-0.5 bg-zinc-300" />
                      <span>{it.file_count} file{it.file_count === 1 ? "" : "s"}</span>
                    </div>
                    {it.carriers?.length > 0 && (
                      <div className="mt-1 text-[11px] text-zinc-500 truncate">
                        {it.carriers.join(", ")}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(it.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-950 transition-opacity"
                    aria-label="Delete"
                    data-testid={`delete-analysis-${it.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
