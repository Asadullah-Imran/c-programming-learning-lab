// ==============================================================================
// ICS C Programming Learning Lab — Supabase Client & Persistence Bridge
// ==============================================================================
// Architecture:
// 1. Production Mode: Connects to Supabase with NEXT_PUBLIC_SUPABASE_URL & ANON_KEY.
// 2. Resilient Offline/Local Mode: If Supabase credentials are not provided,
//    transparently persists progress, submissions, and XP in browser localStorage/mock
//    so that students and evaluators can immediately test all dashboard features!
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserProgressRecord, UserSubmissionRecord, StudentDashboardStats, TopicMastery } from '@/types/database';
import { CURRICULUM_TOPICS } from '@/content/curriculum';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://your-project.supabase.co'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ==============================================================================
// Mock / Local Storage Storage Keys & Default Demo User
// ==============================================================================
const STORAGE_KEYS = {
  USER_PROFILE: 'ics_c_lab_user_profile',
  PROGRESS: 'ics_c_lab_user_progress',
  SUBMISSIONS: 'ics_c_lab_user_submissions',
};

export const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr_demo_novice_001',
  email: 'student@lab.ics.edu',
  fullName: 'Novice C Explorer',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Explorer',
  role: 'student',
  xp: 420,
  streakCount: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
};

// Initial seeded progress for immediate rich dashboard demo
export const DEFAULT_SEED_PROGRESS: UserProgressRecord[] = [
  {
    id: 'prog_001',
    userId: 'usr_demo_novice_001',
    lessonId: 'lesson-01-01',
    topicId: 'topic-01',
    isCompleted: true,
    quizScore: 2,
    quizMaxScore: 2,
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prog_002',
    userId: 'usr_demo_novice_001',
    lessonId: 'lesson-01-02',
    topicId: 'topic-01',
    isCompleted: true,
    quizScore: 2,
    quizMaxScore: 2,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prog_003',
    userId: 'usr_demo_novice_001',
    lessonId: 'lesson-02-01',
    topicId: 'topic-02',
    isCompleted: true,
    quizScore: 2,
    quizMaxScore: 2,
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SEED_SUBMISSIONS: UserSubmissionRecord[] = [
  {
    id: 'sub_001',
    userId: 'usr_demo_novice_001',
    exerciseId: 'ex_trace_01',
    exerciseType: 'trace_table',
    isCorrect: true,
    score: 100,
    submittedData: { topic: 'Variable Mutation Trace' },
    feedback: 'All predicted memory states match ground truth!',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'sub_002',
    userId: 'usr_demo_novice_001',
    exerciseId: 'ex_predict_01',
    exerciseType: 'predict_output',
    isCorrect: true,
    score: 100,
    submittedData: { chosenOption: 'a = 15, b = 15' },
    feedback: 'Correct! Memory value was copied before addition.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// ==============================================================================
// Service Helpers (Local Storage + Supabase fallback)
// ==============================================================================

export function getStoredUser(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_DEMO_USER;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEMO_USER;
  }
}

export function saveStoredUser(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

export function getStoredProgress(): UserProgressRecord[] {
  if (typeof window === 'undefined') return DEFAULT_SEED_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEFAULT_SEED_PROGRESS));
      return DEFAULT_SEED_PROGRESS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SEED_PROGRESS;
  }
}

export function getStoredSubmissions(): UserSubmissionRecord[] {
  if (typeof window === 'undefined') return DEFAULT_SEED_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(DEFAULT_SEED_SUBMISSIONS));
      return DEFAULT_SEED_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SEED_SUBMISSIONS;
  }
}

