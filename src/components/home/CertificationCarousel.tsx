"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from '@/components/ui/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface CertificationItem {
  id: string | number;
  name: string;
  description: string;
  image: string;
}

interface CertificationCarouselProps {
  certifications: CertificationItem[];
}

export default function CertificationCarousel({ certifications }: CertificationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 768) {
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3);
      } else {
        setItemsToShow(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = certifications.length;
  const maxIndex = totalSlides - itemsToShow;

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
      // If we're at the end, loop back to the beginning
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
      // Clear any existing interval
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      // Set new interval for auto-scrolling
      autoScrollIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          next();
        }
      }, 3000); // Scroll every 3 seconds
    };

    startAutoScroll();

    // Cleanup on component unmount
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [next, isPaused]);

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Trust & Quality</h6>
          <h2 className="text-[#214842] mb-4">Our Certifications</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We adhere to the highest international standards to ensure quality, safety, and compliance in all our products.
          </p>
        </div>

        <div className="relative px-10">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute top-1/2 left-0 -translate-y-1/2 z-10 rounded-full bg-white border-gray-200",
              currentIndex <= 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              prev();
              setIsPaused(true);
              // Resume auto-scrolling after 5 seconds of inactivity
              setTimeout(() => setIsPaused(false), 5000);
            }}
            disabled={currentIndex <= 0}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous slide</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute top-1/2 right-0 -translate-y-1/2 z-10 rounded-full bg-white border-gray-200"
            )}
            onClick={() => {
              next();
              setIsPaused(true);
              // Resume auto-scrolling after 5 seconds of inactivity
              setTimeout(() => setIsPaused(false), 5000);
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next slide</span>
          </Button>

          {/* Carousel container */}
          <div
            className="overflow-hidden"
            ref={containerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
              }}
            >
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-3"
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="relative h-48">
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold text-[#214842] mb-1">{cert.name}</h4>
                      <p className="text-gray-600 text-sm">{cert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index ? "bg-[#214842] w-6" : "bg-gray-300"
                )}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);

                    // Pause auto-scrolling when user interacts
                    setIsPaused(true);
                    // Resume auto-scrolling after 5 seconds of inactivity
                    setTimeout(() => setIsPaused(false), 5000);
                  }
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
