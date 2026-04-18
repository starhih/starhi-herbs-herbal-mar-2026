import { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Star Hi Herbs | Global Herbal Extract Manufacturer',
  description: 'Get in touch with Star Hi Herbs, a leading herbal extract manufacturer globally. Contact our Bangalore-based manufacturing team for B2B nutraceutical quotes.',
  keywords: 'contact Star Hi Herbs, herbal extract manufacturer in bangalore, top herbal extract manufacturer in india, b2b herbal extracts contact, nutraceutical supplier india',
  alternates: {
    canonical: '/contact',
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
