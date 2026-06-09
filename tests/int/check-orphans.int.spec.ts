import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll } from 'vitest'

const AFFECTED_SLUGS = [
  'organic-ashwagandha-extract',
  'capsicum-annum-extract',
  'coleus-forskohlii-extract',
  'organic-andrographis-extract',
  'terminalia-bellerica-extract',
  'berberis-aristata-extract',
  'black-pepper-extract',
  'terminalia-chebula-extract',
  'boswellia-serrata-extract',
  'senna-extract',
  'saw-palmetto-extract-oil',
  'centella-asiatica-extract',
  'organic-black-pepper-extract',
  'organic-gymnema-sylvestre-extract',
  'tribulus-terrestris-extract',
  'ocimum-sanctum-extract',
  'fenugreek-extract-1',
  'amla-extract',
  'turmeric-extract-granules',
  'dgl-extract',
  'piper-longum-extract',
  'andrographis-extract',
  'bacillius-clausii',
  'garcinia-cambogia-extract-1',
  'gymnema-sylvestre-extract',
  'turmeric',
  'organic-bacopa-monnieri-extract',
  'cinnamon-extract',
  'cissus-extract',
  'organic-cinnamon-extract',
  'garcinia-indica-extract',
  'organic-tribulus-terrestris-extract',
  'ginger-extract',
  'ashwagandha-extract',
  'star-ashwa-tulsi',
  'pomegranate-extract',
  'moringa-leaves-extract',
  'mucuna-extract',
  'coffee-bean-extract',
  'organic-turmeric-extract',
  'organic-centella-asiatica-extract',
  'organic-fenugreek-extract',
  'shilajit-extract',
  'organic-piper-longum-extract',
  'kidney-bean-extract',
  'momordica-extract',
  'organic-cissus-extract',
  'organic-moringa-extract',
  'commiphora-mukul-extract',
  'licorice-extract',
  'organic-ocimum-sanctum-extract',
  'organic-ginger-extract',
  'green-tea-extract',
  'organic-boswellia-serrata-extract',
  'organic-mucuna-extract',
  'cucumis-sativus-extract',
  'sesamin-extract',
  'clove-extract'
];

let payload: Payload

describe('Check Orphans', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('checks categories and products', async () => {
    console.log('--- ALL CATEGORIES ---')
    const categories = await payload.find({
      collection: 'categories',
      limit: 100,
    })
    for (const cat of categories.docs) {
      console.log(`Category: ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`)
    }

    console.log('--- PRODUCT VERIFICATION ---')
    const missingSlugs: string[] = []
    const existingProducts: any[] = []

    for (const slug of AFFECTED_SLUGS) {
      const { docs } = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
      })

      if (docs.length === 0) {
        missingSlugs.push(slug)
        console.log(`❌ Product with slug "${slug}" does NOT exist!`)
      } else {
        const product = docs[0]
        const cat = typeof product.category === 'object' ? (product.category as any) : null
        const catId = typeof product.category === 'object' ? (product.category as any).id : product.category
        existingProducts.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: catId,
          categorySlug: cat?.slug,
          productType: product.productType
        })
        console.log(`✅ Product with slug "${slug}" exists. Name: "${product.name}", Category: ${catId} (${cat?.name || 'unknown'})`)
      }
    }

    console.log(`\nSummary: ${existingProducts.length} exist, ${missingSlugs.length} missing.`)
  })
})
