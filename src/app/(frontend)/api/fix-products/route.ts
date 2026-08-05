import { getPayloadClient } from '@/lib/payload';
import { NextResponse } from 'next/server';

export async function GET() {
  const payload = await getPayloadClient();
  
  // 1. Fetch probiotics category
  const probCategories = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'probiotics' } },
  });
  
  const probioticsCategory = probCategories.docs[0];
  if (probioticsCategory) {
    const probioticProducts = [
      { name: 'Bacillius clausii', sporesPerGram: '25,200,300', method: 'Microscopy' },
      { name: 'Bacillius Lichenformis', sporesPerGram: '200', method: 'Microscopy' },
      { name: 'Bacillus SP ( Blend of B. coagulans, B.Clausii, B.Subtilis)', sporesPerGram: '350', method: 'Microscopy' },
      { name: 'Bacillius Subtilis', sporesPerGram: '100,200', method: 'Microscopy' },
      { name: 'Bacillus Coagullans (Bacospore)', sporesPerGram: '200', method: 'Microscopy' }
    ];

    for (const p of probioticProducts) {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await payload.find({ collection: 'products', where: { slug: { equals: slug } } });
      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'products',
          data: {
            name: p.name,
            slug: slug,
            category: probioticsCategory.id,
            productType: 'probiotic',
            probioticDetails: {
              sporesPerGram: p.sporesPerGram,
              method: p.method
            }
          }
        });
      } else {
        await payload.update({
          collection: 'products',
          id: existing.docs[0].id,
          data: {
            productType: 'probiotic',
            category: probioticsCategory.id,
            probioticDetails: {
              sporesPerGram: p.sporesPerGram,
              method: p.method
            }
          }
        });
      }
    }
  }

  // 2. Fetch Storg parent and update it with children dynamically based on slug
  const vitCategory = await payload.find({ collection: 'categories', where: { slug: { equals: 'vitamins-minerals' } } });
  
  if (vitCategory.docs[0]) {
    // create storg parent if not exists
    let storgParent = await payload.find({ collection: 'products', where: { slug: { equals: 'storg-plant-based-vitamins-minerals' } } }).then(res => res.docs[0]);
    if (!storgParent) {
      storgParent = await payload.create({
        collection: 'products',
        data: {
          name: 'Storg® Plant-based Natural Vitamins & Minerals',
          slug: 'storg-plant-based-vitamins-minerals',
          category: vitCategory.docs[0].id,
          productType: 'vitamin-mineral',
          isParentProduct: true,
        }
      });
    } else {
      await payload.update({ collection: 'products', id: storgParent.id, data: { isParentProduct: true } });
    }

    const storgChildren = [
      { name: 'Storg B', slug: 'storg-b', indications: ['Energy Metabolism', 'Nervous System Health'] },
      { name: 'Storg BS', slug: 'storg-bs', indications: ['Liver Protection', 'Fatigue Reduction'] },
      { name: 'Storg BIO', slug: 'storg-bio', indications: ['Hair Growth', 'Skin Health', 'Nail Strength'] },
      { name: 'Storg BT', slug: 'storg-bt', indications: ['Vision Health', 'Skin Nutrition'] },
      { name: 'Storg C', slug: 'storg-c', indications: ['Immunity Support', 'Collagen Formation'] },
      { name: 'Storg E', slug: 'storg-e', indications: ['Antioxidant Protection', 'Cellular Health'] },
      { name: 'Storg FA', slug: 'storg-fa', indications: ['Maternal Health', 'Red Blood Cell Formation'] },
      { name: 'Storg I', slug: 'storg-i', indications: ['Blood Health', 'Cognitive Function'] },
      { name: 'Storg N', slug: 'storg-n', indications: ['Cholesterol Management', 'Skin Health'] },
      { name: 'Storg SE', slug: 'storg-se', indications: ['Thyroid Function', 'Immunity Support'] },
      { name: 'Storg ZN', slug: 'storg-zn', indications: ['Immunity Support', 'Wound Healing', 'Skin Health'] },
      { name: 'Storg HER', slug: 'storg-her', indications: ['Women\'s General Health', 'Bone Health', 'Energy Metabolism'] },
      { name: 'Storg HIM', slug: 'storg-him', indications: ['Men\'s General Health', 'Muscle Function', 'Energy Metabolism'] },
      { name: 'Storg KID', slug: 'storg-kid', indications: ['Children\'s Growth', 'Immunity Support', 'Bone Health', 'Cognitive Function'] }
    ];

    const childIds: number[] = [];

    for (const c of storgChildren) {
      let existingChild = await payload.find({ collection: 'products', where: { slug: { equals: c.slug } } }).then(res => res.docs[0]);
      if (!existingChild) {
        existingChild = await payload.create({
          collection: 'products',
          data: {
            name: c.name,
            slug: c.slug,
            category: vitCategory.docs[0].id,
            productType: 'vitamin-mineral',
            parentProduct: storgParent.id,
            productIndications: {
              indications: c.indications.map(ind => ({ name: ind, icon: '' }))
            }
          }
        });
      } else {
        await payload.update({
          collection: 'products',
          id: existingChild.id,
          data: {
            parentProduct: storgParent.id,
            productType: 'vitamin-mineral',
            category: vitCategory.docs[0].id,
            productIndications: {
               indications: c.indications.map(i => ({ name: i }))
            }
          }
        });
      }
      childIds.push(existingChild.id as number);
    }
    
    // Update parent with children
    await payload.update({
      collection: 'products',
      id: storgParent.id,
      data: {
        childProducts: childIds
      }
    });
  }

  return NextResponse.json({ success: true, message: 'Products seeded successfully' });
}
