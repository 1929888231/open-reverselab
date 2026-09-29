import { Plus, Terminal, Network, Shield, FolderGit2, Activity, BookOpen, Settings } from "lucide-react";
import { HarnessView, SessionItem, useI18n } from "../../../core";

interface SidebarProps {
  sessions: SessionItem[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onOpenTools: () => void;
  onOpenSettings?: () => void;
  activeView: HarnessView;
  onToggleView: (view: HarnessView) => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onOpenTools,
  onOpenSettings,
  activeView,
  onToggleView,
}: SidebarProps) {
  const { t } = useI18n();

  return (
    <aside className="w-60 h-full bg-[#0d0d10] border-r border-zinc-900 flex flex-col select-none shrink-0 z-10 font-sans">
      {/* New Analysis Button */}
      <div className="p-3 border-b border-zinc-900/80">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 text-xs font-medium text-zinc-200 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-400" />
          <span>{t.sidebar.newAnalysis}</span>
        </button>
      </div>

      {/* View Switcher Tabs (4 columns: Graph, Logs, Diag, KB) */}
      <div className="px-3 pt-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5 px-1">
          {t.sidebar.views}
        </div>
        <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950/60 rounded-lg border border-zinc-900">
          <button
            onClick={() => onToggleView("canvas")}
            title={t.sidebar.graph}
            className={`flex items-center justify-center gap-1 py-1.5 rounded text-[11px] font-mono transition cursor-pointer ${
              activeView === "canvas"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Network className="w-3 h-3" />
            <span>{t.sidebar.graph}</span>
          </button>
          <button
            onClick={() => onToggleView("console")}
            title={t.sidebar.logs}
            className={`flex items-center justify-center gap-1 py-1.5 rounded text-[11px] font-mono transition cursor-pointer ${
              activeView === "console"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>{t.sidebar.logs}</span>
          </button>
          <button
            onClick={() => onToggleView("diagnostics")}
            title={t.sidebar.diag}
            className={`flex items-center justify-center gap-1 py-1.5 rounded text-[11px] font-mono transition cursor-pointer ${
              activeView === "diagnostics"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>{t.sidebar.diag}</span>
          </button>
          <button
            onClick={() => onToggleView("kb")}
            title={t.sidebar.kb}
            className={`flex items-center justify-center gap-1 py-1.5 rounded text-[11px] font-mono transition cursor-pointer ${
              activeView === "kb"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>{t.sidebar.kb}</span>
          </button>
        </div>
      </div>

      {/* History Session List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5 px-1">
          {t.sidebar.history}
        </div>
        {sessions.map((s) => {
          const isActive = s.id === activeSessionId;
          return (
            <div
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={`p-2.5 rounded-lg cursor-pointer transition flex flex-col gap-0.5 border ${
                isActive
                  ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
                  : "border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300"
              }`}
            >
              <div className="text-xs font-medium truncate">{s.title}</div>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="truncate max-w-[120px]">{s.target}</span>
                <span>{s.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Environment & Settings */}
      <div className="p-3 border-t border-zinc-900/80 bg-zinc-950/40 space-y-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenTools}
            className="flex-1 flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>{t.sidebar.environment}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              109 {t.sidebar.toolsUnit}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            title={t.settings.title}
            className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono text-zinc-600">
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3 h-3" />
            <span>open-reverseLab</span>
          </div>
          <span>v0.1.0</span>
        </div>
      </div>
    </aside>
  );
}
