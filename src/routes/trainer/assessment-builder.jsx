import { createFileRoute } from "@tanstack/react-router";
import { AssessmentBuilder } from "@/pages/AssessmentBuilder";

export const Route = createFileRoute("/trainer/assessment-builder")({
  component: AssessmentBuilder,
});
