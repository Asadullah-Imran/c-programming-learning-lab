"use client";

import React from "react";
import { Terminal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConsoleOutputProps {
  stdout: string;
  stderr?: string;
  onClear?: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  stdout,
  stderr = "",
  onClear,
}) => {
  return (
    <div className="bg-[#05080E] border border-surface-border rounded-xl overflow-hidden flex flex-col font-mono text-xs">
      {/* Console Header */}
      <div className="h-8 bg-surface-muted/90 border-b border-surface-border px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 ml-1">
            <Terminal className="w-3 h-3 text-sky-400" />
            <span>TERMINAL</span>
          </div>
        </div>

        {onClear && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="h-6 px-1.5 text-[10px] text-slate-500 hover:text-slate-300 gap-1"
          >
            <Trash2 className="w-2.5 h-2.5" />
            <span>Clear</span>
          </Button>
        )}
      </div>

      {/* Terminal Content Screen */}
      <div className="p-3 min-h-[90px] max-h-[140px] overflow-y-auto space-y-1 select-text">
        {stdout ? (
          <pre className="text-emerald-400 whitespace-pre-wrap font-mono leading-relaxed">
            {stdout}
          </pre>
        ) : !stderr ? (
          <div className="text-slate-600 italic select-none">
            Output stream is empty. Output from printf() will appear here.
          </div>
        ) : null}

        {stderr && (
          <pre className="text-rose-400 whitespace-pre-wrap font-mono leading-relaxed border-t border-rose-500/20 pt-1 mt-1">
            {stderr}
          </pre>
        )}
      </div>
    </div>
  );
};
