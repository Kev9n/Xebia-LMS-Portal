import { createFileRoute } from "@tanstack/react-router";
import { Leaderboard } from "@/pages/Leaderboard";

export const Route = createFileRoute("/trainer/leaderboard")({
  component: Leaderboard,
});
