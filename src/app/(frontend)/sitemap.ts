import { MetadataRoute } from 'next';
import { getPayloadClient } from '@/lib/payload';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://starhiherbs.com';
  const payload = await getPayloadClient();

  // Base routes - add any new static page here
  const staticPaths = [
    '',
    '/about',
    '/blog',
    '/branded-ingredients',
    '/careers',
    '/certifications',
    '/collections',
    '/contact',
    '/download-catalogue',
    '/innovation',
    '/news',
    '/privacy-policy',
    '/products',
    '/request-meeting',
    '/request-quote',
    '/request-sample',
    '/sustainability',
    '/terms-conditions',
    '/vitamins-minerals'
  ];

  const routes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '' || path === '/products' || path === '/blog' ? 'daily' : 'monthly') as 'daily' | 'monthly' | 'weekly',
    priority: path === '' ? 1 : path === '/products' || path === '/blog' ? 0.8 : 0.7,
  }));

  // Fetch categories
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
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
    limit: 100,
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
    limit: 100,
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
    limit: 100,
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
