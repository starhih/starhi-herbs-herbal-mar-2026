import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SustainabilityImpact from '@/components/shared/SustainabilityImpact';
import { getPayloadClient } from '@/lib/payload';
import { mapCertification } from '@/lib/mappers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sustainability & CSR | Star Hi Herbs Ethical Manufacturing',
  description: 'Learn about Star Hi Herbs\' commitment to sustainability, contract farming, and organic extract production. We are a leading responsible manufacturer and exporter of herbal extracts.',
  keywords: 'sustainable herbal extraction, organic extract manufacturer and exporter india, contract farming herbs, ethical sourcing nutraceuticals, top herbal extract manufacturer and exporter in india, b2b organic extracts',
  alternates: {
    canonical: '/sustainability',
  },
  openGraph: {
    title: 'Sustainability & CSR | Star Hi Herbs Ethical Manufacturing',
    description: 'Learn about Star Hi Herbs\' commitment to sustainability, contract farming, and organic extract production. We are a leading responsible manufacturer and exporter of herbal extracts.',
    url: '/sustainability',
    siteName: 'Star Hi Herbs',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs Sustainability and CSR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sustainability & CSR | Star Hi Herbs Ethical Manufacturing',
    description: 'Learn about Star Hi Herbs\' commitment to sustainability, contract farming, and organic extract production. We are a leading responsible manufacturer and exporter of herbal extracts.',
    images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
  },
};
export default async function SustainabilityPage() {
  const payload = await getPayloadClient();
  const { docs: certDocs } = await payload.find({
    collection: 'certifications',
    limit: 100,
  });
  const allCertifications = certDocs.map(mapCertification).filter(Boolean);

  // Sort certifications: starting from ISO and ending with Spices Board
  const certOrder = [
    'iso',
    'fssc',
    'gmp',
    'usda',
    'organic',
    'halal',
    'kosher',
    'spice',
  ];
  allCertifications.sort((a: any, b: any) => {
    const aIndex = certOrder.findIndex(keyword => a.name.toLowerCase().includes(keyword));
    const bIndex = certOrder.findIndex(keyword => b.name.toLowerCase().includes(keyword));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/Sustainability-01.jpg"
          alt="Sustainable Farming"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Sustainability</h1>
            <p className="text-xl text-white text-shadow-sm">
              Our commitment to environmental stewardship and sustainable practices.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Approach</h6>
              <h2 className="text-[#214842] mb-6">Sustainable by Design</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  At Star Hi Herbs, sustainability isn't just a buzzword—it's woven into every aspect
                  of our operations. From farming practices to processing methods, we prioritize
                  environmental stewardship while maintaining the highest quality standards.
                </p>
                <p>
                  Our comprehensive sustainability program focuses on three key areas:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2"></span>
                    Environmental Conservation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2"></span>
                    Social Responsibility
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2"></span>
                    Economic Viability
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="https://ik.imagekit.io/pon54xoks/Sustainability%2001.jpg"
                alt="Sustainable Practices"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <SustainabilityImpact />

      {/* Sustainable Farming */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image src="https://ik.imagekit.io/pon54xoks/contract-farming.jpg"
                  alt="Organic Farming"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Farming Practices</h6>
              <h2 className="text-[#214842] mb-6">Organic & Regenerative Agriculture</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our farming practices go beyond organic certification to embrace regenerative
                  agriculture principles that improve soil health and biodiversity.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mt-2"></span>
                    <div>
                      <strong className="text-[#214842] block">Soil Management</strong>
                      <p className="text-sm">Natural composting and crop rotation to maintain soil fertility</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mt-2"></span>
                    <div>
                      <strong className="text-[#214842] block">Water Conservation</strong>
                      <p className="text-sm">Drip irrigation and rainwater harvesting systems</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mt-2"></span>
                    <div>
                      <strong className="text-[#214842] block">Biodiversity</strong>
                      <p className="text-sm">Maintaining natural habitats and beneficial insects</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Footprint</h6>
            <h2 className="text-[#214842] mb-4">Environmental Impact</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Energy Usage',
                current: '60% Renewable',
                target: '100% by 2026',
                description: 'Solar panels and wind energy power our facilities.',
              },
              {
                title: 'Water Management',
                current: '40% Recycled',
                target: '70% by 2026',
                description: 'Advanced water treatment and recycling systems.',
              },
              {
                title: 'Waste Reduction',
                current: '95% Recycled',
                target: 'Zero Waste by 2026',
                description: 'Comprehensive recycling and composting programs.',
              },
            ].map((impact, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-[#214842] mb-4">{impact.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="font-medium text-[#258F67]">{impact.current}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target:</span>
                    <span className="font-medium text-[#214842]">{impact.target}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Validation</h6>
            <h2 className="text-[#214842] mb-4">Our Certifications</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {allCertifications.map((cert: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 flex items-center justify-center shadow-md"
              >
                <div className="w-32 h-32 relative">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 bg-[#2A5A52] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Join Us in Making a Difference
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Learn more about our sustainability initiatives and how you can partner with us
            to create a more sustainable future.
          </p>
          <Button asChild className="cta-primary">
            <Link href="/contact" className="flex items-center">
              Contact Us
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
