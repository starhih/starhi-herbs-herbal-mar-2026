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
  productCategory: z.string().min(1, { message: 'Please select a product category' }),
  applicationType: z.string().min(1, { message: 'Please select an application type' }),
  productName: z.string().min(2, { message: 'Please enter the product name' }),
  standardization: z.string().min(2, { message: 'Please specify the standardization required' }),
  quantity: z.string().min(1, { message: 'Please specify the quantity' }),
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number' }),
  streetAddress: z.string().min(5, { message: 'Please enter your street address' }),
  streetAddress2: z.string().optional(),
  city: z.string().min(2, { message: 'Please enter your city' }),
  country: z.string().min(2, { message: 'Please enter your country' }),
  postalCode: z.string().min(3, { message: 'Please enter your postal code' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  companyType: z.string().optional(),
  jobTitle: z.string().min(2, { message: 'Job title must be at least 2 characters' }),
  websiteUrl: z.string().min(2, { message: 'Please enter your website URL' }),
  comments: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the Terms & Conditions' }),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestSampleForm() {
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: '',
      applicationType: '',
      productName: '',
      standardization: '',
      quantity: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      country: '',
      postalCode: '',
      companyName: '',
      companyType: '',
      jobTitle: '',
      websiteUrl: '',
      comments: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { sendSampleRequestEmail } = await import('@/lib/email-service');
      const result = await sendSampleRequestEmail({ ...data, turnstileToken });

      if (result.success) {
        analytics.trackSampleSubmit();
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
      logError(errorMessage, 'RequestSampleForm', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p>Thank you for your sample request! Our team will review your request and contact you shortly.</p>
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{submitError}</p>
        </div>
      )}

      {/* Product Information */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-[#214842]">Product Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Category */}
        <div className="space-y-2">
          <label htmlFor="productCategory" className="text-sm font-medium text-gray-700">
            Product Category <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => setValue('productCategory', value)} defaultValue="">
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

        {/* Application Type */}
        <div className="space-y-2">
          <label htmlFor="applicationType" className="text-sm font-medium text-gray-700">
            Application Type <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={(value) => setValue('applicationType', value)} defaultValue="">
            <SelectTrigger className={errors.applicationType ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select application type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dietary-supplements">Dietary Supplements</SelectItem>
              <SelectItem value="food-beverage">Food & Beverage</SelectItem>
              <SelectItem value="cosmetics">Cosmetics & Personal Care</SelectItem>
              <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
              <SelectItem value="animal-nutrition">Animal Nutrition</SelectItem>
              <SelectItem value="research">Research & Development</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.applicationType && (
            <p className="text-red-500 text-xs mt-1">{errors.applicationType.message}</p>
          )}
        </div>
      </div>

      {/* Product Name */}
      <div className="space-y-2">
        <label htmlFor="productName" className="text-sm font-medium text-gray-700">
          Which products are you interested in? <span className="text-red-500">*</span>
        </label>
        <Input
          id="productName"
          {...register('productName')}
          placeholder="Product name (e.g., Ashwagandha Extract)"
          className={errors.productName ? 'border-red-300' : ''}
        />
        {errors.productName && (
          <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>
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
          placeholder='e.g. "5% Withanolides"'
          className={errors.standardization ? 'border-red-300' : ''}
        />
        <p className="text-xs text-gray-600">Please specify the exact standardization you need for this product.</p>
        {errors.standardization && (
          <p className="text-red-500 text-xs mt-1">{errors.standardization.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
          Quantity (in gm) <span className="text-red-500">*</span>
        </label>
        <Input
          id="quantity"
          {...register('quantity')}
          placeholder="e.g., 25 gm, 50 gm"
          className={errors.quantity ? 'border-red-300' : ''}
        />
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
        )}
      </div>

      {/* Personal Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Personal Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="First name"
            className={errors.firstName ? 'border-red-300' : ''}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Last name"
            className={errors.lastName ? 'border-red-300' : ''}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
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
            Phone Number <span className="text-red-500">*</span>
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
      </div>

      {/* Shipping Address */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Shipping Address</h3>
      </div>
      <div className="space-y-6">
        {/* Street Address */}
        <div className="space-y-2">
          <label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
            Street Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="streetAddress"
            {...register('streetAddress')}
            placeholder="Street address"
            className={errors.streetAddress ? 'border-red-300' : ''}
          />
          {errors.streetAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.streetAddress.message}</p>
          )}
        </div>

        {/* Street Address 2 */}
        <div className="space-y-2">
          <label htmlFor="streetAddress2" className="text-sm font-medium text-gray-700">
            Street Address 2
          </label>
          <Input
            id="streetAddress2"
            {...register('streetAddress2')}
            placeholder="Apartment, suite, unit, etc. (optional)"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* City */}
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <Input
              id="city"
              {...register('city')}
              placeholder="City"
              className={errors.city ? 'border-red-300' : ''}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <Input
              id="country"
              {...register('country')}
              placeholder="Country"
              className={errors.country ? 'border-red-300' : ''}
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <Input
              id="postalCode"
              {...register('postalCode')}
              placeholder="Postal code"
              className={errors.postalCode ? 'border-red-300' : ''}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Company Information</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-2">
          <label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="companyName"
            {...register('companyName')}
            placeholder="Company name"
            className={errors.companyName ? 'border-red-300' : ''}
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
          )}
        </div>

        {/* Company Type */}
        <div className="space-y-2">
          <label htmlFor="companyType" className="text-sm font-medium text-gray-700">
            Company Type
          </label>
          <Select onValueChange={(value) => setValue('companyType', value)} defaultValue="">
            <SelectTrigger>
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
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
            Job Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="jobTitle"
            {...register('jobTitle')}
            placeholder="Your job title"
            className={errors.jobTitle ? 'border-red-300' : ''}
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700">
            Website URL <span className="text-red-500">*</span>
          </label>
          <Input
            id="websiteUrl"
            {...register('websiteUrl')}
            placeholder="example.com"
            className={errors.websiteUrl ? 'border-red-300' : ''}
          />
          {errors.websiteUrl && (
            <p className="text-red-500 text-xs mt-1">{errors.websiteUrl.message}</p>
          )}
        </div>
      </div>

      {/* Additional Comments */}
      <div className="mb-2 mt-8">
        <h3 className="text-lg font-semibold text-[#214842]">Additional Comments</h3>
      </div>
      <div className="space-y-2">
        <label htmlFor="comments" className="text-sm font-medium text-gray-700">
          Comments
        </label>
        <Textarea
          id="comments"
          {...register('comments')}
          placeholder="Any additional information or special requirements..."
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
            I agree to the Terms & Conditions <span className="text-red-500">*</span>
          </label>
          {errors.termsAccepted && (
            <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>
          )}
        </div>
      </div>

      {/* Cloudflare Turnstile */}
      <Turnstile
        ref={turnstileRef}
        action="sample"
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken('')}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-[#214842] hover:bg-[#1a3a35] text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Sample Request'}
      </Button>

      <p className="text-xs text-gray-600 text-center mt-4">
        By submitting this form, you agree to our Privacy Policy and Terms & Conditions. We&apos;ll respond within 24-48 hours.
      </p>
    </form>
  );
}
