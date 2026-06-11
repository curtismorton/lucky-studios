import "server-only";

import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/cms/supabase";
import type { CmsRole } from "@/lib/cms/types";

const PASSWORD_HASH_PREFIX = "pbkdf2_sha256";
const DEFAULT_PASSWORD_HASH_ITERATIONS = 210000;
const USER_LOOKUP_PAGE_SIZE = 1000;
const USER_LOOKUP_MAX_PAGES = 10;

export type CmsCredentialUser = {
  username: string;
  email: string;
  role: CmsRole;
  passwordHash: string;
};

function isCmsRole(value: unknown): value is CmsRole {
  return value === "admin" || value === "editor" || value === "viewer";
}

function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function isHex(value: string): boolean {
  return /^[0-9a-f]+$/i.test(value);
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function parseConfiguredUsersJson(
  raw: string,
  sourceLabel = "CMS_CREDENTIAL_USERS_JSON"
): CmsCredentialUser[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `${sourceLabel} must be valid JSON: ${
        error instanceof Error ? error.message : "invalid JSON"
      }`
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`${sourceLabel} must be a JSON array.`);
  }

  return parsed.map((entry, index) => parseCredentialUser(entry, index));
}

function parseNumberedCredentialUsers(): CmsCredentialUser[] {
  const entries = Object.entries(process.env)
    .filter(
      ([key, value]) =>
        /^CMS_CREDENTIAL_USER_\d+$/.test(key) &&
        typeof value === "string" &&
        value.trim().length > 0
    )
    .sort(
      ([leftKey], [rightKey]) =>
        Number.parseInt(leftKey.split("_").pop() ?? "0", 10) -
        Number.parseInt(rightKey.split("_").pop() ?? "0", 10)
    );

  return entries.map(([, value], index) => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(decodeBase64Url((value ?? "").trim()));
    } catch (error) {
      throw new Error(
        `CMS_CREDENTIAL_USER_${index + 1} must be base64url-encoded JSON: ${
          error instanceof Error ? error.message : "invalid JSON"
        }`
      );
    }

    return parseCredentialUser(parsed, index);
  });
}

function parsePasswordHash(
  value: string
): { iterations: number; salt: Buffer; digest: Buffer } | null {
  const [prefix, iterationsRaw, saltHex, digestHex] = value.split("$");
  if (prefix !== PASSWORD_HASH_PREFIX) return null;
  if (!iterationsRaw || !saltHex || !digestHex) return null;
  if (!isHex(saltHex) || !isHex(digestHex)) return null;

  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isSafeInteger(iterations) || iterations <= 0) return null;

  const salt = Buffer.from(saltHex, "hex");
  const digest = Buffer.from(digestHex, "hex");
  if (salt.length === 0 || digest.length === 0) return null;

  return { iterations, salt, digest };
}

function parseCredentialUser(entry: unknown, index: number): CmsCredentialUser {
  if (!entry || typeof entry !== "object") {
    throw new Error(`CMS credential user at index ${index} must be an object.`);
  }

  const record = entry as {
    username?: unknown;
    email?: unknown;
    role?: unknown;
    passwordHash?: unknown;
  };

  const username =
    typeof record.username === "string" ? normalizeUsername(record.username) : "";
  const email = typeof record.email === "string" ? normalizeEmail(record.email) : "";
  const passwordHash =
    typeof record.passwordHash === "string" ? record.passwordHash.trim() : "";

  if (!username) {
    throw new Error(`CMS credential user at index ${index} is missing a username.`);
  }
  if (!email.includes("@")) {
    throw new Error(`CMS credential user "${username}" is missing a valid email.`);
  }
  if (!isCmsRole(record.role)) {
    throw new Error(`CMS credential user "${username}" has an invalid role.`);
  }
  if (!parsePasswordHash(passwordHash)) {
    throw new Error(`CMS credential user "${username}" has an invalid password hash.`);
  }

  return {
    username,
    email,
    role: record.role,
    passwordHash,
  };
}

