export const consultationFallbackHref = "/contact?intent=consultation";

export function resolveConsultationHref(configuredHref?: string): string {
  const href = configuredHref?.trim();

  if (!href || href.toLowerCase().includes("your-handle")) {
    return consultationFallbackHref;
  }

  return href;
}
