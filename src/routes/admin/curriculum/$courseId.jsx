import { createFileRoute } from "@tanstack/react-router";
import HierarchyBuilder from "@/admin/pages/Courses/HierarchyBuilder";
import { CourseService } from "@/services/api";

export const Route = createFileRoute("/admin/curriculum/$courseId")({
  loader: async ({ params: { courseId } }) => {
    try {
      const hierarchy = await CourseService.getCourseHierarchy(courseId);
      if (hierarchy) return { course: hierarchy };
      const course = await CourseService.getCourseById(courseId);
      return { course: course ? { ...course, modules: [] } : null };
    } catch {
      return { course: null };
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
