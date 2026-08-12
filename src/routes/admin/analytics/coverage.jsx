import { createFileRoute } from "@tanstack/react-router";
import { CoverageHeader } from "@/components/analytics/CoverageHeader";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { CoverageKPIs } from "@/components/analytics/CoverageKPIs";
import { CoverageCharts } from "@/components/analytics/CoverageCharts";

export const Route = createFileRoute("/admin/analytics/coverage")({
  component: CoverageDashboard,
});

function CoverageDashboard() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans transition-colors duration-300">
      <CoverageHeader />
      <GlobalFilters />

      <CoverageKPIs />
      <CoverageCharts />
    </div>
  );
}
