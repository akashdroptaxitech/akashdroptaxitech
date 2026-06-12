import type { Metadata } from "next";
 import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const siteName = "Akash Drop Taxi – Tamil Nadu Intercity Cabs";
const siteUrl = "https://your-vercel-domain.vercel.app";
const siteDescription =
  "Akash Drop Taxi offers one-way and round-trip intercity taxi service across Tamil Nadu, Andhra Pradesh, Karnataka and Kerala with clean AC cabs, professional drivers and transparent distance-based pricing.";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: "%s | Akash Drop Taxi",
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: "Akash Drop Taxi",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/logo-car.png", width: 788, height: 310, alt: "Akash Drop Taxi" }],
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

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#070606" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Akash Drop Taxi",
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
        className={`${inter.variable} ${outfit.variable} ${playfair.variable} min-h-dvh bg-white antialiased`}
      >
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""}
        />
        {children}
      </body>
    </html>
  );
}
