import { createFileRoute } from "@tanstack/react-router";
import BatchDetailAdmin from "@/admin/pages/Batches/BatchDetailAdmin";

export const Route = createFileRoute("/admin/batches/$batchId")({
  component: BatchDetailAdmin,
});
