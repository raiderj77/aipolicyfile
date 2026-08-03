import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        This page is not available
      </h1>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-700">
        The address may be outdated or the resource may have been withdrawn for review. Use the
        current law tracker or run the educational checker instead.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/tracker"
          className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Open the law tracker
        </Link>
        <Link
          href="/checker"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Run the free checker
        </Link>
      </div>
    </div>
  );
}
