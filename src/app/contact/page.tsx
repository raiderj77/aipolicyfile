import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to reach AI Policy File.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
        Contact
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>
          Questions, corrections, or a law we should add to the checker? Email{" "}
          <a
            href="mailto:hello@aipolicyfile.com"
            className="text-indigo-700 underline underline-offset-2"
          >
            hello@aipolicyfile.com
          </a>
          .
        </p>
        <p>
          If you joined the founding list and want your submission deleted,
          email the same address from the address you signed up with. We may
          need to verify control of that address.
        </p>
        <p className="text-sm text-slate-600">
          We cannot answer questions about your specific legal situation. For
          that, consult a licensed attorney.
        </p>
      </div>
    </div>
  );
}
