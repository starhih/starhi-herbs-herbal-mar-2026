'use client';

import React from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/data/types';

interface StorgChildProductsProps {
  childProducts: Product[];
}

export default function StorgChildProducts({ childProducts }: StorgChildProductsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Product Family</h6>
        <h2 className="text-[#214842] mb-4">Storg® Product Variants</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our complete range of plant-based vitamins and minerals, each formulated to address specific nutritional needs.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {childProducts.map((product) => (
          <Link
            key={product.id}
            href={`/vitamins-minerals/${product.slug}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-semibold text-[#214842] mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{product.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.indications?.map((indication, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-[#EFC368]/20 text-[#214842] text-xs px-2 py-1 rounded-full"
                  >
                    {indication}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-[#214842] font-medium">
                View Details <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
