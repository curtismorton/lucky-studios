"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getBrowserSupabaseClient } from "@/lib/cms/client";
import type { CmsRole } from "@/lib/cms/types";

type DashboardProfile = {
  userId: string;
  email: string | null;
  role: CmsRole;
};

type DashboardAuthContextValue = {
  loading: boolean;
  error: string | null;
  session: Session | null;
  profile: DashboardProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  fetchWithAuth: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const DashboardAuthContext = createContext<DashboardAuthContextValue | undefined>(
  undefined
);

async function parseErrorMessage(response: Response): Promise<string> {
  const fallback = `${response.status} ${response.statusText}`;
  try {
    const body = (await response.json()) as { error?: string };
    return body.error || fallback;
  } catch {
    return fallback;
  }
}

export function DashboardAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => {
    try {
      return getBrowserSupabaseClient();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase client configuration missing.");
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.access_token) {
      setProfile(null);
      return;
    }

    const response = await fetch("/api/dashboard/me", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      throw new Error(message);
    }

    const body = (await response.json()) as {
      user?: DashboardProfile;
    };

    if (!body.user) {
      throw new Error("Invalid /api/dashboard/me response.");
    }

    setProfile(body.user);
  }, [session?.access_token]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;

    let mounted = true;

    async function bootstrap() {
      try {
        const { data, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;
        if (!mounted) return;
        setSession(data.session || null);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to restore dashboard session.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void bootstrap();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      if (!nextSession) {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!session?.access_token) {
      setProfile(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    void refreshProfile()
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load dashboard profile.");
        setProfile(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.access_token, refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        throw new Error("Supabase public client is not configured.");
      }

      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        throw new Error("Email and password are required.");
      }

      setLoading(true);
      setError(null);
      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) throw signInError;

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(data.session || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign in.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setSession(null);
      setProfile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign out.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchWithAuth = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!session?.access_token) {
        throw new Error("No dashboard session available.");
      }

      const headers = new Headers(init?.headers || {});
      headers.set("Authorization", `Bearer ${session.access_token}`);
      return fetch(input, {
        ...init,
        headers,
      });
    },
    [session?.access_token]
  );

  const value = useMemo<DashboardAuthContextValue>(
    () => ({
      loading,
      error,
      session,
      profile,
      login,
      logout,
      refreshProfile,
      fetchWithAuth,
    }),
    [loading, error, session, profile, login, logout, refreshProfile, fetchWithAuth]
  );

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth(): DashboardAuthContextValue {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error("useDashboardAuth must be used inside DashboardAuthProvider.");
  }
  return context;
}
