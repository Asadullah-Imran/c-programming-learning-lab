"use client";

import React from "react";
import { LoopState, ProgramState } from "@/types/execution";
import { Cpu, RotateCw, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoopVisualizerProps {
  loop: LoopState | null;
  state: ProgramState;
}

export const LoopVisualizer: React.FC<LoopVisualizerProps> = ({ loop, state }) => {
  if (!loop) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-8 text-center flex flex-col items-center justify-center gap-3 bg-surface-muted/20">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-slate-500 border border-surface-border">
          <RotateCw className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">No Active Loop</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Step into a <code className="text-sky-400 font-mono">for</code>, <code className="text-sky-400 font-mono">while</code>, or <code className="text-sky-400 font-mono">do-while</code> loop to trace iterations and variable updates cycle-by-cycle.
          </p>
        </div>
      </div>
    );
  }

  const loopStages = [
    { name: "1. Init", desc: "Runs once on entry", active: false },
    { name: "2. Condition Check", desc: loop.conditionExpression || "Guard Test", active: true },
    { name: "3. Body Execution", desc: "Statements inside { }", active: true },
    { name: "4. Increment / Step", desc: "Counter update", active: false },
  ];

  return (
    <div className="space-y-4">
      {/* Loop Header & Iteration Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 shadow-glow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span className="font-mono font-bold text-white text-sm">
              {loop.loopType.toUpperCase()} LOOP ITERATION #{loop.iteration}
            </span>
          </div>
          <Badge variant="purple" size="sm">
            Condition: {loop.isConditionMet ? "TRUE (1) ✓" : "FALSE (0)"}
          </Badge>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Guard Condition: <strong className="text-white">{loop.conditionExpression || "Loop condition met"}</strong>
        </p>
      </div>

      {/* 4-Stage Loop Lifecycle Progress Bar */}
      <div className="rounded-xl border border-surface-border bg-surface-elevated/70 p-4">
        <div className="text-xs font-semibold text-white mb-3 flex items-center justify-between">
          <span>Loop Execution Cycle Stages</span>
          <span className="text-[10px] font-mono text-slate-400">Step {loop.iteration} Active</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {loopStages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                stage.active
                  ? "bg-indigo-500/20 border-indigo-500/50 text-white shadow-sm"
                  : "bg-surface-muted/50 border-surface-border text-slate-400 opacity-60"
              }`}
            >
              <div className="font-bold text-[11px] text-indigo-300">{stage.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stage.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Variables in Loop Scope */}
      <div className="rounded-xl border border-surface-border bg-surface-muted/40 p-4">
        <div className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>Loop Scope Variables</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
          {Object.values(state.variables).map((v) => (
            <div
              key={v.name}
              className={`p-2.5 rounded-lg border ${
                v.isUpdated
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300"
                  : "bg-surface-elevated border-surface-border text-slate-200"
              }`}
            >
              <div className="text-[10px] text-slate-500">{v.name} ({v.type})</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">{String(v.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Note */}
      <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs text-slate-300 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          In a <strong className="text-white">for loop</strong>, the condition check occurs <em>before</em> every iteration. If the condition becomes false, execution immediately breaks out without running the loop body.
        </p>
      </div>
    </div>
  );
};
