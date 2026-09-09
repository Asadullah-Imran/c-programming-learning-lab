'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { getExerciseById, PRACTICE_EXERCISES } from '@/lib/practice/practice-data';
import { TraceTable } from '@/components/practice/TraceTable';
import { PredictOutputCard } from '@/components/practice/PredictOutputCard';
import { CodeCorrectionCard } from '@/components/practice/CodeCorrectionCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PracticeSolverPage() {
  const params = useParams();
  const id = params?.id as string;
  const exercise = getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  // Find next exercise for smooth progression
  const currentIndex = PRACTICE_EXERCISES.findIndex(e => e.id === id);
  const nextExercise = currentIndex >= 0 && currentIndex < PRACTICE_EXERCISES.length - 1
    ? PRACTICE_EXERCISES[currentIndex + 1]
    : null;

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/practice"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Practice Hub
        </Link>

        {nextExercise && (
          <Link
            href={`/practice/solve/${nextExercise.id}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition"
          >
            Next: <span className="font-semibold text-slate-200">{nextExercise.title}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Dynamic Exercise Component Renderer */}
      {exercise.category === 'trace-table' && (
        <TraceTable problem={exercise} />
      )}

      {exercise.category === 'predict-output' && (
        <PredictOutputCard problem={exercise} />
      )}

      {exercise.category === 'spot-the-bug' && (
        <CodeCorrectionCard problem={exercise} />
      )}
    </div>
  );
}
