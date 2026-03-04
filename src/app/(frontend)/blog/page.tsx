import { Metadata } from 'next';
import Image from '@/components/ui/image';
import { getPayloadClient } from '@/lib/payload';
import { mapBlogPost, mapBlogCategory } from '@/lib/mappers';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogSearchBar from '@/components/blog/BlogSearchBar';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Knowledge Center | Star Hi Herbs Blog',
  description: 'Latest insights, research, and industry news from Star Hi Herbs.',
};

export default async function BlogPage() {
  const payload = await getPayloadClient();

  // Fetch all blog posts from Payload
  const { docs: postDocs } = await payload.find({
    collection: 'blog-posts',
    sort: '-publishedAt',
    pagination: false,
  });
  const blogPosts = postDocs.map(mapBlogPost);

  // Fetch blog categories
  const { docs: categoryDocs } = await payload.find({
    collection: 'blog-categories',
    pagination: false,
  });
  const blogCategories = categoryDocs.map(mapBlogCategory);

  // Get featured posts (latest 3)
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image src="/images/hero/knowledge-center.jpeg"
          alt="Knowledge Center"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-shadow-sm">Knowledge Center</h1>
            <p className="text-xl text-white text-shadow-sm">
              Latest insights, research, and industry news from Star Hi Herbs
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog', isCurrent: true }
            ]}
          />
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <BlogSearchBar className="mb-6" />
              <BlogCategoryList categories={blogCategories} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-[#214842] mb-8">
                All Articles
              </h2>

              {blogPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {blogPosts.map((post: any) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl text-center">
                  <h3 className="text-xl font-semibold text-[#214842] mb-2">No Articles Found</h3>
                  <p className="text-gray-600">
                    No articles available yet. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Featured</h6>
              <h2 className="text-[#214842] mb-4">Latest Research & Insights</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our most recent publications and technical guides
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
