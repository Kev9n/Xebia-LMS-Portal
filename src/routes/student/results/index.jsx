import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useLMS } from "@/context/LMSContext";
import { Award, Trophy, BookOpen, Star, Calendar, ClipboardCheck } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

import { LearningActivityChart } from "@/features/student/components/charts/LearningActivityChart";
import { SubjectPerformanceChart } from "@/features/student/components/charts/SubjectPerformanceChart";
import { CourseProgressChart } from "@/features/student/components/charts/CourseProgressChart";

export const Route = createFileRoute("/student/results/")({
  component: ResultsPage,
});

function ResultsPage() {
  const { currentUser, submissions, assessments, batches, courses } = useLMS();

  // Build real chart data from submissions + assessments
  const chartData = useMemo(() => {
    if (!currentUser?.id) return { courseProgress: [], assessmentPerformance: [] };

    const mySubs = submissions.filter((s) => s.studentId === currentUser.id && s.status === "submitted");

    // Course Progress: map batches to enrollment progress
    const myBatchIds = currentUser.batches || [];
    const courseProgress = batches
      .filter((b) => myBatchIds.includes(b.id))
      .map((b) => {
        const bAssessments = assessments.filter((a) => (a.batches || []).includes(b.id));
        const completed = mySubs.filter((s) => bAssessments.some((a) => a.id === s.assessmentId)).length;
        const total = bAssessments.length || 1;
        return { title: b.name, progress: Math.min(Math.round((completed / total) * 100), 100) };
      });

    // Subject Performance: map assessments to scores
    const assessmentPerformance = mySubs
      .filter((s) => s.isEvaluated && s.percentage != null)
      .map((s) => {
        const a = assessments.find((x) => x.id === s.assessmentId);
        return { subject: a?.title?.substring(0, 15) || "Assessment", score: s.percentage };
      });

    return { courseProgress, assessmentPerformance };
  }, [currentUser, submissions, assessments, batches]);

  // Build results table from real submissions
  const assessmentResults = useMemo(() => {
    if (!currentUser?.id) return [];
    return submissions
      .filter((s) => s.studentId === currentUser.id && s.status === "submitted")
      .map((s) => {
        const a = assessments.find((x) => x.id === s.assessmentId);
        const pct = s.percentage || 0;
        const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : "D";
        return {
          id: s.id,
          assessmentName: a?.title || "Assessment",
          course: batches.find((b) => (a?.batches || []).includes(b.id))?.name || "—",
          date: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—",
          marks: s.score || 0,
          maxMarks: a?.marks || 0,
          percentage: pct,
          grade,
        };
      });
  }, [currentUser, submissions, assessments, batches]);

  const getGradeStyle = (grade) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/20";
      case "B+":
      case "B":
        return "bg-[#6C1D5F]/10 text-[#6C1D5F] border-[#6C1D5F]/20";
      case "C":
        return "bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/20";
      default:
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6C1D5F] via-[#84117C] to-[#01AC9F] p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Results & Performance</h1>
          <p className="mt-2 text-white/80 text-sm font-medium">
            {assessmentResults.length > 0
              ? `Track your progress across ${assessmentResults.length} assessment${assessmentResults.length !== 1 ? "s" : ""}`
              : "Take assessments to see your results here"}
          </p>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Course Progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white">Course Progress</h2>
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Enrollment Status</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <CourseProgressChart data={chartData.courseProgress} />
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#01AC9F]/10 flex items-center justify-center text-[#01AC9F]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white">Subject Performance</h2>
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Average Scores</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <SubjectPerformanceChart data={chartData.assessmentPerformance} />
          </div>
        </motion.div>

        {/* Learning Activity */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 flex items-center justify-center text-[#FF6200]">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-gray-900 dark:text-white">Learning Activity</h2>
              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">Score Trends</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <LearningActivityChart data={chartData.assessmentPerformance.map((d) => ({ name: d.subject, progress: d.score }))} />
          </div>
        </motion.div>
      </div>

      {/* Recent Results Table */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Results</h2>
        <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-[#1a1a2e]/50 border-b border-gray-100 dark:border-[#2e2e3e]">
                  <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Assessment</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Batch</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Score</th>
                  <th className="py-3 px-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2e2e3e]/50">
                {assessmentResults.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <ClipboardCheck className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-xs font-semibold text-gray-400">No results yet</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Complete assessments to see your results here</p>
                    </td>
                  </tr>
                ) : (
                  assessmentResults.map((result, idx) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-[#1a1a2e]/30 transition-colors"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
                            <ClipboardCheck className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-[13px]">{result.assessmentName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-xs text-gray-500 dark:text-gray-400 font-medium">{result.course}</td>
                      <td className="py-3 px-5">
                        <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {result.date}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className="text-[13px] font-bold text-gray-900 dark:text-white">
                          {result.marks}<span className="text-gray-400 font-medium"> / {result.maxMarks}</span>
                        </span>
                        <span className="block text-[10px] text-gray-400 mt-0.5">{result.percentage}%</span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className={clsx("inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg text-[11px] font-black border", getGradeStyle(result.grade))}>
                          {result.grade}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
