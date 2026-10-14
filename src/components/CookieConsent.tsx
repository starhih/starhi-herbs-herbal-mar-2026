"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateAnalyticsConsent } from "@/lib/analytics";
import { useShortlist } from "@/components/shortlist/ShortlistProvider";

// Request flow pages: the notice would sit over the form, so it waits for the next page
const HIDDEN_ON = ["/request-quote", "/request-sample", "/thank-you"];

/** Height of the visible notice, read by ShortlistBar to sit above it */
const OFFSET_VAR = "--cookie-notice-offset";

export default function CookieConsent() {
  const [needsConsent, setNeedsConsent] = useState(false);
  const { isOpen: shortlistOpen } = useShortlist();
  const pathname = usePathname();
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setNeedsConsent(true);
    }
  }, []);

  const isVisible = needsConsent && !shortlistOpen && !HIDDEN_ON.includes(pathname ?? "");

  // Publish the notice height so the shortlist bar can move up instead of being covered
  useEffect(() => {
    const root = document.documentElement;
    const notice = noticeRef.current;
    if (!isVisible || !notice) {
      root.style.removeProperty(OFFSET_VAR);
      return;
    }
    const observer = new ResizeObserver(() => {
      root.style.setProperty(OFFSET_VAR, `${notice.offsetHeight}px`);
    });
    observer.observe(notice);
    return () => {
      observer.disconnect();
      root.style.removeProperty(OFFSET_VAR);
    };
  }, [isVisible]);

  const saveChoice = (choice: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", choice);
    updateAnalyticsConsent(choice === "accepted");
    // Dispatch custom event to notify analytics component
    window.dispatchEvent(new CustomEvent('consent-updated'));
    setNeedsConsent(false);
  };

  if (!isVisible) return null;

  // Mobile: slim strip along the bottom. Desktop: small card in the bottom-left corner,
  // clear of the chat bubble on the right. z-30 keeps it behind the shortlist bar (z-40)
  // and drawer (z-50), so it never covers a Request button.
  return (
    <div
      ref={noticeRef}
      role="region"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white px-4 py-3 shadow-lg animate-slide-up dark:border-gray-700 dark:bg-gray-900 md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-xl md:border md:p-4"
    >
      <div className="flex items-center gap-3 md:flex-col md:items-stretch">
        <p className="flex-1 text-xs leading-snug text-gray-600 dark:text-gray-300 md:text-sm">
          We use cookies for analytics to improve our site.{" "}
          <Link href="/privacy-policy" className="underline text-[#214842] dark:text-gray-100">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2 md:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveChoice("declined")}
            className="h-8 px-3 text-xs md:text-sm"
          >
            Decline
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => saveChoice("accepted")}
            className="h-8 px-3 bg-[#214842] hover:bg-[#258F67] text-xs md:text-sm"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
