package com.xebia.assessmentservice.repository;

import com.xebia.assessmentservice.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    List<Assessment> findByCreatedBy(String createdBy);
}
