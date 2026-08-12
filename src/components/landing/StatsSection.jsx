import { Users, BookOpen, Clock, Award, BrainCircuit, TrendingUp } from "lucide-react";

const stats = [
  {
    id: "employees",
    value: "12,580+",
    label: "Employees",
    trend: "+16.4%",
    icon: Users,
    colorClass: "text-[#6C1D5F]",
    bgClass: "bg-[#6C1D5F]/10",
  },
  {
    id: "courses",
    value: "1,248+",
    label: "Courses",
    trend: "+12.7%",
    icon: BookOpen,
    colorClass: "text-accent-2",
    bgClass: "bg-accent-2/10",
  },
  {
    id: "hours",
    value: "45,680+",
    label: "Learning Hours",
    trend: "+18.3%",
    icon: Clock,
    colorClass: "text-indigo-600",
    bgClass: "bg-indigo-600/10",
  },
  {
    id: "certs",
    value: "8,945+",
    label: "Certifications",
    trend: "+14.2%",
    icon: Award,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  {
    id: "ai",
    value: "82%",
    label: "AI Readiness Score",
    trend: "+22.6%",
    icon: BrainCircuit,
    colorClass: "text-[#84117C]",
    bgClass: "bg-[#84117C]/10",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-transparent relative z-10 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgClass} ${stat.colorClass}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {stat.value}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                  {stat.label}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-accent-2 dark:text-accent-2 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.trend} this month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
