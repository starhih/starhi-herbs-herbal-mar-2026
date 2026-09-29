import type { CollectionConfig } from 'payload'

/**
 * Website form submissions (quote, sample, contact, catalogue, meeting, newsletter).
 * Written only by the server via the Local API; not creatable over REST/GraphQL.
 * Schema lives in migrate.cjs and /api/migrate (push is disabled for SQLite).
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'formType', 'company', 'country', 'status', 'createdAt'],
    listSearchableFields: ['name', 'email', 'company', 'products'],
    description: 'Every lead submitted through the website forms.',
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'formType',
      type: 'text',
      required: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'sourcePage',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', admin: { readOnly: true } },
        { name: 'email', type: 'email', admin: { readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { readOnly: true } },
        { name: 'company', type: 'text', admin: { readOnly: true } },
        { name: 'country', type: 'text', admin: { readOnly: true } },
      ],
    },
    {
      name: 'products',
      type: 'textarea',
      admin: { readOnly: true, description: 'Products, standardization and quantities requested' },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'data',
      type: 'json',
      admin: { readOnly: true, description: 'Full submission as received' },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal follow-up notes' },
    },
  ],
  timestamps: true,
}
