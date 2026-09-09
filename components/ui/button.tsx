import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glow" | "ghost" | "outline" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-primary text-slate-950 font-semibold hover:bg-primary-hover shadow-sm hover:shadow-glow focus:ring-primary",
      secondary:
        "bg-surface-elevated text-slate-200 hover:bg-slate-700 border border-surface-border hover:border-slate-600 focus:ring-slate-500",
      glow:
        "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-semibold shadow-glow hover:shadow-glow-purple hover:brightness-110 focus:ring-sky-400",
      ghost:
        "bg-transparent text-slate-300 hover:text-white hover:bg-surface-muted focus:ring-slate-500",
      outline:
        "bg-transparent border border-surface-border text-slate-300 hover:text-white hover:border-primary/50 hover:bg-primary-muted/20 focus:ring-primary",
      danger:
        "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 focus:ring-rose-500",
      success:
        "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 focus:ring-emerald-500",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-2.5 gap-2.5",
      icon: "p-2 h-9 w-9",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
