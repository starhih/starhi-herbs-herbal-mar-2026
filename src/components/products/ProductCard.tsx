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
      className={`group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="relative h-48">
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
        {product.categoryName && (
          <div className="text-sm text-[#258F67] mb-2">{product.categoryName}</div>
        )}
        <h3 className="text-xl font-semibold text-[#214842] mb-2 group-hover:text-[#258F67] transition-colors">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
        )}

        {product.latinName && (
          <p className="text-gray-500 text-sm italic mb-3">{product.latinName}</p>
        )}

        {product.moq && (
          <p className="text-gray-500 text-xs mb-2">MOQ: {product.moq}</p>
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
              <div key={cert.name} className="relative h-8 w-8" title={cert.name}>
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  sizes="32px"
                  className="object-contain"
                />
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
