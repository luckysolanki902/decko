import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// Applied before first paint so the page never flashes the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(d?'dark':'light')}catch(e){}})();`;

const DESCRIPTION =
  'Free, in-depth engineering courses in Web Development, Go, Machine Learning, DSA, React Native and Data Analytics, written to be understood on the first read with retrieval practice that makes them stick.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "decko: courses that actually stick",
    template: "%s | decko",
  },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  keywords: [
    'learn to code', 'web development course', 'golang course', 'machine learning course',
    'dsa in c++', 'react native course', 'data analytics', 'spaced repetition',
    'retrieval practice', 'free programming course', 'self study',
  ],
  applicationName: 'decko',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'education',
  referrer: 'origin-when-cross-origin',
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'decko',
    title: 'decko: courses that actually stick',
    description: DESCRIPTION,
    images: [{ url: '/og/site/course/home', width: 1200, height: 630, alt: 'decko: courses you actually remember' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'decko: courses that actually stick',
    description: DESCRIPTION,
    images: ['/og/site/course/home'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SeoJsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description: DESCRIPTION,
          inLanguage: 'en',
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
