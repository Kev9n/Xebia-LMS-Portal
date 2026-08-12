package com.xebia.eventservice.entity;

import com.xebia.lms.common.domain.TenantScopedEntity;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "events")
public class Event extends TenantScopedEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(nullable = false)
    private Instant startDateTime;

    @Column(nullable = false)
    private Instant endDateTime;

    @Column(nullable = false)
    private Instant registrationDeadline;

    private String location;

    private boolean isOnline;

    @Column(nullable = false)
    private String status = "upcoming";

    @Column(nullable = false)
    private String createdBy;

    private Integer maxCapacity;

    @Column(nullable = false)
    private boolean isActive = true;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Instant getStartDateTime() { return startDateTime; }
    public void setStartDateTime(Instant startDateTime) { this.startDateTime = startDateTime; }
    public Instant getEndDateTime() { return endDateTime; }
    public void setEndDateTime(Instant endDateTime) { this.endDateTime = endDateTime; }
    public Instant getRegistrationDeadline() { return registrationDeadline; }
    public void setRegistrationDeadline(Instant registrationDeadline) { this.registrationDeadline = registrationDeadline; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public boolean isOnline() { return isOnline; }
    public void setOnline(boolean online) { isOnline = online; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
