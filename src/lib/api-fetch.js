/** Default timeout for Render API calls (free tier cold starts can be slow). */
export const API_TIMEOUT_MS = 12_000;

/** After failures, skip remote calls for this window to use local/demo data instantly. */
const CIRCUIT_COOLDOWN_MS = 45_000;

let circuitOpenUntil = 0;

export function isApiCircuitOpen() {
  return Date.now() < circuitOpenUntil;
}

export function tripApiCircuit(ms = CIRCUIT_COOLDOWN_MS) {
  circuitOpenUntil = Date.now() + ms;
}

export function clearApiCircuit() {
  circuitOpenUntil = 0;
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err?.name === "AbortError") {
      tripApiCircuit();
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    tripApiCircuit(30_000);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
