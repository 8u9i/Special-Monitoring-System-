import { useMemo } from "react";

type ProgressVariant = "primary" | "green" | "blue" | "amber";

interface ProgressBarProps {
  value: number;
  variant?: ProgressVariant;
  size?: "sm" | "md";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  variant = "primary",
  size = "md",
  showLabel = false,
  label,
  className = "",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  const display = useMemo(() => {
    if (label) return label;
    return `${pct}%`;
  }, [label, pct]);

  return (
    <div className={`progress ${size === "sm" ? "progress--sm" : ""} ${className}`}>
      <div className="progress-track">
        <div
          className={`progress-fill progress-fill--${variant}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className="progress-label">{display}</span>}
    </div>
  );
}
