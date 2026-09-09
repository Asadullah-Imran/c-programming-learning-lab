"use client";

import React from "react";
import { ALL_MOCK_SCENARIOS } from "@/lib/execution/mock-events";
import { FileCode, RotateCcw, ChevronDown, Play, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  currentScenarioId: string;
  onSelectScenario: (id: string) => void;
  onResetCode: () => void;
  onRunCode?: () => void;
  isCompiling?: boolean;
  compileStatus?: string | null;
  currentLine: number;
  isExecuting: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentScenarioId,
  onSelectScenario,
  onResetCode,
  onRunCode,
  isCompiling = false,
  compileStatus = null,
  currentLine,
  isExecuting,
}) => {
  return (
    <div className="h-11 bg-surface-muted/90 border-b border-surface-border px-3.5 flex items-center justify-between text-xs flex-wrap gap-2">
      {/* Left: Active File Tab & Execution Status */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-elevated border border-surface-border text-slate-200 font-mono font-medium">
          <FileCode className="w-3.5 h-3.5 text-sky-400" />
          <span>main.c</span>
          <span className="text-[10px] text-slate-500 font-sans ml-1">C99</span>
        </div>

        {isExecuting && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono text-[11px] animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Line {currentLine}</span>
          </div>
        )}

        {compileStatus && (
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {compileStatus}
          </span>
        )}
      </div>

      {/* Right: Run Button, Scenario Selector & Reset */}
      <div className="flex items-center gap-2">
        {onRunCode && (
          <Button
            size="sm"
            onClick={onRunCode}
            disabled={isCompiling}
            className="h-7 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-sm transition-all text-xs gap-1.5"
            title="Compile and visualize custom C code"
          >
            {isCompiling ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run / Visualize</span>
              </>
            )}
          </Button>
        )}

        <div className="relative flex items-center">
          <label htmlFor="scenario-select" className="sr-only">Choose Scenario</label>
          <select
            id="scenario-select"
            value={currentScenarioId}
            onChange={(e) => onSelectScenario(e.target.value)}
            className="appearance-none bg-surface-elevated/90 hover:bg-slate-700/80 text-slate-200 text-xs font-medium pl-2.5 pr-7 py-1 rounded-md border border-surface-border focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
          >
            {ALL_MOCK_SCENARIOS.map((scenario) => (
              <option key={scenario.id} value={scenario.id} className="bg-slate-900 text-white">
                {scenario.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onResetCode}
          title="Reset code to original scenario starter"
          className="h-7 px-2 text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};
