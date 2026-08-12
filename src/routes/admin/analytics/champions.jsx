import { createFileRoute } from "@tanstack/react-router";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { Users, TrendingUp, Award, Star, Crown, Medal, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { GlobalFilters } from "@/components/analytics/GlobalFilters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const Route = createFileRoute("/admin/analytics/champions")({ component: ChampionsDashboard });

function ChampionsDashboard() {
  const data = useAnalyticsData();
  const { topStudents, totalLearners, totalAssessments, avgScore, passRate, teachers, students } = data;

  const champion = topStudents[0] || { name: "No data", score: 0, completed: 0 };
  const runnerUp = topStudents[1] || { name: "No data", score: 0, completed: 0 };
  const thirdPlace = topStudents[2] || { name: "No data", score: 0, completed: 0 };

  const leaderboardData = topStudents.slice(0, 10).map((s, i) => ({
    name: s.name?.split(" ")[0] || "Student",
    score: s.score,
    completed: s.completed,
    rank: i + 1,
  }));

  const podium = [
    { ...champion, place: 2, icon: Medal, color: "#C0C0C0", bg: "from-gray-100 to-gray-200" },
    { ...leaderboardData[0] || champion, place: 1, icon: Crown, color: "#FFD700", bg: "from-yellow-100 to-yellow-200", isWinner: true },
    { ...runnerUp, place: 3, icon: Trophy, color: "#CD7F32", bg: "from-orange-100 to-orange-200" },
  ].sort((a, b) => a.place - b.place);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a12] text-gray-900 dark:text-gray-100 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Learning Champions</h1>
        <p className="text-sm text-gray-500 mt-1">Top performers and leaderboard rankings</p>
      </div>
      <GlobalFilters />

      {/* Champion Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#6C1D5F] to-[#84117C] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/60">Learning Champion</span>
            <h2 className="text-2xl font-extrabold mt-1">{champion.name || "No data"}</h2>
            <p className="text-white/70 text-sm mt-1">Score: {champion.score}% | {champion.completed} assessments completed</p>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl">
            <Crown className="w-8 h-8 text-yellow-300" />
          </div>
        </div>
      </motion.div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4">
        {podium.map((p, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 text-center shadow-sm hover:shadow-md transition-all ${p.isWinner ? "ring-2 ring-yellow-400 dark:ring-yellow-500" : ""}`}>
            <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-b ${p.bg} flex items-center justify-center mb-3`}>
              <p.icon className="w-6 h-6" style={{ color: p.color }} />
            </div>
            <p className="text-sm font-extrabold text-gray-900 dark:text-white">{p.name}</p>
            <p className="text-lg font-black mt-1" style={{ color: p.color }}>{p.score}%</p>
            <p className="text-[10px] text-gray-400 mt-0.5">#{i + 1} Rank</p>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard Table + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Leaderboard</h3>
          <div className="space-y-1.5">
            {leaderboardData.length > 0 ? leaderboardData.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-gray-500"}`}>{i + 1}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{s.name}</span>
                </div>
                <span className="text-sm font-bold text-[#01AC9F]">{s.score}%</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-8">No student data yet</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Score Comparison</h3>
          <div className="h-[220px]">
            {leaderboardData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leaderboardData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis type="number" stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={60} stroke="#A3A3A3" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6C1D5F" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-sm text-gray-400">No data yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
