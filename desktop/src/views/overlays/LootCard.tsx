import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Deliverables } from "../../core";

interface LootCardProps {
  deliverables: Deliverables;
  onClose: () => void;
}

export function LootCard({ deliverables, onClose }: LootCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (deliverables.script) {
      navigator.clipboard.writeText(deliverables.script);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#121215] border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h2 className="text-sm font-medium text-zinc-100">
              Analysis Deliverables
            </h2>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              {deliverables.summary || "Complete"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {deliverables.key && (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Extracted Key
              </div>
              <div className="text-xs font-mono text-zinc-200 font-bold break-all">
                {deliverables.key}
              </div>
            </div>
          )}

          {deliverables.flag && (
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Flag
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold break-all">
                {deliverables.flag}
              </div>
            </div>
          )}
        </div>

        {deliverables.script && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Reproduce Script
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-48">
              {deliverables.script}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
