'use client';

import { useState } from 'react';
import Image from '@/components/ui/image';
import { Award } from 'lucide-react';
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
          {awards.map((award) => (
            <motion.div
              key={award.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              onMouseEnter={() => setHoveredAward(Number(award.id))}
              onMouseLeave={() => setHoveredAward(null)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Number(award.id) * 0.1 }}
            >
              <div className="md:flex">
                <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                  <Image
                    src={award.image}
                    alt={`${award.title} ${award.year}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className={`object-cover transition-transform duration-500 ${
                      hoveredAward === Number(award.id) ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>
                <div className="md:w-3/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#214842]/10 p-2 rounded-full">
                      <Award className="h-5 w-5 text-[#214842]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#214842]">{award.title}</h3>
                      <p className="text-[#258F67] font-medium">{award.year}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{award.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
