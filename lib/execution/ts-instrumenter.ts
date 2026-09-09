/**
 * ICS C Programming Learning Lab — TypeScript C AST Instrumenter
 *
 * Source-to-source code instrumenter that transforms introductory C source code
 * into telemetry-instrumented C code by injecting tracer.h hooks.
 */

export interface InstrumentationResult {
  instrumentedCode: string;
  variableMap: Record<string, { type: string; line: number }>;
  hasMain: boolean;
  warnings: string[];
}

export class CInstrumenter {
  private knownTypes = new Set(["int", "char", "float", "double", "long", "short", "unsigned"]);

  /**
   * Main instrumentation entry point.
   */
  public instrument(sourceCode: string): InstrumentationResult {
    const lines = sourceCode.split("\n");
    const outputLines: string[] = [];
    const variableMap: Record<string, { type: string; line: number }> = {};
    const warnings: string[] = [];

    // Header injection
    outputLines.push('#include "tracer.h"');
    outputLines.push('#include <stdio.h>');
    outputLines.push("");

    let inMain = false;
    let mainBraceDepth = 0;
    let hasMain = false;
    let currentFunction: string | null = null;
    let insideForLoopHeader = false;

    for (let i = 0; i < lines.length; i++) {
      const originalLineNum = i + 1;
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      outputLines.push(`#line ${originalLineNum} "main.c"`);

      // Check for main entry point
      if (/int\s+main\s*\([^)]*\)\s*\{?/.test(trimmed)) {
        inMain = true;
        hasMain = true;
        currentFunction = "main";
        outputLines.push(rawLine);
        if (trimmed.includes("{")) {
          mainBraceDepth++;
          outputLines.push("    __trace_init();");
        }
        continue;
      }

      // If main opening brace is on a separate line
      if (inMain && trimmed === "{" && mainBraceDepth === 0) {
        mainBraceDepth++;
        outputLines.push(rawLine);
        outputLines.push("    __trace_init();");
        continue;
      }

      // Check other function definitions
      const fnDefMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_*]*)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*\{?/);
      if (fnDefMatch && fnDefMatch[2] !== "main" && !trimmed.startsWith("if") && !trimmed.startsWith("while") && !trimmed.startsWith("for") && !trimmed.startsWith("printf")) {
        const fnName = fnDefMatch[2];
        currentFunction = fnName;
        outputLines.push(rawLine);
        continue;
      }

      // Track braces
      const openBraces = (rawLine.match(/\{/g) || []).length;
      const closeBraces = (rawLine.match(/\}/g) || []).length;
      mainBraceDepth += openBraces - closeBraces;

      // Check for return statement in main
      if (inMain && trimmed.startsWith("return")) {
        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push("    __trace_finish();");
        outputLines.push(rawLine);
        if (mainBraceDepth <= 0) {
          inMain = false;
          currentFunction = null;
        }
        continue;
      }

      // Check for return in user-defined functions
      if (currentFunction && currentFunction !== "main" && trimmed.startsWith("return")) {
        const retExpr = trimmed.replace(/^return\s*/, "").replace(/;$/, "").trim();
        outputLines.push(`    __trace_line(${originalLineNum});`);
        if (retExpr.length > 0) {
          outputLines.push(`    long long __ret_${currentFunction} = (long long)(${retExpr});`);
          outputLines.push(`    __trace_fn_return("${currentFunction}", ${originalLineNum}, __ret_${currentFunction});`);
          outputLines.push(`    return (__ret_${currentFunction});`);
        } else {
          outputLines.push(`    __trace_fn_return("${currentFunction}", ${originalLineNum}, 0);`);
          outputLines.push(rawLine);
        }
        continue;
      }

      // Variable declaration: e.g. "int a = 5;", "int a;", "int sum = a + b;"
      const declMatch = trimmed.match(/^(int|char|float|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:=\s*([^;]+))?;/);
      if (declMatch) {
        const type = declMatch[1];
        const name = declMatch[2];
        const initVal = declMatch[3];

        variableMap[name] = { type, line: originalLineNum };

        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push(`    ${rawLine.trim()}`);
        outputLines.push(
          `    __trace_var_create("${name}", "${type}", &${name}, sizeof(${name}), ${originalLineNum});`
        );
        continue;
      }