export function recordLessonCompletion(
  topicId: string,
  lessonId: string,
  quizScore: number,
  quizMaxScore: number
): void {
  if (typeof window === 'undefined') return;
  try {
    const progressList = getStoredProgress();
    const existingIndex = progressList.findIndex((p) => p.lessonId === lessonId);
    
    const record: UserProgressRecord = {
      id: `prog_${Date.now()}`,
      userId: getStoredUser().id,
      lessonId,
      topicId,
      isCompleted: true,
      quizScore,
      quizMaxScore,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      progressList[existingIndex] = { ...progressList[existingIndex], ...record };
    } else {
      progressList.push(record);
    }

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressList));

    // Award XP and update streak
    const user = getStoredUser();
    const xpGained = quizScore * 25 + 50; // 50 XP base + 25 per quiz answer
    user.xp = (user.xp || 0) + xpGained;
    saveStoredUser(user);
  } catch (e) {
    console.error('Failed to record lesson completion:', e);
  }
}

export function recordSubmission(
  exerciseId: string,
  exerciseType: UserSubmissionRecord['exerciseType'],
  isCorrect: boolean,
  score: number,
  submittedData: any,
  feedback?: string
): void {
  if (typeof window === 'undefined') return;
  try {
    const submissions = getStoredSubmissions();
    const submission: UserSubmissionRecord = {
      id: `sub_${Date.now()}`,
      userId: getStoredUser().id,
      exerciseId,
      exerciseType,
      isCorrect,
      score,
      submittedData,
      feedback,
      createdAt: new Date().toISOString(),
    };
    submissions.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    if (isCorrect) {
      const user = getStoredUser();
      user.xp = (user.xp || 0) + score;
      saveStoredUser(user);
    }
  } catch (e) {
    console.error('Failed to record submission:', e);
  }
}

export function calculateDashboardStats(): StudentDashboardStats {
  const user = getStoredUser();
  const progressList = getStoredProgress();
  const submissions = getStoredSubmissions();

  // Aggregate all lessons across curriculum modules
  let totalLessonsCount = 0;
  const allLessonsFlat: { topicSlug: string; lessonSlug: string; title: string; topicTitle: string; id: string }[] = [];

  const topicMasteries: TopicMastery[] = CURRICULUM_TOPICS.map((module) => {
    totalLessonsCount += module.lessons.length;
    module.lessons.forEach((l) => {
      allLessonsFlat.push({
        topicSlug: module.slug,
        lessonSlug: l.slug,
        title: l.title,
        topicTitle: module.title,
        id: l.id,
      });
    });

    const completedInTopic = progressList.filter(
      (p) => p.topicId === module.id && p.isCompleted
    );

    const completedCount = completedInTopic.length;
    const percentage = module.lessons.length > 0
      ? Math.round((completedCount / module.lessons.length) * 100)
      : 0;

    const totalQuizScore = completedInTopic.reduce((acc, curr) => acc + (curr.quizScore || 0), 0);
    const totalQuizMax = completedInTopic.reduce((acc, curr) => acc + (curr.quizMaxScore || 0), 0);
    const averageQuizScore = totalQuizMax > 0 ? Math.round((totalQuizScore / totalQuizMax) * 100) : 100;

    return {
      topicId: module.id,
      topicTitle: module.title,
      topicSlug: module.slug,
      totalLessons: module.lessons.length,
      completedLessons: completedCount,
      percentage,
      averageQuizScore,
    };
  });

  const completedLessonsCount = progressList.filter((p) => p.isCompleted).length;
  const overallCoursePercentage = totalLessonsCount > 0
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
    : 0;

  const totalPracticeSolved = submissions.filter((s) => s.isCorrect).length;
  const practiceAccuracyRate = submissions.length > 0
    ? Math.round((totalPracticeSolved / submissions.length) * 100)
    : 0;

  // Find next recommended lesson (first uncompleted lesson)
  const completedLessonIds = new Set(progressList.filter((p) => p.isCompleted).map((p) => p.lessonId));
  const nextLesson = allLessonsFlat.find((l) => !completedLessonIds.has(l.id)) || allLessonsFlat[0] || null;

  return {
    user,
    totalXp: user.xp,
    streakDays: user.streakCount,
    overallCoursePercentage,
    completedLessonsCount,
    totalLessonsCount,
    totalPracticeSolved,
    practiceAccuracyRate,
    topicMasteries,
    recentSubmissions: submissions.slice(0, 5),
    nextRecommendedLesson: nextLesson,
  };
}
