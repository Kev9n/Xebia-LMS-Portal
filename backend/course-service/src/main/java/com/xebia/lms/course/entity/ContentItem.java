package com.xebia.lms.course.entity;

import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "content_items", schema = "course")
public class ContentItem extends TenantScopedEntity {
    @Column(nullable = false)
    private UUID courseId;
    private UUID moduleId;
    private UUID subModuleId;
    @Column(nullable = false)
    private String title;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType type;
    private String storageRef;
    @Column(nullable = false)
    private int position;
    public UUID getCourseId() { return courseId; }
    public void setCourseId(UUID courseId) { this.courseId = courseId; }
    public UUID getModuleId() { return moduleId; }
    public void setModuleId(UUID moduleId) { this.moduleId = moduleId; }
    public UUID getSubModuleId() { return subModuleId; }
    public void setSubModuleId(UUID subModuleId) { this.subModuleId = subModuleId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ContentType getType() { return type; }
    public void setType(ContentType type) { this.type = type; }
    public String getStorageRef() { return storageRef; }
    public void setStorageRef(String storageRef) { this.storageRef = storageRef; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
}
