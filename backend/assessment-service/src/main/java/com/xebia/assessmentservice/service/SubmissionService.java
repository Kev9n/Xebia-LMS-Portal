package com.xebia.assessmentservice.service;

import com.xebia.assessmentservice.model.Submission;
import com.xebia.assessmentservice.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {
    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }
    
    public List<Submission> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public Submission createSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }
    
    public Submission updateSubmission(String id, Submission submission) {
        if (!submissionRepository.existsById(id)) {
            throw new RuntimeException("Submission not found with id: " + id);
        }
        submission.setId(id);
        return submissionRepository.save(submission);
    }

    public void deleteSubmission(String id) {
        submissionRepository.deleteById(id);
    }

    public void deleteAllSubmissions() {
        submissionRepository.deleteAll();
    }
}
