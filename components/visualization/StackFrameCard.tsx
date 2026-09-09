"use client";

import React from "react";
import { StackFrame, VariableState } from "@/types/execution";
import { Layers, ArrowRight, CornerDownLeft, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTypeBadge } from "./DataTypeBadge";

interface StackFrameCardProps {
  frame: StackFrame;
  index: number;
  totalFrames: number;
  isActive: boolean;
  callerFrame?: StackFrame;
}

export const StackFrameCard: React.FC<StackFrameCardProps> = ({
  frame,
  index,
  totalFrames,
  isActive,
  callerFrame,
}) => {
  const localVars = Object.values(frame.variables);
  const isMain = frame.functionName === "main";

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 ${
        isActive
          ? "border-purple-500/50 bg-gradient-to-b from-purple-950/30 to-purple-900/10 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30"
          : "border-slate-800 bg-surface/40 hover:bg-surface/60 opacity-85"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border/50">
        <div className="flex items-center gap-2.5">
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
              isActive
                ? "bg-purple-500 text-white shadow-sm"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            #{index}
          </span>
          <div className="flex items-center gap-1.5">
            <Layers
              className={`w-4 h-4 ${
                isActive ? "text-purple-400 animate-pulse" : "text-slate-500"
              }`}
            />
            <span className="font-mono font-bold text-sm text-slate-100">
              {frame.functionName}
              <span className="text-slate-400 font-normal">()</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Badge variant="purple" size="sm" className="gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-300"></span>
              ACTIVE (Top of Stack)
            </Badge>
          ) : (
            <Badge variant="outline" size="sm" className="gap-1 text-amber-400 border-amber-500/30 bg-amber-500/10">
              <Clock className="w-3 h-3" />
              SUSPENDED (Waiting)
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Frame Metadata: Call site & Return address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-500">Call Site:</span>
            {isMain ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Entry Point
              </span>
            ) : (
              <span className="text-slate-200">
                Line {frame.callLine} in {callerFrame?.functionName || "caller"}()
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/80 border border-surface-border">
            <span className="text-slate-500">Return To:</span>
            {isMain ? (
              <span className="text-slate-400">OS Exit (Code 0)</span>
            ) : (
              <span className="text-purple-300 font-semibold flex items-center gap-1">
                <CornerDownLeft className="w-3.5 h-3.5" /> Line {frame.callLine}
              </span>
            )}
          </div>
        </div>

        {/* Parameter Pass-by-Value Section */}
        {frame.parameters && frame.parameters.length > 0 && (
          <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-indigo-300 font-semibold uppercase tracking-wider">
                Parameter Pass-by-Value Mapping
              </span>
              <span className="text-[10px] text-slate-400">Values are copied into independent slots</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {frame.parameters.map((param, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center justify-between p-2 rounded bg-surface/90 border border-indigo-500/30 text-xs font-mono"
                >
                  <div className="flex items-center gap-1.5">
                    {param.originalArg ? (
                      <span className="text-cyan-300">
                        {param.originalArg} <span className="text-slate-500">({String(param.value)})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">arg {pIdx + 1}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-purple-300 font-bold">{param.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <DataTypeBadge type={param.type} />
                    <span className="font-bold text-white bg-indigo-500/30 px-1.5 py-0.5 rounded border border-indigo-400/30">
                      {String(param.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Variables within Frame Scope */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-slate-300">
              Local Variables in Scope (<span className="text-purple-400 font-mono">{frame.functionName}</span>)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {localVars.length} allocated
            </span>
          </div>

          {localVars.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-500 rounded-lg bg-surface/30 border border-dashed border-surface-border">
              No local variables currently declared in this frame
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {localVars.map((v) => (
                <div
                  key={v.name}
                  className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                    v.isUpdated
                      ? "bg-purple-500/15 border-purple-500/40 ring-1 ring-purple-500/30"
                      : "bg-surface/70 border-surface-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{v.name}</span>
                    <DataTypeBadge type={v.type} />
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{v.address}</span>
                    <span className="font-bold text-purple-300">
                      {v.value !== null && v.value !== undefined ? String(v.value) : "uninit"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
