'use client';

import React from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Product } from '@/data/types';

interface BrandedWhitepaperProps {
  whitepaper: NonNullable<Product['whitepaper']>;
}

export default function BrandedWhitepaper({ whitepaper }: BrandedWhitepaperProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Research</h6>
        <h2 className="text-[#214842] mb-4">{whitepaper.title}</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {whitepaper.image && (
              <div className="md:flex-shrink-0 relative h-64 md:h-auto md:w-1/3">
                <Image
                  src={whitepaper.image}
                  alt={whitepaper.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-[#214842] mb-4">{whitepaper.title}</h3>
              <p className="text-gray-600 mb-6">{whitepaper.description}</p>
              <Link href={whitepaper.link} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#214842] hover:bg-[#214842]/90">
                  <Download size={16} className="mr-2" />
                  Download Whitepaper
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
