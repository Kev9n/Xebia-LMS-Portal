import { createFileRoute } from "@tanstack/react-router";
import EventsAdmin from "@/admin/pages/Events/EventsAdmin";

export const Route = createFileRoute("/admin/events/")({
  component: EventsAdmin,
});
