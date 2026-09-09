'use client';

import React, { useState, useEffect } from 'react';
import { EmbeddedSnippet } from '@/types/curriculum';
import { executeUserCode } from '@/lib/execution/api-client';
import { executionReducer } from '@/lib/execution/reducer';
import { createInitialProgramState } from '@/lib/execution/initial-state';
import { ExecutionEvent, ProgramState } from '@/types/execution';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, ExternalLink, Terminal, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface EmbeddedVisualizerWidgetProps {
  widget: EmbeddedSnippet;
}

export const EmbeddedVisualizerWidget: React.FC<EmbeddedVisualizerWidgetProps> = ({ widget }) => {
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [state, setState] = useState<ProgramState>(() => createInitialProgramState(0));
  const [history, setHistory] = useState<ProgramState[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compile and load the embedded snippet on mount
  useEffect(() => {
    let isMounted = true;
    async function loadSnippet() {
      setIsLoading(true);
      try {
        const res = await executeUserCode(widget.code);
        if (isMounted && res.status === 'success' && res.events.length > 0) {
          setEvents(res.events);
          setState(createInitialProgramState(res.events.length));
        }
      } catch (err) {
        console.error('Failed to load embedded snippet', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadSnippet();
    return () => {
      isMounted = false;
    };
  }, [widget.code]);

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && events.length > 0) {
      timer = setInterval(() => {
        setState(prev => {
          if (prev.currentEventIndex >= events.length) {
            setIsPlaying(false);
            return prev;
          }
          const nextEvent = events[prev.currentEventIndex];
          const nextState = executionReducer(prev, nextEvent);
          setHistory(h => [...h, prev]);
          return nextState;
        });
      }, 800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, events]);

  const stepForward = () => {
    if (state.currentEventIndex < events.length) {
      const nextEvent = events[state.currentEventIndex];
      const nextState = executionReducer(state, nextEvent);
      setHistory(prev => [...prev, state]);
      setState(nextState);
    }
  };

  const stepBackward = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setState(prev);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setHistory([]);
    setState(createInitialProgramState(events.length));
  };

  const codeLines = widget.code.split('\n');
  const variables = Object.values(state.variables);

  return (
    <div className="my-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white font-mono">{widget.title}</span>
        </div>
        <Link
          href={`/lab`}
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
        >
          <span>Open in Full Lab</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Split Code & Live State */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Left: Code Snippet with executing line highlight */}
        <div className="md:col-span-7 p-4 bg-[#070B12] font-mono text-xs overflow-x-auto">
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrentLine = state.currentLine === lineNum;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                  isCurrentLine
                    ? 'bg-cyan-950/70 border-l-2 border-cyan-400 text-cyan-200'
                    : 'text-slate-300 hover:bg-slate-900/40'
                }`}
              >
                <span className={`w-5 text-right select-none ${isCurrentLine ? 'text-cyan-400 font-bold' : 'text-slate-600'}`}>
                  {lineNum}
                </span>
                <span className="whitespace-pre">{line}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Live Notional Machine State */}
        <div className="md:col-span-5 p-4 bg-slate-900/50 flex flex-col justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Memory Variables in Scope
            </span>
            {variables.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {variables.map(v => (
                  <div
                    key={v.name}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                      v.isUpdated
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500">{v.name}:</span>{' '}
                    <span className="font-bold text-white">{String(v.value ?? '—')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Variables will appear here as they are allocated.</p>
            )}

            {/* Terminal Mini Stdout */}
            {state.stdout && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1 font-mono">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  Terminal Output
                </span>
                <pre className="text-xs font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800 whitespace-pre-wrap">
                  {state.stdout}
                </pre>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                onClick={reset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={stepBackward}
                disabled={history.length === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/20 transition"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={stepForward}
                disabled={state.currentEventIndex >= events.length}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Step {state.currentEventIndex}/{events.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
