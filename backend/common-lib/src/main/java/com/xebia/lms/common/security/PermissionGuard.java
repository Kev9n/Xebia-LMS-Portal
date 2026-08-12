package com.xebia.lms.common.security;

import com.xebia.lms.common.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class PermissionGuard {
    public void requireRole(String role) {
        if (!TenantContext.roles().contains(role)) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "Required role missing: " + role);
        }
    }

    public void requireTenant() {
        if (TenantContext.tenantId() == null) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "Tenant context is missing");
        }
    }
}
