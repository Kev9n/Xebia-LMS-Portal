import { isAdminOfflineMode } from "@/lib/admin-catalog-store";

export function AdminOfflineBanner() {
  if (typeof window === "undefined" || !isAdminOfflineMode()) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <span className="font-bold">Demo mode:</span> Changes are saved locally in your browser because the
      backend API is unavailable. They will persist across page reloads on this device.
    </div>
  );
}
