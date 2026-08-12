import { FolderKanban, Globe, Star, TrendingUp, Trophy } from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function HoursLeaderboards() {
  const { topStudents, batchStats } = useAnalyticsData();

  const topBatches = batchStats
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5)
    .map((b, i) => ({
      rank: i + 1,
      name: b.name || "Batch",
      submissions: b.submissionCount,
      avg: b.avgScore,
      students: b.studentCount || 0,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300 shadow-sm overflow-hidden flex flex-col h-[450px]">
        <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Top Performing Batches
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {topBatches.length > 0 ? (
            topBatches.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] text-xs font-bold flex items-center justify-center">
                      {item.rank}
                    </div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#6C1D5F] transition-colors truncate max-w-[180px]">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-black text-[#6C1D5F] dark:text-[#FFACE8] text-sm">
                    {item.avg}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 pl-9">
                  <span>Submissions: {item.submissions}</span>
                  <span>Students: {item.students}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">No batch data available.</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300 shadow-sm overflow-hidden flex flex-col h-[450px]">
        <div className="p-5 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/10 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#FF6200]" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Top Performing Students
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          {topStudents.length > 0 ? (
            topStudents.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/5 hover:border-[#FF6200] transition-colors group">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-600">
                    {item.name?.charAt(0) || "?"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#FF6200] transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="font-black text-[#FF6200] text-sm">{item.score}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">
                      {item.completed} assessments completed
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">No student data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
