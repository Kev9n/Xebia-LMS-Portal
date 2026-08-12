package com.xebia.eventservice.service;

import com.xebia.eventservice.dto.CreateEventRequest;
import com.xebia.eventservice.dto.EventResponse;
import com.xebia.eventservice.entity.Event;
import com.xebia.eventservice.repository.EventRepository;
import com.xebia.eventservice.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    public List<EventResponse> getAllEvents() {
        return eventRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        return toResponse(event);
    }

    public EventResponse createEvent(CreateEventRequest req, UUID tenantId, String createdBy) {
        if (req.getRegistrationDeadline().isAfter(req.getStartDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration deadline must be before event start");
        }
        if (req.getStartDateTime().isAfter(req.getEndDateTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Start must be before end");
        }
        Event event = new Event();
        event.setTenantId(tenantId);
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setImageUrl(req.getImageUrl());
        event.setStartDateTime(req.getStartDateTime());
        event.setEndDateTime(req.getEndDateTime());
        event.setRegistrationDeadline(req.getRegistrationDeadline());
        event.setLocation(req.getLocation());
        event.setOnline(req.isOnline());
        event.setMaxCapacity(req.getMaxCapacity());
        event.setCreatedBy(createdBy);
        event.setStatus(req.getStatus() != null ? req.getStatus() : "upcoming");
        event.setActive(true);
        return toResponse(eventRepository.save(event));
    }

    public EventResponse updateEvent(UUID id, CreateEventRequest req) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        event.setTitle(req.getTitle());
        event.setDescription(req.getDescription());
        event.setImageUrl(req.getImageUrl());
        event.setStartDateTime(req.getStartDateTime());
        event.setEndDateTime(req.getEndDateTime());
        event.setRegistrationDeadline(req.getRegistrationDeadline());
        event.setLocation(req.getLocation());
        event.setOnline(req.isOnline());
        event.setMaxCapacity(req.getMaxCapacity());
        return toResponse(eventRepository.save(event));
    }

    public void deleteEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        event.setActive(false);
        eventRepository.save(event);
    }

    @org.springframework.transaction.annotation.Transactional
    public java.util.Map<String, Integer> deleteEventsByCreatedBy(String createdBy) {
        java.util.List<Event> events = eventRepository.findByCreatedBy(createdBy);
        int eventCount = events.size();
        int regCount = 0;
        for (Event e : events) {
            java.util.List<com.xebia.eventservice.entity.EventRegistration> regs = registrationRepository.findByEventId(e.getId());
            regCount += regs.size();
            registrationRepository.deleteAll(regs);
            e.setActive(false);
            eventRepository.save(e);
        }
        return java.util.Map.of("events", eventCount, "registrations", regCount);
    }

    private EventResponse toResponse(Event event) {
        EventResponse resp = EventResponse.fromEvent(event);
        resp.setRegistrationCount(registrationRepository.countByEventId(event.getId()));
        return resp;
    }
}
