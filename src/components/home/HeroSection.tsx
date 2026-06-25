"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from '@/components/ui/image';

export default function HeroSection() {
  const [loadVideo, setLoadVideo] = useState(false);

  useEffect(() => {
    // Delay loading YouTube iframe to prevent JS execution blocking on initial render
    const timer = setTimeout(() => {
      setLoadVideo(true);
    }, 3000); 

    // Alternatively, load immediately on first interaction
    const handleInteraction = () => setLoadVideo(true);
    window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] w-full overflow-hidden bg-[#214842]">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        {!loadVideo && (
           <img
             src="https://ik.imagekit.io/pon54xoks/starhi-herbs%20-white-02.svg" 
             className="absolute inset-0 w-full h-full object-cover opacity-10 filter blur-sm" 
             alt="Star Hi Herbs Background Logo"
             fetchPriority="high"
             decoding="sync"
           />
        )}
        {loadVideo && (
          <div className="youtube-container animate-fade-in transition-opacity duration-1000">
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
        )}
        <div className="overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-3xl">
            <div className="hidden">
              <h1 className="sr-only">
                Star Hi Herbs - Top Herbal Extract Manufacturer in India & Bangalore. We are the largest Coleus Extract and Sesamin Extract manufacturer in the world.
              </h1>
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
