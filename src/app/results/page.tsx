"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { AuditResult, AuditError } from "@/types/audit";
import type { Category } from "@/lib/categories";
import { CATEGORY_LABELS, getCategoryForViolation } from "@/lib/categories";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import AuditSummaryBar from "@/components/AuditSummaryBar";
import AuditMetadata from "@/components/AuditMetadata";
import CategoryFilter from "@/components/CategoryFilter";
import ViolationCard from "@/components/ViolationCard";
import PassedChecksAccordion from "@/components/PassedChecksAccordion";
import { cn } from "@/lib/utils";

export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[var(--muted)]">Loading…</div>}>
      <ResultsPage />
    </Suspense>
  );
}

function ResultsPage() {
  const params = useSearchParams();
  const url = params.get("url") ?? "";

  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<AuditError | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  useEffect(() => {
    if (!url) {
      setError({ error: "No URL provided.", code: "INVALID_URL" });
      setLoading(false);
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || "error" in data) {
          setError(data as AuditError);
        } else {
          setResult(data as AuditResult);
        }
      })
      .catch((err) => {
        setError({ error: err.message, code: "UNKNOWN" });
      })
      .finally(() => setLoading(false));
  }, [url]);

  // Compute category counts from violations
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: 0,
      color: 0,
      images: 0,
      keyboard: 0,
      aria: 0,
      forms: 0,
      structure: 0,
    };
    if (!result) return counts;
    for (const v of result.violations) {
      const cat = getCategoryForViolation(v.tags);
      counts[cat]++;
      counts.all++;
    }
    return counts;
  }, [result]);

  const filteredViolations = useMemo(() => {
    if (!result) return [];
    if (selectedCategory === "all") return result.violations;
    return result.violations.filter(
      (v) => getCategoryForViolation(v.tags) === selectedCategory
    );
  }, [result, selectedCategory]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar url={url} />
        <LoadingState url={url} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar url={url} />
        <ErrorState error={error.error} code={error.code} url={url} />
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopBar url={url} />

      <main
        className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6"
        id="main-content"
      >
        {/* Metadata */}
        <AuditMetadata result={result} />

        {/* Summary */}
        <AuditSummaryBar result={result} />

        {/* Violations section */}
        <section aria-labelledby="violations-heading">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <h2
              id="violations-heading"
              className="text-base font-bold text-[var(--foreground)]"
            >
              {result.violations.length === 0
                ? "No violations found"
                : `${result.violations.length} violation${result.violations.length !== 1 ? "s" : ""} found`}
            </h2>
          </div>

          {result.violations.length > 0 ? (
            <>
              <div className="mb-4">
                <CategoryFilter
                  counts={categoryCounts}
                  selected={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>

              {filteredViolations.length > 0 ? (
                <ul className="space-y-3" aria-label="Accessibility violations">
                  {filteredViolations.map((v) => (
                    <li key={v.id}>
                      <ViolationCard violation={v} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)] py-8 text-center">
                  No violations in the &quot;{CATEGORY_LABELS[selectedCategory]}&quot; category.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 p-8 text-center">
              <p className="text-green-700 dark:text-green-400 font-semibold">
                No accessibility violations detected!
              </p>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                This page passed all WCAG 2.1 AA checks that axe-core can
                automatically detect.
              </p>
            </div>
          )}
        </section>

        {/* Passed checks */}
        <PassedChecksAccordion passes={result.passes} />
      </main>
    </div>
  );
}

function TopBar({ url }: { url: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--card-border)] bg-[var(--card)]/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors",
            "focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          )}
          aria-label="Back to home"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span className="hidden sm:inline">New audit</span>
        </Link>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-[var(--foreground)] truncate">
            AccessiScan
          </span>
          {url && (
            <>
              <span className="text-[var(--card-border)] hidden sm:inline" aria-hidden="true">
                /
              </span>
              <span className="text-xs text-[var(--muted)] font-mono truncate hidden sm:block">
                {url}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
