"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ANALYTICS_CONSENT_DEFAULT,
  ANALYTICS_CONSENT_GRANTED,
  ANALYTICS_CONSENT_WITHDRAWN,
  buildAnalyticsPageContext,
  buildAnalyticsPageView,
  createGtagCommandQueue,
  GA4_CONFIG,
  GA4_MEASUREMENT_ID,
} from "@/lib/analytics";

type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "aipolicyfile:analytics-consent";
const SCRIPT_ID = "aipolicyfile-google-analytics";
const CONSENT_DEFAULT_KEY = "aipolicyfile:analytics-consent-defaulted";
const CONFIGURED_KEY = "aipolicyfile:analytics-configured";

function ensureAnalyticsQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || createGtagCommandQueue(window.dataLayer);
}

function prepareDeniedConsentDefault() {
  ensureAnalyticsQueue();
  const analyticsWindow = window as typeof window & Record<string, unknown>;
  if (analyticsWindow[CONSENT_DEFAULT_KEY]) return;

  window.gtag?.("consent", "default", ANALYTICS_CONSENT_DEFAULT);
  analyticsWindow[CONSENT_DEFAULT_KEY] = true;
}

function setDisabled(disabled: boolean) {
  (window as typeof window & Record<string, unknown>)[`ga-disable-${GA4_MEASUREMENT_ID}`] = disabled;
}

function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name && (name === "_ga" || name.startsWith("_ga_"))));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${window.location.hostname}; SameSite=Lax`;
  }
}

function queuePageView() {
  const pageContext = buildAnalyticsPageContext(window.location.href, document.referrer);
  window.gtag?.("set", pageContext);
  window.gtag?.(
    "event",
    "page_view",
    buildAnalyticsPageView(window.location.href, document.title, document.referrer),
  );
}

function enableAnalytics() {
  setDisabled(false);
  prepareDeniedConsentDefault();
  window.gtag?.("consent", "update", ANALYTICS_CONSENT_GRANTED);
  const analyticsWindow = window as typeof window & Record<string, unknown>;
  if (!analyticsWindow[CONFIGURED_KEY]) {
    window.gtag?.("js", new Date());
    const initialPageContext = buildAnalyticsPageContext(window.location.href, document.referrer);
    window.gtag?.("set", initialPageContext);
    window.gtag?.("config", GA4_MEASUREMENT_ID, GA4_CONFIG);
    analyticsWindow[CONFIGURED_KEY] = true;
  }

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

function disableAnalytics() {
  window.gtag?.("consent", "update", ANALYTICS_CONSENT_WITHDRAWN);
  setDisabled(true);
  clearAnalyticsCookies();
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null | "loading">("loading");
  const [showChoices, setShowChoices] = useState(false);
  const lastPath = useRef<string | null>(null);
  const choicesRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDisabled(true);
      prepareDeniedConsentDefault();
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        setConsent(stored === "granted" || stored === "denied" ? stored : null);
      } catch {
        setConsent(null);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    enableAnalytics();
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    if (lastPath.current !== pathname) {
      queuePageView();
      lastPath.current = pathname;
    }
  }, [consent, pathname]);

  useEffect(() => {
    if (showChoices && consent !== null) choicesRef.current?.focus();
  }, [consent, showChoices]);

  function choose(next: Consent) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The current page can still honor the visitor's choice.
    }
    if (next === "denied") disableAnalytics();
    setConsent(next);
    setShowChoices(false);
  }

  if (consent === "loading") return null;

  if (consent !== null && !showChoices) {
    return (
      <button
        type="button"
        onClick={() => setShowChoices(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        Privacy choices
      </button>
    );
  }

  return (
    <section
      ref={choicesRef}
      role="region"
      aria-labelledby="analytics-choices-title"
      tabIndex={-1}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-slate-300 bg-white p-5 text-slate-900 shadow-2xl"
    >
      <p id="analytics-choices-title" className="font-bold">Optional, privacy-limited analytics</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        If you allow it, Google Analytics processes a manually sent page title, URL path, and
        referrer with query strings and fragments removed, plus standard session, browser and
        operating-system name, broad device category, language, and country or region data.
        Enhanced Measurement and granular location/device collection are off. Site code does not
        send checker answers, results, or form-field values; Google Signals, user-provided data, and
        advertising personalization are disabled.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-lg border border-slate-400 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Continue without analytics
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          Allow analytics
        </button>
        <a className="self-center text-sm font-semibold underline" href="/privacy">
          Privacy details
        </a>
      </div>
    </section>
  );
}
