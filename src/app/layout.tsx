import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { serializeJsonLd } from "@/lib/jsonLd";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteDescription =
  "Free educational checker that flags AI disclosure rules creators and small businesses may want to review, with links to official sources.";

export const metadata: Metadata = {
  metadataBase: new URL("https://aipolicyfile.com"),
  applicationName: "AI Policy File",
  title: {
    default: "AI Policy File - AI disclosure law checker for creators and small businesses",
    template: "%s | AI Policy File",
  },
  description: siteDescription,
  authors: [{ name: "Jason Ramirez", url: "/about" }],
  creator: "Jason Ramirez",
  publisher: "AI Policy File",
  category: "Legal education",
  alternates: { canonical: "/" },
  verification: {
    google: "ozOeVL-jcqo8z6PPEKzQaXFENpf5nTXFOsPxEqfVUoU",
  },
  openGraph: {
    title: "AI Policy File - source-linked AI disclosure law screening",
    description: siteDescription,
    url: "https://aipolicyfile.com",
    siteName: "AI Policy File",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AI Policy File - source-linked AI disclosure law screening",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Policy File - source-linked AI disclosure law screening",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  other: {
    "google-adsense-account": "ca-pub-7171402107622932",
  },
};

// Re-render static pages at least hourly so date-based source-review status can
// change without waiting for a new deployment.
export const revalidate = 3600;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://aipolicyfile.com/#organization",
        name: "AI Policy File",
        url: "https://aipolicyfile.com",
        email: "hello@aipolicyfile.com",
        founder: { "@id": "https://aipolicyfile.com/about#jason-ramirez" },
      },
      {
        "@type": "Person",
        "@id": "https://aipolicyfile.com/about#jason-ramirez",
        name: "Jason Ramirez",
        url: "https://aipolicyfile.com/about",
        jobTitle: "Site owner and maintainer",
      },
      {
        "@type": "WebSite",
        "@id": "https://aipolicyfile.com/#website",
        url: "https://aipolicyfile.com",
        name: "AI Policy File",
        description: siteDescription,
        inLanguage: "en-US",
        publisher: { "@id": "https://aipolicyfile.com/#organization" },
      },
    ],
  };

  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only z-[60] rounded-lg bg-white px-4 py-3 font-semibold text-indigo-700 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
        />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="whitespace-nowrap font-display text-base font-bold tracking-tight sm:text-lg">
              AI Policy File
            </Link>
            <nav aria-label="Primary" className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:gap-5 sm:text-sm">
              <Link href="/#laws" className="hidden min-h-11 items-center whitespace-nowrap hover:text-slate-900 sm:inline-flex">
                The laws
              </Link>
              <Link href="/about" className="inline-flex min-h-11 items-center whitespace-nowrap hover:text-slate-900">
                About
              </Link>
              <Link href="/starter-file" className="hidden min-h-11 items-center whitespace-nowrap hover:text-slate-900 md:inline-flex">
                $19 Starter File
              </Link>
              <Link
                href="/checker"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:px-4"
              >
                Free checker
              </Link>
            </nav>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <p className="text-sm text-slate-600">
              AI Policy File provides educational information about AI disclosure
              laws. It is not a law firm and nothing on this site is legal advice.
              For advice about your specific situation, consult a licensed attorney.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/#laws" className="hover:text-slate-900">The laws</Link>
              <Link href="/tracker" className="hover:text-slate-900">Law tracker</Link>
              <Link href="/starter-file" className="hover:text-slate-900">$19 Starter File</Link>
              <Link href="/editorial-standards" className="hover:text-slate-900">Editorial standards</Link>
              <Link href="/corrections" className="hover:text-slate-900">Corrections</Link>
              <Link href="/accessibility" className="hover:text-slate-900">Accessibility</Link>
              <Link href="/ai-transparency" className="hover:text-slate-900">AI transparency</Link>
              <Link href="/security" className="hover:text-slate-900">Security</Link>
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
