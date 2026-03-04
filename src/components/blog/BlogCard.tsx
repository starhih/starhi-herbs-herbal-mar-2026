'use client';

import Link from 'next/link';
import Image from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost, BlogCategory } from '@/data/types';
import { formatDate } from '@/utils/date';

interface BlogCardProps {
  post: any;
  category?: any;
  className?: string;
}

export default function BlogCard({ post, category: categoryProp, className = '' }: BlogCardProps) {
  const category = categoryProp || post.category;

  return (
    <Card className={`group overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <div className="relative h-52 overflow-hidden bg-[#214842]/10">
        <div className="absolute top-4 left-4 bg-[#214842] text-white px-3 py-1 text-xs rounded-full z-10">
          {category?.name || 'Uncategorized'}
        </div>
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-[#214842]">
            {post.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="text-sm text-gray-500 mb-2">{formatDate(post.publishedAt)}</div>
        <h3 className="text-xl font-semibold text-[#214842] mb-3 group-hover:text-[#258F67] transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center text-[#258F67] font-medium hover:text-[#214842] transition-colors"
          >
            Read Article
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-sm text-gray-500">{post.readTime} min read</span>
        </div>
      </CardContent>
    </Card>
  );
}
