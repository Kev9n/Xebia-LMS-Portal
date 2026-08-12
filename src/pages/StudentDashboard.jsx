import React from "react";
import { useLMS } from "../context/LMSContext";
import { useNavigate } from "@tanstack/react-router";
import {
  ClipboardList,
  Trophy,
  TrendingUp,
  Calendar as CalendarIcon,
  Clock,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

export const StudentDashboard = () => {
  const { currentUser, assessments, submissions, batches, getLeaderboard } = useLMS();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const studentBatchIds = currentUser.batches || [];

  const assignedAssessments = assessments.filter(
    (a) => a.status === "published" && (a.batches || []).some((bId) => studentBatchIds.includes(bId)),
  );

  const studentSubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  const leaderboard = getLeaderboard();
  const rankObj = leaderboard.find((entry) => entry.studentId === currentUser.id);
  const currentRank = rankObj ? rankObj.rank : leaderboard.length;

  const nowStr = new Date().toISOString().split("T")[0];

  const activeAssessments = assignedAssessments.filter((a) => {
    const isCompleted = studentSubmissions.some((s) => s.assessmentId === a.id && s.status === "submitted");
    return a.startDate <= nowStr && a.endDate >= nowStr && !isCompleted;
  });

  const upcomingAssessments = assignedAssessments.filter((a) => a.startDate > nowStr);

  const completedAssessments = assignedAssessments.filter((a) =>
    studentSubmissions.some((s) => s.assessmentId === a.id && s.status === "submitted"),
  );

  const completedSubsWithAssessments = studentSubmissions
    .filter((s) => s.status === "submitted" && s.isEvaluated)
    .map((s) => {
      const a = assessments.find((as) => as.id === s.assessmentId);
      return {
        name: a?.title.split(" [")[0].substring(0, 10) + "...",
        score: s.percentage,
        passing: 60,
      };
    });

  const recentScores = studentSubmissions
    .filter((s) => s.status === "submitted")
    .slice(0, 3)
    .map((s) => {
      const a = assessments.find((as) => as.id === s.assessmentId);
      return {
        id: s.id,
        title: a?.title || "Assessment",
        percentage: s.percentage,
        isEvaluated: s.isEvaluated,
        score: s.score,
        marks: a?.marks || 20,
      };
    });

  const handleStartAttempt = (aId) => {
    const as = assessments.find((x) => x.id === aId);
    if (!as) return;
    const slug = as.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "assessment";
    if (as.type === "coding") navigate({ to: `/student/take-coding/${slug}` });
    else navigate({ to: `/student/take/${slug}` });
  };

  const handleViewResult = (sId) => {
    const sub = studentSubmissions.find((s) => s.id === sId);
    if (!sub) return;
    const as = assessments.find((a) => a.id === sub.assessmentId);
    const slug = as ? as.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "results";
    navigate({ to: `/student/results/${slug}/${sId}` });
  };

  // Animation variants
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

  const kpis = [
    { label: "Active Exams", value: activeAssessments.length, suffix: "Available", icon: ClipboardList, bg: "bg-[#01AC9F]/10", color: "text-[#01AC9F]" },
    { label: "Upcoming", value: upcomingAssessments.length, suffix: "scheduled", icon: CalendarIcon, bg: "bg-blue-500/10", color: "text-blue-500" },
    { label: "Leaderboard Rank", value: currentRank || "—", suffix: "Overall", icon: Trophy, bg: "bg-[#6C1D5F]/10", color: "text-[#6C1D5F]" },
    { label: "Graded", value: completedAssessments.length, suffix: "submitted", icon: TrendingUp, bg: "bg-emerald-500/10", color: "text-emerald-500" },
  ];

  const myBatches = batches.filter((b) => studentBatchIds.includes(b.id));

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4A1E47] via-[#6C1D5F] to-[#84117C] p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hi, {currentUser.name}!
          </h2>
          <p className="mt-2 text-white/80 text-sm font-medium leading-relaxed">
            {activeAssessments.length > 0
              ? `You have ${activeAssessments.length} active assessment${activeAssessments.length !== 1 ? "s" : ""} waiting for you.`
              : "No active assessments right now. Check back later!"}
          </p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={container} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={item}
            className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{kpi.suffix}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Assessments */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Available Assessments</h3>
            {activeAssessments.length > 0 && (
              <span className="text-xs bg-[#FF6200]/10 text-[#FF6200] font-bold px-2 py-0.5 rounded-full">
                {activeAssessments.length} Pending
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {activeAssessments.length === 0 ? (
              <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-8 text-center text-xs text-gray-400 md:col-span-2">
                No pending assessments. All caught up!
              </div>
            ) : (
              activeAssessments.map((as) => {
                const isDraftSub = studentSubmissions.find((s) => s.assessmentId === as.id && s.status === "in_progress");
                return (
                  <div
                    key={as.id}
                    className="bg-white dark:bg-[#15151f] p-4 rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1 mb-2">
                        <span className="px-2 py-0.5 bg-[#01AC9F]/10 text-[#01AC9F] font-bold rounded text-xs uppercase">
                          {as.type?.replace("_", " ")}
                        </span>
                        <span className={`text-xs font-bold ${as.difficulty === "Easy" ? "text-green-500" : as.difficulty === "Medium" ? "text-amber-500" : "text-rose-500"}`}>
                          {as.difficulty}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{as.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{as.description}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-[#2e2e3e] space-y-2">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {as.duration}m</span>
                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {as.questions?.length || 0} Qs</span>
                      </div>
                      <button
                        onClick={() => handleStartAttempt(as.id)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#6C1D5F] hover:bg-[#84117C] text-white transition-all flex items-center justify-center gap-1 min-h-[44px]"
                      >
                        {isDraftSub ? "Resume" : "Start"} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Scores Sidebar */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Scores</h3>
          <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-3 space-y-2">
            {recentScores.length === 0 ? (
              <div className="py-6 text-center text-[11px] text-gray-400">No graded exams yet</div>
            ) : (
              recentScores.map((score) => (
                <div
                  key={score.id}
                  onClick={() => handleViewResult(score.id)}
                  className="p-2.5 bg-gray-50 dark:bg-[#1a1a2e] rounded-xl hover:bg-gray-100 dark:hover:bg-[#2e2e3e] transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-900 dark:text-white truncate">{score.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {score.isEvaluated ? `${score.score}/${score.marks}` : "Pending"}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg font-mono font-bold text-xs shrink-0 ${score.isEvaluated ? "bg-[#01AC9F]/10 text-[#01AC9F]" : "bg-amber-50 text-amber-500"}`}>
                    {score.isEvaluated ? `${score.percentage}%` : "—"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* My Batches Quick View */}
      {myBatches.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">My Batches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myBatches.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-3 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] text-lg overflow-hidden">
                  {b.icon && (b.icon.startsWith("data:image") || b.icon.startsWith("http")) ? (
                    <img src={b.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; e.target.parentElement.innerHTML = "📚"; }} />
                  ) : (
                    <span>{b.icon || "📚"}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{b.name}</p>
                  <p className="text-xs text-gray-400">{(b.students || []).length} students</p>
                </div>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${b.status === "active" ? "bg-[#01AC9F]/10 text-[#01AC9F]" : "bg-gray-100 text-gray-500"}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Chart */}
      {completedSubsWithAssessments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Score Progress</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completedSubsWithAssessments}>
                <XAxis dataKey="name" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#01AC9F" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};
