package com.xebia.lms.course.entity;

import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "course_progress", schema = "course", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "student_id", "course_id"})
})
public class CourseProgress extends TenantScopedEntity {

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "last_accessed_submodule_id")
    private UUID lastAccessedSubmoduleId;

    @Column(name = "last_accessed_content_id")
    private UUID lastAccessedContentId;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt = LocalDateTime.now();

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public UUID getLastAccessedSubmoduleId() {
        return lastAccessedSubmoduleId;
    }

    public void setLastAccessedSubmoduleId(UUID lastAccessedSubmoduleId) {
        this.lastAccessedSubmoduleId = lastAccessedSubmoduleId;
    }

    public UUID getLastAccessedContentId() {
        return lastAccessedContentId;
    }

    public void setLastAccessedContentId(UUID lastAccessedContentId) {
        this.lastAccessedContentId = lastAccessedContentId;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }
}
