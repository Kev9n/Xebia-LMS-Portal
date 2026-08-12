import { clsx } from "clsx";

/**
 * A single stats card in the dashboard bento grid.
 */
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  colorClass = "text-primary",
  bgClass = "bg-primary/10",
  className,
}) {
  return (
    <div
      className={clsx(
        "x-card flex flex-col justify-between p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="x-micro-copy text-muted-foreground">{title}</p>
        <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-soft)]", bgClass)}>
          <Icon className={clsx("h-4 w-4", colorClass)} />
        </div>
      </div>
      <div className="mt-3">
        <div className="font-display text-[var(--text-xl)] font-bold leading-none text-foreground">
          {value}
        </div>
        <p
          className={clsx(
            "mt-2 text-xs font-medium",
            trendUp ? "text-accent-2" : "text-muted-foreground",
          )}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}
