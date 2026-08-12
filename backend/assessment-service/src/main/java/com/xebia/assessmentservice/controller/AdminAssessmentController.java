package com.xebia.assessmentservice.controller;

import com.xebia.assessmentservice.dto.*;
import com.xebia.assessmentservice.service.AdminAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/assessments")
public class AdminAssessmentController {

    @Autowired
    private AdminAssessmentService adminAssessmentService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(adminAssessmentService.getDashboard());
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminAssessmentService.getAnalytics());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<?> getAssessmentDetails(@PathVariable String id) {
        AssessmentReportDto report = adminAssessmentService.getAssessmentReport(id);
        if (report == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<AssessmentReportDto> getStudentReport(@PathVariable String id) {
        AssessmentReportDto report = adminAssessmentService.getAssessmentReport(id);
        if (report == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(report);
    }

    @GetMapping("/trainer-performance")
    public ResponseEntity<List<Map<String, Object>>> getTrainerPerformance() {
        return ResponseEntity.ok(adminAssessmentService.getTrainerPerformance());
    }

    @GetMapping("/batch-performance")
    public ResponseEntity<List<Map<String, Object>>> getBatchPerformance() {
        return ResponseEntity.ok(adminAssessmentService.getBatchPerformance());
    }
}
