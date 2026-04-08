import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
    slug: 'events',
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
            name: 'startDate',
            type: 'date',
            required: true,
        },
        {
            name: 'endDate',
            type: 'date',
            required: true,
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'city',
            type: 'text',
        },
        {
            name: 'country',
            type: 'text',
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
        },
        {
            name: 'boothNumber',
            type: 'text',
        },
        {
            name: 'website',
            type: 'text',
        },
        {
            name: 'upcoming',
            type: 'checkbox',
            defaultValue: true,
        },
    ],
}
