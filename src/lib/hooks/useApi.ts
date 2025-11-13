import { useState, useCallback } from "react";
import { ApiError } from "../api/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<{ success: boolean; data: T; message?: string }>) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await apiCall();
        setState({ data: response.data, loading: false, error: null });
        return response;
      } catch (error: any) {
        const apiError = error as ApiError;
        const errorMessage = apiError.message || "An error occurred";
        setState({ data: null, loading: false, error: errorMessage });
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
