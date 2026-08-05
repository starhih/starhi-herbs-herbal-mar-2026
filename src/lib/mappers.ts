import type { Product as PayloadProduct, Category as PayloadCategory, Media, Certification } from '@/payload-types';
import type { Product as FrontendProduct, ProductCategory as FrontendCategory } from '@/data/types';

/**
 * Helper to get image URL from Media or ID
 */
export const getImageUrl = (media: number | Media | null | undefined): string => {
    if (!media) return '';
    if (typeof media === 'number') return ''; // Or some placeholder if we only have ID
    return media.url || '';
};

/**
 * Extract plain text from Payload Lexical rich text JSON
 */
export const richTextToPlainText = (content: any): string => {
    if (!content || !content.root || !content.root.children) return '';
    const extractText = (nodes: any[]): string => {
        return nodes.map((node: any) => {
            if (node.type === 'text') return node.text || '';
            if (node.children) return extractText(node.children);
            return '';
        }).join('');
    };
    return content.root.children.map((node: any) => {
        if (node.children) return extractText(node.children);
        return '';
    }).join('\n').trim();
};

/**
 * Maps Payload Product to Frontend Product
 */
export const mapProduct = (p: PayloadProduct): FrontendProduct | null => {
    if (!p) {
        console.warn('[mapProduct] Received null/undefined product, skipping.');
        return null;
    }

    // Resolve category
    let categoryName = '';
    let categorySlug = '';
    // Since we are fetching on server, we might populate category. 
    // If it's just ID, we can't get name/slug without looking it up or populating.
    // We assume depth is sufficient.
    if (typeof p.category !== 'number' && p.category) {
        categoryName = p.category.name;
        categorySlug = p.category.slug;
    }

    // Certifications
    const certifications = (p.certifications || [])
        .map(c => {
            if (typeof c === 'number') return '';
            return c.name;
        })
        .filter(Boolean);

    // Certification icons (name + image URL)
    const certificationIcons = (p.certifications || [])
        .map(c => {
            if (typeof c === 'number') return null;
            const img = getImageUrl(c.image) || (c as any).imageUrl || '';
            return img ? { name: c.name, image: img } : null;
        })
        .filter(Boolean) as { name: string; image: string }[];

    // Benefits
    const benefits = (p.benefits || [])
        .map(b => b.benefit || '')
        .filter(Boolean);

    return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        categoryId: typeof p.category === 'number' ? String(p.category) : String(p.category.id),
        categorySlug,
        categoryName,
        standardization: p.standardization || '',
        commonName: (p as any).commonName || '',
        latinName: p.latinName || '',
        plantPart: p.plantPart || '',
        moq: (p as any).moq || '25 kg',
        image: getImageUrl(p.image) || p.imageUrl || '',
        imageFallback: getImageUrl(p.image) ? (p.imageUrl || '') : '',
        certifications,
        certificationIcons,
        description: richTextToPlainText(p.description),
        shortDescription: p.shortDescription || '',
        benefits,
        specifications: p.specifications as any, // Type mismatch might occur, cast to any for now or map precisely
        applications: (p.applications || []).map(a => a.application || '').filter(Boolean),
        documents: ((p as any).documents || []).map((d: any) => ({
            id: d.id || '',
            name: d.name || '',
            url: getImageUrl(d.file) || d.url || '',
            size: d.size || ''
        })),
        variants: ((p as any).variants || []).filter((v: any) => v.name).map((v: any) => ({
            name: v.name,
            specDocumentUrl: getImageUrl(v.specDocument) || '',
        })),
        research: richTextToPlainText(p.research),
        featured: p.featured || false,
        updatedAt: p.updatedAt,
        createdAt: p.createdAt,
        productType: p.productType as any,
        // Vitamins & Minerals
        indications: (p as any).productIndications ? ((p as any).productIndications.indications || []).map((i: any) => i.name) : undefined,
        productIndications: (p as any).productIndications ? {
            title: (p as any).productIndications.title || '',
            description: (p as any).productIndications.description || '',
            indications: ((p as any).productIndications.indications || []).map((i: any) => ({
                name: i.name || '',
                icon: getImageUrl(i.icon),
                description: i.description || ''
            }))
        } : undefined,
        probioticDetails: (p as any).probioticDetails ? {
            sporesPerGram: (p as any).probioticDetails.sporesPerGram || '',
            method: (p as any).probioticDetails.method || 'Microscopy'
        } : undefined,
        productApplications: (p as any).productApplications ? {
            title: (p as any).productApplications.title || '',
            description: (p as any).productApplications.description || '',
            applications: ((p as any).productApplications.applications || []).map((a: any) => ({
                name: a.name || '',
                icon: getImageUrl(a.icon),
                description: a.description || ''
            }))
        } : undefined,

        // Relationships
        isParentProduct: (p as any).isParentProduct || false,
        parentProductId: (p as any).parentProduct ? (typeof (p as any).parentProduct === 'object' ? String((p as any).parentProduct.id) : String((p as any).parentProduct)) : undefined,
        childProducts: ((p as any).childProducts || []).map((cp: any) => typeof cp === 'object' ? String(cp.id) : String(cp)),
        relatedProducts: ((p as any).relatedProducts || []).map((rp: any) => typeof rp === 'object' ? String(rp.id) : String(rp)),

        // Branded Ingredients
        brandLogo: getImageUrl((p as any).brandLogo) || (p as any).brandLogoUrl || '',
        clinicalResearch: (p as any).clinicalResearch ? {
            title: (p as any).clinicalResearch.title || '',
            description: (p as any).clinicalResearch.description || '',
            studies: ((p as any).clinicalResearch.studies || []).map((s: any) => ({
                title: s.title || '',
                description: s.description || '',
                link: s.link || '',
                image: getImageUrl(s.image) || s.imageUrl || ''
            }))
        } : undefined,
        healthClaims: (p as any).healthClaims ? {
            title: (p as any).healthClaims.title || '',
            claims: ((p as any).healthClaims.claims || []).map((c: any) => c.claim || c)
        } : undefined,
        whitepaper: (p as any).whitepaper ? {
            title: (p as any).whitepaper.title || '',
            description: (p as any).whitepaper.description || '',
            link: (p as any).whitepaper.link || '',
            image: getImageUrl((p as any).whitepaper.image) || (p as any).whitepaper.imageUrl || ''
        } : undefined,
        mechanism: (p as any).mechanism ? {
            title: (p as any).mechanism.title || '',
            description: (p as any).mechanism.description || '',
            image: getImageUrl((p as any).mechanism.image) || (p as any).mechanism.imageUrl || ''
        } : undefined,
        sustainability: (p as any).sustainability ? {
            title: (p as any).sustainability.title || '',
            description: (p as any).sustainability.description || '',
            points: ((p as any).sustainability.points || []).map((pt: any) => pt.point || pt),
            image: getImageUrl((p as any).sustainability.image) || (p as any).sustainability.imageUrl || ''
        } : undefined,
        whyChoose: (p as any).whyChoose ? {
            title: (p as any).whyChoose.title || '',
            description: (p as any).whyChoose.description || '',
            points: ((p as any).whyChoose.points || []).map((pt: any) => pt.point || pt),
            image: getImageUrl((p as any).whyChoose.image) || (p as any).whyChoose.imageUrl || ''
        } : undefined,

        // Production sections
        productionDetails: p.productionDetails?.description ? {
            description: p.productionDetails.description || '',
            image: getImageUrl(p.productionDetails.image) || (p.productionDetails as any).imageUrl || '',
        } : undefined,

        packaging: p.packaging?.description ? {
            description: p.packaging.description || '',
            image: getImageUrl(p.packaging.image) || (p.packaging as any).imageUrl || '',
        } : undefined,

        factory: p.factory?.description ? {
            description: p.factory.description || '',
            image: getImageUrl(p.factory.image) || (p.factory as any).imageUrl || '',
        } : undefined,

        certificationsSection: p.certificationsSection?.description ? {
            description: p.certificationsSection.description || '',
            image: getImageUrl(p.certificationsSection.image) || (p.certificationsSection as any).imageUrl || '',
            images: (p.certificationsSection as any).images?.map((img: any) => getImageUrl(img.image) || img.imageUrl || '').filter(Boolean) || [],
        } : undefined,

        events: (p.events && p.events.length > 0) ? {
            description: p.events[0]?.description || '',
            image: getImageUrl(p.events[0]?.image) || (p.events[0] as any)?.imageUrl || '',
            images: (p.events[0] as any)?.images?.map((img: any) => getImageUrl(img.image) || img.imageUrl || '').filter(Boolean) || [],
        } : undefined,

        faqs: (p.faqs || []).filter((f: any) => f.question && f.answer).map((f: any, idx: number) => ({
            id: f.id || idx,
            question: f.question,
            answer: f.answer,
            updatedAt: p.updatedAt,
            createdAt: p.createdAt,
        })),
    };
};

