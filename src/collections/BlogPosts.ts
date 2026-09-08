import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
    slug: 'blog-posts',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', '_status', 'author', 'publishedAt'],
        livePreview: {
            url: ({ data }) => {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
                return data?.slug ? `${baseUrl}/blog/${data.slug}` : baseUrl;
            },
        },
    },
    versions: {
        drafts: {
            autosave: {
                interval: 1500,
            },
        },
        maxPerDoc: 50,
    },
    access: {
        read: ({ req: { user } }) => {
            if (user) return true;
            return {
                _status: { equals: 'published' },
            };
        },
    },
    hooks: {
        afterChange: [
            async ({ doc, previousDoc, context }) => {
                if (context?.skipHooks) return doc;
                const isPublished = doc._status === 'published';
                const wasPublished = previousDoc?._status === 'published';

                // Revalidate cache if published or was unpublished
                if (isPublished || wasPublished) {
                    try {
                        const { revalidatePath } = await import('next/cache');
                        revalidatePath('/');
                        revalidatePath('/', 'page');
                        revalidatePath('/', 'layout');
                        revalidatePath('/blog');
                        if (doc.slug) {
                            revalidatePath(`/blog/${doc.slug}`);
                        }
                    } catch (err) {
                        console.error('Error revalidating BlogPosts:', err);
                    }
                }

                // Only submit to search engines if actively published
                if (isPublished) {
                    try {
                        const baseUrl = 'https://starhiherbs.com';
                        const postUrl = `${baseUrl}/blog/${doc.slug}`;
                        
                        const { submitToIndexNow } = await import('@/lib/indexnow');
                        submitToIndexNow([postUrl, `${baseUrl}/blog`]).catch((err) => {
                            console.error('IndexNow submission failed for blog post:', err);
                        });
                    } catch (indexNowErr) {
                        console.error('Error triggering IndexNow for blog post:', indexNowErr);
                    }
                }

                return doc;
            }
        ],
        afterDelete: [
            async ({ doc }) => {
                try {
                    const { revalidatePath } = await import('next/cache');
                    revalidatePath('/');
                    revalidatePath('/', 'page');
                    revalidatePath('/', 'layout');
                } catch (err) {
                    console.error('Error revalidating BlogPosts deletion:', err);
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
