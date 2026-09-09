"""
ICS C Programming Learning Lab — Linux / POSIX Sandbox Isolation
Enforces CPU timeouts, memory caps, and process containment for untrusted C execution.
"""

import os
import sys
import resource

def set_sandbox_limits(max_cpu_seconds: int = 2, max_memory_mb: int = 64):
    """
    Applies POSIX resource limits (rlimit) to the current child process before exec.
    """
    try:
        # Max CPU Time (seconds)
        resource.setrlimit(resource.RLIMIT_CPU, (max_cpu_seconds, max_cpu_seconds + 1))
        
        # Max Virtual Memory (Bytes)
        max_bytes = max_memory_mb * 1024 * 1024
        if hasattr(resource, 'RLIMIT_AS'):
            resource.setrlimit(resource.RLIMIT_AS, (max_bytes, max_bytes))
            
        # Max output file size (1MB max to prevent disk fills)
        resource.setrlimit(resource.RLIMIT_FSIZE, (1024 * 1024, 1024 * 1024))
        
        # Prevent core dumps
        if hasattr(resource, 'RLIMIT_CORE'):
            resource.setrlimit(resource.RLIMIT_CORE, (0, 0))
    except Exception as e:
        # Log or ignore if running on non-POSIX/restricted environments
        pass
