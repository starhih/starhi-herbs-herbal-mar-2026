import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import B2BDisclaimerModal from '@/components/B2BDisclaimerModal';
import Analytics from '@/components/Analytics';
import { montserrat, nunitoSans } from './fonts';
import '@/lib/error-suppression';
import DisableRightClick from '@/components/DisableRightClick';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://starhiherbs.com'),
  title: 'Star Hi Herbs | Top Herbal Extract Manufacturer & Exporter in India & Bangalore',
  description: 'Star Hi Herbs is the world\'s largest manufacturer and exporter of Coleus extract and Sesamin extract. We are a leading herbal extract manufacturer and exporter based in Bangalore, India, supplying premium B2B nutraceuticals.',
  keywords: 'herbal extract manufacturer and exporter in india, herbal extract manufacturer and exporter in bangalore, top herbal extract manufacturer and exporter in india, Coleus manufacturer and exporter in india, Sesamin extract manufacturer and exporter in the world, herbal extracts, probiotics, nutraceuticals, organic extracts, herbal solutions, b2b herbs',
  icons: {
    icon: '/images/starhiherbs-favicon.jpg',
    apple: '/images/starhiherbs-favicon.jpg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Star Hi Herbs | Top Herbal Extract Manufacturer & Exporter in India',
    description: 'Star Hi Herbs is the world\'s largest manufacturer and exporter of Coleus extract and Sesamin extract. We are a leading herbal extract manufacturer and exporter based in Bangalore, India.',
    url: '/',
    siteName: 'Star Hi Herbs',
    images: [
      {
        url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
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
    title: 'Star Hi Herbs | Top Herbal Extract Manufacturer & Exporter in India',
    description: 'Star Hi Herbs is the world\'s largest manufacturer and exporter of Coleus extract and Sesamin extract. We are a leading herbal extract manufacturer and exporter based in Bangalore, India.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://starhiherbs.com/#organization',
  name: 'Star Hi Herbs',
  url: 'https://starhiherbs.com',
  logo: 'https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg',
  description: 'Star Hi Herbs is the world\'s largest manufacturer and exporter of Coleus extract and Sesamin extract. We are recognized as the top herbal extract manufacturer and exporter in Bangalore, India, providing globally certified B2B organic extracts.',
  telephone: '+91 98 8642 2452',
  email: 'starhi@starhiherbs.com',
  sameAs: [
    'https://in.linkedin.com/company/star-hi-herbs-pvt-ltd',
    'https://www.facebook.com/StarHiHerbsNaturalExtracts/',
    'https://www.instagram.com/star.hi.herbs/'
  ],
  address: {
    '@type': 'PostalAddress',
    'streetAddress': 'Plot #50, 3rd Road, 1st Phase, K.I.A.D.B. Industrial Area, Jigani',
    'addressLocality': 'Bangalore',
    'addressRegion': 'Karnataka',
    'postalCode': '560105',
    'addressCountry': 'IN'
  },
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'ISO 22000:2018 Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'WHO GMP Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'FSSC 22000 Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'Halal Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'Kosher Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'USDA Organic Certification',
      'credentialCategory': 'certification'
    },
    {
      '@type': 'EducationalOccupationalCredential',
      'name': 'EU Organic Certification',
      'credentialCategory': 'certification'
    }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91 98 8642 2452',
    contactType: 'customer service',
    email: 'starhi@starhiherbs.com',
    areaServed: 'Worldwide',
    availableLanguage: ['en']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${nunitoSans.variable}`}>
      <head>
        {/* Preconnect and dns-prefetch to critical CDNs for LCP optimization */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />

        {/* Preload critical assets */}
        <link rel="icon" href="/images/starhiherbs-favicon.jpg" />
        <link rel="apple-touch-icon" href="/images/starhiherbs-favicon.jpg" />
        <JsonLd data={organizationSchema} />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <Analytics
          googleAnalyticsId={process.env.NEXT_PUBLIC_GA_ID}
          microsoftClarityId={process.env.NEXT_PUBLIC_CLARITY_ID || "sc218vcedl"}
        />
        <DisableRightClick />
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
          <B2BDisclaimerModal />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
