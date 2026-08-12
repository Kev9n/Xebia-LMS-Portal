package com.xebia.eventservice.service;

import com.xebia.eventservice.dto.EventRegistrationResponse;
import com.xebia.eventservice.entity.Event;
import com.xebia.eventservice.entity.EventRegistration;
import com.xebia.eventservice.repository.EventRepository;
import com.xebia.eventservice.repository.EventRegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventRegistrationService {

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    public EventRegistrationResponse register(UUID eventId, String studentId, String studentName, String studentEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (!event.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event is not active");
        }

        if (Instant.now().isAfter(event.getRegistrationDeadline())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration deadline has passed");
        }

        if (registrationRepository.existsByEventIdAndStudentId(eventId, studentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already registered for this event");
        }

        long currentCount = registrationRepository.countByEventId(eventId);
        if (event.getMaxCapacity() != null && currentCount >= event.getMaxCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Event is at full capacity");
        }

        EventRegistration reg = new EventRegistration();
        reg.setEventId(eventId);
        reg.setStudentId(studentId);
        reg.setStudentName(studentName);
        reg.setStudentEmail(studentEmail);
        reg.setStatus("confirmed");

        return EventRegistrationResponse.fromRegistration(registrationRepository.save(reg));
    }

    public void cancelRegistration(UUID eventId, String studentId) {
        EventRegistration reg = registrationRepository.findByEventIdAndStudentId(eventId, studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));
        reg.setStatus("cancelled");
        registrationRepository.save(reg);
    }

    public EventRegistrationResponse getRegistrationStatus(UUID eventId, String studentId) {
        EventRegistration reg = registrationRepository.findByEventIdAndStudentId(eventId, studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not registered"));
        return EventRegistrationResponse.fromRegistration(reg);
    }

    public List<EventRegistrationResponse> getEventRegistrations(UUID eventId) {
        return registrationRepository.findByEventId(eventId).stream()
                .map(EventRegistrationResponse::fromRegistration)
                .collect(Collectors.toList());
    }

    public List<EventRegistrationResponse> getMyRegistrations(String studentId) {
        return registrationRepository.findByStudentId(studentId).stream()
                .map(EventRegistrationResponse::fromRegistration)
                .collect(Collectors.toList());
    }
}
