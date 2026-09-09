"use client";

import React from "react";
import { CDataType } from "@/types/execution";
import { Badge } from "@/components/ui/badge";

interface DataTypeBadgeProps {
  type: CDataType;
  showSize?: boolean;
}

export const DataTypeBadge: React.FC<DataTypeBadgeProps> = ({ type, showSize = false }) => {
  const sizeMap: Record<CDataType, number> = {
    int: 4,
    char: 1,
    float: 4,
    double: 8,
    pointer: 8,
    void: 0,
  };

  const badgeVariant =
    type === "char"
      ? "char"
      : type === "float"
      ? "float"
      : type === "double"
      ? "double"
      : type === "pointer"
      ? "purple"
      : "int";

  return (
    <Badge variant={badgeVariant} size="sm" className="font-mono text-[10px]">
      {type}
      {showSize && ` (${sizeMap[type] ?? 4}B)`}
    </Badge>
  );
};
