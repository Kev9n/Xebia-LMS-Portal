import { createFileRoute } from "@tanstack/react-router";
import { TakeQuiz } from "@/pages/TakeQuiz";

export const Route = createFileRoute("/student/take/$slug")({
  component: TakeQuizWrapper,
});

function TakeQuizWrapper() {
  return <TakeQuiz />;
}
