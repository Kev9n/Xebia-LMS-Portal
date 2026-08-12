package com.xebia.lms.common.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.web.filter.OncePerRequestFilter;

public class TenantHeaderFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String userId = request.getHeader("X-User-Id");
            String tenantId = request.getHeader("X-Tenant-Id");
            if (userId != null && tenantId != null) {
                String rolesHeader = request.getHeader("X-Roles");
                List<String> roles = rolesHeader == null || rolesHeader.isBlank()
                        ? List.of()
                        : Arrays.stream(rolesHeader.split(",")).map(String::trim).filter(role -> !role.isBlank()).toList();
                TenantContext.set(new CurrentUser(UUID.fromString(userId), UUID.fromString(tenantId), roles));
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
