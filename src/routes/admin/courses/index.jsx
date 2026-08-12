import { createFileRoute } from "@tanstack/react-router";
import Courses from "@/admin/pages/Courses/index";

export const Route = createFileRoute("/admin/courses/")({
  component: Courses,
});
