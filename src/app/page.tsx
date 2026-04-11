import UrlInputForm from "@/components/UrlInputForm";
import { ShieldCheck, Eye, Keyboard, Contrast } from "lucide-react";

const FEATURES = [
  {
    icon: Contrast,
    title: "Color Contrast",
    description: "Detect text and UI elements that fail WCAG 1.4.3 contrast ratio requirements.",
  },
  {
    icon: Eye,
    title: "Images & Alt Text",
    description: "Find images missing descriptive alternative text for screen reader users.",
  },
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description: "Identify elements that can't be reached or operated via keyboard alone.",
  },
  {
    icon: ShieldCheck,
    title: "ARIA & Roles",
    description: "Validate ARIA labels, landmarks, and semantic roles for assistive technology.",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section
        className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center"
        aria-labelledby="hero-heading"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] mb-8">
          <ShieldCheck size={12} className="text-[var(--accent)]" aria-hidden="true" />
          WCAG 2.1 AA compliance checker
        </div>

        {/* Heading */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-3xl leading-tight"
        >
          Audit any website for{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            accessibility
          </span>
        </h1>

        <p className="mt-6 text-lg text-[var(--muted)] max-w-xl leading-relaxed">
          Paste a URL and get an instant report on color contrast, missing alt
          text, keyboard issues, ARIA errors, and more — powered by{" "}
          <span className="text-[var(--foreground)] font-medium">axe-core</span>, the
          industry standard engine used by Deque, Google, and Microsoft.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl mt-10">
          <UrlInputForm />
        </div>

        {/* How it works */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-2 text-sm text-[var(--muted)]">
          {["Enter a URL", "We run a WCAG audit", "See full results"].map(
            (step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden sm:block text-[var(--card-border)]">
                    →
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs font-bold"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {step}
                </span>
              </span>
            )
          )}
        </div>
      </section>

      {/* Features */}
      <section
        className="border-t border-[var(--card-border)] bg-[var(--card)] px-6 py-16"
        aria-labelledby="features-heading"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            id="features-heading"
            className="text-center text-sm font-semibold text-[var(--muted)] uppercase tracking-widest mb-10"
          >
            What we check
          </h2>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
          >
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex flex-col gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-5"
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--accent)]/10"
                  aria-hidden="true"
                >
                  <Icon size={20} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] px-6 py-6 text-center text-xs text-[var(--muted)]">
        <p>
          Built with{" "}
          <a
            href="https://www.deque.com/axe/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            axe-core
          </a>{" "}
          and Playwright ·{" "}
          <a
            href="https://www.w3.org/WAI/WCAG21/quickref/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:underline"
          >
            WCAG 2.1 guidelines
          </a>
        </p>
      </footer>
    </main>
  );
}
