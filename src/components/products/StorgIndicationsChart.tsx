'use client';

import React from 'react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { Product } from '@/data/types';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StorgIndicationsChartProps {
  products: Product[];
}

// Product color mapping with exact colors matching the image
const productColors: Record<string, string> = {
  'storg-b': 'bg-cyan-500',      // Cyan blue
  'storg-bs': 'bg-slate-400',    // Slate gray
  'storg-bio': 'bg-emerald-300', // Light green
  'storg-bt': 'bg-red-800',      // Dark red
  'storg-c': 'bg-orange-500',    // Orange
  'storg-e': 'bg-pink-500',      // Pink
  'storg-fa': 'bg-yellow-400',   // Yellow
  'storg-i': 'bg-amber-400',     // Amber/gold
  'storg-n': 'bg-purple-300',    // Light purple
  'storg-se': 'bg-amber-700',    // Brown
  'storg-zn': 'bg-green-500',    // Green
  'storg-her': 'bg-pink-400',    // Pink (for female)
  'storg-him': 'bg-blue-500',    // Blue (for male)
  'storg-kid': 'bg-purple-500'   // Purple (for kids)
};

// Product logos for the chart
const productLogos: Record<string, { logo: string, subtitle: string }> = {
  'storg-b': {
    logo: '/images/storg/storg-b.jpg',
    subtitle: 'Vitamin B'
  },
  'storg-bs': {
    logo: '/images/storg/storg-bs.jpg',
    subtitle: 'B-Complex'
  },
  'storg-bio': {
    logo: '/images/storg/storg-bio.jpg',
    subtitle: 'Biotin'
  },
  'storg-bt': {
    logo: '/images/storg/storg-bt.jpg',
    subtitle: 'Beta Carotene'
  },
  'storg-c': {
    logo: '/images/storg/storg-c.jpg',
    subtitle: 'Vitamin C'
  },
  'storg-e': {
    logo: '/images/storg/storg-e.jpg',
    subtitle: 'Vitamin E'
  },
  'storg-fa': {
    logo: '/images/storg/storg-fa.jpg',
    subtitle: 'Folic Acid'
  },
  'storg-i': {
    logo: '/images/storg/storg-i.jpg',
    subtitle: 'Iron'
  },
  'storg-n': {
    logo: '/images/storg/storg-n.jpg',
    subtitle: 'Niacin'
  },
  'storg-se': {
    logo: '/images/storg/storg-se.jpg',
    subtitle: 'Selenium'
  },
  'storg-zn': {
    logo: '/images/storg/storg-zn.jpg',
    subtitle: 'Zinc'
  },
  'storg-her': {
    logo: '/images/storg/storg-her.jpg',
    subtitle: 'Female Vitamins'
  },
  'storg-him': {
    logo: '/images/storg/storg-him.jpg',
    subtitle: 'Male Vitamins'
  },
  'storg-kid': {
    logo: '/images/storg/storg-kid.jpg',
    subtitle: 'Kid Vitamins'
  }
};

export default function StorgIndicationsChart({ products }: StorgIndicationsChartProps) {
  // Sort products alphabetically by name
  const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

  // Get all unique indications from all products
  const allIndications = Array.from(
    new Set(
      products.flatMap(product => product.indications || [])
    )
  ).sort();

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md">
      <div className="text-center mb-10">
        <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Product Selection Guide</h6>
        <h2 className="text-[#214842] mb-4 text-3xl font-bold">Storg® Products by Health Indication</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Use this chart to find the right Storg® product for your specific health needs.
          Each colored box indicates that the product supports that health indication.
        </p>
      </div>

      <div className="overflow-x-auto pb-4 max-w-full">
        <table className="w-full border-collapse border border-gray-200 table-fixed">
          <thead>
            <tr className="bg-white">
              <th className="p-3 border border-gray-200 min-w-[200px] w-[200px]"></th>
              {allIndications.map(indication => (
                <th key={indication} className="p-3 border border-gray-200 text-center">
                  <div className="flex items-center justify-center h-20">
                    <div className="transform -rotate-90 origin-center whitespace-nowrap text-xs font-medium text-gray-700">
                      {indication}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-200">
                  {productLogos[product.id] && (
                    <div className="flex items-start justify-start h-16">
                      <Image
                        src={productLogos[product.id].logo}
                        alt={product.name}
                        width={180}
                        height={50}
                        className="object-contain"
                      />
                    </div>
                  )}
                </td>
                {allIndications.map(indication => {
                  const hasIndication = product.indications?.includes(indication);
                  return (
                    <td key={`${product.id}-${indication}`} className="p-0 border border-gray-200 text-center">
                      {hasIndication ? (
                        <div className={`w-full h-16 ${productColors[product.id as string] || 'bg-gray-200'}`}></div>
                      ) : (
                        <div className="w-full h-16"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Button asChild className="bg-[#214842] hover:bg-[#214842]/90">
          <Link href="/collections/vitamins-minerals" className="flex items-center gap-2">
            View All Storg® Products <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
