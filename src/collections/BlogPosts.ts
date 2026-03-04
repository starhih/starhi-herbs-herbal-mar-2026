import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
    slug: 'blog-posts',
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
            name: 'slug',
            type: 'text',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'excerpt',
            type: 'textarea',
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
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
            name: 'publishedAt',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'blog-authors',
            required: true,
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'blog-categories',
            required: true,
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'blog-tags',
            hasMany: true,
        },
        {
            name: 'readTime',
            type: 'number',
        },
        {
            name: 'showInNewsTicker',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Show this blog post in the homepage news ticker',
            },
        },
    ],
}
