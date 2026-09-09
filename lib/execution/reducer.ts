import { 
  ExecutionEvent, 
  ProgramState, 
  VariableState, 
  CDataType,
  StackFrame,
  ConditionState,
  LoopState
} from "@/types/execution";
import { generateExplanation } from "./explanation-generator";

/**
 * Calculates default C data type byte sizes (based on standard 64-bit GCC/Clang ABI)
 */
function getDefaultSizeBytes(type: CDataType): number {
  switch (type) {
    case "char":
      return 1;
    case "int":
    case "float":
      return 4;
    case "double":
    case "pointer":
      return 8;
    default:
      return 4;
  }
}

/**
 * Deterministic simulated stack address generator
 */
function generateAddress(index: number): string {
  const base = 0x7ffe0010;
  return `0x${(base + index * 4).toString(16).toUpperCase()}`;
}

/**
 * PURE DETERMINISTIC STATE REDUCER
 * Translates an incoming ExecutionEvent and previous ProgramState into
 * an immutable next ProgramState.
 */
export function executionReducer(
  state: ProgramState,
  event: ExecutionEvent
): ProgramState {
  const nextEventIndex = state.currentEventIndex + 1;
  const line = event.line ?? state.currentLine;
  const p = event.payload;

  // Clear previous transient highlights on variables
  const updatedVariables: Record<string, VariableState> = {};
  for (const [key, v] of Object.entries(state.variables)) {
    updatedVariables[key] = {
      ...v,
      isUpdated: false,
    };
  }

  let nextStatus = state.status;
  let nextStdout = state.stdout;
  let nextStderr = state.stderr;
  let nextActiveCondition: ConditionState | null = state.activeCondition;
  let nextActiveLoop: LoopState | null = state.activeLoop;
  let nextCallStack: StackFrame[] = [...state.callStack];

  switch (event.type) {
    case "program_start": {
      nextStatus = "running";
      break;
    }

    case "program_end": {
      nextStatus = "completed";
      break;
    }

    case "variable_create": {
      const name = String(p.name);
      const dataType = (p.dataType as CDataType) || "int";
      const sizeBytes = Number(p.sizeBytes) || getDefaultSizeBytes(dataType);
      const address = String(p.address || generateAddress(Object.keys(updatedVariables).length));
      const value = p.value !== undefined ? (p.value as string | number | boolean | null) : null;
      const scope = String(p.scope || "main");

      const newVar: VariableState = {
        name,
        type: dataType,
        value,
        previousValue: undefined,
        sizeBytes,
        address,
        isUpdated: true,
        scope,
      };

      updatedVariables[name] = newVar;

      // Also register into the top active stack frame
      if (nextCallStack.length > 0) {
        const topFrame = { ...nextCallStack[nextCallStack.length - 1] };
        topFrame.variables = { ...topFrame.variables, [name]: newVar };
        nextCallStack[nextCallStack.length - 1] = topFrame;
      }
      break;
    }

    case "assignment":
    case "variable_update": {
      const name = String(p.name);
      const existing = updatedVariables[name];
      const newValue = p.newValue !== undefined ? p.newValue : p.value;

      if (existing) {
        const updatedVar: VariableState = {
          ...existing,
          previousValue: existing.value,
          value: newValue as string | number | boolean | null,
          isUpdated: true,
        };
        updatedVariables[name] = updatedVar;

        // Update in top frame as well
        if (nextCallStack.length > 0) {
          const topFrame = { ...nextCallStack[nextCallStack.length - 1] };
          topFrame.variables = { ...topFrame.variables, [name]: updatedVar };
          nextCallStack[nextCallStack.length - 1] = topFrame;
        }
      } else {
        // Handle undeclared or implicit assignment fallback
        const newVar: VariableState = {
          name,
          type: "int",
          value: newValue as string | number | boolean | null,
          sizeBytes: 4,
          address: generateAddress(Object.keys(updatedVariables).length),
          isUpdated: true,
          scope: "main",
        };
        updatedVariables[name] = newVar;
      }
      break;
    }

    case "condition": {
      nextActiveCondition = {
        line,
        expression: String(p.expression ?? ""),
        substitutedExpression: p.substitutedExpression ? String(p.substitutedExpression) : undefined,
        result: Boolean(p.result),
        branchTaken: p.branch === "then" ? "then" : p.branch === "else" ? "else" : null,
      };
      break;
    }

    case "branch_exit": {
      nextActiveCondition = null;
      break;
    }

    case "loop_start":
    case "loop_iteration": {
      nextActiveLoop = {
        line,
        loopType: (p.loopType as "for" | "while" | "do-while") || "for",
        iteration: Number(p.iteration ?? 1),
        conditionExpression: p.conditionExpression ? String(p.conditionExpression) : undefined,
        isConditionMet: p.isConditionMet !== undefined ? Boolean(p.isConditionMet) : true,
      };
      break;
    }

    case "loop_end": {
      nextActiveLoop = null;
      break;
    }

    case "function_call": {
      const fnName = String(p.functionName ?? "func");
      const newFrame: StackFrame = {
        id: `frame-${fnName}-${Date.now()}`,
        functionName: fnName,
        callLine: line,
        variables: {},
      };

      // Populate arguments if provided
      if (Array.isArray(p.arguments)) {
        p.arguments.forEach((arg, idx) => {
          const argVar: VariableState = {
            name: arg.name,
            type: arg.type || "int",
            value: arg.value,
            sizeBytes: getDefaultSizeBytes(arg.type || "int"),
            address: generateAddress(Object.keys(updatedVariables).length + idx),
            isUpdated: true,
            scope: fnName,
          };
          newFrame.variables[arg.name] = argVar;
          updatedVariables[`${fnName}::${arg.name}`] = argVar;
        });
      }

      nextCallStack = [...nextCallStack, newFrame];
      break;
    }

    case "function_return": {
      if (nextCallStack.length > 1) {
        nextCallStack = nextCallStack.slice(0, -1);
      }
      break;
    }

    case "output": {
      if (typeof p.text === "string") {
        nextStdout += p.text;
      }
      break;
    }

    case "compile_error":
    case "runtime_error":
    case "timeout": {
      nextStatus = "error";
      if (typeof p.message === "string") {
        nextStderr += (nextStderr ? "\n" : "") + p.message;
      }
      break;
    }

    default:
      break;
  }

  // Generate explanation for current transition
  const explanationEntry = generateExplanation(event, nextEventIndex);

  return {
    status: nextStatus,
    currentLine: line,
    variables: updatedVariables,
    callStack: nextCallStack,
    activeCondition: nextActiveCondition,
    activeLoop: nextActiveLoop,
    stdout: nextStdout,
    stderr: nextStderr,
    explanation: explanationEntry.detail,
    explanationHistory: [...state.explanationHistory, explanationEntry],
    currentEventIndex: nextEventIndex,
    totalEvents: state.totalEvents,
  };
}
