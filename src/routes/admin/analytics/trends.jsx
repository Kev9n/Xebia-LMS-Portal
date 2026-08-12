import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Video,
  Clock,
  Award,
  Bot,
  Download,
  Users,
  Calendar,
  BarChart2,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export const Route = createFileRoute("/admin/analytics/trends")({
  component: LearningTrends,
});

function LearningTrends() {
  const [activeView, setActiveView] = useState("MoM");
  const [lastUpdated] = useState(new Date().toLocaleTimeString());
  const data = useAnalyticsData();

  const totalSessions = data.totalSubmissions;
  const employeesTrained = data.totalLearners;
  const totalSubs = data.totalSubmissions;
  const totalCerts = data.evaluatedSubs.filter(s => s.percentage >= 60).length;

  const monthlyData = data.monthlyTrends;
  const maxSubs = Math.max(...monthlyData.map(m => m.submissions), 1);

  const prevMonthSubs = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2].submissions : 0;
  const currMonthSubs = monthlyData.length >= 1 ? monthlyData[monthlyData.length - 1].submissions : 0;
  const momGrowth = prevMonthSubs ? Math.round(((currMonthSubs - prevMonthSubs) / prevMonthSubs) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-gray-900 dark:text-gray-100 p-6 md:p-8 font-sans transition-colors duration-300 space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-gray-300 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            Learning Trends
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Reporting Period: April 1 - June 30, 2026 • Last
            updated: {lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center bg-gray-100 dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveView("MoM")}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${activeView === "MoM" ? "bg-white dark:bg-white/10 text-[#6C1D5F] dark:text-[#FFACE8] shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              MoM
            </button>
            <button
              onClick={() => setActiveView("QoQ")}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${activeView === "QoQ" ? "bg-white dark:bg-white/10 text-[#6C1D5F] dark:text-[#FFACE8] shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              QoQ
            </button>
            <button
              onClick={() => setActiveView("YoY")}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${activeView === "YoY" ? "bg-white dark:bg-white/10 text-[#6C1D5F] dark:text-[#FFACE8] shadow-sm" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
            >
              YoY
            </button>
          </div>

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

      {/* Top Row: 5 Core Trend Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              VOLUME
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Total Submissions
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{totalSessions.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#01AC9F] px-3 py-1 bg-[#01AC9F]/10 rounded-lg">
              REACH
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Total Learners
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{employeesTrained.toLocaleString()}</h4>
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
                Avg Time Taken
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.avgTimeTaken}m</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C1D5F] dark:text-[#FFACE8] px-3 py-1 bg-[#6C1D5F]/10 dark:bg-[#FFACE8]/10 rounded-lg">
              IMPACT
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Pass Rate
              </p>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{data.passRate}%</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] group flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#01AC9F]/10 rounded-full blur-[20px] transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/10 dark:text-[#01AC9F] rounded-xl">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white px-3 py-1 bg-[#01AC9F] rounded-lg shadow-sm">
                TRENDING
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Avg Score
                </p>
                <h4 className="text-3xl font-black text-[#01AC9F] mt-1">{data.avgScore}%</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Chart & Indicators */}
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] group flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#FFACE8]/10 dark:text-[#FFACE8] rounded-xl">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Monthly Submission Trends
                </h3>
                <p className="text-xs font-medium text-gray-500 mt-1">
                  Performance visualization across {activeView} periods
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#6C1D5F] shadow-sm"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Submissions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#01AC9F] shadow-sm"></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Avg Score
                </span>
              </div>
            </div>
          </div>

          <div className="h-[380px] relative w-full flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 py-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-gray-100 dark:border-white/5"></div>
              ))}
            </div>

            <div className="relative w-full h-full px-4 pt-8 pb-10">
              <svg className="w-full h-full drop-shadow-xl" preserveAspectRatio="none" viewBox="0 0 1000 300">
                {monthlyData.length > 1 && (
                  <>
                    <path
                      d={`M${monthlyData.map((m, i) => {
                        const x = (i / (monthlyData.length - 1)) * 1000;
                        const y = 300 - (m.submissions / maxSubs) * 250;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      }).join(" ")}`}
                      fill="none"
                      stroke="#6C1D5F"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                    <path
                      d={`M${monthlyData.map((m, i) => {
                        const x = (i / (monthlyData.length - 1)) * 1000;
                        const y = 300 - (m.avgScore / 100) * 250;
                        return `${i === 0 ? "M" : "L"}${x},${y}`;
                      }).join(" ")}`}
                      fill="none"
                      stroke="#01AC9F"
                      strokeDasharray="10,6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      opacity="0.9"
                    />
                  </>
                )}
              </svg>
              <div className="absolute bottom-2 left-4 right-4 flex justify-between text-[10px] text-gray-400 font-black tracking-wider">
                {monthlyData.map((m, i) => (
                  <span key={i}>{m.month.toUpperCase()}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Growth Indicators Grid */}
        <section>
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="p-2 bg-[#FF6200]/10 text-[#FF6200] rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              Growth Indicators ({activeView})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Submission Growth %
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {momGrowth >= 0 ? "+" : ""}{momGrowth}%
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] dark:text-[#FFACE8]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6C1D5F] rounded-full" style={{ width: `${Math.min(Math.abs(momGrowth), 100)}%` }}></div>
              </div>
              <p className="text-xs font-bold text-gray-500 mt-2">MoM Change</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all hover:border-[#01AC9F] dark:hover:border-[#01AC9F] hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Total Batches
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {data.totalBatches}
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#01AC9F]/10 flex items-center justify-center text-[#01AC9F]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#01AC9F] rounded-full" style={{ width: `${Math.min(data.totalBatches * 10, 100)}%` }}></div>
              </div>
              <p className="text-xs font-bold text-[#01AC9F] mt-2">Active Programs</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm transition-all hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                    Pass Rate
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {data.passRate}%
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] dark:text-[#FFACE8]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-[#6C1D5F] rounded-full" style={{ width: `${data.passRate}%` }}></div>
              </div>
              <p className="text-xs font-bold text-gray-500 mt-2">Target: 70%</p>
            </div>

            <div className="bg-white dark:bg-[#111111] border border-[#FF6200]/20 rounded-2xl p-6 shadow-sm transition-all hover:border-[#FF6200] dark:hover:border-[#FF6200] hover:-translate-y-1 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#FF6200] mb-1">
                    Avg Score
                  </p>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {data.avgScore}%
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FF6200]/10 flex items-center justify-center text-[#FF6200]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full mt-6 overflow-hidden relative z-10">
                <div className="h-full bg-[#FF6200] rounded-full" style={{ width: `${data.avgScore}%` }}></div>
              </div>
              <p className="text-xs font-black text-[#FF6200] mt-2 relative z-10">
                Across {data.totalAssessments} assessments
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
