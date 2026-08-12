package com.xebia.eventservice.dto;

import java.time.Instant;

public class CreateEventRequest {
    private String title;
    private String description;
    private String imageUrl;
    private Instant startDateTime;
    private Instant endDateTime;
    private Instant registrationDeadline;
    private String location;
    private boolean isOnline;
    private Integer maxCapacity;
    private String status;

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
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
