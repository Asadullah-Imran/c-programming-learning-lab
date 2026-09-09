"use client";

import React from "react";
import { useExecutionController } from "@/hooks/useExecutionController";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { PlaybackControls } from "@/components/execution/PlaybackControls";
import { ConsoleOutput } from "@/components/execution/ConsoleOutput";
import { VisualizationContainer } from "@/components/visualization/VisualizationContainer";
import { CallStackVisualizer } from "@/components/visualization/CallStackVisualizer";
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

          {/* Visualizer Shell: Variables, Memory Layout, Control Flow, Call Stack, and Why? Timeline */}
          <VisualizationContainer state={state} />

          {/* Dedicated Runtime Call Stack Inspector */}
          <CallStackVisualizer
            callStack={state.callStack}
            lastFunctionReturn={state.lastFunctionReturn}
          />
        </div>
      </div>
    </div>
  );
}
