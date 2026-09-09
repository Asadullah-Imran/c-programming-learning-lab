/**
 * Practice Engine Type Definitions
 * Covers Manual Trace Tables, Predict Output, and Spot the Bug exercises.
 */

export type PracticeCategory = 'trace-table' | 'predict-output' | 'spot-the-bug';
export type DifficultyLevel = 'novice' | 'beginner' | 'intermediate';

export interface BaseExercise {
  id: string;
  title: string;
  category: PracticeCategory;
  difficulty: DifficultyLevel;
  description: string;
  concept: string; // e.g. "Variable Mutation", "Loops", "Conditions", "Operators"
  code: string;
  hints: string[];
  explanation: string;
  timeEstimateMinutes: number;
}

// 1. Manual Trace Table Problem
export interface TraceTableRow {
  stepIndex: number;
  line: number;
  statement: string;
  // Map of variable name to expected ground-truth string value
  expectedValues: Record<string, string>;
  explanation?: string;
}

export interface TraceTableProblem extends BaseExercise {
  category: 'trace-table';
  trackedVariables: Array<{
    name: string;
    type: string;
    initialValue?: string;
  }>;
  rows: TraceTableRow[];
}

// 2. Predict Output Problem
export interface PredictOutputProblem extends BaseExercise {
  category: 'predict-output';
  expectedStdout: string;
  options?: string[]; // Multiple-choice options if provided
  inputStdin?: string;
}

// 3. Spot the Bug Problem
export interface CodeCorrectionProblem extends BaseExercise {
  category: 'spot-the-bug';
  buggyLineNumber: number;
  bugType: 'syntax' | 'semantic' | 'runtime' | 'logic';
  bugExplanation: string;
  correctReplacement: string;
  options?: Array<{
    lineNumber: number;
    replacement: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

export type PracticeExercise = TraceTableProblem | PredictOutputProblem | CodeCorrectionProblem;

// User Submissions & Evaluator Results
export interface TraceRowSubmission {
  stepIndex: number;
  values: Record<string, string>;
}

export interface TraceTableEvaluation {
  isCorrect: boolean;
  score: number; // 0 to 100
  totalCells: number;
  correctCells: number;
  cellResults: Record<number, Record<string, {
    isCorrect: boolean;
    expected: string;
    entered: string;
  }>>;
  firstDivergence?: {
    stepIndex: number;
    line: number;
    variable: string;
    entered: string;
    expected: string;
    hint: string;
  };
}

export interface PredictOutputEvaluation {
  isCorrect: boolean;
  score: number;
  entered: string;
  expected: string;
  feedback: string;
}

export interface CodeCorrectionEvaluation {
  isCorrect: boolean;
  score: number;
  selectedLine: number;
  selectedReplacement?: string;
  feedback: string;
}

export type ExerciseEvaluation =
  | { type: 'trace-table'; result: TraceTableEvaluation }
  | { type: 'predict-output'; result: PredictOutputEvaluation }
  | { type: 'spot-the-bug'; result: CodeCorrectionEvaluation };
