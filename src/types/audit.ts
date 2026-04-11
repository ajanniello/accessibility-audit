export type ImpactLevel = "critical" | "serious" | "moderate" | "minor";

export interface ViolationNode {
  html: string;
  target: string[];
  failureSummary: string;
}

export interface Violation {
  id: string;
  impact: ImpactLevel;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: ViolationNode[];
}

export interface PassedCheck {
  id: string;
  description: string;
  help: string;
  tags: string[];
  nodes: { html: string; target: string[] }[];
}

export interface IncompleteCheck {
  id: string;
  impact: ImpactLevel | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: ViolationNode[];
}

export interface ViolationCount {
  critical: number;
  serious: number;
  moderate: number;
  minor: number;
}

export interface AuditResult {
  url: string;
  timestamp: string;
  axeVersion: string;
  violations: Violation[];
  passes: PassedCheck[];
  incomplete: IncompleteCheck[];
  score: number;
  grade: string;
  violationCount: ViolationCount;
  totalElements: number;
}

export interface AuditError {
  error: string;
  code: "INVALID_URL" | "FETCH_FAILED" | "TIMEOUT" | "BOT_BLOCKED" | "UNKNOWN";
}

export type AuditResponse = AuditResult | AuditError;
