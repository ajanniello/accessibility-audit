"use client";

import type { Category } from "@/lib/categories";
import { CATEGORY_LABELS } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  counts: Record<Category, number>;
  selected: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({
  counts,
  selected,
  onChange,
}: CategoryFilterProps) {
  const categories = Object.keys(CATEGORY_LABELS) as Category[];

  return (
    <nav aria-label="Filter violations by category">
      <ul
        className="flex flex-wrap gap-2"
        role="list"
      >
        {categories.map((cat) => {
          const isSelected = cat === selected;
          const count = counts[cat];
          if (cat !== "all" && count === 0) return null;

          return (
            <li key={cat}>
              <button
                type="button"
                onClick={() => onChange(cat)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  "border focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1",
                  isSelected
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm"
                    : "border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)]"
                )}
                aria-pressed={isSelected}
                aria-label={`${CATEGORY_LABELS[cat]}: ${count} issue${count !== 1 ? "s" : ""}`}
              >
                {CATEGORY_LABELS[cat]}
                {count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[1.25rem] text-center",
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[var(--background)] text-[var(--muted)]"
                    )}
                    aria-hidden="true"
                  >
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
