import { useState, useCallback } from "react";

export interface Toast {
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, severity: Toast["severity"] = "info") => {
    setToast({ message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
}
