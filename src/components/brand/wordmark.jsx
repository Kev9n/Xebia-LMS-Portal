import logoPurple from "@/assets/logo-purple.png";
import logoWhite from "@/assets/logo-white.png";

/**
 * Persistent top-left wordmark lockup for auth and marketing surfaces.
 */
export function Wordmark({ variant = "light", className = "" }) {
  const isLight = variant === "light";
  return (
    <div className={`x-wordmark ${className}`}>
      <img
        src={isLight ? logoWhite : logoPurple}
        alt="Xebia"
        className="h-8 w-auto"
      />
      <div className="flex flex-col leading-none">
        <span className={isLight ? "text-primary-foreground" : "text-foreground"}>
          Xebia
        </span>
        <span
          className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            isLight ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          Enterprise LMS
        </span>
      </div>
    </div>
  );
}
