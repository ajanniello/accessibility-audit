"use client";

interface ScoreDonutProps {
  score: number;
  grade: string;
  size?: number;
}

const GRADE_COLORS: Record<string, { stroke: string; text: string }> = {
  A: { stroke: "#22c55e", text: "text-green-500" },
  B: { stroke: "#84cc16", text: "text-lime-500" },
  C: { stroke: "#eab308", text: "text-yellow-500" },
  D: { stroke: "#f97316", text: "text-orange-500" },
  F: { stroke: "#ef4444", text: "text-red-500" },
};

export default function ScoreDonut({ score, grade, size = 140 }: ScoreDonutProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const colors = GRADE_COLORS[grade] ?? GRADE_COLORS.F;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`Accessibility score: ${score} out of 100, grade ${grade}`}
      role="img"
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={12}
          className="stroke-[var(--card-border)]"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={12}
          stroke={colors.stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s ease-in-out" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-3xl font-bold leading-none ${colors.text}`}
          aria-hidden="true"
        >
          {score}
        </span>
        <span className="text-xs text-[var(--muted)] mt-0.5" aria-hidden="true">
          / 100
        </span>
      </div>
    </div>
  );
}
