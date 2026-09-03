import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { mapBlogTag, mapBlogPost, mapBlogCategory } from '@/lib/mappers';
import BlogCard from '@/components/blog/BlogCard';
import BlogCategoryList from '@/components/blog/BlogCategoryList';
import BlogSearchBar from '@/components/blog/BlogSearchBar';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: tags } = await payload.find({
    collection: 'blog-tags',
    limit: 100,
    select: { slug: true }
  });
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-tags',
    where: { slug: { equals: slug } },
    limit: 1
  });
  const tagObj = docs[0];

  if (!tagObj) {
    return {
      title: 'Tag Not Found | Star Hi Herbs Blog',
      description: 'The requested blog tag could not be found.',
    };
  }

  const title = `Posts tagged "${tagObj.name}" | Star Hi Herbs Blog`;
  const description = `Read our latest articles, insights, and research tagged with "${tagObj.name}" at Star Hi Herbs Corporate Knowledge Center.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/tag/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/blog/tag/${slug}`,
      siteName: 'Star Hi Herbs',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://ik.imagekit.io/pon54xoks/website.jpg',
          width: 1200,
          height: 630,
          alt: tagObj.name,
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

export const dynamic = 'force-static';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  
  // 1. Fetch the tag
  const { docs } = await payload.find({
    collection: 'blog-tags',
    where: { slug: { equals: slug } },
    limit: 1
  });
  const tagDoc = docs[0];

  if (!tagDoc) {
    notFound();
  }

  const tag = mapBlogTag(tagDoc);

  // 2. Fetch posts that have this tag
  const { docs: postDocs } = await payload.find({
    collection: 'blog-posts',
    where: { tags: { in: [tagDoc.id] } },
    sort: '-publishedAt'
  });
  const posts = postDocs.map(mapBlogPost);

  // 3. Fetch all categories for sidebar
  const { docs: allCategoryDocs } = await payload.find({
    collection: 'blog-categories',
    limit: 100
  });
  const blogCategories = allCategoryDocs.map(mapBlogCategory);

  return (
    <>
      <section className="relative h-[30vh] min-h-[250px] flex items-center">
        <div className="absolute inset-0 bg-[#214842]"></div>
        <div className="relative z-10 container-custom text-white">
          <h1 className="mb-4 text-3xl font-bold">Tag: {tag.name}</h1>
          <p className="text-xl max-w-2xl text-white/90">
            Exploring all articles related to {tag.name.toLowerCase()}
          </p>
        </div>
      </section>

      <section className="border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: 'Tags', href: '/blog' },
              { label: tag.name, href: `/blog/tag/${tag.slug}`, isCurrent: true }
            ]}
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <BlogSearchBar className="mb-6" />
              <BlogCategoryList
                categories={blogCategories}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-[#214842] mb-8">
                Articles tagged &ldquo;{tag.name}&rdquo;
              </h2>

              {posts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} category={post.category} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl text-center">
                  <h3 className="text-xl font-semibold text-[#214842] mb-2">No Articles Found</h3>
                  <p className="text-gray-600">
                    There are currently no articles tagged with {tag.name}. Please check back later.
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
