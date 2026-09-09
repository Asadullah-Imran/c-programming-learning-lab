import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import { CInstrumenter } from "./ts-instrumenter";
import { ExecutionEvent } from "@/types/execution";

const execAsync = promisify(exec);

export interface ExecutionResponse {
  status: "success" | "compile_error" | "runtime_error" | "timeout";
  events: ExecutionEvent[];
  stdout: string;
  stderr: string;
  error?: string;
  suggestion?: string;
  compileTimeMs?: number;
  runTimeMs?: number;
}

/**
 * Translates GCC/Clang compiler errors into beginner-friendly pedagogical advice.
 */
function translateCompilerError(rawError: string): { message: string; suggestion: string } {
  let suggestion = "Double-check your syntax around the indicated line.";
  
  if (rawError.includes("expected ';'")) {
    suggestion = "Missing Semicolon: In C, every statement must end with a semicolon (`;`).";
  } else if (rawError.includes("undeclared") || rawError.includes("unknown type name")) {
    suggestion = "Undeclared Variable or Type: In C, every variable must be declared with its type (e.g., `int x;`) before you can use it.";
  } else if (rawError.includes("conflicting types")) {
    suggestion = "Type Conflict: You declared the same variable or function with incompatible data types.";
  } else if (rawError.includes("implicit declaration of function 'printf'")) {
    suggestion = "Missing Header: Add `#include <stdio.h>` at the top of your program to use `printf`.";
  } else if (rawError.includes("control reaches end of non-void function")) {
    suggestion = "Missing Return Statement: `main()` is declared as `int main()`, so it must end with `return 0;`.";
  } else if (rawError.includes("assignment to expression with array type")) {
    suggestion = "Array Assignment: In C, you cannot assign entire arrays directly with `=` after declaration. Use loops or `strcpy`.";
  }

  // Clean up paths from message
  const cleanedError = rawError
    .replace(/\/.*?\/main\.c:/g, "Line ")
    .replace(/\/.*?\/tracer\.c:/g, "tracer: ")
    .trim();

  return { message: cleanedError, suggestion };
}

export const compileAndRunC = executeSandboxedC;

/**
 * Sandboxed C compiler and process runner.
 */
