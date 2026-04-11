"use client";

import type { AuditResult } from "@/types/audit";
import ScoreDonut from "./ScoreDonut";
import { ShieldCheck, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const IMPACT_CONFIG = {
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400" },
  serious:  { label: "Serious",  color: "bg-orange-500", textColor: "text-orange-600 dark:text-orange-400" },
  moderate: { label: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-400" },
  minor:    { label: "Minor",    color: "bg-blue-400",   textColor: "text-blue-600 dark:text-blue-400" },
};

function wcagLevel(violations: AuditResult["violations"]): string {
  const tags = violations.flatMap((v) => v.tags);
  if (tags.includes("wcag2a") || tags.includes("wcag21aa")) {
    return "Fails WCAG 2.1 AA";
  }
  return "Passes WCAG 2.1 AA";
}

export default function AuditSummaryBar({ result }: { result: AuditResult }) {
  const totalViolations = result.violations.length;
  const level = wcagLevel(result.violations);
  const passing = level.startsWith("Passes");

  return (
    <section
      className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-sm"
      aria-labelledby="summary-heading"
    >
      <h2 id="summary-heading" className="sr-only">
        Audit summary
      </h2>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Donut + grade */}
        <div className="flex flex-col items-center gap-2">
          <ScoreDonut score={result.score} grade={result.grade} />
          <div className="text-center">
            <span
              className={cn(
                "text-2xl font-black",
                result.grade === "A" ? "text-green-500" :
                result.grade === "B" ? "text-lime-500" :
                result.grade === "C" ? "text-yellow-500" :
                result.grade === "D" ? "text-orange-500" : "text-red-500"
              )}
            >
              Grade {result.grade}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 w-full">
          {/* WCAG badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4",
              passing
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}
          >
            {passing ? (
              <ShieldCheck size={12} aria-hidden="true" />
            ) : (
              <AlertTriangle size={12} aria-hidden="true" />
            )}
            {level}
          </div>

          {/* Stats grid */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(Object.entries(result.violationCount) as [keyof typeof IMPACT_CONFIG, number][]).map(
              ([impact, count]) => (
                <div key={impact} className="text-center">
                  <dt className="text-xs text-[var(--muted)] mb-1">
                    {IMPACT_CONFIG[impact].label}
                  </dt>
                  <dd
                    className={cn(
                      "text-2xl font-bold",
                      IMPACT_CONFIG[impact].textColor
                    )}
                  >
                    {count}
                  </dd>
                </div>
              )
            )}
          </dl>

          {/* Progress bar breakdown */}
          {totalViolations > 0 && (
            <div
              className="mt-4 flex rounded-full overflow-hidden h-2"
              role="img"
              aria-label="Violation severity breakdown"
            >
              {(Object.entries(result.violationCount) as [keyof typeof IMPACT_CONFIG, number][]).map(
                ([impact, count]) =>
                  count > 0 ? (
                    <div
                      key={impact}
                      className={IMPACT_CONFIG[impact].color}
                      style={{ width: `${(count / totalViolations) * 100}%` }}
                      title={`${IMPACT_CONFIG[impact].label}: ${count}`}
                    />
                  ) : null
              )}
            </div>
          )}

          {/* Quick stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1">
              <Info size={12} aria-hidden="true" />
              {result.violations.length} violation{result.violations.length !== 1 ? "s" : ""} found
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-green-500" aria-hidden="true" />
              {result.passes.length} checks passed
            </span>
            <span>axe-core v{result.axeVersion}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
