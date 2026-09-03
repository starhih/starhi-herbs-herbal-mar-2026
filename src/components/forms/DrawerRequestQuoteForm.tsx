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
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number' }),
  jobTitle: z.string().optional(),
  companyType: z.string().min(1, { message: 'Please select a company type' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  country: z.string().min(2, { message: 'Please enter your country' }),
  timeframe: z.string().min(1, { message: 'Please specify your timeframe' }),
  standardization: z.string().min(2, { message: 'Please specify the standardization required' }),
  otherProductRequirements: z.string().optional(),
  intendedUse: z.string().optional(),
  additionalInfo: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
});

type FormData = z.infer<typeof formSchema>;

interface DrawerRequestQuoteFormProps {
  productName: string;
  productCategory: string;
  productStandardization?: string;
  onClose?: () => void;
}

export default function DrawerRequestQuoteForm({
  productName,
  productCategory,
  productStandardization = '',
  onClose: _onClose,
}: DrawerRequestQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<TurnstileRef>(null);

  // MOQ Selection state
  const [selectedMoq, setSelectedMoq] = useState<'25' | '50' | '100' | 'custom'>('25');
  const [customMoqText, setCustomMoqText] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      jobTitle: '',
      companyType: '',
      company: '',
      country: '',
      timeframe: '',
      standardization: productStandardization || '',
      otherProductRequirements: '',
      intendedUse: '',
      additionalInfo: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Formulate final quantity (MOQ)
    const finalQuantity = selectedMoq === 'custom' 
      ? (customMoqText.trim() ? `${customMoqText.trim()} kg` : '25 kg (Custom fallback)')
      : `${selectedMoq} kg`;

    try {
      // Find matching category slug
      const matchedCategory = productCategories.find(
        c => c.name.toLowerCase().includes(productCategory.toLowerCase()) || 
             productCategory.toLowerCase().includes(c.name.toLowerCase())
      );
      const finalCategorySlug = matchedCategory?.slug || 'standardized-botanical-extracts';

      const submissionData = {
        productDetails: productName,
        productCategory: finalCategorySlug,
        standardization: data.standardization,
        quantity: finalQuantity,
        otherProductRequirements: data.otherProductRequirements || 'None',
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        jobTitle: data.jobTitle || 'N/A',
        company: data.company,
        companyType: data.companyType,
        country: data.country,
        timeframe: data.timeframe,
        intendedUse: data.intendedUse || 'N/A',
        additionalInfo: data.additionalInfo || 'None',
        turnstileToken,
      };

      const { sendQuoteRequestEmail } = await import('@/lib/email-service');
      const result = await sendQuoteRequestEmail(submissionData as any);

      if (result.success) {
        analytics.trackQuoteSubmit();
        setSubmitSuccess(true);
        reset();
        turnstileRef.current?.reset();
        setTurnstileToken('');
        setSelectedMoq('25');
        setCustomMoqText('');
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
      logError(errorMessage, 'DrawerRequestQuoteForm', error);
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
          <h4 className="text-xl font-bold">Request Submitted!</h4>
          <p className="text-sm">
            Thank you! Your quote request for <strong>{productName}</strong> has been received successfully. Our sales team will get back to you with pricing details shortly.
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
            <h4 className="text-sm font-bold text-[#214842] uppercase tracking-wider">Product Specifications</h4>

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

            {/* MOQ Selector */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <label className="text-xs font-semibold text-gray-600 uppercase">Target Quantity (MOQ) *</label>
              <div className="grid grid-cols-4 gap-2">
                {['25', '50', '100'].map((moqVal) => {
                  const isSelected = selectedMoq === moqVal;
                  return (
                    <button
                      key={moqVal}
                      type="button"
                      onClick={() => setSelectedMoq(moqVal as any)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'border-[#214842] bg-[#214842] text-white shadow-sm font-bold' 
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {moqVal} kg
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedMoq('custom')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                    selectedMoq === 'custom'
                      ? 'border-[#214842] bg-[#214842] text-white shadow-sm font-bold' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  Custom
                </button>
              </div>

              {selectedMoq === 'custom' && (
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Enter custom quantity"
                    value={customMoqText}
                    onChange={(e) => setCustomMoqText(e.target.value)}
                    className="h-10 text-xs flex-1 bg-white focus-visible:ring-[#214842]"
                    required
                  />
                  <span className="text-xs font-semibold text-gray-500">kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#214842] uppercase tracking-wider border-b pb-1">Your Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="fullName" className="text-xs font-semibold text-gray-600">Full Name *</label>
                <Input id="fullName" {...register('fullName')} placeholder="Your name" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.fullName ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.fullName && <p className="text-red-500 text-[10px]">{errors.fullName.message}</p>}
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

              {/* Job Title */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="jobTitle" className="text-xs font-semibold text-gray-600">Job Title</label>
                <Input id="jobTitle" {...register('jobTitle')} placeholder="e.g., Procurement Manager" className="h-10 text-xs border-gray-200 focus-visible:ring-[#214842]" />
              </div>

              {/* Company */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="company" className="text-xs font-semibold text-gray-600">Company Name *</label>
                <Input id="company" {...register('company')} placeholder="Company name" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.company ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.company && <p className="text-red-500 text-[10px]">{errors.company.message}</p>}
              </div>

              {/* Company Type */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="companyType" className="text-xs font-semibold text-gray-600">Company Type *</label>
                <Select onValueChange={(value) => setValue('companyType', value)}>
                  <SelectTrigger className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.companyType ? 'border-red-300' : 'border-gray-200'}`}>
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
                {errors.companyType && <p className="text-red-500 text-[10px]">{errors.companyType.message}</p>}
              </div>

              {/* Country */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="country" className="text-xs font-semibold text-gray-600">Country *</label>
                <Input id="country" {...register('country')} placeholder="Destination country" className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.country ? 'border-red-300' : 'border-gray-200'}`} />
                {errors.country && <p className="text-red-500 text-[10px]">{errors.country.message}</p>}
              </div>

              {/* Timeframe */}
              <div className="space-y-1.5 col-span-2 sm:col-span-1">
                <label htmlFor="timeframe" className="text-xs font-semibold text-gray-600">Purchase Timeframe *</label>
                <Select onValueChange={(value) => setValue('timeframe', value)}>
                  <SelectTrigger className={`h-10 text-xs focus-visible:ring-[#214842] ${errors.timeframe ? 'border-red-300' : 'border-gray-200'}`}>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (Within 1 month)</SelectItem>
                    <SelectItem value="1-3-months">1 to 3 months</SelectItem>
                    <SelectItem value="3-6-months">3 to 6 months</SelectItem>
                    <SelectItem value="planning">Research / Future planning</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeframe && <p className="text-red-500 text-[10px]">{errors.timeframe.message}</p>}
              </div>
            </div>

            {/* Additional details (intended use / comments) */}
            <div className="space-y-1.5">
              <label htmlFor="intendedUse" className="text-xs font-semibold text-gray-600">Intended Application</label>
              <Input id="intendedUse" {...register('intendedUse')} placeholder="e.g., Dietary Supplement, Beverage, Cosmetic" className="h-10 text-xs border-gray-200 focus-visible:ring-[#214842]" />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="additionalInfo" className="text-xs font-semibold text-gray-600">Additional Instructions or Requests</label>
              <Textarea id="additionalInfo" {...register('additionalInfo')} placeholder="Any specific requirements, certifications needed, packaging demands..." rows={3} className="text-xs resize-none border-gray-200 focus-visible:ring-[#214842]" />
            </div>

            {/* Terms and conditions */}
            <div className="space-y-1">
              <div className="flex items-start space-x-2">
                <Checkbox id="termsAccepted" onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)} className="mt-1" />
                <label htmlFor="termsAccepted" className="text-[10px] leading-tight text-gray-500 cursor-pointer">
                  I consent to Star Hi Herbs storing and processing my corporate details to provide the requested bulk wholesale quote. *
                </label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-[10px]">{errors.termsAccepted.message}</p>}
            </div>
          </div>

          {/* Cloudflare Turnstile */}
          <Turnstile
            ref={turnstileRef}
            action="quote"
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
            {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'}
          </Button>
        </>
      )}
    </form>
  );
}
