import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Clock,
  Award,
  Brain,
  Target,
  Download,
  Server,
  Cpu,
  Wallet,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/investment")({
  component: ProjectInvestment,
});

function ProjectInvestment() {
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const batchIcons = [Server, Cpu, Wallet, ShieldAlert];
  const batchColors = ["#6C1D5F", "#01AC9F", "#FF6200", "#6C1D5F"];
  const totalStudentsTrained = data.students.length;
  const totalHours = data.evaluatedSubs.reduce((sum, s) => sum + (s.timeTaken || 0), 0);

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Project Learning Investment
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

      {/* Top Row: 5 Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl transition-transform group-hover:scale-110">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Employees Trained
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalStudentsTrained.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl transition-transform group-hover:scale-110">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Learning Time
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {data.avgTimeTaken}<span className="text-xl text-gray-400">min avg</span>
            </h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6200] dark:hover:border-[#FF6200] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#FF6200]/10 text-[#FF6200] dark:bg-[#FF6200]/10 dark:text-[#FF6200] rounded-xl transition-transform group-hover:scale-110">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Assessments
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.totalAssessments}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] flex flex-col justify-between h-full group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl transition-transform group-hover:scale-110">
              <Brain className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Avg Score
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.avgScore}%</h4>
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1 mt-3 overflow-hidden shadow-inner">
              <div className="bg-[#6C1D5F] h-full rounded-full" style={{ width: `${data.avgScore}%` }}></div>
            </div>
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
              Pass Rate
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.passRate}%</h4>
            <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-1 mt-3 overflow-hidden shadow-inner">
              <div className="bg-[#01AC9F] h-full rounded-full" style={{ width: `${data.passRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Batch Analysis Leaderboard */}
      <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-300 dark:border-white/20 shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8]">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-[#6C1D5F] rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Batch Learning Analysis
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          {data.batchStats.length > 0 ? (
            <table className="w-full text-left min-w-[1000px]">
              <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Batch Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Submissions
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Avg Score
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {data.batchStats.map((batch, i) => {
                  const Icon = batchIcons[i % batchIcons.length];
                  const color = batchColors[i % batchColors.length];
                  return (
                    <tr key={batch.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform"
                            style={{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#FFACE8] transition-colors">
                              {batch.name || "Unnamed Batch"}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-0.5">
                              {batch.description || "Learning Batch"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-base font-black text-gray-900 dark:text-white">
                        {batch.submissionCount}
                      </td>
                      <td className="px-6 py-5 text-base font-black" style={{ color }}>
                        {batch.avgScore}%
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 w-32">
                          <div className="flex-1 bg-gray-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full shadow-sm" style={{ width: `${Math.min(batch.avgScore, 100)}%`, backgroundColor: color }}></div>
                          </div>
                          <span className="text-sm font-black" style={{ color }}>
                            {batch.avgScore}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-400 italic">No batch data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
