import { createFileRoute } from "@tanstack/react-router";
import EventsTrainer from "@/pages/Events/EventsTrainer";

export const Route = createFileRoute("/trainer/events")({
  component: EventsTrainer,
});
