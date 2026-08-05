'use client';

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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {awards.map((award, index) => {
            // Override image based on title as requested in annotations
            let bgImage = award.image;
            if (award.title.includes('World Signature')) {
              bgImage = 'https://ik.imagekit.io/pon54xoks/world-signature-award-2023.jpeg';
            } else if (award.title.includes('Times Business') && award.year === '2020') {
              bgImage = 'https://ik.imagekit.io/pon54xoks/times-business-award-2020.jpeg';
            } else if (award.title.includes('Times Business') && award.year === '2026') {
              bgImage = 'https://ik.imagekit.io/pon54xoks/times-business-award-2026.jpeg';
            }

            return (
              <motion.div
                key={award.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#258F67] group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={bgImage}
                    alt={`${award.title} ${award.year}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
