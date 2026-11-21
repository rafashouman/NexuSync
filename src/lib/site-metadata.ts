import type { Metadata } from "next";

const previewImage = "/images/og-nexusync.jpg";

export function nexuSyncMetadata({
  title,
  description,
  path,
  image = previewImage,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Keeps the page out of search results (links on it are still followed). */
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "NexuSync",
      url: path,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
