"use client";

import React from "react";
import { useExecutionController } from "@/hooks/useExecutionController";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { PlaybackControls } from "@/components/execution/PlaybackControls";
import { ConsoleOutput } from "@/components/execution/ConsoleOutput";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Cpu, 
  HelpCircle, 
  Layers, 
  GitBranch, 
  Sparkles,
  ArrowRight,
  Database
} from "lucide-react";

export default function CodeLabPage() {
  const controller = useExecutionController();

  const {
    scenario,
    code,
    setCode,
    state,
    speed,
    setSpeed,
    isPlaying,
    stepForward,
    stepBackward,
    togglePlay,
    reset,
    jumpToStep,
    loadScenario,
    hasNextStep,
    hasPrevStep,
  } = controller;

  const variableEntries = Object.values(state.variables);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Top Breadcrumb & Scenario Header */}
      <div className="h-12 border-b border-surface-border bg-surface-muted/60 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Code Lab</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-semibold">{scenario.title}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <p className="text-xs text-slate-400 hidden sm:block truncate max-w-md">
            {scenario.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              state.status === "completed"
                ? "success"
                : state.status === "running"
                ? "int"
                : "default"
            }
            size="sm"
          >
            Status: {state.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Editor & Terminal Console (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 border-b lg:border-b-0 lg:border-r border-surface-border flex flex-col h-full bg-[#070B12]">
          <EditorToolbar
            currentScenarioId={scenario.id}
            onSelectScenario={loadScenario}
            onResetCode={() => setCode(scenario.code)}
            currentLine={state.currentLine}
            isExecuting={state.currentEventIndex > 0 && state.status !== "completed"}
          />

          <div className="flex-1 min-h-[260px] overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              currentLine={state.currentLine}
              isReadOnly={state.currentEventIndex > 0 && state.status !== "completed"}
            />
          </div>

          <div className="p-3 border-t border-surface-border bg-surface-muted/30">
            <ConsoleOutput stdout={state.stdout} stderr={state.stderr} onClear={reset} />
          </div>
        </div>

        {/* Right Column: Execution Controller & Notional Machine Visualizer (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col h-full overflow-y-auto bg-surface/40 p-4 sm:p-6 gap-5">
          {/* Playback Controls Toolbar */}
          <PlaybackControls
            currentStep={state.currentEventIndex}
            totalSteps={scenario.events.length}
            isPlaying={isPlaying}
            speed={speed}
            onSetSpeed={setSpeed}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onTogglePlay={togglePlay}
            onReset={reset}
            onJumpToStep={jumpToStep}
            hasNext={hasNextStep}
            hasPrev={hasPrevStep}
          />

          {/* Pedagogical "Why?" Narrative Panel */}
          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/25 shadow-glow transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <HelpCircle className="w-4 h-4" />
                <span>WHY DID THIS HAPPEN?</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Line {state.currentLine}
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {state.explanation || "Program ready. Click 'Next Step' or 'Run' to begin execution."}
            </p>
          </div>

          {/* Notional Machine State Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Memory & Variable State Card */}
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-sky-400" />
                    <CardTitle className="text-sm font-semibold">Stack Variables</CardTitle>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {variableEntries.length} in scope
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2.5">
                {variableEntries.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-6 text-center">
                    No variables allocated yet. Step forward to declare variables.
                  </div>
                ) : (
                  variableEntries.map((v) => (
                    <div
                      key={v.name}
                      className={`p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                        v.isUpdated
                          ? "bg-amber-500/15 border-amber-500/40 shadow-glow animate-value-flash"
                          : "bg-surface-elevated/70 border-surface-border"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white text-sm">{v.name}</span>
                          <Badge variant="int" size="sm">
                            {v.type} ({v.sizeBytes}B)
                          </Badge>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          addr: {v.address}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400">Value</div>
                        <div className="text-base font-mono font-bold text-sky-400">
                          {v.value !== null && v.value !== undefined ? String(v.value) : "uninitialized"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Control Flow & Call Stack State Card */}
            <div className="flex flex-col gap-4">
              {/* Call Stack Frame */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <CardTitle className="text-sm font-semibold">Call Stack</CardTitle>
                    </div>
                    <span className="text-xs font-mono text-purple-400">
                      Depth: {state.callStack.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {state.callStack.map((frame, idx) => (
                    <div
                      key={frame.id}
                      className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300 font-bold">#{idx}</span>
                        <span className="text-white font-semibold">{frame.functionName}()</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">Line {frame.callLine}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Active Condition or Loop if Present */}
              {state.activeCondition && (
                <Card className="border-emerald-500/30 bg-emerald-500/10">
                  <CardHeader className="pb-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Active Condition</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{state.activeCondition.expression}</div>
                      {state.activeCondition.substitutedExpression && (
                        <div className="text-slate-400 text-[11px]">
                          [{state.activeCondition.substitutedExpression}]
                        </div>
                      )}
                    </div>
                    <Badge variant={state.activeCondition.result ? "success" : "danger"}>
                      {state.activeCondition.result ? "TRUE (1) ✓" : "FALSE (0) ✗"}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {state.activeLoop && (
                <Card className="border-indigo-500/30 bg-indigo-500/10">
                  <CardHeader className="pb-1">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Active Loop Iteration</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs font-mono flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">
                        {state.activeLoop.loopType.toUpperCase()} Loop
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Iteration #{state.activeLoop.iteration}
                      </div>
                    </div>
                    <Badge variant="purple">Running</Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
