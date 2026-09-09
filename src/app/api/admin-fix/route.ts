import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

/**
 * One-shot endpoint to reset stale Payload admin preferences that can cause
 * the list view to show a blank screen.
 *
 * Call from the production browser:  GET /api/admin-fix
 *
 * Safe to call multiple times — it simply deletes and re-queries.
 */
export async function GET() {
  try {
    const payload = await getPayloadClient();

    // Find all stale collection preferences
    const before = await payload.find({
      collection: 'payload-preferences',
      where: {
        or: [
          { key: { like: 'collection-products' } },
          { key: { like: 'collection-blog-posts' } },
        ],
      },
      limit: 100,
      overrideAccess: true,
    });

    const deleted: string[] = [];
    for (const pref of before.docs) {
      await payload.delete({
        collection: 'payload-preferences',
        id: pref.id,
        overrideAccess: true,
      });
      deleted.push(`id=${pref.id} key=${pref.key}`);
    }

    // Verify they're gone
    const after = await payload.find({
      collection: 'payload-preferences',
      where: {
        or: [
          { key: { like: 'collection-products' } },
          { key: { like: 'collection-blog-posts' } },
        ],
      },
      limit: 100,
      overrideAccess: true,
    });

    return NextResponse.json({
      success: true,
      deleted,
      remaining: after.totalDocs,
      message:
        deleted.length > 0
          ? `Cleared ${deleted.length} stale preference(s). Reload /admin/collections/products.`
          : 'No stale preferences found — something else may be causing the blank screen.',
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json(
      { success: false, error: `${err?.name}: ${err?.message}` },
      { status: 500 },
    );
  }
}
