'use client';

import React from 'react';
import { Product } from '@/data/types';
import { Shield, Sparkles, Heart, Brain, Zap, Sun, Pill, Dumbbell } from 'lucide-react';

// Icons for different indications
const indicationIcons: Record<string, React.ReactNode> = {
  'Immune Function': <Shield className="h-10 w-10" />,
  'Skin Health': <Sparkles className="h-10 w-10" />,
  'Cardiovascular Health': <Heart className="h-10 w-10" />,
  'Neurological Function': <Brain className="h-10 w-10" />,
  'Energy': <Zap className="h-10 w-10" />,
  'Thyroid Health': <Sun className="h-10 w-10" />,
  'Reproductive Health': <Heart className="h-10 w-10" />,
  'Prenatal Support': <Pill className="h-10 w-10" />,
  'Bone Health': <Dumbbell className="h-10 w-10" />,
  'Antioxidant': <Shield className="h-10 w-10" />
};

// Default icon for indications without a specific icon
const defaultIcon = <Shield className="h-10 w-10" />;

interface VitaminProductIndicationsProps {
  productIndications: NonNullable<Product['productIndications']>;
}

export default function VitaminProductIndications({ productIndications }: VitaminProductIndicationsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Health Support</h6>
        <h2 className="text-[#214842] mb-4">{productIndications.title}</h2>
        {productIndications.description && (
          <p className="text-gray-600 max-w-3xl mx-auto">
            {productIndications.description}
          </p>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productIndications.indications.map((indication, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-[#258F67] mb-4 flex justify-center">
                {indicationIcons[indication.name] || defaultIcon}
              </div>
              <h3 className="text-xl font-semibold text-[#214842] mb-3">{indication.name}</h3>
              {indication.description && (
                <p className="text-gray-600">{indication.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
