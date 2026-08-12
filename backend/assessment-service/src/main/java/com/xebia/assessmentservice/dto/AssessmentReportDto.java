package com.xebia.assessmentservice.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentReportDto {
    private Object assessment;
    private ReportSummary summary;
    private List<StudentReportRowDto> students;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReportSummary {
        private int totalAssigned;
        private int attempted;
        private int notAttempted;
        private int absent;
        private int passed;
        private int failed;
        private double averageScore;
        private int highestScore;
        private int lowestScore;
        private int medianScore;
        private int averageTimeTaken;
        private double submissionRate;
        private int lateSubmissions;
    }
}
