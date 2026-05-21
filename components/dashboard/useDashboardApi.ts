"use client";

import { useCallback } from "react";
import { useDashboardAuth } from "@/components/dashboard/DashboardAuthProvider";

async function parseError(response: Response): Promise<string> {
  const fallback = `${response.status} ${response.statusText}`;
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export function useDashboardApi() {
  const { fetchWithAuth } = useDashboardAuth();

  const requestJson = useCallback(
    async <T>(
      path: string,
      init?: RequestInit
    ): Promise<T> => {
      const response = await fetchWithAuth(path, {
        cache: "no-store",
        ...init,
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      return (await response.json()) as T;
    },
    [fetchWithAuth]
  );

  return {
    requestJson,
  };
}
