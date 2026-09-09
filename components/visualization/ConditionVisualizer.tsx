"use client";

import React from "react";
import { ConditionState } from "@/types/execution";
import { BranchDiagram } from "./BranchDiagram";
import { GitBranch, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConditionVisualizerProps {
  condition: ConditionState | null;
}

export const ConditionVisualizer: React.FC<ConditionVisualizerProps> = ({ condition }) => {
  if (!condition) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-8 text-center flex flex-col items-center justify-center gap-3 bg-surface-muted/20">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-slate-500 border border-surface-border">
          <GitBranch className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">No Active Condition</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Step into an <code className="text-sky-400 font-mono">if</code> or <code className="text-sky-400 font-mono">else-if</code> statement to observe boolean expression reduction and branch routing.
          </p>
        </div>
      </div>
    );
  }

  const isTrue = condition.result === true;

  return (
    <div className="space-y-4">
      {/* 1. Reduction Pipeline Card */}
      <div className="rounded-xl border border-surface-border bg-surface-elevated/80 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <GitBranch className="w-4 h-4 text-sky-400" />
            <span>BOOLEAN EXPRESSION REDUCTION</span>
          </div>
          <Badge variant={isTrue ? "success" : "danger"} size="sm">
            Result: {isTrue ? "TRUE (1)" : "FALSE (0)"}
          </Badge>
        </div>

        {/* Step-by-step reduction steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-surface-muted/70 border border-surface-border">
            <div className="text-[10px] text-slate-500 mb-1">1. SOURCE SYNTAX</div>
            <div className="text-white font-bold truncate">{condition.expression}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-muted/70 border border-surface-border">
            <div className="text-[10px] text-slate-500 mb-1">2. RUNTIME SUBSTITUTION</div>
            <div className="text-sky-400 font-bold truncate">
              {condition.substitutedExpression || condition.expression}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-muted/70 border border-surface-border">
            <div className="text-[10px] text-slate-500 mb-1">3. BRANCH SELECTED</div>
            <div className={`font-bold flex items-center gap-1 ${isTrue ? "text-emerald-400" : "text-rose-400"}`}>
              {isTrue ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enter IF Block</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Enter ELSE Block</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Pedagogical Note */}
        <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] text-slate-300 flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
          <span>
            In C, conditional expressions evaluate to integers: <strong className="text-emerald-400">1 represents TRUE</strong> and <strong className="text-rose-400">0 represents FALSE</strong>. Any non-zero integer is treated as true.
          </span>
        </div>
      </div>

      {/* 2. Visual Decision Tree Diagram */}
      <BranchDiagram
        expression={condition.expression}
        substitutedExpression={condition.substitutedExpression}
        result={condition.result}
        branchTaken={condition.branchTaken}
      />
    </div>
  );
};
