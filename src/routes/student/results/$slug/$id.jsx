import { createFileRoute } from "@tanstack/react-router";
import { Results } from "@/pages/Results";

export const Route = createFileRoute("/student/results/$slug/$id")({
  component: ResultsWrapper,
});

function ResultsWrapper() {
  return <Results />;
}
