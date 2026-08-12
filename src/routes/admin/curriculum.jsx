import { createFileRoute } from "@tanstack/react-router";
import Curriculum from "@/admin/pages/Curriculum/index";

export const Route = createFileRoute("/admin/curriculum")({
  component: Curriculum,
});
