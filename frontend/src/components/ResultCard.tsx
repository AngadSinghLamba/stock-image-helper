"use client";

import { Copy, ExternalLink, Heart, Check } from "lucide-react";
import { useState } from "react";
import type { SearchQuery } from "@/lib/api";

interface ResultCardProps {
  query: SearchQuery;
  index: number;
}

const PLATFORM_BADGES: Record<string, { class: string; label: string }> = {
  getty: { class: "badge-getty", label: "Getty Images" },
  shutterstock: { class: "badge-shutterstock", label: "Shutterstock" },
  adobe: { class: "badge-adobe", label: "Adobe Stock" },
  unsplash: { class: "badge-unsplash", label: "Unsplash" },
  pexels: { class: "badge-pexels", label: "Pexels" },
};

export function ResultCard({ query, index }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const platform = PLATFORM_BADGES[query.platform] || {
    class: "bg-gray-500",
    label: query.platform,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(query.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInPlatform = () => {
    window.open(query.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="animate-develop p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:border-[var(--color-purple)] hover:shadow-[var(--shadow-glow)] transition-all group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Query text */}
      <div className="font-mono text-sm text-[var(--color-text-primary)] mb-2 leading-relaxed">
        {query.query}
      </div>

      {/* Reasoning */}
      <div className="text-xs text-[var(--color-text-muted)] mb-4">
        {query.reasoning}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            copied
              ? "bg-[var(--color-success)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>

        <button
          onClick={handleOpenInPlatform}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-all ${platform.class} hover:opacity-90`}
        >
          Open in {platform.label}
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={() => setFavorited(!favorited)}
          className={`ml-auto p-1.5 rounded-md transition-all ${
            favorited
              ? "text-[var(--color-pink)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-pink)]"
          }`}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  );
}
