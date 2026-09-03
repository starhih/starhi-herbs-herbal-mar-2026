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
import { Check } from 'lucide-react';
import Turnstile, { TurnstileRef } from '@/components/Turnstile';

const formSchema = z.object({
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
  applicationType: z.string().min(1, { message: 'Please select an application type' }),
  standardization: z.string().min(2, { message: 'Please specify the standardization required' }),
  otherProductRequirements: z.string().optional(),
  comments: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
});

type FormData = z.infer<typeof formSchema>;

interface DrawerRequestSampleFormProps {
  productName: string;
  productCategory: string;
  productStandardization?: string;
  onClose?: () => void;
}

export default function DrawerRequestSampleForm({
  productName,
  productCategory,
  productStandardization = '',
  onClose: _onClose,
}: DrawerRequestSampleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileRef>(null);

  // Sample Size selection state
  const [selectedSampleSize, setSelectedSampleSize] = useState<'50' | '100' | '250' | 'custom'>('50');
  const [customSampleSizeText, setCustomSampleSizeText] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      applicationType: '',
      standardization: productStandardization || '',
      otherProductRequirements: '',
      comments: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Formulate final quantity (Sample size)
    const finalQuantity = selectedSampleSize === 'custom' 
      ? (customSampleSizeText.trim() ? `${customSampleSizeText.trim()} g` : '50 g (Custom fallback)')
      : `${selectedSampleSize} g`;

    try {
      // Find matching category slug
      const matchedCategory = productCategories.find(
        c => c.name.toLowerCase().includes(productCategory.toLowerCase()) || 
             productCategory.toLowerCase().includes(c.name.toLowerCase())
      );
      const finalCategorySlug = matchedCategory?.slug || 'standardized-botanical-extracts';

      const submissionData = {
        productName: productName,
        productCategory: finalCategorySlug,
        standardization: data.standardization,
        quantity: finalQuantity,
        otherProductRequirements: data.otherProductRequirements || 'None',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        companyType: data.companyType || 'N/A',
        jobTitle: data.jobTitle,
        websiteUrl: data.websiteUrl,
        applicationType: data.applicationType,
        streetAddress: data.streetAddress,
        streetAddress2: data.streetAddress2 || 'N/A',
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        comments: data.comments || 'None',
        turnstileToken,
      };

      const { sendSampleRequestEmail } = await import('@/lib/email-service');
      const result = await sendSampleRequestEmail(submissionData as any);

      if (result.success) {
        analytics.trackSampleSubmit();
        setSubmitSuccess(true);
        reset();
        turnstileRef.current?.reset();
        setTurnstileToken('');
        setSelectedSampleSize('50');
        setCustomSampleSizeText('');
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
      logError(errorMessage, 'DrawerRequestSampleForm', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-800 pb-10">
      {submitSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center space-y-4 my-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <Check size={32} />
          </div>
          <h4 className="text-xl font-bold">Sample Requested!</h4>
          <p className="text-sm">
            Thank you! Your formulation sample request for <strong>{productName}</strong> has been received successfully. Our logistics team will review your application and ship out the testing sample package.
          </p>
          <p className="text-xs text-gray-400 mt-2">Closing form shortly...</p>
        </div>
      ) : (
        <>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <p>{submitError}</p>
            </div>
          )}

          {/* Product Specifications Section */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-[#214842] uppercase tracking-wider">Sample Specifications</h4>

            {/* Standardization Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="standardization" className="text-xs font-semibold text-gray-600 uppercase">Standardization Required *</label>
              <Input
                id="standardization"
                {...register('standardization')}
                placeholder="e.g., 20% L-DOPA / 10% Gingerols"
                className={`h-10 text-xs bg-white focus-visible:ring-[#214842] ${errors.standardization ? 'border-red-300' : 'border-gray-200'}`}
              />
              {errors.standardization && <p className="text-red-500 text-[10px]">{errors.standardization.message}</p>}
            </div>

            {/* Other Product Requirements Field */}
            <div className="space-y-1.5">
              <label htmlFor="otherProductRequirements" className="text-xs font-semibold text-gray-600 uppercase">Do you have any other product requirements?</label>
              <Textarea
                id="otherProductRequirements"
                {...register('otherProductRequirements')}
                placeholder="e.g., Organic, specific certifications (Halal, Kosher), special particle size, etc."
                rows={3}
                className="text-xs bg-white resize-none border-gray-200 focus-visible:ring-[#214842]"
              />
            </div>

            {/* Sample Size Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="text-xs font-semibold text-gray-600 uppercase">Sample Size Required *</label>
              <div className="grid grid-cols-4 gap-2">
                {['50', '100', '250'].map((sizeVal) => {
                  const isSelected = selectedSampleSize === sizeVal;
                  return (
                    <button
                      key={sizeVal}
                      type="button"
                      onClick={() => setSelectedSampleSize(sizeVal as any)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'border-[#214842] bg-[#214842] text-white shadow-sm font-bold' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {sizeVal} g
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedSampleSize('custom')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                    selectedSampleSize === 'custom'
                      ? 'border-[#214842] bg-[#214842] text-white shadow-sm font-bold' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  Custom
                </button>
              </div>

              {selectedSampleSize === 'custom' && (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter custom size"
                    value={customSampleSizeText}
                    onChange={(e) => setCustomSampleSizeText(e.target.value)}
                    className="h-10 text-xs flex-1 bg-white focus-visible:ring-[#214842]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">g</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#214842] uppercase tracking-wider border-b pb-1">Your Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="firstName" className="text-xs font-semibold text-gray-600">First Name *</label>
                <Input id="firstName" {...register('firstName')} placeholder="First name" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.firstName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.firstName && <p className="text-red-500 text-[10px]">{errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="lastName" className="text-xs font-semibold text-gray-600">Last Name *</label>
                <Input id="lastName" {...register('lastName')} placeholder="Last name" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.lastName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.lastName && <p className="text-red-500 text-[10px]">{errors.lastName.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="email" className="text-xs font-semibold text-gray-600">Business Email *</label>
                <Input id="email" type="email" {...register('email')} placeholder="your@company.com" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.email ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.email && <p className="text-red-500 text-[10px]">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="phone" className="text-xs font-semibold text-gray-600">Phone Number *</label>
                <Input id="phone" {...register('phone')} placeholder="Include country code" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.phone ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.phone && <p className="text-red-500 text-[10px]">{errors.phone.message}</p>}
              </div>

              {/* Company */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="companyName" className="text-xs font-semibold text-gray-600">Company Name *</label>
                <Input id="companyName" {...register('companyName')} placeholder="Company name" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.companyName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.companyName && <p className="text-red-500 text-[10px]">{errors.companyName.message}</p>}
              </div>

              {/* Company Type */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="companyType" className="text-xs font-semibold text-gray-600">Company Type</label>
                <Select onValueChange={(value) => setValue('companyType', value)}>
                  <SelectTrigger className="h-10 text-xs focus-visible:ring-[#214842] border-gray-200">
                    <SelectValue placeholder="Select type" />
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
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="jobTitle" className="text-xs font-semibold text-gray-600">Job Title *</label>
                <Input id="jobTitle" {...register('jobTitle')} placeholder="e.g., Formulation Scientist" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.jobTitle ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.jobTitle && <p className="text-red-500 text-[10px]">{errors.jobTitle.message}</p>}
              </div>

              {/* Website URL */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="websiteUrl" className="text-xs font-semibold text-gray-600">Company Website URL *</label>
                <Input id="websiteUrl" {...register('websiteUrl')} placeholder="e.g., www.company.com" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.websiteUrl ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.websiteUrl && <p className="text-red-500 text-[10px]">{errors.websiteUrl.message}</p>}
              </div>

              {/* Application Type */}
              <div className="space-y-1.5 col-span-2">
                <label htmlFor="applicationType" className="text-xs font-semibold text-gray-600">Application Area *</label>
                <Select onValueChange={(value) => setValue('applicationType', value)}>
                  <SelectTrigger className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.applicationType ? 'border-red-300' : 'border-gray-200'}`}>
                    <SelectValue placeholder="Select primary application" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dietary-supplements">Dietary Supplements</SelectItem>
                    <SelectItem value="functional-food">Functional Food & Beverages</SelectItem>
                    <SelectItem value="cosmetics">Cosmetics & Personal Care</SelectItem>
                    <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="animal-nutrition">Animal Nutrition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.applicationType && <p className="text-red-500 text-[10px]">{errors.applicationType.message}</p>}
              </div>
            </div>

            {/* Shipping Address */}
            <h4 className="text-sm font-bold text-[#214842] uppercase tracking-wider border-b pb-1 pt-2">Shipping Details</h4>

            <div className="space-y-3">
              {/* Street Address */}
              <div className="space-y-1.5">
                <label htmlFor="streetAddress" className="text-xs font-semibold text-gray-600">Street Address *</label>
                <Input id="streetAddress" {...register('streetAddress')} placeholder="Corporate R&D facility address" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.streetAddress ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.streetAddress && <p className="text-red-500 text-[10px]">{errors.streetAddress.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Input id="streetAddress2" {...register('streetAddress2')} placeholder="Suite, Unit, Building, etc. (Optional)" className="h-10 text-xs border-gray-200 focus-visible:ring-[#214842]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* City */}
                <div className="space-y-1.5">
                  <label htmlFor="city" className="text-xs font-semibold text-gray-600">City *</label>
                  <Input id="city" {...register('city')} placeholder="City" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.city ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.city && <p className="text-red-500 text-[10px]">{errors.city.message}</p>}
                </div>

                {/* Postal Code */}
                <div className="space-y-1.5">
                  <label htmlFor="postalCode" className="text-xs font-semibold text-gray-600">Postal / ZIP Code *</label>
                  <Input id="postalCode" {...register('postalCode')} placeholder="Postal code" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.postalCode ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.postalCode && <p className="text-red-500 text-[10px]">{errors.postalCode.message}</p>}
                </div>

                {/* Country */}
                <div className="space-y-1.5 col-span-2">
                  <label htmlFor="country" className="text-xs font-semibold text-gray-600">Country *</label>
                  <Input id="country" {...register('country')} placeholder="Destination country" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.country ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.country && <p className="text-red-500 text-[10px]">{errors.country.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label htmlFor="comments" className="text-xs font-semibold text-gray-600">Logistics Instructions or Product Notes</label>
              <Textarea id="comments" {...register('comments')} placeholder="Any specific documentation requirements (e.g., COA, MSDS, Allergen Statement)..." rows={3} className="text-xs resize-none border-gray-200 focus-visible:ring-[#214842]" />
            </div>

            {/* Terms and conditions */}
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Checkbox id="termsAccepted" onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)} className="mt-1" />
                <label htmlFor="termsAccepted" className="text-[10px] leading-tight text-gray-500 cursor-pointer">
                  I consent to Star Hi Herbs storing and processing my corporate details to coordinate dispatch of wholesale ingredients. *
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-[10px]">{errors.termsAccepted.message}</p>}
            </div>
          </div>

          {/* Cloudflare Turnstile */}
          <Turnstile
            ref={turnstileRef}
            action="sample"
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken('')}
            size="flexible"
          />

          {/* Submission Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EFC368] text-[#214842] hover:bg-[#214842] hover:text-white py-6 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? 'Sending Request...' : 'Submit Sample Request'}
          </Button>
        </>
      )}
    </form>
  );
}
