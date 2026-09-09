import { PRACTICE_EXERCISES } from '../lib/practice/practice-data';
import {
  evaluateTraceTable,
  evaluatePredictOutput,
  evaluateCodeCorrection
} from '../lib/practice/evaluator';
import { TraceTableProblem, PredictOutputProblem, CodeCorrectionProblem } from '../types/practice';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Practice Evaluator Unit Tests...\n');

// Test 1: Full Correct Trace Table Submission (100% Score)
console.log('Test 1: Full Correct Trace Table Submission');
const swapProblem = PRACTICE_EXERCISES.find(e => e.id === 'trace-swap-arithmetic') as TraceTableProblem;
assert(!!swapProblem, 'Problem trace-swap-arithmetic must exist');

const perfectSubmission = swapProblem.rows.map(r => ({
  stepIndex: r.stepIndex,
  values: { ...r.expectedValues }
}));

const evalPerfect = evaluateTraceTable(swapProblem, perfectSubmission);
assert(evalPerfect.isCorrect === true, 'Perfect submission must be marked correct');
assert(evalPerfect.score === 100, `Score must be 100, got ${evalPerfect.score}`);
assert(!evalPerfect.firstDivergence, 'There should be no divergence for perfect submission');
console.log('  ✓ Passed: 100% correct trace table evaluated with zero divergence.');

// Test 2: Partial Trace Table with Divergence on Step 3 (Line 5)
console.log('\nTest 2: Partial Trace Table with Divergence Identification');
const imperfectSubmission = swapProblem.rows.map(r => ({
  stepIndex: r.stepIndex,
  values: { ...r.expectedValues }
}));
// Inject error in step 3 (a = b): student entered 4 instead of 9 for 'a'
imperfectSubmission[3].values['a'] = '4';

const evalImperfect = evaluateTraceTable(swapProblem, imperfectSubmission);
assert(evalImperfect.isCorrect === false, 'Imperfect submission must be marked incorrect');
assert(evalImperfect.score < 100, `Score should be less than 100, got ${evalImperfect.score}`);
assert(!!evalImperfect.firstDivergence, 'Divergence must be captured');
assert(evalImperfect.firstDivergence?.stepIndex === 3, 'First divergence must be stepIndex 3');
assert(evalImperfect.firstDivergence?.variable === 'a', 'Divergence variable must be "a"');
assert(evalImperfect.firstDivergence?.entered === '4', 'Entered must be "4"');
assert(evalImperfect.firstDivergence?.expected === '9', 'Expected must be "9"');
console.log(`  ✓ Passed: Divergence accurately caught at line ${evalImperfect.firstDivergence?.line} on variable 'a'.`);

// Test 3: Predict Output Evaluation
console.log('\nTest 3: Predict Output Evaluation');
const divProblem = PRACTICE_EXERCISES.find(e => e.id === 'predict-int-div-modulo') as PredictOutputProblem;
assert(!!divProblem, 'Problem predict-int-div-modulo must exist');

const evalOutCorrect = evaluatePredictOutput(divProblem, '  3 rem 2\n');
assert(evalOutCorrect.isCorrect === true, 'Output match with trimmed whitespace must pass');
assert(evalOutCorrect.score === 100, 'Score must be 100');

const evalOutWrong = evaluatePredictOutput(divProblem, '3.4 rem 2');
assert(evalOutWrong.isCorrect === false, 'Wrong output must fail');
assert(evalOutWrong.score === 0, 'Score must be 0');
console.log('  ✓ Passed: Predict output handles exact & whitespace normalization.');

// Test 4: Code Correction Evaluation
console.log('\nTest 4: Code Correction (Spot the Bug)');
const bugProblem = PRACTICE_EXERCISES.find(e => e.id === 'bug-assignment-in-if') as CodeCorrectionProblem;
assert(!!bugProblem, 'Problem bug-assignment-in-if must exist');

const evalBugCorrect = evaluateCodeCorrection(bugProblem, 5, 0);
assert(evalBugCorrect.isCorrect === true, 'Selecting correct fix must pass');
assert(evalBugCorrect.score === 100, 'Score must be 100');

const evalBugWrong = evaluateCodeCorrection(bugProblem, 4, 1);
assert(evalBugWrong.isCorrect === false, 'Selecting incorrect option must fail');
assert(evalBugWrong.score === 0, 'Score must be 0');
console.log('  ✓ Passed: Code correction option evaluation verified.');

console.log('\n🎉 ALL PRACTICE EVALUATOR TESTS PASSED SUCCESSFULLY!\n');
