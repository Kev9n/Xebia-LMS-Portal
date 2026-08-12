import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/analytics/analytics/")({
  component: () => <Navigate to="/analytics" replace />,
});
