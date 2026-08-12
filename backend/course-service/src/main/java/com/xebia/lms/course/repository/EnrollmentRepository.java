package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    
    boolean existsByTenantIdAndCourse_IdAndStudentId(UUID tenantId, UUID courseId, String studentId);
    
    Optional<Enrollment> findByTenantIdAndCourse_IdAndStudentId(UUID tenantId, UUID courseId, String studentId);
    
    List<Enrollment> findByTenantIdAndStudentId(UUID tenantId, String studentId);
}
