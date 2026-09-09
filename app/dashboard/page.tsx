'use client';

// ==============================================================================
// ICS C Programming Learning Lab — Student Dashboard Page
// ==============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateDashboardStats, getStoredUser } from '@/lib/db/supabase';
import { StudentDashboardStats } from '@/types/database';
import {
  ProgressHeroBanner,
  KeyMetricsGrid,
  NextLessonCard,
  TopicMasteryMatrix,
  RecentActivityFeed,
} from '@/components/dashboard/ProgressCards';
import { Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);

  useEffect(() => {
    // Read stats from storage/database
    const initialStats = calculateDashboardStats();
    setStats(initialStats);
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading student learning stats...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero Welcome Banner */}
        <ProgressHeroBanner stats={stats} />

        {/* Quick Nav Shortcut Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ready for today&apos;s session? Continue where you left off or run custom C code.</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/lab"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open Code Lab</span>
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Practice Problems</span>
            </Link>
          </div>
        </div>

        {/* Key Gamification & Learning Metrics */}
        <KeyMetricsGrid stats={stats} />

        {/* Next Recommended Step */}
        <NextLessonCard nextLesson={stats.nextRecommendedLesson} />

        {/* Grid: 8-Module Mastery Matrix & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TopicMasteryMatrix masteries={stats.topicMasteries} />
          </div>
          <div>
            <RecentActivityFeed submissions={stats.recentSubmissions} />
          </div>
        </div>
      </div>
    </div>
  );
}
