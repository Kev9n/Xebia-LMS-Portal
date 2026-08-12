import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from "recharts";
import { AllocationService } from "@/services/api";
import { TrendingUp, Building2, Users, BookOpen, Filter } from "lucide-react";
import { clsx } from "clsx";

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C", "#4A1E47", "#5C4F61", "#D3CCEC"];

const ChartCard = ({ title, children, className = "" }) => (
  <div className={clsx("bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300", className)}>
    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
      {title}
    </h3>
    {children}
  </div>
);

export default function BatchesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, allocData] = await Promise.all([
        AllocationService.getAnalytics().catch(() => ({})),
        AllocationService.getAllocations().catch(() => []),
      ]);
      setAnalytics(analyticsData);
      setAllocations(Array.isArray(allocData) ? allocData : []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compute chart data from allocations
  const trainerWorkload = {};
  allocations.forEach((a) => {
    if (!trainerWorkload[a.trainerId]) trainerWorkload[a.trainerId] = { name: a.trainerId.substring(0, 8), allocations: 0, courses: new Set() };
    trainerWorkload[a.trainerId].allocations++;
    trainerWorkload[a.trainerId].courses.add(a.courseId);
  });
  const trainerWorkloadData = Object.values(trainerWorkload).map((t) => ({ ...t, courses: t.courses.size })).slice(0, 8);

  const statusData = [
    { name: "Active", value: allocations.filter((a) => a.status === "active").length },
    { name: "Completed", value: allocations.filter((a) => a.status === "completed").length },
    { name: "Cancelled", value: allocations.filter((a) => a.status === "cancelled").length },
  ].filter((d) => d.value > 0);

  const monthlyData = {};
  allocations.forEach((a) => {
    const month = a.assignedAt ? new Date(a.assignedAt).toLocaleString("default", { month: "short" }) : "Unknown";
    if (!monthlyData[month]) monthlyData[month] = { month, allocations: 0 };
    monthlyData[month].allocations++;
  });
  const monthlyChartData = Object.values(monthlyData);

  const courseData = {};
  allocations.forEach((a) => {
    if (!courseData[a.courseId]) courseData[a.courseId] = { name: a.courseId.substring(0, 8), allocations: 0 };
    courseData[a.courseId].allocations++;
  });
  const courseChartData = Object.values(courseData).sort((a, b) => b.allocations - a.allocations).slice(0, 8);

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-4 h-[220px] animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
              <div className="h-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Allocation Analytics
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Enterprise insights into trainer workload, course distribution, and allocation trends.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "month", "quarter"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={clsx(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                timeRange === range
                  ? "bg-[#6C1D5F] text-white"
                  : "bg-gray-100 dark:bg-[#1a1a24] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252535]"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid — 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trainer Workload */}
        <ChartCard title="Trainer Workload">
          <div className="h-[220px]">
            {trainerWorkloadData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trainerWorkloadData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="allocations" fill="#6C1D5F" radius={[6, 6, 0, 0]} name="Allocations" />
                  <Bar dataKey="courses" fill="#01AC9F" radius={[6, 6, 0, 0]} name="Unique Courses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Monthly Allocation Trend */}
        <ChartCard title="Monthly Allocation Trend">
          <div className="h-[220px]">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorAlloc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C1D5F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6C1D5F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Area type="monotone" dataKey="allocations" stroke="#6C1D5F" fillOpacity={1} fill="url(#colorAlloc)" strokeWidth={3} name="Allocations" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Allocation Status */}
        <ChartCard title="Allocation Status">
          <div className="h-[220px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.name === "Active" ? "#01AC9F" :
                          entry.name === "Completed" ? "#6C1D5F" : "#FF6200"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Legend verticalAlign="bottom" height={28} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No data available</div>
            )}
          </div>
        </ChartCard>

        {/* Course Allocation Popularity */}
        {courseChartData.length > 0 && (
          <ChartCard title="Course Allocation Popularity">
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11, fontWeight: 600 }} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                  <Bar dataKey="allocations" fill="#84117C" radius={[0, 6, 6, 0]} name="Allocations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
