'use client';

import Image from '@/components/ui/image';
import { BlogAuthor } from '@/data/types';
import { Award } from 'lucide-react';

interface BlogAuthorInfoProps {
  author: BlogAuthor;
  isReviewer?: boolean;
  className?: string;
}

export default function BlogAuthorInfo({ author, isReviewer = false, className = '' }: BlogAuthorInfoProps) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 bg-[#214842]/10 flex items-center justify-center">
        {author.image ? (
          <Image
            src={author.image}
            alt={author.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span className="text-xl font-bold text-[#214842]">{author.name.charAt(0)}</span>
        )}
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">{isReviewer ? 'Reviewed by' : 'Written by'}</div>
        <h4 className="text-lg font-semibold text-[#214842]">{author.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{author.role}</p>
        <div className="flex flex-wrap gap-2">
          {author.certificates.map((certificate, index) => (
            <div
              key={`${author.id}-cert-${index}`}
              className="inline-flex items-center text-xs bg-[#214842]/10 text-[#214842] px-2 py-1 rounded-full"
            >
              <Award size={12} className="mr-1" />
              {certificate}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
