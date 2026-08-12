package com.xebia.lms.course.entity;

import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories", schema = "course")
public class Category extends TenantScopedEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String slug;
    
    private String icon;
    
    private String description;
    
    private String color;
    
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
