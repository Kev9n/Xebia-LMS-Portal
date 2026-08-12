package com.xebia.eventservice.dto;

import com.xebia.eventservice.entity.EventRegistration;
import java.time.Instant;
import java.util.UUID;

public class EventRegistrationResponse {
    private UUID id;
    private UUID eventId;
    private String studentId;
    private String studentName;
    private String studentEmail;
    private Instant registeredAt;
    private String status;

    public static EventRegistrationResponse fromRegistration(EventRegistration reg) {
        EventRegistrationResponse r = new EventRegistrationResponse();
        r.id = reg.getId();
        r.eventId = reg.getEventId();
        r.studentId = reg.getStudentId();
        r.studentName = reg.getStudentName();
        r.studentEmail = reg.getStudentEmail();
        r.registeredAt = reg.getCreatedAt();
        r.status = reg.getStatus();
        return r;
    }

    public UUID getId() { return id; }
    public UUID getEventId() { return eventId; }
    public String getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public String getStudentEmail() { return studentEmail; }
    public Instant getRegisteredAt() { return registeredAt; }
    public String getStatus() { return status; }
}
