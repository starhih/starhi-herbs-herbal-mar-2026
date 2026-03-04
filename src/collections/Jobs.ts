import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
    slug: 'jobs',
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
            name: 'department',
            type: 'text',
        },
        {
            name: 'location',
            type: 'text',
        },
        {
            name: 'type',
            type: 'text',
            admin: {
                description: 'e.g. Full-time, Contract',
            },
        },
        {
            name: 'experience',
            type: 'text',
        },
        {
            name: 'postedDate',
            type: 'date',
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'responsibilities',
            type: 'array',
            fields: [{ name: 'responsibility', type: 'text' }],
        },
        {
            name: 'requirements',
            type: 'array',
            fields: [{ name: 'requirement', type: 'text' }],
        },
        {
            name: 'qualifications',
            type: 'array',
            fields: [{ name: 'qualification', type: 'text' }],
        },
        {
            name: 'benefits',
            type: 'array',
            fields: [{ name: 'benefit', type: 'text' }],
        },
        {
            name: 'isActive',
            type: 'checkbox',
            defaultValue: true,
        },
    ],
}
