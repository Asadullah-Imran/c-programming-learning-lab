'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide footer on full-height IDE and lab workspaces
  if (pathname.startsWith('/lab')) {
    return null;
  }

  return (
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
            Phase 9: Active
          </span>
          <span>Next.js 14 + TypeScript</span>
        </div>
      </div>
    </footer>
  );
};
