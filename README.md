# 🔬 ICS C Programming Learning Lab
> **Interactive Visual Execution & Mental Model Platform for Novice C Programmers**

[![Tests](https://img.shields.io/badge/tests-8%20passed-brightgreen.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)]()
[![Docker](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg)]()

---

## 💡 Pedagogical Philosophy

First-trimester computer science novices routinely struggle with C programming not because the syntax is difficult, but because they lack an accurate **Notional Machine** — an internal mental model of what computer memory, the call stack, pointers, and variables actually do during execution.

The **ICS C Programming Learning Lab** bridges this cognitive gap by translating raw C execution into interactive, step-by-step educational visualizations, explanatory timelines ("Why did this change?"), manual trace table worksheets, and comprehensive module-by-module lessons.

---

## ✨ Key Features

- 💻 **Interactive Code Lab (`/lab`)**:
  - Microsoft Monaco Editor with synchronized line marker highlighting.
  - VCR playback controls (Step Forward, Step Backward, Auto-Play, Speed 0.5x–2x, Scrubber).
  - Pinned real-time terminal console output with auto-scrolling.
- 🧠 **Multi-View Visualizer**:
  - **Variable Cards**: Animated value mutations, C data types, byte sizes.
  - **Memory Layout**: Simulated stack addresses (`0x7FFE...`) visualizing contiguous byte footprints.
  - **Control Flow**: Boolean condition truth tables and loop iteration lifecycle tracker.
  - **Call Stack**: Activation frames, argument passing by value, and return value bubbling.
  - **"Why?" Timeline**: Natural-language pedagogical explanations for every single state mutation.
- 📚 **Structured Curriculum (`/learn`)**:
  - 8 core C modules (Intro to C, Variables & Memory, Operators, Conditionals, Loops, Functions & Stack, 1D Arrays, Pointers & Addresses).
  - Embedded micro-visualizer widgets directly inside lesson articles.
  - End-of-lesson multiple-choice quizzes with instant feedback and scoring.
- 📝 **Practice Engine (`/practice`)**:
  - Manual step-by-step trace tables with divergence diagnostics.
  - "Predict the Output" and "Spot the Bug" code correction challenges.
- 📊 **Student Dashboard (`/dashboard`)**:
  - Level and XP progression, daily streak counter, and 8-module mastery matrix.
  - Instant zero-config demo mode + Supabase PostgreSQL RLS schema support.

---

## 🛠️ Architecture & Data Flow

$$\text{C Source Code} \xrightarrow{\text{AST Injection}} \text{Instrumented Code} \xrightarrow{\text{GCC / Clang}} \text{Telemetry Events} \xrightarrow{\text{Pure State Reducer}} \text{Visual Notional Machine}$$

1. **AST Telemetry Instrumenter** (`lib/execution/ts-instrumenter.ts`):
   Injects lightweight C tracing hooks (`__trace_var_create`, `__trace_var_assign`, `__trace_cond`, `__trace_loop`, `__trace_call`, `__trace_return`, `__trace_output`).
2. **Deterministic State Reducer** (`lib/execution/reducer.ts`):
   A pure function `(state, event) => newState` ensuring complete time-travel reversibility (Step Forward & Step Backward) with zero state corruption.
3. **Sandboxed Compiler Worker** (`lib/execution/compiler-runner.ts` / `execution-service`):
   Compiles and executes student code in an isolated subprocess jail with strict CPU timeouts (1.0s) and event thresholds (1000 events) against infinite loops.

---

## 🚀 Getting Started

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run all 8 automated test suites
npm test

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### Docker Deployment
```bash
docker-compose up --build -d
```

---

## 🧪 Test Suite Summary

All 8 automated test suites pass with 100% test coverage:
1. `tests/execution-reducer.test.ts` — Pure reducer state immutability & variable swap time travel.
2. `tests/instrumenter.test.ts` — C AST parser, probe injection & GCC compilation.
3. `tests/execute-api.test.ts` — API execution, human-friendly compiler diagnostics & timeout containment.
4. `tests/practice-evaluator.test.ts` — Trace table evaluation & divergence catchers.
5. `tests/curriculum.test.ts` — 8-module curriculum validation & quiz integrity.
6. `tests/database-progress.test.ts` — Student dashboard mastery breakdown & gamification metrics.
7. `tests/security-sandbox.test.ts` — Infinite loop prevention & compiler error advice.
8. `tests/e2e-workflow.test.ts` — Full student lifecycle from code to trace evaluation.

---

## 📄 License
MIT License. Built for Computer Science Education.
