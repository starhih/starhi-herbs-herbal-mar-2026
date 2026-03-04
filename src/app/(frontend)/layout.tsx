import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import { montserrat, nunitoSans } from './fonts';
import '@/lib/error-suppression';

export const metadata: Metadata = {
  metadataBase: new URL('https://starhiherbs.com'),
  title: 'Star Hi Herbs | Innovating Herbal Solutions for a Healthier Tomorrow',
  description: 'Global B2B manufacturer of herbal extracts, probiotics, branded ingredients, and nutraceutical solutions.',
  keywords: 'herbal extracts, probiotics, nutraceuticals, organic extracts, herbal solutions, b2b herbs',
  icons: {
    icon: '/images/starhiherbs-favicon.jpg',
    apple: '/images/starhiherbs-favicon.jpg',
  },
  openGraph: {
    title: 'Star Hi Herbs | Innovating Herbal Solutions for a Healthier Tomorrow',
    description: 'Global B2B manufacturer of herbal extracts, probiotics, branded ingredients, and nutraceutical solutions.',
    url: '/',
    siteName: 'Star Hi Herbs',
    images: [
      {
        url: 'https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs - Herbal Extracts and Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Star Hi Herbs | Innovating Herbal Solutions for a Healthier Tomorrow',
    description: 'Global B2B manufacturer of herbal extracts, probiotics, branded ingredients, and nutraceutical solutions.',
    images: ['https://images.pexels.com/photos/6693655/pexels-photo-6693655.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${nunitoSans.variable}`}>
      <head>
        {/* Preload critical assets */}
        <link
          rel="preconnect"
          href="https://images.pexels.com"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/images/starhiherbs-favicon.jpg" />
        <link rel="apple-touch-icon" href="/images/starhiherbs-favicon.jpg" />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Analytics
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
          microsoftClarityId={process.env.NEXT_PUBLIC_CLARITY_ID}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
