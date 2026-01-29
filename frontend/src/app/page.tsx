"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";
import { PlatformSelector } from "@/components/PlatformSelector";
import { BriefAnalysis } from "@/components/BriefAnalysis";
import { ResultsList } from "@/components/ResultsList";
import { generateQueries, type GenerateResponse } from "@/lib/api";
import toast from "react-hot-toast";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [platforms, setPlatforms] = useState(["getty", "shutterstock"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    if (!brief.trim()) {
      toast.error("Please enter a creative brief");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateQueries({
        brief: brief.trim(),
        model,
        platforms,
      });
      setResult(response);
      toast.success(`Generated ${response.queries.length} queries`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate queries";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
          Find the perfect{" "}
          <span className="gradient-text">stock images</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Describe what you&apos;re looking for and we&apos;ll generate optimized search
          queries for multiple stock image platforms.
        </p>
      </div>

      {/* Input Section */}
      <div className="card mb-6">
        <label
          htmlFor="brief"
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
        >
          Describe the image you&apos;re looking for
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Ford truck in a rugged outdoor setting, sunrise lighting, cinematic feel, wide landscape shot. Should evoke adventure and reliability."
          className="w-full h-32 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] resize-none focus:outline-none focus:border-[var(--color-purple)] focus:ring-1 focus:ring-[var(--color-purple)] transition-colors"
        />

        {/* Options Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1">
                Model
              </label>
              <ModelSelector value={model} onChange={setModel} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !brief.trim()}
            className="btn-gradient flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Queries
              </>
            )}
          </button>
        </div>

        {/* Platform Selection */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
          <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-2">
            Platforms
          </label>
          <PlatformSelector value={platforms} onChange={setPlatforms} />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 rounded-lg border border-[var(--color-error)] bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center gap-2 text-[var(--color-error)]">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Brief Analysis */}
          <div className="card">
            <BriefAnalysis analysis={result.brief_analysis} />
          </div>

          {/* Model Used Badge */}
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <span>Generated using</span>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] font-medium text-[var(--color-text-secondary)]">
              {result.model_used}
            </span>
          </div>

          {/* Query Results */}
          <ResultsList queries={result.queries} />
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-surface)] mb-4">
            <Sparkles className="w-8 h-8 text-[var(--color-purple)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            Ready to find images
          </h3>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Enter a creative brief above and we&apos;ll generate optimized search
            queries tailored for each platform.
          </p>
        </div>
      )}
    </div>
  );
}
