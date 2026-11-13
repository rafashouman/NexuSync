import type { Metadata } from "next";

const previewImage = "/images/site-preview-desktop.webp";

export function nexuSyncMetadata({
  title,
  description,
  path,
  image = previewImage,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
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
