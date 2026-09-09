import { NextRequest, NextResponse } from "next/server";
import { executeSandboxedC } from "@/lib/execution/compiler-runner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          status: "compile_error",
          error: "No source code provided in request body.",
          events: [],
          stdout: "",
          stderr: "Request must include a non-empty 'code' string.",
        },
        { status: 400 }
      );
    }

    if (code.length > 50000) {
      return NextResponse.json(
        {
          status: "compile_error",
          error: "Source code exceeds maximum allowed length of 50KB.",
          events: [],
          stdout: "",
          stderr: "Code too large.",
        },
        { status: 400 }
      );
    }

    // Execute through sandboxed C compiler runner
    const result = await executeSandboxedC(code);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "runtime_error",
        error: error.message || "An unexpected error occurred during execution.",
        events: [],
        stdout: "",
        stderr: error.message || "Internal execution failure",
      },
      { status: 500 }
    );
  }
}
