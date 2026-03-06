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
import SupplierInfo from '@/components/products/SupplierInfo';
import ProductionDetails from '@/components/products/ProductionDetails';
import Packaging from '@/components/products/Packaging';
import Factory from '@/components/products/Factory';
import CertificationsSection from '@/components/products/CertificationsSection';
import Events from '@/components/products/Events';
import Research from '@/components/products/Research';
import ProductFAQs from '@/components/products/ProductFAQs';
import BrandedClinicalResearch from '@/components/branded/BrandedClinicalResearch';
import BrandedHealthClaims from '@/components/branded/BrandedHealthClaims';
import BrandedWhitepaper from '@/components/branded/BrandedWhitepaper';
import BrandedMechanism from '@/components/branded/BrandedMechanism';
import BrandedSustainability from '@/components/branded/BrandedSustainability';
import BrandedWhyChoose from '@/components/branded/BrandedWhyChoose';
import ContactButtons from '@/components/branded/ContactButtons';

// Generate static params for branded ingredients
// Generate static params for branded ingredients
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      productType: { equals: 'branded' }
    },
    pagination: false,
    select: { slug: true }
  });

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for each branded ingredient page
// Generate metadata for each branded ingredient page
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

  if (!product || product.productType !== 'branded') {
    return {
      title: 'Product Not Found | Star Hi Herbs',
      description: 'The requested branded ingredient could not be found.',
    };
  }

  return {
    title: `${product.name} | Branded Ingredients | Star Hi Herbs`,
    description: product.description || `${product.name} - ${product.standardization} - Premium branded ingredient by Star Hi Herbs.`,
    keywords: [product.name, 'Branded Ingredient', product.standardization, 'nutraceutical', ...product.certifications].join(', '),
    openGraph: {
      title: `${product.name} | Branded Ingredients`,
      description: product.description || `${product.name} - ${product.standardization} - Premium branded ingredient by Star Hi Herbs.`,
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

export default async function BrandedIngredientPage({ params }: { params: Promise<{ slug: string }> }) {
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

  if (!product || product.productType !== 'branded') {
    notFound();
  }

  // Get related products (other branded ingredients)
  const { docs: relatedDocs } = await payload.find({
    collection: 'products',
    where: {
      productType: { equals: 'branded' },
      slug: { not_equals: slug },
    },
    limit: 3,
  });

  const relatedProducts = relatedDocs.map(mapProduct).filter(Boolean) as Product[];

  return (
    <>
      {/* Hero Section */}
      <section className="pt-8 lg:pt-12 pb-16 lg:pb-24 bg-gradient-to-b from-[#f8f9fa] to-white">
        <div className="container-custom">
          <Breadcrumbs
            items={[
              { label: 'Products', href: '/products' },
              { label: 'Branded Ingredients', href: '/collections/branded-ingredients' },
              { label: product.name, href: `/branded-ingredients/${product.slug}`, isCurrent: true }
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
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Brand Logo */}
              {product.brandLogo && (
                <div className="mb-6 max-w-[200px]">
                  <Image
                    src={product.brandLogo}
                    alt={`${product.name} logo`}
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="mb-6">
                <Link href="/collections/branded-ingredients" className="text-[#258F67] mb-2 hover:underline inline-block">
                  Branded Ingredients
                </Link>
                <h1 className="text-[#214842] mb-2">{product.name}</h1>

                {/* Latin Name and Plant Part */}
                {(product.latinName || product.plantPart) && (
                  <div className="mb-4">
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
                <ContactButtons />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Benefits</h6>
            <h2 className="text-[#214842] mb-4">Key Benefits of {product.name}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.benefits?.map((benefit, index) => (
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

      {/* Clinical Research Section */}
      {product.clinicalResearch && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <BrandedClinicalResearch clinicalResearch={product.clinicalResearch} />
          </div>
        </section>
      )}

      {/* Health Claims Section */}
      {product.healthClaims && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <BrandedHealthClaims healthClaims={product.healthClaims} />
          </div>
        </section>
      )}

      {/* Mechanism of Action Section */}
      {product.mechanism && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <BrandedMechanism mechanism={product.mechanism} />
          </div>
        </section>
      )}

      {/* Whitepaper Section */}
      {product.whitepaper && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <BrandedWhitepaper whitepaper={product.whitepaper} />
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      {product.whyChoose && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <BrandedWhyChoose whyChoose={product.whyChoose} />
          </div>
        </section>
      )}

      {/* Sustainability Section */}
      {product.sustainability && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <BrandedSustainability sustainability={product.sustainability} />
          </div>
        </section>
      )}

      {/* Applications Section */}
      {product.applications && product.applications.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Applications</h6>
              <h2 className="text-[#214842] mb-4">Product Applications</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.applications.map((application, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#214842]/10 p-2 rounded-lg">
                      <Beaker className="h-6 w-6 text-[#258F67]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#214842]">{application}</h3>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Documents Section */}
      {product.documents && product.documents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Resources</h6>
              <h2 className="text-[#214842] mb-4">Technical Documents</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.documents.map((doc, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md flex items-start gap-4">
                  <div className="bg-[#214842]/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-[#214842]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#214842] mb-1">{doc.name}</h4>
                    <div className="text-sm text-gray-500 mb-3">PDF • {doc.size}</div>
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
        <section className="py-16 bg-white">
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
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Explore More</h6>
              <h2 className="text-[#214842] mb-4">Related Branded Ingredients</h2>
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
