import type { CollectionConfig } from 'payload'

export const BlogAuthors: CollectionConfig = {
    slug: 'blog-authors',
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
            name: 'role',
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
        {
            name: 'bio',
            type: 'textarea',
        },
        {
            name: 'certificates',
            type: 'array',
            fields: [{ name: 'certificate', type: 'text' }],
        },
    ],
}
