"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";

export default function B2BDisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem("starhi-b2b-disclaimer-accepted");
    if (!hasAccepted) {
      // Show the disclaimer after a tiny delay for a smoother load feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("starhi-b2b-disclaimer-accepted", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-y-auto animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label="B2B website disclaimer"
      >
        {/* Close "X" button at the top right */}
        <button 
          onClick={handleAccept}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-all duration-150 z-10"
          aria-label="Close disclaimer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center">
          {/* Logo container */}
          <div className="mb-6 sm:mb-8 md:mb-10 relative h-[55px] sm:h-[75px] w-full max-w-[220px] sm:max-w-[300px]">
            <Image 
              src="https://ik.imagekit.io/pon54xoks/Star%20Hi%20Herbs%20Green%20LOGO%2001.svg?updatedAt=1770631428073"
              alt="Star Hi Herbs"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Disclaimer Text */}
          <div className="space-y-4 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed text-center font-normal max-w-xl border-t border-b border-gray-100 py-6 sm:py-8 my-2">
            <p>
              Please note that this website is not aimed at consumers as the information herein contained does not make reference to finished products; the website is available for various countries all over the world and hence it may contain statements or product classification not applicable to your country.
            </p>
            <p className="text-[11px] sm:text-xs md:text-sm text-gray-500 italic mt-3">
              All trademark registrations referenced on this website refer to registrations in India, the European Union, or other international jurisdictions.
            </p>
          </div>

          {/* Action button */}
          <div className="mt-6 sm:mt-8 w-full max-w-[180px] sm:max-w-[200px]">
            <Button 
              onClick={handleAccept}
              className="w-full bg-[#214842] hover:bg-[#258F67] text-white py-2.5 sm:py-3 rounded-xl font-medium tracking-wide text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg"
            >
              I Understand & Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
