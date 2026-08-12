import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useLMS } from "@/context/LMSContext";
import { BookOpen, Calendar, Award, Bell, Play, FileText, BarChart3 } from "lucide-react";

import { WelcomeBanner } from "@/features/student/components/dashboard/WelcomeBanner";
import { StatCard } from "@/features/student/components/dashboard/StatCard";
import { ContinueLearning } from "@/features/student/components/dashboard/ContinueLearning";
import { LearningActivityChart } from "@/features/student/components/charts/LearningActivityChart";
import { SubjectPerformanceChart } from "@/features/student/components/charts/SubjectPerformanceChart";
import { PageEntrance, PageEntranceItem } from "@/components/ui/page-entrance";

export const Route = createFileRoute("/student/")({ component: DashboardHome });

function DashboardHome() {
  const { currentUser, submissions, assessments, batches, notifications } = useLMS();

  const unreadNotifications = notifications.filter((n) => !n.isRead && !n.read).length;

  // Compute real chart data from LMSContext
  const { learningData, assessmentData, enrolledBatches, pendingCount, completedCount } = useMemo(() => {
    if (!currentUser) return { learningData: [], assessmentData: [], enrolledBatches: [], pendingCount: 0, completedCount: 0 };

    const myBatchIds = currentUser.batches || [];
    const mySubs = submissions.filter((s) => s.studentId === currentUser.id && s.status === "submitted");

    // Enrolled batches
    const enrolled = batches.filter((b) => myBatchIds.includes(b.id));

    // Pending assessments (assigned but not completed)
    const allAssigned = assessments.filter(
      (a) => a.status === "published" && (a.batches || []).some((bId) => myBatchIds.includes(bId)),
    );
    const completedIds = new Set(mySubs.map((s) => s.assessmentId));
    const pending = allAssigned.filter((a) => !completedIds.has(a.id));
    const completed = allAssigned.filter((a) => completedIds.has(a.id));

    // Subject Performance: map each completed assessment to its score
    const perf = mySubs
      .filter((s) => s.isEvaluated && s.percentage != null)
      .map((s) => {
        const a = assessments.find((x) => x.id === s.assessmentId);
        return { subject: a?.title?.substring(0, 12) || "Assessment", score: s.percentage };
      });

    // Learning Activity: map batch completion over time
    const activity = enrolled.map((b) => {
      const bAssessments = assessments.filter((a) => (a.batches || []).includes(b.id));
      const done = mySubs.filter((s) => bAssessments.some((a) => a.id === s.assessmentId)).length;
      const total = bAssessments.length || 1;
      return { name: b.name.substring(0, 10), progress: Math.min(Math.round((done / total) * 100), 100) };
    });

    return {
      learningData: activity,
      assessmentData: perf,
      enrolledBatches: enrolled,
      pendingCount: pending.length,
      completedCount: completed.length,
    };
  }, [currentUser, submissions, assessments, batches]);

  return (
    <PageEntrance className="x-dashboard-shell pb-6">
      <PageEntranceItem>
        <WelcomeBanner />
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <Link to="/student/courses" className="x-bento-span-6 group">
          <div className="x-card flex h-full items-center justify-between p-5">
            <div>
              <p className="x-micro-copy text-muted-foreground">Jump Back In</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Resume Last Course
              </h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-soft)] bg-primary/10 text-primary">
              <Play className="h-4 w-4" />
            </div>
          </div>
        </Link>
        <Link to="/student/assessments" className="x-bento-span-6 group">
          <div className="x-card flex h-full items-center justify-between p-5">
            <div>
              <p className="x-micro-copy text-muted-foreground">Action Required</p>
              <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                Take Assessment
              </h3>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-soft)] bg-destructive/10 text-destructive">
              <FileText className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <StatCard className="x-bento-span-3" title="Enrolled Courses" value={enrolledBatches.length} icon={BookOpen} trend="Total active" trendUp={false} colorClass="text-primary" bgClass="bg-primary/10" />
        <StatCard className="x-bento-span-3" title="Pending" value={pendingCount} icon={Calendar} trend="Action required" trendUp={false} colorClass="text-destructive" bgClass="bg-destructive/10" />
        <StatCard className="x-bento-span-3" title="Completed" value={completedCount} icon={Award} trend="Finished" trendUp={true} colorClass="text-accent-2" bgClass="bg-accent-2/10" />
        <StatCard className="x-bento-span-3" title="Notifications" value={unreadNotifications} icon={Bell} trend="Unread" trendUp={false} colorClass="text-accent" bgClass="bg-accent/10" />
      </PageEntranceItem>

      <PageEntranceItem className="x-bento-grid">
        <div className="x-card x-bento-span-6 flex flex-col p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-soft)] bg-destructive/10 text-destructive">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="x-section-title text-base">Course Progress</h2>
              <p className="x-micro-copy text-muted-foreground">Completion by batch</p>
            </div>
          </div>
          <div className="min-h-[200px] flex-1">
            <LearningActivityChart data={learningData} />
          </div>
        </div>

        <div className="x-card x-bento-span-6 flex flex-col p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-soft)] bg-accent-2/10 text-accent-2">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h2 className="x-section-title text-base">Subject Performance</h2>
              <p className="x-micro-copy text-muted-foreground">Assessment scores</p>
            </div>
          </div>
          <div className="min-h-[200px] flex-1">
            <SubjectPerformanceChart data={assessmentData} />
          </div>
        </div>
      </PageEntranceItem>

      {enrolledBatches.length > 0 && (
        <PageEntranceItem>
          <ContinueLearning courses={enrolledBatches.map((b) => ({ id: b.id, title: b.name, progress: 0 }))} />
        </PageEntranceItem>
      )}
    </PageEntrance>
  );
}
