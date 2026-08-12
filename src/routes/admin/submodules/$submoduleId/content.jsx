import { createFileRoute } from "@tanstack/react-router";
import ContentManager from "@/admin/pages/Courses/ContentManager";

export const Route = createFileRoute("/admin/submodules/$submoduleId/content")({
  component: function ContentManagerRoute() {
    const { submoduleId } = Route.useParams();
    const search = Route.useSearch();
    return (
      <ContentManager
        submoduleId={submoduleId}
        courseId={search.courseId}
        moduleId={search.moduleId}
      />
    );
  },
});
