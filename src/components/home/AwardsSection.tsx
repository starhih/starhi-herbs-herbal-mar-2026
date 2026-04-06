'use client';

import { useState } from 'react';
import Image from '@/components/ui/image';

import { motion } from 'framer-motion';
interface AwardItem {
  id: string | number;
  title: string;
  year: string;
  description: string;
  image: string;
}

interface AwardsSectionProps {
  awards: AwardItem[];
}

export default function AwardsSection({ awards }: AwardsSectionProps) {
  const [hoveredAward, setHoveredAward] = useState<number | null>(null);

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Recognition</h6>
          <h2 className="text-[#214842] mb-4">Our Awards & Achievements</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Recognized for our commitment to quality, innovation, and excellence in the herbal extract industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {awards.map((award) => {
            // Override image based on title as requested in annotations
            let bgImage = award.image;
            if (award.title.includes('World Signature')) {
              bgImage = 'https://ik.imagekit.io/pon54xoks/world-signature-award-2023.jpg';
            } else if (award.title.includes('Times Business')) {
              bgImage = 'https://ik.imagekit.io/pon54xoks/times-business-award-2020.jpg';
            }

            return (
              <motion.div
                key={award.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#258F67] group"
                onMouseEnter={() => setHoveredAward(Number(award.id))}
                onMouseLeave={() => setHoveredAward(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Number(award.id) * 0.1 }}
              >
                <div className="relative h-full min-h-[250px] flex items-stretch overflow-hidden">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={bgImage}
                      alt={`${award.title} ${award.year}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover transition-transform duration-700 ${
                        hoveredAward === Number(award.id) ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    {/* Gradient Overlay for text readability (Darker on the right) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/60 to-black/90 md:from-transparent md:via-black/70 md:to-black/95"></div>
                  </div>

                  {/* Spacer for left side to push content right on desktop */}
                  <div className="hidden md:block md:w-1/3 object-cover"></div>

                  {/* Content on the right */}
                  <div className="relative w-full md:w-2/3 p-6 z-10 flex flex-col justify-center">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white drop-shadow-md">{award.title}</h3>
                      <p className="text-[#EFC368] font-medium tracking-wide drop-shadow-sm">{award.year}</p>
                    </div>
                    <p className="text-white/90 drop-shadow-md leading-relaxed">{award.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
