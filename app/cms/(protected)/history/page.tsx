"use client";

import { useEffect, useState } from "react";
import { useCmsApi } from "@/components/cms/useCmsApi";

type HistoryItem = {
  id: string;
  message: string;
  createdAt: string;
  entityKey: string | null;
  action: string;
  actorLabel: string;
};

export default function CmsHistoryPage() {
  const { requestJson } = useCmsApi();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setStatus("");
      try {
        const response = await requestJson<{ items: HistoryItem[] }>(
          "/api/cms/history?limit=120"
        );
        if (!active) return;
        setItems(response.items || []);
      } catch (error) {
        if (!active) return;
        setStatus(
          error instanceof Error ? error.message : "Failed to load history."
        );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [requestJson]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">History</h1>
        <p className="mt-1 text-sm text-slate-400">
          Human-readable audit timeline for content changes and publishing.
        </p>
      </header>

      {status ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-amber-200">
          {status}
        </section>
      ) : null}

      {loading ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          Loading history...
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-sm text-slate-400">No history events yet.</p>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-3"
              >
                <p className="text-sm text-slate-100">{item.message}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