/**
 * Maps Payload Category to Frontend Category
 */
export const mapCategory = (c: PayloadCategory): FrontendCategory | null => {
    if (!c) {
        console.warn('[mapCategory] Received null/undefined category, skipping.');
        return null;
    }

    return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description || '',
        image: getImageUrl(c.image) || c.imageUrl || '',
        imageFallback: getImageUrl(c.image) ? (c.imageUrl || '') : '',
        heroImage: getImageUrl(c.heroImage) || c.heroImageUrl || '',
        heroImageFallback: getImageUrl(c.heroImage) ? (c.heroImageUrl || '') : '',
        homepageImage: getImageUrl(c.homepageImage) || c.homepageImageUrl || '',
        homepageImageFallback: getImageUrl(c.homepageImage) ? (c.homepageImageUrl || '') : '',
        count: c.count || 0,
        longDescription: c.longDescription,
        faqs: (c.faqs || []).filter((f: any) => f.question && f.answer).map((f: any, idx: number) => ({
            id: f.id || String(idx),
            question: f.question,
            answer: f.answer,
        })),
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
        // Products would need to be populated if requested
    };
};

const mapBlogAuthor = (a: any): any => ({
    id: a.id,
    name: a.name || '',
    role: a.role || '',
    image: getImageUrl(a.image) || a.imageUrl || '',
    bio: a.bio || '',
    certificates: (a.certificates || []).map((c: any) => c.certificate || c)
});

