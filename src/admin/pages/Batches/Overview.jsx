import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Building2,
  Calendar,
  BarChart3,
  ArrowRight,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { AllocationService, UserService, BatchService, CourseService } from "@/services/api";
import { useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useLMS } from "@/context/LMSContext";

const KpiCard = ({ title, value, icon: Icon, color, bg, trend, trendValue, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6 hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
          {title}
        </p>
        <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className={clsx("w-3 h-3", trendValue?.startsWith("-") ? "text-red-500" : "text-[#01AC9F]")} />
            <span className={clsx("text-xs font-bold", trendValue?.startsWith("-") ? "text-red-500" : "text-[#01AC9F]")}>
              {trendValue}
            </span>
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

const QuickAction = ({ title, description, icon: Icon, color, onClick, delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    onClick={onClick}
    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5 text-left hover:shadow-md hover:border-[#6C1D5F]/30 dark:hover:border-[#84117C]/30 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#6C1D5F] group-hover:translate-x-1 transition-all" />
    </div>
  </motion.button>
);

export default function BatchesOverview() {
  const router = useRouter();
  const { deleteBatchCascade } = useLMS();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrainers: 0,
    activeBatches: 0,
    coursesAssigned: 0,
    pendingAllocations: 0,
    activeUniversities: 0,
    totalAllocations: 0,
  });
  const [recentAllocations, setRecentAllocations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allocations, users, batchData, courseData] = await Promise.all([
        AllocationService.getAllocations().catch(() => []),
        UserService.getUsers("teacher").catch(() => []),
        BatchService.getBatches().catch(() => []),
        CourseService.getCourses().catch(() => []),
      ]);

      const trainerList = Array.isArray(users) ? users : [];
      const batchList = Array.isArray(batchData) ? batchData : [];
      const courseList = Array.isArray(courseData) ? courseData : [];
      const allocList = Array.isArray(allocations) ? allocations : [];

      setTrainers(trainerList);
      setBatches(batchList);
      setCourses(courseList);
      setRecentAllocations(allocList.slice(0, 5));

      const activeAllocations = allocList.filter((a) => a.status === "active");
      const pendingAllocations = allocList.filter((a) => a.status === "pending" || !a.startDate);

      setStats({
        totalTrainers: trainerList.length,
        activeBatches: batchList.filter((b) => b.status === "active").length,
        coursesAssigned: new Set(activeAllocations.map((a) => a.courseId)).size,
        pendingAllocations: pendingAllocations.length,
        totalAllocations: allocList.length,
      });
    } catch (err) {
      console.error("Failed to load batch overview:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (e, batch) => {
    e.stopPropagation();
    if (!confirm(`Permanently delete batch "${batch.name}"? This will also delete all associated assessments, submissions, and allocations. This cannot be undone.`)) return;
    try {
      await deleteBatchCascade(batch.id);
      setBatches((prev) => prev.filter((b) => b.id !== batch.id));
    } catch (err) {
      console.error("Failed to delete batch:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 animate-pulse">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
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
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Batch Management
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Overview of all batches, trainer allocations, and course assignments.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1a1a24] hover:bg-gray-200 dark:hover:bg-[#252535] text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl transition-colors"
          >
            <RefreshCw className={clsx("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={() => router.navigate({ to: "/admin/batches/allocate" })}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-bold rounded-xl transition-all shadow-[0_2px_10px_-2px_rgba(108,29,95,0.4)] hover:shadow-[0_4px_14px_-2px_rgba(108,29,95,0.5)] hover:-translate-y-0.5"
          >
            <GraduationCap className="w-4 h-4" />
            Allocate Course
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          title="Total Trainers"
          value={stats.totalTrainers}
          icon={Users}
          color="text-[#6C1D5F] dark:text-[#84117C]"
          bg="bg-[#6C1D5F]/10 dark:bg-[#84117C]/10"
          trend
          trendValue="+2"
          delay={0}
        />
        <KpiCard
          title="Active Batches"
          value={stats.activeBatches}
          icon={BookOpen}
          color="text-[#01AC9F]"
          bg="bg-[#01AC9F]/10"
          trend
          trendValue="+5"
          delay={0.05}
        />
        <KpiCard
          title="Courses Assigned"
          value={stats.coursesAssigned}
          icon={GraduationCap}
          color="text-[#FF6200]"
          bg="bg-[#FF6200]/10"
          trend
          trendValue="+3"
          delay={0.1}
        />
        <KpiCard
          title="Universities"
          value={stats.activeUniversities}
          icon={Building2}
          color="text-[#84117C] dark:text-[#D3CCEC]"
          bg="bg-[#84117C]/10 dark:bg-[#D3CCEC]/10"
          trend
          trendValue="+1"
          delay={0.15}
        />
        <KpiCard
          title="Total Allocations"
          value={stats.totalAllocations}
          icon={BarChart3}
          color="text-[#01AC9F]"
          bg="bg-[#01AC9F]/10"
          trend
          trendValue="+8"
          delay={0.2}
        />
        <KpiCard
          title="Pending"
          value={stats.pendingAllocations}
          icon={Clock}
          color="text-yellow-600 dark:text-yellow-400"
          bg="bg-yellow-50 dark:bg-yellow-500/10"
          trend={stats.pendingAllocations > 0}
          trendValue={stats.pendingAllocations > 0 ? "Needs attention" : "All clear"}
          delay={0.25}
        />
      </div>

      {/* Batches Grid */}
      {batches.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Batches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {batches.map((batch, index) => {
              const hasImage = batch.icon && (batch.icon.startsWith("data:image") || batch.icon.startsWith("http"));
              return (
                <motion.div
                  key={batch.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  onClick={() => router.navigate({ to: `/admin/batches/${batch.id}` })}
                  className="group relative bg-white dark:bg-[#15151f] rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 cursor-pointer shadow-sm border border-transparent hover:shadow-xl hover:-translate-y-1 hover:border-[#6C1D5F]/30"
                >
                  {/* Cover Image or Gradient Header */}
                  {hasImage ? (
                    <div className="relative h-32 w-full overflow-hidden">
                      <img src={batch.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                      <div className="w-full h-full bg-gradient-to-br from-[#6C1D5F] to-[#01AC9F] items-center justify-center hidden">
                        <span className="text-4xl">📚</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-[#6C1D5F]/10 via-[#84117C]/5 to-[#01AC9F]/10 flex items-center justify-center">
                      <span className="text-4xl">{batch.icon || "📚"}</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    <span className={clsx(
                      "inline-block px-2 py-0.5 font-bold rounded-md text-xs uppercase font-mono shadow-sm",
                      batch.status === "active"
                        ? "bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F] dark:text-white border border-[#01AC9F]/20 dark:border-[#01AC9F]"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                    )}>
                      {batch.status === "active" ? "Active" : batch.status || "Draft"}
                    </span>
                    <button
                      onClick={(e) => handleDeleteBatch(e, batch)}
                      className="p-1 rounded-md bg-white/80 dark:bg-[#15151f]/80 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors shadow-sm cursor-pointer backdrop-blur-sm"
                      title="Delete batch and all associated data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors leading-tight block truncate">
                      {batch.name || batch.batchName || "Untitled Batch"}
                    </span>
                    {batch.course && (
                      <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
                        {batch.course}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 font-bold">
                        <Users className="w-3.5 h-3.5 text-[#01AC9F]" /> {batch.students?.length || batch.studentCount || 0} Enrolled
                      </span>
                      {batch.createdByName && (
                        <span className="flex items-center gap-1 font-semibold">
                          <BookOpen className="w-3 h-3 text-gray-400" />
                          {batch.createdByName}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            title="Allocate Course"
            description="Assign a course to a trainer and batch"
            icon={GraduationCap}
            color="bg-[#6C1D5F]"
            onClick={() => router.navigate({ to: "/admin/batches/allocate" })}
            delay={0}
          />
          <QuickAction
            title="View Allocations"
            description="See all active allocations"
            icon={BarChart3}
            color="bg-[#01AC9F]"
            onClick={() => router.navigate({ to: "/admin/batches/allocations" })}
            delay={0.05}
          />
          <QuickAction
            title="Trainer Workload"
            description="Monitor trainer capacity and assignments"
            icon={Users}
            color="bg-[#FF6200]"
            onClick={() => router.navigate({ to: "/admin/batches/trainers" })}
            delay={0.1}
          />
          <QuickAction
            title="Analytics"
            description="View detailed allocation analytics"
            icon={TrendingUp}
            color="bg-[#84117C]"
            onClick={() => router.navigate({ to: "/admin/batches/analytics" })}
            delay={0.15}
          />
        </div>
      </div>

      {/* Recent Allocations */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2e2e3e] flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Recent Allocations
          </h3>
          <button
            onClick={() => router.navigate({ to: "/admin/batches/allocations" })}
            className="text-xs font-bold text-[#6C1D5F] dark:text-[#84117C] hover:underline py-2 px-2"
          >
            View All
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
          {recentAllocations.length > 0 ? (() => {
            const trainerMap = {};
            trainers.forEach((t) => { trainerMap[t.id] = t.name; });
            const courseMap = {};
            courses.forEach((c) => { courseMap[c.id] = c.title || c.name; });

            return recentAllocations.map((alloc, idx) => (
              <motion.div
                key={alloc.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#6C1D5F]/10 dark:bg-[#84117C]/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#6C1D5F] dark:text-[#84117C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {alloc.academicSession || "No Session"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {trainerMap[alloc.trainerId] || "Unknown Trainer"} • {courseMap[alloc.courseId] || "Unknown Course"}
                  </p>
                </div>
                <span
                  className={clsx(
                    "text-xs font-bold px-2.5 py-1 rounded-md shrink-0",
                    alloc.status === "active"
                      ? "bg-[#01AC9F]/10 text-[#01AC9F]"
                      : alloc.status === "completed"
                        ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400"
                        : "bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400"
                  )}
                >
                  {alloc.status}
                </span>
              </motion.div>
            ));
          })() : (
            <div className="px-6 py-12 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No allocations yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Create your first allocation to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
