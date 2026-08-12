package com.xebia.lms.common.security;

import java.util.List;
import java.util.UUID;

public record CurrentUser(UUID userId, UUID tenantId, List<String> roles) {
}
