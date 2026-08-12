import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  CheckCircle2,
  Award,
  Clock,
  Star,
  Download,
  Calendar,
  LayoutGrid,
  TrendingUp,
  RefreshCw,
  Maximize,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/programs")({
  component: FlagshipPrograms,
});

function FlagshipPrograms() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const totalParticipants = data.totalLearners;
  const passRate = data.passRate;
  const avgScore = data.avgScore;

  const noDataEmptyState = () => (
    <tr>
      <td colSpan={6} className="py-12 text-center text-sm text-gray-400 italic">
        No batch/program data available
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Flagship Programs
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
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              GLOBAL
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Participants
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalParticipants.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#01AC9F] px-3 py-1 bg-[#01AC9F]/10 rounded-lg">
              RATE
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Pass Rate
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{passRate}%</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#FF6200] px-3 py-1 bg-[#FF6200]/10 rounded-lg">
              EFFORT
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Avg Time
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.avgTimeTaken}m</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              QUALITY
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

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#01AC9F] px-3 py-1 bg-[#01AC9F]/10 rounded-lg">
              IMPACT
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Total Assessments
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.totalAssessments}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Batch Programs Table */}
      <section className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Batch Programs Tracking
              </h3>
              <p className="text-xs font-medium text-gray-500 mt-1">
                Detailed performance metrics for all active batches
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Batch Name
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Submissions
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Avg Score
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Performance
                </th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-wider text-gray-400 text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.batchStats.length > 0 ? data.batchStats.map((batch) => (
                <tr key={batch.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                    <div className="flex flex-col">
                      <span>{batch.name || "Unnamed Batch"}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">
                        {batch.description || "Learning Batch"}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 font-black text-gray-900 dark:text-white">{batch.submissionCount}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#01AC9F]">{batch.avgScore}%</span>
                      <div className="w-24 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden hidden sm:block">
                        <div className="bg-[#01AC9F] h-full rounded-full" style={{ width: `${Math.min(batch.avgScore, 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="w-24 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden shadow-inner mb-2">
                      <div className="h-full bg-[#6C1D5F]" style={{ width: `${Math.min(batch.avgScore, 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      {batch.avgScore}%
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                      batch.avgScore >= 70
                        ? "bg-[#01AC9F]/10 text-[#01AC9F]"
                        : batch.avgScore >= 50
                        ? "bg-[#FF6200]/10 text-[#FF6200]"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {batch.avgScore >= 70 ? "STRONG" : batch.avgScore >= 50 ? "MODERATE" : "AT RISK"}
                    </span>
                  </td>
                </tr>
              )) : noDataEmptyState()}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
