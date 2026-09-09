'use client';

import React, { useState } from 'react';
import { CURRICULUM_TOPICS } from '@/content/curriculum';
import { TopicCard } from '@/components/learn/TopicCard';
import { BookOpen, Sparkles, Clock, CheckCircle2, Layers } from 'lucide-react';

export default function LearnHubPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredTopics = CURRICULUM_TOPICS.filter(t => {
    if (selectedDifficulty === 'all') return true;
    return t.difficulty === selectedDifficulty;
  });

  const totalLessons = CURRICULUM_TOPICS.reduce((acc, t) => acc + t.lessons.length, 0);
  const totalMinutes = CURRICULUM_TOPICS.reduce((acc, t) => acc + t.estimatedMinutes, 0);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Header */}
      <div className="mb-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          ICS C Programming Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Interactive C Programming Lessons
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          A structured course designed for first-trimester novices. Learn C from the ground up with interactive step-through widgets, memory footprint diagrams, and comprehension quizzes.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            8 Core Modules
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            {totalLessons} Interactive Lessons
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            ~{Math.round(totalMinutes / 60)} Hours Total
          </span>
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {['all', 'novice', 'beginner', 'intermediate'].map(diff => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
              selectedDifficulty === diff
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {diff === 'all' ? 'All Modules (8)' : diff}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
