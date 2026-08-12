import { createFileRoute } from "@tanstack/react-router";
import EventsStudent from "@/pages/Events/EventsStudent";

export const Route = createFileRoute("/student/events")({
  component: EventsStudent,
});
