import type { Metadata } from "next";

const SITE_NAME = "AI Policy File";
const SITE_URL = "https://aipolicyfile.com";

export function pageSocialMetadata(
  title: string,
  description: string,
  path: `/${string}`,
): Pick<Metadata, "openGraph" | "twitter"> {
  const shareTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
