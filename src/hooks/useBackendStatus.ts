import { useEffect, useState } from "react";
import { checkBackendStatus } from "@/services/api";

export type BackendStatus = "checking" | "online" | "offline";

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    const check = async () => {
      setStatus("checking");
      const isOnline = await checkBackendStatus(controller.signal);
      setStatus(isOnline ? "online" : "offline");
    };

    void check();
    const interval = window.setInterval(check, 30000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  return status;
}
