# Multi-stage Dockerfile for Sandboxed C Execution Worker
FROM python:3.11-slim-bullseye AS base

# Install GCC, Clang, build essentials, and isolation tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    clang \
    make \
    libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency definition
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . /app/

# Pre-compile runtime tracer
RUN gcc -Wall -Wextra -std=c99 -c /app/tracer/tracer.c -o /app/tracer/tracer.o

# Run as non-root user for security isolation
RUN useradd -m -u 1001 sandboxuser && chown -R sandboxuser:sandboxuser /app
USER sandboxuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
