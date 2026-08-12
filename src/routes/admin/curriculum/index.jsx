import { createFileRoute } from "@tanstack/react-router";
import CurriculumLanding from "@/admin/pages/Curriculum/index";

export const Route = createFileRoute("/admin/curriculum/")({
  component: CurriculumLanding,
});
