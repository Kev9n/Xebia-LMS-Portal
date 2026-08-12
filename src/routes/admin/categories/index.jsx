import { createFileRoute } from "@tanstack/react-router";
import Categories from "@/admin/pages/Categories/index";

export const Route = createFileRoute("/admin/categories/")({
  component: Categories,
});
