import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, GraduationCap, TrendingUp, Search, Building2, Clock,
  AlertCircle, CheckCircle, BarChart3, ArrowRight, X, Zap,
} from "lucide-react";
import { AllocationService, UserService, BatchService, CourseService } from "@/services/api";
import { clsx } from "clsx";

const KpiCard = ({ title, value, icon: Icon, color, bg, subtitle, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={clsx("w-5 h-5", color)} />
      </div>
    </div>
  </motion.div>
);

export default function TrainerWorkload() {
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trainerData, allocData, batchData, courseData] = await Promise.all([
        UserService.getUsers("teacher").catch(() => []),
        AllocationService.getAllocations().catch(() => []),
        BatchService.getBatches().catch(() => []),
        CourseService.getCourses().catch(() => []),
      ]);
      setTrainers(Array.isArray(trainerData) ? trainerData : []);
      setAllocations(Array.isArray(allocData) ? allocData : []);
      setBatches(Array.isArray(batchData) ? batchData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const batchMap = useMemo(() => { const m = {}; batches.forEach((b) => { m[b.id] = b; }); return m; }, [batches]);
  const courseMap = useMemo(() => { const m = {}; courses.forEach((c) => { m[c.id] = c; }); return m; }, [courses]);

  const trainerStats = useMemo(() => trainers.map((trainer) => {
    const tAllocs = allocations.filter((a) => a.trainerId === trainer.id);
    const activeAllocs = tAllocs.filter((a) => a.status === "active");
    const uniqueBatches = new Set(activeAllocs.map((a) => a.batchId)).size;
    const uniqueCourses = new Set(activeAllocs.map((a) => a.courseId)).size;
    const utilization = Math.min(100, (activeAllocs.length / 5) * 100);
    return { ...trainer, totalAllocations: tAllocs.length, activeAllocations: activeAllocs.length, uniqueBatches, uniqueCourses, utilization, allocations: tAllocs };
  }), [trainers, allocations]);

  const filtered = trainerStats.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (t.name || "").toLowerCase().includes(s) || (t.email || "").toLowerCase().includes(s) || (t.department || "").toLowerCase().includes(s);
  });

  const totalActiveAllocations = trainerStats.reduce((s, t) => s + t.activeAllocations, 0);
  const avgUtilization = trainerStats.length > 0 ? Math.round(trainerStats.reduce((s, t) => s + t.utilization, 0) / trainerStats.length) : 0;
  const overutilized = trainerStats.filter((t) => t.utilization > 80).length;

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-5 h-[100px] animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl h-[200px] animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[#6C1D5F]" /> Trainer Workload
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Monitor trainer capacity, assignments, and utilization across the platform.
          </p>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Trainers" value={trainers.length} icon={Users} color="text-[#6C1D5F]" bg="bg-[#6C1D5F]/10" delay={0} />
        <KpiCard title="Active Allocations" value={totalActiveAllocations} icon={Zap} color="text-[#01AC9F]" bg="bg-[#01AC9F]/10" subtitle="across all trainers" delay={0.05} />
        <KpiCard title="Avg Utilization" value={`${avgUtilization}%`} icon={BarChart3} color="text-[#84117C]" bg="bg-[#84117C]/10" subtitle="platform-wide" delay={0.1} />
        <KpiCard title="Over-utilized" value={overutilized} icon={AlertCircle} color={overutilized > 0 ? "text-[#FF6200]" : "text-gray-400"} bg={overutilized > 0 ? "bg-[#FF6200]/10" : "bg-gray-100"} subtitle={overutilized > 0 ? "above 80% capacity" : "all within capacity"} delay={0.15} />
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search trainers by name, email, or department..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
        </div>
      </div>

      {/* Trainer Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((trainer, idx) => (
            <motion.div key={trainer.id}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.12)" }}
              onClick={() => setSelectedTrainer(selectedTrainer?.id === trainer.id ? null : trainer)}
              className={clsx("bg-white dark:bg-[#15151f] rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300",
                selectedTrainer?.id === trainer.id ? "border-[#6C1D5F] shadow-[0_0_20px_rgba(108,29,95,0.15)]" : "border-gray-100 dark:border-[#2e2e3e] hover:border-[#6C1D5F]/30"
              )}>

              {/* Trainer Header with gradient */}
              <div className="relative bg-gradient-to-r from-[#6C1D5F] to-[#84117C] p-5 text-white">
                <div className="flex items-center gap-4">
                  {trainer.avatar ? (
                    <img src={trainer.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-white/30 object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/30">
                      {trainer.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold truncate">{trainer.name}</p>
                    <p className="text-xs text-white/70 truncate">{trainer.email}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{trainer.department || "No department"}</p>
                  </div>
                </div>
                {/* Utilization badge */}
                <div className="absolute top-4 right-4">
                  <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold border-2",
                    trainer.utilization > 80 ? "bg-[#FF6200]/20 border-[#FF6200]/40 text-white" :
                    trainer.utilization > 50 ? "bg-[#01AC9F]/20 border-[#01AC9F]/40 text-white" :
                    "bg-white/20 border-white/30 text-white")}>
                    {Math.round(trainer.utilization)}%
                  </div>
                </div>
              </div>

              {/* Utilization Bar */}
              <div className="px-5 pt-4 pb-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Utilization</span>
                  <span className={clsx("text-[10px] font-bold",
                    trainer.utilization > 80 ? "text-[#FF6200]" : trainer.utilization > 50 ? "text-[#01AC9F]" : "text-gray-500")}>
                    {Math.round(trainer.utilization)}% of capacity
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-[#1a1a24] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${trainer.utilization}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className={clsx("h-full rounded-full", trainer.utilization > 80 ? "bg-[#FF6200]" : trainer.utilization > 50 ? "bg-[#01AC9F]" : "bg-[#6C1D5F]")} />
                </div>
              </div>

              {/* Stats Row */}
              <div className="px-5 pb-2 grid grid-cols-4 gap-2">
                {[
                  { label: "Active", value: trainer.activeAllocations, icon: Zap, color: "text-[#01AC9F]" },
                  { label: "Courses", value: trainer.uniqueCourses, icon: BookOpen, color: "text-[#84117C]" },
                  { label: "Batches", value: trainer.uniqueBatches, icon: GraduationCap, color: "text-[#FF6200]" },
                  { label: "Total", value: trainer.totalAllocations, icon: BarChart3, color: "text-gray-500" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center py-2">
                    <stat.icon className={clsx("w-4 h-4 mx-auto mb-1", stat.color)} />
                    <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Allocations Preview */}
              {trainer.allocations.length > 0 && (
                <div className="px-5 pb-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Allocations</p>
                  <div className="space-y-1.5">
                    {trainer.allocations.slice(0, 2).map((alloc) => {
                      const batch = batchMap[alloc.batchId];
                      const course = courseMap[alloc.courseId];
                      return (
                        <div key={alloc.id} className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1a24] rounded-lg px-2.5 py-1.5">
                          <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", alloc.status === "active" ? "bg-[#01AC9F]" : "bg-gray-400")} />
                          <span className="font-bold truncate">{course?.title || "Course"}</span>
                          <span className="text-gray-400">in</span>
                          <span className="truncate">{batch?.name || "Batch"}</span>
                        </div>
                      );
                    })}
                    {trainer.allocations.length > 2 && (
                      <p className="text-[10px] text-gray-400 text-center">+{trainer.allocations.length - 2} more</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm py-16 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500">No trainers found</p>
          <p className="text-xs text-gray-400 mt-1">{search ? "Try a different search" : "Add trainers to get started"}</p>
        </div>
      )}

      {/* Trainer Detail Panel */}
      <AnimatePresence>
        {selectedTrainer && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#6C1D5F] to-[#84117C] px-6 py-4 flex items-center justify-between text-white">
              <div>
                <h3 className="text-base font-bold">{selectedTrainer.name} — Allocation Details</h3>
                <p className="text-xs text-white/70">{selectedTrainer.allocations.length} total allocation(s)</p>
              </div>
              <button onClick={() => setSelectedTrainer(null)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedTrainer.allocations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#2e2e3e]">
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Session</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Start</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">End</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
                    {selectedTrainer.allocations.map((alloc) => {
                      const batch = batchMap[alloc.batchId];
                      const course = courseMap[alloc.courseId];
                      return (
                        <tr key={alloc.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#01AC9F]/10 flex items-center justify-center shrink-0"><GraduationCap className="w-3.5 h-3.5 text-[#01AC9F]" /></div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[140px]">{batch?.name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#FF6200]/10 flex items-center justify-center shrink-0"><BookOpen className="w-3.5 h-3.5 text-[#FF6200]" /></div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[140px]">{course?.title || "—"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-xs font-bold text-gray-600 dark:text-gray-300">{alloc.academicSession || "—"}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{alloc.startDate || "—"}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{alloc.endDate || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={clsx("text-[10px] font-bold px-2.5 py-1 rounded-md capitalize",
                              alloc.status === "active" ? "bg-[#01AC9F]/10 text-[#01AC9F]" :
                              alloc.status === "completed" ? "bg-purple-100 text-purple-700" :
                              "bg-red-100 text-red-600")}>
                              {alloc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-500">No allocations yet</p>
                <p className="text-xs text-gray-400 mt-1">Assign courses to this trainer using the Allocation Wizard</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
