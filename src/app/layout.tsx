import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlayGoldWin – Latest Lottery Results",
  description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  keywords: ["PlayGoldWin", "lottery results", "daily draw", "winning numbers"],
  abstract: "PlayGoldWin provides accurate daily lottery results and draw timings.",
  openGraph: {
    title: "playgoldwin",
    type: "website",
    url: "https://playgolddwin.com",
    description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@playgoldwin",
    creator: "@playgoldwin",
    description: "Playgoldwin is your trusted source for the latest Playgoldwin lottery results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-C9V0RXZJ10" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-C9V0RXZJ10');
  `}
        </Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "PlayGoldWin Lottery Results",
              "url": "https://playgolddwin.com",
              "description": "Check today's PlayGoldWin lottery results, winning numbers, and draw schedule. Fast & accurate updates.",
              "publisher": {
                "@type": "Organization",
                "name": "PlayGoldWin",
                "url": "https://playgolddwin.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://playgolddwin.com/logo.png"
                }
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

      </body>
    </html>
  );
}
