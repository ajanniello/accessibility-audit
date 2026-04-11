"use client";

import { useState } from "react";
import type { Violation } from "@/types/audit";
import { ChevronDown, ExternalLink, AlertOctagon, AlertTriangle, AlertCircle, Info, Users, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExplainer } from "@/lib/violationExplainers";

const IMPACT_CONFIG = {
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    border: "border-l-red-500",
    ring: "focus-visible:ring-red-500",
  },
  serious: {
    label: "Serious",
    icon: AlertTriangle,
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    border: "border-l-orange-500",
    ring: "focus-visible:ring-orange-500",
  },
  moderate: {
    label: "Moderate",
    icon: AlertCircle,
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    border: "border-l-yellow-500",
    ring: "focus-visible:ring-yellow-500",
  },
  minor: {
    label: "Minor",
    icon: Info,
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-l-blue-400",
    ring: "focus-visible:ring-blue-400",
  },
};

function extractWcagCriteria(tags: string[]): string[] {
  return tags
    .filter((t) => t.startsWith("wcag") && /\d/.test(t))
    .map((t) => {
      const clean = t.replace("wcag", "").replace(/^21/, "2.1.");
      if (clean.length === 3) return `WCAG ${clean[0]}.${clean[1]}.${clean[2]}`;
      if (clean.startsWith("2.1.")) return `WCAG ${clean}`;
      return `WCAG ${clean}`;
    })
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);
}

export default function ViolationCard({ violation }: { violation: Violation }) {
  const [expanded, setExpanded] = useState(false);
  const config = IMPACT_CONFIG[violation.impact] ?? IMPACT_CONFIG.minor;
  const Icon = config.icon;
  const wcagCriteria = extractWcagCriteria(violation.tags);
  const headingId = `violation-${violation.id}`;
  const explainer = getExplainer(violation.id);

  return (
    <article
      className={cn(
        "rounded-xl border border-[var(--card-border)] border-l-4 bg-[var(--card)] shadow-sm overflow-hidden",
        config.border
      )}
      aria-labelledby={headingId}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          "w-full text-left p-5 flex items-start gap-4 group transition-colors",
          "hover:bg-[var(--background)] focus-visible:ring-2 focus-visible:ring-inset",
          config.ring
        )}
        aria-expanded={expanded}
        aria-controls={`${headingId}-body`}
      >
        <Icon
          size={20}
          className="shrink-0 mt-0.5 text-[var(--muted)]"
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Impact badge */}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                config.badge
              )}
              aria-label={`Impact level: ${config.label}`}
            >
              {config.label}
            </span>

            {/* WCAG criteria */}
            {wcagCriteria.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {c}
              </span>
            ))}

            {/* Element count */}
            <span className="ml-auto text-xs text-[var(--muted)]">
              {violation.nodes.length} element{violation.nodes.length !== 1 ? "s" : ""}
            </span>
          </div>

          <h3
            id={headingId}
            className="text-sm font-semibold text-[var(--foreground)] leading-snug"
          >
            {violation.help}
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted)] line-clamp-2">
            {violation.description}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 mt-1 text-[var(--muted)] transition-transform duration-200",
            expanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expanded body */}
      {expanded && (
        <div
          id={`${headingId}-body`}
          className="border-t border-[var(--card-border)] px-5 pb-5 space-y-5"
        >
          {/* Plain-language explainer */}
          <div className="mt-5 rounded-xl bg-[var(--background)] border border-[var(--card-border)] p-4 space-y-3">
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
              {explainer.plainSummary}
            </p>

            <div className="flex items-start gap-2">
              <Users
                size={14}
                className="shrink-0 mt-0.5 text-[var(--accent)]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-0.5">
                  Who is affected
                </p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {explainer.whoIsAffected}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Lightbulb
                size={14}
                className="shrink-0 mt-0.5 text-amber-500"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-semibold text-[var(--foreground)] mb-0.5">
                  Real-world impact
                </p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {explainer.realWorldImpact}
                </p>
              </div>
            </div>
          </div>

          {/* How to fix */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2">
              How to fix
            </h4>
            <p className="text-sm text-[var(--foreground)]">
              {violation.nodes[0]?.failureSummary
                ?.replace("Fix any of the following:\n", "")
                ?.replace("Fix all of the following:\n", "")
                ?.trim() ?? "See the axe documentation for remediation guidance."}
            </p>
            <a
              href={violation.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs text-[var(--accent)] hover:underline"
            >
              Learn more at Deque University
              <ExternalLink size={10} aria-hidden="true" />
            </a>
          </div>

          {/* Affected elements */}
          {violation.nodes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-2">
                Affected elements ({violation.nodes.length})
              </h4>
              <ul className="space-y-2" aria-label="Affected HTML elements">
                {violation.nodes.slice(0, 5).map((node, i) => (
                  <li key={i}>
                    <pre className="text-xs bg-[var(--background)] border border-[var(--card-border)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">
                      <code>{node.html.length > 200 ? node.html.slice(0, 200) + "…" : node.html}</code>
                    </pre>
                    {node.target.length > 0 && (
                      <p className="text-xs text-[var(--muted)] mt-1 font-mono">
                        Selector: {node.target.join(" > ")}
                      </p>
                    )}
                  </li>
                ))}
                {violation.nodes.length > 5 && (
                  <li className="text-xs text-[var(--muted)]">
                    … and {violation.nodes.length - 5} more element{violation.nodes.length - 5 !== 1 ? "s" : ""}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
