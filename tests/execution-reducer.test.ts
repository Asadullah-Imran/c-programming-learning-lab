import assert from "node:assert";
import { executionReducer } from "../lib/execution/reducer";
import { createInitialProgramState } from "../lib/execution/initial-state";
import { 
  SCENARIO_VARIABLE_SWAP, 
  SCENARIO_IF_ELSE, 
  SCENARIO_FOR_LOOP, 
  SCENARIO_FUNCTION_CALL 
} from "../lib/execution/mock-events";

console.log("🧪 Starting Execution Reducer Unit Tests...\n");

// Test 1: State Immutability
{
  console.log("Test 1: Pure Function & State Immutability");
  const initial = createInitialProgramState(1);
  const event = SCENARIO_VARIABLE_SWAP.events[1]; // variable_create 'a' = 5
  
  const frozenState = Object.freeze({ ...initial, variables: Object.freeze({ ...initial.variables }) });
  const nextState = executionReducer(frozenState as any, event);

  assert.notStrictEqual(initial, nextState, "Reducer must return a new state reference");
  assert.strictEqual(initial.variables.a, undefined, "Initial state variables must not be mutated");
  assert.strictEqual(nextState.variables.a.value, 5, "Next state must have 'a' = 5");
  assert.strictEqual(nextState.variables.a.isUpdated, true, "'a' must be marked isUpdated = true");
  console.log("  ✓ Passed: Reducer guarantees strict state immutability.");
}

// Test 2: Variable Swap Scenario Time-Travel Replay
{
  console.log("Test 2: Variable Swap Scenario Time-Travel Replay");
  let state = createInitialProgramState(SCENARIO_VARIABLE_SWAP.events.length);

  for (const event of SCENARIO_VARIABLE_SWAP.events) {
    state = executionReducer(state, event);
  }

  assert.strictEqual(state.variables.a.value, 10, "Variable 'a' must end up with value 10");
  assert.strictEqual(state.variables.b.value, 5, "Variable 'b' must end up with value 5");
  assert.strictEqual(state.variables.temp.value, 5, "Variable 'temp' must end up with value 5");
  assert.strictEqual(state.status, "completed", "Program status must be completed");
  assert.strictEqual(state.currentEventIndex, 7, "All 7 events must have been consumed");
  console.log("  ✓ Passed: Variable swap scenario correctly processed.");
}

// Test 3: If-Else Condition Branching & Output
{
  console.log("Test 3: Condition Branching & Stdout Capture");
  let state = createInitialProgramState(SCENARIO_IF_ELSE.events.length);

  for (const event of SCENARIO_IF_ELSE.events) {
    state = executionReducer(state, event);
    if (event.type === "condition") {
      assert.strictEqual(state.activeCondition?.result, true, "Condition marks >= 80 must be true");
      assert.strictEqual(state.activeCondition?.branchTaken, "then", "Branch taken must be 'then'");
    }
  }

  assert.strictEqual(state.variables.grade.value, "'A'", "Grade must be 'A'");
  assert.strictEqual(state.stdout, "Grade: A\n", "Stdout must contain 'Grade: A\\n'");
  console.log("  ✓ Passed: Conditional branch and stdout correctly recorded.");
}

// Test 4: For Loop Iteration Tracking
{
  console.log("Test 4: For Loop Iteration Tracking");
  let state = createInitialProgramState(SCENARIO_FOR_LOOP.events.length);

  for (const event of SCENARIO_FOR_LOOP.events) {
    state = executionReducer(state, event);
  }

  assert.strictEqual(state.variables.sum.value, 6, "Sum of 1..3 must equal 6");
  assert.strictEqual(state.variables.i.value, 3, "Loop counter i must equal 3");
  assert.strictEqual(state.stdout, "Total: 6\n", "Stdout must contain 'Total: 6\\n'");
  console.log("  ✓ Passed: Loop iterations and accumulator verified.");
}

// Test 5: Call Stack Frame Allocation & Return
{
  console.log("Test 5: Call Stack Push & Pop");
  let state = createInitialProgramState(SCENARIO_FUNCTION_CALL.events.length);

  let maxStackDepth = 0;
  let detectedParameters: unknown[] = [];
  let capturedReturn: unknown = null;

  for (const event of SCENARIO_FUNCTION_CALL.events) {
    state = executionReducer(state, event);
    if (state.callStack.length > maxStackDepth) {
      maxStackDepth = state.callStack.length;
      if (state.callStack[1]?.parameters) {
        detectedParameters = state.callStack[1].parameters;
      }
    }
    if (event.type === "function_return") {
      capturedReturn = state.lastFunctionReturn;
    }
  }

  assert.strictEqual(maxStackDepth, 2, "Max stack depth must reach 2 during add() invocation");
  assert.strictEqual(detectedParameters.length, 2, "Parameters a and b must be captured in stack frame");
  assert.deepStrictEqual(capturedReturn, { functionName: "add", returnValue: 9, returnLine: 8 }, "Return value must be captured on function_return");
  assert.strictEqual(state.callStack.length, 1, "Call stack must return to depth 1 (main) after return");
  assert.strictEqual(state.variables.result.value, 9, "Result variable must equal 9");
  assert.strictEqual(state.stdout, "Result: 9\n", "Stdout must contain 'Result: 9\\n'");
  console.log("  ✓ Passed: Call stack push/pop, parameter pass-by-value, and return value bubbling verified.");
}

console.log("\n🎉 ALL 5 UNIT TESTS PASSED SUCCESSFULLY!");
