import type { Violation, ViolationCount } from "@/types/audit";

const IMPACT_DEDUCTIONS: Record<string, { perRule: number; cap: number }> = {
  critical: { perRule: 15, cap: 45 },
  serious:  { perRule: 10, cap: 30 },
  moderate: { perRule: 5,  cap: 15 },
  minor:    { perRule: 2,  cap: 10 },
};

export function computeScore(violations: Violation[]): number {
  let deduction = 0;
  const countByImpact: Record<string, number> = {};

  for (const v of violations) {
    const impact = v.impact ?? "minor";
    countByImpact[impact] = (countByImpact[impact] ?? 0) + 1;
  }

  for (const [impact, { perRule, cap }] of Object.entries(IMPACT_DEDUCTIONS)) {
    const count = countByImpact[impact] ?? 0;
    deduction += Math.min(count * perRule, cap);
  }

  return Math.max(0, 100 - deduction);
}

export function computeGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function countByImpact(violations: Violation[]): ViolationCount {
  const counts: ViolationCount = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of violations) {
    const impact = v.impact ?? "minor";
    if (impact in counts) counts[impact as keyof ViolationCount]++;
  }
  return counts;
}
