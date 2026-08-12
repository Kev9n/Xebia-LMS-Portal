import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, BookOpen, GraduationCap, ArrowLeft, AlertCircle,
} from "lucide-react";
import { AllocationService, BatchService, UserService, CourseService } from "@/services/api";
import { useRouter, useParams } from "@tanstack/react-router";
import { clsx } from "clsx";
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C", "#4A1E47"];

export default function BatchDetailAdmin() {
  const router = useRouter();
  const { batchId } = useParams({ strict: false });
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [courseMap, setCourseMap] = useState({});

  useEffect(() => { fetchData(); }, [batchId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchData, allocData, users, courses] = await Promise.all([
        BatchService.getBatches().catch(() => []),
        AllocationService.getBatchAllocations(batchId).catch(() => []),
        UserService.getUsers().catch(() => []),
        CourseService.getCourses().catch(() => []),
      ]);
      const batchList = Array.isArray(batchData) ? batchData : [];
      setBatch(batchList.find((b) => b.id === batchId) || null);
      setAllocations(Array.isArray(allocData) ? allocData : []);

      const uMap = {};
      (Array.isArray(users) ? users : []).forEach((u) => { uMap[u.id] = u; });
      setUserMap(uMap);

      const cMap = {};
      (Array.isArray(courses) ? courses : []).forEach((c) => { cMap[c.id] = c.title || c.name; });
      setCourseMap(cMap);
    } catch (err) {
      console.error("Failed to load batch details:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTrainerName = (id) => userMap[id]?.name || "Unknown Trainer";
  const getCourseName = (id) => courseMap[id] || id?.substring(0, 8) || "—";

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-[200px] animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-[300px] animate-pulse" />
          <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-[300px] animate-pulse" />
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Batch Not Found</h2>
          <button onClick={() => router.navigate({ to: "/admin/batches" })} className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#84117C] text-white text-sm font-bold rounded-xl transition-all">
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  // Course distribution — use resolved names
  const courseDistribution = {};
  allocations.forEach((a) => {
    const name = getCourseName(a.courseId);
    if (!courseDistribution[name]) courseDistribution[name] = { name, value: 0 };
    courseDistribution[name].value++;
  });
  const courseChartData = Object.values(courseDistribution);

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-6">
      {/* Back */}
      <button onClick={() => router.navigate({ to: "/admin/batches" })}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Batches
      </button>

      {/* Batch Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5">
        <div className="flex items-center gap-4">
          {batch.icon && (batch.icon.startsWith("data:image") || batch.icon.startsWith("http")) ? (
            <div className="w-14 h-14 shrink-0 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2e2e3e] shadow-sm">
              <img src={batch.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            </div>
          ) : (
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#6C1D5F]/10 flex items-center justify-center text-2xl">
              {batch.icon || "📚"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{batch.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {batch.academicSession && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500">
                  <Calendar className="w-3 h-3" /> {batch.academicSession}
                </span>
              )}
              <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-md", batch.status === "active" ? "bg-[#01AC9F]/10 text-[#01AC9F]" : "bg-gray-100 text-gray-500")}>
                {batch.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Students", value: batch.studentCount || batch.students?.length || 0, icon: Users, color: "text-[#6C1D5F]", bg: "bg-[#6C1D5F]/10" },
          { label: "Allocations", value: allocations.length, icon: GraduationCap, color: "text-[#01AC9F]", bg: "bg-[#01AC9F]/10" },
          { label: "Courses", value: new Set(allocations.map((a) => a.courseId)).size, icon: BookOpen, color: "text-[#FF6200]", bg: "bg-[#FF6200]/10" },
          { label: "Trainers", value: new Set(allocations.map((a) => a.trainerId)).size, icon: GraduationCap, color: "text-[#84117C]", bg: "bg-[#84117C]/10" },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={clsx("w-4 h-4", stat.color)} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Course Distribution Pie Chart */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Course Distribution</h3>
          <div className="h-[220px]">
            {courseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={courseChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {courseChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={28} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">No allocation data</div>
            )}
          </div>
        </div>

        {/* Allocations List */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-[#2e2e3e]">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Allocations</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-[#2e2e3e] max-h-[300px] overflow-y-auto">
            {allocations.length > 0 ? allocations.map((alloc) => (
              <div key={alloc.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-[#6C1D5F]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {getTrainerName(alloc.trainerId)}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {getCourseName(alloc.courseId)} • {alloc.academicSession || "—"}
                  </p>
                </div>
                <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0", alloc.status === "active" ? "bg-[#01AC9F]/10 text-[#01AC9F]" : "bg-gray-100 text-gray-500")}>
                  {alloc.status}
                </span>
              </div>
            )) : (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">No allocations yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
