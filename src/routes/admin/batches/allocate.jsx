import { createFileRoute } from "@tanstack/react-router";
import AllocationWizard from "@/admin/pages/Batches/AllocationWizard";

export const Route = createFileRoute("/admin/batches/allocate")({
  component: AllocationWizard,
});
