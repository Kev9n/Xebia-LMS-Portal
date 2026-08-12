import React from "react";
import { useLMS } from "../context/LMSContext";
import {
  Users,
  Layers,
  FileSpreadsheet,
  FileSignature,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { PageEntrance, PageEntranceItem } from "@/components/ui/page-entrance";

export const TeacherDashboard = () => {
  const { students, batches, assessments, submissions, notifications, currentUser } = useLMS();

  // Metrics Calculations
  const myBatches = batches.filter((b) => b.createdBy === currentUser?.id);
  
  const totalStudents = students.length;
  const totalBatches = myBatches.length;
  const myAssessments = assessments.filter((a) => a.createdBy === currentUser?.id);
  const totalAssessments = myAssessments.length;

  const activeAssessments = myAssessments.filter((a) => {
    if (a.status !== "published") return false;
    const nowStr = new Date().toISOString().split("T")[0];
    return a.startDate <= nowStr && a.endDate >= nowStr;
  }).length;

  const completedAssessments = myAssessments.filter((a) => {
    if (a.status !== "published") return false;
    const nowStr = new Date().toISOString().split("T")[0];
    return a.endDate < nowStr;
  }).length;

  // Submissions requiring evaluation (submitted status, manualGrade = true, and not yet evaluated)
  const pendingEvaluations = submissions.filter((sub) => {
    const as = myAssessments.find((a) => a.id === sub.assessmentId);
    return sub.status === "submitted" && as?.manualGrade && !sub.isEvaluated;
  }).length;

  // Charts data preparation
  // 1. Submission Trend (Last 7 Days dummy dates but mapped to real submission counts)
  const submissionTrendData = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = submissions.filter(
      (s) => s.submittedAt && s.submittedAt.startsWith(dateStr),
    ).length;
    submissionTrendData.push({ name: dayName, count });
  }

  // 2. Average Scores per Top 5 Assessments (Auto or Manual Evaluated)
  const evaluatedSubs = submissions.filter((s) => s.status === "submitted" && s.isEvaluated);
  const assessmentsScores = myAssessments.slice(0, 5).map((a) => {
    const subs = evaluatedSubs.filter((s) => s.assessmentId === a.id);
    const avg =
      subs.length > 0
        ? Math.round(subs.reduce((sum, s) => sum + s.percentage, 0) / subs.length)
        : 75; // fallback default
    return {
      title: a.title.split(" [")[0].substring(0, 15) + "...",
      average: avg,
      passing: 60,
    };
  });

  // 3. Batch Student count & Performance
  const batchPerformanceData = myBatches.slice(0, 5).map((b) => {
    // find all students of this batch
    const bStudents = students.filter((s) => (s.batches || []).includes(b.id));
    const avgScore =
      bStudents.length > 0
        ? Math.round(
            bStudents.reduce((sum, s) => sum + (s.averageScore || 0), 0) / bStudents.length,
          )
        : 80;
    return {
      name: b.name,
      students: b.studentCount,
      avgScore: avgScore,
    };
  });

  // Recent Submissions (Latest 4)
  const recentSubmissions = submissions
    .filter((s) => s.status === "submitted")
    .slice(0, 4)
    .map((s) => {
      const student = students.find((stud) => stud.id === s.studentId);
      const assessment = myAssessments.find((a) => a.id === s.assessmentId);
      return {
        id: s.id,
        studentName: student?.name || "Unknown Student",
        studentAvatar: student?.avatar,
        assessmentTitle: assessment?.title || "Unknown Quiz",
        submittedAt: s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "Recent",
        score: s.score,
        totalMarks: assessment?.marks || 100,
        percentage: s.percentage,
        isEvaluated: s.isEvaluated,
      };
    });

  // Upcoming Assessments (Published but start date is in the future)
  const upcomingAssessments = myAssessments
    .filter((a) => a.status === "published" && a.startDate > new Date().toISOString().split("T")[0])
    .slice(0, 3);

  // Core color tokens from Xebia brand
  const velvetColor = "#6C1D5F";
  const emeraldColor = "#01AC9F";
  const orangeColor = "#FF6200";

  return (
    <PageEntrance className="x-dashboard-shell">
      <PageEntranceItem>
        <div className="relative overflow-hidden rounded-[var(--radius-soft)] bg-gradient-to-r from-secondary-foreground via-primary to-primary-glow p-6 text-primary-foreground shadow-[var(--shadow-elegant)] md:p-8">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-40" />
          <div className="relative z-10 max-w-3xl space-y-2">
            <p className="x-micro-copy text-primary-foreground/70">Trainer Command Center</p>
            <h2 className="font-display text-[var(--text-xl)] font-bold tracking-tight">
              Hello, Trainer!
            </h2>
            <p className="text-sm font-normal text-primary-foreground/85">
              Review batch milestones, evaluate pending submissions, or design multi-question exams instantly.
            </p>
          </div>
        </div>
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        {[
          { label: "Total Students", value: totalStudents, icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "Total Batches", value: totalBatches, icon: Layers, color: "text-accent-2", bg: "bg-accent-2/10" },
          { label: "Total Assessments", value: totalAssessments, icon: FileSpreadsheet, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Pending Evaluation", value: pendingEvaluations, icon: FileSignature, color: "text-accent", bg: "bg-accent/10" },
        ].map((kpi) => (
          <div key={kpi.label} className="x-card x-bento-span-3 flex items-center gap-4 p-4 md:p-5">
            <div className={`flex shrink-0 rounded-[var(--radius-soft)] p-3 ${kpi.bg}`}>
              <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="x-micro-copy text-muted-foreground">{kpi.label}</p>
              <h4 className="font-display text-[var(--text-xl)] font-bold leading-none text-foreground">
                {kpi.value}
              </h4>
            </div>
          </div>
        ))}
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <div className="x-card x-bento-span-8 flex h-[350px] flex-col p-4 sm:p-6 lg:h-[400px]">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="font-display font-extrabold text-base text-neutral-900 dark:text-white uppercase tracking-wider">
                Submission Trend
              </h3>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                Frequency of student quiz hand-ins over last week
              </p>
            </div>
            <span className="text-xs bg-accent-2/10 text-accent-2 dark:bg-accent-2 dark:text-accent-2 px-3 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-sm border border-accent-2/20 dark:border-accent-2">
              <TrendingUp className="w-4 h-4" /> +14.2%
            </span>
          </div>
          <div className="flex-grow w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={submissionTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={velvetColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={velvetColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  className="text-neutral-400 dark:text-neutral-500"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-neutral-400 dark:text-neutral-500"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: velvetColor, fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={velvetColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: velvetColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="x-card x-bento-span-4 flex h-[350px] flex-col p-4 sm:p-6 lg:h-[400px]">
          <div className="mb-8">
            <h3 className="x-section-title text-base">Assessment Averages</h3>
            <p className="x-section-subtitle text-xs">
              Average score (%) across top 5 core modules
            </p>
          </div>
          <div className="flex-grow w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={assessmentsScores}
                layout="vertical"
                margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="4 4"
                  horizontal={false}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="currentColor"
                  className="text-neutral-400 dark:text-neutral-500"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="title"
                  type="category"
                  stroke="currentColor"
                  className="text-neutral-600 dark:text-neutral-400 font-semibold"
                  fontSize={10}
                  width={90}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(1,172,159,0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: emeraldColor, fontWeight: "bold" }}
                />
                <Bar dataKey="average" fill={emeraldColor} radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <div className="x-card x-bento-span-4 flex flex-col p-6">
          <div className="mb-6">
            <h3 className="x-section-title text-base">Batch Performance</h3>
            <p className="x-section-subtitle text-xs">
              Compare student density and grades across core groups
            </p>
          </div>
          <div className="flex-grow space-y-6">
            {batchPerformanceData.map((batch) => (
              <div key={batch.name} className="group space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-foreground group-hover:text-primary transition-colors">
                    {batch.name}
                  </span>
                  <span className="rounded-[var(--radius-soft)] bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground">
                    {batch.students} active stds
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted shadow-inner">
                    <div
                      className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                      style={{ width: `${batch.avgScore}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-sm font-bold text-primary">
                    {batch.avgScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="x-card x-bento-span-8 flex flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="x-section-title text-base">Recent Assessment Activity</h3>
              <p className="x-section-subtitle text-xs">
                Real-time submitted quiz streams synced directly
              </p>
            </div>
            <Link
              to="/trainer/evaluation"
              className="flex items-center gap-1.5 rounded-[var(--radius-soft)] border border-transparent px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-primary/20 hover:bg-primary/10"
            >
              <span>View Queue</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-grow overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-border text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="pb-4 pl-3">Student</th>
                  <th className="pb-4">Assessment</th>
                  <th className="pb-4">Graded?</th>
                  <th className="pb-4 pr-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center font-medium text-muted-foreground">
                      No recent submissions.
                    </td>
                  </tr>
                ) : (
                  recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="group transition-colors hover:bg-muted/30">
                      <td className="flex items-center gap-3 py-4 pl-3">
                        <img
                          src={sub.studentAvatar}
                          alt={sub.studentName}
                          className="h-6 w-6 rounded-full border border-border shadow-sm transition-transform group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-foreground">{sub.studentName}</span>
                      </td>
                      <td className="max-w-[180px] truncate py-4 font-medium text-muted-foreground">
                        {sub.assessmentTitle}
                      </td>
                      <td className="py-4">
                        {sub.isEvaluated ? (
                          <span className="rounded-[var(--radius-soft)] border border-accent-2/20 bg-accent-2/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-2">
                            Evaluated
                          </span>
                        ) : (
                          <span className="rounded-[var(--radius-soft)] border border-destructive/20 bg-destructive/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-destructive">
                            Needs Grading
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-3 text-right font-mono text-base font-bold text-foreground">
                        {sub.isEvaluated ? `${sub.percentage}%` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageEntranceItem>
    </PageEntrance>
  );
};
