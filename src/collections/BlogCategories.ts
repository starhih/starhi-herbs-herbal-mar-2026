import type { CollectionConfig } from 'payload'

export const BlogCategories: CollectionConfig = {
    slug: 'blog-categories',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
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
        },
        {
            name: 'description',
            type: 'textarea',
        },
    ],
}
