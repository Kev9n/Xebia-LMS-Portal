package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.ContentProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContentProgressRepository extends JpaRepository<ContentProgress, UUID> {
    Optional<ContentProgress> findByTenantIdAndStudentIdAndContentId(UUID tenantId, String studentId, UUID contentId);
    List<ContentProgress> findByTenantIdAndStudentIdAndCourseId(UUID tenantId, String studentId, UUID courseId);
    List<ContentProgress> findByTenantIdAndStudentIdAndSubmoduleId(UUID tenantId, String studentId, UUID submoduleId);
}
