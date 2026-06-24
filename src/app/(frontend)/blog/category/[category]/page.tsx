import { Metadata } from 'next';
import Image from '@/components/ui/image';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { mapBlogCategory, mapBlogPost } from '@/lib/mappers';
import { BlogCategory } from '@/data/types';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogSearchBar from '@/components/blog/BlogSearchBar';
import Breadcrumbs from '@/components/ui/breadcrumbs';

// Generate static params for all categories
// Generate static params for all categories
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: categories } = await payload.find({
    collection: 'blog-categories',
    limit: 100,
    select: { slug: true }
  });
  return categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category page
// Generate metadata for each category page
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-categories',
    where: { slug: { equals: categorySlug } },
    limit: 1
  });
  const category = docs[0] ? mapBlogCategory(docs[0]) : null;

  if (!category) {
    return {
      title: 'Category Not Found | Star Hi Herbs Blog',
      description: 'The requested blog category could not be found.',
    };
  }

  const title = `${category.name} | Star Hi Herbs Blog`;
  const description = category.description || `Read our latest articles and research about ${category.name} at the Star Hi Herbs Knowledge Center.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/category/${categorySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/category/${categorySlug}`,
      siteName: 'Star Hi Herbs',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ik.imagekit.io/pon54xoks/website.jpg'],
    },
  };
}

// Set dynamic to force-static for static export
export const dynamic = 'force-static';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-categories',
    where: { slug: { equals: categorySlug } },
    limit: 1
  });
  const category = docs[0] ? mapBlogCategory(docs[0]) : null;

  if (!category) {
    notFound();
  }

  // Fetch posts in this category
  const { docs: postDocs } = await payload.find({
    collection: 'blog-posts',
    where: { category: { equals: category.id } },
    sort: '-publishedAt'
  });
  const posts = postDocs.map(mapBlogPost);

  // Fetch all categories for sidebar
  const { docs: allCategoryDocs } = await payload.find({
    collection: 'blog-categories',
    limit: 100
  });
  const blogCategories = allCategoryDocs.map(mapBlogCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[30vh] min-h-[250px] flex items-center">
        <div className="absolute inset-0 bg-[#214842]"></div>
        <div className="relative z-10 container-custom text-white">
          <h1 className="mb-4">{category.name}</h1>
          <p className="text-xl max-w-2xl text-white/90">
            {category.description}
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: category.name, href: `/blog/category/${category.slug}`, isCurrent: true }
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
              <BlogCategoryList
                categories={blogCategories}
                activeCategory={categorySlug}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-[#214842] mb-8">
                {category.name} Articles
              </h2>

              {posts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} category={category} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl text-center">
                  <h3 className="text-xl font-semibold text-[#214842] mb-2">No Articles Found</h3>
                  <p className="text-gray-600">
                    There are currently no articles in this category. Please check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
