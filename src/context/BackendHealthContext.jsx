import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { checkBackendHealth } from "@/lib/backend-health";
import { resolveApiBaseUrl } from "@/lib/api-config";

const BackendHealthContext = createContext({
  online: null,
  message: "",
  apiBaseUrl: resolveApiBaseUrl(),
  recheck: () => {},
});

export function BackendHealthProvider({ children }) {
  const [online, setOnline] = useState(null);
  const [message, setMessage] = useState("");
  const apiBaseUrl = resolveApiBaseUrl();

  const recheck = useCallback(async (force = false) => {
    const result = await checkBackendHealth(force);
    setOnline(result.ok);
    setMessage(result.message || "");
  }, []);

  useEffect(() => {
    // Defer first probe so cached UI paints before hitting Render
    const initialTimer = setTimeout(() => recheck(true), 2500);
    const interval = setInterval(() => recheck(false), 120_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [recheck]);

  return (
    <BackendHealthContext.Provider
      value={{ online, message, apiBaseUrl, recheck: () => recheck(true) }}
    >
      {children}
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth() {
  return useContext(BackendHealthContext);
}
