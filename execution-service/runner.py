"""
ICS C Programming Learning Lab — Python Sandbox Runner
Compiles instrumented C code with GCC and executes with sandbox resource limits.
"""

import os
import sys
import json
import shutil
import tempfile
import subprocess
from pathlib import Path
from typing import Dict, Any, List

from instrumenter import CInstrumenterPy
from sandbox import set_sandbox_limits

def execute_c_code(source_code: str, timeout_seconds: float = 2.0) -> Dict[str, Any]:
    instrumenter = CInstrumenterPy()
    
    # Auto-wrap if main() is missing
    normalized = source_code.strip()
    if "main(" not in normalized and "main (" not in normalized:
        normalized = f"int main() {{\n{normalized}\n    return 0;\n}}"

    instrumentation = instrumenter.instrument(normalized)
    tracer_dir = Path(__file__).parent / "tracer"
    tracer_c = tracer_dir / "tracer.c"

    with tempfile.TemporaryDirectory(prefix="ics_c_py_") as tmpdir:
        tmp_path = Path(tmpdir)
        src_file = tmp_path / "main.c"
        bin_file = tmp_path / "program_bin"

        src_file.write_text(instrumentation["instrumented_code"])

        # Compile with GCC
        compile_cmd = [
            "gcc", "-Wall", "-Wextra", "-std=c99",
            str(src_file), str(tracer_c),
            f"-I{tracer_dir}",
            "-o", str(bin_file)
        ]
        
        compile_proc = subprocess.run(compile_cmd, capture_output=True, text=True)
        if compile_proc.returncode != 0:
            return {
                "status": "compile_error",
                "events": [
                    {
                        "id": 1,
                        "type": "compile_error",
                        "line": 1,
                        "payload": {"message": compile_proc.stderr}
                    }
                ],
                "stdout": "",
                "stderr": compile_proc.stderr,
                "error": compile_proc.stderr,
            }

        # Run with resource limits
        try:
            run_proc = subprocess.run(
                [str(bin_file)],
                preexec_fn=lambda: set_sandbox_limits(max_cpu_seconds=int(timeout_seconds)),
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
            )
        except subprocess.TimeoutExpired:
            timeout_msg = f"Execution timed out after {timeout_seconds}s (possible infinite loop)."
            return {
                "status": "timeout",
                "events": [
                    {
                        "id": 1,
                        "type": "timeout",
                        "line": 1,
                        "payload": {"message": timeout_msg}
                    }
                ],
                "stdout": "",
                "stderr": timeout_msg,
                "error": timeout_msg,
            }

        # Parse telemetry from stderr
        events: List[Dict[str, Any]] = []
        raw_stderr_lines: List[str] = []

        for line in run_proc.stderr.splitlines():
            if line.startswith("__ICS_TRACE__:"):
                try:
                    events.append(json.loads(line.replace("__ICS_TRACE__:", "").trim() if hasattr(line, 'trim') else line.replace("__ICS_TRACE__:", "").strip()))
                except Exception:
                    pass
            elif line.strip():
                raw_stderr_lines.append(line)

        return {
            "status": "success",
            "events": events,
            "stdout": run_proc.stdout,
            "stderr": "\n".join(raw_stderr_lines),
        }
