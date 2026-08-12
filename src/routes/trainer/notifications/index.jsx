import { createFileRoute } from "@tanstack/react-router";
import TrainerNotifications from "@/pages/TrainerNotifications";

export const Route = createFileRoute("/trainer/notifications/")({
  component: TrainerNotifications,
});
