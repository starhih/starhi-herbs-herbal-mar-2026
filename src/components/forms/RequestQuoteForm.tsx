'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { navCategories as productCategories } from '@/data/nav-categories';
import { handleError, logError } from '@/utils/error-handling';
import { analytics } from '@/lib/analytics';
import Turnstile, { TurnstileRef } from '@/components/Turnstile';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number' }),
  jobTitle: z.string().optional(),
  companyType: z.string().min(1, { message: 'Please select a company type' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  country: z.string().min(2, { message: 'Please enter your country' }),
  productCategory: z.string().min(1, { message: 'Please select a product category' }),
  quantity: z.string().min(1, { message: 'Please specify the quantity needed' }),
  productDetails: z.string().min(2, { message: 'Please provide product details' }),
  standardization: z.string().min(2, { message: 'Please specify the standardization required' }),
  timeframe: z.string().min(1, { message: 'Please specify your timeframe' }),
  intendedUse: z.string().optional(),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestQuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileRef>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      jobTitle: '',
      companyType: '',
      company: '',
      country: '',
      productCategory: '',
      quantity: '',
      productDetails: '',
      standardization: '',
      timeframe: '',
      intendedUse: '',
      additionalInfo: '',
      termsAccepted: false,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Import the email service dynamically to avoid SSR issues
      const { sendQuoteRequestEmail } = await import('@/lib/email-service');

      // Send the email with Turnstile token
      const result = await sendQuoteRequestEmail({ ...data, turnstileToken });

      if (result.success) {
        // Success
        analytics.trackQuoteSubmit();
        setSubmitSuccess(true);
        reset();
        turnstileRef.current?.reset();
        setTurnstileToken('');

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        turnstileRef.current?.reset();
        setTurnstileToken('');
        throw new Error(result.error || 'Failed to submit the form');
      }
    } catch (error) {
      turnstileRef.current?.reset();
      setTurnstileToken('');
      const errorMessage = handleError(error, 'Failed to submit the form. Please try again.');
      setSubmitError(errorMessage);
      logError(errorMessage, 'RequestQuoteForm', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p>Thank you for your request! Our team will contact you shortly with a customized quote.</p>
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{submitError}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-[#214842]">Personal Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="Your full name"
            className={errors.fullName ? 'border-red-300' : ''}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your@email.com"
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+1 234 567 8900"
            className={errors.phone ? 'border-red-300' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            placeholder="Your job title"
          />
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Company Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Type */}
        <div className="space-y-2">
          <label htmlFor="companyType" className="text-sm font-medium text-gray-700">
            Company Type <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('companyType', value)}
            defaultValue=""
          >
            <SelectTrigger className={errors.companyType ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select company type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manufacturer">Manufacturer</SelectItem>
              <SelectItem value="distributor">Distributor</SelectItem>
              <SelectItem value="retailer">Retailer</SelectItem>
              <SelectItem value="brand-owner">Brand Owner</SelectItem>
              <SelectItem value="contract-manufacturer">Contract Manufacturer</SelectItem>
              <SelectItem value="research">Research / Academic</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.companyType && (
            <p className="text-red-500 text-xs mt-1">{errors.companyType.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-gray-700">
            Company <span className="text-red-500">*</span>
          </label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Company name"
            className={errors.company ? 'border-red-300' : ''}
          />
          {errors.company && (
            <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <Input
            id="country"
            {...register('country')}
            placeholder="Your country"
            className={errors.country ? 'border-red-300' : ''}
          />
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Product Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Category */}
        <div className="space-y-2">
          <label htmlFor="productCategory" className="text-sm font-medium text-gray-700">
            Product Category <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('productCategory', value)}
            defaultValue=""
          >
            <SelectTrigger className={errors.productCategory ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select product category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.productCategory && (
            <p className="text-red-500 text-xs mt-1">{errors.productCategory.message}</p>
          )}
        </div>

        {/* Estimated Quantity */}
        <div className="space-y-2">
          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
            Estimated Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            id="quantity"
            {...register('quantity')}
            placeholder="e.g., 100 kg/month"
            className={errors.quantity ? 'border-red-300' : ''}
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-2">
        <label htmlFor="productDetails" className="text-sm font-medium text-gray-700">
          Product Details <span className="text-red-500">*</span>
        </label>
        <Input
          id="productDetails"
          {...register('productDetails')}
          placeholder="e.g., Ashwagandha Extract"
          className={errors.productDetails ? 'border-red-300' : ''}
        />
        {errors.productDetails && (
          <p className="text-red-500 text-xs mt-1">{errors.productDetails.message}</p>
        )}
      </div>

      {/* Standardization */}
      <div className="space-y-2">
        <label htmlFor="standardization" className="text-sm font-medium text-gray-700">
          Standardization <span className="text-red-500">*</span>
        </label>
        <Input
          id="standardization"
          {...register('standardization')}
          placeholder='e.g. "20% Polyphenols"'
          className={errors.standardization ? 'border-red-300' : ''}
        />
        <p className="text-xs text-gray-600">Please specify the exact standardization you need for this product.</p>
        {errors.standardization && (
          <p className="text-red-500 text-xs mt-1">{errors.standardization.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeframe */}
        <div className="space-y-2">
          <label htmlFor="timeframe" className="text-sm font-medium text-gray-700">
            Timeframe <span className="text-red-500">*</span>
          </label>
          <Select
            onValueChange={(value) => setValue('timeframe', value)}
            defaultValue=""
          >
            <SelectTrigger className={errors.timeframe ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
              <SelectItem value="short">Short-term (1-2 months)</SelectItem>
              <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
              <SelectItem value="long">Long-term (6+ months)</SelectItem>
            </SelectContent>
          </Select>
          {errors.timeframe && (
            <p className="text-red-500 text-xs mt-1">{errors.timeframe.message}</p>
          )}
        </div>
      </div>

      {/* Intended Use */}
      <div className="space-y-2">
        <label htmlFor="intendedUse" className="text-sm font-medium text-gray-700">
          How do you plan to use this product?
        </label>
        <Textarea
          id="intendedUse"
          {...register('intendedUse')}
          placeholder="Describe your intended use for this product..."
          className="min-h-[80px]"
        />
      </div>

      {/* Additional Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Additional Information</h3>
      </div>
      <div className="space-y-2">
        <label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <Textarea
          id="additionalInfo"
          {...register('additionalInfo')}
          placeholder="Any other details or requirements you'd like to share..."
          className="min-h-[100px]"
        />
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="termsAccepted"
          onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)}
          className={errors.termsAccepted ? 'border-red-300' : ''}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="termsAccepted"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions <span className="text-red-500">*</span>
          </label>
          {errors.termsAccepted && (
            <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>
          )}
        </div>
      </div>

      {/* Cloudflare Turnstile */}
      <Turnstile
        ref={turnstileRef}
        action="quote"
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </Button>

      <p className="text-xs text-gray-600 text-center mt-4">
        By submitting this form, you agree to our Privacy Policy and Terms of Service.
        We&apos;ll use your information to process your request and contact you about our products.
      </p>
    </form>
  );
}
