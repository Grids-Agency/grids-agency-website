import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { getLocale } from "next-intl/server";
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
  title: "Grids Agency [그리즈 에이전시]",
  description:
    "서울대학교 컴퓨터공학부 기술진의 전문적인 프로그램 개발. 웹사이트, 시스템, 앱, 자동화. 모든것을 만들어드립니다.",
  openGraph: {
    title: "Grids Agency [그리즈 에이전시]",
    description:
      "서울대학교 컴퓨터공학부 기술진의 전문적인 프로그램 개발. 웹사이트, 시스템, 앱, 자동화. 모든것을 만들어드립니다.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grids Agency",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="[scrollbar-gutter:stable]" suppressHydrationWarning>
      <head>
        {/* Reset before next-themes initializes so refreshes start in dark mode. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try { localStorage.setItem('theme', 'dark'); } catch {}`,
          }}
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-4TFWB7JM6W"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4TFWB7JM6W');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
