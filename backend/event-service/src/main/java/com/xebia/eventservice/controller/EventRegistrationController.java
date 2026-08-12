package com.xebia.eventservice.controller;

import com.xebia.eventservice.dto.EventRegistrationResponse;
import com.xebia.eventservice.service.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventRegistrationController {

    @Autowired
    private EventRegistrationService registrationService;

    @PostMapping("/{eventId}/register")
    public ResponseEntity<EventRegistrationResponse> register(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-Id") String studentId,
            @RequestHeader(value = "X-User-Name", defaultValue = "Student") String studentName,
            @RequestHeader(value = "X-User-Email", defaultValue = "student@example.com") String studentEmail) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registrationService.register(eventId, studentId, studentName, studentEmail));
    }

    @DeleteMapping("/{eventId}/register")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-Id") String studentId) {
        registrationService.cancelRegistration(eventId, studentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{eventId}/registration-status")
    public EventRegistrationResponse getRegistrationStatus(
            @PathVariable UUID eventId,
            @RequestHeader("X-User-Id") String studentId) {
        return registrationService.getRegistrationStatus(eventId, studentId);
    }

    @GetMapping("/{eventId}/registrations")
    public List<EventRegistrationResponse> getEventRegistrations(@PathVariable UUID eventId) {
        return registrationService.getEventRegistrations(eventId);
    }

    @GetMapping("/registrations/my")
    public List<EventRegistrationResponse> getMyRegistrations(
            @RequestHeader("X-User-Id") String studentId) {
        return registrationService.getMyRegistrations(studentId);
    }
}
