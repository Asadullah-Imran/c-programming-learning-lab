import { ExecutionEvent, ExplanationEntry } from "@/types/execution";

/**
 * Generates an intuitive, pedagogical explanation for novice programmers
 * explaining *why* the program state transitioned during an execution step.
 */
export function generateExplanation(
  event: ExecutionEvent,
  stepNumber: number
): ExplanationEntry {
  const line = event.line;
  const p = event.payload;

  switch (event.type) {
    case "program_start":
      return {
        step: stepNumber,
        line,
        headline: "Program Execution Started",
        detail: "The operating system invoked main() and allocated the initial stack frame.",
      };

    case "program_end":
      return {
        step: stepNumber,
        line,
        headline: "Program Execution Completed",
        detail: "main() returned execution control back to the operating system.",
      };

    case "variable_create": {
      const name = String(p.name ?? "variable");
      const type = String(p.dataType ?? "int");
      const size = p.sizeBytes ?? (type === "char" ? 1 : type === "double" ? 8 : 4);
      const val = p.value !== undefined && p.value !== null ? String(p.value) : "uninitialized";
      const addr = String(p.address ?? "0x7FFE0010");

      return {
        step: stepNumber,
        line,
        headline: `Created Variable: ${name}`,
        detail: `Allocated ${size} bytes at memory address ${addr} for '${name}' (${type}) with initial value: ${val}.`,
      };
    }

    case "assignment":
    case "variable_update": {
      const name = String(p.name ?? "variable");
      const oldVal = p.oldValue !== undefined ? String(p.oldValue) : "?";
      const newVal = p.newValue !== undefined ? String(p.newValue) : String(p.value ?? "?");
      const expr = p.expression ? ` (${p.expression})` : "";

      return {
        step: stepNumber,
        line,
        headline: `Updated Variable: ${name}`,
        detail: `Calculated expression${expr}. Variable '${name}' changed from ${oldVal} to ${newVal}.`,
      };
    }

    case "condition": {
      const expr = String(p.expression ?? "condition");
      const subst = p.substitutedExpression ? ` [${p.substitutedExpression}]` : "";
      const res = Boolean(p.result);
      const branch = p.branch === "then" ? "IF" : p.branch === "else" ? "ELSE" : "Exit";

      return {
        step: stepNumber,
        line,
        headline: `Evaluated Condition: ${expr}`,
        detail: `${expr}${subst} evaluated to ${res ? "TRUE (1)" : "FALSE (0)"}. Program branches into ${branch} block.`,
      };
    }

    case "loop_iteration": {
      const iter = Number(p.iteration ?? 1);
      const lType = String(p.loopType ?? "for");
      const cond = p.conditionExpression ? ` (${p.conditionExpression})` : "";

      return {
        step: stepNumber,
        line,
        headline: `Loop Iteration: ${iter}`,
        detail: `${lType.toUpperCase()} loop condition${cond} is TRUE. Executing body for iteration #${iter}.`,
      };
    }

    case "loop_end":
      return {
        step: stepNumber,
        line,
        headline: "Loop Terminated",
        detail: "The loop condition evaluated to FALSE. Program breaks out of the loop and continues.",
      };

    case "function_call": {
      const fn = String(p.functionName ?? "function");
      return {
        step: stepNumber,
        line,
        headline: `Function Call: ${fn}()`,
        detail: `Pushed new activation record for '${fn}' onto the call stack. Execution jumps to function body.`,
      };
    }

    case "function_return": {
      const fn = String(p.functionName ?? "function");
      const ret = p.returnValue !== undefined ? ` with return value: ${p.returnValue}` : "";
      return {
        step: stepNumber,
        line,
        headline: `Returned from ${fn}()`,
        detail: `Function '${fn}' finished${ret}. Stack frame popped; control resumes at caller.`,
      };
    }

    case "output": {
      const text = String(p.text ?? "");
      return {
        step: stepNumber,
        line,
        headline: "Standard Output (printf)",
        detail: `Sent output to terminal stream: "${text.replace(/\n/g, "\\n")}".`,
      };
    }

    case "compile_error":
    case "runtime_error":
      return {
        step: stepNumber,
        line,
        headline: "Execution Error",
        detail: String(p.message ?? "An unexpected runtime error occurred."),
      };

    default:
      return {
        step: stepNumber,
        line,
        headline: `Executed: ${event.type}`,
        detail: `Processed execution event at source line ${line ?? "?"}.`,
      };
  }
}