      // Assignment: e.g. "a = b;", "sum = a + b;", "temp = a;"
      const assignMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]+);/);
      if (assignMatch && !trimmed.startsWith("return")) {
        const name = assignMatch[1];
        const expr = assignMatch[2].trim();
        const escapedExpr = expr.replace(/"/g, '\\"');
        const varType = variableMap[name]?.type || "int";

        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push(`    ${rawLine.trim()}`);
        outputLines.push(
          `    __trace_var_assign("${name}", "${varType}", &${name}, sizeof(${name}), ${originalLineNum}, "${escapedExpr}");`
        );
        continue;
      }

      // Else-if condition: e.g. "} else if (marks == 90) {" or "else if (marks == 90) {"
      const elseIfMatch = trimmed.match(/^(?:}\s*)?else\s+if\s*\((.*)\)\s*(\{?)$/);
      if (elseIfMatch) {
        const condExpr = elseIfMatch[1].trim();
        const trailing = elseIfMatch[2] || "";
        const escapedCond = condExpr.replace(/"/g, '\\"');
        const leadingBrace = trimmed.startsWith("}") ? "} " : "";

        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push(
          `    ${leadingBrace}else if (__trace_cond(${originalLineNum}, "${escapedCond}", (${condExpr}), "then")) ${trailing}`
        );
        continue;
      }

      // Condition: e.g. "if (marks >= 80)"
      const ifMatch = trimmed.match(/^if\s*\((.*)\)\s*(\{?)$/);
      if (ifMatch) {
        const condExpr = ifMatch[1].trim();
        const trailing = ifMatch[2] || "";
        const escapedCond = condExpr.replace(/"/g, '\\"');

        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push(
          `    if (__trace_cond(${originalLineNum}, "${escapedCond}", (${condExpr}), "then")) ${trailing}`
        );
        continue;
      }

      // For loop: e.g. "for (int i = 1; i <= 3; i++) {"
      const forMatch = trimmed.match(/^for\s*\(([^;]*);([^;]*);([^)]*)\)\s*(\{?)$/);
      if (forMatch) {
        const init = forMatch[1].trim();
        const cond = forMatch[2].trim();
        const step = forMatch[3].trim();
        const trailing = forMatch[4] || "";
        const escapedCond = cond.replace(/"/g, '\\"');

        outputLines.push(`    __trace_line(${originalLineNum});`);
        // If init contains a variable declaration, record it
        const forDeclMatch = init.match(/^(int)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/);
        if (forDeclMatch) {
          const varName = forDeclMatch[2];
          variableMap[varName] = { type: "int", line: originalLineNum };
        }

        outputLines.push(
          `    for (${init}; __trace_cond(${originalLineNum}, "${escapedCond}", (${cond}), "loop"); ${step}) ${trailing}`
        );
        continue;
      }

      // Printf call: capture formatted output into trace event
      if (trimmed.startsWith("printf(") && trimmed.endsWith(";")) {
        outputLines.push(`    __trace_line(${originalLineNum});`);
        outputLines.push(`    ${rawLine.trim()}`);
        const innerArgs = trimmed.slice(7, -2);
        outputLines.push(
          `    { char __trace_buf[1024]; snprintf(__trace_buf, sizeof(__trace_buf), ${innerArgs}); __trace_output(__trace_buf); }`
        );
        continue;
      }

      // Plain statements (e.g. function calls, braces, empty lines)
      if (trimmed.length > 0 && !trimmed.startsWith("//") && !trimmed.startsWith("#") && trimmed !== "{" && trimmed !== "}") {
        outputLines.push(`    __trace_line(${originalLineNum});`);
      }

      outputLines.push(rawLine);
    }

    return {
      instrumentedCode: outputLines.join("\n"),
      variableMap,
      hasMain,
      warnings,
    };
  }
}
