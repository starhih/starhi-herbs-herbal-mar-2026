'use client';

import React from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import { Product } from '@/data/types';

interface BrandedClinicalResearchProps {
  clinicalResearch: NonNullable<Product['clinicalResearch']>;
}

export default function BrandedClinicalResearch({ clinicalResearch }: BrandedClinicalResearchProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Evidence-Based</h6>
        <h2 className="text-[#214842] mb-4">{clinicalResearch.title}</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          {clinicalResearch.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clinicalResearch.studies.map((study, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            {study.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#214842] mb-3">{study.title}</h3>
              <p className="text-gray-600 mb-4">{study.description}</p>
              {study.link && (
                <Link href={study.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-[#214842] text-[#214842] hover:bg-[#214842]/10">
                    <FileText size={16} className="mr-2" />
                    View Study
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
