import { createFileRoute } from "@tanstack/react-router";
import BatchesOverview from "@/admin/pages/Batches/Overview";

export const Route = createFileRoute("/admin/batches/")({
  component: BatchesOverview,
});
