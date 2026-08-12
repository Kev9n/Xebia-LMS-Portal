package com.xebia.assessmentservice.controller;

import com.xebia.assessmentservice.model.Submission;
import com.xebia.assessmentservice.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    public List<Submission> getAllSubmissions(@RequestParam(required = false) String studentId) {
        if (studentId != null) {
            return submissionService.getSubmissionsByStudent(studentId);
        }
        return submissionService.getAllSubmissions();
    }

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionService.createSubmission(submission);
    }
    
    @PutMapping("/{id}")
    public Submission updateSubmission(@PathVariable String id, @RequestBody Submission submission) {
        return submissionService.updateSubmission(id, submission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubmission(@PathVariable String id) {
        submissionService.deleteSubmission(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<?> deleteAllSubmissions() {
        submissionService.deleteAllSubmissions();
        return ResponseEntity.ok().body("All submissions deleted");
    }
}
