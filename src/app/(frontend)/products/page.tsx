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

// Define metadata for the products page
export const metadata: Metadata = {
  title: 'Products | Star Hi Herbs',
  description: 'Explore our comprehensive range of high-quality herbal extracts and nutraceutical ingredients for health and wellness products.',
  keywords: 'herbal extracts, organic extracts, nutraceutical ingredients, standardized extracts, probiotics',
  openGraph: {
    title: 'Products | Star Hi Herbs',
    description: 'Explore our comprehensive range of high-quality herbal extracts and nutraceutical ingredients for health and wellness products.',
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

  return (
    <>
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
