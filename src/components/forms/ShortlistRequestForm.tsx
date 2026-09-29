'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { handleError, logError } from '@/utils/error-handling';
import { analytics } from '@/lib/analytics';
import { markLeadSubmitted, thankYouUrl, type LeadType } from '@/lib/lead-success';
import Turnstile, { TurnstileStatus, useTurnstile } from '@/components/Turnstile';
import ShortlistItemEditor from '@/components/shortlist/ShortlistItemEditor';
import ProductSearchAdd from '@/components/shortlist/ProductSearchAdd';
import {
  describeQuantity,
  describeStandardization,
  itemProblem,
  useShortlist,
  wantsQuote,
  wantsSample,
  type ShortlistItem,
} from '@/components/shortlist/ShortlistProvider';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const COMPANY_TYPES = [
  ['manufacturer', 'Manufacturer'],
  ['distributor', 'Distributor'],
  ['retailer', 'Retailer'],
  ['brand-owner', 'Brand Owner'],
  ['contract-manufacturer', 'Contract Manufacturer'],
  ['research', 'Research / Academic'],
  ['other', 'Other'],
] as const;

const TIMEFRAMES = [
  ['immediate', 'Immediate (1-2 weeks)'],
  ['short', 'Short-term (1-2 months)'],
  ['medium', 'Medium-term (3-6 months)'],
  ['long', 'Long-term (6+ months)'],
] as const;

const baseSchema = z.object({
  otherProducts: z.string().optional(),
  fullName: z.string().trim().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  phone: z.string().trim().min(6, { message: 'Please enter a valid phone number' }),
  jobTitle: z.string().optional(),
  company: z.string().trim().min(2, { message: 'Company name must be at least 2 characters' }),
  companyType: z.string().min(1, { message: 'Please select a company type' }),
  country: z.string().trim().min(2, { message: 'Please enter your country' }),
  website: z.string().optional(),
  timeframe: z.string().min(1, { message: 'Please select your timeframe' }),
  intendedUse: z.string().optional(),
  additionalInfo: z.string().optional(),
  streetAddress: z.string().optional(),
  streetAddress2: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, { message: 'You must accept the terms and conditions' }),
  website_hp: z.string().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

/** Shipping address is only required when at least one sample is requested. */
function buildSchema(needsShipping: boolean) {
  if (!needsShipping) return baseSchema;
  return baseSchema.superRefine((data, ctx) => {
    const required: [keyof FormValues, number, string][] = [
      ['streetAddress', 5, 'Please enter your street address'],
      ['city', 2, 'Please enter your city'],
      ['postalCode', 3, 'Please enter your postal code'],
    ];
    for (const [field, min, message] of required) {
      if (String(data[field] ?? '').trim().length < min) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }
  });
}

function productLines(items: ShortlistItem[]) {
  return items
    .map((item, index) => {
      const parts = [
        wantsQuote(item) ? `Quote: ${describeQuantity(item)}` : null,
        wantsSample(item) ? `Sample: ${item.sampleSize}` : null,
        `Standardization: ${describeStandardization(item)}`,
      ].filter(Boolean);
      return `${index + 1}. ${item.name} — ${parts.join(' | ')}`;
    })
    .join('\n');
}

function unique(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim()))));
}

interface ShortlistRequestFormProps {
  /** Request type for products added from this page and for a request with no products listed */
  defaultRequest: 'quote' | 'sample';
}

