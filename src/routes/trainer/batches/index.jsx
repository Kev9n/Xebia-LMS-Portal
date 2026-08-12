import { createFileRoute } from "@tanstack/react-router";
import { BatchManagement } from "@/pages/BatchManagement";

export const Route = createFileRoute("/trainer/batches/")({
  component: BatchManagement,
});
