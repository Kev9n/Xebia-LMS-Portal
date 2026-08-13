import { createContext, useContext, useEffect, useState } from "react";
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

  const recheck = async () => {
    const result = await checkBackendHealth(true);
    setOnline(result.ok);
    setMessage(result.message || "");
  };

  useEffect(() => {
    recheck();
    const interval = setInterval(recheck, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BackendHealthContext.Provider value={{ online, message, apiBaseUrl, recheck }}>
      {children}
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth() {
  return useContext(BackendHealthContext);
}
