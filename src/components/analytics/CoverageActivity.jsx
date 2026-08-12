import { Bell, CheckCircle2, AlertTriangle, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function CoverageActivity() {
  const { totalSubmissions, totalLearners, totalBatches, batchStats } = useAnalyticsData();

  const activities = [
    {
      id: 1,
      type: "milestone",
      title: "Platform Status",
      desc: `${totalLearners} learner(s) enrolled across ${totalBatches} batch(es).`,
      time: "Current",
      icon: CheckCircle2,
      bg: "bg-[#01AC9F]",
      color: "text-white",
    },
    {
      id: 2,
      type: "alert",
      title: "Activity Summary",
      desc: `${totalSubmissions} total submission(s) recorded on the platform.`,
      time: "Current",
      icon: AlertTriangle,
      bg: "bg-destructive",
      color: "text-white",
    },
    {
      id: 3,
      type: "course",
      title: "Batch Overview",
      desc: batchStats.length > 0
        ? `Top batch: "${batchStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.name}" with ${batchStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.avgScore}% avg score.`
        : "No batch activity yet.",
      time: "Current",
      icon: Users,
      bg: "bg-[#6C1D5F]",
      color: "text-white",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 h-full flex flex-col hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
          Participation Feed
        </h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#01AC9F] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#01AC9F]"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-white/10 before:to-transparent">
        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-center mb-6 last:mb-0 pl-12 group">
            <div className={`absolute left-0 flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-gray-900 ${activity.bg} ${activity.color} z-10`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="w-full p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{activity.title}</h4>
                <time className="text-[10px] font-medium text-gray-400 shrink-0 ml-2">{activity.time}</time>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
