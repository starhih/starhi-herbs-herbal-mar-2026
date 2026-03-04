'use client';

import Image from '@/components/ui/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '@/data/types';
import { BaseComponentProps } from '@/types/component';
import { useState } from 'react';
import { logError } from '@/utils/error-handling';

/**
 * Props for the CategoryCard component
 */
interface CategoryCardProps extends BaseComponentProps {
  category: ProductCategory;
  priority?: boolean;
}

/**
 * CategoryCard component displays a product category in a card format
 *
 * @param category - The category to display
 * @param priority - Whether to prioritize loading the image
 * @param className - Additional CSS classes
 */
export default function CategoryCard({
  category,
  priority = false,
  className = ''
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    logError(`Failed to load image for category: ${category.name}`, 'CategoryCard');
  };

  return (
    <Link
      href={`/collections/${category.slug}`}
      className={`group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="relative h-48">
        {!imageError ? (
          <Image
            src={category.homepageImage || category.image}
            fallbackSrc={category.homepageImageFallback || category.imageFallback}
            alt={category.name}
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
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#214842] px-3 py-1 rounded-full text-sm font-medium">
          {category.count} Products
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[#214842] mb-2 group-hover:text-[#258F67] transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
        )}
        <div className="flex items-center text-[#258F67] font-medium">
          View Category
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
