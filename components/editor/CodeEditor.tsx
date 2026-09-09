"use client";

import React, { useRef, useEffect } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  code: string;
  onChange?: (newCode: string) => void;
  currentLine?: number;
  isReadOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  currentLine = 1,
  isReadOnly = false,
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

    if (currentLine && currentLine > 0) {
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
    } else {
      // Clear decorations if no active line
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
    }
  }, [currentLine]);

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
        onChange={(val) => onChange?.(val || "")}
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
