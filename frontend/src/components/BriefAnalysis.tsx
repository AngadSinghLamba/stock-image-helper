"use client";

import type { BriefAnalysis as BriefAnalysisType } from "@/lib/api";

interface BriefAnalysisProps {
  analysis: BriefAnalysisType;
}

export function BriefAnalysis({ analysis }: BriefAnalysisProps) {
  const items = [
    { label: "Subject", value: analysis.subject },
    { label: "Setting", value: analysis.setting },
    { label: "Lighting", value: analysis.lighting },
    { label: "Mood", value: analysis.mood },
    { label: "Composition", value: analysis.composition },
    { label: "Style", value: analysis.style },
  ];

  return (
    <div className="animate-develop">
      <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
        Brief Analysis
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
              {item.label}
            </div>
            <div className="text-sm text-[var(--color-text-primary)] font-medium truncate">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
