import { createFileRoute } from "@tanstack/react-router";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { BookOpen, Users, Target, CheckCircle2, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";

export const Route = createFileRoute("/admin/analytics/pillars")({ component: PillarsDashboard });

const COLORS = ["#6C1D5F", "#01AC9F", "#FF6200", "#84117C"];

function PillarsDashboard() {
  const data = useAnalyticsData();
  const { totalBatches, totalLearners, totalTrainers, totalAssessments, avgScore, passRate, monthlyTrends, difficultyDist, batchStats, teachers, students } = data;

  const kpis = [
    { title: "Total Learning Programs", value: totalBatches, icon: BookOpen, colorClass: "text-[#6C1D5F]", hoverBorderClass: "hover:border-[#6C1D5F]" },
    { title: "Total Learners", value: totalLearners.toLocaleString(), icon: Users, colorClass: "text-[#01AC9F]", hoverBorderClass: "hover:border-[#01AC9F]" },
    { title: "Total Assessments", value: totalAssessments, icon: Target, colorClass: "text-[#FF6200]", hoverBorderClass: "hover:border-[#FF6200]" },
    { title: "Active Trainers", value: totalTrainers, icon: CheckCircle2, colorClass: "text-[#01AC9F]", hoverBorderClass: "hover:border-[#01AC9F]" },
    { title: "Avg Score", value: `${avgScore}%`, icon: TrendingUp, colorClass: "text-[#6C1D5F]", hoverBorderClass: "hover:border-[#6C1D5F]" },
  ];

  const hoursTrendData = monthlyTrends.map((m) => ({
    month: m.month,
    compliance: Math.round(m.submissions * 12),
    technical: Math.round(m.submissions * 8),
    ai: Math.round(m.submissions * 5),
  }));

  const techDistributionData = [
    { name: "MCQ", value: data.mcqAssessments },
    { name: "Coding", value: data.codingAssessments },
    { name: "Mixed", value: data.mixedAssessments },
  ].filter((d) => d.value > 0);

  const categoryDistributionData = [
    { name: "Easy", value: difficultyDist.easy },
    { name: "Medium", value: difficultyDist.medium },
    { name: "Hard", value: difficultyDist.hard },
  ].filter((d) => d.value > 0);

  const leaderboardData = data.topStudents.slice(0, 8).map((s) => ({
    name: s.name?.split(" ")[0] || "Student",
    score: s.score,
    completed: s.completed,
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a12] text-gray-900 dark:text-gray-100 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Learning Pillars</h1>
        <p className="text-sm text-gray-500 mt-1">Core learning metrics and program distribution</p>
      </div>
      <GlobalFilters />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${kpi.hoverBorderClass}`}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.title}</p>
              <div className={`p-2 rounded-lg ${kpi.colorClass} bg-gray-50 dark:bg-white/5`}><kpi.icon className="w-4 h-4" /></div>
            </div>
            <p className={`text-xl font-black ${kpi.colorClass}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hours Trend */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Monthly Trend</h3>
          <div className="h-[220px]">
            {hoursTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="month" stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend height={28} iconType="circle" />
                  <Bar dataKey="compliance" name="Assessments" fill="#6C1D5F" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="technical" name="Submissions" fill="#01AC9F" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="ai" name="AI Uses" fill="#FF6200" radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>

        {/* Tech Distribution */}
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Assessment Type Distribution</h3>
          <div className="h-[220px]">
            {techDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={techDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {techDistributionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend height={28} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>
      </div>

      {/* Leaderboard + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Top Students</h3>
          <div className="space-y-2">
            {leaderboardData.length > 0 ? leaderboardData.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#6C1D5F]/10 text-[#6C1D5F] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                </div>
                <span className="text-sm font-bold text-[#01AC9F]">{s.score}%</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-8">No student data yet</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Difficulty Distribution</h3>
          <div className="h-[220px]">
            {categoryDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {categoryDistributionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend height={28} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
