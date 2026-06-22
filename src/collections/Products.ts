import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    hooks: {
        beforeChange: [
            async ({ data, req, operation }) => {
                // When a product is marked as Product of the Month,
                // unset all other products that currently have it
                if (data?.productOfTheMonth === true) {
                    const payload = req.payload;
                    const { docs } = await payload.find({
                        collection: 'products',
                        where: {
                            productOfTheMonth: { equals: true },
                        },
                        limit: 100,
                    });
                    for (const doc of docs) {
                        if (doc.id !== data.id) {
                            await payload.update({
                                collection: 'products',
                                id: doc.id,
                                data: { productOfTheMonth: false },
                            });
                        }
                    }
                }
                return data;
            },
        ],
        afterChange: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/');
                    revalidatePath('/', 'page');
                    revalidatePath('/', 'layout');
                } catch (err) {
                    req.payload.logger.error('Error revalidating path for product ' + doc.id);
                }

                try {
                    const baseUrl = 'https://starhiherbs.com';
                    let urlPath = `/products/${doc.slug}`;
                    if (doc.productType === 'branded') urlPath = `/branded-ingredients/${doc.slug}`;
                    if (doc.productType === 'vitamin-mineral') urlPath = `/vitamins-minerals/${doc.slug}`;
                    
                    const productUrl = `${baseUrl}${urlPath}`;
                    
                    const { submitToIndexNow } = await import('@/lib/indexnow');
                    submitToIndexNow([productUrl, `${baseUrl}/products`]).catch((err) => {
                        req.payload.logger.error('IndexNow submission failed for product: ' + err);
                    });
                } catch (indexNowErr) {
                    req.payload.logger.error('Error triggering IndexNow for product: ' + indexNowErr);
                }

                return doc;
            }
        ],
        afterDelete: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/');
                    revalidatePath('/', 'page');
                    revalidatePath('/', 'layout');
                } catch (err) {
                    req.payload.logger.error('Error revalidating path for product ' + doc.id);
                }
                return doc;
            }
        ],
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'productType',
            type: 'select',
            defaultValue: 'standard',
            options: [
                { label: 'Standard', value: 'standard' },
                { label: 'Branded', value: 'branded' },
                { label: 'Vitamin & Mineral', value: 'vitamin-mineral' },
                { label: 'Probiotic', value: 'probiotic' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            required: true,
        },
        {
            name: 'standardization',
            type: 'text',
        },
        {
            name: 'latinName',
            type: 'text',
        },
        {
            name: 'commonName',
            type: 'text',
            admin: {
                description: 'Common name of the plant/ingredient',
            },
        },
        {
            name: 'plantPart',
            type: 'text',
        },
        {
            name: 'moq',
            type: 'text',
            defaultValue: '25 kg',
            admin: {
                description: 'Minimum Order Quantity (e.g. 25 kg)',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'imageUrl',
            type: 'text',
        },
        {
            name: 'certifications',
            type: 'relationship',
            relationTo: 'certifications',
            hasMany: true,
        },
        {
            name: 'shortDescription',
            type: 'textarea',
        },
        {
            name: 'description',
            type: 'richText',
        },
        {
            name: 'benefits',
            type: 'array',
            fields: [
                {
                    name: 'benefit',
                    type: 'text',
                },
            ],
        },
        {
            name: 'specifications',
            type: 'group',
            fields: [
                { name: 'appearance', type: 'text' },
                { name: 'solubility', type: 'text' },
                { name: 'particleSize', type: 'text' },
                { name: 'heavyMetals', type: 'text' },
                { name: 'shelfLife', type: 'text' },
                { name: 'storage', type: 'text' },
                { name: 'activeCompounds', type: 'text' },
                { name: 'testing', type: 'text' },
            ],
        },
        {
            name: 'applications',
            type: 'array',
            fields: [
                {
                    name: 'application',
                    type: 'text',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
                {
                    name: 'imageUrl',
                    type: 'text',
                },
            ],
        },
        {
            name: 'research',
            type: 'richText',
        },
        {
            name: 'featured',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'productOfTheMonth',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Only one product can be Product of the Month. Selecting this will automatically unset any other product.',
            },
        },
        {
            name: 'productOfTheMonthTagline',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'Custom tagline shown on homepage (e.g. "Trending Now")',
                condition: (data) => data.productOfTheMonth === true,
            },
        },
        // Sections from products.ts
        {
            name: 'productionDetails',
            type: 'group',
            fields: [
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'imageUrl', type: 'text' },
            ],
        },
        {
            name: 'packaging',
            type: 'group',
            fields: [
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'imageUrl', type: 'text' },
            ],
        },
        {
            name: 'factory',
            type: 'group',
            fields: [
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'imageUrl', type: 'text' },
            ],
        },
        {
            name: 'certificationsSection',
            type: 'group',
            fields: [
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'imageUrl', type: 'text' },
                {
                    name: 'images',
                    type: 'array',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media' },
                        { name: 'imageUrl', type: 'text' },
                    ]
                }
            ],
        },
        {
            name: 'events',
            type: 'array',
            maxRows: 1,
            fields: [
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
                { name: 'imageUrl', type: 'text' },
                {
                    name: 'images',
                    type: 'array',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media' },
                        { name: 'imageUrl', type: 'text' },
                    ]
                }
            ],
        },
        {
            name: 'faqs',
            type: 'array',
            fields: [
                { name: 'question', type: 'text' },
                { name: 'answer', type: 'textarea' },
            ],
        },
        {
            name: 'variants',
            type: 'array',
            admin: {
                description: 'Product variants shown below specifications (e.g. Amla Extract - 20% Tannins - USP Grade)',
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Full variant name (e.g. Amla Extract - 20% Tannins - USP Grade)',
                    },
                },
                {
                    name: 'specDocument',
                    type: 'upload',
                    relationTo: 'media',
                    admin: {
                        description: 'Specification document (PDF) for download',
                    },
                },
            ],
        },
        {
            name: 'relatedProducts',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
        },
        // Branded specific fields
        {
            name: 'brandLogo',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (data) => data.productType === 'branded'
            }
        },
        {
            name: 'brandLogoUrl',
            type: 'text',
            admin: {
                description: 'External brand logo URL',
                condition: (data) => data.productType === 'branded'
            }
        },
        {
            name: 'clinicalResearch',
            type: 'group',
            admin: {
                condition: (data) => data.productType === 'branded'
            },
            fields: [
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                {
                    name: 'studies',
                    type: 'array',
                    fields: [
                        { name: 'title', type: 'text' },
                        { name: 'description', type: 'textarea' },
                        { name: 'link', type: 'text' },
                        { name: 'image', type: 'upload', relationTo: 'media' },
                        { name: 'imageUrl', type: 'text' },
                    ]
                }
            ]
        },
        // Vitamin specific fields
        {
            name: 'productIndications',
            type: 'group',
            admin: {
                condition: (data) => data.productType === 'vitamin-mineral'
            },
            fields: [
                { name: 'title', type: 'text' },
                {
                    name: 'indications',
                    type: 'array',
                    fields: [
                        { name: 'name', type: 'text' },
                        { name: 'icon', type: 'text' },
                        { name: 'description', type: 'textarea' },
                    ]
                }
            ]
        },
        {
            name: 'probioticDetails',
            type: 'group',
            admin: {
                condition: (data) => data.productType === 'probiotic'
            },
            fields: [
                { name: 'sporesPerGram', type: 'text' },
                { name: 'method', type: 'text', defaultValue: 'Microscopy' }
            ]
        },
        {
            name: 'isParentProduct',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar'
            }
        },
        {
            name: 'parentProduct',
            type: 'relationship',
            relationTo: 'products',
            admin: {
                position: 'sidebar',
                condition: (data) => !data.isParentProduct
            }
        },
        {
            name: 'childProducts',
            type: 'relationship',
            relationTo: 'products',
            hasMany: true,
            admin: {
                position: 'sidebar',
                condition: (data) => data.isParentProduct
            }
        }
    ],
}
