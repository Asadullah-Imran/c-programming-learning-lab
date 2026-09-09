"use client";

import React, { useState } from "react";
import { ProgramState } from "@/types/execution";
import { VariableGrid } from "./VariableGrid";
import { MemoryView } from "./MemoryView";
import { WhyExplanationPanel } from "./WhyExplanationPanel";
import { 
  Database, 
  Layers, 
  HelpCircle, 
  GitBranch, 
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VisualizationContainerProps {
  state: ProgramState;
}

export const VisualizationContainer: React.FC<VisualizationContainerProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<"variables" | "memory" | "why">("variables");

  const variableCount = Object.keys(state.variables).length;
  const totalBytes = Object.values(state.variables).reduce((acc, v) => acc + v.sizeBytes, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Visualizer Tab Bar */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-surface-muted/90 p-1 rounded-xl border border-surface-border">
          <button
            onClick={() => setActiveTab("variables")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "variables"
                ? "bg-surface-elevated text-primary shadow-sm border border-surface-border font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Variables</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface text-slate-400">
              {variableCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("memory")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "memory"
                ? "bg-surface-elevated text-primary shadow-sm border border-surface-border font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Memory Layout</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface text-slate-400">
              {totalBytes}B
            </span>
          </button>

          <button
            onClick={() => setActiveTab("why")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "why"
                ? "bg-surface-elevated text-primary shadow-sm border border-surface-border font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Why? Timeline</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface text-slate-400">
              {state.explanationHistory.length}
            </span>
          </button>
        </div>

        {/* Real-time Condition / Loop Indicator Pill */}
        {state.activeCondition && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-white font-bold">{state.activeCondition.expression}</span>
            <Badge variant={state.activeCondition.result ? "success" : "danger"} size="sm">
              {state.activeCondition.result ? "TRUE ✓" : "FALSE ✗"}
            </Badge>
          </div>
        )}

        {state.activeLoop && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white font-bold">{state.activeLoop.loopType.toUpperCase()} Iteration #{state.activeLoop.iteration}</span>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      <div className="transition-all duration-200">
        {activeTab === "variables" && <VariableGrid variables={state.variables} />}
        {activeTab === "memory" && <MemoryView variables={state.variables} />}
        {activeTab === "why" && <WhyExplanationPanel state={state} />}
      </div>
    </div>
  );
};
