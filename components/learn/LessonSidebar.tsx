'use client';

import React from 'react';
import { Topic, Lesson } from '@/types/curriculum';
import { CURRICULUM_TOPICS } from '@/content/curriculum';
import { BookOpen, CheckCircle2, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface LessonSidebarProps {
  currentTopicSlug: string;
  currentLessonSlug: string;
}

export const LessonSidebar: React.FC<LessonSidebarProps> = ({
  currentTopicSlug,
  currentLessonSlug,
}) => {
  return (
    <aside className="w-full lg:w-80 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <BookOpen className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Course Syllabus
        </h3>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-14rem)] pr-1">
        {CURRICULUM_TOPICS.map((topic) => {
          const isCurrentTopic = topic.slug === currentTopicSlug;

          return (
            <div key={topic.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2 py-1">
                <span className="text-cyan-400 font-mono text-[11px]">
                  M0{topic.moduleNumber}
                </span>
                <span className="truncate ml-1.5 flex-1 text-slate-200 font-sans">
                  {topic.title}
                </span>
              </div>

              <div className="pl-3 space-y-1 border-l border-slate-800 ml-2">
                {topic.lessons.map((lesson, idx) => {
                  const isCurrentLesson =
                    isCurrentTopic && lesson.slug === currentLessonSlug;

                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${topic.slug}/${lesson.slug}`}
                      className={`flex items-center justify-between text-xs p-2 rounded-xl transition ${
                        isCurrentLesson
                          ? 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-semibold shadow-sm shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate pr-2">
                        <span className="font-mono text-[10px] text-slate-500 mr-1.5">
                          {idx + 1}.
                        </span>
                        {lesson.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 flex-shrink-0">
                        {lesson.estimatedMinutes}m
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
