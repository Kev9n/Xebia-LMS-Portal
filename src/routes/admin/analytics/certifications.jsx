import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Globe,
  Briefcase,
  UserCheck,
  TrendingUp,
  Download,
  Calendar,
  Cloud,
  Database,
  ArrowRight,
  RefreshCw,
  Maximize,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/certifications")({
  component: Certifications,
});

function Certifications() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const totalCerts = data.evaluatedSubs.length;
  const passRate = data.passRate;
  const avgScore = data.avgScore;

  const noDataEmptyState = () => (
    <tr>
      <td colSpan={5} className="py-8 text-center text-sm text-gray-400 italic">
        No certification data available
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Certifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Reporting Period: April 1 - June 30, 2026 • Last
            updated: {lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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

      {/* Top Row: 5 Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              TOTAL
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Submissions
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalCerts}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <Cloud className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#01AC9F] px-3 py-1 bg-[#01AC9F]/10 rounded-lg">
              AVG
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Avg Score
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {avgScore}<span className="text-lg text-gray-400">%</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6200] px-3 py-1 bg-[#FF6200]/10 rounded-lg">
              PASS
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Pass Rate
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {passRate}<span className="text-lg text-gray-400">%</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              BATCHES
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Batches
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.totalBatches}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#01AC9F] px-3 py-1 bg-[#01AC9F]/10 rounded-lg">
              LEARNERS
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Total Learners
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                {data.totalLearners}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Funnel - Submission Stats */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Submission Statistics
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              LIFECYCLE
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-white">
                <span className="text-gray-600 dark:text-gray-300">Total Submissions</span>
                <span className="text-[#6C1D5F] dark:text-[#FFACE8]">{data.totalSubmissions} Submissions</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner p-0.5">
                <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg w-full transition-all duration-1000"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-white">
                <span className="text-gray-600 dark:text-gray-300">Evaluated</span>
                <span className="text-[#6C1D5F] dark:text-[#FFACE8]">{data.evaluatedSubs.length} Submissions</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner p-0.5">
                <div className="h-full bg-gradient-to-r from-[#6C1D5F] to-[#802270] rounded-lg transition-all duration-1000 delay-200"
                  style={{ width: `${data.totalSubmissions ? Math.round(data.evaluatedSubs.length / data.totalSubmissions * 100) : 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-900 dark:text-white">
                <span className="text-[#01AC9F]">Passed (≥60%)</span>
                <span className="text-gray-500">{data.evaluatedSubs.filter(s => s.percentage >= 60).length} Submissions</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shadow-inner p-0.5">
                <div className="h-full bg-gradient-to-r from-[#01AC9F] to-[#018F84] rounded-lg transition-all duration-1000 delay-300"
                  style={{ width: `${passRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Assessment Types Table */}
      <section className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Assessment Types
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1">
                Distribution of assessments by type
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Type
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Count
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  % of Total
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Avg Score
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "MCQ", count: data.mcqAssessments, color: "#6C1D5F" },
                { label: "Coding", count: data.codingAssessments, color: "#01AC9F" },
                { label: "Mixed", count: data.mixedAssessments, color: "#FF6200" },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-4 font-bold text-gray-900 dark:text-white">
                    {row.label}
                  </td>
                  <td className="p-2">
                    <div className="w-32 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${data.totalAssessments ? Math.round(row.count / data.totalAssessments * 100) : 0}%`, backgroundColor: row.color }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-2 font-black text-gray-900 dark:text-white">
                    {data.totalAssessments ? Math.round(row.count / data.totalAssessments * 100) : 0}%
                  </td>
                  <td className="p-2 font-black text-[#01AC9F]">{data.avgScore}%</td>
                  <td className="p-2">
                    <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: `${row.color}15`, color: row.color }}>
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
              {data.totalAssessments === 0 && noDataEmptyState()}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
