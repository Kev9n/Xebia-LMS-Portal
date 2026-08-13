/** Production Render API gateway (kev9n deployment). */
export const PRODUCTION_API_BASE_URL =
  "https://xebia-api-gateway-kev9n.onrender.com/api";

/**
 * Resolve API base URL for current environment.
 * Vercel/production builds use Render gateway when env var is missing.
 */
export function resolveApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (import.meta.env.PROD) {
    return PRODUCTION_API_BASE_URL;
  }

  return "http://localhost:8080/api";
}

export function getSessionUserId(fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const session = JSON.parse(localStorage.getItem("session") || "null");
    return session?.id || fallback;
  } catch {
    return fallback;
  }
}
