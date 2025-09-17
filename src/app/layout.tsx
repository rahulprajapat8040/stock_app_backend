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
  title: "Play Gold Win",
  description: "Play gold win, see your number result here with play gold win. play gold win",
  keywords: ["PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin", "PlayGoldWin",],
  robots: { index: true, follow: true },
  openGraph: {
    title: "playgoldwin",
    type: "website",
    url: "https://playgolddwin.com",
    description: "play gold win, see you number result, price"
  },
  twitter: {
    card: "summary_large_image",
    site: "@playgoldwin",
    creator: "@playgoldwin"
  }
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

      </body>
    </html>
  );
}
