import "server-only";

import { NextRequest } from "next/server";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

function parseUrl(input: string | undefined): URL | null {
  if (!input) return null;
  try {
    return new URL(input);
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string): boolean {
  if (LOCAL_HOSTNAMES.has(hostname)) return true;
  return hostname.endsWith(".local");
}

export function resolveCmsAuthOrigin(request: NextRequest): string {
  const requestHostname = request.nextUrl.hostname.toLowerCase();
  const configuredBase = parseUrl(process.env.CMS_AUTH_BASE_URL?.trim());

  // Keep callbacks on the active host unless this is a localhost dev request.
  if (configuredBase) {
    const configuredHostname = configuredBase.hostname.toLowerCase();
    if (
      configuredHostname === requestHostname ||
      isLocalHostname(requestHostname)
    ) {
      return configuredBase.origin;
    }
  }

  return request.nextUrl.origin;
}
