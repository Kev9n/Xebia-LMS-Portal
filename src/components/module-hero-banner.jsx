import { motion } from "framer-motion";

/**
 * ModuleHeroBanner
 * @param {string}  breadcrumb  - e.g. "Dashboard / Courses"
 * @param {string}  title       - Page heading text
 * @param {string}  subtitle    - Short description line
 * @param {string}  badgeText   - Right-side badge label (optional)
 * @param {React.ReactNode} actions - Buttons/controls shown on the right (optional)
 */
export function ModuleHeroBanner({ breadcrumb, title, subtitle, badgeText, actions }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border/30 shadow-elegant"
      style={{ minHeight: "150px" }}
    >
      {/* ── Light mode gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none dark:opacity-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.94 0.06 320 / 0.9) 0%, oklch(0.97 0.03 260 / 0.85) 40%, oklch(0.93 0.08 200 / 0.8) 100%)",
        }}
      />
      {/* ── Dark mode gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.06 310) 0%, oklch(0.14 0.04 260) 50%, oklch(0.15 0.05 200) 100%)",
        }}
      />

      {/* Glow orb — left primary */}
      <div
        className="absolute -left-16 -top-16 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.22 320 / 0.32) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Glow orb — right accent */}
      <div
        className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.18 200 / 0.25) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />
      {/* Glow orb — center top teal */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-28 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, oklch(0.65 0.16 165 / 0.18) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            left: `${i * 7.2 + 2}%`,
            bottom: "-6px",
            background: i % 2 === 0 ? "oklch(0.65 0.22 320 / 0.7)" : "oklch(0.75 0.18 200 / 0.6)",
          }}
          animate={{
            y: [-5, -180],
            x: [0, (i % 2 === 0 ? 1 : -1) * (12 + (i % 4) * 8)],
            opacity: [0, 0.85, 0],
            scale: [1, 1.4, 0.5],
          }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            delay: i * 0.38,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Diagonal shimmer streak */}
      <motion.div
        className="absolute inset-y-0 w-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.06) 50%, transparent 60%)",
          left: "-10%",
        }}
        animate={{ left: ["-10%", "120%"] }}
        transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 3.5, ease: "linear" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 sm:p-7">
        {/* Left: breadcrumb + title + subtitle */}
        <div className="space-y-1.5 min-w-0">
          {breadcrumb && (
            <div
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.55 0.16 320)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              {breadcrumb}
            </div>
          )}

          {/* Gradient title */}
          <h1
            className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, var(--color-foreground) 0%, oklch(0.6 0.22 320) 60%, oklch(0.72 0.18 200) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {title}
          </h1>

          {/* Animated underline */}
          <motion.div
            animate={{ scaleX: [0.9, 1.05, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-[2.5px] w-44 rounded-full origin-left"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.55 0.22 320), oklch(0.72 0.18 200), transparent)",
            }}
          />

          {subtitle && (
            <p className="text-muted-foreground text-xs sm:text-sm max-w-xl leading-relaxed pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: badge + action buttons */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          {badgeText && (
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 0px oklch(0.55 0.22 320 / 0)",
                  "0 0 14px oklch(0.55 0.22 320 / 0.32)",
                  "0 0 0px oklch(0.55 0.22 320 / 0)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md"
              style={{
                background: "oklch(0.55 0.18 320 / 0.12)",
                borderColor: "oklch(0.55 0.18 320 / 0.28)",
                color: "oklch(0.55 0.2 320)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-accent-2 animate-pulse shadow-[0_0_6px_oklch(0.7_0.2_145)]" />
              {badgeText}
            </motion.span>
          )}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap justify-end">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
}
