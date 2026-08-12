import { createFileRoute } from "@tanstack/react-router";
import TrainerWorkload from "@/admin/pages/Batches/TrainerWorkload";

export const Route = createFileRoute("/admin/batches/trainers")({
  component: TrainerWorkload,
});
