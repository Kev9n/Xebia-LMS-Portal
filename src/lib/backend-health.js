import { DEMO_TENANT_ID } from "@/lib/demo-seed-data";
import { resolveApiBaseUrl } from "@/lib/api-config";
import { TEMPORARY_STUDENT_ID } from "@/config/student-identity";
import {
  API_TIMEOUT_MS,
  clearApiCircuit,
  fetchWithTimeout,
  tripApiCircuit,
} from "@/lib/api-fetch";

let lastCheck = { ok: false, checkedAt: 0, message: "" };

export function getLastHealthCheck() {
  return lastCheck;
}

export async function checkBackendHealth(force = false) {
  const now = Date.now();
  if (!force && now - lastCheck.checkedAt < 15000) {
    return lastCheck;
  }

  const base = resolveApiBaseUrl();
  try {
    const response = await fetchWithTimeout(
      `${base}/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Tenant-Id": DEMO_TENANT_ID,
          "X-User-Id": TEMPORARY_STUDENT_ID,
        },
        cache: "no-store",
      },
      API_TIMEOUT_MS,
    );

    const bodyText = await response.text();

    if (
      bodyText.includes("Service Suspended") ||
      bodyText.includes("service has been suspended")
    ) {
      lastCheck = {
        ok: false,
        checkedAt: now,
        message:
          "Render API suspended — resume services in Render dashboard, or run local backend",
        baseUrl: base,
      };
      tripApiCircuit();
      return lastCheck;
    }

    if (response.ok) {
      try {
        JSON.parse(bodyText);
        lastCheck = { ok: true, checkedAt: now, message: "Backend connected", baseUrl: base };
        clearApiCircuit();
        if (typeof window !== "undefined") {
          localStorage.setItem("lms_admin_offline", "false");
          localStorage.setItem("lms_api_base", base);
        }
        return lastCheck;
      } catch {
        lastCheck = {
          ok: false,
          checkedAt: now,
          message: "Backend returned invalid response (not JSON)",
          baseUrl: base,
        };
        tripApiCircuit();
        return lastCheck;
      }
    }

    lastCheck = {
      ok: false,
      checkedAt: now,
      message: `Backend responded with ${response.status}`,
      baseUrl: base,
    };
    tripApiCircuit(20_000);
    return lastCheck;
  } catch (err) {
    lastCheck = {
      ok: false,
      checkedAt: now,
      message: err?.message || "Network error",
      baseUrl: base,
    };
    tripApiCircuit();
    return lastCheck;
  }
}
