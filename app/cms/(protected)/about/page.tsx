import Link from "next/link";

const ENTITY = "marketing-pages";

export default function CmsAboutPage() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
        About Page
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        This content now lives in the {ENTITY} entity and is edited through the
        Advanced editor with draft and publish controls.
      </p>
      <Link
        href={`/cms/advanced?entity=${ENTITY}`}
        className="mt-4 inline-flex rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
      >
        Open Advanced Editor
      </Link>
    </section>
  );
}
