import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart4,
  AlertTriangle,
  Target,
  Download,
  Calendar,
  Layers,
  FolderKanban,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/skill-gap")({
  component: SkillGapDashboard,
});

function SkillGapDashboard() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const difficultyTypes = [
    { label: "Easy", count: data.difficultyDist.easy, color: "#01AC9F" },
    { label: "Medium", count: data.difficultyDist.medium, color: "#FF6200" },
    { label: "Hard", count: data.difficultyDist.hard, color: "#6C1D5F" },
  ];

  const gapScore = data.totalAssessments > 0
    ? Math.round((1 - data.passRate / 100) * 100 * 10) / 10
    : 0;

  const topMissingSkills = [
    data.difficultyDist.hard > data.difficultyDist.easy ? "Advanced Topics" : null,
    data.codingAssessments > data.mcqAssessments ? "Coding Skills" : null,
    data.avgScore < 60 ? "Core Fundamentals" : null,
  ].filter(Boolean);

  if (topMissingSkills.length === 0) {
    topMissingSkills.push("No critical gaps detected");
  }

  const noDataEmptyState = () => (
    <div className="p-8 text-center">
      <p className="text-sm text-gray-400 italic">No data available for skill gap analysis</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Skill Gap Dashboard
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

      {/* Top Row: Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl transition-transform group-hover:scale-110">
              <BarChart4 className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Failure Rate (Gap Proxy)
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{gapScore}%</h4>
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1 mt-3 overflow-hidden shadow-inner">
              <div className="bg-[#6C1D5F] h-full rounded-full" style={{ width: `${gapScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl transition-transform group-hover:scale-110">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Failed Submissions
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.evaluatedSubs.filter(s => s.percentage < 60).length}
            </h4>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Out of {data.evaluatedSubs.length} evaluated
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl transition-transform group-hover:scale-110">
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Potential Gap Areas
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {topMissingSkills.map((skill, i) => (
                <span key={i} className="px-2 py-1 rounded text-xs font-bold border"
                  style={{
                    backgroundColor: `${i === 0 ? "#01AC9F" : i === 1 ? "#6C1D5F" : "#FF6200"}15`,
                    color: i === 0 ? "#01AC9F" : i === 1 ? "#6C1D5F" : "#FF6200",
                    borderColor: `${i === 0 ? "#01AC9F" : i === 1 ? "#6C1D5F" : "#FF6200"}30`,
                  }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Difficulty Distribution */}
        <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 md:p-8 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8]">
          <h3 className="text-xl font-bold text-[#6C1D5F] dark:text-white mb-6">
            Assessment Difficulty Distribution
          </h3>

          <div className="space-y-6 flex-1">
            {difficultyTypes.map((d) => (
              <div key={d.label} className="space-y-2 group">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                    {d.label}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {d.count} assessments ({data.totalAssessments ? Math.round(d.count / data.totalAssessments * 100) : 0}%)
                  </span>
                </div>
                <div className="relative w-full bg-gray-100 dark:bg-white/5 rounded-full h-3 shadow-inner overflow-hidden">
                  <div
                    className="h-full rounded-full shadow-sm transition-all"
                    style={{ width: `${data.totalAssessments ? Math.round(d.count / data.totalAssessments * 100) : 0}%`, backgroundColor: d.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-white/10 pt-4">
            {difficultyTypes.map((d) => (
              <div key={d.label} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }}></span> {d.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Assessment Types by Gap */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex-1">
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="w-5 h-5 text-[#6C1D5F] dark:text-[#FFACE8]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Assessment Type Analysis
              </h3>
            </div>

            <div className="space-y-4">
              {[
                { label: "MCQ", count: data.mcqAssessments, color: "#6C1D5F" },
                { label: "Coding", count: data.codingAssessments, color: "#01AC9F" },
                { label: "Mixed", count: data.mixedAssessments, color: "#FF6200" },
              ].map((type) => (
                <div key={type.label} className="flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                      {type.label}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      {type.count} assessments
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-bold border"
                    style={{ backgroundColor: `${type.color}15`, color: type.color, borderColor: `${type.color}30` }}>
                    {data.totalAssessments ? Math.round(type.count / data.totalAssessments * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Batches at Risk */}
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#01AC9F]" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Batch Performance
              </h3>
            </div>

            <div className="space-y-4">
              {data.batchStats.length > 0 ? data.batchStats.slice(0, 5).map((b) => (
                <div key={b.id} className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                    {b.name || "Unnamed Batch"}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    b.avgScore < 60
                      ? "bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/20"
                      : "bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/20"
                  }`}>
                    {b.avgScore}% Avg
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 italic text-center py-4">No batch data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
