"use client";

import { useCallback } from "react";

async function parseError(response: Response): Promise<string> {
  const fallback = `${response.status} ${response.statusText}`;
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export function useCmsApi() {
  const requestJson = useCallback(async <T,>(
    path: string,
    init?: RequestInit
  ): Promise<T> => {
    const response = await fetch(path, {
      cache: "no-store",
      credentials: "include",
      ...init,
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    return (await response.json()) as T;
  }, []);

  return {
    requestJson,
  };
}
