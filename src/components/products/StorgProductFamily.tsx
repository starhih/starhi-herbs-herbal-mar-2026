'use client';

import React from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StorgProductFamilyProps {
  mainProduct: Product;
  childProducts: Product[];
}

export default function StorgProductFamily({ mainProduct, childProducts }: StorgProductFamilyProps) {
  // Sort products alphabetically by name
  const sortedProducts = [...childProducts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      {/* Main Product Section */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[300px] md:h-full">
            <Image
              src={mainProduct.image}
              fallbackSrc={mainProduct.imageFallback}
              alt={mainProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-[#214842] mb-4">{mainProduct.name}</h2>
            <p className="text-gray-700 mb-6">{mainProduct.shortDescription}</p>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-[#214842] mb-2">Key Benefits:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {mainProduct.benefits?.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Variants Section */}
      <h2 className="text-2xl font-semibold text-[#214842] mb-6">Storg® Product Variants</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            <div className="relative h-48">
              <Image
                src={product.image}
                fallbackSrc={product.imageFallback}
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
