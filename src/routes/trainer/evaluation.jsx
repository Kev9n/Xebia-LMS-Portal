import { createFileRoute } from "@tanstack/react-router";
import { Evaluation } from "@/pages/Evaluation";

export const Route = createFileRoute("/trainer/evaluation")({
  component: Evaluation,
});
