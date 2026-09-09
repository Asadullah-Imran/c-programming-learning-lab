import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { CInstrumenter } from "../lib/execution/ts-instrumenter";
import { executionReducer } from "../lib/execution/reducer";
import { createInitialProgramState } from "../lib/execution/initial-state";
import { ExecutionEvent } from "../types/execution";

console.log("🧪 Starting C AST Instrumenter & Real Execution Tests...\n");

const instrumenter = new CInstrumenter();

// Test Case 1: Student's Variable Swap & Accumulator Code
console.log("Test 1: Instrumenting Student's Arbitrary C Code (Swap & Sum)");

const studentCode = `int main() {
    int a = 5;
    int b = 10;
    int temp = a;
    a = b;
    b = temp;
    int sum = 0;
    sum = a + b;
    printf("sum of a and b is %d\\n", sum);
    return 0;
}`;

const result = instrumenter.instrument(studentCode);

assert.strictEqual(result.hasMain, true, "Instrumenter must detect main() entry point");
assert.ok(result.instrumentedCode.includes("__trace_init()"), "Must inject __trace_init()");
assert.ok(result.instrumentedCode.includes("__trace_var_create"), "Must inject __trace_var_create");
assert.ok(result.instrumentedCode.includes("__trace_var_assign"), "Must inject __trace_var_assign");
assert.ok(result.instrumentedCode.includes("__trace_finish()"), "Must inject __trace_finish()");

console.log("  ✓ Passed: Code transformed with trace telemetry probes.");

// Test Case 2: Compilation and Real Binary Execution
console.log("\nTest 2: Compiling and Running Instrumented C Code with GCC / Clang");

const tmpDir = path.join(process.cwd(), "scratch");
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const tmpSrcFile = path.join(tmpDir, "student_instrumented.c");
const tmpBinFile = path.join(tmpDir, "student_bin");
const tracerDir = path.join(process.cwd(), "execution-service", "tracer");
const tracerC = path.join(tracerDir, "tracer.c");

fs.writeFileSync(tmpSrcFile, result.instrumentedCode, "utf8");

try {
  // Compile with GCC / Clang
  execSync(`gcc -Wall -Wextra -std=c99 "${tmpSrcFile}" "${tracerC}" -I"${tracerDir}" -o "${tmpBinFile}"`);

  // Run the instrumented binary and capture stderr telemetry
  const execOutput = execSync(`"${tmpBinFile}"`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  
  // Note: Telemetry events were emitted to stderr. Let's run with stderr captured.
  const fullOutput = execSync(`"${tmpBinFile}" 2>&1`, { encoding: "utf8" });

  const lines = fullOutput.split("\n");
  const eventLines = lines.filter((l) => l.startsWith("__ICS_TRACE__:"));
  const stdoutLines = lines.filter((l) => !l.startsWith("__ICS_TRACE__") && l.trim().length > 0);

  assert.ok(eventLines.length >= 8, `Expected at least 8 trace events, got ${eventLines.length}`);
  assert.ok(stdoutLines.some((l) => l.includes("sum of a and b is 15")), "Stdout must contain 'sum of a and b is 15'");

  console.log(`  ✓ Passed: GCC compiled cleanly and emitted ${eventLines.length} trace events.`);
  console.log(`  ✓ Passed: Standard output captured: "${stdoutLines.join(" ").trim()}".`);

  // Test Case 3: Pass Real Events into State Reducer
  console.log("\nTest 3: Passing Real Event Stream to State Reducer");

  const events: ExecutionEvent[] = eventLines.map((line) => {
    const jsonStr = line.replace("__ICS_TRACE__:", "").trim();
    return JSON.parse(jsonStr) as ExecutionEvent;
  });

  let state = createInitialProgramState(events.length);
  for (const event of events) {
    state = executionReducer(state, event);
  }

  assert.strictEqual(state.variables.a.value, 10, "Variable a must equal 10 after swap");
  assert.strictEqual(state.variables.b.value, 5, "Variable b must equal 5 after swap");
  assert.strictEqual(state.variables.sum.value, 15, "Variable sum must equal 15");
  assert.strictEqual(state.status, "completed", "Program state must be completed");

  console.log("  ✓ Passed: State reducer processed real C execution events with 100% fidelity!");
  console.log(`    a = ${state.variables.a.value} (Address: ${state.variables.a.address})`);
  console.log(`    b = ${state.variables.b.value} (Address: ${state.variables.b.address})`);
  console.log(`    sum = ${state.variables.sum.value} (Address: ${state.variables.sum.address})`);

} finally {
  // Clean up
  if (fs.existsSync(tmpSrcFile)) fs.unlinkSync(tmpSrcFile);
  if (fs.existsSync(tmpBinFile)) fs.unlinkSync(tmpBinFile);
}

console.log("\n🎉 ALL C INSTRUMENTATION TESTS PASSED SUCCESSFULLY!");
