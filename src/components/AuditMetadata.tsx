"use client";

import type { AuditResult } from "@/types/audit";
import { Download, Clock, Globe, Layers } from "lucide-react";
import { formatDate, truncateUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AuditMetadata({ result }: { result: AuditResult }) {
  function handleExport() {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessibility-audit-${new URL(result.url).hostname}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--muted)]">
      <dl className="flex flex-wrap gap-x-6 gap-y-1">
        <div className="flex items-center gap-1.5">
          <Globe size={12} aria-hidden="true" />
          <dt className="sr-only">URL</dt>
          <dd
            className="font-mono truncate max-w-[200px] sm:max-w-xs"
            title={result.url}
          >
            {truncateUrl(result.url)}
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} aria-hidden="true" />
          <dt className="sr-only">Scanned at</dt>
          <dd>{formatDate(result.timestamp)}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers size={12} aria-hidden="true" />
          <dt className="sr-only">Elements analyzed</dt>
          <dd>{result.totalElements.toLocaleString()} elements</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={handleExport}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-3 py-1.5 text-xs font-medium",
          "text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors",
          "focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        )}
        aria-label="Export audit results as JSON"
      >
        <Download size={12} aria-hidden="true" />
        Export JSON
      </button>
    </div>
  );
}
