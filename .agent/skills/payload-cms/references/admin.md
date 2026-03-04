# Admin Panel Customization

## Custom Components

You can swap out default components with your own React components.

```ts
// payload.config.ts or Collection Config
admin: {
  components: {
    // Replace standard views
    views: {
      Dashboard: './components/Dashboard',
    },
    // Inject into areas
    beforeListTable: ['./components/MyAlert'],
    // Replace field components
    edit: {
        SaveButton: './components/CustomSave',
    }
  },
}
```

## Live Preview

See frontend changes in realtime while editing.

```ts
// Collection Config
admin: {
  livePreview: {
    url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${data.slug}`,
  },
}
```

## I18n

Support multiple languages in the Admin UI.

```ts
// payload.config.ts
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'

i18n: {
  supportedLanguages: { en, fr },
  translations: {
    fr: {
      custom: {
        myLabel: 'Mon étiquette',
      }
    }
  }
}
```
