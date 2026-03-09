import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Certifications } from './collections/Certifications'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { BlogAuthors } from './collections/BlogAuthors'
import { BlogCategories } from './collections/BlogCategories'
import { BlogTags } from './collections/BlogTags'
import { BlogPosts } from './collections/BlogPosts'
import { Events } from './collections/Events'
import { Jobs } from './collections/Jobs'
import { News } from './collections/News'
import { Awards } from './collections/Awards'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Logo#Logo',
      },
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'].filter(Boolean),
  collections: [
    Users,
    Media,
    Certifications,
    Categories,
    Products,
    BlogAuthors,
    BlogCategories,
    BlogTags,
    BlogPosts,
    Events,
    Jobs,
    News,
    Awards,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT || '',
        forcePathStyle: true,
      },
    }),
  ],
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    defaultFromName: 'Star Hi Herbs',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
