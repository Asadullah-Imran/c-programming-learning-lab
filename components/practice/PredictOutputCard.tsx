'use client';

import React, { useState } from 'react';
import { PredictOutputProblem, PredictOutputEvaluation } from '@/types/practice';
import { evaluatePredictOutput } from '@/lib/practice/evaluator';
import { Terminal, CheckCircle2, XCircle, Sparkles, HelpCircle, Code2 } from 'lucide-react';
import Link from 'next/link';

interface PredictOutputCardProps {
  problem: PredictOutputProblem;
  onSuccess?: () => void;
}

export const PredictOutputCard: React.FC<PredictOutputCardProps> = ({ problem, onSuccess }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [evaluation, setEvaluation] = useState<PredictOutputEvaluation | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);

  const handleSubmit = (valueToSubmit: string) => {
    const result = evaluatePredictOutput(problem, valueToSubmit);
    setEvaluation(result);
    if (result.isCorrect && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
              Output Prediction Challenge
            </span>
            <h2 className="text-xl font-bold text-white mt-1.5">{problem.title}</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {problem.concept}
          </span>
        </div>
        <p className="text-sm text-slate-300">{problem.description}</p>
      </div>

      {/* Code & Prediction Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Snippet */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300 font-mono">program.c</span>
            </div>
            <span className="text-[11px] text-slate-500 font-sans">Read carefully before answering</span>
          </div>
          <pre className="p-4 font-mono text-sm text-slate-200 overflow-x-auto leading-relaxed flex-1">
            <code>{problem.code}</code>
          </pre>
        </div>

        {/* Right: Interactive Terminal / Option Selector */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between flex-1 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">What will this program print?</h3>
              </div>

              {/* Multiple Choice Options */}
              {problem.options && problem.options.length > 0 ? (
                <div className="space-y-2.5">
                  {problem.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedOption(opt);
                          setEvaluation(null);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border font-mono text-sm transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center">
                          {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Free Text Input */
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Type predicted stdout:</label>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      setEvaluation(null);
                    }}
                    placeholder="e.g. 3 rem 2"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 text-white p-3 rounded-xl font-mono text-sm outline-none"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                onClick={() => handleSubmit(problem.options ? selectedOption : customInput)}
                disabled={problem.options ? !selectedOption : !customInput.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                Submit Prediction
              </button>

              <Link
                href={`/lab`}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Open in Code Lab"
              >
                <Code2 className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {evaluation && (
        <div className={`p-5 rounded-xl border shadow-xl flex items-start gap-4 ${
          evaluation.isCorrect
            ? 'bg-emerald-950/40 border-emerald-600/70'
            : 'bg-rose-950/40 border-rose-600/70'
        }`}>
          {evaluation.isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className={`text-base font-bold ${
              evaluation.isCorrect ? 'text-emerald-300' : 'text-rose-300'
            }`}>
              {evaluation.isCorrect ? 'Correct Prediction! 🎉' : 'Incorrect Output'}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{evaluation.feedback}</p>
          </div>
        </div>
      )}

      {/* Hints Accordion */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <button
          onClick={() => setShowHints(!showHints)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Need a clue? Click to {showHints ? 'hide' : 'view'} hints ({problem.hints.length})
          </span>
          <span className="text-cyan-400">{showHints ? '▲' : '▼'}</span>
        </button>
        {showHints && (
          <div className="mt-3 space-y-2 pt-3 border-t border-slate-800">
            {problem.hints.map((hint, idx) => (
              <div key={idx} className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
                <span className="text-cyan-400 font-bold">#{idx + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
