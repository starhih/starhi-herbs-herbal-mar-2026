# Payload Configuration

The `payload.config.ts` file is the heart of your Payload application.

## Basic Structure

```ts
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb' // or postgres/sqlite
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  secret: process.env.PAYLOAD_SECRET,
  admin: {
    user: 'users', // Collection slug for auth
  },
  collections: [
    // Your collections here
  ],
  globals: [
    // Your globals here
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URL,
  }),
  editor: lexicalEditor({}),
})
```

## Key Options

| Option | Description |
| :--- | :--- |
| `serverURL` | Absolute URL of your app (protocol + domain). |
| `secret` | Secure string for encryption (required). |
| `db` | Database adapter (MongoDB, Postgres, SQLite). |
| `editor` | Default rich text editor (Lexical recommended). |
| `admin` | Admin panel configuration (custom components, live preview). |
| `cors` | Configure CORS (white-list arrays or `'*'`). |
| `typescript` | Configure type generation (`outputFile`, `autoGenerate`). |
| `graphQL` | Configure or disable GraphQL. |
| `i18n` | Internationalization settings. |

## TypeScript

Payload auto-generates types for your config. You can customize this:

```ts
typescript: {
  outputFile: path.resolve(__dirname, 'payload-types.ts'),
}
```
