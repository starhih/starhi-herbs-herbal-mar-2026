'use client';

import { BaseComponentProps } from '@/types/component';
import { BookOpen } from 'lucide-react';

interface ResearchProps extends BaseComponentProps {
  research: string;
}

export default function Research({ research, className = '' }: ResearchProps) {
  if (!research) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#214842]/10 p-2 rounded-full">
          <BookOpen className="h-5 w-5 text-[#214842]" />
        </div>
        <h3 className="text-xl font-semibold text-[#214842]">Research & Studies</h3>
      </div>
      <div className="text-gray-700 space-y-4">
        {research.split('\n\n').map((paragraph, index) => (
          <p key={`research-p-${index}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
