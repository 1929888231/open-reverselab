import { useState } from "react";
import { X, Check, Key, Sliders, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { llmService } from "../../services";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(llmService.getApiKey());
  const [model, setModel] = useState(llmService.getModel());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs?: number; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    llmService.setApiKey(apiKey);
    llmService.setModel(model);
    const res = await llmService.checkHealth();
    setTesting(false);
    setTestResult(res);
  };

  const handleSave = () => {
    llmService.setApiKey(apiKey);
    llmService.setModel(model);
    onSaved?.();
    onClose();
  };

  const modelOptions = [
    { id: "qwen3.8-flash", name: "Qwen3.8 Flash (推荐 · 最优性价比 ¥0.40/M · 1M 上下文)" },
    { id: "qwen3.8-27b", name: "Qwen3.8 27B (百炼 · ¥1.50/M · 1M 上下文)" },
    { id: "qwen3.8-max", name: "Qwen3.8 Max (百炼 · 五折 ¥6.00/M · 1M 上下文)" },
    { id: "deepseek-v4-flash-0731", name: "DeepSeek V4 Flash (无问芯穹 · ¥1.50/M)" },
    { id: "glm-5.3-flash", name: "GLM-5.3 Flash (无问芯穹 · ¥0.80/M)" },
    { id: "mimo-v2.6-flash", name: "MiMo V2.6 Flash (金山云 · ¥1.00/M)" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 select-none font-sans text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-semibold tracking-wide">Harness 运行时设置</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          {/* LLM Model */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase text-zinc-400">大模型路由 (LLM Model)</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs focus:outline-none focus:border-zinc-600 transition"
            >
              {modelOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                <Key className="w-3 h-3 text-zinc-500" />
                <span>TokenRhythm API Key</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">本地存储 / 已脱敏</span>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_tr_..."
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs focus:outline-none focus:border-zinc-600 transition"
            />
          </div>

          {/* Test Status */}
          {testResult && (
            <div
              className={`p-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                testResult.ok
                  ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                  : "bg-rose-950/40 border-rose-800/60 text-rose-400"
              }`}
            >
              {testResult.ok ? (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>网关连接正常 · 往返延迟 {testResult.latencyMs}ms</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="truncate">{testResult.error || "连接测试失败"}</span>
                </>
              )}
            </div>
          )}

          {/* Repository Scope Info */}
          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-900 space-y-1 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-600">Workspace:</span>
              <span className="text-zinc-300">open-reverseLab</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Base Gateway:</span>
              <span className="text-zinc-300">https://tokenrhythm.studio/v1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600">Desensitization:</span>
              <span className="text-emerald-400">Strict (No Leaks)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition cursor-pointer disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>测试连通性</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存配置</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
