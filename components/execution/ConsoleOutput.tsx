'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsoleOutputProps {
  stdout: string;
  stderr?: string;
  onClear?: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  stdout,
  stderr = '',
  onClear,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [stdout, stderr]);

  return (
    <div className="bg-[#05080E] border border-surface-border rounded-xl overflow-hidden flex flex-col font-mono text-xs shadow-lg transition-all duration-300">
      {/* Console Header */}
      <div className="h-8 bg-surface-muted/90 border-b border-surface-border px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-300 ml-1 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>TERMINAL</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
            title={isExpanded ? 'Collapse terminal' : 'Expand terminal'}
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>

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
      </div>

      {/* Terminal Content Screen */}
      <div
        ref={contentRef}
        className={`p-3 overflow-y-auto space-y-1 select-text transition-all duration-300 font-mono ${
          isExpanded ? 'min-h-[160px] max-h-[260px]' : 'min-h-[80px] max-h-[130px]'
        }`}
      >
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
