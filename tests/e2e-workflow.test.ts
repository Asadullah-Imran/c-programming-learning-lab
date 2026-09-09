// ==============================================================================
// ICS C Programming Learning Lab — End-to-End Integrated Lifecycle Test
// ==============================================================================

import { executeSandboxedC } from '../lib/execution/compiler-runner';
import { executionReducer } from '../lib/execution/reducer';
import { createInitialProgramState } from '../lib/execution/initial-state';
import { evaluateTraceTable } from '../lib/practice/evaluator';
import { PRACTICE_EXERCISES } from '../lib/practice/practice-data';
import { TraceTableProblem } from '../types/practice';
import { calculateDashboardStats } from '../lib/db/supabase';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runE2EWorkflow() {
  console.log('🧪 Running Suite: Complete End-to-End Educational Lifecycle\n');

  // Step 1: Student writes a C swap program
  console.log('--- Step 1: Sandboxed Execution & Telemetry Generation ---');
  const userCode = `
    int a = 10;
    int b = 20;
    int temp = a;
    a = b;
    b = temp;
    printf("Swapped: a=%d, b=%d\\n", a, b);
  `;
  const runResult = await executeSandboxedC(userCode);
  assert(runResult.status === 'success', 'C code compiled and executed in sandbox');
  assert(runResult.events.length >= 8, `Telemetry emitted ${runResult.events.length} trace events`);
  assert(runResult.stdout.includes('Swapped: a=20, b=10'), 'Stdout captured swap output');

  // Step 2: Feed telemetry into the Pure State Reducer
  console.log('\n--- Step 2: Step-by-Step Replay in Notional Machine ---');
  let state = createInitialProgramState(runResult.events.length);
  for (const event of runResult.events) {
    state = executionReducer(state, event);
  }
  const varA = state.variables['a'];
  const varB = state.variables['b'];
  const varTemp = state.variables['temp'];

  assert(varA !== undefined && varA.value === 20, `Variable 'a' final value is 20 (got ${varA?.value})`);
  assert(varB !== undefined && varB.value === 10, `Variable 'b' final value is 10 (got ${varB?.value})`);
  assert(varTemp !== undefined && varTemp.value === 10, `Variable 'temp' final value is 10 (got ${varTemp?.value})`);
  assert(state.explanationHistory.length > 0, `Generated ${state.explanationHistory.length} 'Why?' pedagogical explanations`);

  // Step 3: Student attempts Practice Trace Worksheet
  console.log('\n--- Step 3: Practice Problem Trace Worksheet Evaluation ---');
  const swapProblem = PRACTICE_EXERCISES.find((e) => e.id === 'trace-swap-arithmetic') as TraceTableProblem;
  assert(Boolean(swapProblem), 'Practice problem loaded from catalog');

  const studentSubmission = swapProblem.rows.map((r) => ({
    stepIndex: r.stepIndex,
    values: { ...r.expectedValues },
  }));

  const evalResult = evaluateTraceTable(swapProblem, studentSubmission);
  assert(evalResult.isCorrect, 'Student worksheet evaluated with 100% accuracy');
  assert(evalResult.score === 100, 'Score 100 awarded');

  // Step 4: Progress Recording and Dashboard Metrics
  console.log('\n--- Step 4: Progress Persistence & Dashboard Metrics ---');
  const initialStats = calculateDashboardStats();
  assert(initialStats.totalLessonsCount === 10, `Curriculum has ${initialStats.totalLessonsCount} total lessons`);
  assert(initialStats.topicMasteries.length === 8, '8 curriculum modules tracked on dashboard');
  assert(initialStats.user.xp >= 400, 'Student profile XP is active');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runE2EWorkflow().catch((err) => {
  console.error('E2E workflow test failed:', err);
  process.exit(1);
});
