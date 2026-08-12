import { createFileRoute } from "@tanstack/react-router";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { TrendingUp, Award, Clock, Bot, Zap, Star, Users, Download } from "lucide-react";
import { useState } from "react";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C"];

export const Route = createFileRoute("/admin/analytics/ai")({ component: AITransformation });

function AITransformation() {
  const data = useAnalyticsData();
  const { totalLearners, totalTrainers, totalAssessments, totalSubmissions, avgScore, passRate, topStudents, mcqAssessments, codingAssessments, monthlyTrends, difficultyDist, assessments, students, teachers } = data;

  const [lastUpdated] = useState(new Date().toLocaleTimeString());

  const aiKpis = [
    { title: "AI-Assisted Assessments", value: codingAssessments, icon: Bot, color: "text-[#6C1D5F]", bg: "bg-[#6C1D5F]/10" },
    { title: "AI Usage Rate", value: totalAssessments > 0 ? `${Math.round((codingAssessments / totalAssessments) * 100)}%` : "0%", icon: Zap, color: "text-[#01AC9F]", bg: "bg-[#01AC9F]/10" },
    { title: "Total Submissions", value: totalSubmissions, icon: TrendingUp, color: "text-[#FF6200]", bg: "bg-[#FF6200]/10" },
    { title: "Avg Score", value: `${avgScore}%`, icon: Award, color: "text-[#84117C]", bg: "bg-[#84117C]/10" },
  ];

  const aiChampions = topStudents.slice(0, 3).map((s, i) => ({
    name: s.name || "Unknown",
    role: i === 0 ? "AI Power User" : i === 1 ? "AI Mentor" : "AI Enthusiast",
    color: i === 0 ? "#6C1D5F" : i === 1 ? "#01AC9F" : "#FF6200",
  }));

  const assessmentTypeData = [
    { name: "MCQ", value: mcqAssessments },
    { name: "Coding/AI", value: codingAssessments },
    { name: "Other", value: Math.max(0, totalAssessments - mcqAssessments - codingAssessments) },
  ].filter((d) => d.value > 0);

  const monthlyData = monthlyTrends.map((m) => ({
    month: m.month,
    submissions: m.submissions,
    avgScore: m.avgScore,
  }));

  const difficultyData = [
    { name: "Easy", value: difficultyDist.easy },
    { name: "Medium", value: difficultyDist.medium },
    { name: "Hard", value: difficultyDist.hard },
  ].filter((d) => d.value > 0);

  const exportReport = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Learners", totalLearners],
      ["Total Trainers", totalTrainers],
      ["Total Assessments", totalAssessments],
      ["Total Submissions", totalSubmissions],
      ["Average Score", `${avgScore}%`],
      ["Pass Rate", `${passRate}%`],
      ["MCQ Assessments", mcqAssessments],
      ["Coding Assessments", codingAssessments],
    ];
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai_transformation_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a12] text-gray-900 dark:text-gray-100 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">AI Transformation</h1>
          <p className="text-sm text-gray-500 mt-1">AI adoption metrics and intelligent assessment analytics</p>
        </div>
        <button onClick={exportReport} className="flex items-center gap-1.5 px-3 py-2 bg-[#6C1D5F] hover:bg-[#84117C] text-white text-xs font-bold rounded-xl transition-all">
          <Download className="w-3.5 h-3.5" /> Export Report
        </button>
      </div>
      <GlobalFilters />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {aiKpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}><kpi.icon className="w-4 h-4" /></div>
            </div>
            <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">AI Assessment Trend</h3>
          <div className="h-[220px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="month" stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend height={28} iconType="circle" />
                  <Bar dataKey="submissions" name="Submissions" fill="#6C1D5F" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="avgScore" name="Avg Score" fill="#01AC9F" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No trend data yet</div>}
          </div>
        </div>

        {/* Assessment Type Distribution */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Assessment Types</h3>
          <div className="h-[220px]">
            {assessmentTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assessmentTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {assessmentTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend height={28} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>
      </div>

      {/* AI Champions + Difficulty */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">AI Champions</h3>
          <div className="space-y-2">
            {aiChampions.length > 0 ? aiChampions.map((champ, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: champ.color }}>
                  {champ.name?.substring(0, 2)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{champ.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: champ.color }}>{champ.role}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-8">No champions yet</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Difficulty Distribution</h3>
          <div className="h-[220px]">
            {difficultyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="name" stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" name="Assessments" fill="#FF6200" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Platform Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Learners", value: totalLearners, icon: Users, color: "text-[#6C1D5F]" },
            { label: "Trainers", value: totalTrainers, icon: Users, color: "text-[#01AC9F]" },
            { label: "Assessments", value: totalAssessments, icon: Award, color: "text-[#FF6200]" },
            { label: "Pass Rate", value: `${passRate}%`, icon: TrendingUp, color: "text-[#84117C]" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-xl">
              <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
              <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">Last updated: {lastUpdated}</p>
    </div>
  );
}
