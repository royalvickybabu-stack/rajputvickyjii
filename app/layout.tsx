import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lokmachan.in"),
  title: {
    default: "लोक मचान | हिंदी न्यूज़",
    template: "%s | लोक मचान",
  },
  description:
    "लोक मचान पर पढ़ें ताज़ा हिंदी समाचार, स्थानीय खबरें और देश-दुनिया की अहम अपडेट। आपकी आवाज़, हमारा मंच।",
  applicationName: "लोक मचान",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://www.lokmachan.in/",
    siteName: "लोक मचान",
    title: "लोक मचान | हिंदी न्यूज़",
    description:
      "ताज़ा हिंदी समाचार, स्थानीय खबरें और देश-दुनिया की अहम अपडेट।",
  },
  twitter: {
    card: "summary_large_image",
    title: "लोक मचान | हिंदी न्यूज़",
    description:
      "ताज़ा हिंदी समाचार, स्थानीय खबरें और देश-दुनिया की अहम अपडेट।",
  },
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google AdSense verification code */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6867912638299432"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VTCY1YFW88"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VTCY1YFW88');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}