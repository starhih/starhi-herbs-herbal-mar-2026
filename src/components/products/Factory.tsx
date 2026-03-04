'use client';

import { BaseComponentProps } from '@/types/component';
import Image from '@/components/ui/image';
import { Building2 } from 'lucide-react';

interface FactoryProps extends BaseComponentProps {
  description: string;
  image: string;
}

export default function Factory({ description, image, className = '' }: FactoryProps) {
  if (!description) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="md:flex">
        <div className="md:w-1/2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#214842]/10 p-2 rounded-full">
              <Building2 className="h-5 w-5 text-[#214842]" />
            </div>
            <h3 className="text-xl font-semibold text-[#214842]">Manufacturing Facility</h3>
          </div>
          <div className="text-gray-700 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={`factory-p-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 relative min-h-[300px]">
          <Image
            src={image}
            alt="Manufacturing Facility"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
