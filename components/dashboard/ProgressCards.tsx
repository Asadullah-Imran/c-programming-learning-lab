'use client';

// ==============================================================================
// ICS C Programming Learning Lab — Dashboard & Progress Visual Components
// ==============================================================================

import React from 'react';
import Link from 'next/link';
import { StudentDashboardStats, TopicMastery } from '@/types/database';
import {
  Trophy,
  Flame,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  Code2,
  Clock,
  Award,
  Zap,
} from 'lucide-react';

interface ProgressCardsProps {
  stats: StudentDashboardStats;
}

export const ProgressHeroBanner: React.FC<{ stats: StudentDashboardStats }> = ({ stats }) => {
  const { user, overallCoursePercentage, completedLessonsCount, totalLessonsCount } = stats;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/60 via-slate-900/80 to-slate-950 p-6 md:p-8 border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-bold text-indigo-300">
                {user.fullName.charAt(0)}
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
                Welcome back, {user.fullName}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Level 2 Explorer
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track your Notional Machine understanding, interactive trace worksheets, and C concept mastery.
            </p>
          </div>
        </div>

        {/* Progress pill widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 md:min-w-[240px] shrink-0">
          <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-2">
            <span>Course Progress</span>
            <span className="text-indigo-400 font-bold">{overallCoursePercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${overallCoursePercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
            <span>{completedLessonsCount} of {totalLessonsCount} lessons</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> On Track
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KeyMetricsGrid: React.FC<{ stats: StudentDashboardStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Metric 1: XP */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total XP</div>
          <div className="text-xl font-bold text-slate-100">{stats.totalXp} <span className="text-xs font-normal text-amber-400">pts</span></div>
        </div>
      </div>

      {/* Metric 2: Streak */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
          <Flame className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Day Streak</div>
          <div className="text-xl font-bold text-slate-100">{stats.streakDays} <span className="text-xs font-normal text-orange-400">days</span></div>
        </div>
      </div>

      {/* Metric 3: Lessons Completed */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Lessons Done</div>
          <div className="text-xl font-bold text-slate-100">{stats.completedLessonsCount} <span className="text-xs font-normal text-slate-500">/ {stats.totalLessonsCount}</span></div>
        </div>
      </div>

      {/* Metric 4: Practice Accuracy */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Accuracy</div>
          <div className="text-xl font-bold text-slate-100">{stats.practiceAccuracyRate}% <span className="text-xs font-normal text-indigo-400">accuracy</span></div>
        </div>
      </div>
    </div>
  );
};

export const NextLessonCard: React.FC<{ nextLesson: StudentDashboardStats['nextRecommendedLesson'] }> = ({
  nextLesson,
}) => {
  if (!nextLesson) return null;

  return (
    <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next Recommended Step
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-0.5">{nextLesson.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Module: {nextLesson.topicTitle}</p>
        </div>
      </div>

      <Link
        href={`/learn/${nextLesson.topicSlug}/${nextLesson.lessonSlug}`}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 shrink-0"
      >
        <span>Continue Learning</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export const TopicMasteryMatrix: React.FC<{ masteries: TopicMastery[] }> = ({ masteries }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Module Mastery Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Track your progress across the complete 8-topic C curriculum</p>
        </div>
        <Link href="/learn" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {masteries.map((m) => (
          <Link
            key={m.topicId}
            href={`/learn#${m.topicSlug}`}
            className="group block p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/60 transition-all"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200">
              <span className="truncate pr-2">{m.topicTitle}</span>
              <span className={m.percentage === 100 ? 'text-emerald-400' : 'text-indigo-400'}>
                {m.percentage}%
              </span>
            </div>
            
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  m.percentage === 100
                    ? 'bg-emerald-400'
                    : m.percentage > 0
                    ? 'bg-indigo-500'
                    : 'bg-transparent'
                }`}
                style={{ width: `${m.percentage}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
              <span>{m.completedLessons} / {m.totalLessons} lessons</span>
              {m.percentage === 100 && (
                <span className="text-emerald-400 font-semibold">Mastered</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const RecentActivityFeed: React.FC<{ submissions: StudentDashboardStats['recentSubmissions'] }> = ({
  submissions,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            Recent Practice Activity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Latest interactive trace worksheet and prediction attempts</p>
        </div>
        <Link href="/practice" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
          Open Practice Hub <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-sm">
          No practice exercises completed yet. Try solving a trace table!
        </div>
      ) : (
        <div className="space-y-2.5">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    s.isCorrect
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {s.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {s.exerciseType.replace('_', ' ').toUpperCase()} #{s.exerciseId}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {s.feedback || (s.isCorrect ? 'Completed with full score' : 'Practice attempted')}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-400">+{s.score} XP</span>
                <div className="text-[10px] text-slate-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
