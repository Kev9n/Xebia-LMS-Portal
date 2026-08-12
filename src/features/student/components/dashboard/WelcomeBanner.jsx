import { useLMS } from "@/context/LMSContext";

/**
 * Welcome banner at the top of the student dashboard.
 */
export function WelcomeBanner() {
  const { currentUser } = useLMS();
  const name = currentUser?.name || "Student";

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-soft)] bg-gradient-to-r from-secondary-foreground via-primary to-primary-glow p-6 text-primary-foreground shadow-[var(--shadow-elegant)] sm:p-8">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
      <div className="relative z-10 max-w-2xl space-y-2">
        <p className="x-micro-copy text-primary-foreground/70">Student Portal</p>
        <h1 className="font-display text-[var(--text-xl)] font-bold tracking-tight">
          Welcome back, <span className="text-secondary">{name}</span>
        </h1>
        <p className="text-sm font-normal text-primary-foreground/85">
          Continue your learning journey and track your progress across batches and assessments.
        </p>
      </div>
    </div>
  );
}
