import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Eye, MousePointerClick, Target, TrendingUp, Calendar, Filter } from "lucide-react";
import { CourseService, CategoryService } from "@/services/api";

const COLORS = [
  "#6C1D5F",
  "#01AC9F",
  "#FF6200",
  "#F4A261",
  "#E76F51",
  "#34d399",
  "#a78bfa",
  "#f97316",
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("monthly");
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseData, catData] = await Promise.all([
          CourseService.getCourses(),
          CategoryService.getCategories(),
        ]);
        setCourses(courseData || []);
        setCategories(catData || []);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Metrics
  let totalViews = 0;
  let totalClicks = 0;
  let totalCtr = 0;
  let totalSeo = 0;

  courses.forEach((c) => {
    totalViews += c.totalViews || 0;
    totalClicks += c.totalClicks || 0;
    totalCtr += c.ctr || 0;
    totalSeo += c.seoScore || 0;
  });

  const avgCtr = courses.length ? (totalCtr / courses.length).toFixed(1) : 0;
  const avgSeoScore = courses.length ? Math.round(totalSeo / courses.length) : 0;

  // Compute Category Distribution
  const catCount = {};
  courses.forEach((c) => {
    const catName = c.categoryName || c.category || "Uncategorized";
    catCount[catName] = (catCount[catName] || 0) + 1;
  });
  const categoryDistribution = Object.keys(catCount)
    .map((name) => ({
      name,
      value: catCount[name],
    }))
    .sort((a, b) => b.value - a.value);

  // Compute Top Courses
  const topCourses = [...courses]
    .sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0))
    .slice(0, 5)
    .map((c) => ({
      name: c.title,
      views: c.totalViews || 0,
      clicks: c.totalClicks || 0,
    }));

  // Compute Activity (Using createdAt for demo purposes)
  const monthlyActivityMap = {};
  const yearlyActivityMap = {};
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  courses.forEach((c) => {
    if (c.createdAt) {
      const date = new Date(c.createdAt);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear().toString();

      if (!monthlyActivityMap[month])
        monthlyActivityMap[month] = { name: month, views: 0, clicks: 0 };
      monthlyActivityMap[month].views += c.totalViews || 0;
      monthlyActivityMap[month].clicks += c.totalClicks || 0;

      if (!yearlyActivityMap[year]) yearlyActivityMap[year] = { name: year, views: 0, clicks: 0 };
      yearlyActivityMap[year].views += c.totalViews || 0;
      yearlyActivityMap[year].clicks += c.totalClicks || 0;
    }
  });

  // Fill all months to make the chart look complete even if empty
  const monthlyActivity = monthNames.map(
    (m) => monthlyActivityMap[m] || { name: m, views: 0, clicks: 0 },
  );

  // Sort years
  const yearlyActivity = Object.values(yearlyActivityMap).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const activityData = timeRange === "monthly" ? monthlyActivity : yearlyActivity;

  // Custom Tooltip for Line Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#333] p-3 rounded-lg shadow-xl">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600 dark:text-gray-300 capitalize">{entry.name}:</span>
              <span className="text-gray-900 dark:text-white">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Platform Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track views, clicks, and overall performance across courses and categories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-[#1A1A1A] p-1 rounded-lg border border-gray-200 dark:border-[#333]">
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === "monthly" ? "bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange("yearly")}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === "yearly" ? "bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* ─── Key Metrics ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {totalViews.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 uppercase tracking-wider">
            Total Views
          </p>
        </div>

        {/* Total Clicks */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {totalClicks.toLocaleString()}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 uppercase tracking-wider">
            Total Clicks
          </p>
        </div>

        {/* Click-Through Rate */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {avgCtr}%
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 uppercase tracking-wider">
            Avg. CTR
          </p>
        </div>

        {/* SEO Score */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {avgSeoScore}/100
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 uppercase tracking-wider">
            Avg. SEO Score
          </p>
        </div>
      </div>

      {/* ─── Main Charts ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Platform Activity</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Views vs Clicks ({timeRange})
              </p>
            </div>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#333"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dx={-10}
                  tickFormatter={(val) => (val > 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
                <Line
                  type="monotone"
                  name="Total Views"
                  dataKey="views"
                  stroke="#6C1D5F"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  name="Total Clicks"
                  dataKey="clicks"
                  stroke="#01AC9F"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-6 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Content spread by category</p>
          </div>
          <div className="flex-1 min-h-[280px]">
            {categoryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #333",
                      backgroundColor: "var(--tw-colors-gray-900)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff", fontSize: "14px", fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                No categories found.
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4">
            {categoryDistribution.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span
                  className="text-xs text-gray-600 dark:text-gray-400 truncate"
                  title={entry.name}
                >
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Section: Top Courses Bar Chart ─── */}
      <div className="bg-white dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-[#333] shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Top Performing Courses
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on highest total views and clicks
          </p>
        </div>
        <div className="h-[350px] w-full">
          {topCourses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCourses}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="#333"
                  strokeOpacity={0.2}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888", fontWeight: 600 }}
                  width={120}
                />
                <RechartsTooltip cursor={{ fill: "transparent" }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
                <Bar
                  dataKey="views"
                  name="Total Views"
                  fill="#6C1D5F"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="clicks"
                  name="Total Clicks"
                  fill="#F4A261"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No courses available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
