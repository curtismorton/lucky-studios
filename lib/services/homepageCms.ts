import {
  defaultHomepageContent,
  normalizeHomepageContent,
  type HomepageContent,
} from "@/lib/data/homepageContent";
import { isCmsV2ReadEnabled, isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { publishEntity, saveEntityDraft } from "@/lib/cms/entities";

const CMS_KEY = "homepage";
const CMS_TABLE = process.env.CMS_CONTENT_TABLE || "site_content";
export const HOMEPAGE_CMS_CACHE_TAG = "cms:homepage";
const CMS_REVALIDATE_SECONDS = 86400;

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url, serviceRoleKey };
}

function buildHeaders(serviceRoleKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

export function isHomepageCmsConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

export async function getHomepageContent(): Promise<HomepageContent> {
  if (isCmsV2ReadEnabled()) {
    try {
      return await getCmsRuntimePayload("homepage", { allowPreview: true });
    } catch (error) {
      console.error("CMS V2 homepage read fallback triggered:", error);
    }
  }

  const config = getSupabaseConfig();
  if (!config) {
    return defaultHomepageContent;
  }

  try {
    const response = await fetch(
      `${config.url}/rest/v1/${CMS_TABLE}?key=eq.${CMS_KEY}&select=value&limit=1`,
      {
        headers: buildHeaders(config.serviceRoleKey),
        next: {
          revalidate: CMS_REVALIDATE_SECONDS,
          tags: [HOMEPAGE_CMS_CACHE_TAG],
        },
      }
    );

    if (!response.ok) {
      console.error("CMS read failed:", response.status, response.statusText);
      return defaultHomepageContent;
    }

    const data = await response.json();
    const row = Array.isArray(data) ? data[0] : null;
    return normalizeHomepageContent(row?.value);
  } catch (error) {
    console.error("CMS read error:", error);
    return defaultHomepageContent;
  }
}

export async function saveHomepageContent(
  content: HomepageContent
): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizeHomepageContent(content);

  if (isCmsV2WriteEnabled()) {
    try {
      await saveEntityDraft("homepage", normalized, {}, null);
      await publishEntity("homepage", null, "Legacy homepage CMS save");
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to write homepage content to CMS V2.",
      };
    }
  }

  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      error:
        "CMS backend is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/${CMS_TABLE}`, {
      method: "POST",
      headers: {
        ...buildHeaders(config.serviceRoleKey),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify([
        {
          key: CMS_KEY,
          value: normalized,
        },
      ]),
    });

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        error: body || `${response.status} ${response.statusText}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown CMS write error",
    };
  }
}
