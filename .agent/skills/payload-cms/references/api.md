# Payload APIs

Payload works with three APIs that share the same query language.

## Local API (Server-Side)

Direct database access with no HTTP overhead. Type-safe and fast.

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// Find documents
const result = await payload.find({
  collection: 'posts',
  where: {
    status: {
      equals: 'published',
    },
  },
  limit: 10,
})

// Create document
const post = await payload.create({
  collection: 'posts',
  data: {
    title: 'Hello World',
  },
})
```

## REST API

Standard HTTP endpoints at `/api/{collection}`.

-   GET `/api/posts`: List documents
-   POST `/api/posts`: Create document
-   GET `/api/posts/:id`: Get document
-   PATCH `/api/posts/:id`: Update document
-   DELETE `/api/posts/:id`: Delete document

Query parameters:
-   `where[status][equals]=published`
-   `limit=10`
-   `sort=-createdAt`

## GraphQL API

Endpoint: `/api/graphql` (also has Playground).

```graphql
query {
  Posts(where: { status: { equals: published } }) {
    docs {
      title
      slug
    }
  }
}
```
