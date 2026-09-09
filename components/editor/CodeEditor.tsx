"use client";

// ==============================================================================
// ICS C Programming Learning Lab — Monaco Code Editor Component
// ==============================================================================

import React, { useRef, useEffect } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { CompileErrorInfo } from "@/types/execution";

interface CodeEditorProps {
  code: string;
  onChange?: (newCode: string) => void;
  currentLine?: number;
  isReadOnly?: boolean;
  compileError?: CompileErrorInfo | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  currentLine = 1,
  isReadOnly = false,
  compileError = null,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);

  // Configure custom dark educational theme for Monaco
  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("icsDarkTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "38BDF8", fontStyle: "bold" },      // Cyan keywords (int, if, while)
        { token: "type", foreground: "A855F7" },                             // Purple types
        { token: "number", foreground: "F59E0B" },                           // Amber numbers
        { token: "string", foreground: "34D399" },                           // Emerald strings
        { token: "comment", foreground: "64748B", fontStyle: "italic" },     // Slate comments
        { token: "identifier", foreground: "F8FAFC" },                        // White variables
        { token: "delimiter", foreground: "94A3B8" },                         // Muted operators
      ],
      colors: {
        "editor.background": "#070B12",
        "editor.foreground": "#F8FAFC",
        "editorLineNumber.foreground": "#334155",
        "editorLineNumber.activeForeground": "#38BDF8",
        "editor.lineHighlightBackground": "#0F172A40",
        "editorGutter.background": "#070B12",
        "editorCursor.foreground": "#38BDF8",
        "editor.selectionBackground": "#1E3A8A60",
      },
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Synchronize dynamic line highlight decorations with currentLine
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;

    if (currentLine && currentLine > 0 && !compileError) {
      // Reveal line smoothly
      editor.revealLineInCenterIfOutsideViewport(currentLine);

      // Apply line background glow & glyph decorations
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: "line-highlight-active",
            glyphMarginClassName: "active-glyph-arrow",
          },
        },
      ]);
    } else if (!compileError) {
      // Clear decorations if no active line
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [currentLine, compileError]);

  // Synchronize Compiler / Syntax Errors with Monaco Model Markers (Red squiggly underlines)
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;

    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    if (compileError) {
      const totalLines = model.getLineCount();
      const errLine = Math.min(Math.max(1, compileError.line || 1), Math.max(1, totalLines));
      const lineLength = model.getLineLength(errLine) || 100;
      const errCol = Math.min(Math.max(1, compileError.column || 1), lineLength + 1);

      // Reveal error line
      editor.revealLineInCenter(errLine);

      // Set Red Squiggly Error Markers in Monaco
      monaco.editor.setModelMarkers(model, "c-compiler", [
        {
          startLineNumber: errLine,
          startColumn: errCol,
          endLineNumber: errLine,
          endColumn: lineLength + 1,
          message: `${compileError.message}\n💡 Hint: ${compileError.suggestion || "Check syntax on this line."}`,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);

      // Set gutter error glyph decoration
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(errLine, 1, errLine, 1),
          options: {
            isWholeLine: true,
            className: "bg-rose-950/40 border-l-2 border-rose-500",
            glyphMarginClassName: "active-glyph-error",
          },
        },
      ]);
    } else {
      // Clear markers when no error
      monaco.editor.setModelMarkers(model, "c-compiler", []);
    }
  }, [compileError]);

  const handleCodeChange = (newVal: string) => {
    // Clear compiler markers when student edits code
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, "c-compiler", []);
      }
    }
    onChange?.(newVal);
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#070B12]">
      <Editor
        height="100%"
        defaultLanguage="c"
        language="c"
        theme="icsDarkTheme"
        value={code}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={(val) => handleCodeChange(val || "")}
        options={{
          readOnly: isReadOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), monospace",
          fontLigatures: true,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          glyphMargin: true,
          renderLineHighlight: "none",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 12, bottom: 12 },
          folding: false,
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
        }}
        loading={
          <div className="w-full h-full flex items-center justify-center bg-[#070B12] text-xs font-mono text-slate-500">
            Initializing C Editor...
          </div>
        }
      />
    </div>
  );
};