function getConfiguredUsers(): CmsCredentialUser[] {
  const numberedUsers = parseNumberedCredentialUsers();
  if (numberedUsers.length > 0) {
    return numberedUsers;
  }

  const encoded = process.env.CMS_CREDENTIAL_USERS_BASE64?.trim();
  const raw = encoded
    ? decodeBase64Url(encoded)
    : process.env.CMS_CREDENTIAL_USERS_JSON?.trim() ?? "";
  // No configured users means password login stays disabled — never fall
  // back to baked-in accounts.
  if (!raw) return [];
  return parseConfiguredUsersJson(
    raw,
    encoded ? "CMS_CREDENTIAL_USERS_BASE64" : "CMS_CREDENTIAL_USERS_JSON"
  );
}

export function isCmsPasswordLoginEnabled(): boolean {
  const configuredValue = process.env.CMS_USERNAME_PASSWORD_ENABLED?.trim();
  if (configuredValue === "true") return true;
  if (configuredValue === "false") return false;
  return getConfiguredUsers().length > 0;
}

export function getCmsCredentialUsers(): CmsCredentialUser[] {
  return getConfiguredUsers();
}

export function findCmsCredentialUser(
  identifier: string | null | undefined
): CmsCredentialUser | null {
  if (!identifier) return null;
  const normalizedIdentifier = normalizeUsername(identifier);
  if (!normalizedIdentifier) return null;

  return (
    getConfiguredUsers().find(
      (user) =>
        user.username === normalizedIdentifier ||
        user.email === normalizeEmail(normalizedIdentifier)
    ) ?? null
  );
}

export function verifyCmsCredentialPassword(
  user: CmsCredentialUser,
  password: string
): boolean {
  const parsedHash = parsePasswordHash(user.passwordHash);
  if (!parsedHash) return false;

  const actualDigest = pbkdf2Sync(
    password,
    parsedHash.salt,
    parsedHash.iterations,
    parsedHash.digest.length,
    "sha256"
  );

  if (actualDigest.length !== parsedHash.digest.length) return false;
  return timingSafeEqual(actualDigest, parsedHash.digest);
}

async function findAuthUserByEmail(email: string): Promise<User | null> {
  const client = createServiceRoleClient();

  for (let page = 1; page <= USER_LOOKUP_MAX_PAGES; page += 1) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: USER_LOOKUP_PAGE_SIZE,
    });

    if (error) {
      throw new Error(error.message || "Failed to list Supabase auth users.");
    }

    const users = data.users ?? [];
    const existingUser =
      users.find(
        (user) => normalizeEmail(user.email ?? "") === normalizeEmail(email)
      ) ?? null;
    if (existingUser) {
      return existingUser;
    }

    if (users.length < USER_LOOKUP_PAGE_SIZE) {
      break;
    }
  }

  return null;
}

export async function provisionCmsCredentialUser(user: CmsCredentialUser): Promise<{
  userId: string;
  email: string;
  role: CmsRole;
}> {
  const client = createServiceRoleClient();
  let authUser = await findAuthUserByEmail(user.email);

  if (!authUser) {
    const { data, error } = await client.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      password: randomBytes(24).toString("hex"),
      user_metadata: {
        cms_username: user.username,
        auth_provider: "cms_credentials",
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message || "Failed to create the credential user.");
    }

    authUser = data.user;
  }

  const { error: upsertError } = await client.from("cms_user_roles").upsert(
    {
      user_id: authUser.id,
      role: user.role,
    },
    { onConflict: "user_id" }
  );

  if (upsertError) {
    throw new Error(upsertError.message || "Failed to assign the CMS role.");
  }

  return {
    userId: authUser.id,
    email: normalizeEmail(authUser.email ?? user.email),
    role: user.role,
  };
}

export function hashCmsCredentialPassword(password: string): string {
  const normalizedPassword = password.trim();
  if (!normalizedPassword) {
    throw new Error("Password is required.");
  }

  const salt = randomBytes(16);
  const digest = pbkdf2Sync(
    normalizedPassword,
    salt,
    DEFAULT_PASSWORD_HASH_ITERATIONS,
    32,
    "sha256"
  );

  return [
    PASSWORD_HASH_PREFIX,
    String(DEFAULT_PASSWORD_HASH_ITERATIONS),
    salt.toString("hex"),
    digest.toString("hex"),
  ].join("$");
}
