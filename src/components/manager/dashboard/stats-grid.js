import { jsx as _jsx } from "react/jsx-runtime";
import { Users, BookOpen, Target, ShieldAlert } from "lucide-react";
import { StatCard } from "./stat-card";
import { useManagerStats } from "@/lib/mock-data/manager-data";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  "Total Students": Users,
  "Active Courses": BookOpen,
  "Completion Rate": Target,
  "Pending Approvals": ShieldAlert,
};

export function StatsGrid() {
  const { data, isLoading } = useManagerStats();

  if (isLoading) {
    return _jsx("div", {
      className: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4",
      children: Array.from({ length: 4 }).map((_, i) =>
        _jsx(
          "div",
          {
            className:
              "rounded-2xl border border-[#EDEDED]/60 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
            children: _jsx(Skeleton, { className: "h-[120px] w-full rounded-xl" }),
          },
          i,
        ),
      ),
    });
  }

  const stats = [
    data.totalStudents,
    data.activeCourses,
    data.completionRate,
    data.pendingApprovals,
  ];

  return _jsx("div", {
    className: "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4",
    children: stats.map((stat, index) =>
      _jsx(
        StatCard,
        {
          label: stat.label,
          value: stat.value,
          suffix: stat.suffix || "",
          trend: stat.trend,
          icon: iconMap[stat.label] || Users,
          index,
        },
        stat.label,
      ),
    ),
  });
}
