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

  const content = `# Star Hi Herbs

## About Us
Star Hi Herbs is a premium B2B supplier of high-quality herbal extracts, probiotics, vitamins, minerals, and custom nutraceutical formulations. We serve the nutraceutical, dietary supplement, pharmaceutical, and food & beverage industries globally.

## Key Offerings
We have a vast catalog of over ${productsCount} specialized ingredients. Our primary categories include:
${categoryNames}

## Core Competencies
- Quality Assurance: ISO, FSSC, USDA Organic, WHO GMP, and EU Organic certifications.
- Innovation: Customized branded ingredients and bulk formulations.
- Direct sourcing and standardized extraction processes ensuring high bioavailability and efficacy.

## Site Index
- Main Website: https://starhiherbs.com
- Products: https://starhiherbs.com/products
- Categories: https://starhiherbs.com/collections
- About Us: https://starhiherbs.com/about
- Contact & Quotes: https://starhiherbs.com/contact
- Sitemap: https://starhiherbs.com/sitemap.xml

## Contact
For sourcing inquiries, custom formulas, or compliance documentation (COA, MSDS, Specifications), please visit our Contact page or email us directly at sales@starhiherbs.com.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
