import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://protomlb.in").replace(/\/$/, "");
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: { title: `${title} | Prototech`, description, url: `${siteUrl}${path}`, siteName: "Prototech", locale: "en_IN", type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Prototech. Printed circuit boards, manufactured in Pune." }] },
    twitter: { card: "summary_large_image", title: `${title} | Prototech`, description, images: ["/opengraph-image"] },
  };
}
