import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    label: 'Site Settings',
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'group',
            name: 'general',
            label: 'General',
            fields: [
                {
                    name: 'siteTitle',
                    type: 'text',
                    defaultValue: 'Star Hi Herbs Pvt Ltd',
                },
                {
                    name: 'tagline',
                    type: 'text',
                    defaultValue: 'Global manufacturer of premium herbal extracts, probiotics, and nutraceutical solutions for a healthier tomorrow.',
                },
                {
                    name: 'copyrightText',
                    type: 'text',
                    defaultValue: 'Star Hi Herbs Pvt Ltd. All rights reserved.',
                },
            ],
        },
        {
            type: 'group',
            name: 'contact',
            label: 'Contact Information',
            fields: [
                {
                    name: 'address',
                    type: 'textarea',
                    defaultValue: 'Plot #50, 3rd Road, 1st Phase\nK.I.A.D.B. Industrial Area, Jigani\nBangalore - 560105, Karnataka, India',
                },
                {
                    name: 'phone',
                    type: 'text',
                    defaultValue: '+91 98 8642 2452',
                },
                {
                    name: 'email',
                    type: 'text',
                    defaultValue: 'info@starhiherbs.com',
                },
            ],
        },
        {
            type: 'group',
            name: 'social',
            label: 'Social Media Links',
            fields: [
                {
                    name: 'linkedin',
                    type: 'text',
                    defaultValue: 'https://in.linkedin.com/company/star-hi-herbs-pvt-ltd',
                },
                {
                    name: 'facebook',
                    type: 'text',
                    defaultValue: 'https://www.facebook.com/StarHiHerbsNaturalExtracts/',
                },
                {
                    name: 'instagram',
                    type: 'text',
                    defaultValue: 'https://www.instagram.com/star.hi.herbs/',
                },
                {
                    name: 'twitter',
                    type: 'text',
                    admin: {
                        description: 'Leave empty to hide',
                    },
                },
                {
                    name: 'youtube',
                    type: 'text',
                    admin: {
                        description: 'Leave empty to hide',
                    },
                },
            ],
        },
    ],
}
