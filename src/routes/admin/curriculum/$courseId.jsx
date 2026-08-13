import { createFileRoute } from "@tanstack/react-router";
import HierarchyBuilder from "@/admin/pages/Courses/HierarchyBuilder";
import { CourseService } from "@/services/api";
import { getLocalHierarchy } from "@/lib/admin-catalog-store";
import { DEMO_IDS } from "@/lib/demo-seed-data";

function resolveLocalCourse(courseId) {
  return (
    getLocalHierarchy(courseId) ||
    (String(courseId) === DEMO_IDS.courseReact
      ? getLocalHierarchy(DEMO_IDS.courseReact)
      : null)
  );
}

export const Route = createFileRoute("/admin/curriculum/$courseId")({
  loader: async ({ params: { courseId } }) => {
    if (import.meta.env.SSR) {
      return { course: resolveLocalCourse(courseId) };
    }

    try {
      const hierarchy = await CourseService.getCourseHierarchy(courseId);
      if (hierarchy) return { course: hierarchy };
      const course = await CourseService.getCourseById(courseId);
      return { course: course ? { ...course, modules: [] } : resolveLocalCourse(courseId) };
    } catch {
      return { course: resolveLocalCourse(courseId) };
    }
  },
  component: CurriculumBuilderRoute,
});

function CurriculumBuilderRoute() {
  const { course } = Route.useLoaderData();

  if (!course) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Could not load course curriculum. Please check the course ID or create a course first.</p>
      </div>
    );
  }

  return <HierarchyBuilder course={course} />;
}
