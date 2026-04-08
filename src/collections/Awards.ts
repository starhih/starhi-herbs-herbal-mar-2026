import type { CollectionConfig } from 'payload'

export const Awards: CollectionConfig = {
    slug: 'awards',
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
                    revalidatePath('/', 'layout');
                } catch (err) {}
                return doc;
            }
        ],
        afterDelete: [
            async ({ doc, req }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/', 'layout');
                } catch (err) {}
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
            name: 'year',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
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
                description: 'External image URL (e.g. ImageKit)',
            },
        },
    ],
}
