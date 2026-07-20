import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aipolicyfile.com"),
  title: {
    default: "AI Policy File - AI disclosure law checker for creators and small businesses",
    template: "%s | AI Policy File",
  },
  description:
    "Free educational checker that flags AI disclosure rules creators and small businesses may want to review, with links to official sources.",
  alternates: { canonical: "/" },
  verification: {
    google: "ozOeVL-jcqo8z6PPEKzQaXFENpf5nTXFOsPxEqfVUoU",
  },
  openGraph: {
    siteName: "AI Policy File",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="whitespace-nowrap font-display text-base font-bold tracking-tight sm:text-lg">
              AI Policy File
            </Link>
            <nav className="flex items-center gap-3 text-sm font-medium text-slate-600 sm:gap-5">
              <Link href="/#laws" className="hover:text-slate-900">
                The laws
              </Link>
              <Link href="/about" className="hover:text-slate-900">
                About
              </Link>
              <Link
                href="/checker"
                className="whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-700 sm:px-4"
              >
                Free checker
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <p className="text-sm text-slate-600">
              AI Policy File provides educational information about AI disclosure
              laws. It is not a law firm and nothing on this site is legal advice.
              For advice about your specific situation, consult a licensed attorney.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/disclaimer" className="hover:text-slate-900">Disclaimer</Link>
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              © {new Date().getFullYear()} AI Policy File. All rights reserved.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Built by{" "}
              <Link href="/about" className="underline hover:text-slate-900">
                Jason Ramirez
              </Link>
            </p>
          </div>
        </footer>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
