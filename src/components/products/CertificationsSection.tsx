'use client';

import { BaseComponentProps } from '@/types/component';
import Image from '@/components/ui/image';
import { Award } from 'lucide-react';

interface CertificationsSectionProps extends BaseComponentProps {
  description: string;
  image: string;
  certifications?: string[];
}

export default function CertificationsSection({ description, image, certifications = [], className = '' }: CertificationsSectionProps) {
  if (!description) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      <div className="md:flex flex-row-reverse">
        <div className="md:w-1/2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#214842]/10 p-2 rounded-full">
              <Award className="h-5 w-5 text-[#214842]" />
            </div>
            <h3 className="text-xl font-semibold text-[#214842]">Certifications</h3>
          </div>
          <div className="text-gray-700 space-y-4">
            {description.split('\n\n').map((paragraph, index) => (
              <p key={`cert-p-${index}`}>{paragraph}</p>
            ))}
          </div>
          
          {certifications && certifications.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-medium text-[#214842] mb-3">Our Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <span 
                    key={`cert-badge-${index}`} 
                    className="px-3 py-1 bg-[#214842]/10 text-[#214842] rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="md:w-1/2 relative min-h-[300px]">
          <Image
            src={image}
            alt="Certifications"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
