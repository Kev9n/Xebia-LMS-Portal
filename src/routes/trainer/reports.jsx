import { createFileRoute } from "@tanstack/react-router";
import { Reports } from "@/pages/Reports";

export const Route = createFileRoute("/trainer/reports")({
  component: Reports,
});
