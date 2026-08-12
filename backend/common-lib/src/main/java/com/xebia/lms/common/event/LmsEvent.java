package com.xebia.lms.common.event;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record LmsEvent(
        UUID eventId,
        String eventType,
        Instant occurredAt,
        UUID tenantId,
        UUID actorUserId,
        String sourceService,
        Map<String, Object> payload
) {
    public static LmsEvent of(String eventType, UUID tenantId, UUID actorUserId, String sourceService, Map<String, Object> payload) {
        return new LmsEvent(UUID.randomUUID(), eventType, Instant.now(), tenantId, actorUserId, sourceService, payload);
    }
}
