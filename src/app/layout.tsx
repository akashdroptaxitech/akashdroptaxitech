import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Akash DropTaxi Tech – Tamil Nadu Intercity Cabs";
const siteUrl = "https://your-vercel-domain.vercel.app";
const siteDescription =
  "Akash DropTaxi Tech offers premium one-way and round-trip taxi service across Tamil Nadu, Andhra Pradesh, Karnataka and Kerala with clean AC cabs, professional drivers and transparent distance-based pricing.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: "%s | Akash DropTaxi Tech",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: "Akash DropTaxi Tech",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Akash DropTaxi Tech",
    url: siteUrl,
    areaServed: [
      "Tamil Nadu",
      "Andhra Pradesh",
      "Karnataka",
      "Kerala",
    ],
    telephone: "+91-94436-11501",
    serviceType: ["One-way taxi", "Round-trip taxi", "Airport transfer"],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""}
        />
        {children}
      </body>
    </html>
  );
}
