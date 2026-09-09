import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic route — simulates each step of the admin list view server render
 * to find exactly which step is failing in production.
 *
 * GET /api/diag-products
 */
export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const payload = await getPayloadClient();
    results.step0_client = { ok: true };

    // Step 1: Basic products find (no draft)
    try {
      const r1 = await payload.find({
        collection: 'products',
        limit: 5,
        depth: 0,
        overrideAccess: true,
      });
      results.step1_basicFind = { totalDocs: r1.totalDocs, ok: true };
    } catch (e) {
      results.step1_basicFind = { ok: false, error: String(e) };
    }

    // Step 2: Draft find (same as admin list view uses)
    try {
      const r2 = await payload.find({
        collection: 'products',
        draft: true,
        limit: 10,
        sort: 'name',
        depth: 0,
        overrideAccess: true,
      });
      results.step2_draftFind = { totalDocs: r2.totalDocs, ok: true };
    } catch (e) {
      results.step2_draftFind = { ok: false, error: String(e) };
    }

    // Step 3: Check stored preferences
    try {
      const prefs = await payload.find({
        collection: 'payload-preferences',
        where: { key: { like: 'collection-products' } },
        limit: 10,
        overrideAccess: true,
      });
      results.step3_preferences = {
        ok: true,
        count: prefs.totalDocs,
        docs: prefs.docs.map((d) => ({ id: d.id, key: d.key, value: d.value })),
      };
    } catch (e) {
      results.step3_preferences = { ok: false, error: String(e) };
    }

    // Step 4: Draft find with limit:100 (what production preferences set)
    try {
      const r4 = await payload.find({
        collection: 'products',
        draft: true,
        limit: 100,
        sort: 'name',
        depth: 0,
        overrideAccess: true,
        select: {
          name: true,
          slug: true,
          productType: true,
          category: true,
        },
      });
      results.step4_draftFindWithSelect = {
        ok: true,
        totalDocs: r4.totalDocs,
        docsCount: r4.docs.length,
        firstDoc: r4.docs[0]
          ? { id: r4.docs[0].id, name: (r4.docs[0] as { name?: string }).name }
          : null,
      };
    } catch (e) {
      results.step4_draftFindWithSelect = { ok: false, error: String(e) };
    }

    // Step 5: Check if _products_v table has any problematic rows
    try {
      const r5 = await payload.find({
        collection: 'products',
        draft: true,
        limit: 1,
        depth: 0,
        overrideAccess: true,
        where: {
          or: [
            { name: { equals: null } },
            { slug: { equals: null } },
          ],
        },
      });
      results.step5_nullNameOrSlug = { ok: true, count: r5.totalDocs };
    } catch (e) {
      results.step5_nullNameOrSlug = { ok: false, error: String(e) };
    }

    return NextResponse.json({ success: true, ...results });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json(
      { success: false, fatalError: `${err?.name}: ${err?.message}`, ...results },
      { status: 500 },
    );
  }
}
