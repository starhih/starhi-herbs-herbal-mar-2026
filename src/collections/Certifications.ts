import type { CollectionConfig } from 'payload'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  hooks: {
      afterChange: [
          async ({ doc, req }) => {
              try {
                  const { revalidatePath } = await import('next/cache');
                  revalidatePath('/', 'layout');
              } catch (err) {}
              return doc;
          }
      ],
      afterDelete: [
          async ({ doc, req }) => {
              try {
                  const { revalidatePath } = await import('next/cache');
                  revalidatePath('/', 'layout');
              } catch (err) {}
              return doc;
          }
      ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'External image URL (e.g. ImageKit)',
      },
    },
    {
      name: 'certificatePdf',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload the certificate in PDF format',
      },
    },
  ],
}
