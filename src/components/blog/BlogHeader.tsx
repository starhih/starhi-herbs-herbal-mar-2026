'use client';

import Image from '@/components/ui/image';
import { Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { BlogPost } from '@/data/types';
import BlogAuthorInfo from './BlogAuthorInfo';

interface BlogHeaderProps {
  post: any;
  className?: string;
}

export default function BlogHeader({ post, className = '' }: BlogHeaderProps) {
  const author = post.author;
  const reviewer = post.reviewer;
  const category = post.category;

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <div className="inline-block bg-[#214842] text-white px-4 py-1 text-sm rounded-full mb-4">
          {category?.name || 'Uncategorized'}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#214842] mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(post.updatedAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full rounded-xl overflow-hidden mb-8 bg-[#214842]/10">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <h2 className="text-4xl font-bold text-[#214842]">{post.title.charAt(0).toUpperCase()}</h2>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {author && (
          <BlogAuthorInfo author={author} />
        )}
        {reviewer && (
          <BlogAuthorInfo author={reviewer} isReviewer />
        )}
      </div>
    </div>
  );
}