const mapBlogCategory = (c: any): any => ({
    id: c.id,
    name: c.name || '',
    slug: c.slug || '',
    description: c.description || ''
});

const mapBlogTag = (t: any): any => ({
    id: t.id,
    name: t.name || '',
    slug: t.slug || ''
});

export const mapBlogPost = (p: any): any => {
    return {
        id: p.id,
        title: p.title || '',
        slug: p.slug || '',
        excerpt: p.excerpt || '',
        content: p.content || '',
        image: getImageUrl(p.image) || p.imageUrl || '',
        publishedAt: p.publishedAt || p.createdAt,
        updatedAt: p.updatedAt,
        authorId: typeof p.author === 'object' ? p.author?.id : p.author,
        author: typeof p.author === 'object' ? mapBlogAuthor(p.author) : undefined,
        categoryId: typeof p.category === 'object' ? p.category?.id : p.category,
        category: typeof p.category === 'object' ? mapBlogCategory(p.category) : undefined,
        tagIds: (p.tags || []).map((t: any) => typeof t === 'object' ? t.id : t),
        tags: (p.tags || []).map((t: any) => typeof t === 'object' ? mapBlogTag(t) : undefined).filter(Boolean),
        readTime: p.readTime || 5,
        tableOfContents: p.tableOfContents || []
    };
};

export const mapJob = (j: any): any => {
    return {
        id: j.id,
        title: j.title || '',
        slug: j.slug || '',
        location: j.location || '',
        type: j.type || '',
        department: j.department || '',
        description: j.description || '',
        requirements: (j.requirements || []).map((r: any) => r.requirement || r),
        responsibilities: (j.responsibilities || []).map((r: any) => r.responsibility || r),
        qualifications: (j.qualifications || []).map((q: any) => q.qualification || q),
        benefits: (j.benefits || []).map((b: any) => b.benefit || b),
        postedAt: j.postedAt || j.createdAt
    };
};

export { mapBlogCategory, mapBlogTag, mapBlogAuthor };

/**
 * Maps Payload Event to Frontend Event
 */
export const mapEvent = (e: any): any => {
    if (!e) {
        console.warn('[mapEvent] Received null/undefined event, skipping.');
        return null;
    }
    return {
        id: e.id,
        name: e.name || '',
        slug: e.slug || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        location: e.location || '',
        city: e.city || '',
        country: e.country || '',
        description: e.description || '',
        image: getImageUrl(e.image) || e.imageUrl || '',
        boothNumber: e.boothNumber || '',
        website: e.website || '',
        upcoming: e.upcoming ?? true,
    };
};

/**
 * Maps Payload Award to Frontend Award
 */
export const mapAward = (a: any): any => {
    if (!a) {
        console.warn('[mapAward] Received null/undefined award, skipping.');
        return null;
    }
    
    let title = a.title || '';
    let year = a.year || '';

    return {
        id: a.id,
        title,
        year,
        description: a.description || '',
        image: getImageUrl(a.image) || a.imageUrl || '',
    };
};

/**
 * Maps Payload Certification to Frontend Certification (for homepage carousel)
 */
export const mapCertification = (c: any): any => {
    if (!c) {
        console.warn('[mapCertification] Received null/undefined certification, skipping.');
        return null;
    }
    return {
        id: c.id,
        name: c.name || '',
        description: c.description || '',
        image: getImageUrl(c.image) || c.imageUrl || '',
    };
};

/**
 * Maps Payload News to Frontend NewsItem
 */
export const mapNewsItem = (n: any): any => {
    if (!n) {
        console.warn('[mapNewsItem] Received null/undefined news item, skipping.');
        return null;
    }
    return {
        id: n.id,
        title: n.title || '',
        excerpt: n.excerpt || '',
        date: n.date || '',
        category: n.category || '',
        image: getImageUrl(n.image) || n.imageUrl || '',
        url: n.url || '/news',
    };
};
