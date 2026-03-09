'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Product } from '@/data/types';

interface BrandedHealthClaimsProps {
  healthClaims: NonNullable<Product['healthClaims']>;
}

export default function BrandedHealthClaims({ healthClaims }: BrandedHealthClaimsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Benefits</h6>
        <h2 className="text-[#214842] mb-4">{healthClaims.title}</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {healthClaims.claims.map((claim, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-[#f8f9fa] rounded-lg">
              <div className="mt-1">
                <CheckCircle className="h-5 w-5 text-[#258F67]" />
              </div>
              <p className="text-[#214842] font-medium">{claim}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-6 text-center">
          *These statements have not been evaluated by the Food and Drug Administration. 
          This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </div>
  );
}
