'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, compareAsc } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventItem {
  id: string | number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  country: string;
  description: string;
  image: string;
  boothNumber?: string;
  website?: string;
  upcoming: boolean;
}

interface EventsSectionProps {
  events: EventItem[];
}

export default function EventsSection({ events }: EventsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sort upcoming events by date (closest first)
  const upcomingEvents = events
    .filter(event => event.upcoming)
    .sort((a, b) => compareAsc(new Date(a.startDate), new Date(b.startDate)));

  // Update visible count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = upcomingEvents.length;
  const maxIndex = Math.max(0, totalSlides - visibleCount);

  const prev = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, isAnimating]);

  const next = useCallback(() => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0;
      }
      return prevIndex + 1;
    });
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, maxIndex]);

  // Auto-scroll effect
  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      autoScrollIntervalRef.current = setInterval(() => {
        if (!isPaused && totalSlides > visibleCount) {
          next();
        }
      }, 4000); // Scroll every 4 seconds
    };

    startAutoScroll();

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [next, isPaused, totalSlides, visibleCount]);

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Meet Us</h6>
          <h2 className="text-[#214842] mb-4">Upcoming Events & Exhibitions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with our team at these industry events to explore our herbal extract innovations and discuss your specific requirements.
          </p>
        </div>

        <div className="relative border-x border-transparent px-4 md:px-8">
          {/* Navigation Buttons */}
          <button
            onClick={() => {
              prev();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
            disabled={currentIndex === 0}
            className="absolute top-1/2 left-0 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#214842] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#214842] hover:text-white transition-colors"
            aria-label="Previous events"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => {
              next();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
            disabled={currentIndex >= maxIndex}
            className="absolute top-1/2 right-0 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#214842] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#214842] hover:text-white transition-colors"
            aria-label="Next events"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronRight size={20} />
          </button>

          {/* Events Slider */}
          <div
            ref={sliderRef}
            className="overflow-hidden -mx-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {upcomingEvents.map((event) => {
                // Format dates
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);
                const formattedDateRange = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
                  ? `${format(startDate, 'MMM d')}-${format(endDate, 'd, yyyy')}`
                  : `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

                return (
                  <div
                    key={event.id}
                    className="flex-none px-4"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="relative h-48 bg-white flex items-center justify-center border-b border-gray-50">
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="bg-[#214842]/10 p-2 rounded-full flex-shrink-0 mt-1">
                            <Calendar className="h-5 w-5 text-[#214842]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-[#214842]">{event.name}</h3>
                            <p className="text-[#258F67] font-medium">{formattedDateRange}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 mb-4">
                          <div className="bg-[#214842]/10 p-2 rounded-full flex-shrink-0 mt-1">
                            <MapPin className="h-5 w-5 text-[#214842]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">{event.location}</p>
                            <p className="text-gray-600">{event.city}, {event.country}</p>
                            {event.boothNumber && (
                              <p className="text-[#258F67] font-medium mt-1">Booth: {event.boothNumber}</p>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-6 line-clamp-3">{event.description}</p>

                        {event.website && (
                          <div className="mt-auto mb-4">
                            <a
                              href={event.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-[#214842] hover:text-[#258F67] font-medium transition-colors"
                            >
                              Visit Event Website
                              <ExternalLink size={16} className="ml-2" />
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="p-6 pt-0 mt-auto">
                        <Button asChild className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white">
                          <Link href="/request-meeting">Request Meeting</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);

                    // Pause auto-scrolling when user interacts
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 5000);
                  }
                }}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  currentIndex === index ? "bg-[#214842] w-8" : "bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to slide ${index + 1}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
