import HeroSection from '@/components/home/HeroSection';
import AboutIntroSection from '@/components/home/AboutIntroSection';
import StatisticsSection from '@/components/home/StatisticsSection';
import FeaturedHighlights from '@/components/home/FeaturedHighlights';
import CertificationCarousel from '@/components/home/CertificationCarousel';
import ProductCategories from '@/components/home/ProductCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import AwardsSection from '@/components/home/AwardsSection';
import EventsSection from '@/components/home/EventsSection';
import VideoStory from '@/components/home/VideoStory';
import BlogInsights from '@/components/home/BlogInsights';
import CatalogueDownload from '@/components/home/CatalogueDownload';

import { getPayloadClient } from '@/lib/payload';
import { mapProduct, mapCategory, mapBlogPost, mapBlogCategory, mapEvent, mapAward, mapCertification, getImageUrl } from '@/lib/mappers';
import { ProductCategory } from '@/data/types';

// Force static generation unless we want dynamic updates on every request
// But for Payload integration, we might want revalidation.
export const revalidate = 600; // Revalidate every 10 minutes

export default async function Home() {
  const payload = await getPayloadClient();

  // 1. Fetch Product of the Month (set via admin panel checkbox)
  let productOfTheMonth = null;
  let tagline = 'Featured Product';

  const { docs: potmDocs } = await payload.find({
    collection: 'products',
    where: { productOfTheMonth: { equals: true } },
    limit: 1,
  });

  if (potmDocs.length > 0) {
    productOfTheMonth = mapProduct(potmDocs[0]);
    tagline = (potmDocs[0] as any).productOfTheMonthTagline || 'Featured Product';
  }

  // 2. Fetch Product Categories
  // We want to fetch all categories that are "active" or just all
  const { docs: categoryDocs } = await payload.find({
    collection: 'categories',
    pagination: false
  });
  // Filter for top level or specific ones if needed? For now all.
  let categories = categoryDocs.map((c) => mapCategory(c as any)).filter((c): c is ProductCategory => c !== null);

  // Custom sort for categories: Standardized, Organic, Branded, Probiotics, Vitamins and Minerals, Bulk Formulations
  const categoryOrder = [
    'standardized',
    'organic',
    'branded',
    'probiotics',
    'vitamins',
    'bulk'
  ];
  categories.sort((a, b) => {
    const aIndex = categoryOrder.findIndex(keyword => a.name.toLowerCase().includes(keyword));
    const bIndex = categoryOrder.findIndex(keyword => b.name.toLowerCase().includes(keyword));
    // If both are found, sort by their position in the order array
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    // If only one is found, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    // Otherwise keep default
    return 0;
  });

  // 3. Fetch Latest Blog Posts
  const { docs: postDocs } = await payload.find({
    collection: 'blog-posts',
    sort: '-publishedAt',
    limit: 3
  });
  const latestPosts = postDocs.map(mapBlogPost);

  // 4. Fetch Blog Categories for insights
  const { docs: blogCategoryDocs } = await payload.find({
    collection: 'blog-categories',
    pagination: false
  });
  const blogCategories = blogCategoryDocs.map(mapBlogCategory);

  // 5. Fetch News items from News collection + blog posts with showInNewsTicker
  const { docs: newsDocs } = await payload.find({
    collection: 'news',
    where: { active: { equals: true } },
    sort: 'order',
    pagination: false,
  });

  const { docs: tickerBlogDocs } = await payload.find({
    collection: 'blog-posts',
    where: { showInNewsTicker: { equals: true } },
    sort: '-publishedAt',
    limit: 10,
  });

  const newsFromCollection = newsDocs.map((n: any) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt || '',
    date: n.date || '',
    category: n.category || '',
    image: getImageUrl(n.image) || n.imageUrl || '',
    url: n.url || '/news',
  }));

  const newsFromBlog = tickerBlogDocs.map((b: any) => ({
    id: `blog-${b.id}`,
    title: b.title,
    excerpt: b.excerpt || '',
    date: b.publishedAt || '',
    category: 'Blog',
    image: getImageUrl(b.image) || b.imageUrl || '',
    url: `/blog/${b.slug}`,
  }));

  const newsItems = [...newsFromCollection, ...newsFromBlog];

  // 6. Fetch Awards
  const { docs: awardDocs } = await payload.find({
    collection: 'awards',
    pagination: false,
  });
  const awards = awardDocs.map(mapAward).filter(Boolean);

  // 7. Fetch Certifications (for homepage carousel)
  const { docs: certDocs } = await payload.find({
    collection: 'certifications',
    pagination: false,
  });
  let certifications = certDocs.map(mapCertification).filter(Boolean);

  // Custom sort for certifications: ISO, FSSC, USDA, WHO GMP, EU Organic, etc
  const certOrder = [
    'iso',
    'fssc',
    'usda',
    'who',
    'eu',
  ];
  certifications.sort((a, b) => {
    const aIndex = certOrder.findIndex(keyword => a.name.toLowerCase().includes(keyword));
    const bIndex = certOrder.findIndex(keyword => b.name.toLowerCase().includes(keyword));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  // 8. Fetch Events
  const { docs: eventDocs } = await payload.find({
    collection: 'events',
    where: { upcoming: { equals: true } },
    pagination: false,
  });
  const events = eventDocs.map(mapEvent).filter(Boolean);

  return (
    <>
      <HeroSection />
      <AboutIntroSection />
      {productOfTheMonth && (
        <FeaturedHighlights
          product={productOfTheMonth}
          tagline={tagline}
          newsItems={newsItems}
        />
      )}
      <CertificationCarousel certifications={certifications} />
      <ProductCategories categories={categories} />
      <WhyChooseUs />
      <AwardsSection awards={awards} />
      <EventsSection events={events} />
      <VideoStory />
      <BlogInsights posts={latestPosts} categories={blogCategories} />
      <CatalogueDownload />

    </>
  );
}
