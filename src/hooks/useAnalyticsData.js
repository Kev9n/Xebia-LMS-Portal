import { useLMS } from "@/context/LMSContext";
import { useMemo } from "react";

export function useAnalyticsData() {
  const { teachers, students, batches, assessments, submissions } = useLMS();

  return useMemo(() => {
    const totalLearners = students.length;
    const totalTrainers = teachers.length;
    const totalBatches = batches.length;
    const totalAssessments = assessments.length;
    const totalSubmissions = submissions.length;

    const evaluatedSubs = submissions.filter(
      (s) => s.isEvaluated || s.status === "submitted",
    );

    const avgScore = evaluatedSubs.length
      ? Math.round(
          evaluatedSubs.reduce((sum, s) => sum + (s.percentage || 0), 0) /
            evaluatedSubs.length,
        )
      : 0;

    const avgTimeTaken = evaluatedSubs.length
      ? Math.round(
          evaluatedSubs.reduce((sum, s) => sum + (s.timeTaken || 0), 0) /
            evaluatedSubs.length /
            60,
        )
      : 0;

    const passRate = evaluatedSubs.length
      ? Math.round(
          (evaluatedSubs.filter((s) => s.percentage >= 60).length /
            evaluatedSubs.length) *
            100,
        )
      : 0;

    const mcqAssessments = assessments.filter((a) => a.type === "mcq").length;
    const codingAssessments = assessments.filter(
      (a) => a.type === "coding",
    ).length;
    const mixedAssessments = assessments.filter(
      (a) => a.type === "mixed",
    ).length;

    const difficultyDist = {
      easy: assessments.filter((a) => a.difficulty === "easy").length,
      medium: assessments.filter((a) => a.difficulty === "medium").length,
      hard: assessments.filter((a) => a.difficulty === "hard").length,
    };

    const batchStats = batches.map((b) => {
      const batchAssessments = assessments.filter(
        (a) => a.batches && a.batches.includes(b.id),
      );
      const batchSubs = evaluatedSubs.filter((s) =>
        batchAssessments.some((a) => a.id === s.assessmentId),
      );
      const avgBatchScore = batchSubs.length
        ? Math.round(
            batchSubs.reduce((sum, s) => sum + (s.percentage || 0), 0) /
              batchSubs.length,
          )
        : 0;
      return {
        ...b,
        avgScore: avgBatchScore,
        submissionCount: batchSubs.length,
      };
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      const monthSubs = submissions.filter((s) => {
        const sd = new Date(s.submittedAt || s.startedAt);
        return (
          sd.getMonth() === d.getMonth() && sd.getFullYear() === d.getFullYear()
        );
      });
      return {
        month: monthNames[d.getMonth()],
        submissions: monthSubs.length,
        avgScore: monthSubs.length
          ? Math.round(
              monthSubs.reduce((sum, s) => sum + (s.percentage || 0), 0) /
                monthSubs.length,
            )
          : 0,
      };
    });

    const topStudents = [...students]
      .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
      .slice(0, 10)
      .map((s) => ({
        name: s.name,
        score: s.averageScore || 0,
        completed: s.assessmentsCompleted || 0,
      }));

    return {
      totalLearners,
      totalTrainers,
      totalBatches,
      totalAssessments,
      totalSubmissions,
      avgScore,
      avgTimeTaken,
      passRate,
      mcqAssessments,
      codingAssessments,
      mixedAssessments,
      difficultyDist,
      batchStats,
      monthlyTrends,
      topStudents,
      evaluatedSubs,
      teachers,
      students,
      batches,
      assessments,
    };
  }, [teachers, students, batches, assessments, submissions]);
}
