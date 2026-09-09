"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ProgramState, ExecutionEvent } from "@/types/execution";
import { executionReducer } from "@/lib/execution/reducer";
import { createInitialProgramState } from "@/lib/execution/initial-state";
import { 
  ALL_MOCK_SCENARIOS, 
  MockScenario, 
  SCENARIO_VARIABLE_SWAP 
} from "@/lib/execution/mock-events";

export interface ExecutionController {
  scenario: MockScenario;
  code: string;
  setCode: (code: string) => void;
  state: ProgramState;
  history: ProgramState[];
  isPlaying: boolean;
  speed: number;
  setSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  togglePlay: () => void;
  reset: () => void;
  jumpToStep: (stepIndex: number) => void;
  loadScenario: (scenarioId: string) => void;
  hasNextStep: boolean;
  hasPrevStep: boolean;
}

export function useExecutionController(
  initialScenarioId: string = SCENARIO_VARIABLE_SWAP.id
): ExecutionController {
  // Find scenario or fallback to default
  const defaultScenario = 
    ALL_MOCK_SCENARIOS.find((s) => s.id === initialScenarioId) || SCENARIO_VARIABLE_SWAP;

  const [scenario, setScenario] = useState<MockScenario>(defaultScenario);
  const [code, setCode] = useState<string>(defaultScenario.code);
  const [speed, setSpeed] = useState<number>(1000); // 1s default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // State machine snapshots
  const [state, setState] = useState<ProgramState>(() =>
    createInitialProgramState(defaultScenario.events.length)
  );
  const [history, setHistory] = useState<ProgramState[]>([]);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Step Forward: calculate next state and append current to history
  const stepForward = useCallback(() => {
    setState((prevState) => {
      if (prevState.currentEventIndex >= scenario.events.length) {
        setIsPlaying(false);
        return prevState;
      }

      const nextEvent = scenario.events[prevState.currentEventIndex];
      const nextState = executionReducer(prevState, nextEvent);

      setHistory((prevHistory) => [...prevHistory, prevState]);
      return nextState;
    });
  }, [scenario.events]);

  // Step Backward: restore last snapshot from history
  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const lastState = prevHistory[prevHistory.length - 1];
      setState(lastState);
      return prevHistory.slice(0, -1);
    });
  }, []);

  // Reset to initial clean state
  const reset = useCallback(() => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
    setHistory([]);
    setState(createInitialProgramState(scenario.events.length));
  }, [scenario.events.length]);

  // Jump to specific step index
  const jumpToStep = useCallback(
    (targetIndex: number) => {
      setIsPlaying(false);
      const safeIndex = Math.max(0, Math.min(targetIndex, scenario.events.length));

      let currentState = createInitialProgramState(scenario.events.length);
      const newHistory: ProgramState[] = [];

      for (let i = 0; i < safeIndex; i++) {
        newHistory.push(currentState);
        currentState = executionReducer(currentState, scenario.events[i]);
      }

      setHistory(newHistory);
      setState(currentState);
    },
    [scenario.events]
  );

  // Switch scenarios
  const loadScenario = useCallback((scenarioId: string) => {
    const selected = ALL_MOCK_SCENARIOS.find((s) => s.id === scenarioId);
    if (!selected) return;

    setIsPlaying(false);
    setScenario(selected);
    setCode(selected.code);
    setHistory([]);
    setState(createInitialProgramState(selected.events.length));
  }, []);

  // Auto-play interval effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setState((prevState) => {
          if (prevState.currentEventIndex >= scenario.events.length) {
            setIsPlaying(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            return prevState;
          }

          const nextEvent = scenario.events[prevState.currentEventIndex];
          const nextState = executionReducer(prevState, nextEvent);
          setHistory((prevHistory) => [...prevHistory, prevState]);
          return nextState;
        });
      }, speed);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, speed, scenario.events]);

  const togglePlay = useCallback(() => {
    if (state.currentEventIndex >= scenario.events.length) {
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [state.currentEventIndex, scenario.events.length, reset]);

  const hasNextStep = state.currentEventIndex < scenario.events.length;
  const hasPrevStep = history.length > 0;

  return {
    scenario,
    code,
    setCode,
    state,
    history,
    isPlaying,
    speed,
    setSpeed,
    stepForward,
    stepBackward,
    togglePlay,
    reset,
    jumpToStep,
    loadScenario,
    hasNextStep,
    hasPrevStep,
  };
}
