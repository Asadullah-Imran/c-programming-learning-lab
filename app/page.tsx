"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Cpu, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  // Interactive mini-demo state for the hero section
  const [demoStep, setDemoStep] = useState<number>(0);

  const demoSteps = [
    {
      line: 1,
      code: "int age = 20;",
      action: "Variable Creation",
      explanation: "A 4-byte block of memory is allocated on the stack. The identifier 'age' is bound to address 0x7FFE with initial value 20.",
      variables: [{ name: "age", type: "int", size: "4 bytes", value: 20, status: "created" }],
      condition: null,
      stdout: "",
    },
    {
      line: 2,
      code: "age = age + 1;",
      action: "Assignment Mutation",
      explanation: "Evaluating expression: age (20) + 1 = 21. Value 21 is written into the memory location of 'age'.",
      variables: [{ name: "age", type: "int", size: "4 bytes", value: 21, status: "updated" }],
      condition: null,
      stdout: "",
    },
    {
      line: 3,
      code: "if (age >= 21) {",
      action: "Condition Evaluation",
      explanation: "Evaluating boolean expression: 21 >= 21 evaluates to TRUE (1). Program enters the IF body.",
      variables: [{ name: "age", type: "int", size: "4 bytes", value: 21, status: "active" }],
      condition: { expr: "21 >= 21", result: true },
      stdout: "",
    },
    {
      line: 4,
      code: "    printf(\"Eligible!\\n\");",
      action: "Standard Output (stdout)",
      explanation: "Formatted string is sent to standard output stream via printf syscall.",
      variables: [{ name: "age", type: "int", size: "4 bytes", value: 21, status: "active" }],
      condition: null,
      stdout: "Eligible!\n",
    },
  ];

  const current = demoSteps[demoStep];

  const handleNext = () => {
    setDemoStep((prev) => (prev + 1) % demoSteps.length);
  };

  const handleReset = () => {
    setDemoStep(0);
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-purple-500/10 blur-[140px] -z-10 pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated/80 border border-surface-border text-xs font-medium text-sky-400 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Built for First-Trimester ICS Novices</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Mental Model Lab</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Make Invisible C Execution{" "}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Visible.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
            Stop guessing what happens between compilation and output. Observe variables mutate in memory, track conditional branching, and step through loops line-by-line.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/lab">
              <Button size="lg" variant="glow" className="gap-2">
                <Terminal className="w-4 h-4" />
                <span>Launch Interactive Lab</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="secondary" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Explore Curriculum</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Interactive Hero Demo / Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-surface-border bg-surface/90 shadow-glass overflow-hidden">
            {/* Window title bar */}
            <div className="h-11 bg-surface-muted/90 border-b border-surface-border px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">demo_execution.c</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">
                  Step <strong className="text-sky-400">{demoStep + 1}</strong> of {demoSteps.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button size="sm" variant="secondary" onClick={handleReset} className="h-7 px-2 text-xs gap-1">
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </Button>
                  <Button size="sm" variant="glow" onClick={handleNext} className="h-7 px-2.5 text-xs gap-1">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Next Step</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Split view: Code vs Live Notional Machine State */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px]">
              {/* Left Column: Monaco Code Simulation */}
              <div className="lg:col-span-6 bg-[#0B0F17] p-6 font-mono text-sm border-b lg:border-b-0 lg:border-r border-surface-border flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 mb-4 pb-2 border-b border-surface-border/60 flex items-center justify-between">
                    <span>SOURCE CODE</span>
                    <span className="text-sky-400/80 text-[10px]">C99 Standard</span>
                  </div>
                  <div className="space-y-1.5">
                    {demoSteps.map((s, idx) => {
                      const isActive = s.line === current.line;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 px-2 py-1 rounded transition-all ${
                            isActive
                              ? "bg-sky-500/15 border-l-2 border-sky-400 text-white font-semibold"
                              : "text-slate-400 hover:text-slate-300"
                          }`}
                        >
                          <span className="text-slate-600 select-none text-xs w-5 text-right">
                            {s.line}
                          </span>
                          <span className="flex-1 font-mono">{s.code}</span>
                          {isActive && (
                            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-3 px-2 py-1 text-slate-400">
                      <span className="text-slate-600 select-none text-xs w-5 text-right">5</span>
                      <span className="font-mono">{"}"}</span>
                    </div>
                  </div>
                </div>

                {/* Virtual Stdout */}
                <div className="mt-6 pt-3 border-t border-surface-border/60">
                  <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" />
                    <span>TERMINAL OUTPUT (stdout)</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface-muted/80 font-mono text-xs text-emerald-400 min-h-[36px] flex items-center">
                    {current.stdout ? (
                      <span>&gt; {current.stdout}</span>
                    ) : (
                      <span className="text-slate-600 italic">No output produced yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Notional Machine Visualization */}
              <div className="lg:col-span-6 bg-surface-muted/30 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-border/60">
                    <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-sky-400" />
                      PROGRAM STATE (NOTIONAL MACHINE)
                    </span>
                    <Badge variant={current.action === "Assignment Mutation" ? "warning" : "int"} size="sm">
                      {current.action}
                    </Badge>
                  </div>

                  {/* Variable Cards in Scope */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                      Stack Variables:
                    </div>
                    {current.variables.map((v, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          v.status === "updated"
                            ? "bg-amber-500/10 border-amber-500/40 shadow-glow animate-value-flash"
                            : "bg-surface-elevated/80 border-surface-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-base">{v.name}</span>
                            <Badge variant="int" size="sm">
                              {v.type} ({v.size})
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-slate-400">Current Value</div>
                            <div className="text-xl font-mono font-extrabold text-sky-400">
                              {v.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Condition branch if active */}
                    {current.condition && (
                      <div className="mt-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono flex items-center justify-between">
                        <div>
                          <div className="text-slate-400 text-[10px]">Condition Evaluated</div>
                          <div className="text-white font-bold">{current.condition.expr}</div>
                        </div>
                        <Badge variant="success">TRUE (1) ✓</Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pedagogical "Why?" Explanation */}
                <div className="mt-6 p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs leading-relaxed text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-sky-400 mb-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why did this happen?</span>
                  </div>
                  <p className="text-slate-300">{current.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for How Beginners Actually Learn
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Traditional IDEs hide the execution pipeline. Our lab unpacks every clock cycle of program state into clean, intuitive models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Code Lab */}
          <Link href="/lab" className="group">
            <Card className="h-full hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-2 group-hover:scale-105 transition-transform">
                  <Terminal className="w-5 h-5" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  Interactive Code Lab
                </CardTitle>
                <CardDescription>
                  Write C code in Monaco Editor and step forward or backward through execution with zero setup friction.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1 text-xs font-medium text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Playground</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Curriculum */}
          <Link href="/learn" className="group">
            <Card className="h-full hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <CardTitle className="group-hover:text-purple-400 transition-colors">
                  Visual Curriculum
                </CardTitle>
                <CardDescription>
                  8 modular lessons covering variables, data types, operators, conditionals, loops, and functions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1 text-xs font-medium text-purple-400 group-hover:translate-x-1 transition-transform">
                  <span>Browse Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 3: Manual Tracing */}
          <Link href="/practice" className="group">
            <Card className="h-full hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <CardTitle className="group-hover:text-emerald-400 transition-colors">
                  Manual Tracing Mode
                </CardTitle>
                <CardDescription>
                  Train your mental computer. Fill in trace tables line-by-line and verify predictions with instant grading.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Start Tracing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 4: "Why?" Engine */}
          <Link href="/lab" className="group">
            <Card className="h-full hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <CardTitle className="group-hover:text-amber-400 transition-colors">
                  Contextual "Why?" Engine
                </CardTitle>
                <CardDescription>
                  Natural language explanations of mutations, branch decisions, and stack frame allocations.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-1 text-xs font-medium text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>See How It Works</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* The Foundational Architecture Callout */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-2xl border border-surface-border bg-gradient-to-br from-surface to-surface-muted relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>THE ARCHITECTURAL PRINCIPLE</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Pure Unidirectional Execution Pipeline
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              We never run untrusted C code inside your browser or perform fragile regex hacks. Student C code is parsed into an Abstract Syntax Tree (AST), instrumented with non-intrusive trace probes, compiled with GCC/Clang, executed inside an isolated sandbox, and streamed back as deterministic execution events.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-border/80">
                <div className="text-xs font-mono font-semibold text-white">1. C AST Parsing</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Syntactic analysis discovers declarations, branches, and loop nodes.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-border/80">
                <div className="text-xs font-mono font-semibold text-white">2. Event Streaming</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Runtime probes emit immutable JSON execution snapshots.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-border/80">
                <div className="text-xs font-mono font-semibold text-white">3. Deterministic Reducer</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Pure state transitions render memory transitions and step history.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
