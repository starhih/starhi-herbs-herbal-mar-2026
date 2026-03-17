import Image from '@/components/ui/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getPayloadClient } from '@/lib/payload';
import { mapCategory, mapProduct } from '@/lib/mappers';
import { Product } from '@/data/types';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import StorgProductFamily from '@/components/products/StorgProductFamily';
import ProductListingClient from '@/components/products/ProductListingClient';
import CategoryDetails from '@/components/collections/CategoryDetails';

// Generate static params for all categories
// Generate static params for all categories
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
    select: { slug: true }
  });

  return categories.map((category) => ({
    category: category.slug,
  }));
}

// Generate metadata for each category page
// Generate metadata for each category page
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'categories',
    where: {
      slug: { equals: categorySlug }
    },
    limit: 1
  });
  const category = docs[0] ? mapCategory(docs[0]) : null;

  if (!category) {
    return {
      title: 'Category Not Found | Star Hi Herbs',
      description: 'The requested product category could not be found.',
    };
  }

  return {
    title: `${category.name} | Star Hi Herbs`,
    description: category.description || `Explore our range of high-quality ${category.name.toLowerCase()} products by Star Hi Herbs.`,
    keywords: [category.name, 'herbal extracts', 'nutraceutical ingredients', 'Star Hi Herbs'].join(', '),
    openGraph: {
      title: category.name,
      description: category.description || `Explore our range of high-quality ${category.name.toLowerCase()} products by Star Hi Herbs.`,
      images: [
        {
          url: category.heroImage || category.image,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const payload = await getPayloadClient();

  // Fetch category
  const { docs: categoryDocs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug } },
    limit: 1
  });
  const category = categoryDocs[0] ? mapCategory(categoryDocs[0]) : null;

  if (!category) {
    notFound();
  }

  // Fetch products in this category
  const { docs: productDocs } = await payload.find({
    collection: 'products',
    where: {
      // Assuming relationship uses ID. If slug matches 'category.slug', query nested.
      // Or if we query by category ID using category.id
      category: { equals: category.id }
    },
    limit: 100 // fetch all or paginate? for now limit 100
  });

  const categoryProducts = productDocs.map(mapProduct).filter(Boolean) as Product[];

  // Special handling for Storg main product
  let mainProduct: Product | undefined;
  if (categorySlug === 'vitamins-minerals') {
    const { docs: mainDocs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: 'storg-plant-based-vitamins-minerals' } },
      limit: 1
    });
    if (mainDocs[0]) {
      const mapped = mapProduct(mainDocs[0]);
      if (mapped) mainProduct = mapped;
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <Image
          src={category.heroImage || category.image}
          fallbackSrc={category.heroImageFallback || category.imageFallback}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 container-custom text-white">
          <div className="max-w-xl">
            <div className="inline-block mb-3">
              <span className="bg-[#EFC368] text-[#214842] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Collection
              </span>
            </div>
            <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight">
              {category.name}
            </h1>
            <div className="w-16 h-1 bg-[#EFC368] mb-4 rounded-full"></div>
            <p className="text-lg text-white/90 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-4 bg-gray-50 border-b">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: category.name, href: `/collections/${category.slug}`, isCurrent: true }
            ]}
            showHomeLink={true}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="pt-12 pb-20">
        <div className="container-custom">
          {categorySlug === 'vitamins-minerals' ? (
            <>
              {/* Storg Product Family */}
              {mainProduct && mainProduct.childProducts && (
                (() => {
                  const childProducts = categoryProducts.filter(p =>
                    mainProduct!.childProducts?.includes(String(p.id))
                  );

                  return (
                    <StorgProductFamily
                      mainProduct={mainProduct}
                      childProducts={childProducts}
                    />
                  );
                })()
              )}
            </>
          ) : (
            <ProductListingClient
              category={category}
              initialProducts={categoryProducts}
            />
          )}
        </div>
      </section>

      {/* Category Details & FAQs */}
      <CategoryDetails longDescription={category.longDescription} faqs={category.faqs} />

      {/* Request Quote CTA */}
      <section className="section-padding bg-[#2A5A52] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Interested in Our Products?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Get in touch with our team for pricing, samples, and technical documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="cta-primary">
              <Link href="/request-quote">Request Quote</Link>
            </Button>
            <Button asChild className="bg-white text-[#214842] hover:bg-[#EFC368]">
              <Link href="/request-sample">Request Sample</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
