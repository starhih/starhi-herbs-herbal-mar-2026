import Image from '@/components/ui/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getPayloadClient } from '@/lib/payload';
import { mapCategory, mapProduct, getImageUrl } from '@/lib/mappers';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import JsonLd from '@/components/seo/JsonLd';

// Define metadata for the products page
export const metadata: Metadata = {
  title: 'Our Products | Herbal Extracts Manufacturer & Exporter in India',
  description: 'Explore our comprehensive range of high-quality herbal extracts, probiotics, and nutraceuticals. Premium B2B botanical ingredients from Star Hi Herbs.',
  keywords: 'herbal extracts, organic extracts, nutraceutical ingredients, standardized extracts, probiotics, herbal extract manufacturer and exporter in bangalore, top herbal extract manufacturer and exporter in india, b2b herbs',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Our Products | Herbal Extracts Manufacturer & Exporter in India',
    description: 'Explore our comprehensive range of high-quality herbal extracts, probiotics, and nutraceuticals. Premium B2B botanical ingredients from Star Hi Herbs.',
    images: [
      {
        url: '/images/hero/standardized-herbal-extracts.jpeg',
        width: 1200,
        height: 630,
        alt: 'Star Hi Herbs Products',
      },
    ],
    type: 'website',
  },
};

export default async function ProductsPage() {
  const payload = await getPayloadClient();

  // Run all database queries concurrently with field selection for directory
  const [
    { docs: categoryDocs },
    { docs: targetFeaturedDocs },
    { docs: fallbackFeaturedDocs },
    { docs: allProductDocs },
  ] = await Promise.all([
    // 1. Fetch categories from Payload
    payload.find({
      collection: 'categories',
      limit: 100,
    }),
    // 2. Fetch specific popular/featured ingredients: Coleus, Sesamin, Turmeric
    payload.find({
      collection: 'products',
      where: {
        or: [
          { slug: { equals: 'coleus-forskohlii-extract' } },
          { slug: { equals: 'sesamin-extract' } },
          { slug: { equals: 'turmeric' } },
        ],
      },
      limit: 10,
    }),
    // 3. Fallback featured products
    payload.find({
      collection: 'products',
      where: { featured: { equals: true } },
      limit: 5,
    }),
    // 4. Fetch lightweight product projections for the A-Z Ingredient Directory
    payload.find({
      collection: 'products',
      limit: 5000,
      select: {
        name: true,
        slug: true,
        latinName: true,
        productType: true,
        shortDescription: true,
        image: true,
        imageUrl: true,
      },
      depth: 1,
    }),
  ]);

  const productCategories = categoryDocs.map((c) => mapCategory(c as any)).filter(Boolean) as any[];

  // Custom sort for categories: Standardized, Organic, Branded, Probiotics, Vitamins and Minerals, Bulk Formulations
  const categoryOrder = [
    'standardized',
    'organic',
    'branded',
    'probiotics',
    'vitamins',
    'bulk'
  ];
  productCategories.sort((a: any, b: any) => {
    const aIndex = categoryOrder.findIndex(keyword => a.name.toLowerCase().includes(keyword));
    const bIndex = categoryOrder.findIndex(keyword => b.name.toLowerCase().includes(keyword));
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  const featuredMapped = targetFeaturedDocs.map(mapProduct).filter(Boolean) as any[];

  // Sort them in the exact order requested: Coleus first, Sesamin second, Turmeric third
  const orderSlug = ['coleus-forskohlii-extract', 'sesamin-extract', 'turmeric'];
  const featuredProducts = featuredMapped.sort((a, b) => {
    return orderSlug.indexOf(a.slug) - orderSlug.indexOf(b.slug);
  });

  // Fallback to general featured products if any are missing to ensure we always show 3
  if (featuredProducts.length < 3) {
    const fallbackProducts = fallbackFeaturedDocs.map(mapProduct).filter(Boolean) as any[];
    for (const fb of fallbackProducts) {
      if (featuredProducts.length >= 3) break;
      if (!featuredProducts.some(p => p.id === fb.id)) {
        featuredProducts.push(fb);
      }
    }
  }

  // Map lightweight products for A-Z directory
  const allProducts = allProductDocs.map((p: any) => ({
    id: p.id,
    name: p.name || '',
    slug: p.slug || '',
    latinName: p.latinName || '',
    productType: p.productType || 'standardized',
    shortDescription: p.shortDescription || '',
    image: getImageUrl(p.image) || p.imageUrl || '',
  }));

  // Group products alphabetically
  const alphabetGroups: { [key: string]: any[] } = {};
  allProducts.forEach((product) => {
    const firstLetter = product.name.trim().charAt(0).toUpperCase();
    const groupKey = /^[A-Z]/.test(firstLetter) ? firstLetter : '#';
    if (!alphabetGroups[groupKey]) {
      alphabetGroups[groupKey] = [];
    }
    alphabetGroups[groupKey].push(product);
  });

  const sortedGroupKeys = Object.keys(alphabetGroups).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });

  sortedGroupKeys.forEach((key) => {
    alphabetGroups[key].sort((a, b) => a.name.localeCompare(b.name));
  });

  // Generate products schema with ItemList
  const productsPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://starhiherbs.com/products"
    },
    "url": "https://starhiherbs.com/products",
    "name": "Star Hi Herbs Botanical Extract Products",
    "description": "Browse our full collection of standardized herbal extracts, branded ingredients, and vitamin solutions.",
    "publisher": {
      "@id": "https://starhiherbs.com/#organization"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": allProducts.length,
      "itemListElement": allProducts.map((p, index) => {
        let productUrl = `/products/${p.slug}`;
        if (p.productType === 'branded') productUrl = `/branded-ingredients/${p.slug}`;
        if (p.productType === 'vitamin-mineral') productUrl = `/vitamins-minerals/${p.slug}`;
        
        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": p.name,
            "image": p.image,
            "description": p.shortDescription || p.name,
            "url": `https://starhiherbs.com${productUrl}`,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `https://starhiherbs.com${productUrl}`
            }
          }
        };
      })
    }
  };

  return (
    <>
      <JsonLd data={productsPageSchema} />
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center">
        <Image src="https://ik.imagekit.io/pon54xoks/About-Star-Hi-Herbs-01.jpg"
          alt="Our Products"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#214842]/30"></div>
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-shadow-sm">Our Products</h1>
            <p className="text-xl text-white text-shadow-sm">
              Discover our comprehensive range of high-quality herbal extracts and nutraceutical ingredients.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <ProductsPageClient
            categories={productCategories}
          />
        </div>
      </section>

      {/* Product Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Browse By Category</h6>
            <h2 className="text-[#214842] mb-4">Product Categories</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Featured Products</h6>
            <h2 className="text-[#214842] mb-4">Popular Ingredients</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Alphabetical Ingredient Directory */}
      <section className="section-padding bg-white border-t border-b">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">A-Z Directory</h6>
            <h2 className="text-[#214842] mb-4">Ingredient Directory</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete list of botanical extracts, vitamins, minerals, and probiotic strains.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {sortedGroupKeys.map((key) => (
                <div key={key} className="space-y-3">
                  <div className="text-2xl font-bold text-[#258F67] border-b pb-2 border-gray-200">
                    {key}
                  </div>
                  <ul className="space-y-2">
                    {alphabetGroups[key].map((product) => {
                      const url = product.productType === 'branded'
                        ? `/branded-ingredients/${product.slug}`
                        : product.productType === 'vitamin-mineral'
                        ? `/vitamins-minerals/${product.slug}`
                        : `/products/${product.slug}`;

                      return (
                        <li key={product.id}>
                          <Link
                            href={url}
                            className="text-gray-700 hover:text-[#258F67] text-sm transition-colors duration-150 inline-block py-0.5"
                          >
                            {product.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Request Custom Solution */}
      <section className="section-padding bg-[#2A5A52] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Our team of experts can help develop custom formulations tailored to your specific needs.
          </p>
          <Button asChild className="cta-primary">
            <Link href="/contact" className="flex items-center">
              Request Custom Solution
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
