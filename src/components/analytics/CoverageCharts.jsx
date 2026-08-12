import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const getHeatmapColor = (val) => `rgba(1, 172, 159, ${val / 100})`;

export function CoverageCharts() {
  const { batchStats, monthlyTrends, totalLearners, totalSubmissions } = useAnalyticsData();

  const batchCoverageData = batchStats.slice(0, 6).map((b) => ({
    name: b.name?.substring(0, 12) || "Batch",
    coverage: b.studentCount > 0 ? Math.round((b.submissionCount / b.studentCount) * 100) : 0,
  }));

  const trendData = monthlyTrends.map((m) => ({
    name: m.month,
    Coverage: totalLearners > 0 ? Math.round((m.submissions / totalLearners) * 100) : 0,
    Participation: m.submissions,
  }));

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Batch Coverage</h3>
          <div className="h-[300px]">
            {batchCoverageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batchCoverageData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                  <RechartsTooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="coverage" fill="#FF6200" radius={[4, 4, 0, 0]} barSize={40} name="Coverage %" style={{ filter: "url(#shadow3d)" }} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">No batch data available.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
          <h3 className="font-bold text-gray-900 dark:text-white mb-6">Coverage Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCov" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C1D5F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6C1D5F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01AC9F" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#01AC9F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888" }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none" }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="Coverage" stroke="#6C1D5F" fillOpacity={1} fill="url(#colorCov)" strokeWidth={3} name="Coverage %" style={{ filter: "url(#shadow3d)" }} />
                <Area type="monotone" dataKey="Participation" stroke="#01AC9F" fillOpacity={1} fill="url(#colorPart)" strokeWidth={3} name="Submissions" style={{ filter: "url(#shadow3d)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
