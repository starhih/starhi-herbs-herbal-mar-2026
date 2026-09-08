import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const payloadSecret = process.env.PAYLOAD_SECRET;

  // Verify secret in production
  if (process.env.NODE_ENV === 'production') {
    if (!secret || secret !== payloadSecret) {
      return NextResponse.json(
        {
          error: 'Unauthorized. Please provide ?secret=YOUR_PAYLOAD_SECRET',
        },
        { status: 401 }
      );
    }
  } else {
    // In development allow secret or notify
    if (secret && payloadSecret && secret !== payloadSecret) {
      return NextResponse.json(
        {
          error: 'Invalid secret provided.',
        },
        { status: 401 }
      );
    }
  }

  try {
    const payload = await getPayloadClient();
    const db = (payload.db as any).client;

    const logs: string[] = [];

    // 1. Ensure _status on products table
    const productColsRes = await db.execute("PRAGMA table_info(products)");
    const productCols = productColsRes.rows.map((r: any) => r.name);
    if (!productCols.includes('_status')) {
      await db.execute("ALTER TABLE products ADD COLUMN _status TEXT DEFAULT 'published'");
      logs.push("Added '_status' column to 'products' table.");
    }
    await db.execute("UPDATE products SET _status = 'published' WHERE _status IS NULL OR _status = ''");
    logs.push("Updated all existing products to '_status = published'.");

    // 2. Ensure _status on blog_posts table
    const blogColsRes = await db.execute("PRAGMA table_info(blog_posts)");
    const blogCols = blogColsRes.rows.map((r: any) => r.name);
    if (!blogCols.includes('_status')) {
      await db.execute("ALTER TABLE blog_posts ADD COLUMN _status TEXT DEFAULT 'published'");
      logs.push("Added '_status' column to 'blog_posts' table.");
    }
    await db.execute("UPDATE blog_posts SET _status = 'published' WHERE _status IS NULL OR _status = ''");
    logs.push("Updated all existing blog posts to '_status = published'.");

    // 3. Ensure _products_v table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS _products_v (
        id integer PRIMARY KEY NOT NULL,
        parent_id integer,
        version_name text,
        version_slug text,
        version_product_type text DEFAULT 'standard',
        version_category_id integer,
        version_standardization text,
        version_latin_name text,
        version_common_name text,
        version_plant_part text,
        version_moq text DEFAULT '25 kg',
        version_image_id integer,
        version_image_url text,
        version_short_description text,
        version_description text,
        version_specifications_appearance text,
        version_specifications_solubility text,
        version_specifications_particle_size text,
        version_specifications_heavy_metals text,
        version_specifications_shelf_life text,
        version_specifications_storage text,
        version_specifications_active_compounds text,
        version_specifications_testing text,
        version_research text,
        version_featured integer DEFAULT false,
        version_product_of_the_month integer DEFAULT false,
        version_product_of_the_month_tagline text,
        version_production_details_description text,
        version_production_details_image_id integer,
        version_production_details_image_url text,
        version_packaging_description text,
        version_packaging_image_id integer,
        version_packaging_image_url text,
        version_factory_description text,
        version_factory_image_id integer,
        version_factory_image_url text,
        version_certifications_section_description text,
        version_certifications_section_image_id integer,
        version_certifications_section_image_url text,
        version_brand_logo_id integer,
        version_brand_logo_url text,
        version_clinical_research_title text,
        version_clinical_research_description text,
        version_product_indications_title text,
        version_probiotic_details_spores_per_gram text,
        version_probiotic_details_method text DEFAULT 'Microscopy',
        version_is_parent_product integer DEFAULT false,
        version_parent_product_id integer,
        version_updated_at text,
        version_created_at text,
        version__status text DEFAULT 'draft',
        created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        latest integer,
        autosave integer,
        FOREIGN KEY (parent_id) REFERENCES products(id) ON UPDATE no action ON DELETE set null
      );
    `);

    // 4. Ensure _products_v_rels table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS _products_v_rels (
        id integer PRIMARY KEY NOT NULL,
        "order" integer,
        parent_id integer NOT NULL,
        path text NOT NULL,
        certifications_id integer,
        products_id integer,
        FOREIGN KEY (parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);

    // 5. Ensure _blog_posts_v table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS _blog_posts_v (
        id integer PRIMARY KEY NOT NULL,
        parent_id integer,
        version_title text,
        version_slug text,
        version_excerpt text,
        version_content text,
        version_image_id integer,
        version_image_url text,
        version_published_at text,
        version_author_id integer,
        version_category_id integer,
        version_read_time numeric,
        version_show_in_news_ticker integer DEFAULT false,
        version_updated_at text,
        version_created_at text,
        version__status text DEFAULT 'draft',
        created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        latest integer,
        autosave integer,
        FOREIGN KEY (parent_id) REFERENCES blog_posts(id) ON UPDATE no action ON DELETE set null
      );
    `);

    // 6. Ensure _blog_posts_v_rels table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS _blog_posts_v_rels (
        id integer PRIMARY KEY NOT NULL,
        "order" integer,
        parent_id integer NOT NULL,
        path text NOT NULL,
        blog_tags_id integer,
        FOREIGN KEY (parent_id) REFERENCES _blog_posts_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);

    // 7. Clean up any invalid empty drafts (e.g. created accidentally with null name & slug)
    await db.execute("DELETE FROM products WHERE name IS NULL AND slug IS NULL");
    await db.execute("DELETE FROM _products_v WHERE version_name IS NULL AND version_slug IS NULL");

    // 8. Sync missing products into _products_v
    const insertProductsVQuery = `
      INSERT OR IGNORE INTO _products_v (
        id,
        parent_id,
        version_name,
        version_slug,
        version_product_type,
        version_category_id,
        version_standardization,
        version_latin_name,
        version_common_name,
        version_plant_part,
        version_moq,
        version_image_id,
        version_image_url,
        version_short_description,
        version_description,
        version_specifications_appearance,
        version_specifications_solubility,
        version_specifications_particle_size,
        version_specifications_heavy_metals,
        version_specifications_shelf_life,
        version_specifications_storage,
        version_specifications_active_compounds,
        version_specifications_testing,
        version_research,
        version_featured,
        version_product_of_the_month,
        version_product_of_the_month_tagline,
        version_production_details_description,
        version_production_details_image_id,
        version_production_details_image_url,
        version_packaging_description,
        version_packaging_image_id,
        version_packaging_image_url,
        version_factory_description,
        version_factory_image_id,
        version_factory_image_url,
        version_certifications_section_description,
        version_certifications_section_image_id,
        version_certifications_section_image_url,
        version_brand_logo_id,
        version_brand_logo_url,
        version_clinical_research_title,
        version_clinical_research_description,
        version_product_indications_title,
        version_probiotic_details_spores_per_gram,
        version_probiotic_details_method,
        version_is_parent_product,
        version_parent_product_id,
        version_updated_at,
        version_created_at,
        version__status,
        created_at,
        updated_at,
        latest,
        autosave
      )
      SELECT
        id,
        id,
        name,
        slug,
        product_type,
        category_id,
        standardization,
        latin_name,
        common_name,
        plant_part,
        moq,
        image_id,
        image_url,
        short_description,
        description,
        specifications_appearance,
        specifications_solubility,
        specifications_particle_size,
        specifications_heavy_metals,
        specifications_shelf_life,
        specifications_storage,
        specifications_active_compounds,
        specifications_testing,
        research,
        featured,
        product_of_the_month,
        product_of_the_month_tagline,
        production_details_description,
        production_details_image_id,
        production_details_image_url,
        packaging_description,
        packaging_image_id,
        packaging_image_url,
        factory_description,
        factory_image_id,
        factory_image_url,
        certifications_section_description,
        certifications_section_image_id,
        certifications_section_image_url,
        brand_logo_id,
        brand_logo_url,
        clinical_research_title,
        clinical_research_description,
        product_indications_title,
        probiotic_details_spores_per_gram,
        probiotic_details_method,
        is_parent_product,
        parent_product_id,
        updated_at,
        created_at,
        COALESCE(_status, 'published'),
        created_at,
        updated_at,
        1,
        0
      FROM products
      WHERE id NOT IN (SELECT parent_id FROM _products_v WHERE latest = 1 AND parent_id IS NOT NULL);
    `;
    const prodInsertRes = await db.execute(insertProductsVQuery);
    logs.push(`Synced missing products into _products_v (affected rows: ${prodInsertRes.rowsAffected || 0}).`);

    // 9. Sync missing _products_v_rels
    await db.execute(`
      INSERT OR IGNORE INTO _products_v_rels (id, "order", parent_id, path, certifications_id, products_id)
      SELECT id, "order", parent_id, path, certifications_id, products_id
      FROM products_rels
      WHERE parent_id IN (SELECT id FROM _products_v);
    `);
    logs.push("Synced relations into _products_v_rels.");

    // 10. Sync missing blog_posts into _blog_posts_v
    const insertBlogVQuery = `
      INSERT OR IGNORE INTO _blog_posts_v (
        id,
        parent_id,
        version_title,
        version_slug,
        version_excerpt,
        version_content,
        version_image_id,
        version_image_url,
        version_published_at,
        version_author_id,
        version_category_id,
        version_read_time,
        version_show_in_news_ticker,
        version_updated_at,
        version_created_at,
        version__status,
        created_at,
        updated_at,
        latest,
        autosave
      )
      SELECT
        id,
        id,
        title,
        slug,
        excerpt,
        content,
        image_id,
        image_url,
        published_at,
        author_id,
        category_id,
        read_time,
        show_in_news_ticker,
        updated_at,
        created_at,
        COALESCE(_status, 'published'),
        created_at,
        updated_at,
        1,
        0
      FROM blog_posts
      WHERE id NOT IN (SELECT parent_id FROM _blog_posts_v WHERE latest = 1 AND parent_id IS NOT NULL);
    `;
    const blogInsertRes = await db.execute(insertBlogVQuery);
    logs.push(`Synced missing blog posts into _blog_posts_v (affected rows: ${blogInsertRes.rowsAffected || 0}).`);

    // 11. Sync missing _blog_posts_v_rels
    await db.execute(`
      INSERT OR IGNORE INTO _blog_posts_v_rels (id, "order", parent_id, path, blog_tags_id)
      SELECT id, "order", parent_id, path, blog_tags_id
      FROM blog_posts_rels
      WHERE parent_id IN (SELECT id FROM _blog_posts_v);
    `);
    logs.push("Synced relations into _blog_posts_v_rels.");

    // 12. Get summary counts
    const totalProducts = (await db.execute("SELECT count(*) as count FROM products")).rows[0].count;
    const totalProductVersions = (await db.execute("SELECT count(*) as count FROM _products_v WHERE latest = 1")).rows[0].count;
    const totalBlogs = (await db.execute("SELECT count(*) as count FROM blog_posts")).rows[0].count;
    const totalBlogVersions = (await db.execute("SELECT count(*) as count FROM _blog_posts_v WHERE latest = 1")).rows[0].count;
    const totalCategories = (await db.execute("SELECT count(*) as count FROM categories")).rows[0].count;

    return NextResponse.json({
      success: true,
      message: 'Database schema and versions successfully synchronized!',
      counts: {
        products: totalProducts,
        productVersions: totalProductVersions,
        blogs: totalBlogs,
        blogVersions: totalBlogVersions,
        categories: totalCategories,
      },
      logs,
    });
  } catch (err: any) {
    console.error('[API /api/migrate] Migration error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
