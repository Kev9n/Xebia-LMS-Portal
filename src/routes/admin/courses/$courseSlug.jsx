import { createFileRoute } from "@tanstack/react-router";
import CourseDetail from "@/admin/pages/Courses/CourseDetail";

export const Route = createFileRoute("/admin/courses/$courseSlug")({
  component: CourseDetail,
});
