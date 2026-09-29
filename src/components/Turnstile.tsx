'use client';

import React, { useCallback, useEffect, useRef, useImperativeHandle, useState, forwardRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          action?: string;
          cData?: string;
          callback?: (token: string) => void;
          'error-callback'?: (code: string) => void;
          'expired-callback'?: () => void;
          'timeout-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          retry?: 'auto' | 'never';
          'refresh-expired'?: 'auto' | 'manual' | 'never';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
    onTurnstileLoaded?: () => void;
  }
}

export interface TurnstileRef {
  reset: () => void;
  getResponse: () => string | undefined;
}

interface TurnstileProps {
  siteKey?: string;
  action?: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  className?: string;
}

const DEFAULT_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEloIfOcLru_hAZf';

let scriptLoadingPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]');
    if (existingScript) {
      if (window.turnstile) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  (
    {
      siteKey = DEFAULT_SITE_KEY,
      action = 'inquiry',
      onVerify,
      onError,
      onExpire,
      theme = 'light',
      size = 'normal',
      className = '',
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    // Keep latest callbacks in refs so function reference changes do not trigger re-renders
    const onVerifyRef = useRef(onVerify);
    onVerifyRef.current = onVerify;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    const onExpireRef = useRef(onExpire);
    onExpireRef.current = onExpire;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
        }
      },
      getResponse: () => {
        if (widgetIdRef.current && window.turnstile) {
          return window.turnstile.getResponse(widgetIdRef.current);
        }
        return undefined;
      },
    }));

    useEffect(() => {
      let isMounted = true;

      loadTurnstileScript().then(() => {
        if (!isMounted || !containerRef.current || !window.turnstile) return;

        // Clean up previous widget instance if container re-rendered
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore if already removed
          }
          widgetIdRef.current = null;
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            theme,
            size,
            // Let Cloudflare retry transient failures itself instead of leaving the widget stuck
            retry: 'auto',
            'refresh-expired': 'auto',
            callback: (token: string) => {
              if (isMounted) {
                onVerifyRef.current?.(token);
              }
            },
            'error-callback': (code: string) => {
              console.error('[Turnstile] Cloudflare challenge error code:', code);
              if (isMounted && onErrorRef.current) {
                onErrorRef.current(code);
              }
            },
            'expired-callback': () => {
              if (isMounted && onExpireRef.current) {
                onExpireRef.current();
              }
            },
            // An interactive challenge left unsolved times out; start a fresh one
            'timeout-callback': () => {
              if (!isMounted) return;
              onExpireRef.current?.();
              if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
              }
            },
          });
          widgetIdRef.current = id;
        } catch (err) {
          console.error('Turnstile render error:', err);
        }
      });

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // Ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, action, theme, size]);

    return (
      <div className={`turnstile-container my-2 ${className}`}>
        <div ref={containerRef} />
      </div>
    );
  }
);

Turnstile.displayName = 'Turnstile';

/**
 * Token state for a form's Turnstile widget. Spread `widgetProps` onto <Turnstile>,
 * keep the submit button disabled until `ready`, and call `reset()` once after every
 * request that reached the server (tokens are single-use).
 */
export function useTurnstile() {
  const ref = useRef<TurnstileRef>(null);
  const [token, setToken] = useState('');
  const [failed, setFailed] = useState(false);

  const reset = useCallback(() => {
    setToken('');
    setFailed(false);
    ref.current?.reset();
  }, []);

  const widgetProps = {
    ref,
    onVerify: (value: string) => {
      setToken(value);
      setFailed(false);
    },
    onExpire: () => setToken(''),
    onError: () => {
      setToken('');
      setFailed(true);
    },
  };

  return { token, ready: token.length > 0, failed, reset, widgetProps };
}

/** Small status line shown under the widget while the check is pending or failing. */
export function TurnstileStatus({ ready, failed }: { ready: boolean; failed: boolean }) {
  if (ready) return null;
  return (
    <p className={`text-xs ${failed ? 'text-red-600' : 'text-gray-500'}`} role="status">
      {failed
        ? 'Security check failed. It will retry automatically; if this persists, please refresh the page.'
        : 'Completing security check… the submit button unlocks once it is done.'}
    </p>
  );
}

export default Turnstile;
