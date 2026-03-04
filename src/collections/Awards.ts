import type { CollectionConfig } from 'payload'

export const Awards: CollectionConfig = {
    slug: 'awards',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
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
