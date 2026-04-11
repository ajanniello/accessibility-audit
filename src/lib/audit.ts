import { chromium } from "playwright";
import path from "path";
import { computeScore, computeGrade, countByImpact } from "./score";
import type { AuditResult, Violation, PassedCheck, IncompleteCheck } from "@/types/audit";

const axeCorePath = path.join(process.cwd(), "node_modules", "axe-core", "axe.js");

export async function runAudit(url: string): Promise<AuditResult> {
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    const page = await context.newPage();

    // addInitScript runs before any page JavaScript executes — before the page's
    // Trusted Types policy is set up — so it is never blocked by TrustedScript /
    // TrustedScriptURL restrictions (e.g. YouTube, Google).
    await page.addInitScript({ path: axeCorePath });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      // Wait a bit for dynamic content
      await page.waitForTimeout(1500);
    } catch (navErr) {
      const msg = navErr instanceof Error ? navErr.message : String(navErr);
      if (msg.includes("timeout") || msg.includes("Timeout")) {
        throw Object.assign(new Error("Page load timed out"), { code: "TIMEOUT" });
      }
      throw Object.assign(new Error("Failed to load page: " + msg), {
        code: "FETCH_FAILED",
      });
    }

    // Run axe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axeResults = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await (window as any).axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
        },
        resultTypes: ["violations", "passes", "incomplete"],
      });
    });

    const totalElements = await page.evaluate(
      () => document.querySelectorAll("*").length
    );

    await browser.close();

    const violations: Violation[] = axeResults.violations.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: any) => ({
        id: v.id,
        impact: v.impact ?? "minor",
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        tags: v.tags,
        nodes: v.nodes.map((n: { html: string; target: string[]; failureSummary: string }) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })
    );

    const passes: PassedCheck[] = axeResults.passes.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => ({
        id: p.id,
        description: p.description,
        help: p.help,
        tags: p.tags,
        nodes: p.nodes.slice(0, 3).map((n: { html: string; target: string[] }) => ({
          html: n.html,
          target: n.target,
        })),
      })
    );

    const incomplete: IncompleteCheck[] = axeResults.incomplete.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (i: any) => ({
        id: i.id,
        impact: i.impact ?? null,
        description: i.description,
        help: i.help,
        helpUrl: i.helpUrl,
        tags: i.tags,
        nodes: i.nodes.map((n: { html: string; target: string[]; failureSummary: string }) => ({
          html: n.html,
          target: n.target,
          failureSummary: n.failureSummary,
        })),
      })
    );

    return {
      url,
      timestamp: new Date().toISOString(),
      axeVersion: axeResults.testEngine?.version ?? "unknown",
      violations,
      passes,
      incomplete,
      score: computeScore(violations),
      grade: computeGrade(computeScore(violations)),
      violationCount: countByImpact(violations),
      totalElements,
    };
  } catch (err) {
    await browser.close().catch(() => {});
    throw err;
  }
}
