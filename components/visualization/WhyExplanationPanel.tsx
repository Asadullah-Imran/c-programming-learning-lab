"use client";

import React from "react";
import { ExplanationEntry, ProgramState } from "@/types/execution";
import { HelpCircle, History, Sparkles, CheckCircle2 } from "lucide-react";

interface WhyExplanationPanelProps {
  state: ProgramState;
}

export const WhyExplanationPanel: React.FC<WhyExplanationPanelProps> = ({ state }) => {
  const currentExplanation = state.explanation;
  const history = state.explanationHistory;

  return (
    <div className="space-y-4">
      {/* Current Step Spotlight Card */}
      <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 shadow-glow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <Sparkles className="w-4 h-4" />
            <span>CURRENT STEP PEDAGOGICAL BREAKDOWN</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            Step {state.currentEventIndex} • Line {state.currentLine}
          </span>
        </div>

        <p className="text-sm text-slate-100 font-medium leading-relaxed">
          {currentExplanation || "Ready to execute. Click Next Step to observe program behavior."}
        </p>
      </div>

      {/* Execution Timeline Drawer */}
      <div className="rounded-xl border border-surface-border bg-surface-muted/40 overflow-hidden">
        <div className="h-10 bg-surface-elevated/70 border-b border-surface-border px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <History className="w-4 h-4 text-purple-400" />
            <span>Execution Narrative Timeline</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {history.length} event{history.length !== 1 ? "s" : ""} recorded
          </span>
        </div>

        <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="text-xs text-slate-500 italic text-center py-4">
              Timeline is empty. Step forward to record execution events.
            </div>
          ) : (
            history.map((entry, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                  idx === history.length - 1
                    ? "bg-sky-500/15 border-sky-500/40 text-white shadow-sm"
                    : "bg-surface-elevated/50 border-surface-border text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {entry.headline}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Step {entry.step} {entry.line ? `• Line ${entry.line}` : ""}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {entry.detail}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
