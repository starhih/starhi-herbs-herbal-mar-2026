import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const revalidate = 0; // Always fresh dynamically

export async function GET() {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'categories',
      limit: 100,
      overrideAccess: true,
    });

    const categoryOrder = [
      'standardized',
      'organic',
      'branded',
      'probiotics',
      'vitamins',
      'bulk',
    ];

    const sortedDocs = [...docs].sort((a, b) => {
      const aName = a.name ? a.name.toLowerCase() : '';
      const bName = b.name ? b.name.toLowerCase() : '';
      const aIndex = categoryOrder.findIndex((k) => aName.includes(k));
      const bIndex = categoryOrder.findIndex((k) => bName.includes(k));
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return aName.localeCompare(bName);
    });

    const categories = sortedDocs.map((c) => ({
      name: c.name,
      slug: c.slug,
    }));

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (err) {
    console.error('[GET /api/categories] Error fetching categories:', err);
    return NextResponse.json([], { status: 500 });
  }
}
