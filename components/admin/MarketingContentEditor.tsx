"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultMarketingPagesContent,
  type MarketingPagesContent,
} from "@/lib/data/marketingContent";

type PathSegment = string | number;
type PageKey = keyof MarketingPagesContent;

interface MarketingContentEditorProps {
  token: string;
  mediaUrls?: string[];
}

const PAGE_OPTIONS: Array<{ key: PageKey; label: string }> = [
  { key: "about", label: "About" },
  { key: "brands", label: "Brands" },
  { key: "creators", label: "Creators" },
  { key: "studio", label: "Studio" },
  { key: "contact", label: "Contact" },
];

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function keyLabel(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function getAtPath(root: unknown, path: PathSegment[]): unknown {
  let cursor: unknown = root;
  for (const segment of path) {
    if (typeof segment === "number") {
      if (!Array.isArray(cursor)) return undefined;
      cursor = cursor[segment];
      continue;
    }

    if (!isObject(cursor)) return undefined;
    cursor = cursor[segment];
  }
  return cursor;
}

function setAtPath<T>(
  root: T,
  path: PathSegment[],
  nextValue: unknown
): T {
  if (path.length === 0) {
    return nextValue as T;
  }

  const draft = deepClone(root) as unknown;
  let cursor: unknown = draft;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    const nextSegment = path[index + 1];

    if (typeof segment === "number") {
      if (!Array.isArray(cursor)) {
        return root;
      }

      if (cursor[segment] === undefined || cursor[segment] === null) {
        cursor[segment] = typeof nextSegment === "number" ? [] : {};
      }
      cursor = cursor[segment];
      continue;
    }

    if (!isObject(cursor)) {
      return root;
    }

    if (cursor[segment] === undefined || cursor[segment] === null) {
      cursor[segment] = typeof nextSegment === "number" ? [] : {};
    }
    cursor = cursor[segment];
  }

  const lastSegment = path[path.length - 1];
  if (typeof lastSegment === "number") {
    if (!Array.isArray(cursor)) return root;
    cursor[lastSegment] = nextValue;
  } else {
    if (!isObject(cursor)) return root;
    cursor[lastSegment] = nextValue;
  }

  return draft as T;
}

function removeArrayItemAtPath<T>(root: T, path: PathSegment[], index: number): T {
  const current = getAtPath(root, path);
  if (!Array.isArray(current)) return root;

  const next = current.filter((_, currentIndex) => currentIndex !== index);
  return setAtPath(root, path, next);
}

function createEmptyFromTemplate(template: unknown): unknown {
  if (Array.isArray(template)) {
    return [];
  }

  if (isObject(template)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = createEmptyFromTemplate(value);
    }
    return result;
  }

  if (typeof template === "boolean") return false;
  if (typeof template === "number") return 0;
  return "";
}

function appendArrayItemAtPath<T>(
  root: T,
  defaultsRoot: unknown,
  path: PathSegment[]
): T {
  const current = getAtPath(root, path);
  if (!Array.isArray(current)) return root;

  const defaultValue = getAtPath(defaultsRoot, path);
  const defaultTemplate = Array.isArray(defaultValue) ? defaultValue[0] : undefined;
  const fallbackTemplate = current.length > 0 ? current[current.length - 1] : defaultTemplate;
  const nextItem =
    fallbackTemplate === undefined
      ? ""
      : createEmptyFromTemplate(fallbackTemplate);

  return setAtPath(root, path, [...current, nextItem]);
}

function shouldUseTextarea(key: string, value: string): boolean {
  if (value.includes("\n")) return true;
  if (value.length > 140) return true;
  return /description|subtitle|answer|quote|bio|message|text|paragraph|hint|results|challenge|solution/i.test(
    key
  );
}

function isLikelyImageField(key: string, value: string): boolean {
  if (!value) return false;
  return /image|poster|logo|artwork|thumbnail|hero|gallery|src|url/i.test(key);
}

