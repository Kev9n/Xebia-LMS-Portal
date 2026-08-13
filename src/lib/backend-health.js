import { DEMO_TENANT_ID } from "@/lib/demo-seed-data";
import { resolveApiBaseUrl } from "@/lib/api-config";
import { TEMPORARY_STUDENT_ID } from "@/config/student-identity";

let lastCheck = { ok: false, checkedAt: 0, message: "" };

export async function checkBackendHealth(force = false) {
  const now = Date.now();
  if (!force && now - lastCheck.checkedAt < 15000) {
    return lastCheck;
  }

  const base = resolveApiBaseUrl();
  try {
    const response = await fetch(`${base}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Id": DEMO_TENANT_ID,
        "X-User-Id": TEMPORARY_STUDENT_ID,
      },
      cache: "no-store",
    });

    const bodyText = await response.text();

    if (
      bodyText.includes("Service Suspended") ||
      bodyText.includes("service has been suspended")
    ) {
      lastCheck = {
        ok: false,
        checkedAt: now,
        message:
          "Render API suspended — resume services in Render dashboard, or run local backend (backend/docker-compose.yml)",
        baseUrl: base,
      };
      return lastCheck;
    }

    if (response.ok) {
      try {
        JSON.parse(bodyText);
        lastCheck = { ok: true, checkedAt: now, message: "Backend connected", baseUrl: base };
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
        return lastCheck;
      }
    }

    lastCheck = {
      ok: false,
      checkedAt: now,
      message: `Backend responded with ${response.status}`,
      baseUrl: base,
    };
    return lastCheck;
  } catch (err) {
    lastCheck = {
      ok: false,
      checkedAt: now,
      message: err?.message || "Network error",
      baseUrl: base,
    };
    return lastCheck;
  }
}

export function getLastHealthCheck() {
  return lastCheck;
}
