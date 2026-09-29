import { useState } from "react";
import { BookOpen, FileCode, Search, ExternalLink, ChevronRight } from "lucide-react";

interface KbNavigatorProps {
  onSelectTechnique?: (ref: string) => void;
}

interface TechniqueMeta {
  id: string;
  board: "pe-reverse" | "apk-reverse" | "ctf-website" | "general";
  title: string;
  category: string;
  signals: string[];
  mcpTool: string;
  docPath: string;
}

export function KbNavigator({ onSelectTechnique }: KbNavigatorProps) {
  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const techniques: TechniqueMeta[] = [
    {
      id: "pe-triage",
      board: "pe-reverse",
      title: "PE 初筛与节区加壳研判",
      category: "00-triage",
      signals: ["UPX", "High Entropy", "Overlay", "Corrupted Section"],
      mcpTool: "triage_pe / die_scan",
      docPath: "kb/pe-reverse/techniques/00-triage/00-triage-pe.md",
    },
    {
      id: "pe-antidebug",
      board: "pe-reverse",
      title: "反调试与反虚拟机绕过",
      category: "02-dynamic",
      signals: ["IsDebuggerPresent", "CheckRemoteDebuggerPresent", "NtGlobalFlag"],
      mcpTool: "patch_pe / x64dbg_scaffold",
      docPath: "kb/pe-reverse/techniques/02-dynamic/00-anti-debug-bypass.md",
    },
    {
      id: "pe-ghidra",
      board: "pe-reverse",
      title: "Ghidra 批处理符号反编译",
      category: "01-static",
      signals: ["WinMain", "Xrefs", "Import Table", "String Search"],
      mcpTool: "ghidra_headless_analyze",
      docPath: "kb/pe-reverse/techniques/01-static/00-ghidra-headless.md",
    },
    {
      id: "apk-unpack",
      board: "apk-reverse",
      title: "Android 壳防护脱壳与内存 Dump",
      category: "00-unpack",
      signals: ["SecShell", "Legu", "Bangcle", "Tencent Legu"],
      mcpTool: "android_crypto_unpack_recipe",
      docPath: "kb/apk-reverse/techniques/00-unpack/00-unpack-dex.md",
    },
    {
      id: "apk-frida",
      board: "apk-reverse",
      title: "Frida Java/Native 动态插桩与 Hook",
      category: "02-dynamic",
      signals: ["JNI_OnLoad", "Java.use", "Interceptor.attach", "SSL Pinning"],
      mcpTool: "android_http_observation_recipe",
      docPath: "kb/apk-reverse/techniques/02-dynamic/00-frida-hook.md",
    },
    {
      id: "ctf-jwt",
      board: "ctf-website",
      title: "JWT 密钥爆破与算法混淆",
      category: "auth",
      signals: ["ey...", "none algorithm", "weak secret", "JKU injection"],
      mcpTool: "jwt_tool / ctf_autopilot",
      docPath: "kb/ctf-website/techniques/02-auth/00-jwt-attacks.md",
    },
    {
      id: "gen-crypto",
      board: "general",
      title: "自定义对称与哈希算法复原",
      category: "00-crypto",
      signals: ["TEA", "XOR Table", "CRC32", "S-Box", "RC4"],
      mcpTool: "solve_crypto_from_evidence",
      docPath: "kb/general/techniques/00-crypto/01-custom-xor-tea.md",
    },
  ];

  const boards = [
    { id: "all", label: "全部板块" },
    { id: "pe-reverse", label: "PE / Windows" },
    { id: "apk-reverse", label: "APK / Android" },
    { id: "ctf-website", label: "CTF / Web" },
    { id: "general", label: "General 通用" },
  ];

  const filtered = techniques.filter((t) => {
    const matchBoard = selectedBoard === "all" || t.board === selectedBoard;
    const matchSearch =
      !search.trim() ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.signals.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      t.mcpTool.toLowerCase().includes(search.toLowerCase());
    return matchBoard && matchSearch;
  });

  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 font-sans select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold tracking-wide text-zinc-100">
            open-reverseLab 攻击网与技术库 (KB Explorer)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            {filtered.length} / {techniques.length} Techniques
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索信号 (如: UPX, IsDebuggerPresent, JNI, TEA, JWT) 或 MCP 工具..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 font-mono focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950 border border-zinc-900">
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBoard(b.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition cursor-pointer ${
                selectedBoard === b.id
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Technique Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectTechnique?.(item.docPath)}
            className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition flex flex-col justify-between gap-3 group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {item.board}
                </span>
                <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
                  <span>{item.category}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-400 transition" />
                </span>
              </div>

              <div className="text-xs font-medium text-zinc-200 group-hover:text-white transition">
                {item.title}
              </div>

              {/* Signals */}
              <div className="flex flex-wrap gap-1 pt-1">
                {item.signals.map((sig, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/90 text-zinc-400 border border-zinc-800/60"
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>

            {/* MCP Mapping Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3 h-3 text-zinc-600" />
                <span className="text-zinc-400 truncate max-w-[200px]">{item.mcpTool}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600 group-hover:text-zinc-400 transition">
                <ExternalLink className="w-3 h-3" />
                <span className="text-[10px]">技术文档</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
