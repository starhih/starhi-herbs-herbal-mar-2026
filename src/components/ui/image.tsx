'use client';

import { useEffect, useState } from 'react';
import NextImage, { ImageProps as NextImageProps, ImageLoaderProps } from 'next/image';

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

function isImageKitUrl(url: string): boolean {
  return url.startsWith('https://ik.imagekit.io/');
}

/**
 * Derive the alternate source for an image:
 * - If src is a Payload media URL → no alternate
 * - If src is an ImageKit URL → no alternate
 * - If src is a relative path like /images/... → the same file on ImageKit
 */
function getAlternateSource(src: string): string | null {
  if (isPayloadMediaUrl(src)) return null;
  if (src.includes(IMAGEKIT_URL)) return null;
  if (src.startsWith('/')) return `${IMAGEKIT_URL}${src}`;
  return null;
}

/**
 * ImageKit resizes and compresses on its CDN (format is negotiated automatically, WebP/AVIF),
 * so these images skip the Next.js optimizer. SVGs are rasterised to PNG at the requested
 * width: several brand logos are SVGs with embedded photos weighing 700KB+.
 */
function imageKitLoader({ src, width, quality }: ImageLoaderProps): string {
  const isSvg = /\.svg($|\?)/i.test(src);
  const transforms = [`w-${width}`, `q-${quality || 75}`, ...(isSvg ? ['f-png'] : [])].join(',');
  return `${src}${src.includes('?') ? '&' : '?'}tr=${transforms}`;
}

export interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  /** Optional second image source, used if the first one fails to load */
  fallbackSrc?: string;
}

/**
 * Image with a backup source.
 * - Renders `src` straight away (so it is in the server HTML and can be the LCP image).
 * - On error: first retries without the Next.js optimizer, then switches to `fallbackSrc`
 *   (or, for relative paths, the same file on ImageKit).
 */
export default function Image({ src, fallbackSrc, onError, ...props }: ImageProps) {
  const effectiveFallback = fallbackSrc || getAlternateSource(src) || undefined;

  const [imageSrc, setImageSrc] = useState<string>(src);
  const [failed, setFailed] = useState(false);
  const [autoUnoptimized, setAutoUnoptimized] = useState(false);

  // Reset when the caller passes a different image
  useEffect(() => {
    setImageSrc(src);
    setFailed(false);
    setAutoUnoptimized(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const isUnoptimizedDisabled = props.unoptimized !== undefined ? props.unoptimized : false;

    // First fallback: if optimization failed, try the original file directly
    if (!autoUnoptimized && !isUnoptimizedDisabled && isExternalUrl(imageSrc)) {
      setAutoUnoptimized(true);
      return;
    }

    // Second fallback: the alternate source
    if (!failed && effectiveFallback && imageSrc !== effectiveFallback) {
      setImageSrc(effectiveFallback);
      setFailed(true);
      setAutoUnoptimized(false);
    }

    onError?.(e);
  };

  if (!imageSrc) return null;

  const useUnoptimized = props.unoptimized !== undefined ? props.unoptimized : autoUnoptimized;
  const loader = !useUnoptimized && !props.loader && isImageKitUrl(imageSrc) ? imageKitLoader : undefined;
  // Next 16's `priority`/`preload` only preloads the image; it does not raise its fetch priority
  const fetchPriority = props.fetchPriority ?? (props.priority || props.preload ? 'high' : undefined);

  return (
    <NextImage
      src={imageSrc}
      onError={handleError}
      unoptimized={useUnoptimized}
      {...(loader ? { loader } : {})}
      {...props}
      fetchPriority={fetchPriority}
    />
  );
}
