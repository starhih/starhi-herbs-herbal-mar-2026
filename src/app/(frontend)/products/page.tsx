import Image from '@/components/ui/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getPayloadClient } from '@/lib/payload';
import { mapCategory, mapProduct } from '@/lib/mappers';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/products/CategoryCard';
import ProductsPageClient from '@/components/products/ProductsPageClient';
import JsonLd from '@/components/seo/JsonLd';

// Define metadata for the products page
export const metadata: Metadata = {
  title: 'Our Products | Herbal Extracts Manufacturer in India',
  description: 'Explore our comprehensive range of high-quality herbal extracts, probiotics, and nutraceuticals. Premium B2B botanical ingredients from Star Hi Herbs.',
  keywords: 'herbal extracts, organic extracts, nutraceutical ingredients, standardized extracts, probiotics, herbal extract manufacturer in bangalore, top herbal extract manufacturer in india, b2b herbs',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Our Products | Herbal Extracts Manufacturer in India',
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

  // Fetch categories from Payload
  const { docs: categoryDocs } = await payload.find({
    collection: 'categories',
    limit: 100,
  });
  const productCategories = categoryDocs.map((c) => mapCategory(c as any)).filter(Boolean) as any[];

  // Fetch featured products from Payload
  const { docs: featuredDocs } = await payload.find({
    collection: 'products',
    where: { featured: { equals: true } },
    limit: 3,
  });
  const featuredProducts = featuredDocs.map(mapProduct).filter(Boolean) as any[];

  // Fetch all products for the A-Z Ingredient Directory to eliminate orphan pages
  const { docs: allProductDocs } = await payload.find({
    collection: 'products',
    limit: 500,
  });
  const allProducts = allProductDocs.map(mapProduct).filter(Boolean) as any[];

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

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://starhiherbs.com/products"
          },
          url: "https://starhiherbs.com/products",
          name: "Star Hi Herbs Botanical Extract Products",
          description: "Browse our full collection of standardized herbal extracts, branded ingredients, and vitamin solutions.",
          publisher: {
            "@id": "https://starhiherbs.com/#organization"
          }
        }}
      />
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
            featuredProducts={featuredProducts}
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
