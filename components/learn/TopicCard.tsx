'use client';

import React from 'react';
import { Topic } from '@/types/curriculum';
import { Cpu, Database, GitBranch, Layers, Sparkles, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const getIcon = () => {
    switch (topic.icon) {
      case 'Cpu': return Cpu;
      case 'Database': return Database;
      case 'GitBranch': return GitBranch;
      case 'Layers': return Layers;
      case 'Sparkles': return Sparkles;
      default: return BookOpen;
    }
  };

  const Icon = getIcon();

  const getDifficultyColor = () => {
    switch (topic.difficulty) {
      case 'novice': return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'beginner': return 'text-sky-400 bg-sky-950/40 border-sky-800/40';
      case 'intermediate': return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
    }
  };

  const firstLesson = topic.lessons[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl flex flex-col justify-between relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 font-mono">
            <Icon className="w-3.5 h-3.5" />
            Module 0{topic.moduleNumber}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getDifficultyColor()}`}>
            {topic.difficulty}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-cyan-300 transition">
          {topic.title}
        </h3>
        <p className="text-xs text-cyan-400/80 font-medium mb-3">
          {topic.tagline}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {topic.description}
        </p>

        {/* Lesson List Preview */}
        <div className="space-y-1.5 mb-5 pt-3 border-t border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Lessons in this module:
          </span>
          {topic.lessons.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/learn/${topic.slug}/${lesson.slug}`}
              className="flex items-center justify-between text-xs text-slate-300 hover:text-cyan-300 p-1.5 rounded-lg hover:bg-slate-800/60 transition group/item"
            >
              <span className="truncate pr-2">
                <span className="text-slate-500 font-mono mr-1.5">{idx + 1}.</span>
                {lesson.title}
              </span>
              <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                ~{lesson.estimatedMinutes}m
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          ~{topic.estimatedMinutes} mins total
        </div>

        {firstLesson && (
          <Link
            href={`/learn/${topic.slug}/${firstLesson.slug}`}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-3.5 py-2 rounded-xl shadow-md shadow-cyan-500/20 transition transform active:scale-95"
          >
            Start Module
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
