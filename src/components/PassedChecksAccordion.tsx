"use client";

import { useState } from "react";
import type { PassedCheck } from "@/types/audit";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PassedChecksAccordion({ passes }: { passes: PassedCheck[] }) {
  const [open, setOpen] = useState(false);

  if (passes.length === 0) return null;

  return (
    <section
      className="rounded-xl border border-[var(--card-border)] bg-[var(--card)]"
      aria-labelledby="passed-heading"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[var(--background)] transition-colors rounded-xl focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
        aria-expanded={open}
        aria-controls="passed-body"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={20}
            className="text-green-500 shrink-0"
            aria-hidden="true"
          />
          <div>
            <h2 id="passed-heading" className="text-sm font-semibold text-[var(--foreground)]">
              Checks Passed
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {passes.length} accessibility rule{passes.length !== 1 ? "s" : ""} passed
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-[var(--muted)] transition-transform duration-200 shrink-0",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id="passed-body"
          className="border-t border-[var(--card-border)] p-5"
        >
          <ul className="space-y-2" aria-label="Passed accessibility checks">
            {passes.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-3 text-sm py-2 border-b border-[var(--card-border)] last:border-0"
              >
                <CheckCircle2
                  size={14}
                  className="text-green-500 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <span className="font-medium text-[var(--foreground)]">{p.help}</span>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
