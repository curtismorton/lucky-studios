import {
  defaultMarketingPagesContent,
  normalizeMarketingPagesContent,
  type MarketingPagesContent,
} from "@/lib/data/marketingContent";
import { isCmsV2ReadEnabled, isCmsV2WriteEnabled } from "@/lib/cms/flags";
import { getCmsRuntimePayload } from "@/lib/cms/runtime";
import { publishEntity, saveEntityDraft } from "@/lib/cms/entities";

const CMS_KEY = "marketing-pages";
const CMS_TABLE = process.env.CMS_CONTENT_TABLE || "site_content";
export const MARKETING_CMS_CACHE_TAG = "cms:marketing-pages";
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

export function isMarketingCmsConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

export async function getMarketingPagesContent(): Promise<MarketingPagesContent> {
  if (isCmsV2ReadEnabled()) {
    try {
      return await getCmsRuntimePayload("marketing-pages", { allowPreview: true });
    } catch (error) {
      console.error("CMS V2 marketing read fallback triggered:", error);
    }
  }

  const config = getSupabaseConfig();
  if (!config) {
    return defaultMarketingPagesContent;
  }

  try {
    const response = await fetch(
      `${config.url}/rest/v1/${CMS_TABLE}?key=eq.${CMS_KEY}&select=value&limit=1`,
      {
        headers: buildHeaders(config.serviceRoleKey),
        next: {
          revalidate: CMS_REVALIDATE_SECONDS,
          tags: [MARKETING_CMS_CACHE_TAG],
        },
      }
    );

    if (!response.ok) {
      console.error("Marketing CMS read failed:", response.status, response.statusText);
      return defaultMarketingPagesContent;
    }

    const data = await response.json();
    const row = Array.isArray(data) ? data[0] : null;
    return normalizeMarketingPagesContent(row?.value);
  } catch (error) {
    console.error("Marketing CMS read error:", error);
    return defaultMarketingPagesContent;
  }
}

export async function saveMarketingPagesContent(
  content: MarketingPagesContent
): Promise<{ ok: boolean; error?: string }> {
  const normalized = normalizeMarketingPagesContent(content);

  if (isCmsV2WriteEnabled()) {
    try {
      await saveEntityDraft("marketing-pages", normalized, {}, null);
      await publishEntity("marketing-pages", null, "Legacy marketing CMS save");
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to write marketing content to CMS V2.",
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
      error:
        error instanceof Error ? error.message : "Unknown marketing CMS write error",
    };
  }
}
