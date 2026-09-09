import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "int"
    | "char"
    | "float"
    | "double"
    | "pointer"
    | "success"
    | "warning"
    | "danger"
    | "purple"
    | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-md transition-colors select-none";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variantStyles = {
    default: "bg-surface-elevated text-slate-300 border border-surface-border",
    int: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    char: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    float: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    double: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    pointer: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    purple: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    outline: "bg-transparent text-slate-400 border border-slate-700",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
