import { createFileRoute } from "@tanstack/react-router";
import { HoursHeader } from "@/components/analytics/HoursHeader";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { HoursKPIs } from "@/components/analytics/HoursKPIs";
import { HoursCharts } from "@/components/analytics/HoursCharts";
import { HoursLeaderboards } from "@/components/analytics/HoursLeaderboards";

export const Route = createFileRoute("/admin/analytics/hours")({
  component: HoursDashboard,
});

function HoursDashboard() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 font-sans transition-colors duration-300">
      <HoursHeader />
      <GlobalFilters />
      <HoursKPIs />
      <HoursCharts />
      <HoursLeaderboards />
    </div>
  );
}
