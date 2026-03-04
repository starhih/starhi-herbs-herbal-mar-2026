'use client';

import React from 'react';
import Image from '@/components/ui/image';
import { Leaf, CheckCircle } from 'lucide-react';
import { Product } from '@/data/types';

interface BrandedSustainabilityProps {
  sustainability: NonNullable<Product['sustainability']>;
}

export default function BrandedSustainability({ sustainability }: BrandedSustainabilityProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Environment</h6>
        <h2 className="text-[#214842] mb-4">{sustainability.title}</h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {sustainability.image && (
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={sustainability.image}
                alt={sustainability.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
          <div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {sustainability.description}
            </p>
            {sustainability.points && sustainability.points.length > 0 && (
              <div className="space-y-4">
                {sustainability.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="h-5 w-5 text-[#258F67]" />
                    </div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
