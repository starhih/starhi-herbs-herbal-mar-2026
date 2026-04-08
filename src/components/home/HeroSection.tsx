"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full bg-[#214842]">
        <div className="youtube-container">
          <div className="youtube-video">
            <iframe
              src="https://www.youtube.com/embed/UXkw8H5tpXE?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&playlist=UXkw8H5tpXE&modestbranding=1&enablejsapi=1&disablekb=1&fs=0&color=white&playsinline=1&origin=https://starhiherbs.com&autohide=1&version=3"
              title="Herbal Extract Background Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="youtube-iframe"
            ></iframe>
          </div>
        </div>
        <div className="overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="hidden">
              <h1 className="sr-only">Star Hi Herbs - Premium Herbal Extracts and Bulk Formulations</h1>
            </div>
          </div>
        </div>
      </div>


      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 uppercase tracking-widest opacity-80" style={{ color: 'white' }}>Scroll</span>
          <div className="w-0.5 h-8 bg-white opacity-60 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}
