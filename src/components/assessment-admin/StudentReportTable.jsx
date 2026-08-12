import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

const ITEMS_PER_PAGE = 15;

export default function StudentReportTable({ students = [], assessment }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [passFilter, setPassFilter] = useState("All");
  const [sortField, setSortField] = useState("studentName");
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !(s.studentName || "").toLowerCase().includes(q) &&
          !(s.email || "").toLowerCase().includes(q) &&
          !(s.studentId || "").toLowerCase().includes(q)
        ) return false;
      }
      if (statusFilter !== "All" && s.attemptStatus !== statusFilter) return false;
      if (passFilter === "Pass" && s.passFail !== "Pass") return false;
      if (passFilter === "Fail" && s.passFail !== "Fail") return false;
      return true;
    }).sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [students, search, statusFilter, passFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const exportCsv = () => {
    const headers = ["Student ID", "Name", "Email", "Course", "Batch", "Score", "Percentage", "Pass/Fail", "Attempt Status", "Start Time", "End Time", "Time Taken", "Submission Status", "Remarks"];
    const rows = filtered.map((s) => [
      s.studentId, s.studentName, s.email, s.course, s.batch,
      s.score, s.percentage, s.passFail, s.attemptStatus,
      s.startTime, s.endTime, s.timeTaken, s.submissionStatus, s.remarks,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assessment-report-${assessment?.title || "export"}.csv`;
    a.click();
  };

  const SortIcon = ({ field }) => (
    <ArrowUpDown className={clsx("w-3 h-3", sortField === field ? "text-[#6C1D5F]" : "text-gray-400")} />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2 outline-none cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Attempted">Attempted</option>
          <option value="Not Attempted">Not Attempted</option>
          <option value="Absent">Absent</option>
        </select>
        <select
          value={passFilter}
          onChange={(e) => { setPassFilter(e.target.value); setCurrentPage(1); }}
          className="bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2 outline-none cursor-pointer"
        >
          <option value="All">All Results</option>
          <option value="Pass">Passed</option>
          <option value="Fail">Failed</option>
        </select>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-100 dark:border-[#2e2e3e] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1a1a24] border-b border-gray-100 dark:border-[#2e2e3e]">
                {[
                  { key: "studentName", label: "Student" },
                  { key: "course", label: "Course" },
                  { key: "batch", label: "Batch" },
                  { key: "score", label: "Score" },
                  { key: "percentage", label: "%" },
                  { key: "passFail", label: "Result" },
                  { key: "attemptStatus", label: "Status" },
                  { key: "timeTaken", label: "Time" },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap"
                  >
                    <span className="flex items-center gap-1">
                      {col.label} <SortIcon field={col.key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-[#2e2e3e]">
              {paginated.map((student, idx) => (
                <motion.tr
                  key={student.studentId || idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{student.studentName}</p>
                      <p className="text-[10px] text-gray-500">{student.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{student.course || "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{student.batch || "—"}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{student.score ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{student.percentage != null ? `${student.percentage}%` : "—"}</td>
                  <td className="px-4 py-3">
                    {student.passFail === "Pass" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#01AC9F]/10 text-[#01AC9F]">
                        <CheckCircle className="w-3 h-3" /> Pass
                      </span>
                    ) : student.passFail === "Fail" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <XCircle className="w-3 h-3" /> Fail
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold",
                      student.attemptStatus === "Attempted" ? "bg-[#01AC9F]/10 text-[#01AC9F]" :
                      student.attemptStatus === "Not Attempted" ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {student.attemptStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                    {student.timeTaken ? `${Math.round(student.timeTaken / 60)}m` : "—"}
                  </td>
                </motion.tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-[#2e2e3e]">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a24] text-gray-500 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-colors",
                      currentPage === page
                        ? "bg-[#6C1D5F] text-white"
                        : "hover:bg-gray-100 dark:hover:bg-[#1a1a24] text-gray-500"
                    )}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a24] text-gray-500 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
