import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { mapBlogPost, mapProduct } from '@/lib/mappers';
import { BlogPost, Product } from '@/data/types';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import BlogHeader from '@/components/blog/BlogHeader';
import SimpleBlogContent from '@/components/blog/SimpleBlogContent';
import BlogTableOfContents from '@/components/blog/BlogTableOfContents';
import BlogTags from '@/components/blog/BlogTags';
import BlogRelatedPosts from '@/components/blog/BlogRelatedPosts';
import ProductCard from '@/components/products/ProductCard';
import JsonLd from '@/components/seo/JsonLd';

// Generate static params for all blog posts
// Generate static params for all blog posts
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: 'blog-posts',
    limit: 1000,
    select: { slug: true }
  });
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1
  });
  const post = docs[0] ? mapBlogPost(docs[0]) : null;

  if (!post) {
    return {
      title: 'Blog Post Not Found | Star Hi Herbs',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Star Hi Herbs Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

// Set dynamic to force-static for static export
export const dynamic = 'force-static';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1
  });
  const post = docs[0] ? mapBlogPost(docs[0]) : null;

  if (!post) {
    notFound();
  }

  const tags = post.tags; // tags are already populated in mapped post

  // Fetch related posts
  const { docs: relatedDocs } = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { category: { equals: post.categoryId } },
        { id: { not_equals: post.id } }
      ]
    },
    limit: 3
  });
  const relatedPosts = relatedDocs.map(mapBlogPost);

  // Fetch products to find contextual matches in the blog post content
  const { docs: allProductsDocs } = await payload.find({
    collection: 'products',
    limit: 100,
  });

  const matchedProducts = allProductsDocs
    .map(mapProduct)
    .filter(Boolean)
    .filter((product: any) => {
      const name = product.name.toLowerCase();
      // Remove common suffixes like "extract", "oil", etc.
      const baseName = name.replace(/\s+(extract|oil|powder|granules)\s*$/g, '').trim();
      
      const textToSearch = (post.title + ' ' + post.excerpt + ' ' + post.content).toLowerCase();
      return textToSearch.includes(name) || (baseName.length > 3 && textToSearch.includes(baseName));
    })
    .slice(0, 3) as Product[];

  // Fallback to featured products if no specific mentions are found
  let blogRelatedProducts = matchedProducts;
  if (blogRelatedProducts.length === 0) {
    const { docs: featuredDocs } = await payload.find({
      collection: 'products',
      where: { featured: { equals: true } },
      limit: 3,
    });
    blogRelatedProducts = featuredDocs.map(mapProduct).filter(Boolean) as Product[];
  }

  // Generate Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author || 'Star Hi Herbs Expert'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Star Hi Herbs',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg'
      }
    },
    description: post.excerpt
  };

  return (
    <>
      <JsonLd data={articleSchema} />
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
