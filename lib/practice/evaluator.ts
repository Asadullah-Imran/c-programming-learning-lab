import {
  TraceTableProblem,
  TraceRowSubmission,
  TraceTableEvaluation,
  PredictOutputProblem,
  PredictOutputEvaluation,
  CodeCorrectionProblem,
  CodeCorrectionEvaluation
} from '@/types/practice';

/**
 * Evaluates student manual trace table submissions against ground truth.
 */
export function evaluateTraceTable(
  problem: TraceTableProblem,
  userSubmissions: TraceRowSubmission[]
): TraceTableEvaluation {
  let totalCells = 0;
  let correctCells = 0;
  const cellResults: TraceTableEvaluation['cellResults'] = {};
  let firstDivergence: TraceTableEvaluation['firstDivergence'] = undefined;

  const userMap = new Map<number, Record<string, string>>();
  userSubmissions.forEach(sub => {
    userMap.set(sub.stepIndex, sub.values);
  });

  problem.rows.forEach((row) => {
    const userValues = userMap.get(row.stepIndex) || {};
    cellResults[row.stepIndex] = {};

    problem.trackedVariables.forEach((v) => {
      totalCells++;
      const expected = (row.expectedValues[v.name] || '—').trim();
      const enteredRaw = (userValues[v.name] || '').trim();
      const entered = enteredRaw === '' ? '—' : enteredRaw;

      const isMatch = normalizeValue(entered) === normalizeValue(expected);

      if (isMatch) {
        correctCells++;
      } else if (!firstDivergence) {
        firstDivergence = {
          stepIndex: row.stepIndex,
          line: row.line,
          variable: v.name,
          entered: entered,
          expected: expected,
          hint: generateTraceHint(row.line, row.statement, v.name, expected, entered)
        };
      }

      cellResults[row.stepIndex][v.name] = {
        isCorrect: isMatch,
        expected,
        entered
      };
    });
  });

  const score = totalCells > 0 ? Math.round((correctCells / totalCells) * 100) : 0;
  const isCorrect = correctCells === totalCells;

  return {
    isCorrect,
    score,
    totalCells,
    correctCells,
    cellResults,
    firstDivergence
  };
}

/**
 * Evaluates Predict Output problems.
 */
export function evaluatePredictOutput(
  problem: PredictOutputProblem,
  userOutput: string
): PredictOutputEvaluation {
  const normUser = normalizeStdout(userOutput);
  const normExpected = normalizeStdout(problem.expectedStdout);
  const isCorrect = normUser === normExpected;

  let feedback = '';
  if (isCorrect) {
    feedback = `Spot on! ${problem.explanation}`;
  } else {
    feedback = `Not quite. Expected "${problem.expectedStdout}" but received "${userOutput.trim()}". ${problem.explanation}`;
  }

  return {
    isCorrect,
    score: isCorrect ? 100 : 0,
    entered: userOutput.trim(),
    expected: problem.expectedStdout,
    feedback
  };
}

/**
 * Evaluates Code Correction ("Spot the Bug") problems.
 */
export function evaluateCodeCorrection(
  problem: CodeCorrectionProblem,
  selectedLine: number,
  optionIndex?: number
): CodeCorrectionEvaluation {
  if (optionIndex !== undefined && problem.options && problem.options[optionIndex]) {
    const opt = problem.options[optionIndex];
    return {
      isCorrect: opt.isCorrect,
      score: opt.isCorrect ? 100 : 0,
      selectedLine: opt.lineNumber,
      selectedReplacement: opt.replacement,
      feedback: opt.feedback
    };
  }

  const lineMatches = selectedLine === problem.buggyLineNumber;
  return {
    isCorrect: lineMatches,
    score: lineMatches ? 100 : 0,
    selectedLine,
    feedback: lineMatches
      ? `Correct line identified! Line ${selectedLine} contains the bug: ${problem.bugExplanation}`
      : `Line ${selectedLine} is not where the primary bug occurs. Look closely at expressions and loop bounds.`
  };
}

// Helper: Normalize variable values (handle dashes, spaces, numbers)
function normalizeValue(val: string): string {
  const trimmed = val.trim().toLowerCase();
  if (trimmed === '-' || trimmed === '—' || trimmed === 'none' || trimmed === 'unassigned' || trimmed === '') {
    return '—';
  }
  return trimmed;
}

// Helper: Normalize terminal stdout (remove carriage returns, strip trailing whitespace)
function normalizeStdout(output: string): string {
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

// Helper: Generate educational hints for trace table divergence
function generateTraceHint(
  line: number,
  statement: string,
  variable: string,
  expected: string,
  entered: string
): string {
  return `At line ${line} (\`${statement}\`), check variable \`${variable}\`. You entered "${entered}", but after executing this statement, it should be "${expected}". Look at the right-hand side of the assignment.`;
}
