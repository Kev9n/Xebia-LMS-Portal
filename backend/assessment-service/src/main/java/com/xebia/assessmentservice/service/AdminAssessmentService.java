package com.xebia.assessmentservice.service;

import com.xebia.assessmentservice.dto.*;
import com.xebia.assessmentservice.model.Assessment;
import com.xebia.assessmentservice.model.Submission;
import com.xebia.assessmentservice.repository.AssessmentRepository;
import com.xebia.assessmentservice.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AdminAssessmentService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    public AdminDashboardDto getDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();
        List<Assessment> allAssessments = assessmentRepository.findAll();
        List<Submission> allSubmissions = submissionRepository.findAll();

        dto.setTotalAssessments(allAssessments.size());

        LocalDate now = LocalDate.now();
        String today = now.toString();

        long active = allAssessments.stream()
            .filter(a -> "published".equals(a.getStatus()))
            .filter(a -> a.getStartDate() != null && a.getEndDate() != null)
            .filter(a -> today.compareTo(a.getStartDate()) >= 0 && today.compareTo(a.getEndDate()) <= 0)
            .count();
        dto.setActiveAssessments(active);

        long scheduled = allAssessments.stream()
            .filter(a -> "published".equals(a.getStatus()))
            .filter(a -> a.getStartDate() != null && today.compareTo(a.getStartDate()) < 0)
            .count();
        dto.setScheduledAssessments(scheduled);

        long completed = allAssessments.stream()
            .filter(a -> "published".equals(a.getStatus()))
            .filter(a -> a.getEndDate() != null && today.compareTo(a.getEndDate()) > 0)
            .count();
        dto.setCompletedAssessments(completed);

        long expired = allAssessments.stream()
            .filter(a -> "archived".equals(a.getStatus()))
            .count();
        dto.setExpiredAssessments(expired);

        long draft = allAssessments.stream()
            .filter(a -> "draft".equals(a.getStatus()))
            .count();
        dto.setDraftAssessments(draft);

        List<Submission> evaluatedSubmissions = allSubmissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()))
            .filter(s -> s.getIsEvaluated() != null && s.getIsEvaluated())
            .collect(Collectors.toList());

        dto.setTotalSubmissions(allSubmissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()))
            .count());

        if (!evaluatedSubmissions.isEmpty()) {
            double avgScore = evaluatedSubmissions.stream()
                .mapToInt(s -> s.getPercentage() != null ? s.getPercentage() : 0)
                .average().orElse(0.0);
            dto.setAverageScore(avgScore);

            long passed = evaluatedSubmissions.stream()
                .filter(s -> s.getPercentage() != null && s.getPercentage() >= 60)
                .count();
            dto.setAveragePassRate((double) passed / evaluatedSubmissions.size() * 100);
        }

        Set<String> attemptedStudents = allSubmissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()) || "in_progress".equals(s.getStatus()))
            .map(Submission::getStudentId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());
        dto.setStudentsAttempted(attemptedStudents.size());

        long totalBatches = allAssessments.stream()
            .flatMap(a -> a.getBatches() != null ? a.getBatches().stream() : Stream.empty())
            .distinct().count();
        dto.setTotalBatches(totalBatches);

        dto.setMcqAssessments(allAssessments.stream()
            .filter(a -> "mcq".equals(a.getType())).count());
        dto.setCodingAssessments(allAssessments.stream()
            .filter(a -> "coding".equals(a.getType())).count());
        dto.setAssignmentAssessments(allAssessments.stream()
            .filter(a -> "assignment".equals(a.getType()) || "file_upload".equals(a.getType())).count());

        return dto;
    }

    public AdminAnalyticsDto getAnalytics() {
        AdminAnalyticsDto dto = new AdminAnalyticsDto();
        List<Assessment> allAssessments = assessmentRepository.findAll();
        List<Submission> allSubmissions = submissionRepository.findAll();

        Map<String, Long> creationMap = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            String month = a.getCreatedAt() != null ? a.getCreatedAt().substring(0, 7) : "Unknown";
            creationMap.merge(month, 1L, Long::sum);
        }
        dto.setCreationTrend(creationMap.entrySet().stream()
            .map(e -> Map.<String, Object>of("month", e.getKey(), "count", e.getValue()))
            .collect(Collectors.toList()));

        Map<String, Long> typeMap = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            String type = a.getType() != null ? a.getType() : "unknown";
            typeMap.merge(type, 1L, Long::sum);
        }
        dto.setTypeDistribution(typeMap.entrySet().stream()
            .map(e -> Map.<String, Object>of("type", e.getKey(), "count", e.getValue()))
            .collect(Collectors.toList()));

        long passed = allSubmissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()) && s.getIsEvaluated() != null && s.getIsEvaluated())
            .filter(s -> s.getPercentage() != null && s.getPercentage() >= 60)
            .count();
        long failed = allSubmissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()) && s.getIsEvaluated() != null && s.getIsEvaluated())
            .filter(s -> s.getPercentage() != null && s.getPercentage() < 60)
            .count();
        dto.setPassVsFail(Map.of("passed", passed, "failed", failed));

        List<Map<String, Object>> scoreDist = new ArrayList<>();
        long s1 = allSubmissions.stream().filter(s -> s.getPercentage() != null && s.getPercentage() < 20).count();
        long s2 = allSubmissions.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 20 && s.getPercentage() < 40).count();
        long s3 = allSubmissions.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 40 && s.getPercentage() < 60).count();
        long s4 = allSubmissions.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 60 && s.getPercentage() < 80).count();
        long s5 = allSubmissions.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 80).count();
        scoreDist.add(Map.of("range", "0-20", "count", s1));
        scoreDist.add(Map.of("range", "20-40", "count", s2));
        scoreDist.add(Map.of("range", "40-60", "count", s3));
        scoreDist.add(Map.of("range", "60-80", "count", s4));
        scoreDist.add(Map.of("range", "80-100", "count", s5));
        dto.setScoreDistribution(scoreDist);

        Map<String, Long> diffMap = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            String diff = a.getDifficulty() != null ? a.getDifficulty() : "Unknown";
            diffMap.merge(diff, 1L, Long::sum);
        }
        dto.setDifficultyDistribution(diffMap.entrySet().stream()
            .map(e -> Map.<String, Object>of("level", e.getKey(), "count", e.getValue()))
            .collect(Collectors.toList()));

        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            String status = a.getStatus() != null ? a.getStatus() : "unknown";
            statusMap.merge(status, 1L, Long::sum);
        }
        dto.setStatusDistribution(statusMap.entrySet().stream()
            .map(e -> Map.<String, Object>of("status", e.getKey(), "count", e.getValue()))
            .collect(Collectors.toList()));

        return dto;
    }

    public AssessmentReportDto getAssessmentReport(String assessmentId) {
        Optional<Assessment> assessmentOpt = assessmentRepository.findById(assessmentId);
        if (assessmentOpt.isEmpty()) return null;

        Assessment assessment = assessmentOpt.get();
        List<Submission> submissions = submissionRepository.findByAssessmentId(assessmentId);

        AssessmentReportDto dto = new AssessmentReportDto();
        dto.setAssessment(assessment);

        AssessmentReportDto.ReportSummary summary = new AssessmentReportDto.ReportSummary();

        List<Submission> evaluated = submissions.stream()
            .filter(s -> "submitted".equals(s.getStatus()))
            .collect(Collectors.toList());

        summary.setAttempted(evaluated.size());

        // Compute actual total assigned from all submissions (unique students)
        Set<String> allStudentIds = new HashSet<>();
        for (Submission s : submissions) {
            if (s.getStudentId() != null) allStudentIds.add(s.getStudentId());
        }
        summary.setTotalAssigned(Math.max(allStudentIds.size(), evaluated.size()));

        if (!evaluated.isEmpty()) {
            int[] scores = evaluated.stream()
                .mapToInt(s -> s.getPercentage() != null ? s.getPercentage() : 0)
                .sorted().toArray();

            summary.setAverageScore(Arrays.stream(scores).average().orElse(0));
            summary.setHighestScore(scores[scores.length - 1]);
            summary.setLowestScore(scores[0]);
            summary.setMedianScore(scores[scores.length / 2]);

            summary.setPassed((int) Arrays.stream(scores).filter(s -> s >= 60).count());
            summary.setFailed((int) Arrays.stream(scores).filter(s -> s < 60).count());
        }

        dto.setSummary(summary);

        // Populate student report rows from submissions
        List<StudentReportRowDto> studentRows = new ArrayList<>();
        for (Submission s : submissions) {
            StudentReportRowDto row = new StudentReportRowDto();
            row.setStudentId(s.getStudentId());
            row.setStudentName(s.getStudentId()); // Will be resolved by frontend
            row.setScore(s.getScore());
            row.setPercentage(s.getPercentage());
            row.setPassFail(s.getPercentage() != null && s.getPercentage() >= 60 ? "Pass" : "Fail");
            row.setAttemptStatus("submitted".equals(s.getStatus()) ? "Attempted" : "In Progress");
            row.setStartTime(s.getStartedAt());
            row.setEndTime(s.getSubmittedAt());
            row.setTimeTaken(s.getTimeTaken());
            row.setSubmissionStatus(s.getStatus());
            row.setRemarks(s.getRemarks());
            studentRows.add(row);
        }
        dto.setStudents(studentRows);

        return dto;
    }

    public List<Map<String, Object>> getTrainerPerformance() {
        List<Assessment> allAssessments = assessmentRepository.findAll();
        List<Submission> allSubmissions = submissionRepository.findAll();

        Map<String, List<Assessment>> byTrainer = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            String trainerId = a.getCreatedBy() != null ? a.getCreatedBy() : "unknown";
            byTrainer.computeIfAbsent(trainerId, k -> new ArrayList<>()).add(a);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<Assessment>> entry : byTrainer.entrySet()) {
            String trainerId = entry.getKey();
            List<Assessment> trainerAssessments = entry.getValue();
            Set<String> trainerAssessmentIds = trainerAssessments.stream().map(Assessment::getId).collect(Collectors.toSet());

            List<Submission> trainerSubs = allSubmissions.stream()
                .filter(s -> trainerAssessmentIds.contains(s.getAssessmentId()))
                .filter(s -> "submitted".equals(s.getStatus()))
                .collect(Collectors.toList());

            List<Submission> evaluated = trainerSubs.stream()
                .filter(s -> s.getIsEvaluated() != null && s.getIsEvaluated())
                .collect(Collectors.toList());

            double avgScore = evaluated.isEmpty() ? 0 :
                evaluated.stream().mapToInt(s -> s.getPercentage() != null ? s.getPercentage() : 0).average().orElse(0);
            long passed = evaluated.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 60).count();

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("trainerId", trainerId);
            row.put("totalAssessments", trainerAssessments.size());
            row.put("publishedAssessments", trainerAssessments.stream().filter(a -> "published".equals(a.getStatus())).count());
            row.put("totalSubmissions", trainerSubs.size());
            row.put("averageScore", Math.round(avgScore));
            row.put("passRate", evaluated.isEmpty() ? 0 : Math.round((double) passed / evaluated.size() * 100));
            result.add(row);
        }
        return result;
    }

    public List<Map<String, Object>> getBatchPerformance() {
        List<Assessment> allAssessments = assessmentRepository.findAll();
        List<Submission> allSubmissions = submissionRepository.findAll();

        Map<String, List<Assessment>> byBatch = new LinkedHashMap<>();
        for (Assessment a : allAssessments) {
            if (a.getBatches() != null) {
                for (String batchId : a.getBatches()) {
                    byBatch.computeIfAbsent(batchId, k -> new ArrayList<>()).add(a);
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, List<Assessment>> entry : byBatch.entrySet()) {
            String batchId = entry.getKey();
            List<Assessment> batchAssessments = entry.getValue();
            Set<String> batchAssessmentIds = batchAssessments.stream().map(Assessment::getId).collect(Collectors.toSet());

            List<Submission> batchSubs = allSubmissions.stream()
                .filter(s -> batchAssessmentIds.contains(s.getAssessmentId()))
                .filter(s -> "submitted".equals(s.getStatus()))
                .collect(Collectors.toList());

            List<Submission> evaluated = batchSubs.stream()
                .filter(s -> s.getIsEvaluated() != null && s.getIsEvaluated())
                .collect(Collectors.toList());

            Set<String> uniqueStudents = batchSubs.stream().map(Submission::getStudentId).filter(Objects::nonNull).collect(Collectors.toSet());
            double avgScore = evaluated.isEmpty() ? 0 :
                evaluated.stream().mapToInt(s -> s.getPercentage() != null ? s.getPercentage() : 0).average().orElse(0);
            long passed = evaluated.stream().filter(s -> s.getPercentage() != null && s.getPercentage() >= 60).count();

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("batchId", batchId);
            row.put("totalAssessments", batchAssessments.size());
            row.put("totalSubmissions", batchSubs.size());
            row.put("uniqueStudents", uniqueStudents.size());
            row.put("averageScore", Math.round(avgScore));
            row.put("passRate", evaluated.isEmpty() ? 0 : Math.round((double) passed / evaluated.size() * 100));
            result.add(row);
        }
        return result;
    }
}
