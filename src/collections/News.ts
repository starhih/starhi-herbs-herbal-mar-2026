import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
    slug: 'news',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    hooks: {
        afterChange: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/');
                    revalidatePath('/', 'page');
                    revalidatePath('/', 'layout');
                } catch (err) {
                    console.error('Error revalidating News:', err);
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
                    console.error('Error revalidating News deletion:', err);
                }
                return doc;
            }
        ],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
        },
        {
            name: 'date',
            type: 'date',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'category',
            type: 'text',
            required: true,
            admin: {
                description: 'e.g. Product Launch, Events, Certifications, News, Innovation',
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
            admin: {
                description: 'Fallback image URL if no media upload is provided',
            },
        },
        {
            name: 'url',
            type: 'text',
            admin: {
                description: 'Optional link URL when clicking the news item',
            },
        },
        {
            name: 'active',
            type: 'checkbox',
            defaultValue: true,
            admin: {
                position: 'sidebar',
                description: 'Show this news item in the ticker',
            },
        },
        {
            name: 'order',
            type: 'number',
            admin: {
                position: 'sidebar',
                description: 'Display order (lower numbers appear first)',
            },
        },
    ],
}
