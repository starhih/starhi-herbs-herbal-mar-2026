'use client';

import { useState, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Turnstile, { TurnstileRef } from '@/components/Turnstile';
import { analytics } from '@/lib/analytics';

export default function SubscribeForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileRef>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const email = formData.get('email') as string;
    const website_hp = formData.get('website_hp') as string;

    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, email, turnstileToken, website_hp }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        turnstileRef.current?.reset();
        setTurnstileToken('');
        throw new Error(data.error || 'Failed to subscribe to newsletter');
      }

      analytics.trackNewsletterSubscribe();
      setStatus('success');
      turnstileRef.current?.reset();
      setTurnstileToken('');
    } catch (error: any) {
      turnstileRef.current?.reset();
      setTurnstileToken('');
      console.error('Subscription error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[#258F67]/10 p-6 rounded-xl border border-[#258F67]/20 flex flex-col items-center justify-center text-center">
        <CheckCircle2 size={48} className="text-[#258F67] mb-4" />
        <h3 className="text-xl font-semibold text-[#214842] mb-2">Thank you for subscribing!</h3>
        <p className="text-[#258F67]">You&apos;ve been successfully added to our mailing list.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm underline text-gray-500 hover:text-gray-700"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
        {/* Honeypot field for bot protection */}
        <input
          type="text"
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden opacity-0 absolute pointer-events-none -z-10"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            name="firstName"
            placeholder="First Name (Optional)"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#258F67] w-full sm:w-1/3"
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#258F67] flex-grow w-full"
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#214842] text-white px-8 py-3 rounded-lg hover:bg-[#258F67] transition-colors font-medium whitespace-nowrap disabled:opacity-70 flex items-center justify-center"
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {/* Cloudflare Turnstile */}
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            action="subscribe"
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
          />
        </div>
      </form>
      
      {status === 'error' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}

