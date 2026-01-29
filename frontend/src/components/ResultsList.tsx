"use client";

import { ResultCard } from "./ResultCard";
import type { SearchQuery } from "@/lib/api";

interface ResultsListProps {
  queries: SearchQuery[];
}

export function ResultsList({ queries }: ResultsListProps) {
  // Group queries by platform
  const groupedQueries = queries.reduce((acc, query) => {
    if (!acc[query.platform]) {
      acc[query.platform] = [];
    }
    acc[query.platform].push(query);
    return acc;
  }, {} as Record<string, SearchQuery[]>);

  const platformNames: Record<string, string> = {
    getty: "Getty Images",
    shutterstock: "Shutterstock",
    adobe: "Adobe Stock",
    unsplash: "Unsplash",
    pexels: "Pexels",
  };

  let globalIndex = 0;

  return (
    <div className="space-y-8">
      {Object.entries(groupedQueries).map(([platform, platformQueries]) => (
        <div key={platform}>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            {platformNames[platform] || platform}
          </h3>
          <div className="space-y-3">
            {platformQueries.map((query) => {
              const index = globalIndex++;
              return <ResultCard key={`${platform}-${index}`} query={query} index={index} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
