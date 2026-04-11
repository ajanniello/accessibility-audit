"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const CODE_MESSAGES: Record<string, { title: string; hint: string }> = {
  BOT_BLOCKED: {
    title: "Site blocked automated access",
    hint: "This site uses Cloudflare or similar bot protection. Try a different URL, or a page that doesn't require authentication.",
  },
  TIMEOUT: {
    title: "Page load timed out",
    hint: "The page took too long to respond. It may be slow, unreachable, or require a login.",
  },
  INVALID_URL: {
    title: "Invalid URL",
    hint: "Check the URL format — it should start with https:// and point to a publicly accessible page.",
  },
  FETCH_FAILED: {
    title: "Could not reach the page",
    hint: "The URL may be incorrect, the server may be down, or the page may require authentication.",
  },
  UNKNOWN: {
    title: "Something went wrong",
    hint: "An unexpected error occurred. Please try again with a different URL.",
  },
};

interface ErrorStateProps {
  error: string;
  code?: string;
  url?: string;
}

export default function ErrorState({ error, code = "UNKNOWN", url }: ErrorStateProps) {
  const meta = CODE_MESSAGES[code] ?? CODE_MESSAGES.UNKNOWN;

  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-24 px-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertTriangle
          size={32}
          className="text-amber-500 dark:text-amber-400"
          aria-hidden="true"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">{meta.title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-sm">{meta.hint}</p>
        {error && error !== meta.title && (
          <p className="mt-2 text-xs text-[var(--muted)] font-mono bg-[var(--card)] border border-[var(--card-border)] rounded px-3 py-2 max-w-sm break-all">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {url && (
          <Link
            href={`/results?url=${encodeURIComponent(url)}`}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
              "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            )}
          >
            <RefreshCw size={14} aria-hidden="true" />
            Try again
          </Link>
        )}
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium",
            "border border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-colors"
          )}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          New audit
        </Link>
      </div>
    </div>
  );
}
