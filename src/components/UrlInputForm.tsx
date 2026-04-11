"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ExternalLink, AlertCircle } from "lucide-react";
import { cn, isValidUrl } from "@/lib/utils";

const EXAMPLE_URLS = [
  { label: "W3C (accessible)", url: "https://www.w3.org" },
  { label: "BBC News", url: "https://www.bbc.com/news" },
  { label: "Wikipedia", url: "https://en.wikipedia.org" },
];

export default function UrlInputForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const raw = url.trim();
    if (!raw) {
      setError("Please enter a URL to audit.");
      return;
    }

    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    if (!isValidUrl(normalized)) {
      setError("Please enter a valid URL (e.g. https://example.com).");
      return;
    }

    startTransition(() => {
      router.push(`/results?url=${encodeURIComponent(normalized)}`);
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border-2 bg-[var(--card)] px-4 py-3 shadow-lg transition-all",
            error
              ? "border-red-400 dark:border-red-500"
              : "border-[var(--card-border)] focus-within:border-[var(--accent)]"
          )}
        >
          <Search
            className="shrink-0 text-[var(--muted)]"
            size={20}
            aria-hidden="true"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError("");
            }}
            placeholder="https://example.com"
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none text-base"
            aria-label="Website URL to audit"
            aria-describedby={error ? "url-error" : undefined}
            aria-invalid={!!error}
            disabled={isPending}
            autoComplete="url"
            autoFocus
          />
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "shrink-0 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all",
              "bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]",
              "disabled:opacity-60 disabled:cursor-not-allowed"
            )}
            aria-label={isPending ? "Running audit..." : "Run accessibility audit"}
          >
            {isPending ? "Auditing…" : "Audit"}
          </button>
        </div>

        {error && (
          <p
            id="url-error"
            role="alert"
            className="flex items-center gap-1.5 mt-2 text-sm text-red-500 dark:text-red-400"
          >
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        <span>Try an example:</span>
        {EXAMPLE_URLS.map((ex) => (
          <button
            key={ex.url}
            type="button"
            onClick={() => setUrl(ex.url)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1",
              "text-[var(--foreground)] text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            )}
          >
            <ExternalLink size={10} aria-hidden="true" />
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
