import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, FileSpreadsheet, FileImage, File as FileIcon } from "lucide-react";

const ACCEPT = ".pdf,.docx,.xlsx,.xlsm,.png,.jpg,.jpeg,.webp,.bmp,.tiff";

function iconFor(name) {
  const n = (name || "").toLowerCase();
  if (n.endsWith(".pdf")) return <FileText className="w-4 h-4" strokeWidth={1.5} />;
  if (n.endsWith(".docx")) return <FileText className="w-4 h-4" strokeWidth={1.5} />;
  if (n.endsWith(".xlsx") || n.endsWith(".xlsm")) return <FileSpreadsheet className="w-4 h-4" strokeWidth={1.5} />;
  if (n.match(/\.(png|jpe?g|webp|bmp|tiff)$/)) return <FileImage className="w-4 h-4" strokeWidth={1.5} />;
  return <FileIcon className="w-4 h-4" strokeWidth={1.5} />;
}

function formatBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function DropZone({ files, setFiles, disabled }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const onDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (!disabled) setDragging(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const addFiles = useCallback(
    (incoming) => {
      const list = Array.from(incoming || []);
      const existingKeys = new Set(files.map((f) => `${f.name}-${f.size}`));
      const fresh = list.filter((f) => !existingKeys.has(`${f.name}-${f.size}`));
      setFiles([...files, ...fresh]);
    },
    [files, setFiles]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      addFiles(e.dataTransfer.files);
    },
    [addFiles, disabled]
  );

  const remove = (idx) => {
    const next = files.slice();
    next.splice(idx, 1);
    setFiles(next);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        data-testid="dropzone"
        className={`relative border border-dashed ${
          dragging ? "bg-zinc-50 border-zinc-900" : "bg-white border-zinc-300"
        } transition-colors duration-200 cursor-pointer select-none`}
      >
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          Submission Tray / 01
        </div>
        <div className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-mono">
          PDF · DOCX · XLSX · IMG
        </div>

        <div className="px-10 py-16 md:py-20 flex flex-col items-center text-center">
          <div className="w-12 h-12 flex items-center justify-center border border-zinc-300 mb-6">
            <Upload className="w-5 h-5 text-zinc-950" strokeWidth={1.5} />
          </div>
          <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-zinc-950 leading-tight mb-3 tracking-tight">
            Drop carrier proposals,
            <br />
            <span className="italic">rate sheets &amp; SBCs</span> here.
          </h3>
          <p className="text-sm text-zinc-600 max-w-md">
            Or{" "}
            <span className="underline underline-offset-4 decoration-zinc-400">
              browse files
            </span>{" "}
            — accepts PDF, DOCX, XLSX, PNG, JPG. Multiple files can be combined
            into one executive overview.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
          data-testid="file-input"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6 border border-zinc-200 bg-white" data-testid="file-list">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
            <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-mono">
              Attached · {files.length}
            </div>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-950 transition-colors"
              data-testid="clear-files-button"
            >
              Clear all
            </button>
          </div>
          <ul>
            {files.map((f, idx) => (
              <li
                key={`${f.name}-${f.size}-${idx}`}
                className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50 transition-colors"
                data-testid={`file-item-${idx}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-zinc-500">{iconFor(f.name)}</div>
                  <div className="min-w-0">
                    <div className="text-sm text-zinc-950 truncate">{f.name}</div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {formatBytes(f.size)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(idx);
                  }}
                  className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  aria-label={`Remove ${f.name}`}
                  data-testid={`remove-file-${idx}`}
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
