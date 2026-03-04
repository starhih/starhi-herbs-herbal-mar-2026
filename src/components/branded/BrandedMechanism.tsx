'use client';

import React from 'react';
import Image from '@/components/ui/image';
import { Product } from '@/data/types';

interface BrandedMechanismProps {
  mechanism: NonNullable<Product['mechanism']>;
}

export default function BrandedMechanism({ mechanism }: BrandedMechanismProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Science</h6>
        <h2 className="text-[#214842] mb-4">{mechanism.title}</h2>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 leading-relaxed">
              {mechanism.description}
            </p>
          </div>
          {mechanism.image && (
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={mechanism.image}
                alt={mechanism.title}
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
