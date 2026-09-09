"use client";

import React, { useState } from "react";
import { VariableState } from "@/types/execution";
import { VariableCard } from "./VariableCard";
import { LayoutGrid, Table, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VariableGridProps {
  variables: Record<string, VariableState>;
}

export const VariableGrid: React.FC<VariableGridProps> = ({ variables }) => {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const variableList = Object.values(variables);

  if (variableList.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border p-8 text-center flex flex-col items-center justify-center gap-3 bg-surface-muted/20">
        <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-slate-500 border border-surface-border">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">No Variables in Scope</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">
            Click <strong>Next Step</strong> to step through variable declarations (e.g. <code className="text-sky-400 font-mono">int a = 5;</code>) and observe memory allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Bar: Count & View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-slate-400">
          Total Active: <strong className="text-white">{variableList.length}</strong> variable{variableList.length > 1 ? "s" : ""}
        </div>

        <div className="flex items-center gap-1 bg-surface-muted/80 p-0.5 rounded-lg border border-surface-border text-xs">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "cards"
                ? "bg-surface-elevated text-primary shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded transition-colors ${
              viewMode === "table"
                ? "bg-surface-elevated text-primary shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Table View"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* View Mode: Cards */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {variableList.map((v) => (
            <VariableCard key={v.name} variable={v} />
          ))}
        </div>
      ) : (
        /* View Mode: Compact Table */
        <div className="rounded-xl border border-surface-border overflow-hidden bg-surface-muted/30">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface-elevated/80 border-b border-surface-border text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Address</th>
                <th className="py-2.5 px-3">Identifier</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3 text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {variableList.map((v) => (
                <tr
                  key={v.name}
                  className={`transition-colors ${
                    v.isUpdated
                      ? "bg-amber-500/10 text-amber-300 font-semibold"
                      : "hover:bg-surface-elevated/40 text-slate-200"
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-500">{v.address}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{v.name}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="int" size="sm">
                      {v.type}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{v.sizeBytes} B</td>
                  <td className="py-2.5 px-3 text-right font-bold text-sky-400">
                    {v.value !== null && v.value !== undefined ? String(v.value) : "uninit"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
