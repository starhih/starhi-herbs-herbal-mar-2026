'use client';

import Link from 'next/link';
import { BlogTag } from '@/data/types';
import { Tag } from 'lucide-react';

interface BlogTagsProps {
  tags: BlogTag[];
  className?: string;
}

export default function BlogTags({ tags, className = '' }: BlogTagsProps) {
  if (!tags.length) return null;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Tag className="h-4 w-4 text-[#214842]" />
        <h3 className="text-md font-semibold text-[#214842]">Tags</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog/tag/${tag.slug}`}
            className="inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
