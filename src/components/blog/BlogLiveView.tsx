'use client';

import { useLivePreview } from '@payloadcms/live-preview-react';
import type { BlogPost as PayloadBlogPost } from '@/payload-types';
import { mapBlogPost } from '@/lib/mappers';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import BlogHeader from '@/components/blog/BlogHeader';
import SimpleBlogContent from '@/components/blog/SimpleBlogContent';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import BlogTags from '@/components/blog/BlogTags';
import BlogRelatedPosts from '@/components/blog/BlogRelatedPosts';
import ProductCard from '@/components/products/ProductCard';
import type { Product } from '@/data/types';

export interface BlogLiveViewProps {
  initialDoc: PayloadBlogPost;
  initialPost: any;
  relatedPosts: any[];
  blogRelatedProducts: Product[];
}

export function BlogLiveView({
  initialDoc,
  initialPost,
  relatedPosts,
  blogRelatedProducts,
}: BlogLiveViewProps) {
  const { data: liveDoc } = useLivePreview<PayloadBlogPost>({
    initialData: initialDoc,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  });

  const post = (liveDoc ? mapBlogPost(liveDoc) : null) || initialPost;
  const tags = post.tags;

  return (
    <>
      <section className="pt-8 lg:pt-12">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}`, isCurrent: true }
            ]}
          />
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <BlogTableOfContents items={post.tableOfContents} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <BlogHeader post={post} className="mb-8" />

              <SimpleBlogContent content={post.content} className="mb-12" />

              <BlogTags tags={tags} className="mb-16" />

              {blogRelatedProducts.length > 0 && (
                <div className="mb-16 border-t pt-8">
                  <h3 className="text-2xl font-bold text-[#214842] mb-6">Related Ingredients</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogRelatedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <BlogRelatedPosts posts={relatedPosts} className="mt-16" />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
