import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function HoursCharts() {
  const COLORS = {
    velvet: "#6C1D5F",
    emerald: "#01AC9F",
    orange: "#FF6200",
  };

  const { monthlyTrends, batchStats } = useAnalyticsData();

  const trendData = monthlyTrends.map((m) => ({
    name: m.month,
    Submissions: m.submissions,
    AvgScore: m.avgScore,
  }));

  const batchData = batchStats.slice(0, 6).map((b) => ({
    name: b.name?.substring(0, 12) || "Batch",
    Submissions: b.submissionCount,
    AvgScore: b.avgScore,
  }));

  return (
    <div className="space-y-6 mb-8">
      <svg width="0" height="0">
        <defs>
          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="6" stdDeviation="4" floodOpacity="0.15" />
          </filter>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.velvet} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.velvet} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
            Submission Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Submissions" stroke={COLORS.velvet} fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} style={{ filter: "url(#shadow3d)" }} />
                <Area type="monotone" dataKey="AvgScore" stroke={COLORS.emerald} fill="none" strokeWidth={2} strokeDasharray="5 5" name="Avg. Score %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
            Submissions by Batch
          </h3>
          <div className="h-[300px] w-full">
            {batchData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="Submissions" fill={COLORS.emerald} radius={[6, 6, 0, 0]} barSize={40} style={{ filter: "url(#shadow3d)" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">No batch data available.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
            Avg. Score by Batch
          </h3>
          <div className="h-[300px] w-full">
            {batchData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.1} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12, fontWeight: 600 }} width={90} />
                  <RechartsTooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="AvgScore" fill={COLORS.orange} radius={[0, 6, 6, 0]} barSize={24} name="Avg. Score %" style={{ filter: "url(#shadow3d)" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">No batch data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
