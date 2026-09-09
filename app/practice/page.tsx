'use client';

import React, { useState } from 'react';
import { PRACTICE_EXERCISES } from '@/lib/practice/practice-data';
import { PracticeCard } from '@/components/practice/PracticeCard';
import { PracticeCategory } from '@/types/practice';
import { Target, Table, Terminal, Bug, Search, Sparkles } from 'lucide-react';

export default function PracticeHubPage() {
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = PRACTICE_EXERCISES.filter(ex => {
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const traceTableCount = PRACTICE_EXERCISES.filter(e => e.category === 'trace-table').length;
  const predictOutputCount = PRACTICE_EXERCISES.filter(e => e.category === 'predict-output').length;
  const spotBugCount = PRACTICE_EXERCISES.filter(e => e.category === 'spot-the-bug').length;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Hero Section */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          CS Pedagogy: Active Mental Execution
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Manual Tracing & Practice Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Stop guessing what your code will do. Master the <strong className="text-cyan-300 font-semibold">Notional Machine</strong> by
          manually tracing variable transformations step-by-step, predicting output, and hunting down sneaky novice bugs.
        </p>
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4" />
            All ({PRACTICE_EXERCISES.length})
          </button>

          <button
            onClick={() => setSelectedCategory('trace-table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'trace-table'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Table className="w-4 h-4" />
            Trace Tables ({traceTableCount})
          </button>

          <button
            onClick={() => setSelectedCategory('predict-output')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'predict-output'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Predict Output ({predictOutputCount})
          </button>

          <button
            onClick={() => setSelectedCategory('spot-the-bug')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'spot-the-bug'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bug className="w-4 h-4" />
            Spot the Bug ({spotBugCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts or titles..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white placeholder-slate-500 rounded-xl text-xs font-medium outline-none transition"
          />
        </div>
      </div>

      {/* Exercises Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(ex => (
            <PracticeCard key={ex.id} exercise={ex} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No exercises found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category or clear your search term.</p>
        </div>
      )}
    </div>
  );
}
