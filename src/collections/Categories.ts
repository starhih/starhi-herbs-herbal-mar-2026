import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
    },
    hooks: {
        afterChange: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/', 'layout');
                } catch (_err) {
                    req.payload.logger.error('Error revalidating path for category ' + doc.id);
                }
                return doc;
            }
        ],
        afterDelete: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/', 'layout');
                } catch (_err) {
                    req.payload.logger.error('Error revalidating path for category ' + doc.id);
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
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'longDescription',
            type: 'richText',
        },
        {
            name: 'faqs',
            type: 'array',
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'answer',
                    type: 'textarea',
                    required: true,
                },
            ],
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
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'heroImageUrl',
            type: 'text',
        },
        {
            name: 'homepageImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'homepageImageUrl',
            type: 'text',
        },
        {
            name: 'count',
            type: 'number',
            admin: {
                description: 'Number of products in this category',
            },
        },
    ],
}
