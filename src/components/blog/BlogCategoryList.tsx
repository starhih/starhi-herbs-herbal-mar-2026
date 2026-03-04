'use client';

import Link from 'next/link';
import { BlogCategory } from '@/data/types';
import { FolderOpen } from 'lucide-react';

interface BlogCategoryListProps {
  categories: BlogCategory[];
  activeCategory?: string;
  className?: string;
}

export default function BlogCategoryList({ categories, activeCategory, className = '' }: BlogCategoryListProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <FolderOpen className="h-5 w-5 text-[#214842]" />
        <h3 className="text-lg font-semibold text-[#214842]">Categories</h3>
      </div>
      <ul className="space-y-2">
        <li>
          <Link
            href="/blog"
            className={`block py-2 px-3 rounded-md transition-colors ${
              !activeCategory 
                ? 'bg-[#214842]/10 text-[#214842] font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Articles
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/blog/category/${category.slug}`}
              className={`block py-2 px-3 rounded-md transition-colors ${
                activeCategory === category.slug 
                  ? 'bg-[#214842]/10 text-[#214842] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
