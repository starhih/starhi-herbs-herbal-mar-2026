import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

// Diagnostic route — useful for checking DB health. Not used in production.
export async function GET() {
  try {
    const payload = await getPayloadClient();

    const r = await payload.find({
      collection: 'products',
      draft: true,
      limit: 100,
      sort: 'name',
      depth: 0,
      overrideAccess: true,
    });

    return NextResponse.json({
      totalDocs: r.totalDocs,
      docsCount: r.docs.length,
      firstDoc: r.docs[0] ? { id: r.docs[0].id, name: r.docs[0].name } : null,
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json({ error: `${err?.name}: ${err?.message}` }, { status: 500 });
  }
}
