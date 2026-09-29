import { HarnessProvider, useHarness } from "./state";
import {
  TitleBar,
  Sidebar,
  CanvasGraph,
  LogConsole,
  DiagnosticsPanel,
  PromptConsole,
  DetailDrawer,
  ToolMonitorDrawer,
  LootCard,
} from "./views";
import "./App.css";

function AppContent() {
  const {
    sessions,
    activeSessionId,
    currentSession,
    viewMode,
    steps,
    logs,
    selectedStep,
    deliverables,
    isRunning,
    isToolMonitorOpen,
    executeHarness,
    clearLogs,
    newSession,
    selectSession,
    selectStep,
    setViewMode,
    setToolMonitorOpen,
    dismissLoot,
  } = useHarness();

  return (
    <div className="w-screen h-screen bg-[#09090b] text-zinc-100 flex flex-col select-none overflow-hidden font-sans">
      {/* 1. Integrated borderless TitleBar with native dragging & controls */}
      <TitleBar title={currentSession?.target} />

      {/* 2. Decoupled Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Harness Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={selectSession}
          onNewSession={newSession}
          onOpenTools={() => setToolMonitorOpen(true)}
          activeView={viewMode}
          onToggleView={setViewMode}
        />

        {/* Center Main Stage + Big Prompt Console */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#09090b]">
          {/* Swappable Views (Graph | Logs | Diagnostics) */}
          <div className="flex-1 relative overflow-hidden">
            {viewMode === "canvas" && (
              <CanvasGraph
                steps={steps}
                selectedStep={selectedStep}
                onSelectStep={selectStep}
              />
            )}
            {viewMode === "console" && (
              <LogConsole
                logs={logs}
                onClear={clearLogs}
              />
            )}
            {viewMode === "diagnostics" && (
              <DiagnosticsPanel
                currentTarget={currentSession?.target}
              />
            )}
          </div>

          {/* Large Prompt Console with Wish/Interactive mode capsule */}
          <PromptConsole
            isRunning={isRunning}
            defaultTarget={currentSession?.target}
            onExecute={executeHarness}
          />
        </div>

        {/* Drawers & Overlays */}
        <DetailDrawer
          step={selectedStep}
          onClose={() => selectStep(null)}
        />

        <ToolMonitorDrawer
          isOpen={isToolMonitorOpen}
          onClose={() => setToolMonitorOpen(false)}
        />

        {deliverables && (
          <LootCard
            deliverables={deliverables}
            onClose={dismissLoot}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HarnessProvider>
      <AppContent />
    </HarnessProvider>
  );
}
