# ICS C Programming Learning Lab — Deployment & Operations Guide

This guide details how to build, test, containerize, and deploy the **ICS C Programming Learning Lab** in local development, isolated Docker containers, and production cloud environments (Vercel, Supabase, Render/Fly.io/AWS).

---

## 🏗️ Architecture Overview

The system is organized into a clean, decoupled two-tier architecture:

```
+-------------------------------------------------------------+
|                      Client Browser                         |
|  - Next.js 14 App Router UI                                 |
|  - Monaco Code Editor (VS Code Engine)                      |
|  - Deterministic State Reducer (Notional Machine)           |
+------------------------------+------------------------------+
                               | HTTPS / JSON
                               v
+-------------------------------------------------------------+
|               Next.js Application Gateway                   |
|  - /lab, /learn, /practice, /dashboard                      |
|  - REST APIs: /api/execute, /api/progress                   |
+------------------------------+------------------------------+
                               | RPC / Subprocess (Local / Container)
                               v
+-------------------------------------------------------------+
|            Sandboxed C Execution Service                    |
|  - C AST Parser & Probe Instrumenter                        |
|  - GCC / Clang C99 Compiler Engine                          |
|  - Telemetry Logger (tracer.c / tracer.h)                   |
|  - Process Containment (Resource & Loop Limit Jails)        |
+-------------------------------------------------------------+
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **C Compiler**: GCC or Clang (`gcc --version` or `clang --version`)
- **Python**: 3.9+ (optional for microservice runner)

### 2. Install & Run
```bash
# Clone the repository
git clone https://github.com/Asadullah-Imran/c-programming-learning-lab.git
cd c-programming-learning-lab

# Install Node dependencies
npm install

# Run all 8 automated unit & integration test suites
npm test

# Start the Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Containerized Deployment (Docker & Docker Compose)

The multi-container setup runs the Next.js frontend and the isolated Python/C execution worker with hard resource bounds.

### Build and Launch
```bash
# Build and run containers in background
docker-compose up --build -d

# Check status and healthchecks
docker-compose ps

# View real-time logs
docker-compose logs -f
```

- **Frontend App**: `http://localhost:3000`
- **Execution Microservice**: `http://localhost:8000` (`/health`, `/execute`)

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a project on [Supabase](https://supabase.com).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Paste and run the schema file located at [`lib/db/schema.sql`](./lib/db/schema.sql).
4. Copy your project credentials into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
> **Note:** If Supabase credentials are not provided, the application automatically runs in resilient **Local Storage Demo Mode**, enabling instant out-of-the-box exploration.

---

## 🧪 Automated Testing Pipeline

Run all test suites across the platform:
```bash
npm test
```

| Suite | Focus Area |
| :--- | :--- |
| `tests/execution-reducer.test.ts` | Pure state reducer, immutability, state transitions |
| `tests/instrumenter.test.ts` | C AST parser, probe injection, compilation |
| `tests/execute-api.test.ts` | API execution endpoint, error diagnostics, timeouts |
| `tests/practice-evaluator.test.ts` | Trace tables, predict output, bug spotter evaluator |
| `tests/curriculum.test.ts` | 8-module syllabus integrity, quiz answer keys |
| `tests/database-progress.test.ts` | Mastery calculation, streaks, XP aggregation |
| `tests/security-sandbox.test.ts` | Runaway loop containment, memory bounds, error translator |
| `tests/e2e-workflow.test.ts` | Full student lifecycle: code -> compile -> trace -> dashboard |
