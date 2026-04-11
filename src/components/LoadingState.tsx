"use client";

import { useEffect, useState } from "react";
import { Globe, Cpu, ClipboardList, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Globe, text: "Launching headless browser…", duration: 2000 },
  { icon: Globe, text: "Loading page and assets…", duration: 4000 },
  { icon: Cpu, text: "Running accessibility checks…", duration: 5000 },
  { icon: ClipboardList, text: "Processing results…", duration: 1500 },
  { icon: Sparkles, text: "Almost done…", duration: Infinity },
];

export default function LoadingState({ url }: { url: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    let currentStep = 0;

    const advance = () => {
      if (currentStep < STEPS.length - 1) {
        elapsed += STEPS[currentStep].duration;
        currentStep++;
        setStepIndex(currentStep);
        if (STEPS[currentStep].duration !== Infinity) {
          setTimeout(advance, STEPS[currentStep].duration);
        }
      }
    };

    const timer = setTimeout(advance, STEPS[0].duration);
    return () => clearTimeout(timer);
  }, []);

  const Icon = STEPS[stepIndex].icon;

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 py-24 px-6 text-center"
      role="status"
      aria-live="polite"
      aria-label="Accessibility audit in progress"
    >
      {/* Animated spinner */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-[var(--card-border)] border-t-[var(--accent)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            size={28}
            className="text-[var(--accent)]"
            aria-hidden="true"
          />
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold text-[var(--foreground)]">
          Auditing accessibility
        </p>
        <p className="mt-1 text-sm text-[var(--muted)] max-w-sm">
          {STEPS[stepIndex].text}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)] font-mono truncate max-w-xs">
          {url}
        </p>
      </div>

      {/* Step progress dots */}
      <div className="flex gap-2" aria-hidden="true">
        {STEPS.slice(0, -1).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i <= stepIndex
                ? "bg-[var(--accent)] scale-110"
                : "bg-[var(--card-border)]"
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] max-w-xs">
        This typically takes 5–15 seconds. We&apos;re running a full WCAG 2.1 AA
        audit using axe-core.
      </p>
    </div>
  );
}
