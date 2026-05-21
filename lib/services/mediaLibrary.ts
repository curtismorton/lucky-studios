const DEFAULT_BUCKET = process.env.CMS_MEDIA_BUCKET || "site-media";
const DEFAULT_PREFIX = process.env.CMS_MEDIA_PREFIX || "homepage";

export interface MediaAsset {
  name: string;
  path: string;
  url: string;
  mimeType?: string;
  size?: number;
  updatedAt?: string;
}

type SupabaseConfig = {
  url: string;
  serviceRoleKey: string;
  bucket: string;
  prefix: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return {
    url: url.replace(/\/$/, ""),
    serviceRoleKey,
    bucket: DEFAULT_BUCKET,
    prefix: DEFAULT_PREFIX,
  };
}

function buildHeaders(serviceRoleKey: string): HeadersInit {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  };
}

function safeSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-._/]/g, "")
    .replace(/\/+/g, "/");
}

function normalizeFolder(folder: string | undefined, fallback: string): string {
  const candidate = folder ? safeSegment(folder) : fallback;
  const cleaned = candidate.replace(/^\/+|\/+$/g, "");
  return cleaned || fallback;
}

function createFileName(originalName: string): string {
  const trimmed = originalName.trim();
  const extensionMatch = trimmed.match(/\.([a-zA-Z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : "jpg";
  const stem = trimmed
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 48);

  const safeStem = stem || "image";
  return `${Date.now()}-${safeStem}.${extension}`;
}

function buildPublicUrl(baseUrl: string, bucket: string, path: string): string {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

async function ensureMediaBucket(config: SupabaseConfig): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`${config.url}/storage/v1/bucket`, {
      method: "POST",
      headers: {
        ...buildHeaders(config.serviceRoleKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: config.bucket,
        name: config.bucket,
        public: true,
      }),
    });

    if (response.ok) {
      return { ok: true };
    }

    const body = (await response.text()).toLowerCase();
    if (
      response.status === 409 ||
      body.includes("already exists") ||
      body.includes("duplicate")
    ) {
      return { ok: true };
    }

    return {
      ok: false,
      error: body || `${response.status} ${response.statusText}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unknown bucket setup error",
    };
  }
}

export function isMediaLibraryConfigured(): boolean {
  return Boolean(getSupabaseConfig());
}

export async function listMediaAssets(folder?: string): Promise<{
  ok: boolean;
  assets?: MediaAsset[];
  error?: string;
}> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      error: "Media library is not configured.",
    };
  }

  const prefix = normalizeFolder(folder, config.prefix);
  const bucketSetup = await ensureMediaBucket(config);
  if (!bucketSetup.ok) {
    return {
      ok: false,
      error: `Failed to prepare media bucket: ${bucketSetup.error}`,
    };
  }

  try {
    const response = await fetch(
      `${config.url}/storage/v1/object/list/${config.bucket}`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.serviceRoleKey),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix,
          limit: 120,
          offset: 0,
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        error: body || `${response.status} ${response.statusText}`,
      };
    }

    const rows = (await response.json()) as Array<{
      name?: string;
      metadata?: { size?: number; mimetype?: string };
      updated_at?: string;
    }>;

    const assets = rows
      .filter((row) => typeof row?.name === "string" && row.name.length > 0)
      .map((row) => {
        const name = row.name as string;
        const path = `${prefix}/${name}`;
        return {
          name,
          path,
          url: buildPublicUrl(config.url, config.bucket, path),
          mimeType: row.metadata?.mimetype,
          size: row.metadata?.size,
          updatedAt: row.updated_at,
        } satisfies MediaAsset;
      });

    return {
      ok: true,
      assets,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unknown media listing error",
    };
  }
}

export async function uploadMediaAsset(input: {
  fileName: string;
  fileType: string;
  bytes: ArrayBuffer;
  folder?: string;
}): Promise<{ ok: boolean; asset?: MediaAsset; error?: string }> {
  const config = getSupabaseConfig();
  if (!config) {
    return {
      ok: false,
      error: "Media library is not configured.",
    };
  }

  const folder = normalizeFolder(input.folder, config.prefix);
  const fileName = createFileName(input.fileName);
  const path = `${folder}/${fileName}`;
  const bucketSetup = await ensureMediaBucket(config);
  if (!bucketSetup.ok) {
    return {
      ok: false,
      error: `Failed to prepare media bucket: ${bucketSetup.error}`,
    };
  }

  try {
    const response = await fetch(
      `${config.url}/storage/v1/object/${config.bucket}/${path}`,
      {
        method: "POST",
        headers: {
          ...buildHeaders(config.serviceRoleKey),
          "Content-Type": input.fileType || "application/octet-stream",
          "x-upsert": "true",
        },
        body: Buffer.from(input.bytes),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return {
        ok: false,
        error: body || `${response.status} ${response.statusText}`,
      };
    }

    const asset: MediaAsset = {
      name: fileName,
      path,
      url: buildPublicUrl(config.url, config.bucket, path),
      mimeType: input.fileType || "application/octet-stream",
      size: input.bytes.byteLength,
    };

    return {
      ok: true,
      asset,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unknown media upload error",
    };
  }
}
