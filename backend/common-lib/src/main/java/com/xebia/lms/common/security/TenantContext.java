package com.xebia.lms.common.security;

import java.util.List;
import java.util.UUID;

public final class TenantContext {
    private static final ThreadLocal<CurrentUser> CURRENT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static void set(CurrentUser currentUser) {
        CURRENT.set(currentUser);
    }

    public static CurrentUser get() {
        return CURRENT.get();
    }

    public static UUID tenantId() {
        CurrentUser user = CURRENT.get();
        return user == null ? null : user.tenantId();
    }

    public static UUID userId() {
        CurrentUser user = CURRENT.get();
        return user == null ? null : user.userId();
    }

    public static List<String> roles() {
        CurrentUser user = CURRENT.get();
        return user == null ? List.of() : user.roles();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
