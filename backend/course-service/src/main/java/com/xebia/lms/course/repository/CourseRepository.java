package com.xebia.lms.course.repository;

import com.xebia.lms.course.entity.Course;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByTenantId(UUID tenantId);
}
