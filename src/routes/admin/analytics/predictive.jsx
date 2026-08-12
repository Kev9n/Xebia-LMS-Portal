import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  ShieldAlert,
  BrainCircuit,
  Download,
  Calendar,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/predictive")({
  component: PredictiveAnalyticsDashboard,
});

function PredictiveAnalyticsDashboard() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const topBatchesByScore = [...data.batchStats]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  const noDataEmptyState = () => (
    <div className="p-4 text-center">
      <p className="text-sm text-gray-400 italic">No data available for prediction</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Predictive Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Reporting Period: April 1 - June 30, 2026 • Last
            updated: {lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <Button
            size="sm"
            className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white shadow-sm transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Global Filters */}
      <GlobalFilters />

      {/* Analytics Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score Prediction - based on batch data */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Batch Performance Forecast
              </h3>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center pb-4 border-b border-gray-100 dark:border-white/10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Current Avg Score
              </p>
              <h4 className="text-4xl font-black text-gray-900 dark:text-white">{data.avgScore}%</h4>
              <span className="inline-flex items-center gap-1 text-[#01AC9F] text-xs font-bold mt-2">
                <ArrowUpRight className="w-4 h-4" /> Across {data.totalBatches} batches
              </span>
            </div>

            <div className="space-y-4">
              {topBatchesByScore.length > 0 ? topBatchesByScore.map((b) => (
                <div key={b.id} className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{b.name || "Unnamed Batch"}</span>
                  <span className="px-2 py-1 bg-[#01AC9F]/10 text-[#01AC9F] rounded text-xs font-bold">
                    {b.avgScore}% Avg
                  </span>
                </div>
              )) : noDataEmptyState()}
            </div>
          </div>
        </div>

        {/* AI Readiness Forecast - based on pass rate */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#01AC9F] dark:hover:border-[#01AC9F]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#01AC9F]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Performance Forecast
              </h3>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-center pb-4 border-b border-gray-100 dark:border-white/10">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Pass Rate
              </p>
              <h4 className="text-4xl font-black text-gray-900 dark:text-white">{data.passRate}%</h4>
              <span className="inline-flex items-center gap-1 text-[#FF6200] text-xs font-bold mt-2">
                {data.evaluatedSubs.length} evaluated submissions
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>MCQ Assessments</span>
                  <span>{data.mcqAssessments}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gray-400 h-full rounded-full" style={{ width: `${data.totalAssessments ? Math.round(data.mcqAssessments / data.totalAssessments * 100) : 0}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-white">
                  <span>Coding Assessments</span>
                  <span>{data.codingAssessments}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#6C1D5F] h-full rounded-full" style={{ width: `${data.totalAssessments ? Math.round(data.codingAssessments / data.totalAssessments * 100) : 0}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#01AC9F]">
                  <span>Mixed Assessments</span>
                  <span>{data.mixedAssessments}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#01AC9F] h-full rounded-full" style={{ width: `${data.totalAssessments ? Math.round(data.mixedAssessments / data.totalAssessments * 100) : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Risk Indicators */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#FF6200] dark:hover:border-[#FF6200]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FF6200]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Learning Risk Indicators
              </h3>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-4">
            <div className="p-4 border-l-4 border-l-[#FF6200] bg-[#FF6200]/5 dark:bg-[#FF6200]/10 rounded-r-xl group">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Low Pass Rate Batches
                </h4>
                <span className="text-[10px] font-black uppercase text-[#FF6200]">
                  {data.batchStats.filter(b => b.avgScore < 60).length} at Risk
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {data.batchStats.filter(b => b.avgScore < 60).length > 0
                  ? `${data.batchStats.filter(b => b.avgScore < 60).map(b => b.name || "Unnamed").join(", ")} showing below 60% average score. Intervention recommended.`
                  : "All batches performing above 60% threshold."}
              </p>
            </div>

            <div className="p-4 border-l-4 border-l-[#6C1D5F] bg-[#6C1D5F]/5 dark:bg-[#FFACE8]/10 rounded-r-xl group">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Difficulty Distribution
                </h4>
                <span className="text-[10px] font-black uppercase text-[#6C1D5F] dark:text-[#FFACE8]">
                  {data.difficultyDist.hard} Hard
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {data.difficultyDist.hard} hard, {data.difficultyDist.medium} medium, {data.difficultyDist.easy} easy assessments. Consider balancing difficulty levels.
              </p>
            </div>

            <div className="p-4 border-l-4 border-l-[#01AC9F] bg-[#01AC9F]/5 dark:bg-[#01AC9F]/10 rounded-r-xl group">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Avg Time to Complete
                </h4>
                <span className="text-[10px] font-black uppercase text-[#01AC9F]">
                  {data.avgTimeTaken} min
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Average time taken across {data.evaluatedSubs.length} evaluated submissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
