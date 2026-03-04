'use client';

import { useState, useEffect, useRef } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/pon54xoks';

/**
 * Check if a URL is external (not a local/relative path)
 */
function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Check if a URL is a Payload media URL
 */
function isPayloadMediaUrl(url: string): boolean {
  return url.includes('/api/media/');
}

/**
 * Derive the alternate source for an image:
 * - If src is a Payload media URL → generate ImageKit URL from the imageUrl pattern
 * - If src is an ImageKit URL → it will be used directly, Payload URL is the alt
 * - If src is a relative path like /images/... → generate ImageKit URL
 */
function getAlternateSource(src: string): string | null {
  // Payload media URL → can't derive an ImageKit path from it
  if (isPayloadMediaUrl(src)) return null;

  // Already an ImageKit URL → no alternate needed
  if (src.includes(IMAGEKIT_URL)) return null;

  // Relative path like /images/products/xxx.jpg → make ImageKit URL
  if (src.startsWith('/')) {
    return `${IMAGEKIT_URL}${src}`;
  }

  return null;
}

/**
 * Race image URLs — resolve with whichever loads first.
 */
function raceImageUrls(urls: string[], signal?: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    let settled = false;
    let failCount = 0;
    const imgs: HTMLImageElement[] = [];

    const cleanup = () => { imgs.forEach(img => { img.src = ''; }); };

    signal?.addEventListener('abort', () => {
      if (!settled) { settled = true; cleanup(); reject(new DOMException('Aborted', 'AbortError')); }
    });

    urls.forEach(url => {
      const img = new window.Image();
      imgs.push(img);
      img.onload = () => { if (!settled) { settled = true; cleanup(); resolve(url); } };
      img.onerror = () => {
        failCount++;
        if (!settled && failCount >= urls.length) {
          settled = true; cleanup(); reject(new Error('All image sources failed'));
        }
      };
      img.src = url;
    });
  });
}

export interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  /** Optional second image source — whichever loads first will be displayed */
  fallbackSrc?: string;
}

/**
 * Custom Image component that supports dual sources.
 * - If both `src` and `fallbackSrc` are provided, races them — fastest wins.
 * - If only `src` is provided but it's a relative path, auto-generates an ImageKit URL as alternate.
 * - External URLs skip the Next.js image optimizer to avoid server-side fetch timeouts.
 */
export default function Image({
  src,
  fallbackSrc,
  onError,
  ...props
}: ImageProps) {
  // Compute the effective fallback (explicit prop or auto-derived)
  const effectiveFallback = fallbackSrc || getAlternateSource(src) || undefined;

  const [imageSrc, setImageSrc] = useState<string>(src);
  const [failed, setFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();

    const sources = [src, effectiveFallback].filter(Boolean) as string[];
    if (sources.length === 0) return;

    // Single source — use directly
    if (sources.length === 1) {
      setImageSrc(sources[0]);
      setFailed(false);
      return;
    }

    // Race both sources
    const controller = new AbortController();
    abortRef.current = controller;

    raceImageUrls(sources, controller.signal)
      .then(winner => {
        if (!controller.signal.aborted) {
          setImageSrc(winner);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setImageSrc(src);
          setFailed(true);
        }
      });

    return () => { controller.abort(); };
  }, [src, effectiveFallback]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!failed && effectiveFallback && imageSrc !== effectiveFallback) {
      setImageSrc(effectiveFallback);
      setFailed(true);
    } else if (!failed && effectiveFallback && imageSrc !== src) {
      setImageSrc(src);
      setFailed(true);
    }

    if (onError) {
      onError(e);
    }
  };

  if (!imageSrc) return null;

  // Skip Next.js image optimizer for external URLs to avoid server-side fetch timeouts
  const useUnoptimized = isExternalUrl(imageSrc);

  return (
    <NextImage
      src={imageSrc}
      onError={handleError}
      unoptimized={useUnoptimized}
      {...props}
    />
  );
}
