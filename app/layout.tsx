import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FixedBackLink from "@/app/_components/FixedBackLink";
import JsonLd from "@/app/_components/seo/JsonLd";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SITE_NAME,
  buildCanonicalUrl,
  getSiteUrl,
} from "@/lib/seo/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: buildCanonicalUrl("/") }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    url: buildCanonicalUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: buildCanonicalUrl("/"),
              description: DEFAULT_SITE_DESCRIPTION,
              inLanguage: "en",
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: SITE_NAME,
              url: buildCanonicalUrl("/"),
              jobTitle: "Urban designer and spatial researcher",
              description: DEFAULT_SITE_DESCRIPTION,
            },
          ]}
        />
        {children}
        <FixedBackLink />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
