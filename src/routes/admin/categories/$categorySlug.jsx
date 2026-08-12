import { createFileRoute } from "@tanstack/react-router";
import CategoryDetail from "@/admin/pages/Categories/CategoryDetail";

export const Route = createFileRoute("/admin/categories/$categorySlug")({
  component: CategoryDetail,
});
