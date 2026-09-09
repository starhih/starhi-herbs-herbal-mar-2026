/**
 * Star Hi Herbs - Production & Local Database Migration Script
 * 
 * Usage:
 *   node migrate.cjs [optional-path-to-db]
 *   or
 *   npm run migrate
 * 
 * This script updates the SQLite database schema for Payload CMS:
 * 1. Resolves the database from process.env.DATABASE_URL, .env, or CLI argument
 * 2. Adds `_status` column to `products` and `blog_posts` if missing
 * 3. Sets all existing documents to `_status = 'published'`
 * 4. Creates versioning tables (_products_v, _blog_posts_v, and relation tables)
 * 5. Syncs existing products & blog posts into version tables so they appear in Payload Admin
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Try loading environment variables in order of priority
try {
  const dotenv = require('dotenv');
  const envFiles = ['.env.production', '.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(__dirname, file);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath });
      console.log(`Loaded environment from ${file}`);
      break;
    }
  }
} catch (_e) {}

// Resolve DB path:
// 1. CLI argument: node migrate.cjs /path/to/db.sqlite
// 2. process.env.DATABASE_URL
// 3. Default fallback: star-hi-herbs-v2.db in project root
let rawUrl = process.argv[2] || process.env.DATABASE_URL || 'star-hi-herbs-v2.db';
let dbPath = rawUrl;

if (dbPath.startsWith('file:')) {
  dbPath = dbPath.replace(/^file:/, '');
}
// Strip query strings like ?cache=shared
if (dbPath.includes('?')) {
  dbPath = dbPath.split('?')[0];
}
// Make sure path is absolute relative to project directory
if (!path.isAbsolute(dbPath)) {
  dbPath = path.resolve(__dirname, dbPath);
}

console.log('--------------------------------------------------');
console.log('Star Hi Herbs - Database Migration');
console.log('Environment DATABASE_URL:', process.env.DATABASE_URL || '(not set, using fallback)');
console.log('Resolved Database File:  ', dbPath);
console.log('--------------------------------------------------');

if (!fs.existsSync(dbPath)) {
  console.error(`ERROR: Database file not found at: ${dbPath}`);
  console.error('Please verify your DATABASE_URL in .env or pass the path directly:');
  console.error('  node migrate.cjs /path/to/database.db');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath);

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function migrate() {
  try {
    // 1. Check and add `_status` to products
    const productCols = await getAll("PRAGMA table_info(products)");
    const hasProductStatus = productCols.some(c => c.name === '_status');
    if (!hasProductStatus) {
      await runSql("ALTER TABLE products ADD COLUMN _status TEXT DEFAULT 'published'");
      console.log('✓ Added _status column to products table');
    } else {
      console.log('✓ products table already has _status column');
    }
    await runSql("UPDATE products SET _status = 'published' WHERE _status IS NULL OR _status = ''");
    console.log('✓ All products set to _status = "published"');

    // 2. Check and add `_status` to blog_posts
    const blogCols = await getAll("PRAGMA table_info(blog_posts)");
    const hasBlogStatus = blogCols.some(c => c.name === '_status');
    if (!hasBlogStatus) {
      await runSql("ALTER TABLE blog_posts ADD COLUMN _status TEXT DEFAULT 'published'");
      console.log('✓ Added _status column to blog_posts table');
    } else {
      console.log('✓ blog_posts table already has _status column');
    }
    await runSql("UPDATE blog_posts SET _status = 'published' WHERE _status IS NULL OR _status = ''");
    console.log('✓ All blog posts set to _status = "published"');

    // 3. Create _products_v table if not exists
    await runSql(`
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
    console.log('✓ Checked _products_v table');

    // 4. Create _products_v_rels table if not exists
    await runSql(`
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
    console.log('✓ Checked _products_v_rels table');

    // 5. Create _blog_posts_v table if not exists
    await runSql(`
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
    console.log('✓ Checked _blog_posts_v table');

    // 6. Create _blog_posts_v_rels table if not exists
    await runSql(`
      CREATE TABLE IF NOT EXISTS _blog_posts_v_rels (
        id integer PRIMARY KEY NOT NULL,
        "order" integer,
        parent_id integer NOT NULL,
        path text NOT NULL,
        blog_tags_id integer,
        FOREIGN KEY (parent_id) REFERENCES _blog_posts_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    console.log('✓ Checked _blog_posts_v_rels table');

    // 5b. Create missing _products_v sub-tables for array fields
    // These are required by Payload when querying with draft:true but were not
    // included in the original migrate.cjs — causing SQLITE_ERROR in production.
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_benefits (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        benefit text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_applications (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        application text,
        image_id integer,
        image_url text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_certifications_section_images (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        image_id integer,
        image_url text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_events (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        description text,
        image_id integer,
        image_url text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_events_images (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        image_id integer,
        image_url text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v_version_events(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_faqs (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        question text,
        answer text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_variants (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        name text,
        spec_document_id integer,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_clinical_research_studies (
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
      );
    `);
    await runSql(`
      CREATE TABLE IF NOT EXISTS _products_v_version_product_indications_indications (
        id integer PRIMARY KEY NOT NULL,
        _order integer NOT NULL,
        _parent_id integer NOT NULL,
        name text,
        icon text,
        description text,
        _uuid text,
        FOREIGN KEY (_parent_id) REFERENCES _products_v(id) ON UPDATE no action ON DELETE cascade
      );
    `);
    console.log('✓ Created all _products_v version sub-tables (benefits, applications, faqs, variants, events, etc.)');

    // 7. Remove any invalid empty products and stale table column preferences
    await runSql("DELETE FROM products WHERE name IS NULL AND slug IS NULL");
    await runSql("DELETE FROM _products_v WHERE version_name IS NULL AND version_slug IS NULL");
    await runSql("DELETE FROM payload_preferences WHERE key LIKE '%collection-products%'");
    await runSql("DELETE FROM payload_preferences WHERE key LIKE '%collection-blog-posts%'");
    console.log('✓ Reset stale table preferences in payload_preferences');

    // 8. Populate missing products into _products_v
    const syncProductsRes = await runSql(`
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
    `);
    console.log(`✓ Synchronized products to _products_v (added: ${syncProductsRes.changes})`);

    // 9. Sync product relations
    await runSql(`
      INSERT OR IGNORE INTO _products_v_rels (id, "order", parent_id, path, certifications_id, products_id)
      SELECT id, "order", parent_id, path, certifications_id, products_id
      FROM products_rels
      WHERE parent_id IN (SELECT id FROM _products_v);
    `);
    console.log('✓ Synchronized product relations into _products_v_rels');

    // 10. Populate missing blog posts into _blog_posts_v
    const syncBlogsRes = await runSql(`
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
    `);
    console.log(`✓ Synchronized blog posts to _blog_posts_v (added: ${syncBlogsRes.changes})`);

    // 11. Sync blog relations
    await runSql(`
      INSERT OR IGNORE INTO _blog_posts_v_rels (id, "order", parent_id, path, blog_tags_id)
      SELECT id, "order", parent_id, path, blog_tags_id
      FROM blog_posts_rels
      WHERE parent_id IN (SELECT id FROM _blog_posts_v);
    `);
    console.log('✓ Synchronized blog post relations into _blog_posts_v_rels');

    // 12. Final summary counts
    const productsCount = (await getAll("SELECT count(*) as count FROM products"))[0].count;
    const productVersionsCount = (await getAll("SELECT count(*) as count FROM _products_v WHERE latest = 1"))[0].count;
    const blogsCount = (await getAll("SELECT count(*) as count FROM blog_posts"))[0].count;
    const blogVersionsCount = (await getAll("SELECT count(*) as count FROM _blog_posts_v WHERE latest = 1"))[0].count;
    const categoriesCount = (await getAll("SELECT count(*) as count FROM categories"))[0].count;

    console.log('--------------------------------------------------');
    console.log('Migration Complete Summary:');
    console.log(`- Products: ${productsCount} (Versions: ${productVersionsCount})`);
    console.log(`- Blog Posts: ${blogsCount} (Versions: ${blogVersionsCount})`);
    console.log(`- Categories: ${categoriesCount}`);
    console.log('--------------------------------------------------');
    console.log('SUCCESS: Database is fully synchronized.');
    console.log("You can now safely run: npm run build");
    console.log('--------------------------------------------------');

    db.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    db.close();
    process.exit(1);
  }
}

migrate();
