import Link from "next/link";

export default function CmsAboutPage() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-100">About</h1>
      <p className="mt-2 text-sm text-slate-400">
        About content is stored inside the <strong className="text-slate-200">Marketing Pages</strong> entity.
        Use Advanced for full JSON editing while the dedicated form view is being completed.
      </p>
      <Link
        href="/cms/advanced?entity=marketing-pages"
        className="mt-4 inline-flex rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200"
      >
        Open Advanced Editor
      </Link>
    </section>
  );
}
