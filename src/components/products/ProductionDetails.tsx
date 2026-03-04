'use client';

import { BaseComponentProps } from '@/types/component';
import Image from '@/components/ui/image';
import { Factory } from 'lucide-react';

interface ProductionDetailsProps extends BaseComponentProps {
  description: string;
  image: string;
}

export default function ProductionDetails({ description, image, className = '' }: ProductionDetailsProps) {
  if (!description) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#214842]/10 p-2 rounded-full">
              <Factory className="h-5 w-5 text-[#214842]" />
            </div>
            <h3 className="text-xl font-semibold text-[#214842]">Production Process</h3>
          </div>
          <div className="text-gray-700 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={`production-p-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 relative min-h-[300px]">
          <Image
            src={image}
            alt="Production Process"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
