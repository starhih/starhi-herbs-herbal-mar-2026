'use client';

import React from 'react';
import Image from '@/components/ui/image';
import { CheckCircle } from 'lucide-react';
import { Product } from '@/data/types';

interface BrandedWhyChooseProps {
  whyChoose: NonNullable<Product['whyChoose']>;
}

export default function BrandedWhyChoose({ whyChoose }: BrandedWhyChooseProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Advantages</h6>
        <h2 className="text-[#214842] mb-4">{whyChoose.title}</h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {whyChoose.description}
            </p>
            <div className="space-y-4">
              {whyChoose.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-[#258F67]" />
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
          {whyChoose.image && (
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={whyChoose.image}
                alt={whyChoose.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
