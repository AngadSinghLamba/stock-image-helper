"use client";

import { ChevronDown, Sparkles, Zap, Brain, Bot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const MODELS: Model[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Best quality, recommended",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Faster, good quality",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    description: "Creative, detailed",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Fast, Google's model",
    icon: <Bot className="w-4 h-4" />,
  },
];

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODELS.find((m) => m.id === value) || MODELS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-purple)] transition-colors min-w-[180px]"
      >
        <span className="text-[var(--color-purple)]">{selectedModel.icon}</span>
        <span className="text-sm font-medium text-[var(--color-text-primary)]">
          {selectedModel.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-auto text-[var(--color-text-muted)] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-lg z-50 overflow-hidden">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onChange(model.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[var(--color-surface)] transition-colors ${
                model.id === value ? "bg-[var(--color-surface)]" : ""
              }`}
            >
              <span
                className={`mt-0.5 ${
                  model.id === value
                    ? "text-[var(--color-purple)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {model.icon}
              </span>
              <div>
                <div
                  className={`text-sm font-medium ${
                    model.id === value
                      ? "text-[var(--color-purple)]"
                      : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {model.name}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {model.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
