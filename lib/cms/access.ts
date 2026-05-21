import "server-only";

import type { CmsRole } from "@/lib/cms/types";

const DEFAULT_ALLOWED_DOMAINS = ["sociallypowerful.com"];

function parseList(value: string | undefined): string[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function parseRole(value: string | undefined, fallback: CmsRole): CmsRole {
  if (value === "admin" || value === "editor" || value === "viewer") {
    return value;
  }

  return fallback;
}

export function normalizeCmsEmail(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return normalized.includes("@") ? normalized : null;
}

export function getAllowedCmsEmailDomains(): string[] {
  const configured = parseList(process.env.CMS_ALLOWED_EMAIL_DOMAINS);
  return configured.length > 0 ? configured : DEFAULT_ALLOWED_DOMAINS;
}

export function getAllowedCmsEmails(): string[] {
  return parseList(process.env.CMS_ALLOWED_EMAILS);
}

export function getAllowedCmsEmailHint(): string {
  const domains = getAllowedCmsEmailDomains();
  if (domains.length === 1) {
    return `@${domains[0]}`;
  }

  return domains.map((domain) => `@${domain}`).join(" or ");
}

export function isAllowedCmsEmail(value: string | null | undefined): boolean {
  const email = normalizeCmsEmail(value);
  if (!email) return false;

  const allowedEmails = getAllowedCmsEmails();
  if (allowedEmails.includes(email)) {
    return true;
  }

  const domain = email.split("@")[1];
  return getAllowedCmsEmailDomains().includes(domain);
}

export function getProvisionedRoleForCmsEmail(
  value: string | null | undefined,
  isFirstUser: boolean
): CmsRole | null {
  const email = normalizeCmsEmail(value);
  if (!email || !isAllowedCmsEmail(email)) {
    return null;
  }

  const bootstrapAdmins = parseList(process.env.CMS_BOOTSTRAP_ADMIN_EMAILS);
  if (bootstrapAdmins.includes(email) || isFirstUser) {
    return "admin";
  }

  return parseRole(process.env.CMS_ALLOWED_EMAIL_DEFAULT_ROLE, "editor");
}
