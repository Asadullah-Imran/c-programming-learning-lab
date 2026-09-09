// ==============================================================================
// ICS C Programming Learning Lab — Security & Sandbox Hardening Tests
// ==============================================================================

import { executeSandboxedC } from '../lib/execution/compiler-runner';

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

async function runSecurityTests() {
  console.log('🧪 Running Suite: Security, Sandbox Containment & Compiler Safety\n');

  // Test 1: Infinite Loop Containment
  console.log('--- Test Group 1: Runaway Execution Containment ---');
  const infiniteLoopCode = `
    int count = 0;
    while (1) {
      count++;
    }
  `;
  const loopResult = await executeSandboxedC(infiniteLoopCode);
  assert(loopResult.status === 'success' || loopResult.status === 'timeout', 'Runner handled infinite loop without crashing host');
  assert(
    Boolean((loopResult.error && loopResult.error.includes('loop limit')) || loopResult.events.length <= 1005),
    'Event flood was capped at max event threshold (1000 events)'
  );

  // Test 2: Compiler Error Translation
  console.log('\n--- Test Group 2: Compiler Error Human-Friendly Diagnostics ---');
  const brokenCode = `
    int main() {
      int x = 10
      int y = 20;
      return 0;
    }
  `;
  const brokenResult = await executeSandboxedC(brokenCode);
  assert(brokenResult.status === 'compile_error', 'Syntax error was caught by compiler');
  assert(
    Boolean(brokenResult.suggestion && brokenResult.suggestion.includes('Missing Semicolon')),
    'Helpful pedagogical advice provided for missing semicolon'
  );

  // Test 3: Multiple nested scopes & AST probe resilience
  console.log('\n--- Test Group 3: Complex AST Control Flow Instrumentation ---');
  const complexCode = `
    int a = 5;
    int b = 10;
    if (a < b) {
      for (int i = 0; i < 3; i++) {
        a += i;
      }
    } else {
      b = 0;
    }
    printf("Final a: %d\\n", a);
  `;
  const complexResult = await executeSandboxedC(complexCode);
  assert(complexResult.status === 'success', 'Complex nested code compiled and ran cleanly');
  assert(complexResult.events.length > 5, `Generated rich execution telemetry (${complexResult.events.length} events)`);
  assert(complexResult.stdout.includes('Final a: 8'), `Stdout correctly verified: "${complexResult.stdout.trim()}"`);

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityTests().catch((err) => {
  console.error('Test runner failed with error:', err);
  process.exit(1);
});
