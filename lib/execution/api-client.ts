import { ExecutionResponse } from "./compiler-runner";

/**
 * Client helper to invoke the sandboxed C execution API endpoint.
 */
export async function executeUserCode(code: string): Promise<ExecutionResponse> {
  try {
    const res = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      return {
        status: "runtime_error",
        events: [],
        stdout: "",
        stderr: errJson.stderr || errJson.error || `Server responded with status ${res.status}`,
        error: errJson.error || `HTTP error ${res.status}`,
      };
    }

    return await res.json();
  } catch (err: any) {
    return {
      status: "runtime_error",
      events: [],
      stdout: "",
      stderr: err.message || "Network error while connecting to execution runner.",
      error: err.message || "Network failure",
    };
  }
}
