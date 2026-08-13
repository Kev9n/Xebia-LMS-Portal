import { useBackendHealth } from "@/context/BackendHealthContext";

export function AdminOfflineBanner() {
  const { online, message, apiBaseUrl, recheck } = useBackendHealth();

  if (online !== false) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="font-bold">Offline mode:</span> {message}. Changes save in your browser
          until the API is reachable.{" "}
          <span className="text-amber-800/80 dark:text-amber-200/80">
            Admin allocates courses to trainers; students in the batch are enrolled automatically.
          </span>
        </div>
        <button
          type="button"
          onClick={recheck}
          className="shrink-0 rounded-lg bg-amber-200/80 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-300/80 dark:bg-amber-500/20 dark:text-amber-100"
        >
          Retry connection
        </button>
      </div>
    </div>
  );
}
