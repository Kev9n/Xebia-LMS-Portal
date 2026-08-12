import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Trash2, Eye, ChevronLeft, ChevronRight,
  MoreVertical, Users, BookOpen, GraduationCap, Clock,
} from "lucide-react";
import { AllocationService, UserService, BatchService, CourseService } from "@/services/api";
import { useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";

const ITEMS_PER_PAGE = 10;

const statusColors = {
  active: "bg-[#01AC9F]/10 text-[#01AC9F]",
  completed: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  cancelled: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function AllocationMatrix() {
  const router = useRouter();
  const [allocations, setAllocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allocData, userData, batchData, courseData] = await Promise.all([
        AllocationService.getAllocations().catch(() => []),
        UserService.getUsers().catch(() => []),
        BatchService.getBatches().catch(() => []),
        CourseService.getCourses().catch(() => []),
      ]);
      setAllocations(Array.isArray(allocData) ? allocData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setBatches(Array.isArray(batchData) ? batchData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error("Failed to load:", err);
    } finally { setLoading(false); }
  };

  // Lookup maps
  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => { m[u.id] = u; });
    return m;
  }, [users]);
  const batchMap = useMemo(() => {
    const m = {};
    batches.forEach((b) => { m[b.id] = b; });
    return m;
  }, [batches]);
  const courseMap = useMemo(() => {
    const m = {};
    courses.forEach((c) => { m[c.id] = c; });
    return m;
  }, [courses]);

  const resolveName = (id, map, nameField = "name", titleField = "title") => {
    const item = map[id];
    if (!item) return id?.substring(0, 8) + "...";
    return item[nameField] || item[titleField] || item.email || id;
  };

  const filtered = useMemo(() => {
    return allocations.filter((a) => {
      if (filterStatus !== "All" && a.status !== filterStatus.toLowerCase()) return false;
      if (search) {
        const s = search.toLowerCase();
        const trainerName = resolveName(a.trainerId, userMap);
        const batchName = resolveName(a.batchId, batchMap, "name", "name");
        const courseName = resolveName(a.courseId, courseMap, "title", "title");
        return (
          trainerName.toLowerCase().includes(s) ||
          batchName.toLowerCase().includes(s) ||
          courseName.toLowerCase().includes(s) ||
          (a.academicSession || "").toLowerCase().includes(s)
        );
      }
      return true;
    }).sort((a, b) => {
      const aVal = a.assignedAt || "";
      const bVal = b.assignedAt || "";
      return String(bVal).localeCompare(String(aVal));
    });
  }, [allocations, filterStatus, search, userMap, batchMap, courseMap]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this allocation?")) return;
    try {
      await AllocationService.deleteAllocation(id);
      setAllocations((prev) => prev.filter((a) => a.id !== id));
      setOpenMenu(null);
    } catch (err) { console.error(err); }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedRows.size} allocations?`)) return;
    for (const id of selectedRows) {
      try { await AllocationService.deleteAllocation(id); } catch (e) { /* continue */ }
    }
    setAllocations((prev) => prev.filter((a) => !selectedRows.has(a.id)));
    setSelectedRows(new Set());
  };

  const exportCSV = () => {
    const headers = ["Trainer", "Batch", "Course", "Session", "Status", "Start Date", "End Date"];
    const rows = filtered.map((a) => [
      resolveName(a.trainerId, userMap),
      resolveName(a.batchId, batchMap),
      resolveName(a.courseId, courseMap),
      a.academicSession, a.status, a.startDate || "", a.endDate || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "allocations.csv"; link.click();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="h-24 bg-white dark:bg-[#15151f] rounded-2xl animate-pulse"></div>
        <div className="bg-white dark:bg-[#15151f] rounded-2xl h-[400px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Allocation Matrix</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Manage and monitor all trainer-course-batch allocations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#1a1a24] hover:bg-gray-200 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => router.navigate({ to: "/admin/batches/allocate" })}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            + New Allocation
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col lg:flex-row items-center gap-2">
        <div className="relative flex-1 w-full min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by trainer, batch, course..." value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden lg:block mx-2"></div>
        <div className="flex items-center gap-2 flex-wrap">
          {["All", "Active", "Completed", "Cancelled"].map((s) => (
            <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
              className={clsx("px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all",
                filterStatus === s ? "bg-[#6C1D5F] text-white" : "bg-gray-100 dark:bg-[#1a1a24] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              )}>{s}</button>
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400 px-3">{filtered.length} allocations</span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm">
        <div className="overflow-x-auto table-scroll-hint">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#2e2e3e]">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedRows.size === paginated.length && paginated.length > 0}
                    onChange={() => setSelectedRows(selectedRows.size === paginated.length ? new Set() : new Set(paginated.map((a) => a.id)))}
                    className="rounded" />
                </th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trainer</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Batch</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">End</th>
                <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
              <AnimatePresence>
                {paginated.map((alloc) => {
                  const trainer = userMap[alloc.trainerId];
                  const batch = batchMap[alloc.batchId];
                  const course = courseMap[alloc.courseId];
                  return (
                    <motion.tr key={alloc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="group hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedRows.has(alloc.id)}
                          onChange={() => setSelectedRows((prev) => { const n = new Set(prev); n.has(alloc.id) ? n.delete(alloc.id) : n.add(alloc.id); return n; })}
                          className="rounded" />
                      </td>
                      {/* Trainer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {trainer?.avatar ? (
                            <img src={trainer.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 text-[#6C1D5F]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{trainer?.name || alloc.trainerId?.substring(0, 8) + "..."}</p>
                            <p className="text-xs text-gray-500 truncate">{trainer?.department || ""}</p>
                          </div>
                        </div>
                      </td>
                      {/* Batch */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#01AC9F]/10 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-3.5 h-3.5 text-[#01AC9F]" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                            {batch?.name || alloc.batchId?.substring(0, 8) + "..."}
                          </span>
                        </div>
                      </td>
                      {/* Course */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#FF6200]/10 flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-[#FF6200]" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                            {course?.title || alloc.courseId?.substring(0, 8) + "..."}
                          </span>
                        </div>
                      </td>
                      {/* Session */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{alloc.academicSession || "—"}</span>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={clsx("text-xs font-bold px-2.5 py-1 rounded-md capitalize", statusColors[alloc.status] || statusColors.active)}>
                          {alloc.status}
                        </span>
                      </td>
                      {/* Start Date */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {alloc.startDate || "—"}
                        </span>
                      </td>
                      {/* End Date */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{alloc.endDate || "—"}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === alloc.id ? null : alloc.id)}
                            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] text-gray-500 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === alloc.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl shadow-xl z-20 overflow-hidden">
                                <button onClick={() => { router.navigate({ to: `/admin/batches/${alloc.batchId}` }); setOpenMenu(null); }}
                                  className="w-full px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#252535] text-left">
                                  <Eye className="w-3.5 h-3.5" /> View Batch
                                </button>
                                <button onClick={() => handleDelete(alloc.id)}
                                  className="w-full px-4 py-2.5 text-xs font-bold text-red-600 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-bold">No allocations found</p>
            <p className="text-xs mt-1">Create one using the Allocate Course wizard</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl p-1 shadow-sm">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252535] disabled:opacity-40">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center px-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={clsx("w-10 h-10 rounded-lg text-sm font-bold mx-0.5 transition-colors",
                    p === currentPage ? "bg-[#6C1D5F] text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100")}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252535] disabled:opacity-40">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
