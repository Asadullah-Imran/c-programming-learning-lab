import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "ICS C Programming Learning Lab | Interactive Visual Execution",
  description:
    "An interactive visual programming lab designed for first-trimester undergraduate novices learning C. Understand memory, state changes, conditions, and loops through step-by-step execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        
        {/* Footer */}
        <footer className="border-t border-surface-border bg-surface-muted/40 py-8 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 font-semibold">ICS C Programming Learning Lab</span>
              <span>•</span>
              <span>Pedagogical Notional Machine for Novices</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Phase 1: Foundation
              </span>
              <span>Next.js 14 + TypeScript</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