export default function MarketingContentEditor({
  token,
  mediaUrls = [],
}: MarketingContentEditorProps) {
  const [content, setContent] = useState<MarketingPagesContent>(
    defaultMarketingPagesContent
  );
  const [selectedPage, setSelectedPage] = useState<PageKey>("about");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/cms/marketing", {
          cache: "no-store",
        });
        const payload = await response.json();
        if (payload?.content) {
          setContent(payload.content as MarketingPagesContent);
        }
        setConfigured(Boolean(payload?.configured));
      } catch (error) {
        setStatus(
          error instanceof Error ? error.message : "Failed to load marketing content"
        );
      } finally {
        setLoading(false);
      }
    }

    void loadContent();
  }, []);

  const pageContent = useMemo(() => content[selectedPage], [content, selectedPage]);

  const setPageValue = (path: PathSegment[], value: unknown) => {
    setContent((previous) =>
      setAtPath(previous, [selectedPage, ...path], value)
    );
  };

  const addArrayItem = (path: PathSegment[]) => {
    setContent((previous) =>
      appendArrayItemAtPath(
        previous,
        defaultMarketingPagesContent,
        [selectedPage, ...path]
      )
    );
  };

  const removeArrayItem = (path: PathSegment[], index: number) => {
    setContent((previous) =>
      removeArrayItemAtPath(previous, [selectedPage, ...path], index)
    );
  };

  const resetPage = () => {
    setContent((previous) => ({
      ...previous,
      [selectedPage]: deepClone(defaultMarketingPagesContent[selectedPage]),
    }));
    setStatus(`Reset ${keyLabel(selectedPage)} page to defaults.`);
  };

  const saveAllPages = async () => {
    if (!token.trim()) {
      setStatus("Enter CMS admin token before saving.");
      return;
    }

    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/cms/marketing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-cms-token": token.trim(),
        },
        body: JSON.stringify({ content }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to save marketing content");
      }

      setStatus("Saved marketing pages content.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const renderNode = (value: unknown, path: PathSegment[], depth = 0): JSX.Element => {
    const pathKey = path.join(".");
    const currentKey =
      path.length > 0 ? String(path[path.length - 1]) : keyLabel(selectedPage);

    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-text-muted">
              {keyLabel(currentKey)} ({value.length})
            </p>
            <button
              type="button"
              onClick={() => addArrayItem(path)}
              className="rounded-full border border-accent-amber/60 px-3 py-1 text-[11px] font-semibold text-accent-amber"
            >
              Add Item
            </button>
          </div>

          {value.map((item, index) => (
            <div
              key={`${pathKey}-${index}`}
              className="space-y-3 rounded-xl border border-background-tertiary bg-background/40 p-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-text-muted">
                  Item {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeArrayItem(path, index)}
                  className="rounded-full border border-red-400/50 px-2.5 py-1 text-[11px] font-semibold text-red-300"
                >
                  Remove
                </button>
              </div>
              {renderNode(item, [...path, index], depth + 1)}
            </div>
          ))}

          {value.length === 0 && (
            <p className="rounded-lg border border-dashed border-background-tertiary p-3 text-xs text-text-muted">
              No items yet.
            </p>
          )}
        </div>
      );
    }

    if (isObject(value)) {
      const entries = Object.entries(value);
      return (
        <div className={depth > 0 ? "space-y-3" : "space-y-4"}>
          {entries.map(([entryKey, entryValue]) => {
            const childPath = [...path, entryKey];
            return (
              <div
                key={childPath.join(".")}
                className="rounded-xl border border-background-tertiary bg-background/30 p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    {keyLabel(entryKey)}
                  </p>
                </div>
                {renderNode(entryValue, childPath, depth + 1)}
              </div>
            );
          })}

          {entries.length === 0 && (
            <p className="rounded-lg border border-dashed border-background-tertiary p-3 text-xs text-text-muted">
              Empty object.
            </p>
          )}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <label className="mt-1 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => setPageValue(path, event.target.checked)}
          />
          Enabled
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(event) => setPageValue(path, Number(event.target.value))}
          className="w-full rounded-lg border border-background-tertiary bg-background px-3 py-2 text-sm"
        />
      );
    }

    const stringValue = typeof value === "string" ? value : "";
    const inputKey = String(path[path.length - 1] || "value");
    const useTextarea = shouldUseTextarea(inputKey, stringValue);
    const showPreview = isLikelyImageField(inputKey, stringValue);

    return (
      <div className="space-y-2">
        {useTextarea ? (
          <textarea
            value={stringValue}
            onChange={(event) => setPageValue(path, event.target.value)}
            rows={4}
            className="w-full rounded-lg border border-background-tertiary bg-background px-3 py-2 text-sm"
          />
        ) : (
          <input
            value={stringValue}
            onChange={(event) => setPageValue(path, event.target.value)}
            className="w-full rounded-lg border border-background-tertiary bg-background px-3 py-2 text-sm"
          />
        )}

        {mediaUrls.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPageValue(path, mediaUrls[0])}
              className="rounded-full border border-accent-amber/60 px-3 py-1 text-[11px] font-semibold text-accent-amber"
            >
              Use Latest Upload
            </button>
            <span className="text-[11px] text-text-muted">
              Upload in Media Library, then apply here.
            </span>
          </div>
        )}

        {showPreview && (
          <div className="relative h-32 overflow-hidden rounded-lg border border-background-tertiary bg-background-secondary/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stringValue}
              alt={inputKey}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-background-tertiary bg-background-secondary/60 p-6">
        <h2 className="mb-2 font-heading text-2xl font-semibold">
          Site Pages CMS
        </h2>
        <p className="text-sm text-text-muted">Loading marketing pages...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-background-tertiary bg-background-secondary/60 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Site Pages CMS</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Edit copy and imagery across About, Brands, Creators, Studio, and Contact.
          </p>
          <p className="mt-2 text-xs text-text-muted">
            Backend status: {configured ? "Supabase connected" : "Supabase not configured"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetPage}
            className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold text-red-300"
          >
            Reset Page
          </button>
          <button
            type="button"
            onClick={saveAllPages}
            disabled={saving}
            className="rounded-full bg-accent-amber px-5 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Site Pages"}
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {PAGE_OPTIONS.map((page) => (
          <button
            key={page.key}
            type="button"
            onClick={() => setSelectedPage(page.key)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              selectedPage === page.key
                ? "bg-accent-amber text-white"
                : "border border-background-tertiary text-text-secondary hover:border-accent-amber/50 hover:text-white"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">{renderNode(pageContent, [])}</div>
      {status && <p className="mt-4 text-sm text-accent-amber">{status}</p>}
    </section>
  );
}
