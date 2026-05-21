export type CmsFlags = {
  dashboardEnabled: boolean;
  readsEnabled: boolean;
  writesEnabled: boolean;
  legacyAdminReadonly: boolean;
  devBypassAuth: boolean;
};

function parseBool(value: string | undefined, fallback = false): boolean {
  if (typeof value !== "string") return fallback;
  return value.trim().toLowerCase() === "true";
}

export function getCmsFlags(): CmsFlags {
  return {
    dashboardEnabled: parseBool(process.env.CMS_V2_DASHBOARD_ENABLED, false),
    readsEnabled: parseBool(process.env.CMS_V2_READS_ENABLED, false),
    writesEnabled: parseBool(process.env.CMS_V2_WRITES_ENABLED, false),
    legacyAdminReadonly: parseBool(
      process.env.CMS_LEGACY_ADMIN_READONLY,
      false
    ),
    devBypassAuth: parseBool(process.env.CMS_V2_DEV_BYPASS_AUTH, false),
  };
}

export function isDashboardEnabled(): boolean {
  return getCmsFlags().dashboardEnabled;
}

export function isCmsV2ReadEnabled(): boolean {
  return getCmsFlags().readsEnabled;
}

export function isCmsV2WriteEnabled(): boolean {
  return getCmsFlags().writesEnabled;
}
