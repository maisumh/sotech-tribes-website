import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: "Tribes™ | Share Resources & Build Community With Your Neighbors",
    description: SITE.description,
    url: SITE.url,
    siteName: "Tribes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tribes™ | Share Resources & Build Community",
    description: SITE.description,
  },
  icons: {
    icon: "https://ktboxzgxzbjajngatuho.supabase.co/storage/v1/object/public/brand-assets/611f4b15-3017-40d0-96b5-1f14208aef62/logos/favicon-light-bg.png",
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
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="preconnect" href="https://ktboxzgxzbjajngatuho.supabase.co" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap"
          rel="stylesheet"
        />
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
