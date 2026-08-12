import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Activity,
  Users,
  FileText,
} from "lucide-react";
import {
  PieChart as RePie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { AdminAssessmentService } from "@/services/api";
import { clsx } from "clsx";

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C", "#4A1E47", "#5C4F61", "#855889"];

const KpiCard = ({ title, value, icon: Icon, color, bg, trend, trendValue, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
        {trendValue && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={clsx("w-3 h-3", trend === "down" ? "text-red-500" : "text-[#01AC9F]")} />
            <span className={clsx("text-xs font-bold", trend === "down" ? "text-red-500" : "text-[#01AC9F]")}>{trendValue}</span>
            <span className="text-[10px] text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={clsx("w-6 h-6", color)} />
      </div>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={clsx("bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300", className)}>
    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
      {title}
    </h3>
    {children}
  </div>
);

export default function AssessmentsAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, dashData] = await Promise.all([
        AdminAssessmentService.getAnalytics().catch(() => null),
        AdminAssessmentService.getDashboard().catch(() => null),
      ]);
      setAnalytics(analyticsData);
      setDashboard(dashData);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-4 h-[220px] animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const typeData = analytics?.typeDistribution || [];
  const passFailData = analytics?.passVsFail
    ? [
        { name: "Passed", value: analytics.passVsFail.passed || 0 },
        { name: "Failed", value: analytics.passVsFail.failed || 0 },
      ]
    : [];
  const scoreData = analytics?.scoreDistribution || [];
  const difficultyData = analytics?.difficultyDistribution || [];
  const creationData = analytics?.creationTrend || [];
  const statusData = analytics?.statusDistribution || [];

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Assessment Analytics
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
          Deep insights into assessment performance and trends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Avg Score"
          value={`${Math.round(dashboard?.averageScore || 0)}%`}
          icon={TrendingUp}
          color="text-[#6C1D5F] dark:text-[#84117C]"
          bg="bg-[#6C1D5F]/10 dark:bg-[#84117C]/10"
          trend="up"
          trendValue="+5%"
          delay={0}
        />
        <KpiCard
          title="Pass Rate"
          value={`${Math.round(dashboard?.averagePassRate || 0)}%`}
          icon={Activity}
          color="text-[#01AC9F]"
          bg="bg-[#01AC9F]/10"
          trend="up"
          trendValue="+3%"
          delay={0.05}
        />
        <KpiCard
          title="Total Submissions"
          value={dashboard?.totalSubmissions || 0}
          icon={FileText}
          color="text-[#FF6200]"
          bg="bg-[#FF6200]/10"
          trend="up"
          trendValue="+18%"
          delay={0.1}
        />
        <KpiCard
          title="Students Attempted"
          value={dashboard?.studentsAttempted || 0}
          icon={Users}
          color="text-[#84117C]"
          bg="bg-[#84117C]/10"
          trend="up"
          trendValue="Active"
          delay={0.15}
        />
        <KpiCard
          title="Total Assessments"
          value={dashboard?.totalAssessments || 0}
          icon={BarChart2}
          color="text-[#4A1E47]"
          bg="bg-[#4A1E47]/10 dark:bg-[#D3CCEC]/10"
          trend="up"
          trendValue="All time"
          delay={0.2}
        />
        <KpiCard
          title="Active Now"
          value={dashboard?.activeAssessments || 0}
          icon={PieChart}
          color="text-[#01AC9F]"
          bg="bg-[#01AC9F]/10"
          trend={null}
          trendValue="Live"
          delay={0.25}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assessment Type Distribution */}
        <ChartCard title="Assessment Type Distribution">
          <div className="h-[220px]">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="type"
                    stroke="none"
                  >
                    {typeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" />
                </RePie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Pass vs Fail */}
        <ChartCard title="Pass vs Fail Distribution">
          <div className="h-[220px]">
            {passFailData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={passFailData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#01AC9F" />
                    <Cell fill="#FF6200" />
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" />
                </RePie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Score Distribution */}
        <ChartCard title="Score Distribution">
          <div className="h-[220px]">
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" fill="#6C1D5F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Difficulty Distribution */}
        <ChartCard title="Difficulty Distribution">
          <div className="h-[220px]">
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePie>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="level"
                    stroke="none"
                  >
                    {difficultyData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" />
                </RePie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Creation Trend */}
        <ChartCard title="Assessment Creation Trend">
          <div className="h-[220px]">
            {creationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creationData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C1D5F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C1D5F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#6C1D5F" fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Status Distribution */}
        <ChartCard title="Status Distribution">
          <div className="h-[220px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
