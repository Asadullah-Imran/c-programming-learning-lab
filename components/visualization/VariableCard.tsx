"use client";

import React from "react";
import { VariableState } from "@/types/execution";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

interface VariableCardProps {
  variable: VariableState;
}

export const VariableCard: React.FC<VariableCardProps> = ({ variable }) => {
  const isUpdated = variable.isUpdated;
  const hasPrev = variable.previousValue !== undefined && variable.previousValue !== variable.value;

  const displayValue =
    variable.value !== null && variable.value !== undefined
      ? String(variable.value)
      : "uninitialized";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
        isUpdated
          ? "bg-amber-500/10 border-amber-500/50 shadow-glow animate-value-flash"
          : "bg-surface-elevated/70 border-surface-border hover:border-slate-600"
      }`}
    >
      {/* Glow highlight for updated state */}
      {isUpdated && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
      )}

      {/* Card Header: Name, Type, and Address */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-base font-bold text-white tracking-tight">
            {variable.name}
          </span>
          <Badge
            variant={
              variable.type === "char"
                ? "char"
                : variable.type === "float"
                ? "float"
                : variable.type === "double"
                ? "double"
                : "int"
            }
            size="sm"
          >
            {variable.type} ({variable.sizeBytes}B)
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          {isUpdated && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-2.5 h-2.5" />
              UPDATED
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface/80 text-slate-400 border border-slate-700/60">
            {variable.address}
          </span>
        </div>
      </div>

      {/* Main Value Display */}
      <div className="bg-surface-muted/70 rounded-lg p-3 border border-surface-border/60 flex items-center justify-between">
        <div className="text-[11px] font-mono text-slate-400">
          Value in RAM
        </div>

        <div className="text-right">
          <div
            className={`font-mono font-extrabold text-xl tracking-wide ${
              isUpdated ? "text-amber-400" : "text-sky-400"
            }`}
          >
            {displayValue}
          </div>

          {/* Previous Value Transition Pill */}
          {hasPrev && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-0.5 justify-end">
              <span className="line-through text-slate-500">{String(variable.previousValue)}</span>
              <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
              <span className="text-amber-300 font-semibold">{displayValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Scope Footer */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>Scope: <strong className="text-slate-400">{variable.scope}</strong></span>
        <span>{variable.sizeBytes * 8} bits allocated</span>
      </div>
    </div>
  );
};
