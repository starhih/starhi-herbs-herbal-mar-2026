import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Star Hi Herbs | Global Herbal Extract Manufacturer & Exporter',
  description: 'Get in touch with Star Hi Herbs, a leading herbal extract manufacturer and exporter globally. Contact our Bangalore-based manufacturing team for B2B nutraceutical quotes.',
  keywords: 'contact Star Hi Herbs, herbal extract manufacturer and exporter in bangalore, top herbal extract manufacturer and exporter in india, b2b herbal extracts contact, nutraceutical supplier india',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Star Hi Herbs | Global Herbal Extract Manufacturer & Exporter',
    description: 'Get in touch with Star Hi Herbs, a leading herbal extract manufacturer and exporter globally. Contact our Bangalore-based manufacturing team for B2B nutraceutical quotes.',
    url: '/contact',
    siteName: 'Star Hi Herbs',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Star Hi Herbs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Star Hi Herbs | Global Herbal Extract Manufacturer & Exporter',
    description: 'Get in touch with Star Hi Herbs, a leading herbal extract manufacturer and exporter globally. Contact our Bangalore-based manufacturing team for B2B nutraceutical quotes.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://starhiherbs.com/contact"
          },
          url: "https://starhiherbs.com/contact",
          name: "Contact Star Hi Herbs Pvt Ltd",
          description: "Get in touch with Star Hi Herbs for premium herbal extracts and B2B nutraceutical solutions.",
          publisher: {
            "@id": "https://starhiherbs.com/#organization"
          }
        }}
      />
      {children}
    </>
  );
}
