# Collections & Globals

## Collections

Collections act as database tables for recurring data (Users, Posts, Products).

```ts
import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status'],
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
        name: 'status',
        type: 'select',
        options: ['draft', 'published'],
        defaultValue: 'draft',
    }
  ],
}
```

## Globals

Globals are singletons (Header, Footer, Site Settings).

```ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}
```

## Access Control

Control who can create, read, update, or delete documents.

```ts
access: {
  read: ({ req: { user } }) => {
    if (user?.role === 'admin') return true
    return {
      status: {
        equals: 'published',
      },
    }
  },
}
```

## Hooks

Run logic at specific points in the lifecycle (before/after change, read, delete).

```ts
hooks: {
  beforeChange: [
    ({ data }) => {
      // modify data before save
      return { ...data, lastModifiedBy: 'system' }
    }
  ]
}
```
