import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    // Only signed-in admins can add users. The very first account is created through
    // Payload's /admin/create-first-user flow, which does not use this check.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
