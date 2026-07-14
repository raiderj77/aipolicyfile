import Link from "next/link";
import { LAWS } from "@/lib/laws";
import { LAW_PAGE_SLUGS } from "@/lib/lawPageSlugs";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  const laws = Object.values(LAWS);
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-16 sm:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Five AI disclosure frameworks reviewed from official sources
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find the AI disclosure rules worth reviewing, in two minutes.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          If you publish AI-assisted content, run ads, or use a chatbot, these
          federal, EU, New York, and California frameworks may deserve review.
          Answer eight yes-or-no questions to identify possible relevance and
          open every official text. The checker does not make a legal conclusion.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/checker"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700"
          >
            Run the free check
          </Link>
          <span className="text-sm text-slate-500">
            Free. No signup. Nothing stored.
          </span>
        </div>
      </section>

      {/* Law cards */}
      <section id="laws" className="scroll-mt-8 py-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          The five laws the checker covers
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Every card links the official text. Last reviewed July 13, 2026.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {laws.map((law) => (
            <div key={law.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                {law.shortName}
              </h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {law.effective}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {law.whoItHits}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">Penalty:</span>{" "}
                {law.penalty}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link
                  href={`/laws/${LAW_PAGE_SLUGS[law.id]}`}
                  className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
                >
                  Plain-English guide
                </Link>
                <a
                  href={law.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-500 underline underline-offset-2 hover:text-slate-700"
                >
                  {law.officialLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          How the checker works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Answer 8 yes-or-no questions",
              body: "About what you publish, where your audience is, and how you use AI. No email, no account.",
            },
            {
              step: "2",
              title: "Get a card per law",
              body: "Possible relevance, monitor, or lower apparent relevance. Each card explains which facts are worth reviewing.",
            },
            {
              step: "3",
              title: "Copy the sample disclosures",
              body: "Every action card includes example disclosure wording you can adapt, plus a link to the official law text.",
            },
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-display text-sm font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section className="py-12">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            The full AI Policy File is coming
          </h2>
          <p className="mt-3 max-w-2xl text-slate-700">
            Platform-ready disclosure text for every channel you publish on, a
            site-wide AI disclosure policy page, and an alert when any of these
            laws change. Join the founding list to lock in founding-member pricing
            and tell us what it is worth to you.
          </p>
          <div className="mt-6">
            <WaitlistForm source="home" />
          </div>
        </div>
      </section>
    </div>
  );
}
