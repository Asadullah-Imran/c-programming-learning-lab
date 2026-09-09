/**
 * Curriculum & Lesson Type Definitions
 * Covers 8 Core Introductory C Syllabus Modules.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface EmbeddedSnippet {
  code: string;
  scenarioId?: string;
  title: string;
  description: string;
  initialVariables?: Record<string, { type: string; value: string | number }>;
}

export interface LessonSection {
  title: string;
  content: string; // Formatted markdown/text
  mentalModelTip?: string;
  commonNoviceMistake?: string;
  codeSnippet?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  topicSlug: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  sections: LessonSection[];
  interactiveWidget?: EmbeddedSnippet;
  quiz?: QuizQuestion[];
  relatedPracticeId?: string;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  estimatedMinutes: number;
  order: number;
}

export interface Topic {
  id: string;
  slug: string;
  moduleNumber: number;
  title: string;
  tagline: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'novice' | 'beginner' | 'intermediate';
  icon: string; // e.g. "Cpu", "Database", "GitBranch", "Layers", "Code2"
  lessons: Lesson[];
}
