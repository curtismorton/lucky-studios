"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CmsSessionState } from "@/lib/cms/editorTypes";

type CmsAuthContextValue = {
  loading: boolean;
  error: string | null;
  session: CmsSessionState | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const CmsAuthContext = createContext<CmsAuthContextValue | undefined>(undefined);

async function parseError(response: Response): Promise<string> {
  const fallback = `${response.status} ${response.statusText}`;
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export function CmsAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<CmsSessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    const response = await fetch("/api/cms/session", {
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await parseError(response));
    }

    const payload = (await response.json()) as CmsSessionState;
    setSession(payload);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    void refreshSession()
      .catch((err) => {
        if (!active) return;
        setSession(null);
        setError(
          err instanceof Error ? err.message : "Failed to load CMS session."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshSession]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/cms/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setSession(null);
      window.location.href = "/cms/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out.");
      setLoading(false);
    }
  }, []);

  const value = useMemo<CmsAuthContextValue>(
    () => ({
      loading,
      error,
      session,
      refreshSession,
      logout,
    }),
    [loading, error, session, refreshSession, logout]
  );

  return (
    <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>
  );
}

export function useCmsAuth(): CmsAuthContextValue {
  const context = useContext(CmsAuthContext);
  if (!context) {
    throw new Error("useCmsAuth must be used inside CmsAuthProvider.");
  }
  return context;
}
