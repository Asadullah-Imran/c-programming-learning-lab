"use client";

import React from "react";
import { 
  Play, 
  Pause, 
  StepBack, 
  StepForward, 
  RotateCcw, 
  Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onSetSpeed: (speed: number) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onJumpToStep: (step: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onSetSpeed,
  onStepForward,
  onStepBackward,
  onTogglePlay,
  onReset,
  onJumpToStep,
  hasNext,
  hasPrev,
}) => {
  const speedOptions = [
    { label: "0.5x", value: 2000 },
    { label: "1.0x", value: 1000 },
    { label: "2.0x", value: 500 },
  ];

  return (
    <div className="bg-surface-elevated/90 border border-surface-border rounded-xl p-3 shadow-glass flex flex-col gap-3">
      {/* Top Bar: VCR Buttons & Speed */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Playback Button Group */}
        <div className="flex items-center gap-1.5">
          {/* Reset */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onReset}
            title="Reset to beginning"
            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          {/* Step Back */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onStepBackward}
            disabled={!hasPrev}
            title="Step Backward (Time Travel)"
            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
          >
            <StepBack className="w-3.5 h-3.5" />
          </Button>

          {/* Play / Pause Toggle */}
          <Button
            size="sm"
            variant={isPlaying ? "secondary" : "glow"}
            onClick={onTogglePlay}
            title={isPlaying ? "Pause Execution" : "Auto-Play Execution"}
            className="h-8 px-3.5 text-xs font-semibold gap-1.5"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{hasNext ? "Run" : "Replay"}</span>
              </>
            )}
          </Button>

          {/* Step Forward */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onStepForward}
            disabled={!hasNext}
            title="Step Forward (Next Event)"
            className="h-8 px-2.5 text-xs text-slate-300 hover:text-white"
          >
            <StepForward className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-surface-muted/90 p-1 rounded-lg border border-surface-border text-[11px] font-mono">
          <Gauge className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSetSpeed(opt.value)}
              className={`px-2 py-0.5 rounded transition-all ${
                speed === opt.value
                  ? "bg-primary text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Interactive Progress Scrubber */}
      <div className="flex items-center gap-3 pt-1 border-t border-surface-border/60">
        <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
          Step <strong className="text-sky-400">{currentStep}</strong> / {totalSteps}
        </span>

        <input
          type="range"
          min={0}
          max={totalSteps}
          value={currentStep}
          onChange={(e) => onJumpToStep(Number(e.target.value))}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
        />

        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
          {Math.round((currentStep / (totalSteps || 1)) * 100)}%
        </span>
      </div>
    </div>
  );
};
