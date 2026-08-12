package com.xebia.eventservice.controller;

import com.xebia.eventservice.dto.CreateEventRequest;
import com.xebia.eventservice.dto.EventResponse;
import com.xebia.eventservice.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<EventResponse> getAllEvents() {
        return eventService.getAllEvents();
    }

    @GetMapping("/{eventId}")
    public EventResponse getEventById(@PathVariable UUID eventId) {
        return eventService.getEventById(eventId);
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody CreateEventRequest req,
            @RequestHeader(value = "X-Tenant-Id", defaultValue = "123e4567-e89b-12d3-a456-426614174000") UUID tenantId,
            @RequestHeader(value = "X-User-Id", defaultValue = "admin") String userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(req, tenantId, userId));
    }

    @PutMapping("/{eventId}")
    public EventResponse updateEvent(@PathVariable UUID eventId, @RequestBody CreateEventRequest req) {
        return eventService.updateEvent(eventId, req);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/created-by/{createdBy}")
    public ResponseEntity<java.util.Map<String, Integer>> deleteByCreator(@PathVariable String createdBy) {
        return ResponseEntity.ok(eventService.deleteEventsByCreatedBy(createdBy));
    }
}
