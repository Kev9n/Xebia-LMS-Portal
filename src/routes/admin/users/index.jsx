import { createFileRoute } from "@tanstack/react-router";
import UserManagement from "@/admin/pages/Users/UserManagement";

export const Route = createFileRoute("/admin/users/")({
  component: UserManagement,
});
