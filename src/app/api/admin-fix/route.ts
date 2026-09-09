import { NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * Production fix endpoint — call GET /api/admin-fix to:
 * 1. Create the missing _products_v_version_* sub-tables that Payload needs
 *    when draft:true is used in the admin list view.
 * 2. Clear stale collection preferences that can cause list-view crashes.
 *
 * Safe to call multiple times — all operations are idempotent.
 */
export async function GET() {
  const log: string[] = [];

  try {
    const payload = await getPayloadClient();

    // ── Step 1: Create missing version sub-tables via raw SQL ─────────────
    // These tables are required by Payload's queryDrafts but were never
    // created by migrate.cjs, causing: SQLITE_ERROR: no such table: _products_v_version_benefits
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (payload.db as any).drizzle;

    const subTables: Array<{ name: string; ddl: string }> = [
      {
        name: '_products_v_version_benefits',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_benefits (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          benefit text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_applications',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_applications (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          application text,
          image_id integer,
          image_url text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_certifications_section_images',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_certifications_section_images (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          image_id integer,
          image_url text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_events',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_events (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          description text,
          image_id integer,
          image_url text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_events_images',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_events_images (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          image_id integer,
          image_url text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v_version_events(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_faqs',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_faqs (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          question text,
          answer text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_variants',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_variants (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          name text,
          spec_document_id integer,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_clinical_research_studies',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_clinical_research_studies (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          title text,
          description text,
          link text,
          image_id integer,
          image_url text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
      {
        name: '_products_v_version_product_indications_indications',
        ddl: `CREATE TABLE IF NOT EXISTS _products_v_version_product_indications_indications (
          id integer PRIMARY KEY NOT NULL,
          _order integer NOT NULL,
          _parent_id integer NOT NULL,
          name text,
          icon text,
          description text,
          _uuid text,
          FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
        )`,
      },
    ];

    for (const table of subTables) {
      try {
        await db.run(sql.raw(table.ddl));
        log.push(`✓ ${table.name}`);
      } catch (e) {
        log.push(`✗ ${table.name}: ${String(e)}`);
      }
    }

    // ── Step 2: Clear stale collection preferences ────────────────────────
    const prefsBefore = await payload.find({
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
    for (const pref of prefsBefore.docs) {
      await payload.delete({
        collection: 'payload-preferences',
        id: pref.id,
        overrideAccess: true,
      });
      deleted.push(`id=${pref.id} key=${pref.key}`);
    }

    return NextResponse.json({
      success: true,
      tablesCreated: log,
      preferencesDeleted: deleted,
      message:
        'Done. Now reload /admin/collections/products — it should work.',
    });
  } catch (e: unknown) {
    const err = e as Error;
    return NextResponse.json(
      {
        success: false,
        log,
        error: `${err?.name}: ${err?.message}`,
        stack: err?.stack,
      },
      { status: 500 },
    );
  }
}
