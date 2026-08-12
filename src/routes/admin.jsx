import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { UnifiedLayout } from "@/components/layout/unified-layout";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <UnifiedLayout portalType="admin" />;
}
