'use client';

import React from 'react';
import { Product } from '@/data/types';
import { Pill, Beaker, Coffee, Utensils, Droplet } from 'lucide-react';

// Icons for different applications
const applicationIcons: Record<string, React.ReactNode> = {
  'Tablets & Capsules': <Pill className="h-10 w-10" />,
  'Powders & Blends': <Beaker className="h-10 w-10" />,
  'Beverages': <Coffee className="h-10 w-10" />,
  'Functional Foods': <Utensils className="h-10 w-10" />,
  'Liquid Supplements': <Droplet className="h-10 w-10" />,
  'Gummies': <Beaker className="h-10 w-10" />
};

// Default icon for applications without a specific icon
const defaultIcon = <Beaker className="h-10 w-10" />;

interface VitaminProductApplicationsProps {
  productApplications: NonNullable<Product['productApplications']>;
}

export default function VitaminProductApplications({ productApplications }: VitaminProductApplicationsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Formulation</h6>
        <h2 className="text-[#214842] mb-4">{productApplications.title}</h2>
        {productApplications.description && (
          <p className="text-gray-600 max-w-3xl mx-auto">
            {productApplications.description}
          </p>
        )}
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productApplications.applications.map((application, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-[#258F67] mb-4 flex justify-center">
                {applicationIcons[application.name] || defaultIcon}
              </div>
              <h3 className="text-xl font-semibold text-[#214842] mb-3">{application.name}</h3>
              {application.description && (
                <p className="text-gray-600">{application.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
