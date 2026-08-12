package com.xebia.lms.course.entity;

import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "content_progress", schema = "course", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "student_id", "content_id"})
})
public class ContentProgress extends TenantScopedEntity {

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "course_id", nullable = false)
    private UUID courseId;

    @Column(name = "module_id", nullable = false)
    private UUID moduleId;

    @Column(name = "submodule_id", nullable = false)
    private UUID submoduleId;

    @Column(name = "content_id", nullable = false)
    private UUID contentId;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

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

    public UUID getModuleId() {
        return moduleId;
    }

    public void setModuleId(UUID moduleId) {
        this.moduleId = moduleId;
    }

    public UUID getSubmoduleId() {
        return submoduleId;
    }

    public void setSubmoduleId(UUID submoduleId) {
        this.submoduleId = submoduleId;
    }

    public UUID getContentId() {
        return contentId;
    }

    public void setContentId(UUID contentId) {
        this.contentId = contentId;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
        if (completed && completedAt == null) {
            completedAt = LocalDateTime.now();
        } else if (!completed) {
            completedAt = null;
        }
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
