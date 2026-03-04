'use client';

import Image from '@/components/ui/image';
import { Counter } from "@/components/ui/animated-counter";

export default function AboutIntroSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Two-column layout with text and image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-[#214842]">At Star Hi Herbs</h2>
            <p className="text-xl font-medium text-[#258F67] italic">
              "Extracting Nature's Best—Backed by Science, Delivered with Integrity."
            </p>
            <p className="text-gray-600 leading-relaxed">
              Star Hi Herbs is a leading manufacturer and global supplier of high-quality herbal extracts,
              active ingredients, and botanical solutions for the nutraceutical, cosmetic, personal care,
              and wellness industries. With a strong foundation in traditional plant knowledge and a
              commitment to modern science, we deliver consistent, safe, and effective herbal actives
              tailored to meet international standards.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From ethical sourcing and innovative R&D to state-of-the-art manufacturing and rigorous
              quality assurance, every aspect of our process is built on trust, transparency, and
              long-term impact. At Star Hi Herbs, we don't just extract herbs—we extract their full potential.
            </p>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <Image src="/images/hassan-plant.jpg"
              alt="Star Hi Herbs Manufacturing Facility"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#214842]/20 to-transparent"></div>
          </div>
        </div>

        {/* Statistics Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12 border-t pt-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Counter end={30000} duration={2.5} fontSize={48} className="text-[#258F67] font-bold" />
            </div>
            <h3 className="text-base font-medium text-[#214842] mb-1">Acres of Cultivation</h3>
            <p className="text-gray-600 text-sm">Contract Farming</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Counter end={6000} duration={2.5} fontSize={48} className="text-[#258F67] font-bold" />
            </div>
            <h3 className="text-base font-medium text-[#214842] mb-1">Production Capacity</h3>
            <p className="text-gray-600 text-sm">MT/annum</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Counter end={27} duration={2.5} fontSize={48} suffix="+" className="text-[#258F67] font-bold" />
            </div>
            <h3 className="text-base font-medium text-[#214842] mb-1">Patents</h3>
            <p className="text-gray-600 text-sm">Registered Globally</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Counter end={20} duration={2.5} fontSize={48} suffix="+" className="text-[#258F67] font-bold" />
            </div>
            <h3 className="text-base font-medium text-[#214842] mb-1">Publications</h3>
            <p className="text-gray-600 text-sm">Research Papers</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Counter end={550} duration={2.5} fontSize={48} suffix="+" className="text-[#258F67] font-bold" />
            </div>
            <h3 className="text-base font-medium text-[#214842] mb-1">Customers</h3>
            <p className="text-gray-600 text-sm">Worldwide</p>
          </div>
        </div>
      </div>
    </section>
  );
}
