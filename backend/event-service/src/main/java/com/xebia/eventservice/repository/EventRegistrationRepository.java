package com.xebia.eventservice.repository;

import com.xebia.eventservice.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
    List<EventRegistration> findByEventId(UUID eventId);
    Optional<EventRegistration> findByEventIdAndStudentId(UUID eventId, String studentId);
    boolean existsByEventIdAndStudentId(UUID eventId, String studentId);
    long countByEventId(UUID eventId);
    List<EventRegistration> findByStudentId(String studentId);
}
