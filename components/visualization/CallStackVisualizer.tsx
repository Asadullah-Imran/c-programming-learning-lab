"use client";

import React from "react";
import { StackFrame, FunctionReturnState } from "@/types/execution";
import { Layers, ChevronRight, CornerDownLeft, Sparkles, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StackFrameCard } from "./StackFrameCard";

interface CallStackVisualizerProps {
  callStack: StackFrame[];
  lastFunctionReturn?: FunctionReturnState | null;
}

export const CallStackVisualizer: React.FC<CallStackVisualizerProps> = ({
  callStack,
  lastFunctionReturn,
}) => {
  // We display frames from Top of Stack (last element) down to Bottom (main at index 0)
  const reversedFrames = [...callStack].reverse();
  const topIndex = callStack.length - 1;

  return (
    <Card className="bg-surface/60 border-surface-border backdrop-blur shadow-sm">
      <CardHeader className="pb-3 border-b border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-100">
                  Runtime Call Stack
                </CardTitle>
                <Badge variant="purple" size="sm" className="font-mono text-[11px]">
                  Depth: {callStack.length} {callStack.length === 1 ? "frame" : "frames"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Activation records dynamically allocated on function invocation (LIFO)
              </p>
            </div>
          </div>

          {/* Call Hierarchy Breadcrumbs */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface/90 border border-surface-border text-xs font-mono">
            {callStack.map((f, idx) => (
              <React.Fragment key={f.id}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                <span
                  className={
                    idx === topIndex
                      ? "text-purple-400 font-bold"
                      : "text-slate-400"
                  }
                >
                  {f.functionName}()
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Return Value Propagation Banner */}
        {lastFunctionReturn && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-emerald-950/40 border border-emerald-500/40 animate-fade-in shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Return Value Propagation
                </span>
              </div>
              <Badge variant="success" size="sm" className="font-mono">
                Line {lastFunctionReturn.returnLine}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-slate-200">
                Function <span className="font-mono font-bold text-purple-300">{lastFunctionReturn.functionName}()</span> popped off stack and returned value:
              </p>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400">returned:</span>
                <span className="font-bold text-emerald-300 text-sm px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 shadow-sm">
                  {String(lastFunctionReturn.returnValue)}
                </span>
                <CornerDownLeft className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Stack Frames (LIFO: Top Frame Rendered First) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="uppercase font-semibold tracking-wider text-[11px] text-purple-300/80">
              Top of Stack (Active)
            </span>
            <span className="text-[11px] text-slate-500">Grows Upwards ↑</span>
          </div>

          {reversedFrames.map((frame, rIdx) => {
            const originalIndex = callStack.length - 1 - rIdx;
            const isActive = originalIndex === topIndex;
            const callerFrame = originalIndex > 0 ? callStack[originalIndex - 1] : undefined;

            return (
              <StackFrameCard
                key={frame.id}
                frame={frame}
                index={originalIndex}
                totalFrames={callStack.length}
                isActive={isActive}
                callerFrame={callerFrame}
              />
            );
          })}

          <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
            <span className="uppercase font-semibold tracking-wider text-[11px] text-slate-400">
              Bottom of Stack (Program Base)
            </span>
            <span className="text-[11px] text-slate-500">Base: main()</span>
          </div>
        </div>

        {/* Pedagogical Note for Novices */}
        <div className="p-3 rounded-lg bg-surface/50 border border-surface-border text-xs text-slate-400 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-200 font-semibold">The Scope & Lifetime Rule:</span>{" "}
            Variables declared inside a function exist strictly within their stack frame. When a function returns, its frame is destroyed and that memory is released. Modifying parameters passed by value never changes the caller's variables!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
