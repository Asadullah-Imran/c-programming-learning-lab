"""
ICS C Programming Learning Lab — Execution Service API
FastAPI microservice for sandboxed C execution.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from runner import execute_c_code

app = FastAPI(
    title="ICS C Programming Execution Service",
    description="Sandboxed C execution worker with AST instrumentation and trace event stream",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExecuteRequest(BaseModel):
    code: str = Field(..., description="C source code to instrument and execute")
    timeout_seconds: Optional[float] = Field(2.0, description="Execution timeout in seconds")

class ExecuteResponse(BaseModel):
    status: str
    events: List[Dict[str, Any]]
    stdout: str
    stderr: str
    error: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "c-execution-worker"}

@app.post("/api/execute", response_model=ExecuteResponse)
def execute(req: ExecuteRequest):
    if len(req.code) > 50000:
        raise HTTPException(status_code=400, detail="Source code exceeds 50KB limit")
    
    result = execute_c_code(req.code, timeout_seconds=req.timeout_seconds or 2.0)
    return result
