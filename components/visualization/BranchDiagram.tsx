"use client";

import React from "react";
import { Check, X, ArrowDown } from "lucide-react";

interface BranchDiagramProps {
  expression: string;
  substitutedExpression?: string;
  result: boolean | null;
  branchTaken: "then" | "else" | null;
  thenLabel?: string;
  elseLabel?: string;
}

export const BranchDiagram: React.FC<BranchDiagramProps> = ({
  expression,
  substitutedExpression,
  result,
  branchTaken,
  thenLabel = "Execute IF Block",
  elseLabel = "Execute ELSE Block",
}) => {
  const isTrue = result === true;
  const isFalse = result === false;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#070B12] rounded-xl border border-surface-border text-xs select-none">
      {/* 1. Incoming Flow */}
      <div className="flex flex-col items-center">
        <div className="px-3 py-1 rounded-md bg-surface-elevated border border-surface-border text-[11px] font-mono text-slate-400">
          Incoming Execution
        </div>
        <ArrowDown className="w-3.5 h-3.5 text-slate-500 my-1" />
      </div>

      {/* 2. Decision Diamond Container */}
      <div className="relative my-2 flex items-center justify-center">
        <div
          className={`px-6 py-3.5 rounded-2xl border transition-all duration-300 shadow-glass flex flex-col items-center justify-center text-center ${
            isTrue
              ? "bg-emerald-500/15 border-emerald-500/50 shadow-glow-emerald"
              : isFalse
              ? "bg-rose-500/15 border-rose-500/50"
              : "bg-surface-elevated/90 border-surface-border"
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
            Evaluate Condition
          </span>
          <span className="font-mono font-bold text-sm text-white">{expression}</span>
          {substitutedExpression && (
            <span className="text-[11px] font-mono text-sky-400 mt-0.5">
              [{substitutedExpression}]
            </span>
          )}
        </div>
      </div>

      {/* 3. Branch Split Paths (SVG Connectors & Result Blocks) */}
      <div className="w-full grid grid-cols-2 gap-4 mt-2">
        {/* Left Column: TRUE Branch (IF) */}
        <div
          className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
            isTrue
              ? "bg-emerald-500/15 border-emerald-500/50 shadow-glow-emerald ring-1 ring-emerald-500/30"
              : "bg-surface-muted/20 border-surface-border/50 opacity-40"
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 mb-1">
            <Check className="w-3.5 h-3.5" />
            <span>TRUE (1)</span>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold text-xs">{thenLabel}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              {isTrue ? "Active Execution Path" : "Skipped"}
            </div>
          </div>
        </div>

        {/* Right Column: FALSE Branch (ELSE) */}
        <div
          className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
            isFalse
              ? "bg-rose-500/15 border-rose-500/50 ring-1 ring-rose-500/30"
              : "bg-surface-muted/20 border-surface-border/50 opacity-40"
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400 mb-1">
            <X className="w-3.5 h-3.5" />
            <span>FALSE (0)</span>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold text-xs">{elseLabel}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              {isFalse ? "Active Execution Path" : "Skipped"}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Convergence Node */}
      <div className="flex flex-col items-center mt-3 pt-2 border-t border-surface-border/60 w-full">
        <ArrowDown className="w-3.5 h-3.5 text-slate-600 mb-1" />
        <span className="text-[10px] font-mono text-slate-500">
          Branches converge and program continues
        </span>
      </div>
    </div>
  );
};
