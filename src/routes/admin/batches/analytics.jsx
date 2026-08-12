import { createFileRoute } from "@tanstack/react-router";
import BatchesAnalytics from "@/admin/pages/Batches/Analytics";

export const Route = createFileRoute("/admin/batches/analytics")({
  component: BatchesAnalytics,
});
