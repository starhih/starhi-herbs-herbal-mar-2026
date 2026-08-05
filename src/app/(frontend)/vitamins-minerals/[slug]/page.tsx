import Image from '@/components/ui/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Download, Award, Leaf, ExternalLink, Beaker, BookOpen, Lightbulb, Recycle, CheckCircle } from 'lucide-react';
import { Product } from '@/data/types';
import { getPayloadClient } from '@/lib/payload';
import { mapProduct } from '@/lib/mappers';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import ProductCard from '@/components/products/ProductCard';
import ProductionDetails from '@/components/products/ProductionDetails';
import Packaging from '@/components/products/Packaging';
import Factory from '@/components/products/Factory';
import CertificationsSection from '@/components/products/CertificationsSection';
import Events from '@/components/products/Events';
import Research from '@/components/products/Research';
import ProductFAQs from '@/components/products/ProductFAQs';
import VitaminProductIndications from '@/components/vitamins/VitaminProductIndications';
import VitaminProductApplications from '@/components/vitamins/VitaminProductApplications';
import ContactButtons from '@/components/branded/ContactButtons';
import JsonLd from '@/components/seo/JsonLd';

// Generate static params for vitamins and minerals
// Generate static params for vitamins and minerals
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      productType: { equals: 'vitamin-mineral' } // Assuming ID or Slug match
    },
    limit: 100,
    select: { slug: true }
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for each vitamin/mineral page
// Generate metadata for each vitamin/mineral page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });

  const product = docs[0] ? mapProduct(docs[0]) : null;

  if (!product || product.productType !== 'vitamin-mineral') {
    return {
      title: 'Product Not Found | Star Hi Herbs',
      description: 'The requested vitamin or mineral product could not be found.',
    };
  }

  return {
    title: `${product.name} | Top ${product.name} Manufacturer & Exporter in India | Star Hi Herbs`,
    description: `Leading ${product.name} manufacturer and exporter in Bangalore, India. ${product.description || product.shortDescription || 'Premium plant-based vitamin/mineral by Star Hi Herbs.'}`,
    keywords: [
      `${product.name} manufacturer and exporter in india`,
      `${product.name} manufacturer and exporter in bangalore`,
      `top ${product.name} manufacturer and exporter`,
      product.name, 
      'Natural Vitamins & Minerals', 
      product.standardization, 
      'plant-based manufacturer and exporter in india', 
      ...product.certifications
    ].join(', '),
    alternates: {
      canonical: `/vitamins-minerals/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Natural Vitamins & Minerals`,
      description: product.description || `${product.name} - ${product.standardization} - Premium plant-based vitamin/mineral by Star Hi Herbs.`,
      url: `/vitamins-minerals/${product.slug}`,
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
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Natural Vitamins & Minerals`,
      description: product.description || `${product.name} - ${product.standardization} - Premium plant-based vitamin/mineral by Star Hi Herbs.`,
      images: [product.image],
    },
  };
}

export default async function VitaminMineralPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  });

  const product = docs[0] ? mapProduct(docs[0]) : null;

  if (!product || product.productType !== 'vitamin-mineral') {
    notFound();
  }

  // Get parent product if this is a child product
  let parentProduct = null;
  if (product.parentProductId) {
    const { docs: parentDocs } = await payload.find({
      collection: 'products',
      where: { id: { equals: product.parentProductId } },
      limit: 1
    });
    parentProduct = parentDocs[0] ? mapProduct(parentDocs[0]) : null;
  }

  // Find twin product (Organic/Non-Organic)
  let twinProduct: Product | null = null;
  const twinSlugs: string[] = [];
  if (product.slug.startsWith('organic-')) {
    twinSlugs.push(product.slug.replace(/^organic-/, ''));
  } else {
    twinSlugs.push(`organic-${product.slug}`);
  }
  if (product.slug.endsWith('-organic')) {
    twinSlugs.push(product.slug.replace(/-organic$/, ''));
  } else {
    twinSlugs.push(`${product.slug}-organic`);
  }

  const { docs: twinDocsBySlug } = await payload.find({
    collection: 'products',
    where: {
      slug: { in: twinSlugs },
    },
    limit: 1,
  });

  if (twinDocsBySlug && twinDocsBySlug.length > 0) {
    twinProduct = mapProduct(twinDocsBySlug[0]);
  }

  if (!twinProduct && product.latinName) {
    const { docs: twinDocsByLatin } = await payload.find({
      collection: 'products',
      where: {
        and: [
          { latinName: { equals: product.latinName } },
          { slug: { not_equals: product.slug } }
        ]
      },
      limit: 1,
    });
    if (twinDocsByLatin && twinDocsByLatin.length > 0) {
      twinProduct = mapProduct(twinDocsByLatin[0]);
    }
  }

  // Get related products (either manual relation or fallback to other vitamins & minerals)
  let relatedProducts: Product[] = [];
  if (product.relatedProducts && product.relatedProducts.length > 0) {
    const { docs: manualRelatedDocs } = await payload.find({
      collection: 'products',
      where: {
        id: { in: product.relatedProducts },
      },
      limit: 10,
    });
    relatedProducts = manualRelatedDocs.map(mapProduct).filter(Boolean) as Product[];
  }

  // Fallback to other vitamins & minerals if we don't have enough manual related products
  if (relatedProducts.length < 3) {
    const needed = 3 - relatedProducts.length;
    const { docs: fallbackDocs } = await payload.find({
      collection: 'products',
      where: {
        productType: { equals: 'vitamin-mineral' },
        slug: { not_equals: slug },
        ...(relatedProducts.length > 0 ? { id: { not_in: relatedProducts.map(p => p.id) } } : {}),
      },
      limit: needed,
    });
    const fallbackProducts = fallbackDocs.map(mapProduct).filter(Boolean) as Product[];
    relatedProducts = [...relatedProducts, ...fallbackProducts];
  }

  // Generate Product JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || product.shortDescription,
    category: 'Natural Vitamins & Minerals',
    brand: {
      '@type': 'Brand',
      name: 'Star Hi Herbs'
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      url: `https://starhiherbs.com/vitamins-minerals/${product.slug}`
    }
  };

  // Generate FAQ JSON-LD Schema
  let faqSchema = null;
  if (product.faqs && product.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  return (
    <>
      <JsonLd data={productSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {/* Hero Section */}
      <section className="pt-8 lg:pt-12 pb-16 lg:pb-24 bg-gradient-to-b from-[#f8f9fa] to-white">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: 'Natural Vitamins & Minerals', href: '/collections/vitamins-minerals' },
              ...(parentProduct ? [{ label: parentProduct.name, href: `/products/${parentProduct.slug}` }] : []),
              { label: product.name, href: `/vitamins-minerals/${product.slug}`, isCurrent: true }
            ]}
            showHomeLink={true}
          />

          <div className="grid lg:grid-cols-2 gap-12 mt-8">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  quality={90}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.gallery?.slice(0, 3).map((image, index) => (
                  <div key={index} className="relative h-28 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={image}
                      alt={`${product.name} gallery image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 33vw, 16vw"
                      loading="lazy"
                      className="object-cover"
                      quality={80}
                    />
                  </div>
                ))}
              </div>

              {/* Variant Product Cross-Link Banner */}
              {twinProduct && (
                <div className="p-4 rounded-xl bg-[#258F67]/5 border border-[#258F67]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-[#258F67] flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Also available in <span className="font-semibold text-[#214842]">{twinProduct.slug.includes('organic') ? 'Organic' : 'Standardized'}</span> format:
                      </p>
                      <p className="font-semibold text-[#214842]">{twinProduct.name}</p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="bg-[#258F67] hover:bg-[#1a6b47] text-white self-start sm:self-center flex-shrink-0">
                    <Link href={
                      twinProduct.productType === 'branded' ? `/branded-ingredients/${twinProduct.slug}` :
                      twinProduct.productType === 'vitamin-mineral' ? `/vitamins-minerals/${twinProduct.slug}` :
                      `/products/${twinProduct.slug}`
                    }>
                      View {twinProduct.slug.includes('organic') ? 'Organic' : 'Standardized'} variant
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <Link href="/collections/vitamins-minerals" className="text-[#258F67] mb-2 hover:underline inline-block">
                  Natural Vitamins & Minerals
                </Link>
                <h1 className="text-[#214842] mb-2">{product.name}</h1>

                {/* Parent Product Link (if applicable) */}
                {parentProduct && (
                  <div className="mb-4">
                    <Link
                      href={`/products/${parentProduct.slug}`}
                      className="text-[#258F67] text-sm hover:underline inline-flex items-center gap-1"
                    >
                      <span>Part of {parentProduct.name} Family</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Standardization */}
                <div className="bg-[#214842]/5 px-4 py-3 rounded-lg inline-block mb-4">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-[#258F67]" />
                    <span className="text-[#214842] font-medium">{product.standardization}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6">{product.description}</p>

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[#214842] font-medium mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <span key={index} className="bg-[#214842]/5 px-3 py-1 rounded-full text-sm text-[#214842]">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Buttons */}
                <ContactButtons
                  productName={product.name}
                  productCategory={product.categoryName}
                  productStandardization={product.standardization}
                  productType={product.productType}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Indications Section */}
      {product.productIndications && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <VitaminProductIndications productIndications={product.productIndications} />
          </div>
        </section>
      )}

      {/* Product Applications Section */}
      {product.productApplications && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <VitaminProductApplications productApplications={product.productApplications} />
          </div>
        </section>
      )}

      {/* Key Benefits Section */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Benefits</h6>
              <h2 className="text-[#214842] mb-4">Key Benefits of {product.name}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="bg-[#f8f9fa] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#214842]/10 p-2 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-[#258F67]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#214842]">{benefit.split(':')[0]}</h3>
                  </div>
                  <p className="text-gray-600">
                    {benefit.includes(':') ? benefit.split(':')[1].trim() : benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Research Section */}
      {product.research && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <Research research={product.research} />
          </div>
        </section>
      )}

      {/* Specifications Section */}
      {product.specifications && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Specifications</h6>
              <h2 className="text-[#214842] mb-4">Technical Specifications</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="bg-[#f8f9fa] p-6 rounded-xl shadow-sm">
                  <h3 className="text-[#214842] font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  <p className="text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Production Process Section */}
      {product.productionDetails && (
        <section className="py-16 bg-gray-50">
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

      {/* Documents Section */}
      {product.documents && product.documents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Resources</h6>
              <h2 className="text-[#214842] mb-4">Technical Documents</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.documents.map((doc, index) => (
                <div key={index} className="bg-[#f8f9fa] p-6 rounded-xl shadow-md flex items-start gap-4">
                  <div className="bg-[#214842]/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-[#214842]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#214842] mb-1">{doc.name}</h4>
                    <div className="text-sm text-gray-600 mb-3">PDF • {doc.size}</div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download size={16} className="mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">FAQ</h6>
              <h2 className="text-[#214842] mb-4">Frequently Asked Questions</h2>
            </div>
            <ProductFAQs faqs={product.faqs} />
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Explore More</h6>
              <h2 className="text-[#214842] mb-4">Related Natural Vitamins & Minerals</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      <section className="py-16 bg-[#214842] text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Formulations?</h2>
            <p className="text-lg mb-8 text-white/80">
              Contact our team to learn more about {product.name} and how it can benefit your products.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-[#214842] hover:bg-white/90">
                Request a Quote
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Request a Sample
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
