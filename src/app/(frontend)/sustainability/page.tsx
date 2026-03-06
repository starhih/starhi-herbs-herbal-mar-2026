import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Recycle, Users, Globe } from 'lucide-react';

export default function SustainabilityPage() {
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
              <Image src="/images/sustainibility-1.jpg"
                alt="Sustainable Practices"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Impact</h6>
            <h2 className="text-[#214842] mb-4">Key Initiatives</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Organic Farming',
                description: 'Supporting over 1,000 farmers in transitioning to organic practices.',
                stat: '5,000+ acres',
                label: 'Organic Farmland',
              },
              {
                icon: Recycle,
                title: 'Zero Waste',
                description: 'Implementing circular economy principles in our operations.',
                stat: '95%',
                label: 'Waste Recycled',
              },
              {
                icon: Users,
                title: 'Community Support',
                description: 'Empowering local communities through education and employment.',
                stat: '2,000+',
                label: 'Farmers Trained',
              },
              {
                icon: Globe,
                title: 'Carbon Neutral',
                description: 'Working towards carbon neutrality across our operations.',
                stat: '-40%',
                label: 'Carbon Reduction',
              },
            ].map((initiative, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#214842]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <initiative.icon className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-lg font-semibold text-[#214842] mb-2">{initiative.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{initiative.description}</p>
                <div className="border-t pt-4">
                  <div className="text-2xl font-bold text-[#258F67]">{initiative.stat}</div>
                  <div className="text-sm text-gray-600">{initiative.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Farming */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image src="/images/organic-turmeric-contract-farming.png"
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
            {[
              {
                name: 'USDA Organic',
                image: '/images/certifications/usda-organic.jpg',
              },
              {
                name: 'Organic',
                image: '/images/certifications/organic.jpg',
              },
              {
                name: 'WHO GMP',
                image: '/images/certifications/who-gmp.jpg',
              },
              {
                name: 'Shefexil',
                image: '/images/certifications/shefexil.jpg',
              },
            ].map((cert, index) => (
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
      <section className="py-20 bg-[#214842] text-white">
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
