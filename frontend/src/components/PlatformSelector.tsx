"use client";

import { Check } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  badgeClass: string;
}

const PLATFORMS: Platform[] = [
  { id: "getty", name: "Getty Images", badgeClass: "badge-getty" },
  { id: "shutterstock", name: "Shutterstock", badgeClass: "badge-shutterstock" },
  { id: "adobe", name: "Adobe Stock", badgeClass: "badge-adobe" },
  { id: "unsplash", name: "Unsplash", badgeClass: "badge-unsplash" },
  { id: "pexels", name: "Pexels", badgeClass: "badge-pexels" },
];

interface PlatformSelectorProps {
  value: string[];
  onChange: (platforms: string[]) => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    if (value.includes(platformId)) {
      // Don't allow deselecting all platforms
      if (value.length > 1) {
        onChange(value.filter((p) => p !== platformId));
      }
    } else {
      onChange([...value, platformId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((platform) => {
        const isSelected = value.includes(platform.id);
        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => togglePlatform(platform.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? `${platform.badgeClass} text-white`
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-purple)]"
            }`}
          >
            {isSelected && <Check className="w-3 h-3" />}
            {platform.name}
          </button>
        );
      })}
    </div>
  );
}
