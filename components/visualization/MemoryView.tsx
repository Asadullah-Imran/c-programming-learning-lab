"use client";

import React from "react";
import { VariableState } from "@/types/execution";
import { Layers, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemoryViewProps {
  variables: Record<string, VariableState>;
}

export const MemoryView: React.FC<MemoryViewProps> = ({ variables }) => {
  const variableList = Object.values(variables);

  if (variableList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-8 text-center flex flex-col items-center justify-center gap-3 bg-surface-muted/20">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-slate-500 border border-surface-border">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Stack Memory Empty</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Step through C variable declarations to observe contiguous byte allocations on the call stack.
          </p>
        </div>
      </div>
    );
  }

  // Calculate total bytes allocated
  const totalBytes = variableList.reduce((acc, v) => acc + v.sizeBytes, 0);

  return (
    <div className="space-y-4">
      {/* Educational Callout Header */}
      <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-border flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">How C Stack Memory Works: </span>
          C variables occupy physical contiguous byte addresses in RAM. Notice how an <span className="text-sky-400 font-mono">int</span> consumes <strong className="text-white">4 contiguous byte slots</strong>, while a <span className="text-amber-400 font-mono">char</span> consumes <strong className="text-white">1 byte</strong>.
        </div>
      </div>

      {/* Memory Allocation Summary Stats */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Stack Direction: <strong className="text-slate-300">High → Low (Downward)</strong></span>
        <span>Total Allocated: <strong className="text-sky-400">{totalBytes} Bytes</strong> ({totalBytes * 8} bits)</span>
      </div>

      {/* Contiguous Stack Layout Visualization */}
      <div className="rounded-xl border border-surface-border bg-[#070B12] overflow-hidden">
        <div className="h-9 bg-surface-muted/80 border-b border-surface-border px-4 flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>BASE ADDRESS</span>
          <span>BYTE SLOTS IN STACK RAM</span>
          <span>VARIABLE & VALUE</span>
        </div>

        <div className="divide-y divide-surface-border/60">
          {variableList.map((v) => {
            const isUpdated = v.isUpdated;

            return (
              <div
                key={v.name}
                className={`p-3.5 flex items-center justify-between gap-4 transition-all duration-300 ${
                  isUpdated
                    ? "bg-amber-500/10 shadow-glow"
                    : "hover:bg-surface-elevated/30"
                }`}
              >
                {/* Left: Memory Address */}
                <div className="font-mono text-xs text-slate-400 shrink-0">
                  <div className="text-white font-semibold">{v.address}</div>
                  <div className="text-[10px] text-slate-500">offset: 0x00</div>
                </div>

                {/* Center: Physical Contiguous Byte Blocks */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-surface-muted/90 border border-surface-border">
                    {Array.from({ length: v.sizeBytes }).map((_, byteIdx) => (
                      <div
                        key={byteIdx}
                        className={`w-9 h-10 rounded border flex flex-col items-center justify-center font-mono text-[10px] transition-all ${
                          isUpdated
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 scale-105"
                            : v.type === "char"
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                            : v.type === "float"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : v.type === "double"
                            ? "bg-purple-500/15 border-purple-500/30 text-purple-400"
                            : "bg-sky-500/15 border-sky-500/30 text-sky-400"
                        }`}
                      >
                        <span className="text-[9px] text-slate-500 select-none">b{byteIdx}</span>
                        <span className="font-bold">
                          {byteIdx === 0 && v.value !== null && v.value !== undefined
                            ? String(v.value).slice(0, 3)
                            : "··"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Variable metadata */}
                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-mono font-bold text-white text-sm">{v.name}</span>
                    <Badge variant={v.type === "char" ? "char" : "int"} size="sm">
                      {v.type}
                    </Badge>
                  </div>
                  <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">
                    = {v.value !== null && v.value !== undefined ? String(v.value) : "uninitialized"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
