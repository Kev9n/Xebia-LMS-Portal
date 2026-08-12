import { useMemo } from "react";

// Mocks permission checks - in production reads from JWT/auth context
export function usePermissions() {
  return {
    hasPermission: (_perm) => true, // All perms granted for development
  };
}

export function PermissionGuard({ required, children, fallback = null }) {
  const { hasPermission } = usePermissions();

  const allowed = useMemo(() => {
    if (!required) return true;
    if (Array.isArray(required)) return required.every((p) => hasPermission(p));
    return hasPermission(required);
  }, [required, hasPermission]);

  if (!allowed) return fallback;
  return children;
}
