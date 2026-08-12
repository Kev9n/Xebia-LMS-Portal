import { createFileRoute } from "@tanstack/react-router";
import { ExecutiveHeader } from "@/components/analytics/ExecutiveHeader";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { ExecutiveKPIs } from "@/components/analytics/ExecutiveKPIs";
import { ExecutiveCharts } from "@/components/analytics/ExecutiveCharts";
import { ExecutiveInsights } from "@/components/analytics/ExecutiveInsights";
import { ActivityTimeline } from "@/components/analytics/ActivityTimeline";

export const Route = createFileRoute("/admin/analytics/executive")({
  component: ExecutiveDashboard,
});

function ExecutiveDashboard() {
  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300">
      {/* Premium Header */}
      <ExecutiveHeader />

      {/* Global Filters */}
      <GlobalFilters />

      {/* Executive KPIs */}
      <ExecutiveKPIs />

      {/* Analytics Visualizations */}
      <ExecutiveCharts />

      {/* Insights & Activity Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExecutiveInsights />
        <ActivityTimeline />
      </div>
    </div>
  );
}
