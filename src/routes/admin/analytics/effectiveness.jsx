import { createFileRoute } from "@tanstack/react-router";
import {
  Download,
  Calendar,
  Star,
  Brain,
  BookOpen,
  Code,
  CheckCircle2,
  Users,
  ThumbsUp,
  Activity,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/effectiveness")({
  component: TrainingEffectiveness,
});

function TrainingEffectiveness() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const topAssessments = [...data.assessments]
    .sort((a, b) => (b.passRate || 0) - (a.passRate || 0))
    .slice(0, 3);

  const assessmentTypeLabels = { mcq: "Theory", coding: "Hands-on", mixed: "Mixed" };
  const difficultyColors = { easy: "#01AC9F", medium: "#FF6200", hard: "#6C1D5F" };
  const rankLabels = ["Top 1%", "Top 5%", "Top 8%"];

  const topTeachers = data.teachers.slice(0, 3);

  const topBatches = [...data.batchStats]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  const noDataEmptyState = (label) => (
    <div className="p-5 flex items-center justify-center">
      <p className="text-sm text-gray-400 italic">No data available for {label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Training Effectiveness
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

      {/* Top Row: 6 Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Avg Score
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.avgScore}<span className="text-lg text-gray-400">%</span>
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Trainers
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.totalTrainers}
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Submissions
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.totalSubmissions}
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <ThumbsUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Pass Rate
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.passRate}%</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Avg Time Taken
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.avgTimeTaken}<span className="text-lg text-gray-400">m</span>
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Assessments
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.totalAssessments}</h4>
          </div>
        </div>
      </div>

      {/* Main Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insight 1: Top Assessments */}
        <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] hover:-translate-y-1 group">
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-2 h-6 bg-[#6C1D5F] rounded-full"></div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Top Rated Assessments
            </h3>
          </div>
          <div className="flex-1 divide-y divide-gray-100 dark:divide-white/5 flex flex-col">
            {topAssessments.length > 0 ? topAssessments.map((a, i) => (
              <div key={a.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#6C1D5F]/10 text-[#6C1D5F] dark:text-[#FFACE8] flex items-center justify-center shrink-0">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {a.title || a.name || "Untitled Assessment"}
                    </p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider truncate mt-1">
                      {assessmentTypeLabels[a.type] || a.type || "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-black text-[#6C1D5F] dark:text-[#FFACE8]">{a.passRate || 0}%</p>
                  <p className="text-[10px] font-black text-[#01AC9F] uppercase tracking-wider mt-0.5">
                    {rankLabels[i]}
                  </p>
                </div>
              </div>
            )) : noDataEmptyState("assessments")}
          </div>
        </section>

        {/* Insight 2: Best Rated Trainers */}
        <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] hover:-translate-y-1 group">
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-2 h-6 bg-[#01AC9F] rounded-full"></div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Trainers
            </h3>
          </div>
          <div className="flex-1 divide-y divide-gray-100 dark:divide-white/5 flex flex-col">
            {topTeachers.length > 0 ? topTeachers.map((t) => (
              <div key={t.id} className="p-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                    src={`https://i.pravatar.cc/150?u=${encodeURIComponent(t.name || t.id)}`}
                    alt={t.name || "Trainer"}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {t.name || "Unknown Trainer"}
                    </p>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider mt-1">
                      {t.specialization || "Trainer"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end text-[#01AC9F] font-black gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-lg">{t.rating || "N/A"}</span>
                  </div>
                </div>
              </div>
            )) : noDataEmptyState("trainers")}
          </div>
        </section>

        {/* Insight 3: Top Performing Batches */}
        <section className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#FF6200] dark:hover:border-[#FF6200] hover:-translate-y-1 group">
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center gap-3">
            <div className="w-2 h-6 bg-[#FF6200] rounded-full"></div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Top Performing Batches
            </h3>
          </div>
          <div className="flex-1 flex flex-col p-5 gap-4 justify-center">
            {topBatches.length > 0 ? topBatches.map((b) => (
              <div key={b.id}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {b.name || "Unnamed Batch"}
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#FF6200] px-2 py-1 bg-[#FF6200]/10 rounded shadow-sm">
                    {b.avgScore}% AVG
                  </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-[#FF6200] h-full rounded-full" style={{ width: `${Math.min(b.avgScore, 100)}%` }}></div>
                </div>
              </div>
            )) : noDataEmptyState("batches")}
          </div>
        </section>
      </div>
    </div>
  );
}
