import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE, BRAND } from "@/lib/constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trytribes.com"),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: "Tribes™ | Share Resources & Build Community With Your Neighbors",
    description: SITE.description,
    url: SITE.url,
    siteName: "Tribes",
    type: "website",
    images: [
      {
        url: BRAND.logos.primaryDark,
        width: 1200,
        height: 630,
        alt: "Tribes - Share Resources & Build Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribes™ | Share Resources & Build Community",
    description: SITE.description,
    images: [BRAND.logos.primaryDark],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  other: {
    "theme-color": "#103730",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://ktboxzgxzbjajngatuho.supabase.co" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