export async function executeSandboxedC(
  sourceCode: string,
  timeoutMs: number = 2000
): Promise<ExecutionResponse> {
  const startTime = Date.now();
  const instrumenter = new CInstrumenter();

  // If student code doesn't wrap in main(), auto-wrap it for novice convenience
  let normalizedCode = sourceCode.trim();
  if (!normalizedCode.includes("main(") && !normalizedCode.includes("main ()")) {
    normalizedCode = `int main() {\n${normalizedCode}\n    return 0;\n}`;
  }

  const instrumentation = instrumenter.instrument(normalizedCode);
  const tracerDir = path.join(process.cwd(), "execution-service", "tracer");
  const tracerC = path.join(tracerDir, "tracer.c");
  const tracerH = path.join(tracerDir, "tracer.h");

  // Create isolated temp directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ics_c_lab_"));
  const srcFile = path.join(tempDir, "main.c");
  const binFile = path.join(tempDir, "program_bin");

  try {
    fs.writeFileSync(srcFile, instrumentation.instrumentedCode, "utf8");

    // Copy tracer files into temp dir for self-contained compile
    fs.copyFileSync(tracerC, path.join(tempDir, "tracer.c"));
    fs.copyFileSync(tracerH, path.join(tempDir, "tracer.h"));

    const compileStart = Date.now();
    
    // Step 1: Compile with GCC / Clang
    try {
      await execAsync(
        `gcc -Wall -Wextra -std=c99 "${srcFile}" "${path.join(tempDir, "tracer.c")}" -I"${tempDir}" -o "${binFile}"`,
        { timeout: 5000 }
      );
    } catch (compileErr: any) {
      const rawStderr = compileErr.stderr || compileErr.message || "Compilation failed";
      const { message, suggestion } = translateCompilerError(rawStderr);

      return {
        status: "compile_error",
        events: [
          {
            id: 1,
            type: "compile_error",
            line: 1,
            payload: { message, suggestion },
          },
        ],
        stdout: "",
        stderr: message,
        error: message,
        suggestion,
        compileTimeMs: Date.now() - compileStart,
      };
    }

    const compileTimeMs = Date.now() - compileStart;
    const runStart = Date.now();

    // Step 2: Execute sandboxed binary with hard timeout
    return await new Promise<ExecutionResponse>((resolve) => {
      let stdoutData = "";
      let stderrData = "";
      let isTimedOut = false;

      const child = spawn(binFile, [], {
        cwd: tempDir,
        env: {
          ...process.env,
          // Restrict environment
          PATH: "/usr/bin:/bin",
        },
      });

      const timer = setTimeout(() => {
        isTimedOut = true;
        child.kill("SIGKILL");
      }, timeoutMs);

      child.stdout.on("data", (chunk) => {
        stdoutData += chunk.toString();
        // Protect against stdout floods (max 20KB)
        if (stdoutData.length > 20480) {
          child.kill("SIGKILL");
        }
      });

      child.stderr.on("data", (chunk) => {
        stderrData += chunk.toString();
      });

      child.on("close", (code, signal) => {
        clearTimeout(timer);
        const runTimeMs = Date.now() - runStart;

        if (isTimedOut || signal === "SIGKILL") {
          const timeoutMsg = `Execution timed out after ${timeoutMs / 1000}s. Your program might contain an infinite loop (e.g. while(1)) or excessive operations.`;
          resolve({
            status: "timeout",
            events: [
              {
                id: 1,
                type: "timeout",
                line: 1,
                payload: { message: timeoutMsg },
              },
            ],
            stdout: stdoutData,
            stderr: timeoutMsg,
            error: timeoutMsg,
            suggestion: "Check your loop condition to ensure it eventually becomes false.",
            compileTimeMs,
            runTimeMs,
          });
          return;
        }

        // Parse JSON execution events from stderr
        const eventLines: string[] = [];
        const rawStderrLines: string[] = [];

        for (const line of stderrData.split("\n")) {
          if (line.startsWith("__ICS_TRACE__:")) {
            eventLines.push(line.replace("__ICS_TRACE__:", "").trim());
          } else if (line.trim().length > 0) {
            rawStderrLines.push(line);
          }
        }

        const events: ExecutionEvent[] = [];
        for (const line of eventLines) {
          try {
            const parsed = JSON.parse(line);
            events.push(parsed);
          } catch {
            // Ignore malformed line
          }
        }

        const timeoutEvent = events.find((e) => e.type === "timeout");
        if (timeoutEvent) {
          const timeoutMsg = String(
            timeoutEvent.payload?.message ||
              "Execution loop limit reached (possible infinite loop)."
          );
          resolve({
            status: "timeout",
            events,
            stdout: stdoutData,
            stderr: timeoutMsg,
            error: timeoutMsg,
            suggestion: "Check your loop condition to ensure it eventually terminates.",
            compileTimeMs,
            runTimeMs,
          });
          return;
        }

        // If no events were captured (abnormal exit)
        if (events.length === 0 && code !== 0) {
          const runtimeErrMsg = rawStderrLines.join("\n") || `Process exited with error code ${code}`;
          resolve({
            status: "runtime_error",
            events: [
              {
                id: 1,
                type: "runtime_error",
                line: 1,
                payload: { message: runtimeErrMsg },
              },
            ],
            stdout: stdoutData,
            stderr: runtimeErrMsg,
            error: runtimeErrMsg,
            compileTimeMs,
            runTimeMs,
          });
          return;
        }

        resolve({
          status: "success",
          events,
          stdout: stdoutData,
          stderr: rawStderrLines.join("\n"),
          compileTimeMs,
          runTimeMs,
        });
      });

      child.on("error", (err) => {
        clearTimeout(timer);
        resolve({
          status: "runtime_error",
          events: [],
          stdout: stdoutData,
          stderr: err.message,
          error: err.message,
          compileTimeMs,
          runTimeMs: Date.now() - runStart,
        });
      });
    });
  } finally {
    // Cleanup temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}
