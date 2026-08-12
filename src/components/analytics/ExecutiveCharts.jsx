import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C", "#4A1E47"];

const filter3D = (
  <defs>
    <filter id="3d-effect" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="6" stdDeviation="4" floodOpacity="0.3" />
      <feComponentTransfer in="SourceAlpha">
        <feFuncA type="linear" slope="0.5" />
      </feComponentTransfer>
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feOffset dx="0" dy="2" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export function ExecutiveCharts() {
  const { difficultyDist, monthlyTrends, batchStats } = useAnalyticsData();

  const donutData = [
    { name: "Easy", value: difficultyDist.easy },
    { name: "Medium", value: difficultyDist.medium },
    { name: "Hard", value: difficultyDist.hard },
  ].filter((d) => d.value > 0);

  const barData = batchStats.slice(0, 6).map((b) => ({
    name: b.name?.substring(0, 12) || "Batch",
    score: b.avgScore,
    submissions: b.submissionCount,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#6C1D5F] dark:hover:border-[#FFACE8] transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Assessment Difficulty Distribution
        </h3>
        <div className="h-[300px] w-full">
          {donutData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {filter3D}
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  style={{ filter: "url(#3d-effect)" }}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: "#111", fontWeight: "bold" }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No assessment data available yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#01AC9F] dark:hover:border-[#01AC9F] transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Monthly Submission Trends
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrends}>
              {filter3D}
              <defs>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#01AC9F" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#01AC9F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAvgScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6200" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF6200" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="submissions"
                name="Submissions"
                stroke="#01AC9F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSubmissions)"
                style={{ filter: "url(#3d-effect)" }}
              />
              <Area
                type="monotone"
                dataKey="avgScore"
                name="Avg. Score"
                stroke="#FF6200"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAvgScore)"
                style={{ filter: "url(#3d-effect)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#FF6200] dark:hover:border-[#FF6200] transition-colors duration-300">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          Batch Performance Overview
        </h3>
        <div className="h-[300px] w-full">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                {filter3D}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <RechartsTooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="score" fill="#6C1D5F" radius={[4, 4, 0, 0]} barSize={40} name="Avg. Score %" style={{ filter: "url(#3d-effect)" }} />
                <Bar dataKey="submissions" fill="#01AC9F" radius={[4, 4, 0, 0]} barSize={40} name="Submissions" style={{ filter: "url(#3d-effect)" }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No batch data available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
