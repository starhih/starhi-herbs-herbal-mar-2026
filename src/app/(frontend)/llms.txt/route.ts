import { getPayloadClient } from '@/lib/payload';

export async function GET() {
  const payload = await getPayloadClient();

  // Fetch basic stats
  const { totalDocs: productsCount } = await payload.find({
    collection: 'products',
    limit: 1,
  });

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 50,
  });

  const categoryNames = categories.map((c) => c.name).join(', ');

  const categoryLinks = categories
    .map((c) => `- [${c.name}](https://starhiherbs.com/collections/${c.slug}): Specialized catalog for our premium ${c.name.toLowerCase()} range.`)
    .join('\n');

  const content = `# Star Hi Herbs

> Premium B2B manufacturer and exporter of high-quality herbal extracts, probiotics, vitamins, minerals, and custom nutraceutical formulations.

Star Hi Herbs serves the global nutraceutical, dietary supplement, pharmaceutical, and food & beverage industries. Our state-of-the-art extraction facilities deliver standardized botanical extracts, dynamic bulk formulations, and custom ingredients with high bioavailability, efficacy, and trust-certified quality control.

- **Specialized Catalog**: Sourcing over ${productsCount} specialized ingredients.
- **Product Portfolios**: ${categoryNames}.
- **Global Trust Credentials**: Certified ISO, FSSC 22000, WHO-GMP, Halal, Kosher, USDA Organic, and EU Organic.

## Website Directory

- [Main Homepage](https://starhiherbs.com): Welcome page detailing our core offerings, branded ingredients, certifications, and awards.
- [Ingredients Directory](https://starhiherbs.com/products): A complete, searchable A-Z database of all our raw botanical extracts, vitamins, and probiotic ingredients.
- [Inquiry & Contact Hub](https://starhiherbs.com/contact): Connect with our sales department, request price sheets, or consult on custom formulation requirements (sales@starhiherbs.com).

## Product Categories & Collections

${categoryLinks}

## Company & Innovation

- [About Star Hi Herbs](https://starhiherbs.com/about): Learn about our manufacturing excellence, corporate timeline, and major industry awards (including Times Business Award 2020, 2026).
- [Research & Publications](https://starhiherbs.com/innovation): Deep dive into our clinical studies, research capabilities, contributing 27+ international publications, and filing 41+ patents.
- [Sustainability & Sourcing](https://starhiherbs.com/sustainability): Learn about our eco-friendly practices, direct-from-farm supply chain, organic cultivation tie-ups, and carbon/waste reduction policies.
- [Educational Blog & News](https://starhiherbs.com/blog): Industrial articles, botanical research, market trends, and nutritional sciences updates.

## Optional

- [Careers at Star Hi Herbs](https://starhiherbs.com/careers): Active career listings, company culture, and application guidelines.
- [XML Sitemap](https://starhiherbs.com/sitemap.xml): A complete machine-readable index of all crawlable public pages for automated mapping.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
