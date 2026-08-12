import { createFileRoute } from "@tanstack/react-router";
import HierarchyBuilder from "@/admin/pages/Courses/HierarchyBuilder";
import { CourseService } from "@/services/api";

export const Route = createFileRoute("/admin/courses/builder")({
  validateSearch: (search) => ({
    courseId: search.courseId || "",
  }),
  loaderDeps: ({ search: { courseId } }) => ({ courseId }),
  loader: async ({ deps: { courseId } }) => {
    try {
      if (courseId) {
        const hierarchy = await CourseService.getCourseHierarchy(courseId);
        if (hierarchy) return { course: hierarchy };
      }

      let courses = await CourseService.getCourses();
      if (!courses || courses.length === 0) {
        // Create a dummy course so the builder has a valid foreign key for modules
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
      return { course: null };
    }
  },
  component: BuilderWrapper,
});

function BuilderWrapper() {
  const { course } = Route.useLoaderData();

  if (!course) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Could not load a course to build. Please create a course first.</p>
      </div>
    );
  }

  return <HierarchyBuilder course={course} />;
}
