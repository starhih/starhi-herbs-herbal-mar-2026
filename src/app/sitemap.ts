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
    '/terms-conditions'
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
    select: { slug: true, updatedAt: true },
  });
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/collections/${category.slug}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch products
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1000,
    select: { slug: true, productType: true, updatedAt: true },
  });
  const productRoutes = products.map((product) => {
    let urlPath = `/products/${product.slug}`;
    if (product.productType === 'branded') urlPath = `/branded-ingredients/${product.slug}`;
    if (product.productType === 'vitamin-mineral') urlPath = `/vitamins-minerals/${product.slug}`;
    
    return {
      url: `${baseUrl}${urlPath}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // Fetch blog categories
  const { docs: blogCategories } = await payload.find({
    collection: 'blog-categories',
    limit: 100,
    select: { slug: true, updatedAt: true },
  });
  const blogCategoryRoutes = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(category.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch blog posts
  const { docs: blogPosts } = await payload.find({
    collection: 'blog-posts',
    limit: 1000,
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
