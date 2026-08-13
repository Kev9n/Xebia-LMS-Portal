import { createFileRoute } from "@tanstack/react-router";
import HierarchyBuilder from "@/admin/pages/Courses/HierarchyBuilder";
import { CourseService } from "@/services/api";
import { getLocalHierarchy, getMergedCourses } from "@/lib/admin-catalog-store";

export const Route = createFileRoute("/admin/courses/builder")({
  validateSearch: (search) => ({
    courseId: search.courseId || "",
  }),
  loaderDeps: ({ search: { courseId } }) => ({ courseId }),
  loader: async ({ deps: { courseId } }) => {
    if (import.meta.env.SSR) {
      const localCourses = getMergedCourses(null);
      const id = courseId || localCourses[0]?.id;
      return { course: id ? getLocalHierarchy(id) : null };
    }

    try {
      if (courseId) {
        const hierarchy = await CourseService.getCourseHierarchy(courseId);
        if (hierarchy) return { course: hierarchy };
      }

      const courses = await CourseService.getCourses();
      if (!courses || courses.length === 0) {
        const dummyCourse = await CourseService.createCourse({
          title: "Draft Course",
          courseCode: "DRAFT-101",
          level: "Beginner",
          language: "English",
          isActive: true,
        });
        const hierarchy = await CourseService.getCourseHierarchy(dummyCourse.id);
        return { course: hierarchy };
      }

      const hierarchy = await CourseService.getCourseHierarchy(courses[0].id);
      return { course: hierarchy };
    } catch (err) {
      console.error("Failed to load course for builder", err);
      const localCourses = getMergedCourses(null);
      const id = courseId || localCourses[0]?.id;
      return { course: id ? getLocalHierarchy(id) : null };
    }
  },
  component: BuilderWrapper,
});

function BuilderWrapper() {
  const { course } = Route.useLoaderData();

  if (!course) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Could not load course builder. Please create a course first.</p>
      </div>
    );
  }

  return <HierarchyBuilder course={course} />;
}
