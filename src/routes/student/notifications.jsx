import { createFileRoute } from "@tanstack/react-router";
import StudentNotifications from "@/pages/StudentNotifications";

export const Route = createFileRoute("/student/notifications")({
  component: StudentNotifications,
});
