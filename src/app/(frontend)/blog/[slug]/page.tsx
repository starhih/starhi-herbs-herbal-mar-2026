import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPayloadClient } from '@/lib/payload';
import { mapBlogPost, mapProduct } from '@/lib/mappers';
import { Product } from '@/data/types';
import JsonLd from '@/components/seo/JsonLd';
import { BlogLiveView } from '@/components/blog/BlogLiveView';

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
      title: 'Post Not Found | Star Hi Herbs',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Star Hi Herbs Blog`,
    description: post.excerpt,
    keywords: [post.category, ...post.tags, 'herbal extracts', 'wellness', 'nutraceuticals'].join(', '),
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || 'Star Hi Herbs'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const search = (await searchParams) || {};
  let isDraft = search.preview === 'true';
  try {
    const { draftMode } = await import('next/headers');
    const { isEnabled } = await draftMode();
    if (isEnabled) isDraft = true;
  } catch (_e) {}

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { slug: { equals: slug } },
        ...(!isDraft
          ? [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]
          : []),
      ],
    },
    draft: isDraft,
    limit: 1,
  });
  const rawDoc = docs[0] || null;
  const post = rawDoc ? mapBlogPost(rawDoc) : null;

  if (!post || !rawDoc) {
    notFound();
  }

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

  const matchedProducts = (allProductsDocs
    .map(mapProduct)
    .filter(Boolean) as Product[])
    .filter((product) => {
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
      <BlogLiveView
        initialDoc={rawDoc}
        initialPost={post}
        relatedPosts={relatedPosts}
        blogRelatedProducts={blogRelatedProducts}
      />
    </>
  );
}
