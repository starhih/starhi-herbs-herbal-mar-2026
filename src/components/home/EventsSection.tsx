'use client';

import { useState, useEffect, useRef } from 'react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, compareAsc } from 'date-fns';
import { Button } from '@/components/ui/button';
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
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

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

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle navigation
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(upcomingEvents.length - visibleCount, prev + 1));
  };

  // Get visible events
  const visibleEvents = upcomingEvents.slice(currentIndex, currentIndex + visibleCount);

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

        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#214842] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#214842] hover:text-white transition-colors"
              aria-label="Previous events"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              disabled={currentIndex >= upcomingEvents.length - visibleCount}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#214842] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#214842] hover:text-white transition-colors"
              aria-label="Next events"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Events Slider */}
          <div
            ref={sliderRef}
            className="overflow-hidden"
          >
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              style={{
                transform: `translateX(0)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              <AnimatePresence>
                {visibleEvents.map((event) => {
                  // Format dates
                  const startDate = new Date(event.startDate);
                  const endDate = new Date(event.endDate);
                  const formattedDateRange = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
                    ? `${format(startDate, 'MMM d')}-${format(endDate, 'd, yyyy')}`
                    : `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

                  return (
                    <motion.div
                      key={event.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                      onMouseEnter={() => setHoveredEvent(Number(event.id))}
                      onMouseLeave={() => setHoveredEvent(null)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="relative h-48 bg-white p-6 flex items-center justify-center">
                        <Image
                          src={event.image}
                          alt={event.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain p-4"
                        />
                      </div>

                      <div className="p-6 flex-grow">
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
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#214842] hover:text-[#258F67] font-medium mb-4 transition-colors"
                          >
                            Visit Event Website
                            <ExternalLink size={16} className="ml-2" />
                          </a>
                        )}
                      </div>

                      <div className="p-6 pt-0 mt-auto">
                        <Button asChild className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white">
                          <Link href="/request-meeting">Request Meeting</Link>
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(upcomingEvents.length / visibleCount) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleCount)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === Math.floor(currentIndex / visibleCount)
                    ? 'bg-[#214842]'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
