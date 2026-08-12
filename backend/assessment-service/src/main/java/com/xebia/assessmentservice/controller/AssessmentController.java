package com.xebia.assessmentservice.controller;

import com.xebia.assessmentservice.model.Assessment;
import com.xebia.assessmentservice.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    @GetMapping
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    @PostMapping
    public Assessment createAssessment(@RequestBody Assessment assessment) {
        return assessmentService.createAssessment(assessment);
    }

    @PutMapping("/{id}")
    public Assessment updateAssessment(@PathVariable String id, @RequestBody Assessment assessment) {
        return assessmentService.updateAssessment(id, assessment);
    }

    @DeleteMapping("/{id}")
    public void deleteAssessment(@PathVariable String id) {
        assessmentService.deleteAssessment(id);
    }

    @DeleteMapping("/created-by/{createdBy}")
    public ResponseEntity<java.util.Map<String, Integer>> deleteByCreator(@PathVariable String createdBy) {
        return ResponseEntity.ok(assessmentService.deleteAssessmentsByCreatedBy(createdBy));
    }

    @DeleteMapping("/batch/{batchId}")
    public ResponseEntity<java.util.Map<String, Integer>> deleteByBatchId(@PathVariable String batchId) {
        return ResponseEntity.ok(assessmentService.deleteByBatchId(batchId));
    }
}
