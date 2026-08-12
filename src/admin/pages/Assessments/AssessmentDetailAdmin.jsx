import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, Clock, Users, CheckCircle, XCircle,
  BarChart2, Award, TrendingUp, AlertCircle, Search, Download,
} from "lucide-react";
import {
  PieChart as RePie, Pie, Cell, Legend, ResponsiveContainer,
} from "recharts";
import { AdminAssessmentService, AssessmentService, UserService, BatchService } from "@/services/api";
import { clsx } from "clsx";

export default function AssessmentDetailAdmin() {
  const { assessmentId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [studentSearch, setStudentSearch] = useState("");
  const [userMap, setUserMap] = useState({});
  const [batchMap, setBatchMap] = useState({});

  useEffect(() => { fetchData(); }, [assessmentId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportData, allAssessments, users, batches] = await Promise.all([
        AdminAssessmentService.getStudentReport(assessmentId).catch(() => null),
        AssessmentService.getAssessments().catch(() => []),
        UserService.getUsers().catch(() => []),
        BatchService.getBatches().catch(() => []),
      ]);
      setReport(reportData);
      const uMap = {};
      (Array.isArray(users) ? users : []).forEach((u) => { uMap[u.id] = u; });
      setUserMap(uMap);
      const bMap = {};
      (Array.isArray(batches) ? batches : []).forEach((b) => { bMap[b.id] = b; });
      setBatchMap(bMap);
      const found = (Array.isArray(allAssessments) ? allAssessments : []).find((a) => a.id === assessmentId);
      setAssessment(found || reportData?.assessment);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // ALL derived values must be BEFORE any conditional returns
  const summary = report?.summary || {};
  const students = report?.students || [];

  const resolvedStudents = useMemo(() => {
    if (!assessment || !students.length) return students;
    const batchIds = assessment.batches || [];
    const enrolledStudentIds = new Set();
    batchIds.forEach((bId) => {
      const b = batchMap[bId];
      if (b?.students) b.students.forEach((sId) => enrolledStudentIds.add(sId));
    });
    const attemptedIds = new Set(students.map((s) => s.studentId));
    const result = students.map((s) => {
      const user = userMap[s.studentId];
      return {
        ...s,
        studentName: user?.name || s.studentId,
        email: user?.email || "",
        batch: batchIds.map((bId) => batchMap[bId]?.name).filter(Boolean).join(", ") || "—",
      };
    });
    enrolledStudentIds.forEach((sId) => {
      if (!attemptedIds.has(sId)) {
        const user = userMap[sId];
        result.push({
          studentId: sId,
          studentName: user?.name || sId,
          email: user?.email || "",
          batch: batchIds.map((bId) => batchMap[bId]?.name).filter(Boolean).join(", ") || "—",
          score: null,
          percentage: 0,
          passFail: "Not Attempted",
          timeTaken: null,
          attemptStatus: "Not Attempted",
        });
      }
    });
    return result;
  }, [students, assessment, userMap, batchMap]);

  const getStudentName = (s) => s.studentName || userMap[s.studentId]?.name || s.studentId;

  const passFailData = [
    { name: "Passed", value: summary.passed || 0 },
    { name: "Failed", value: summary.failed || 0 },
  ];

  const overviewStats = [
    { title: "Total Assigned", value: summary.totalAssigned || 0, icon: Users, color: "#6C1D5F" },
    { title: "Attempted", value: summary.attempted || 0, icon: CheckCircle, color: "#01AC9F" },
    { title: "Passed", value: summary.passed || 0, icon: Award, color: "#01AC9F" },
    { title: "Failed", value: summary.failed || 0, icon: XCircle, color: "#FF6200" },
    { title: "Avg Score", value: `${Math.round(summary.averageScore || 0)}%`, icon: TrendingUp, color: "#84117C" },
    { title: "Highest", value: `${summary.highestScore || 0}%`, icon: BarChart2, color: "#6C1D5F" },
  ];

  const filteredStudents = resolvedStudents.filter((s) => {
    if (!studentSearch) return true;
    const q = studentSearch.toLowerCase();
    return (s.studentName || "").toLowerCase().includes(q) || (s.email || "").toLowerCase().includes(q);
  });

  const exportStudentCSV = () => {
    const headers = ["#", "Name", "Email", "Score", "Percentage", "Pass/Fail", "Time Taken (s)", "Status"];
    const rows = resolvedStudents.map((s, i) => [
      i + 1, getStudentName(s), s.email || "", s.score ?? "NA",
      s.percentage ? `${s.percentage}%` : "NA", s.passFail || "Not Attempted",
      s.timeTaken ?? "NA", s.attemptStatus || (s.passFail === "Not Attempted" ? "Not Attempted" : "Attempted"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessment?.title || "assessment"}_student_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // NOW conditional returns are AFTER all hooks
  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-[200px] animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white dark:bg-[#15151f] rounded-xl h-[80px] animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <button onClick={() => navigate({ to: "/admin/assessments" })} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-16 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="font-bold text-lg text-gray-700">Assessment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-6">
      <button onClick={() => navigate({ to: "/admin/assessments" })}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Assessments
      </button>

      {/* Assessment Header */}
      <div className="bg-gradient-to-r from-[#6C1D5F] to-[#84117C] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">{assessment.title}</h1>
            <p className="text-sm text-white/70 mt-1">{assessment.topic || "No topic"}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/20">{(assessment.type || "mcq").toUpperCase().replace("_", " ")}</span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/15">{assessment.difficulty}</span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/15 flex items-center gap-1"><Clock className="w-3 h-3" /> {assessment.duration}m</span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/15">{assessment.marks} pts</span>
            </div>
          </div>
          <div className="text-right text-xs text-white/70 space-y-1 shrink-0">
            {assessment.startDate && <p>Start: {assessment.startDate} {assessment.startTime || ""}</p>}
            {assessment.endDate && <p>End: {assessment.endDate} {assessment.endTime || ""}</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-[#2e2e3e]">
          {[{ id: "overview", label: "Overview" }, { id: "report", label: "Student Report" }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={clsx("px-6 py-3 text-sm font-bold transition-colors relative",
                activeTab === tab.id ? "text-[#6C1D5F] dark:text-[#84117C]" : "text-gray-500 hover:text-gray-700")}>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6C1D5F] dark:bg-[#84117C]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {overviewStats.map((stat) => (
                  <div key={stat.title} className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: stat.color + "15" }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Pass vs Fail</h3>
                  <div className="h-[180px]">
                    {passFailData.some((d) => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePie>
                          <Pie data={passFailData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                            <Cell fill="#01AC9F" /><Cell fill="#FF6200" />
                          </Pie>
                          <Legend verticalAlign="bottom" height={28} iconType="circle" />
                        </RePie>
                      </ResponsiveContainer>
                    ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data</div>}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">Performance Summary</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: "Average Score", value: `${Math.round(summary.averageScore || 0)}%` },
                      { label: "Highest Score", value: `${summary.highestScore || 0}%` },
                      { label: "Lowest Score", value: `${summary.lowestScore || 0}%` },
                      { label: "Median Score", value: `${summary.medianScore || 0}%` },
                      { label: "Submission Rate", value: `${Math.round(summary.submissionRate || 0)}%` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "report" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
                </div>
                <button onClick={exportStudentCSV}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-[#6C1D5F] hover:bg-[#84117C] text-white text-xs font-bold rounded-xl transition-all shrink-0">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              {filteredStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-[#1e1e2d] border-b border-gray-200 dark:border-[#2e2e3e]">
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
                      {filteredStudents.map((s, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors">
                          <td className="px-4 py-2.5 text-xs text-gray-500">{idx + 1}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] text-[10px] font-bold shrink-0">
                                {(getStudentName(s) || "?").substring(0, 2).toUpperCase()}
                              </div>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{getStudentName(s)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{s.email || "—"}</td>
                          <td className="px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white">
                            {s.score != null ? s.score : <span className="text-gray-400">NA</span>}
                          </td>
                          <td className="px-4 py-2.5">
                            {s.percentage > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#01AC9F] rounded-full" style={{ width: `${Math.min(s.percentage || 0, 100)}%` }} />
                                </div>
                                <span className="text-xs font-bold">{s.percentage}%</span>
                              </div>
                            ) : <span className="text-xs text-gray-400">NA</span>}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-md",
                              s.passFail === "Pass" ? "bg-[#01AC9F]/10 text-[#01AC9F]"
                                : s.passFail === "Not Attempted" ? "bg-gray-100 dark:bg-gray-800 text-gray-500"
                                  : "bg-[#FF6200]/10 text-[#FF6200]")}>
                              {s.passFail || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">
                            {s.timeTaken ? `${Math.round(s.timeTaken / 60)}m ${s.timeTaken % 60}s` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-500">No students found</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
