import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Product } from '@/data/types';
import { getPayloadClient } from '@/lib/payload';
import { mapProduct } from '@/lib/mappers';
import JsonLd from '@/components/seo/JsonLd';
import { ProductLiveView } from '@/components/products/ProductLiveView';

// Generate static params for all products
export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 5000,
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
    title: `${product.name} | Top ${product.name} Manufacturer & Exporter in India | Star Hi Herbs`,
    description: `Leading ${product.name} manufacturer and exporter in Bangalore, India. ${product.description || product.shortDescription || 'High-quality herbal extract by Star Hi Herbs.'}`,
    keywords: [
      `${product.name} manufacturer and exporter in india`, 
      `${product.name} manufacturer and exporter in bangalore`, 
      `top ${product.name} manufacturer and exporter`,
      product.name, 
      product.categoryName, 
      product.standardization, 
      'herbal extract manufacturer and exporter in india', 
      'nutraceuticals', 
      ...product.certifications
    ].join(', '),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | ${product.categoryName}`,
      description: product.description || `${product.name} - ${product.standardization} - High-quality herbal extract by Star Hi Herbs.`,
      url: `/products/${product.slug}`,
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
      title: `${product.name} | ${product.categoryName}`,
      description: product.description || `${product.name} - ${product.standardization} - High-quality herbal extract by Star Hi Herbs.`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const search = (await searchParams) || {};
  let isDraft = search.preview === 'true';
  try {
    const { draftMode } = await import('next/headers');
    const { isEnabled } = await draftMode();
    if (isEnabled) isDraft = true;
  } catch (_e) {}

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(!isDraft
          ? [
              {
                _status: {
                  equals: 'published',
                },
              },
            ]
          : []),
      ],
    },
    draft: isDraft,
    limit: 1,
  });

  const rawDoc = docs[0] || null;
  const product = rawDoc ? mapProduct(rawDoc) : null;

  if (!product || !rawDoc) {
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

  // Get related products (either manual relation or fallback to same category)
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

  // Fallback to same category if we don't have enough manual related products
  if (relatedProducts.length < 3) {
    const needed = 3 - relatedProducts.length;
    const { docs: fallbackDocs } = await payload.find({
      collection: 'products',
      where: {
        category: { equals: product.categoryId },
        slug: { not_equals: slug },
        ...(relatedProducts.length > 0 ? { id: { not_in: relatedProducts.map(p => p.id) } } : {}),
      },
      limit: needed,
    });
    const fallbackProducts = fallbackDocs.map(mapProduct).filter(Boolean) as Product[];
    relatedProducts = [...relatedProducts, ...fallbackProducts];
  }

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

  // Generate Product JSON-LD Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description || product.shortDescription,
    category: product.categoryName,
    brand: {
      '@type': 'Brand',
      name: 'Star Hi Herbs'
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
      url: `https://starhiherbs.com/products/${product.slug}`
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
      <ProductLiveView
        initialDoc={rawDoc}
        initialProduct={product}
        relatedProducts={relatedProducts}
        childProductsList={childProductsList}
        parentProduct={parentProduct}
        twinProduct={twinProduct}
      />
    </>
  );
}
