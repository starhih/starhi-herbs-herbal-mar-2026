import { Metadata } from 'next';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getPayloadClient } from '@/lib/payload';
import { mapNewsItem } from '@/lib/mappers';
import { formatDate } from '@/utils/date';
import Breadcrumbs from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'News & Updates | Star Hi Herbs',
  description: 'Latest news, product launches, and company updates from Star Hi Herbs.',
};

export default async function NewsPage() {
  const payload = await getPayloadClient();

  // Fetch all news from Payload
  const { docs: newsDocs } = await payload.find({
    collection: 'news',
    pagination: false,
    sort: '-date',
  });
  const newsItems = newsDocs.map(mapNewsItem).filter(Boolean);

  // Group news by category
  const newsByCategory = newsItems.reduce((acc: Record<string, any[]>, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'News & Updates', href: '/news' }
            ]}
          />
        </div>
      </div>

      {/* Header */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-[#214842] mb-6">
              News & Updates
            </h1>
            <p className="text-xl text-gray-600">
              Stay updated with the latest developments, product launches, and company news from Star Hi Herbs.
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="section-padding">
        <div className="container-custom">
          {Object.entries(newsByCategory).map(([category, items]) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-[#214842] mb-8 border-b border-gray-200 pb-4">
                {category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 bg-[#214842] text-white px-4 py-1 text-sm">
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-[#214842] mb-3 group-hover:text-[#258F67] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#258F67] bg-[#258F67]/10 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                        <Link
                          href="/blog"
                          className="inline-flex items-center text-[#258F67] font-medium hover:text-[#214842] transition-colors text-sm"
                        >
                          Read More
                          <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
