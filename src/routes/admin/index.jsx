import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/admin/pages/Dashboard/index";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});
