"use client";

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from '@/components/ui/image';

export default function VideoStory() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h6 className="text-[#258F67] uppercase tracking-wider mb-2 font-medium">Our Journey</h6>
          <h2 className="text-[#214842] mb-4">Our Story, Our Commitment to Quality</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Watch how we combine traditional herbal wisdom with modern scientific methods to create the highest quality extracts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video">
            {/* Video thumbnail and overlay (shown when video is not playing) */}
            {!isPlaying ? (
              <div className="absolute inset-0 bg-[#214842]/40 flex items-center justify-center z-10">
                <Button
                  onClick={togglePlay}
                  className="rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-white/30 w-20 h-20 flex items-center justify-center"
                  aria-label="Play video"
                >
                  <Play size={36} fill="white" />
                </Button>
                <Image src="/images/team-hassan-unit-starhiherbs.png"
                  alt="Video thumbnail"
                  fill
                  className="object-cover -z-10"
                  priority
                />
              </div>
            ) : (
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/SUmtvuTztyI?autoplay=1&mute=1&controls=1&rel=0"
                title="Star Hi Herbs Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 italic">
              &ldquo;Our commitment to quality starts from the seed and continues through every step of our process, ensuring we deliver nature&apos;s best benefits in every extract.&rdquo;
            </p>
            <p className="mt-2 font-medium text-[#214842]">— Dr. Thomas Lee, Founder & Chief Scientific Officer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
