import { createFileRoute } from "@tanstack/react-router";
import {
  Lightbulb,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/recommendations")({
  component: RecommendationEngineDashboard,
});

function RecommendationEngineDashboard() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const topAssessments = [...data.assessments]
    .sort((a, b) => (b.passRate || 0) - (a.passRate || 0))
    .slice(0, 4);

  const topStudents = data.topStudents.slice(0, 4);

  const assessmentTypeLabels = { mcq: "Theory", coding: "Hands-on", mixed: "Mixed" };
  const matchColors = ["#01AC9F", "#FF6200", "#6C1D5F", "#01AC9F"];
  const transitionColors = ["#6C1D5F", "#FF6200", "#01AC9F"];

  const noDataEmptyState = () => (
    <div className="p-8 text-center">
      <p className="text-sm text-gray-400 italic">No data available for recommendations</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Learning Recommendation Engine
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

      {/* Top Row: AI Engine Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl transition-transform group-hover:scale-110">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Overall Pass Rate
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.passRate}%</h4>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Across {data.evaluatedSubs.length} evaluated submissions
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl transition-transform group-hover:scale-110">
              <Lightbulb className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Avg Score
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.avgScore}%</h4>
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1 mt-3 overflow-hidden shadow-inner">
              <div className="bg-[#FF6200] h-full rounded-full" style={{ width: `${data.avgScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Assessments */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Top Performing Assessments
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {topAssessments.length > 0 ? topAssessments.map((a, i) => (
              <div key={a.id} className="p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-[#151515] hover:border-[#01AC9F] transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#01AC9F] transition-colors">
                      {a.title || a.name || "Untitled Assessment"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {assessmentTypeLabels[a.type] || a.type || "Unknown"} | Difficulty: {a.difficulty || "N/A"}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-black border"
                    style={{ backgroundColor: `${matchColors[i % matchColors.length]}15`, color: matchColors[i % matchColors.length], borderColor: `${matchColors[i % matchColors.length]}30` }}>
                    {a.passRate || 0}% PASS
                  </span>
                </div>
              </div>
            )) : noDataEmptyState()}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#01AC9F]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Top Performing Students
              </h3>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            {topStudents.length > 0 ? topStudents.map((s, i) => (
              <div key={i} className="relative pl-6 border-l-2 group cursor-pointer" style={{ borderColor: `${transitionColors[i % transitionColors.length]}40` }}>
                <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1 transition-transform group-hover:scale-150" style={{ backgroundColor: transitionColors[i % transitionColors.length] }}></div>
                <div className="flex items-center gap-3 text-sm font-bold mb-2">
                  <span className="text-gray-900 dark:text-white">{s.name || "Unknown"}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Score: {s.score}% | Completed: {s.completed} assessments</p>
              </div>
            )) : noDataEmptyState()}
          </div>
        </div>
      </div>
    </div>
  );
}
