"use client";

import { useMemo, useState } from "react";

function safeStringify(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function JsonEditor({
  label,
  value,
  onApply,
  disabled,
  height = 360,
}: {
  label: string;
  value: unknown;
  onApply: (nextValue: unknown) => Promise<void> | void;
  disabled?: boolean;
  height?: number;
}) {
  const initial = useMemo(() => safeStringify(value), [value]);
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState("");

  const apply = async () => {
    try {
      setStatus("");
      const parsed = JSON.parse(draft) as unknown;
      await onApply(parsed);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Invalid JSON.");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <button
          type="button"
          onClick={() => setDraft(initial)}
          className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200"
          disabled={disabled}
        >
          Reset
        </button>
      </div>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        disabled={disabled}
        style={{ minHeight: `${height}px` }}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100"
      />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => void apply()}
          disabled={disabled}
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-50"
        >
          Apply JSON
        </button>
        {status ? <p className="text-xs text-amber-200">{status}</p> : null}
      </div>
    </div>
  );
}
