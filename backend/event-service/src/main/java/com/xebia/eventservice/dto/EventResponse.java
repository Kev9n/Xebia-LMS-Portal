package com.xebia.eventservice.dto;

import com.xebia.eventservice.entity.Event;
import java.time.Instant;
import java.util.UUID;

public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private String imageUrl;
    private Instant startDateTime;
    private Instant endDateTime;
    private Instant registrationDeadline;
    private String location;
    private boolean isOnline;
    private String status;
    private String createdBy;
    private Integer maxCapacity;
    private boolean isActive;
    private Instant createdAt;
    private long registrationCount;

    public static EventResponse fromEvent(Event event) {
        EventResponse r = new EventResponse();
        r.id = event.getId();
        r.title = event.getTitle();
        r.description = event.getDescription();
        r.imageUrl = event.getImageUrl();
        r.startDateTime = event.getStartDateTime();
        r.endDateTime = event.getEndDateTime();
        r.registrationDeadline = event.getRegistrationDeadline();
        r.location = event.getLocation();
        r.isOnline = event.isOnline();
        r.status = event.getStatus();
        r.createdBy = event.getCreatedBy();
        r.maxCapacity = event.getMaxCapacity();
        r.isActive = event.isActive();
        r.createdAt = event.getCreatedAt();
        return r;
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public Instant getStartDateTime() { return startDateTime; }
    public Instant getEndDateTime() { return endDateTime; }
    public Instant getRegistrationDeadline() { return registrationDeadline; }
    public String getLocation() { return location; }
    public boolean isOnline() { return isOnline; }
    public String getStatus() { return status; }
    public String getCreatedBy() { return createdBy; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public boolean isActive() { return isActive; }
    public Instant getCreatedAt() { return createdAt; }
    public long getRegistrationCount() { return registrationCount; }
    public void setRegistrationCount(long count) { this.registrationCount = count; }
}
