"use client";

import { useState } from "react";
import Link from "next/link";
import { evaluate, type CheckerAnswers, type LawResult, type LawStatus } from "@/lib/laws";
import WaitlistForm from "@/components/WaitlistForm";

interface Question {
  key: keyof CheckerAnswers;
  text: string;
  help: string;
}

const QUESTIONS: Question[] = [
  {
    key: "publish",
    text: "Do you publish AI-generated or AI-assisted content online?",
    help: "Text, images, audio, or video where AI did meaningful creative work. Routine tool use like spell check does not count.",
  },
  {
    key: "sponsored",
    text: "Is any of that content sponsored, an ad, or affiliate-linked?",
    help: "Paid partnerships, gifted products, endorsements, testimonials, reviews, or posts with affiliate links.",
  },
  {
    key: "humanReview",
    text: "Does a person substantively review and edit AI-written text before it goes live?",
    help: "Real editorial review where someone takes responsibility for the content. Skimming or spell-checking does not qualify.",
  },
  {
    key: "euAudience",
    text: "Can people in the EU access your published content?",
    help: "A public website or public social account is usually accessible from the EU unless you geo-restrict it.",
  },
  {
    key: "deepfakes",
    text: "Do you publish realistic AI images, audio, or video of real people, places, or events?",
    help: "Content a reasonable person could mistake for authentic, sometimes called deepfakes.",
  },
  {
    key: "nyAds",
    text: "Do you run ads featuring AI-generated human-like performers that could reach New York?",
    help: "Synthetic spokespeople, AI avatars, or cloned voices in advertising. Online ads usually reach New York.",
  },
  {
    key: "chatbot",
    text: "Do you use a chatbot that talks to customers to sell or influence a purchase?",
    help: "Website chat widgets, SMS bots, or AI sales assistants that interact with the public.",
  },
  {
    key: "bigProvider",
    text: "Do you operate your own public generative AI system with over 1 million monthly users?",
    help: "This means you built and run the AI system itself. Using ChatGPT or Midjourney does not make you a provider.",
  },
];

const STATUS_STYLES: Record<LawStatus, { pill: string; label: string; ring: string }> = {
  action: {
    pill: "bg-amber-100 text-amber-900",
    label: "Action needed",
    ring: "border-amber-300",
  },
  watch: {
    pill: "bg-sky-100 text-sky-900",
    label: "Worth watching",
    ring: "border-sky-200",
  },
  clear: {
    pill: "bg-emerald-100 text-emerald-900",
    label: "Probably not you",
    ring: "border-emerald-200",
  },
};

export default function CheckerClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<CheckerAnswers>>({});
  const [results, setResults] = useState<LawResult[] | null>(null);

  const answer = (value: boolean) => {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);

    // If they do not publish AI content at all, skip straight to results.
    if (q.key === "publish" && !value) {
      const filled: CheckerAnswers = {
        publish: false,
        sponsored: false,
        humanReview: false,
        euAudience: false,
        deepfakes: false,
        nyAds: next.nyAds ?? false,
        chatbot: next.chatbot ?? false,
        bigProvider: next.bigProvider ?? false,
      };
      // Still ask the three questions that apply even without published content.
      setStep(5);
      setAnswers(filled);
      return;
    }

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      const filled: CheckerAnswers = {
        publish: next.publish ?? false,
        sponsored: next.sponsored ?? false,
        humanReview: next.humanReview ?? false,
        euAudience: next.euAudience ?? false,
        deepfakes: next.deepfakes ?? false,
        nyAds: next.nyAds ?? false,
        chatbot: next.chatbot ?? false,
        bigProvider: next.bigProvider ?? false,
      };
      setResults(evaluate(filled));
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  if (results) {
    const actions = results.filter((r) => r.status === "action").length;
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Your results
          </h2>
          <p className="mt-2 text-slate-600">
            {actions === 0
              ? "Nothing needs immediate action based on your answers. Keep an eye on the items marked worth watching."
              : `${actions} ${actions === 1 ? "law needs" : "laws need"} action based on your answers. Each card below tells you exactly what to do and links the official text.`}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            This is educational information based on the law texts linked below,
            current as of July 2026. It is not legal advice. Rules change, and your
            situation may differ. Confirm with the official sources or a lawyer.
          </p>
        </div>

        {results.map((r) => {
          const s = STATUS_STYLES[r.status];
          return (
            <div key={r.law.id} className={`rounded-2xl border ${s.ring} bg-white p-6`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.pill}`}>
                  {s.label}
                </span>
                <span className="text-sm font-medium text-slate-500">{r.law.shortName}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">
                {r.headline}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{r.detail}</p>
              {r.status === "action" && (
                <ul className="mt-3 space-y-1.5">
                  {r.law.requires.map((req, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 text-emerald-600">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}
              {r.sampleDisclosure && (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Example disclosure you could adapt
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-800">
                    {r.sampleDisclosure}
                  </p>
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <a
                  href={r.law.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
                >
                  Read the official text: {r.law.officialLabel}
                </a>
                <span className="text-slate-400">Penalty: {r.law.penalty}</span>
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="font-display text-xl font-bold text-slate-900">
            Want the full version to write these for you?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            We are building the full AI Policy File: platform-ready disclosure text for
            every channel you publish on (captions, video overlays, blog footers, chatbot
            greetings), a site-wide AI disclosure policy page, and update alerts when any
            of these laws change. Join the founding list and lock in founding-member
            pricing.
          </p>
          <div className="mt-4">
            <WaitlistForm source="checker" />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={restart}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Start over
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-indigo-600" : "bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
      <h2 className="font-display text-xl font-semibold leading-snug text-slate-900">
        {q.text}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{q.help}</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => answer(true)}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Yes
        </button>
        <button
          onClick={() => answer(false)}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          No
        </button>
      </div>
    </div>
  );
}