export default function ShortlistRequestForm({ defaultRequest }: ShortlistRequestFormProps) {
  const router = useRouter();
  const { items, hydrated, clear } = useShortlist();
  const turnstile = useTurnstile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const hasQuote = items.length > 0 ? items.some(wantsQuote) : defaultRequest === 'quote';
  const hasSample = items.length > 0 ? items.some(wantsSample) : defaultRequest === 'sample';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: (values, context, options) => zodResolver(buildSchema(hasSample))(values, context, options),
    defaultValues: {
      otherProducts: '',
      fullName: '',
      email: '',
      phone: '',
      jobTitle: '',
      company: '',
      companyType: '',
      country: '',
      website: '',
      timeframe: '',
      intendedUse: '',
      additionalInfo: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      postalCode: '',
      termsAccepted: false,
      website_hp: '',
    },
  });

  const otherProducts = watch('otherProducts') ?? '';
  const noProducts = items.length === 0 && !otherProducts.trim();
  const itemsInvalid = items.some((item) => itemProblem(item) !== null);

  const onSubmit = async (data: FormValues) => {
    setAttempted(true);
    setSubmitError(null);
    if (noProducts) {
      setSubmitError('Please add at least one product to your request.');
      return;
    }
    if (itemsInvalid) {
      setSubmitError('Please complete the highlighted product details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { sendQuoteRequestEmail, sendSampleRequestEmail } = await import('@/lib/email-service');
      const requestType = hasQuote && hasSample ? 'Quote + Sample' : hasSample ? 'Sample' : 'Quote';
      const { termsAccepted, website_hp, otherProducts: other, ...contact } = data;

      const payload = {
        requestType,
        products: productLines(items) || 'None selected from the catalogue',
        otherProducts: other?.trim() || undefined,
        // Flat summaries used by the CRM integration
        productDetails: unique([...items.map((item) => item.name), other?.trim()]).join(', '),
        productCategory: unique(items.map((item) => item.category)).join(', ') || 'Not specified',
        standardization:
          items.map((item) => `${item.name}: ${describeStandardization(item)}`).join('; ') || 'See product notes',
        quantity:
          items
            .map((item) =>
              [wantsQuote(item) ? describeQuantity(item) : null, wantsSample(item) ? `sample ${item.sampleSize}` : null]
                .filter(Boolean)
                .map((q) => `${item.name}: ${q}`)
                .join('; '),
            )
            .join('; ') || 'See product notes',
        ...contact,
        ...(hasSample
          ? {}
          : { streetAddress: undefined, streetAddress2: undefined, city: undefined, postalCode: undefined }),
        termsAccepted,
        website_hp,
        turnstileToken: turnstile.token,
      };

      const send = hasQuote ? sendQuoteRequestEmail : sendSampleRequestEmail;
      const result = await send(payload);
      if (!result.success) throw new Error(result.error || 'Failed to submit the form');

      if (hasQuote) analytics.trackQuoteSubmit();
      if (hasSample) analytics.trackSampleSubmit();
      const leadType: LeadType = hasQuote && hasSample ? 'quote-sample' : hasSample ? 'sample' : 'quote';
      markLeadSubmitted(leadType);
      clear();
      router.push(thankYouUrl(leadType));
    } catch (error) {
      // The token was spent on this attempt; get a fresh one before the next try
      turnstile.reset();
      const errorMessage = handleError(error, 'Failed to submit the form. Please try again.');
      setSubmitError(errorMessage);
      logError(errorMessage, 'ShortlistRequestForm', error);
      setIsSubmitting(false);
    }
  };

  const fieldError = (name: keyof FormValues) =>
    errors[name] ? <p className="text-red-500 text-xs mt-1">{String(errors[name]?.message)}</p> : null;

  const submitLabel = hasQuote && hasSample ? 'Request Quote & Samples' : hasSample ? 'Request Samples' : 'Request Quote';

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => setAttempted(true))}
      className="space-y-6"
      noValidate
    >
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
          <p>{submitError}</p>
        </div>
      )}

      {/* Products */}
      <div>
        <h3 className="text-lg font-semibold text-[#214842]">Products</h3>
        <p className="text-xs text-gray-600 mt-1">
          Choose quote and/or sample and the standardization you need for each product.{' '}
          <Link href="/products" className="underline text-[#214842]">
            Browse all products
          </Link>
        </p>
      </div>

      <div className="space-y-3">
        {!hydrated ? (
          <div className="h-24 rounded-lg bg-gray-100 animate-pulse" />
        ) : (
          items.map((item) => <ShortlistItemEditor key={item.id} item={item} showErrors={attempted} />)
        )}
        <ProductSearchAdd defaultRequest={defaultRequest} />
        {attempted && noProducts && (
          <p className="text-red-500 text-xs">Please add at least one product.</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="otherProducts" className="text-sm font-medium text-gray-700">
          Other products or specification notes
        </label>
        <Textarea
          id="otherProducts"
          {...register('otherProducts')}
          placeholder="Anything not in our catalogue, target specs, certifications (organic, halal, kosher)…"
          className="min-h-[70px]"
        />
      </div>

      {/* Contact */}
      <h3 className="text-lg font-semibold text-[#214842] pt-2">Your Details</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input id="fullName" autoComplete="name" {...register('fullName')} placeholder="Your full name" className={cn(errors.fullName && 'border-red-300')} />
          {fieldError('fullName')}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Work Email <span className="text-red-500">*</span>
          </label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} placeholder="you@company.com" className={cn(errors.email && 'border-red-300')} />
          {fieldError('email')}
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} placeholder="+1 234 567 8900" className={cn(errors.phone && 'border-red-300')} />
          {fieldError('phone')}
        </div>
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Input id="jobTitle" autoComplete="organization-title" {...register('jobTitle')} placeholder="Your job title" />
        </div>
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company <span className="text-red-500">*</span>
          </label>
          <Input id="company" autoComplete="organization" {...register('company')} placeholder="Company name" className={cn(errors.company && 'border-red-300')} />
          {fieldError('company')}
        </div>
        <div className="space-y-2">
          <label htmlFor="companyType" className="text-sm font-medium text-gray-700">
            Company Type <span className="text-red-500">*</span>
          </label>
          <select id="companyType" {...register('companyType')} className={cn(selectClass, errors.companyType && 'border-red-300')}>
            <option value="">Select company type</option>
            {COMPANY_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldError('companyType')}
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <Input id="country" autoComplete="country-name" {...register('country')} placeholder="Your country" className={cn(errors.country && 'border-red-300')} />
          {fieldError('country')}
        </div>
        <div className="space-y-2">
          <label htmlFor="website" className="text-sm font-medium text-gray-700">
            Company Website
          </label>
          <Input id="website" autoComplete="url" {...register('website')} placeholder="www.example.com" />
        </div>
      </div>

      {/* Shipping (samples only) */}
      {hasSample && (
        <>
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-[#214842]">Sample Shipping Address</h3>
            <p className="text-xs text-gray-600 mt-1">Samples ship to the country entered above.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <Input id="streetAddress" autoComplete="address-line1" {...register('streetAddress')} placeholder="Street address" className={cn(errors.streetAddress && 'border-red-300')} />
              {fieldError('streetAddress')}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="streetAddress2" className="text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <Input id="streetAddress2" autoComplete="address-line2" {...register('streetAddress2')} placeholder="Apartment, suite, unit, etc." />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <Input id="city" autoComplete="address-level2" {...register('city')} placeholder="City" className={cn(errors.city && 'border-red-300')} />
              {fieldError('city')}
            </div>
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <Input id="postalCode" autoComplete="postal-code" {...register('postalCode')} placeholder="Postal code" className={cn(errors.postalCode && 'border-red-300')} />
              {fieldError('postalCode')}
            </div>
          </div>
        </>
      )}

      {/* Order context */}
      <h3 className="text-lg font-semibold text-[#214842] pt-2">Requirements</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="timeframe" className="text-sm font-medium text-gray-700">
            Timeframe <span className="text-red-500">*</span>
          </label>
          <select id="timeframe" {...register('timeframe')} className={cn(selectClass, errors.timeframe && 'border-red-300')}>
            <option value="">Select timeframe</option>
            {TIMEFRAMES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldError('timeframe')}
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="intendedUse" className="text-sm font-medium text-gray-700">
          Intended application
        </label>
        <Textarea id="intendedUse" {...register('intendedUse')} placeholder="e.g. capsules, gummies, functional beverage, cosmetics…" className="min-h-[70px]" />
      </div>
      <div className="space-y-2">
        <label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <Textarea id="additionalInfo" {...register('additionalInfo')} placeholder="Destination port, packaging, documentation you need…" className="min-h-[80px]" />
      </div>

      {/* Honeypot: hidden from people, filled by bots */}
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register('website_hp')} />

      <div className="space-y-1">
        <div className="flex items-start gap-2">
          <input
            id="termsAccepted"
            type="checkbox"
            {...register('termsAccepted')}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#214842]"
          />
          <label htmlFor="termsAccepted" className="text-sm font-medium leading-tight">
            I agree to the{' '}
            <Link href="/terms-conditions" className="underline" target="_blank">
              terms and conditions
            </Link>{' '}
            <span className="text-red-500">*</span>
          </label>
        </div>
        {fieldError('termsAccepted')}
      </div>

      {/* Fixed action: changing it would re-render the widget and discard a solved token */}
      <Turnstile {...turnstile.widgetProps} action="quote" />
      <TurnstileStatus ready={turnstile.ready} failed={turnstile.failed} />

      <Button
        type="submit"
        className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white h-12"
        disabled={isSubmitting || !turnstile.ready}
      >
        {isSubmitting ? 'Submitting…' : !turnstile.ready ? 'Verifying…' : submitLabel}
      </Button>

      <p className="text-xs text-gray-600 text-center">
        By submitting this form, you agree to our Privacy Policy and Terms of Service. We&apos;ll use your
        information to process your request and contact you about our products.
      </p>
    </form>
  );
}
