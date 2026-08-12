import { createFileRoute } from "@tanstack/react-router";
import { UnifiedLayout } from "@/components/layout/unified-layout";

export const Route = createFileRoute("/analytics")({
  component: AnalyticsLayout,
});

function AnalyticsLayout() {
  return <UnifiedLayout portalType="analytics" />;
}
