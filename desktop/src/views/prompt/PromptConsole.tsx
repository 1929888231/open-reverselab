import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Terminal, ArrowUp, Square, Paperclip } from "lucide-react";
import { HarnessMode } from "../../core";

interface PromptConsoleProps {
  isRunning: boolean;
  onExecute: (target: string, prompt: string, mode: HarnessMode) => void;
  onStop?: () => void;
  defaultTarget?: string;
}

export function PromptConsole({
  isRunning,
  onExecute,
  onStop,
  defaultTarget = "samples/challenge_auth.exe",
}: PromptConsoleProps) {
  const [mode, setMode] = useState<HarnessMode>("wish");
  const [target, setTarget] = useState(defaultTarget);
  const [prompt, setPrompt] = useState("");
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (defaultTarget) setTarget(defaultTarget);
  }, [defaultTarget]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onExecute(target.trim(), prompt.trim(), mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickChips = [
    { label: "UPX 脱壳与解密", prompt: "脱壳并还原密钥校验算法，生成解密注册机脚本" },
    { label: "反调试与注入检测", prompt: "静态扫描并绕过反调试分支，提取 C2 与载荷" },
    { label: "Native JNI 密钥还原", prompt: "定位 libsecurity.so 导出函数与常量并输出复现代码" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 z-20">
      <div className="rounded-2xl bg-[#121215]/95 border border-zinc-800 shadow-2xl backdrop-blur-xl p-3 flex flex-col gap-2.5 transition-all">
        {/* Top Control Bar: Mode Capsule + Target Pill */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-950/80 border border-zinc-900">
            <button
              type="button"
              onClick={() => setMode("wish")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                mode === "wish"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Sparkles className="w-3 h-3 text-zinc-300" />
              <span>许愿闭环 (Wish)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("interactive")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                mode === "interactive"
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Terminal className="w-3 h-3 text-zinc-300" />
              <span>交互诊断 (Interactive)</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {isEditingTarget ? (
              <input
                type="text"
                autoFocus
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onBlur={() => setIsEditingTarget(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTarget(false)}
                className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-xs font-mono text-zinc-200 focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTarget(true)}
                title="Click to edit target path"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800/80 text-[11px] font-mono text-zinc-300 transition cursor-pointer"
              >
                <Paperclip className="w-3 h-3 text-zinc-500" />
                <span className="text-zinc-500">Target:</span>
                <span className="truncate max-w-[200px]">{target}</span>
              </button>
            )}
          </div>
        </div>

        {/* Big Input Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "wish"
                ? "输入逆向目标愿望 (例如: 自动脱壳分析、定位密钥校验算法并还原出注册机 Python 脚本)..."
                : "输入逆向研判指令 (例如: 检索导入表、反汇编入口函数、配置断点)..."
            }
            className="w-full bg-transparent px-2 py-1 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Bottom Bar: Quick Chips + Run/Stop Action */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-zinc-900/60">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {quickChips.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setPrompt(chip.prompt)}
                className="px-2 py-0.5 rounded bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/60 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition whitespace-nowrap cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-zinc-600 hidden sm:inline">
              Ctrl + Enter
            </span>
            {isRunning ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-200 text-xs font-mono transition cursor-pointer"
              >
                <Square className="w-3 h-3 fill-rose-200" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!prompt.trim()}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition disabled:opacity-30 cursor-pointer"
              >
                <span>Run</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
