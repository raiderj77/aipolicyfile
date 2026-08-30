export const GA4_MEASUREMENT_ID = "G-MEY1Y9KDNJ";

export const GA4_CONFIG = Object.freeze({
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});

export const ANALYTICS_CONSENT_DEFAULT = Object.freeze({
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  personalization_storage: "denied",
  functionality_storage: "granted",
  security_storage: "granted",
});

export const ANALYTICS_CONSENT_GRANTED = Object.freeze({
  ...ANALYTICS_CONSENT_DEFAULT,
  analytics_storage: "granted",
});

export const ANALYTICS_CONSENT_WITHDRAWN = Object.freeze({
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
});

export function createGtagCommandQueue(dataLayer: IArguments[]) {
  return function gtag() {
    // Google documents gtag commands as Arguments objects, not rest-parameter arrays.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
}

function sanitizeAnalyticsReferrer(pageReferrer: string) {
  if (!pageReferrer) return undefined;

  try {
    const url = new URL(pageReferrer);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

export function buildAnalyticsPageContext(pageUrl: string, pageReferrer = "") {
  const url = new URL(pageUrl);
  const sanitizedReferrer = sanitizeAnalyticsReferrer(pageReferrer);

  return {
    page_location: `${url.origin}${url.pathname}`,
    page_path: url.pathname,
    page_referrer: sanitizedReferrer ?? "",
  };
}

export function buildAnalyticsPageView(pageUrl: string, pageTitle: string, pageReferrer = "") {
  return {
    ...buildAnalyticsPageContext(pageUrl, pageReferrer),
    page_title: pageTitle,
  };
}
