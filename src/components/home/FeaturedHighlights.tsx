"use client";
import { useState, useRef } from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { Product } from '@/data/types';

interface NewsItem {
  id: string | number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  url?: string;
}

interface FeaturedHighlightsProps {
  product: Product | null;
  tagline: string;
  newsItems: NewsItem[];
}

export default function FeaturedHighlights({ product, tagline, newsItems }: FeaturedHighlightsProps) {
  // State for the news ticker
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // If no product is found, don't render the section
  if (!product) return null;

  // Extract key product details
  const { name, standardization, shortDescription, slug, image } = product;

  // Determine the correct URL based on product type
  const getProductUrl = () => {
    if (product.productType === 'branded') {
      return `/branded-ingredients/${slug}`;
    }
    if (product.productType === 'vitamin-mineral') {
      return `/vitamins-minerals/${slug}`;
    }
    return `/products/${slug}`;
  };

  // Handle mouse enter/leave for pausing the ticker
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Create a duplicate array of news items for continuous scrolling
  const duplicatedNewsItems = [...newsItems, ...newsItems];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product of the Month Column */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="relative">
              <div className="absolute top-0 left-0 bg-[#214842] text-white px-4 py-2 rounded-br-lg z-10">
                <span className="text-sm font-medium">Product Of The Month</span>
              </div>
              <div className="relative h-64 w-full">
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#214842] mb-2">{name}</h3>
              <div className="flex items-center mb-3">
                <div className="px-3 py-1 bg-[#258F67]/10 text-[#258F67] rounded-full text-xs font-medium mr-2">
                  {standardization}
                </div>
                <div className="px-3 py-1 bg-[#214842]/10 text-[#214842] rounded-full text-xs font-medium">
                  {tagline}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {shortDescription}
              </p>
              <Link
                href={getProductUrl()}
                className="inline-flex items-center text-[#258F67] font-medium hover:text-[#214842] transition-colors"
              >
                Read More <span className="sr-only">about {name}</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* News & Updates Ticker Column */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-[#214842] text-white px-4 py-2">
              <h3 className="text-lg font-medium">News & Updates</h3>
            </div>
            <div
              className="h-[calc(100%-48px)] min-h-[300px] overflow-hidden relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={tickerRef}
                className={`news-ticker-container ${isPaused ? 'paused' : ''}`}
                style={{
                  height: 'auto',
                  position: 'absolute',
                  width: '100%',
                  zIndex: 10,
                  willChange: 'transform',
                  animation: 'ticker-scroll 40s linear infinite'
                }}
              >
                {duplicatedNewsItems.map((newsItem, index) => {
                  // Link to the news page
                  const newsUrl = newsItem.url || '/news';

                  return (
                    <div
                      key={`${newsItem.id}-${index}`}
                      className="news-ticker-item border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        href={newsUrl}
                        className="block relative z-20 cursor-pointer"
                        onClick={(e) => {
                          // Ensure the link works even during animation
                          if (!isPaused) {
                            e.stopPropagation();
                            window.location.href = newsUrl;
                          }
                        }}
                      >
                        <div className="p-5 flex items-start gap-4">
                          <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={newsItem.image}
                              alt={newsItem.title}
                              fill
                              sizes="96px"
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              priority={index < 4} // Prioritize loading first few images
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center text-xs text-[#258F67] mb-2">
                              <span suppressHydrationWarning>{formatDate(newsItem.date)}</span>
                              <span className="mx-2">•</span>
                              <span className="bg-[#258F67]/10 px-2 py-1 rounded-full text-xs">{newsItem.category}</span>
                            </div>
                            <h4 className="text-[#214842] font-semibold mb-2 line-clamp-2 hover:text-[#258F67] transition-colors">
                              {newsItem.title}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {newsItem.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the CSS for the ticker */}
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .news-ticker-container {
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .news-ticker-container.paused {
          animation-play-state: paused !important;
        }

        .news-ticker-item {
          position: relative;
          z-index: 10;
          pointer-events: auto;
          cursor: pointer;
        }

        .news-ticker-item:hover {
          z-index: 20;
          background-color: rgba(249, 250, 251, 0.8);
        }

        /* Ensure links are clickable */
        .news-ticker-item a {
          display: block;
          position: relative;
          z-index: 30;
        }
      `}</style>
    </section>
  );
}
