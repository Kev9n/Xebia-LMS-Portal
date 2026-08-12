package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, UUID> {
    Optional<CourseProgress> findByTenantIdAndStudentIdAndCourseId(UUID tenantId, String studentId, UUID courseId);
    List<CourseProgress> findByTenantIdAndStudentId(UUID tenantId, String studentId);
}
