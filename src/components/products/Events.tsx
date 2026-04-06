'use client';

import { BaseComponentProps } from '@/types/component';
import Image from '@/components/ui/image';
import { Calendar } from 'lucide-react';
import { ShuffleGrid } from '@/components/ui/ShuffleGrid';

interface EventsProps extends BaseComponentProps {
  description: string;
  image: string;
  images?: string[];
}

export default function Events({ description, image, images = [], className = '' }: EventsProps) {
  if (!description) {
    return null;
  }

  const hasMultipleImages = images && images.length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#214842]/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-[#214842]" />
            </div>
            <h3 className="text-xl font-semibold text-[#214842]">Events & Exhibitions</h3>
          </div>
          <div className="text-gray-700 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={`events-p-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 relative min-h-[400px] md:min-h-[450px]">
          {hasMultipleImages ? (
            <div className="p-4 h-full w-full">
               <ShuffleGrid images={images} />
            </div>
          ) : (
            <Image
              src={image}
              alt="Events and Exhibitions"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
