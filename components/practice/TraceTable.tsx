'use client';

import React, { useState } from 'react';
import { TraceTableProblem, TraceTableEvaluation } from '@/types/practice';
import { evaluateTraceTable } from '@/lib/practice/evaluator';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Sparkles, Code2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TraceTableProps {
  problem: TraceTableProblem;
  onSuccess?: () => void;
}

export const TraceTable: React.FC<TraceTableProps> = ({ problem, onSuccess }) => {
  // State: user input values keyed by [stepIndex][varName]
  const [userValues, setUserValues] = useState<Record<number, Record<string, string>>>(() => {
    const initial: Record<number, Record<string, string>> = {};
    problem.rows.forEach(r => {
      initial[r.stepIndex] = {};
      problem.trackedVariables.forEach(v => {
        initial[r.stepIndex][v.name] = '';
      });
    });
    return initial;
  });

  const [evaluation, setEvaluation] = useState<TraceTableEvaluation | null>(null);
  const [revealedHintIndex, setRevealedHintIndex] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleInputChange = (stepIndex: number, varName: string, val: string) => {
    setUserValues(prev => ({
      ...prev,
      [stepIndex]: {
        ...prev[stepIndex],
        [varName]: val
      }
    }));
    // Clear evaluation on edit to encourage re-checking
    if (evaluation) {
      setEvaluation(null);
    }
  };

  const handleCheck = () => {
    const submissions = problem.rows.map(r => ({
      stepIndex: r.stepIndex,
      values: userValues[r.stepIndex] || {}
    }));
    const result = evaluateTraceTable(problem, submissions);
    setEvaluation(result);
    if (result.isCorrect && onSuccess) {
      onSuccess();
    }
  };

  const handleReset = () => {
    const initial: Record<number, Record<string, string>> = {};
    problem.rows.forEach(r => {
      initial[r.stepIndex] = {};
      problem.trackedVariables.forEach(v => {
        initial[r.stepIndex][v.name] = '';
      });
    });
    setUserValues(initial);
    setEvaluation(null);
    setActiveStep(0);
  };

  const handleFillExpected = () => {
    const filled: Record<number, Record<string, string>> = {};
    problem.rows.forEach(r => {
      filled[r.stepIndex] = { ...r.expectedValues };
    });
    setUserValues(filled);
    setEvaluation(null);
  };

  return (
    <div className="space-y-6">
      {/* Instructions & Meta */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              Manual Trace Worksheet
            </span>
            <h2 className="text-xl font-bold text-white mt-1.5">{problem.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFillExpected}
              className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title="Reveal all values for studying"
            >
              Reveal Solution
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{problem.description}</p>
        <p className="text-xs text-slate-400 mt-2 italic">
          💡 Tip: Type &quot;—&quot; or leave blank if a variable has not been initialized yet.
        </p>
      </div>

      {/* Interactive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">Step</th>
                <th className="py-3 px-4 w-20 text-center">Line #</th>
                <th className="py-3 px-6 min-w-[240px]">Executing Statement</th>
                {problem.trackedVariables.map(v => (
                  <th key={v.name} className="py-3 px-4 min-w-[110px] text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-emerald-400 font-mono text-sm">{v.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal lowercase">{v.type}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-sm">
              {problem.rows.map((row, rIdx) => {
                const isCurrentActive = activeStep === rIdx;
                return (
                  <tr
                    key={row.stepIndex}
                    onClick={() => setActiveStep(rIdx)}
                    className={`transition-colors ${
                      isCurrentActive
                        ? 'bg-emerald-950/20 border-l-4 border-l-emerald-500'
                        : rIdx % 2 === 0
                        ? 'bg-slate-900/40 hover:bg-slate-800/40'
                        : 'bg-slate-900/80 hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Step Index */}
                    <td className="py-3 px-4 text-center text-xs text-slate-500 font-sans">
                      #{rIdx + 1}
                    </td>

                    {/* Line Number */}
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                        L{row.line}
                      </span>
                    </td>

                    {/* Statement */}
                    <td className="py-3 px-6 text-slate-200">
                      <code className="text-xs bg-slate-950/80 px-2 py-1 rounded text-emerald-300 border border-slate-800">
                        {row.statement}
                      </code>
                    </td>

                    {/* Variable Input Cells */}
                    {problem.trackedVariables.map(v => {
                      const cellEval = evaluation?.cellResults[row.stepIndex]?.[v.name];
                      const isCellCorrect = cellEval?.isCorrect;
                      const hasEval = evaluation !== null;
                      const currentVal = userValues[row.stepIndex]?.[v.name] || '';

                      return (
                        <td key={v.name} className="py-2.5 px-3 text-center">
                          <div className="relative inline-flex items-center justify-center">
                            <input
                              type="text"
                              value={currentVal}
                              onChange={(e) => handleInputChange(row.stepIndex, v.name, e.target.value)}
                              placeholder="—"
                              className={`w-20 text-center py-1.5 px-2 rounded-lg text-sm font-mono transition-all outline-none ${
                                hasEval
                                  ? isCellCorrect
                                    ? 'bg-emerald-950/50 border-2 border-emerald-500 text-emerald-300'
                                    : 'bg-rose-950/50 border-2 border-rose-500 text-rose-300'
                                  : 'bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white placeholder-slate-600'
                              }`}
                            />
                            {hasEval && (
                              <span className="absolute -right-5">
                                {isCellCorrect ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-rose-400" />
                                )}
                              </span>
                            )}
                          </div>
                          {hasEval && !isCellCorrect && (
                            <div className="text-[11px] text-rose-400 mt-1 font-sans">
                              exp: <span className="font-mono font-bold text-white">{cellEval?.expected}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Controls Footer */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheck}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Check Table Answers
            </button>

            <Link
              href={`/lab`}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              Open in Visual Lab
            </Link>
          </div>

          {evaluation && (
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${
                evaluation.isCorrect
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-600 text-amber-300'
              }`}>
                Score: {evaluation.score}% ({evaluation.correctCells}/{evaluation.totalCells} cells)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback & Divergence Alert */}
      {evaluation && (
        <div>
          {evaluation.isCorrect ? (
            <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-xl p-5 flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-emerald-300">Perfect Trace Execution! 🎉</h3>
                <p className="text-sm text-slate-300 mt-1">{problem.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-950/30 border border-amber-600/60 rounded-xl p-5 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-amber-300">Mental Model Divergence Detected</h3>
                {evaluation.firstDivergence && (
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {evaluation.firstDivergence.hint}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progressive Hints Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-200">Progressive Step Hints</h3>
          </div>
          {revealedHintIndex < problem.hints.length && (
            <button
              onClick={() => setRevealedHintIndex(prev => Math.min(prev + 1, problem.hints.length))}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              Reveal Hint ({revealedHintIndex + 1}/{problem.hints.length})
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {problem.hints.slice(0, revealedHintIndex).map((hint, idx) => (
            <div key={idx} className="text-xs text-slate-300 bg-slate-950/70 border border-slate-800/80 p-3 rounded-lg flex items-start gap-2.5">
              <span className="text-cyan-400 font-bold">#{idx + 1}</span>
              <p className="leading-relaxed">{hint}</p>
            </div>
          ))}
          {revealedHintIndex === 0 && (
            <p className="text-xs text-slate-500 italic">Click &quot;Reveal Hint&quot; if you get stuck on any step.</p>
          )}
        </div>
      </div>
    </div>
  );
};
