import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPin } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight } from "lucide-react";

const PIN_LENGTH = 10;

export default function Login() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthed } = useAuth();

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!pin || pin.length < 4) {
      toast.error("Enter your PIN to continue");
      return;
    }
    setLoading(true);
    try {
      await loginWithPin(pin);
      setAuthed(true);
      toast.success("Authenticated");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid PIN";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex" data-testid="login-page">
      {/* Left — editorial masthead */}
      <div className="hidden lg:flex lg:w-1/2 relative border-r border-zinc-200 bg-zinc-50 grid-paper">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-950 flex items-center justify-center">
              <span className="text-white font-heading text-xl leading-none">B</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                Benefits Intelligence
              </div>
              <div className="font-heading text-lg tracking-tight text-zinc-950">
                Ledger &amp; Line
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6">
              ISSUE No. 01 / EXECUTIVE BRIEFING
            </div>
            <h1 className="font-heading text-5xl xl:text-6xl leading-[1.05] text-zinc-950 mb-8">
              Dental. Vision. Life. Disability.
              <span className="italic"> Summarized.</span>
            </h1>
            <p className="text-sm text-zinc-600 max-w-md leading-relaxed">
              Drop carrier proposals, SBCs and rate sheets. Receive a clean,
              executive-ready breakdown of plan design, rates, and coverages —
              across every line of coverage.
            </p>
          </div>

          <div className="flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            <span>Volume 2026</span>
            <span>Confidential — Internal Use</span>
          </div>
        </div>
      </div>

      {/* Right — PIN form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <form
          onSubmit={submit}
          className="w-full max-w-md border border-zinc-200 bg-white p-10"
          data-testid="login-form"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-8">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
            Secure Access
          </div>

          <h2 className="font-heading text-4xl text-zinc-950 mb-2 tracking-tight">
            Enter PIN
          </h2>
          <p className="text-sm text-zinc-600 mb-10">
            This workspace is locked. Enter your numeric PIN to continue.
          </p>

          <label className="block text-[10px] uppercase tracking-[0.25em] text-zinc-500 mb-3">
            PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            maxLength={PIN_LENGTH + 2}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••••••••"
            className="w-full h-14 px-4 text-xl font-mono tracking-[0.4em] border border-zinc-300 bg-white text-zinc-950 focus:outline-none focus:border-zinc-950 transition-colors"
            data-testid="login-pin-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full h-12 bg-zinc-950 text-white text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-60"
            data-testid="login-submit-button"
          >
            {loading ? (
              <span className="typewriter-cursor">Verifying</span>
            ) : (
              <>
                Unlock Workspace
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </>
            )}
          </button>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            End-to-end encrypted · No data leaves your session
          </div>
        </form>
      </div>
    </div>
  );
}
