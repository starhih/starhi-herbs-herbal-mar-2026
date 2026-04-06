import Image from '@/components/ui/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Award, FlaskRound as Flask, Leaf } from 'lucide-react';
import { Product } from '@/data/types';
import { getPayloadClient } from '@/lib/payload';
import { mapProduct } from '@/lib/mappers';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import SupplierInfo from '@/components/products/SupplierInfo';
import ProductionDetails from '@/components/products/ProductionDetails';
import Packaging from '@/components/products/Packaging';
import Factory from '@/components/products/Factory';
import CertificationsSection from '@/components/products/CertificationsSection';
import Events from '@/components/products/Events';
import Research from '@/components/products/Research';
import ProductFAQs from '@/components/products/ProductFAQs';
import StorgChildProducts from '@/components/products/StorgChildProducts';
import StorgIndications from '@/components/products/StorgIndications';

// Generate static params for all products
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 100,
    select: { slug: true }
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for each product page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const product = docs[0] ? mapProduct(docs[0]) : null;

  if (!product) {
    return {
      title: 'Product Not Found | Star Hi Herbs',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} | ${product.categoryName} | Star Hi Herbs`,
    description: product.description || `${product.name} - ${product.standardization} - High-quality herbal extract by Star Hi Herbs.`,
    keywords: [product.name, product.categoryName, product.standardization, 'herbal extract', 'nutraceutical', ...product.certifications].join(', '),
    openGraph: {
      title: `${product.name} | ${product.categoryName}`,
      description: product.description || `${product.name} - ${product.standardization} - High-quality herbal extract by Star Hi Herbs.`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const product = docs[0] ? mapProduct(docs[0]) : null;

  if (!product) {
    notFound();
  }

  // Redirect to specialized templates based on product type
  if (product.productType === 'branded') {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-lg mb-4">Redirecting to branded ingredient page...</p>
        <meta httpEquiv="refresh" content={`0;url=/branded-ingredients/${product.slug}`} />
      </div>
    );
  }

  if (product.productType === 'vitamin-mineral') {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-lg mb-4">Redirecting to vitamins & minerals page...</p>
        <meta httpEquiv="refresh" content={`0;url=/vitamins-minerals/${product.slug}`} />
      </div>
    );
  }

  // Get related products
  const { docs: relatedDocs } = await payload.find({
    collection: 'products',
    where: {
      category: { equals: product.categoryId },
      slug: { not_equals: slug },
    },
    limit: 3,
  });

  const relatedProducts = relatedDocs.map(mapProduct).filter(Boolean) as Product[];

  // Fetch child products if this is a parent product
  let childProductsList: Product[] = [];
  if (product.isParentProduct && product.childProducts && product.childProducts.length > 0) {
    const { docs: childDocs } = await payload.find({
      collection: 'products',
      where: { id: { in: product.childProducts } },
      limit: 50,
    });
    childProductsList = childDocs.map(mapProduct).filter(Boolean) as Product[];
  }

  // Fetch parent product if this is a child product
  let parentProduct: Product | null = null;
  if (product.parentProductId) {
    const { docs: parentDocs } = await payload.find({
      collection: 'products',
      where: { id: { equals: product.parentProductId } },
      limit: 1,
    });
    parentProduct = parentDocs[0] ? mapProduct(parentDocs[0]) : null;
  }

  return (
    <>
      {/* Product Hero */}
      <section className="pt-24 md:pt-32 pb-8">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: product.categoryName || 'Category', href: `/collections/${product.categorySlug || ''}` },
              { label: product.name, href: `/products/${product.slug}`, isCurrent: true }
            ]}
            showHomeLink={true}
          />
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={product.image}
                  fallbackSrc={product.imageFallback}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  quality={85}
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-6">
                <Link href={`/collections/${product.categorySlug}`} className="text-[#258F67] mb-2 hover:underline inline-block">
                  {product.categoryName}
                </Link>
                <h1 className="text-[#214842] mb-2">{product.name}</h1>

                {/* Common Name, Latin Name and Plant Part */}
                <div className="mb-4 space-y-1">
                  {product.commonName && (
                    <p className="text-gray-700 font-medium">
                      Common Name: {product.commonName}
                    </p>
                  )}
                  {product.latinName && (
                    <p className="text-gray-700 italic">
                      {product.latinName}
                      {product.plantPart && ` (${product.plantPart})`}
                    </p>
                  )}
                  {!product.latinName && product.plantPart && (
                    <p className="text-gray-700">
                      Plant Part: {product.plantPart}
                    </p>
                  )}
                </div>
                {product.moq && (
                  <div className="mb-4">
                    <span className="inline-flex text-[#214842] font-medium bg-[#214842]/10 px-3 py-1 rounded-full text-sm border border-[#214842]/20 shadow-sm">
                      MOQ: {product.moq}
                    </span>
                  </div>
                )}

                {product.standardization && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#214842]/10 text-[#214842] rounded-full">
                      {product.standardization}
                    </span>
                  </div>
                )}

                {/* Certification Icons */}
                {product.certificationIcons && product.certificationIcons.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {product.certificationIcons.map((cert) => (
                      <div key={cert.name} className="relative h-12 w-12 group">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                          {cert.name}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Short Description (if available) */}
                {product.shortDescription && (
                  <p className="text-[#258F67] font-medium mb-3">{product.shortDescription}</p>
                )}

                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1 cta-primary">
                  <Link href="/request-quote" className="flex items-center justify-center">
                    Request Quote
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/request-sample" className="flex items-center justify-center">
                    Request Sample
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storg Indications Section (for Storg products) */}
      {product.categoryId === 'vitamins-minerals' && product.indications && product.indications.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Health Support</h6>
              <h2 className="text-[#214842] mb-4">Health Indications</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {product.name} is specifically formulated to support these key health areas.
              </p>
            </div>
            <StorgIndications product={product} />
          </div>
        </section>
      )}

      {/* Product Details */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Features */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#214842]/10 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Key Features</h3>
              </div>
              <ul className="space-y-2">
                {product.benefits?.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applications */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#214842]/10 p-2 rounded-lg">
                  <Flask className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Applications</h3>
              </div>
              <ul className="space-y-2">
                {product.applications?.map((application, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-[#EFC368] rounded-full mr-2"></span>
                    {application}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#214842]/10 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-[#214842]" />
                </div>
                <h3 className="text-xl font-semibold text-[#214842]">Specifications</h3>
              </div>
              <div className="space-y-3">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/[_]/g, ' ')}
                    </div>
                    <div className="text-gray-600">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Child Products Section (if this is a parent product) */}
      {product.isParentProduct && product.childProducts && product.childProducts.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <StorgChildProducts
              childProducts={childProductsList}
            />
          </div>
        </section>
      )}

      {/* Parent Product Section (if this is a child product) */}
      {product.parentProductId && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Product Family</h6>
              <h2 className="text-[#214842] mb-4">Part of Storg® Product Line</h2>
            </div>

            {(() => {
              if (!parentProduct) return null;

              return (
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="relative h-[300px] md:h-full">
                      <Image
                        src={parentProduct.image}
                        fallbackSrc={parentProduct.imageFallback}
                        alt={parentProduct.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold text-[#214842] mb-4">{parentProduct.name}</h3>
                      <p className="text-gray-700 mb-6">{parentProduct.shortDescription}</p>
                      <Button asChild className="bg-[#214842] hover:bg-[#214842]/90">
                        <Link href={`/products/${parentProduct.slug}`} className="flex items-center gap-2">
                          View Product Family <ArrowRight size={16} />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Research Section (if available) */}
      {product.research && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <Research research={product.research} />
          </div>
        </section>
      )}

      {/* Production Process Section (if available) */}
      {product.productionDetails && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Process</h6>
              <h2 className="text-[#214842] mb-4">How We Make It</h2>
            </div>
            <ProductionDetails
              description={product.productionDetails.description}
              image={product.productionDetails.image}
            />
          </div>
        </section>
      )}

      {/* Packaging Section (if available) */}
      {product.packaging && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <Packaging
              description={product.packaging.description}
              image={product.packaging.image}
            />
          </div>
        </section>
      )}

      {/* Factory Section (if available) */}
      {product.factory && (
        <section className="section-padding">
          <div className="container-custom">
            <Factory
              description={product.factory.description}
              image={product.factory.image}
            />
          </div>
        </section>
      )}

      {/* Certifications Section (if available) */}
      {product.certificationsSection && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <CertificationsSection
              description={product.certificationsSection.description}
              image={product.certificationsSection.image}
              images={product.certificationsSection.images}
              certifications={product.certifications}
            />
          </div>
        </section>
      )}

      {/* Events Section (if available) */}
      {product.events && (
        <section className="section-padding">
          <div className="container-custom">
            <Events
              description={product.events.description}
              image={product.events.image}
              images={product.events.images}
            />
          </div>
        </section>
      )}

      {/* Supplier Info Section (if available) */}
      {product.supplierInfo && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Supplier Guidelines</h6>
              <h2 className="text-[#214842] mb-4">Sourcing Recommendations</h2>
            </div>
            <SupplierInfo points={product.supplierInfo.points} />
          </div>
        </section>
      )}

      {/* FAQs Section (if available) */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Common Questions</h6>
              <h2 className="text-[#214842] mb-4">Frequently Asked Questions</h2>
            </div>
            <ProductFAQs faqs={product.faqs} />
          </div>
        </section>
      )}


      {/* Related Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Explore More</h6>
            <h2 className="text-[#214842] mb-4">Related Products</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
