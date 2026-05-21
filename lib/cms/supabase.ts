import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServiceConfig = {
  url: string;
  serviceRoleKey: string;
};

type PublicConfig = {
  url: string;
  anonKey: string;
};

let cachedClient: SupabaseClient | null = null;
let cachedPublicServerClient: SupabaseClient | null = null;

export function getSupabaseServiceConfig(): ServiceConfig | null {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) return null;

  return {
    url: url.replace(/\/+$/, ""),
    serviceRoleKey,
  };
}

export function getSupabasePublicConfig(): PublicConfig | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) return null;

  return {
    url: url.replace(/\/+$/, ""),
    anonKey,
  };
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(getSupabaseServiceConfig());
}

export function isSupabasePublicConfigured(): boolean {
  return Boolean(getSupabasePublicConfig());
}

export function createServiceRoleClient(): SupabaseClient {
  const config = getSupabaseServiceConfig();
  if (!config) {
    throw new Error(
      "Supabase service role config missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (cachedClient) return cachedClient;

  cachedClient = createClient(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return cachedClient;
}

export function createPublicServerClient(): SupabaseClient {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error(
      "Supabase public config missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  if (cachedPublicServerClient) return cachedPublicServerClient;

  cachedPublicServerClient = createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return cachedPublicServerClient;
}
