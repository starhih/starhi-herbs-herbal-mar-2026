'use client';

import { BaseComponentProps } from '@/types/component';
import { CheckCircle } from 'lucide-react';

interface SupplierInfoProps extends BaseComponentProps {
  points: string[];
}

export default function SupplierInfo({ points, className = '' }: SupplierInfoProps) {
  if (!points || points.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-[#214842] mb-4">Supplier Information</h3>
      <p className="text-gray-600 mb-4">
        When sourcing this product, we recommend the following considerations:
      </p>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={`supplier-point-${index}`} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-[#258F67] mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
