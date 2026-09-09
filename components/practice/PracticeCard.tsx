'use client';

import React from 'react';
import { PracticeExercise } from '@/types/practice';
import { Table, Terminal, Bug, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface PracticeCardProps {
  exercise: PracticeExercise;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ exercise }) => {
  const getCategoryMeta = () => {
    switch (exercise.category) {
      case 'trace-table':
        return {
          label: 'Trace Table',
          icon: Table,
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
          hoverBorder: 'hover:border-emerald-500/50',
          gradient: 'from-emerald-500/10 to-transparent'
        };
      case 'predict-output':
        return {
          label: 'Predict Output',
          icon: Terminal,
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
          hoverBorder: 'hover:border-cyan-500/50',
          gradient: 'from-cyan-500/10 to-transparent'
        };
      case 'spot-the-bug':
        return {
          label: 'Spot the Bug',
          icon: Bug,
          color: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
          hoverBorder: 'hover:border-rose-500/50',
          gradient: 'from-rose-500/10 to-transparent'
        };
    }
  };

  const getDifficultyColor = () => {
    switch (exercise.difficulty) {
      case 'novice':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'beginner':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
      case 'intermediate':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    }
  };

  const meta = getCategoryMeta();
  const Icon = meta.icon;

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${meta.hoverBorder}`}>
      {/* Background Accent Glow */}
      <div className={`absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br ${meta.gradient} rounded-full blur-2xl pointer-events-none`} />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${meta.color}`}>
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getDifficultyColor()}`}>
            {exercise.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">
          {exercise.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {exercise.description}
        </p>
      </div>

      {/* Footer Meta & Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            ~{exercise.timeEstimateMinutes} min
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 font-medium">{exercise.concept}</span>
        </div>

        <Link
          href={`/practice/solve/${exercise.id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 transition"
        >
          Solve
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
