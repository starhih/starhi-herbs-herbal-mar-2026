import { MetadataRoute } from 'next';
import { getPayloadClient } from '@/lib/payload';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://starhiherbs.com';
  const payload = await getPayloadClient();

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // Fetch categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    pagination: false,
    select: { slug: true },
  });
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/collections/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch products
  const { docs: products } = await payload.find({
    collection: 'products',
    pagination: false,
    select: { slug: true },
  });
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Fetch blog categories
  const { docs: blogCategories } = await payload.find({
    collection: 'blog-categories',
    pagination: false,
    select: { slug: true },
  });
  const blogCategoryRoutes = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch blog posts
  const { docs: blogPosts } = await payload.find({
    collection: 'blog-posts',
    pagination: false,
    select: { slug: true, updatedAt: true },
  });
  const blogPostRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...blogCategoryRoutes, ...blogPostRoutes];
}
