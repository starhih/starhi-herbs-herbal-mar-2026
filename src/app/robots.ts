import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Google-Extended',
          'cohere-ai',
          'PerplexityBot',
          'OAI-SearchBot',
        ],
        allow: ['/', '/llms.txt'],
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://starhiherbs.com/sitemap.xml',
  };
}
