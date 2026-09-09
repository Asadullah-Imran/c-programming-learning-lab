"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Terminal, 
  BookOpen, 
  CheckCircle2, 
  LayoutDashboard, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/lab", label: "Code Lab", icon: Terminal, badge: "Interactive" },
    { href: "/learn", label: "Learn", icon: BookOpen, badge: "8 Lessons" },
    { href: "/practice", label: "Practice", icon: CheckCircle2, badge: "Trace Mode" },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 p-[1px] shadow-glow transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <span className="font-mono font-bold text-lg bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
                C:
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                ICS C Lab
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Execution & Mental Model Lab
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-muted/60 p-1.5 rounded-xl border border-surface-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-surface-elevated text-primary shadow-sm border border-surface-border"
                    : "text-slate-400 hover:text-slate-200 hover:bg-surface-elevated/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface/80 text-slate-400 border border-slate-700/50">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>Sign In</span>
          </Link>

          <Link href="/lab">
            <Button size="sm" variant="glow" className="gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Lab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
