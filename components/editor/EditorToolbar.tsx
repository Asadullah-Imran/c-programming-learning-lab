"use client";

import React from "react";
import { ALL_MOCK_SCENARIOS } from "@/lib/execution/mock-events";
import { FileCode, RotateCcw, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
  currentScenarioId: string;
  onSelectScenario: (id: string) => void;
  onResetCode: () => void;
  currentLine: number;
  isExecuting: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  currentScenarioId,
  onSelectScenario,
  onResetCode,
  currentLine,
  isExecuting,
}) => {
  return (
    <div className="h-11 bg-surface-muted/90 border-b border-surface-border px-3.5 flex items-center justify-between text-xs">
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
      </div>

      {/* Right: Scenario Selector & Reset */}
      <div className="flex items-center gap-2">
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
