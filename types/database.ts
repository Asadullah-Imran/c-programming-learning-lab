// ==============================================================================
// ICS C Programming Learning Lab — Database TypeScript Type Contracts
// ==============================================================================

export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  xp: number;
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface UserProgressRecord {
  id: string;
  userId: string;
  lessonId: string;
  topicId: string;
  isCompleted: boolean;
  quizScore: number;
  quizMaxScore: number;
  completedAt?: string;
  updatedAt: string;
}

export interface UserSubmissionRecord {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseType: 'trace_table' | 'predict_output' | 'code_correction' | 'fill_blank';
  isCorrect: boolean;
  score: number;
  submittedData: any;
  feedback?: string;
  createdAt: string;
}

export interface TopicMastery {
  topicId: string;
  topicTitle: string;
  topicSlug: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  averageQuizScore: number;
}

export interface StudentDashboardStats {
  user: UserProfile;
  totalXp: number;
  streakDays: number;
  overallCoursePercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  totalPracticeSolved: number;
  practiceAccuracyRate: number;
  topicMasteries: TopicMastery[];
  recentSubmissions: UserSubmissionRecord[];
  nextRecommendedLesson: {
    topicSlug: string;
    lessonSlug: string;
    title: string;
    topicTitle: string;
  } | null;
}
