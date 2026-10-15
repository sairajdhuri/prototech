import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { company } from "@/lib/company";
import { siteUrl } from "@/lib/seo";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const manrope = localFont({ src: "../../public/fonts/manrope-latin.woff2", variable: "--font-manrope", display: "swap", weight: "400 700" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Prototech | Precision PCB Manufacturing in Pune", template: "%s | Prototech" },
  description: "Professional-grade printed circuit boards, manufactured in Pune since 1999. Double-sided and multilayer PCBs up to 12 layers.",
  applicationName: "Prototech", robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f8fa" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org", "@type": "Organization", name: company.name, url: siteUrl,
    email: company.email, telephone: company.phone, foundingDate: "1999", logo: `${siteUrl}/media/original/logo.webp`,
    address: { "@type": "PostalAddress", streetAddress: "Shed No. 2, S.R. No. 44/27, Renuka Industrial Estate, Pari Company Road, Narhe", addressLocality: "Pune", postalCode: "411041", addressRegion: "Maharashtra", addressCountry: "IN" },
  };
  return <html lang="en" className={manrope.variable} data-scroll-behavior="smooth"><head><link rel="preconnect" href="https://img1.wsimg.com" /></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><MotionProvider><Header /><main id="main">{children}</main><Footer /></MotionProvider></body></html>;
}
