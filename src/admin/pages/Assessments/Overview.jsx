import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Play,
  TrendingUp,
  CheckCircle,
  Users,
  Send,
  Search,
  Filter,
  ClipboardCheck,
  BarChart2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { AdminAssessmentService, AssessmentService, UserService } from "@/services/api";
import AssessmentCard from "@/components/assessment-admin/AssessmentCard";
import { clsx } from "clsx";

const statusFilters = ["All", "Draft", "Published", "Archived"];
const typeFilters = ["All", "MCQ", "Coding", "Assignment", "Mixed"];

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
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={clsx("w-6 h-6", color)} />
      </div>
    </div>
  </motion.div>
);

export default function AssessmentsOverview() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [trainerFilter, setTrainerFilter] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashData, assessData, trainerData] = await Promise.all([
        AdminAssessmentService.getDashboard().catch(() => null),
        AssessmentService.getAssessments().catch(() => []),
        UserService.getUsers("teacher").catch(() => []),
      ]);
      setDashboard(dashData);
      setAssessments(Array.isArray(assessData) ? assessData : []);
      setTrainers(Array.isArray(trainerData) ? trainerData : []);
    } catch (err) {
      console.error("Failed to load assessment data:", err);
    } finally {
      setLoading(false);
    }
  };

  const trainerMap = {};
  trainers.forEach((t) => { trainerMap[t.id] = t; });

  const filteredAssessments = assessments.filter((a) => {
    if (search && !(a.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "All" && a.status !== statusFilter.toLowerCase()) return false;
    if (typeFilter !== "All" && a.type !== typeFilter.toLowerCase()) return false;
    if (trainerFilter !== "All" && a.createdBy !== trainerFilter) return false;
    return true;
  });

  const kpis = [
    {
      title: "Total Assessments",
      value: dashboard?.totalAssessments || assessments.length,
      icon: FileText,
      color: "text-[#6C1D5F] dark:text-[#84117C]",
      bg: "bg-[#6C1D5F]/10 dark:bg-[#84117C]/10",
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Active Now",
      value: dashboard?.activeAssessments || 0,
      icon: Play,
      color: "text-[#01AC9F]",
      bg: "bg-[#01AC9F]/10",
      trend: "up",
      trendValue: "Live",
    },
    {
      title: "Avg Score",
      value: `${Math.round(dashboard?.averageScore || 0)}%`,
      icon: TrendingUp,
      color: "text-[#84117C]",
      bg: "bg-[#84117C]/10",
      trend: "up",
      trendValue: "+5%",
    },
    {
      title: "Pass Rate",
      value: `${Math.round(dashboard?.averagePassRate || 0)}%`,
      icon: CheckCircle,
      color: "text-[#01AC9F]",
      bg: "bg-[#01AC9F]/10",
      trend: "up",
      trendValue: "+3%",
    },
    {
      title: "Students Attempted",
      value: dashboard?.studentsAttempted || 0,
      icon: Users,
      color: "text-[#FF6200]",
      bg: "bg-[#FF6200]/10",
      trend: "up",
      trendValue: "of total",
    },
    {
      title: "Total Submissions",
      value: dashboard?.totalSubmissions || 0,
      icon: Send,
      color: "text-[#6C1D5F] dark:text-[#84117C]",
      bg: "bg-[#6C1D5F]/10 dark:bg-[#84117C]/10",
      trend: "up",
      trendValue: "+18%",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-32 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#6C1D5F]/10 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-[#6C1D5F] dark:text-purple-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Assessment Management
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              Monitor and analyze all assessments across the LMS
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <KpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            color={kpi.color}
            bg={kpi.bg}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            delay={idx * 0.05}
          />
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col xl:flex-row items-center justify-between gap-2">
        {/* Left Group */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto overflow-x-auto hide-scrollbar">
          {/* Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search assessments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-0"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden sm:block mx-1 shrink-0"></div>

          {/* Status Filter */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-0 w-full sm:w-auto sm:min-w-[130px]"
            >
              {statusFilters.map((f) => (
                <option key={f} value={f}>Status: {f}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Type Filter */}
          <div className="relative shrink-0">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-0 w-full sm:w-auto sm:min-w-[130px]"
            >
              {typeFilters.map((f) => (
                <option key={f} value={f}>Type: {f}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Trainer Filter */}
          <div className="relative shrink-0">
            <select
              value={trainerFilter}
              onChange={(e) => setTrainerFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 bg-gray-50 dark:bg-[#1a1a24] hover:bg-gray-100 dark:hover:bg-[#252535] border border-transparent dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all cursor-pointer min-w-0 w-full sm:w-auto sm:min-w-[150px]"
            >
              <option value="All">All Trainers</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Group */}
        <div className="flex items-center gap-2 w-full xl:w-auto shrink-0 justify-start xl:justify-end">
          <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden xl:block mx-1 shrink-0"></div>
          <div className="text-sm font-bold text-gray-500 dark:text-gray-400 px-3">
            {filteredAssessments.length} assessments
          </div>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAssessments.map((assessment, idx) => (
            <AssessmentCard key={assessment.id} assessment={assessment} index={idx} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm">
          <div className="px-6 py-16 text-center text-gray-400 text-sm">
            No assessments found. Try adjusting your search or filters.
          </div>
        </div>
      )}
    </div>
  );
}
