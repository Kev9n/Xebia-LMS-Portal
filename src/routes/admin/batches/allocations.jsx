import { createFileRoute } from "@tanstack/react-router";
import AllocationMatrix from "@/admin/pages/Batches/AllocationMatrix";

export const Route = createFileRoute("/admin/batches/allocations")({
  component: AllocationMatrix,
});
