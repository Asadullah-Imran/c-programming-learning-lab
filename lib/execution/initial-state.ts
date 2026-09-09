import { ProgramState } from "@/types/execution";

/**
 * Generates a clean, deterministic initial ProgramState.
 */
export function createInitialProgramState(totalEvents: number = 0): ProgramState {
  return {
    status: "idle",
    currentLine: 1,
    variables: {},
    callStack: [
      {
        id: "frame-main",
        functionName: "main",
        callLine: 1,
        variables: {},
      },
    ],
    activeCondition: null,
    activeLoop: null,
    stdout: "",
    stderr: "",
    explanation: "Program initialized. Ready to execute.",
    explanationHistory: [],
    currentEventIndex: 0,
    totalEvents,
  };
}
