"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAnalyticsConsent } from "@/lib/analytics";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    updateAnalyticsConsent(true);
    // Dispatch custom event to notify analytics component
    window.dispatchEvent(new CustomEvent('consent-updated'));
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    updateAnalyticsConsent(false);
    // Dispatch custom event to notify analytics component
    window.dispatchEvent(new CustomEvent('consent-updated'));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
      <div className="container-custom py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-base font-medium mb-1">This website uses cookies</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            We use cookies to improve your experience on our site, show you personalized content, and analyze our traffic.
            This includes Google Analytics and Microsoft Clarity for website analytics and user experience improvements.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={declineCookies}
            className="text-sm"
          >
            Decline
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={acceptCookies}
            className="bg-[#214842] hover:bg-[#258F67] text-sm"
          >
            Accept All Cookies
          </Button>
        </div>
        <button 
          onClick={declineCookies} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close cookie consent"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
