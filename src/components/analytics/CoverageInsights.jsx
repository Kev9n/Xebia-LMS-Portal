import { Lightbulb, TrendingUp, AlertTriangle, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function CoverageInsights() {
  const { totalLearners, totalSubmissions, totalBatches, passRate, batchStats } = useAnalyticsData();

  const coverage = totalLearners > 0 ? Math.round((totalSubmissions / totalLearners) * 100) : 0;

  return (
    <>
      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#FFACE8] dark:hover:border-[#6C1D5F] transition-colors duration-300 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#FFACE8] dark:text-[#FFACE8]" />
          Coverage Insights
        </h3>

        <div className="space-y-4 flex-1">
          <div className="p-4 rounded-xl bg-accent-2/10 dark:bg-accent-2 border border-accent-2/20 dark:border-accent-2">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-accent-2 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Coverage Overview</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {totalLearners} learner(s) with {totalSubmissions} submission(s). Overall coverage rate: {coverage}%.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FF6200]/5 border border-[#FF6200]/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF6200] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Pass Rate</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Current pass rate is {passRate}%. {passRate < 60 ? "This is below target — consider intervention." : "Within acceptable range."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#01AC9F]/5 border border-[#01AC9F]/10">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#01AC9F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Batch Activity</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {totalBatches} active batch(es). {batchStats.filter((b) => b.submissionCount > 0).length} have submissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
          Batch Rankings
        </h3>

        <div className="flex flex-col gap-4 flex-1">
          {batchStats.length > 0 ? (
            batchStats
              .sort((a, b) => b.avgScore - a.avgScore)
              .slice(0, 5)
              .map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-black w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? "bg-[#FFACE8] text-[#6C1D5F]" : "bg-gray-100 dark:bg-white/10 text-gray-500"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="font-bold border-[#01AC9F]/20 text-[#01AC9F] bg-[#01AC9F]/5">
                    {item.avgScore}%
                  </Badge>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">No batch data yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
