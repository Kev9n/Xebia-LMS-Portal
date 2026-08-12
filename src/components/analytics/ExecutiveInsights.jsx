import { Lightbulb, TrendingUp, ShieldAlert, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function ExecutiveInsights() {
  const { totalLearners, totalSubmissions, avgScore, passRate, topStudents, batchStats } = useAnalyticsData();

  return (
    <>
      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#FFACE8] dark:hover:border-[#6C1D5F] transition-colors duration-300 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-[#FFACE8] dark:text-[#FFACE8]" />
          Executive Insights
        </h3>

        <div className="space-y-4 flex-1">
          <div className="p-4 rounded-xl bg-accent-2/10 dark:bg-accent-2 border border-accent-2/20 dark:border-accent-2">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-accent-2 dark:text-accent-2 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Platform Activity</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {totalSubmissions} submission(s) from {totalLearners} learner(s) with an average score of {avgScore}%.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FF6200]/5 border border-[#FF6200]/10">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#FF6200] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Performance Overview</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pass rate is {passRate}%. {passRate < 70 ? "Consider reviewing assessment difficulty." : "Performance is within healthy range."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#01AC9F]/5 border border-[#01AC9F]/10">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-[#01AC9F] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Recommendation</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {batchStats.length > 0
                    ? `${batchStats.length} active batch(es). Top batch: "${batchStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.name}" with ${batchStats.sort((a, b) => b.avgScore - a.avgScore)[0]?.avgScore}% avg score.`
                    : "Create batches to organize learners and track performance."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
          Top Performers
        </h3>

        <div className="flex flex-col gap-4 flex-1">
          {topStudents.length > 0 ? (
            topStudents.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black w-5 h-5 rounded-full flex items-center justify-center ${i === 0 ? "bg-[#FFACE8] text-[#6C1D5F]" : "bg-gray-100 dark:bg-white/10 text-gray-500"}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                    {item.name}
                  </span>
                </div>
                <Badge variant="outline" className="font-bold border-[#01AC9F]/20 text-[#01AC9F] bg-[#01AC9F]/5">
                  {item.score}%
                </Badge>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">No student data yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
