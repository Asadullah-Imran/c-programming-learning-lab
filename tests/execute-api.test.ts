import assert from "node:assert";
import { executeSandboxedC } from "../lib/execution/compiler-runner";

console.log("🧪 Starting Sandboxed C Compiler & API Runner Tests...\n");

async function runTests() {
  // Test 1: User-written variable swap and accumulator
  console.log("Test 1: Executing Arbitrary Student C Code (Swap + Sum + Printf)");
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

  const res1 = await executeSandboxedC(studentCode);
  assert.strictEqual(res1.status, "success", `Expected status success, got ${res1.status}: ${res1.stderr}`);
  assert.ok(res1.events.length >= 8, `Expected at least 8 events, got ${res1.events.length}`);
  assert.ok(res1.stdout.includes("sum of a and b is 15"), `Expected stdout to contain 'sum of a and b is 15', got "${res1.stdout}"`);
  console.log(`  ✓ Passed: Executed in ${res1.runTimeMs}ms (${res1.events.length} events emitted, stdout: "${res1.stdout.trim()}").`);

  // Test 2: Auto-wrapping code if main() is omitted by beginner
  console.log("\nTest 2: Auto-wrapping Code when main() is Omitted");
  const snippetCode = `int x = 100;
int y = 200;
int total = x + y;
printf("Total: %d\\n", total);`;

  const res2 = await executeSandboxedC(snippetCode);
  assert.strictEqual(res2.status, "success", `Expected success for auto-wrapped snippet, got ${res2.status}`);
  assert.ok(res2.stdout.includes("Total: 300"), "Stdout must include 'Total: 300'");
  console.log("  ✓ Passed: Novice snippet without main() was cleanly auto-wrapped and executed.");

  // Test 3: Compiler Error Translation
  console.log("\nTest 3: Beginner-Friendly Compiler Error Translation");
  const badSyntaxCode = `int main() {
    int x = 10
    return 0;
}`;

  const res3 = await executeSandboxedC(badSyntaxCode);
  assert.strictEqual(res3.status, "compile_error", "Expected compile_error for missing semicolon");
  assert.ok(res3.suggestion?.includes("Missing Semicolon"), `Expected suggestion to mention Missing Semicolon, got "${res3.suggestion}"`);
  console.log(`  ✓ Passed: Compiler error caught with helpful advice: "${res3.suggestion}".`);

  // Test 4: Infinite Loop Isolation & Timeout
  console.log("\nTest 4: Infinite Loop Containment (Timeout at 1.0s)");
  const infiniteLoopCode = `int main() {
    int counter = 0;
    while (1) {
      counter++;
    }
    return 0;
}`;

  const res4 = await executeSandboxedC(infiniteLoopCode, 1000); // 1s timeout
  assert.strictEqual(res4.status, "timeout", `Expected status timeout, got ${res4.status}`);
  assert.ok(res4.suggestion?.includes("loop condition"), "Expected timeout suggestion");
  console.log(`  ✓ Passed: Infinite loop was safely killed with timeout message: "${res4.error}".`);

  console.log("\n🎉 ALL SANDBOXED RUNNER TESTS PASSED SUCCESSFULLY!");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
