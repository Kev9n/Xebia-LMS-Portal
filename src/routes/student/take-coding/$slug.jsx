import { createFileRoute } from "@tanstack/react-router";
import { TakeCoding } from "@/pages/TakeCoding";

export const Route = createFileRoute("/student/take-coding/$slug")({
  component: TakeCodingWrapper,
});

function TakeCodingWrapper() {
  return <TakeCoding />;
}
