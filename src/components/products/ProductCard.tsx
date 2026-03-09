'use client';

import Image from '@/components/ui/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/data/types';
import { BaseComponentProps } from '@/types/component';
import { useState } from 'react';
import { logError } from '@/utils/error-handling';

/**
 * Props for the ProductCard component
 */
interface ProductCardProps extends BaseComponentProps {
  product: Product;
  priority?: boolean;
}

/**
 * ProductCard component displays a product in a card format
 *
 * @param product - The product to display
 * @param priority - Whether to prioritize loading the image
 * @param className - Additional CSS classes
 */
export default function ProductCard({
  product,
  priority = false,
  className = ''
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    logError(`Failed to load image for product: ${product.name}`, 'ProductCard');
  };

  // Determine the correct URL based on product type
  const getProductUrl = () => {
    if (product.productType === 'branded') {
      return `/branded-ingredients/${product.slug}`;
    }
    if (product.productType === 'vitamin-mineral') {
      return `/vitamins-minerals/${product.slug}`;
    }
    return `/products/${product.slug}`;
  };

  return (
    <Link
      href={getProductUrl()}
      className={`group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-transparent hover:border-[#258F67] ${className}`}
    >
      <div className="relative h-64">
        {!imageError ? (
          <Image
            src={product.image}
            fallbackSrc={product.imageFallback}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={priority ? 'eager' : 'lazy'}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F/PQAJpgOUCc6crwAAAABJRU5ErkJggg=="
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#214842] mb-2 group-hover:text-[#258F67] transition-colors">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
        )}

        {product.latinName && (
          <p className="text-gray-600 text-sm italic mb-3">{product.latinName}</p>
        )}

        {product.standardization && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#214842]/10 text-[#214842] rounded-full text-sm">
              {product.standardization}
            </span>
          </div>
        )}

        {/* Certification Icons */}
        {product.certificationIcons && product.certificationIcons.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {product.certificationIcons.slice(0, 5).map((cert) => (
              <div key={cert.name} className="relative h-8 w-8 group/tooltip" title={cert.name}>
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="32px"
                  className="object-contain"
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  {cert.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 mt-[-1px]"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center text-[#258F67] font-medium">
          View Details
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
