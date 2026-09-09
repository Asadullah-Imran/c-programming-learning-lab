/**
 * Execution Event Types and Schemas for the Notional Machine
 * Defines the immutable event contract produced by the sandboxed C runner
 * and consumed by the pure deterministic state reducer.
 */

export type CDataType = "int" | "char" | "float" | "double" | "void" | "pointer";

export type ExecutionEventType =
  | "program_start"
  | "program_end"
  | "statement_start"
  | "statement_end"
  | "variable_create"
  | "variable_update"
  | "assignment"
  | "expression_evaluate"
  | "condition"
  | "branch_enter"
  | "branch_exit"
  | "loop_start"
  | "loop_condition"
  | "loop_iteration"
  | "loop_end"
  | "function_call"
  | "function_return"
  | "input_request"
  | "input_received"
  | "output"
  | "compile_error"
  | "runtime_error"
  | "timeout";

// Specific typed event payloads
export interface VariableCreatePayload {
  name: string;
  dataType: CDataType;
  value: string | number | boolean | null;
  sizeBytes?: number;
  address?: string;
  scope?: string;
}

export interface VariableUpdatePayload {
  name: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
  expression?: string;
  calculatedValue?: string | number | boolean | null;
}

export interface ConditionPayload {
  expression: string;
  substitutedExpression?: string;
  result: boolean;
  branch: "then" | "else" | null;
}

export interface LoopIterationPayload {
  loopType: "for" | "while" | "do-while";
  iteration: number;
  conditionExpression?: string;
  isConditionMet?: boolean;
}

export interface FunctionCallPayload {
  functionName: string;
  arguments: Array<{ name: string; value: string | number | boolean; type: CDataType }>;
  callLine: number;
}

export interface FunctionReturnPayload {
  functionName: string;
  returnValue?: string | number | boolean | null;
  returnLine: number;
}

export interface OutputPayload {
  text: string;
}

export interface ErrorPayload {
  message: string;
  line?: number;
  type?: string;
  suggestion?: string;
}

// Universal Execution Event Contract
export interface ExecutionEvent {
  id: number;
  type: ExecutionEventType;
  line?: number;
  timestamp?: number;
  payload: Record<string, unknown>;
}

// Single Variable Representation in Notional Machine
export interface VariableState {
  name: string;
  type: CDataType;
  value: string | number | boolean | null;
  previousValue?: string | number | boolean | null;
  sizeBytes: number;
  address: string;
  isUpdated: boolean;
  scope: string;
}

// Function Activation Record (Stack Frame)
export interface StackFrame {
  id: string;
  functionName: string;
  callLine: number;
  returnLine?: number;
  returnValue?: string | number | boolean | null;
  parameters?: Array<{ name: string; value: string | number | boolean; type: CDataType; originalArg?: string }>;
  variables: Record<string, VariableState>;
}

// Function Return Record (for bubbling return values to call site)
export interface FunctionReturnState {
  functionName: string;
  returnValue: string | number | boolean | null;
  returnLine: number;
}

// Condition State (for if / else branching)
export interface ConditionState {
  line: number;
  expression: string;
  substitutedExpression?: string;
  result: boolean;
  branchTaken: "then" | "else" | null;
}

// Loop State (for for / while / do-while)
export interface LoopState {
  line: number;
  loopType: "for" | "while" | "do-while";
  iteration: number;
  conditionExpression?: string;
  isConditionMet: boolean;
}

// Pedagogical Explanation Entry
export interface ExplanationEntry {
  step: number;
  line?: number;
  headline: string;
  detail: string;
}

// Complete Immutable Program State at step t
export interface ProgramState {
  status: "idle" | "running" | "paused" | "completed" | "error";
  currentLine: number;
  variables: Record<string, VariableState>;
  callStack: StackFrame[];
  activeCondition: ConditionState | null;
  activeLoop: LoopState | null;
  lastFunctionReturn: FunctionReturnState | null;
  stdout: string;
  stderr: string;
  explanation: string | null;
  explanationHistory: ExplanationEntry[];
  currentEventIndex: number;
  totalEvents: number;
}
