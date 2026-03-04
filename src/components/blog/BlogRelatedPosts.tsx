'use client';

import { BlogPost } from '@/data/types';
import BlogCard from './BlogCard';
import { LinkIcon } from 'lucide-react';

interface BlogRelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

export default function BlogRelatedPosts({ posts, className = '' }: BlogRelatedPostsProps) {
  if (!posts.length) return null;
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <LinkIcon className="h-5 w-5 text-[#214842]" />
        <h3 className="text-xl font-semibold text-[#214842]">Related Articles</h3>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
