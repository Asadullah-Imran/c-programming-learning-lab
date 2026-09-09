'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { getLessonBySlug, CURRICULUM_TOPICS } from '@/content/curriculum';
import { LessonSidebar } from '@/components/learn/LessonSidebar';
import { EmbeddedVisualizerWidget } from '@/components/learn/EmbeddedVisualizerWidget';
import { LessonQuiz } from '@/components/learn/LessonQuiz';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Lightbulb, AlertTriangle, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LessonViewerPage() {
  const params = useParams();
  const topicSlug = params?.topicSlug as string;
  const lessonSlug = params?.lessonSlug as string;

  const result = getLessonBySlug(topicSlug, lessonSlug);

  if (!result) {
    notFound();
  }

  const { topic, lesson } = result;

  // Flatten lessons to find previous & next lessons
  const allLessons: Array<{ topicSlug: string; lessonSlug: string; title: string }> = [];
  CURRICULUM_TOPICS.forEach(t => {
    t.lessons.forEach(l => {
      allLessons.push({ topicSlug: t.slug, lessonSlug: l.slug, title: l.title });
    });
  });

  const currentIndex = allLessons.findIndex(
    item => item.topicSlug === topicSlug && item.lessonSlug === lessonSlug
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/learn" className="text-slate-400 hover:text-white transition">
            Learn
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-cyan-400 font-mono">Module 0{topic.moduleNumber}</span>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold truncate max-w-xs">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            ~{lesson.estimatedMinutes} mins
          </span>

          <Link
            href="/lab"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/60 hover:bg-cyan-900/60 px-3 py-1.5 rounded-lg border border-cyan-800/80 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            Open Visual Lab
          </Link>
        </div>
      </div>

      {/* Main Layout Grid: Sidebar + Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <LessonSidebar
            currentTopicSlug={topicSlug}
            currentLessonSlug={lessonSlug}
          />
        </div>

        {/* Right Article Content */}
        <article className="lg:col-span-8 xl:col-span-9 space-y-8">
          {/* Lesson Title Banner */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-full font-mono">
              Lesson 0{lesson.order}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              {lesson.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {lesson.description}
            </p>
          </div>

          {/* Formatted Content Sections */}
          <div className="space-y-8">
            {lesson.sections.map((section, sIdx) => (
              <section
                key={sIdx}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4"
              >
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {section.title}
                </h2>

                <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
                  {section.content}
                </div>

                {/* Code Snippet if provided */}
                {section.codeSnippet && (
                  <div className="my-4 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                    <div className="bg-slate-900 px-4 py-2 text-[11px] text-slate-400 border-b border-slate-800 flex items-center justify-between">
                      <span>example.c</span>
                      <span className="text-slate-600">C99</span>
                    </div>
                    <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed">
                      <code>{section.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Mental Model Tip Callout */}
                {section.mentalModelTip && (
                  <div className="mt-4 bg-cyan-950/30 border border-cyan-800/60 rounded-xl p-4 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                        Mental Model Key
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {section.mentalModelTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Common Novice Mistake Callout */}
                {section.commonNoviceMistake && (
                  <div className="mt-4 bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                        Common Novice Mistake
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {section.commonNoviceMistake}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Embedded Step-Through Visualizer Widget */}
          {lesson.interactiveWidget && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Interactive Visual Execution Widget
                </h3>
              </div>
              <EmbeddedVisualizerWidget widget={lesson.interactiveWidget} />
            </div>
          )}

          {/* Comprehension Quiz */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <LessonQuiz questions={lesson.quiz} />
          )}

          {/* Related Practice Worksheet Link */}
          {lesson.relatedPracticeId && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/40 to-slate-900 border border-emerald-800/50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Recommended Practice
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  Ready to test your mental execution skills?
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Solve the manual trace worksheet created for this topic.
                </p>
              </div>

              <Link
                href={`/practice/solve/${lesson.relatedPracticeId}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
              >
                <span>Solve Trace Worksheet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Bottom Pagination Footer */}
          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {prevLesson ? (
              <Link
                href={`/learn/${prevLesson.topicSlug}/${prevLesson.lessonSlug}`}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: {prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.topicSlug}/${nextLesson.lessonSlug}`}
                className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition"
              >
                <span>Next: {nextLesson.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/practice"
                className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition"
              >
                <span>Complete Course: Go to Practice Lab</span>
                <CheckCircle2 className="w-4 h-4" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
