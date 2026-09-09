'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/types/curriculum';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ questions, onComplete }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });
    return {
      correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (onComplete) {
      onComplete(score.percentage);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);
  const score = isSubmitted ? calculateScore() : null;

  return (
    <div className="my-10 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Comprehension Check</h3>
        </div>
        {isSubmitted && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        )}
      </div>

      <div className="space-y-8">
        {questions.map((q, qIdx) => {
          const selectedOpt = userAnswers[q.id];
          const isQuestionCorrect = isSubmitted && selectedOpt === q.correctOptionIndex;

          return (
            <div key={q.id} className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-200">
                <span className="text-cyan-400 font-mono mr-2">Q{qIdx + 1}.</span>
                {q.question}
              </h4>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOpt === optIdx;
                  const isCorrectAnswer = q.correctOptionIndex === optIdx;

                  let optStyles = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/80';
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optStyles = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrectAnswer) {
                      optStyles = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    } else {
                      optStyles = 'bg-slate-950/50 border-slate-900 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optStyles = 'bg-cyan-950/50 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${optStyles}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Post-submission explanation */}
              {isSubmitted && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isQuestionCorrect
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                }`}>
                  <strong>{isQuestionCorrect ? 'Correct!' : 'Incorrect.'}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions & Score */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            Check Quiz Answers
          </button>
        ) : (
          score && (
            <div className={`px-4 py-2 rounded-xl border text-sm font-bold ${
              score.percentage >= 70
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                : 'bg-amber-950/80 border-amber-600 text-amber-300'
            }`}>
              Score: {score.percentage}% ({score.correctCount}/{score.total} Correct)
            </div>
          )
        )}
      </div>
    </div>
  );
};
