package com.xebia.assessmentservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalAssessments;
    private long activeAssessments;
    private long scheduledAssessments;
    private long completedAssessments;
    private long expiredAssessments;
    private long draftAssessments;
    private long totalSubmissions;
    private double averageScore;
    private double averagePassRate;
    private double averageAttendance;
    private long totalStudents;
    private long studentsAttempted;
    private long studentsNotAttempted;
    private long totalTrainers;
    private long totalCourses;
    private long totalBatches;
    private int averageDuration;
    private long mcqAssessments;
    private long codingAssessments;
    private long assignmentAssessments;
    private long recentlyCreated;
}
