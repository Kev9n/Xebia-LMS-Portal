package com.xebia.eventservice.repository;

import com.xebia.eventservice.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByIsActiveTrue();
    List<Event> findByStatusAndIsActiveTrue(String status);
    List<Event> findByCreatedBy(String createdBy);
}
