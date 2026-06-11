/**
 * Generic payload normalizer: deep-merges stored CMS input over compiled-in
 * defaults so missing or malformed fields always fall back to a valid value.
 *
 * Rules per field, driven by the default's type:
 * - objects: recurse key-by-key (unknown input keys are dropped)
 * - arrays: take the input array wholesale if it is an array, else the default
 * - primitives: take the input when typeof matches the default, else the default
 */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeValue(defaultValue: unknown, input: unknown): unknown {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(input) ? input : defaultValue;
  }
  if (isPlainObject(defaultValue)) {
    if (!isPlainObject(input)) return defaultValue;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(defaultValue)) {
      result[key] = mergeValue(defaultValue[key], input[key]);
    }
    return result;
  }
  if (defaultValue === null || defaultValue === undefined) {
    return input ?? defaultValue;
  }
  return typeof input === typeof defaultValue ? input : defaultValue;
}

export function normalizeWithDefaults<T>(defaults: T, input: unknown): T {
  return mergeValue(defaults, input) as T;
}
