import HeroSection from '@/components/home/HeroSection';
import AboutIntroSection from '@/components/home/AboutIntroSection';
import FeaturedHighlights from '@/components/home/FeaturedHighlights';
import BrandedIngredientsHighlight from '@/components/home/BrandedIngredientsHighlight';
import CertificationCarousel from '@/components/home/CertificationCarousel';
import ProductCategories from '@/components/home/ProductCategories';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import AwardsSection from '@/components/home/AwardsSection';
import EventsSection from '@/components/home/EventsSection';
import VideoStory from '@/components/home/VideoStory';
import BlogInsights from '@/components/home/BlogInsights';
import CatalogueDownload from '@/components/home/CatalogueDownload';
import SustainabilityImpact from '@/components/shared/SustainabilityImpact';
import { getPayloadClient } from '@/lib/payload';
import { mapProduct, mapCategory, mapBlogPost, mapBlogCategory, mapEvent, mapAward, mapCertification, getImageUrl, richTextToPlainText } from '@/lib/mappers';
import { ProductCategory } from '@/data/types';

// Force static generation unless we want dynamic updates on every request
// But for Payload integration, we might want revalidation.
export const revalidate = 600; // Revalidate every 10 minutes

export default async function Home() {
  const payload = await getPayloadClient();

  // Run all independent queries concurrently to minimize TTFB
  const [
    { docs: potmDocs },
    { docs: categoryDocs },
    { docs: postDocs },
    { docs: blogCategoryDocs },
    { docs: newsDocs },
    { docs: tickerBlogDocs },
    { docs: awardDocs },
    { docs: certDocs },
    { docs: eventDocs },
  ] = await Promise.all([
    // 1. Fetch Product of the Month
    payload.find({
      collection: 'products',
      where: { productOfTheMonth: { equals: true } },
      limit: 1,
    }),
    // 2. Fetch Product Categories
    payload.find({
      collection: 'categories',
      limit: 100,
    }),
    // 3. Fetch Latest Blog Posts
    payload.find({
      collection: 'blog-posts',
      sort: '-publishedAt',
      limit: 3,
    }),
    // 4. Fetch Blog Categories for insights
    payload.find({
      collection: 'blog-categories',
      limit: 100,
    }),
    // 5. Fetch News items
    payload.find({
      collection: 'news',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 100,
      depth: 2,
    }),
    // 5b. Fetch blog posts with showInNewsTicker
    payload.find({
      collection: 'blog-posts',
      where: { showInNewsTicker: { equals: true } },
      sort: '-publishedAt',
      limit: 10,
      depth: 2,
    }),
    // 6. Fetch Awards
    payload.find({
      collection: 'awards',
      limit: 100,
    }),
    // 7. Fetch Certifications
    payload.find({
      collection: 'certifications',
      limit: 100,
    }),
    // 8. Fetch Events
    payload.find({
      collection: 'events',
      where: { upcoming: { equals: true } },
      limit: 100,
    }),
  ]);

  // 1. Process Product of the Month
  let productOfTheMonth = null;
  let tagline = 'Featured Product';
  if (potmDocs.length > 0) {
    productOfTheMonth = mapProduct(potmDocs[0]);
    tagline = (potmDocs[0] as any).productOfTheMonthTagline || 'Featured Product';
  }

  // 2. Process Categories
  const categories = categoryDocs.map((c) => mapCategory(c as any)).filter((c): c is ProductCategory => c !== null);
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
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  // 3. Process Blog Posts
  const latestPosts = postDocs.map(mapBlogPost);

  // 4. Process Blog Categories
  const blogCategories = blogCategoryDocs.map(mapBlogCategory);

  // 5. Process News items
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
    excerpt: b.excerpt || (b.content ? richTextToPlainText(b.content) : ''),
    date: b.publishedAt || '',
    category: 'Blog',
    image: getImageUrl(b.image) || b.imageUrl || '',
    url: `/blog/${b.slug}`,
  }));

  const newsItems = [...newsFromCollection, ...newsFromBlog];

  // 6. Process Awards
  const awards = awardDocs.map(mapAward).filter(Boolean);

  // 7. Process Certifications
  const certifications = certDocs.map(mapCertification).filter(Boolean);
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

  // 8. Process Events
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
      <BrandedIngredientsHighlight />
      <SustainabilityImpact />
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
